// Tek kaynak: her teşhis src/data/teshis/<slug>.js dosyasındadır. Bu dosya yalnız onları "no" sırasıyla toplar.
// Yalnız Node'da (generate_static_pages.js) kullanılır; React bu dosyayı içe aktarmaz.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'teshis');
const URETILEN = ['indexSummary.js', 'count.js'];
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js') && !URETILEN.includes(f));
const items = await Promise.all(files.map((f) => import(pathToFileURL(path.join(dir, f)).href).then((m) => m.default)));

export const teshisData = items.sort((a, b) => Number(a.no) - Number(b.no));
