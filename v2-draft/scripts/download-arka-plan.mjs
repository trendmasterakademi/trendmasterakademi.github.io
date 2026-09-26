import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/arka-plan');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const photos = [
  {
    sahne: 1,
    dosya: 'sahne-1',
    kaynak: 'https://unsplash.com/photos/blue-and-red-lights-M5tzZtFCOfs',
    fotografci: 'Taylor Vick',
    lisans: 'Unsplash License',
    indirilme: '2026-09-26',
    id: 'photo-1558494949-ef010cbdcc31'
  },
  {
    sahne: 2,
    dosya: 'sahne-2',
    kaynak: 'https://unsplash.com/photos/computer-monitor-software-code-w7ZyuGYNpRQ',
    fotografci: 'Kevin Ku',
    lisans: 'Unsplash License',
    indirilme: '2026-09-26',
    id: 'photo-1526374965328-7f61d4dc18c5'
  },
  {
    sahne: 3,
    dosya: 'sahne-3',
    kaynak: 'https://unsplash.com/photos/blue-and-pink-led-light-jLwVAUtLOAQ',
    fotografci: 'Denny Müller',
    lisans: 'Unsplash License',
    indirilme: '2026-09-26',
    id: 'photo-1544197150-b99a580bb7a8'
  },
  {
    sahne: 4,
    dosya: 'sahne-4',
    kaynak: 'https://unsplash.com/photos/aerial-view-of-city-during-night-time-IayKLkmz6g0',
    fotografci: 'Maxim Hopman',
    lisans: 'Unsplash License',
    indirilme: '2026-09-26',
    id: 'photo-1519501025264-65ba15a82390'
  }
];

const widths = [768, 1280, 1920];
const formats = ['webp', 'avif'];

async function run() {
  console.log('Downloading background images with strict size limits...');
  
  for (const item of photos) {
    for (const w of widths) {
      for (const fmt of formats) {
        const filename = `${item.dosya}-${w}.${fmt}`;
        const targetPath = path.join(outDir, filename);

        let maxTarget = (w === 768) ? 65 * 1024 : (w === 1280) ? 80 * 1024 : 100 * 1024;
        if (item.sahne === 1 && w === 768) maxTarget = 85 * 1024;

        let q = (w === 768) ? 60 : (w === 1280) ? 50 : 35;
        let buf;
        while (q >= 5) {
          const url = `https://images.unsplash.com/${item.id}?fit=crop&w=${w}&q=${q}&fm=${fmt}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
          buf = Buffer.from(await res.arrayBuffer());
          if (buf.length <= maxTarget || q === 5) break;
          q -= 5;
        }

        fs.writeFileSync(targetPath, buf);
        console.log(`Saved ${filename} (w=${w}, q=${q}, fmt=${fmt}): ${(buf.length / 1024).toFixed(1)} KB`);
      }
    }
  }

  // Save kaynaklar.json
  const kaynaklarContent = photos.map(({ id, ...rest }) => rest);
  fs.writeFileSync(
    path.join(outDir, 'kaynaklar.json'),
    JSON.stringify(kaynaklarContent, null, 2),
    'utf8'
  );
  console.log('Saved kaynaklar.json');

  // Verify constraints
  const allFiles = fs.readdirSync(outDir).filter(f => /\.(avif|webp)$/i.test(f));
  let totalBytes = 0;
  let over200k = [];
  
  for (const f of allFiles) {
    const size = fs.statSync(path.join(outDir, f)).size;
    totalBytes += size;
    if (size > 200 * 1024) over200k.push(`${f} (${(size / 1024).toFixed(1)} KB)`);
    if (f.startsWith('sahne-1-768') && size > 90 * 1024) {
      console.warn(`WARNING: Scene 1 mobile file ${f} is ${(size / 1024).toFixed(1)} KB (>90KB)!`);
    }
  }

  console.log(`\nVerification:`);
  console.log(`Total files: ${allFiles.length}`);
  console.log(`Total size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB (Limit: 2 MB)`);
  if (over200k.length > 0) {
    console.error(`Files > 200 KB:`, over200k);
    process.exit(1);
  } else {
    console.log(`All files are <= 200 KB.`);
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
