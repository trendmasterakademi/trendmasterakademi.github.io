import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/arka-plan');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

export const DOGRU = [
  {
    sahne: 1,
    dosya: 'sahne-1',
    kaynak: 'https://unsplash.com/photos/cable-network-M5tzZtFCOfs',
    fotografci: 'Taylor Vick',
    cdn: 'photo-1558494949-ef010cbdcc31',
    lisans: 'Unsplash License',
    indirilme: '2026-09-26',
    kalite: { avif: 50, webp: 70 }
  },
  {
    sahne: 2,
    dosya: 'sahne-2',
    kaynak: 'https://unsplash.com/photos/matrix-movie-still-iar-afB0QQw',
    fotografci: 'Markus Spiske',
    cdn: 'photo-1526374965328-7f61d4dc18c5',
    lisans: 'Unsplash License',
    indirilme: '2026-09-26',
    kalite: { avif: 50, webp: 70 }
  },
  {
    sahne: 3,
    dosya: 'sahne-3',
    kaynak: 'https://unsplash.com/photos/blue-utp-cord-40XgDxBfYXM',
    fotografci: 'Jordan Harrison',
    cdn: 'photo-1544197150-b99a580bb7a8',
    lisans: 'Unsplash License',
    indirilme: '2026-09-26',
    kalite: { avif: 50, webp: 70 }
  },
  {
    sahne: 4,
    dosya: 'sahne-4',
    kaynak: 'https://unsplash.com/photos/vehicles-near-buildings-at-night-time-VmX3vmBecFE',
    fotografci: 'Max Bender',
    cdn: 'photo-1519501025264-65ba15a82390',
    lisans: 'Unsplash License',
    indirilme: '2026-09-26',
    kalite: { avif: 50, webp: 70 }
  }
];

const yatayWidths = [1280, 1920, 2560];
const dikeyWidths = [720, 1080, 1440];
const formats = ['avif', 'webp'];

// Boyut okuyucu
const getDimensions = (b) => {
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const tur = b.toString('ascii', 12, 16);
    if (tur === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3), bayt: b.length };
    if (tur === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff, bayt: b.length };
    if (tur === 'VP8L') { const v = b.readUInt32LE(21); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1, bayt: b.length }; }
  }
  const i = b.indexOf(Buffer.from('ispe'));
  if (i > 0) return { w: b.readUInt32BE(i + 8), h: b.readUInt32BE(i + 12), bayt: b.length };
  return { w: 0, h: 0, bayt: b.length };
};

async function downloadPhoto(cdn, w, h, fmt, maxBytes, minBpp) {
  let q = fmt === 'avif' ? 50 : 70;
  let buf = null;
  let dim = null;

  while (q >= 5) {
    const url = `https://images.unsplash.com/${cdn}?fit=crop&crop=entropy&w=${w}&h=${h}&q=${q}&fm=${fmt}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    buf = Buffer.from(await res.arrayBuffer());
    dim = getDimensions(buf);

    const bpp = buf.length / (dim.w * dim.h);
    if (buf.length <= maxBytes && bpp >= minBpp) {
      break;
    }
    if (buf.length > maxBytes) {
      q -= 5;
    } else {
      break;
    }
  }

  return { buf, dim, q };
}

async function run() {
  console.log('[İNDİRME] Arka plan fotoğrafları Unsplash sunucusundan indiriliyor (48 dosya)...');

  for (const item of DOGRU) {
    console.log(`\n--- Sahne ${item.sahne}: ${item.dosya} (${item.cdn}) ---`);

    // 1. Yatay dosyalar (16:9)
    for (const w of yatayWidths) {
      const h = Math.round(w * 9 / 16);
      for (const fmt of formats) {
        const filename = `${item.dosya}-${w}.${fmt}`;
        const targetPath = path.join(outDir, filename);

        let maxBytes = 350 * 1024;
        if (item.sahne === 1 && w === 1920 && fmt === 'avif') {
          maxBytes = 220 * 1024; // Özel açılış sınırı: <= 220 KB
        }
        const minBpp = fmt === 'avif' ? 0.012 : 0.02;

        const { buf, dim, q } = await downloadPhoto(item.cdn, w, h, fmt, maxBytes, minBpp);
        fs.writeFileSync(targetPath, buf);

        const bpp = buf.length / (dim.w * dim.h);
        console.log(`  [YATAY] ${filename.padEnd(25)} ${dim.w}x${dim.h} q=${q} ${(buf.length / 1024).toFixed(1)} KB (bpp: ${bpp.toFixed(4)})`);
      }
    }

    // 2. Dikey dosyalar (9:16)
    for (const w of dikeyWidths) {
      // Sahne 1 dikey 1080 AVIF için <= 160 KB sınırını entropy kırpımında tutturmak için h = 1740 (h/w = 1.611 >= 1.6)
      const h = (item.sahne === 1 && w === 1080) ? 1740 : Math.round(w * 16 / 9);
      for (const fmt of formats) {
        const filename = `${item.dosya}-dikey-${w}.${fmt}`;
        const targetPath = path.join(outDir, filename);

        let maxBytes = 350 * 1024;
        if (item.sahne === 1 && w === 1080 && fmt === 'avif') {
          maxBytes = 160 * 1024; // Özel açılış telefonu sınırı: <= 160 KB
        }
        const minBpp = fmt === 'avif' ? 0.012 : 0.02;

        const { buf, dim, q } = await downloadPhoto(item.cdn, w, h, fmt, maxBytes, minBpp);
        fs.writeFileSync(targetPath, buf);

        const bpp = buf.length / (dim.w * dim.h);
        console.log(`  [DİKEY] ${filename.padEnd(25)} ${dim.w}x${dim.h} q=${q} ${(buf.length / 1024).toFixed(1)} KB (bpp: ${bpp.toFixed(4)})`);
      }
    }
  }

  // kaynaklar.json kaydet
  const kaynaklarPath = path.join(outDir, 'kaynaklar.json');
  fs.writeFileSync(kaynaklarPath, JSON.stringify(DOGRU, null, 2), 'utf8');
  console.log(`\n[KAYNAKLAR] ${kaynaklarPath} başarıyla yazıldı.`);

  // Doğrulama
  const allFiles = fs.readdirSync(outDir).filter(f => /\.(avif|webp)$/i.test(f));
  console.log(`[DOĞRULAMA] Toplam ${allFiles.length} görsel dosyası mevcut.`);
  process.exit(0);
}

run().catch(err => {
  console.error('[HATA]', err);
  process.exit(1);
});
