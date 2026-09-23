// Teşhis dizin özetini (indexSummary.js) ve teşhis sayısını (count.js) src/data/teshis/<slug>.js dosyalarından üretir.
// package.json "prebuild" ile vite build'den önce çalışır; bu iki dosya elle düzenlenmez.
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const dir = path.resolve('src/data/teshis');
const URETILEN = ['indexSummary.js', 'count.js'];
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js') && !URETILEN.includes(f));

const items = [];
for (const f of files) {
  items.push((await import(pathToFileURL(path.join(dir, f)).href)).default);
}
items.sort((a, b) => Number(a.no) - Number(b.no));

const ALANLAR = ['slug', 'no', 'baslik', 'diyagramBaslik', 'kirinti', 'aciliyet', 'ozet', 'ilgiliTerimler', 'nedenler'];
const ozetler = items.map((t) =>
  Object.fromEntries(
    ALANLAR.map((k) => [k, k === 'nedenler' ? t.nedenler.map((n) => ({ harf: n.harf, ad: n.ad })) : t[k]])
  )
);

fs.writeFileSync(path.join(dir, 'indexSummary.js'), 'export const teshisSummaries = ' + JSON.stringify(ozetler, null, 2) + ';\n');
fs.writeFileSync(path.join(dir, 'count.js'), 'export const teshisSayisi = ' + items.length + ';\n');
console.log(`[TEŞHİS DİZİNİ] ${items.length} teşhis → indexSummary.js + count.js`);
