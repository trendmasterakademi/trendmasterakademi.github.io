// Ana sayfa arka plan fotoğraflarını Unsplash'in görsel sunucusundan indirir ve kaydını yazar.
// Kural (Adım 97): kalite SABİTTİR (AVIF 50, WebP 70), boyut için düşürülmez. Kırpım fotoğrafın özgün
// çözünürlüğünü aşmaz (büyütülmüş kırpım indirilmez). Her dosyanın indirildiği tam adres kayda yazılır,
// böylece her dosya aynı adresten yeniden indirilip bayt bayt doğrulanabilir.
// Çalıştırma (v2-draft içinde):  node scripts/download-arka-plan.mjs
import fs from 'fs';
import path from 'path';

const KALITE = { avif: 50, webp: 70 };
const YATAY = [[1280, 720], [1920, 1080], [2560, 1440]]; // 16:9
const DIKEY = [[720, 1600], [1080, 2400], [1440, 3200]]; // 9:20 — telefon ekran oranı

export const SAHNELER = [
  { sahne: 1, kaynak: 'https://unsplash.com/photos/cable-network-M5tzZtFCOfs', fotografci: 'Taylor Vick', cdn: 'photo-1558494949-ef010cbdcc31', lisans: 'Unsplash License' },
  { sahne: 2, kaynak: 'https://unsplash.com/photos/matrix-movie-still-iar-afB0QQw', fotografci: 'Markus Spiske', cdn: 'photo-1526374965328-7f61d4dc18c5', lisans: 'Unsplash License' },
  { sahne: 3, kaynak: 'https://unsplash.com/photos/blue-utp-cord-40XgDxBfYXM', fotografci: 'Jordan Harrison', cdn: 'photo-1544197150-b99a580bb7a8', lisans: 'Unsplash License' },
  { sahne: 4, kaynak: 'https://unsplash.com/photos/vehicles-near-buildings-at-night-time-VmX3vmBecFE', fotografci: 'Max Bender', cdn: 'photo-1519501025264-65ba15a82390', lisans: 'Unsplash License' },
];

const kok = process.cwd();
const hedef = path.join(kok, 'public', 'arka-plan');
const veri = path.join(kok, 'src', 'data', 'arkaPlan.json');

// Görsel boyutunu dosyanın içinden oku: WebP (VP8 / VP8L / VP8X) ve AVIF (ispe kutusu)
const boyut = (b) => {
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const tur = b.toString('ascii', 12, 16);
    if (tur === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (tur === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (tur === 'VP8L') { const v = b.readUInt32LE(21); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 }; }
  }
  const i = b.indexOf(Buffer.from('ispe'));
  if (i > 0) return { w: b.readUInt32BE(i + 8), h: b.readUInt32BE(i + 12) };
  return { w: 0, h: 0 };
};

const dur = (mesaj) => { console.error(`[İNDİRME DUR] ${mesaj}`); process.exit(1); };

// Özgünü aşmayan ölçüler; en büyük standart ölçü sığmıyorsa aynı oranda, özgünün izin verdiği en büyük kırpım eklenir
const olculer = (liste, [ow, oh], W, H) => {
  const sigar = liste.filter(([w, h]) => w <= W && h <= H);
  if (sigar.length < liste.length) {
    const w = Math.floor(Math.min(W, (H * ow) / oh));
    const h = Math.floor((w * oh) / ow);
    if (w > (sigar.length ? sigar[sigar.length - 1][0] : 0)) sigar.push([w, h]);
  }
  return sigar;
};

async function main() {
  fs.mkdirSync(hedef, { recursive: true });
  const bugun = new Date().toISOString().slice(0, 10);
  const kayit = [];
  const yazilan = new Set();

  for (const s of SAHNELER) {
    const meta = await fetch(`https://images.unsplash.com/${s.cdn}?fm=json`);
    if (!meta.ok) dur(`sahne ${s.sahne}: özgün boyut okunamadı (HTTP ${meta.status})`);
    const j = await meta.json();
    const W = j.PixelWidth, H = j.PixelHeight;
    if (!W || !H) dur(`sahne ${s.sahne}: özgün boyut yok`);
    console.log(`\n--- Sahne ${s.sahne} (${s.cdn}) özgün ${W}×${H} ---`);

    const dosyalar = [];
    const isler = [
      ...olculer(YATAY, [16, 9], W, H).map(([w, h]) => ({ yon: 'yatay', w, h })),
      ...olculer(DIKEY, [9, 20], W, H).map(([w, h]) => ({ yon: 'dikey', w, h })),
    ];
    for (const is of isler) {
      for (const bicim of ['avif', 'webp']) {
        const q = KALITE[bicim];
        const ad = `sahne-${s.sahne}-${is.yon === 'dikey' ? 'dikey-' : ''}${is.w}.${bicim}`;
        const url = `https://images.unsplash.com/${s.cdn}?fit=crop&crop=entropy&w=${is.w}&h=${is.h}&q=${q}&fm=${bicim}`;
        const r = await fetch(url);
        if (!r.ok) dur(`${ad}: HTTP ${r.status}`);
        const b = Buffer.from(await r.arrayBuffer());
        const d = boyut(b);
        if (d.w !== is.w || d.h !== is.h) dur(`${ad}: istenen ${is.w}×${is.h}, gelen ${d.w}×${d.h}`);
        fs.writeFileSync(path.join(hedef, ad), b);
        yazilan.add(ad);
        dosyalar.push({ ad, yon: is.yon, bicim, w: is.w, h: is.h, q, url });
        console.log(`  ${ad.padEnd(26)} ${is.w}×${is.h} q=${q} ${(b.length / 1024).toFixed(1)} KB`);
      }
    }
    kayit.push({ ...s, indirilme: bugun, ozgun: { w: W, h: H }, dosyalar });
  }

  // Kayıtta olmayan eski görseller silinir
  for (const f of fs.readdirSync(hedef)) {
    if (/\.(avif|webp)$/i.test(f) && !yazilan.has(f)) { fs.rmSync(path.join(hedef, f)); console.log(`  silindi (kayıtta yok): ${f}`); }
  }

  const json = JSON.stringify(kayit, null, 2) + '\n';
  fs.writeFileSync(path.join(hedef, 'kaynaklar.json'), json, 'utf8');
  fs.writeFileSync(veri, json, 'utf8');
  console.log(`\n[KAYNAKLAR] public/arka-plan/kaynaklar.json ve src/data/arkaPlan.json yazıldı (${yazilan.size} dosya).`);
}

main().catch((e) => dur(e.message));
