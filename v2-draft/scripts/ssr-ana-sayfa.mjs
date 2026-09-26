import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

async function renderHomeSSR() {
  console.log('[SSR ANA SAYFA] Sunucu tarafı çizim başlatılıyor (tamamlanmış renderToString)...');

  const server = await createServer({
    root: rootDir,
    configFile: false,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false }
  });

  try {
    const i18n = (await server.ssrLoadModule('/src/i18n.js')).default;
    await i18n.changeLanguage('tr');

    // 1. App.jsx modülünü yükle — tüm sayfalar kayit haritasına eklenir
    const appMod = await server.ssrLoadModule('/src/App.jsx');
    const AppShell = appMod.AppShell || appMod.default;

    // 2. Home sayfasını çizimden ÖNCE tamamlanmış olarak hazırla
    const { sayfayiHazirla } = await server.ssrLoadModule('/src/utils/sayfaYukle.js');
    await sayfayiHazirla('Home', '/');

    // 3. Tek seferde ve tamamlanmış renderToString çizimi (akış / iskelet yok)
    const element = React.createElement(MemoryRouter, { initialEntries: ['/'] }, React.createElement(AppShell));
    const html = renderToString(element);

    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    const outPath = path.join(distDir, 'ssr-home.html');
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`[SSR ANA SAYFA] Tamamlandı: ${outPath} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
  } finally {
    await server.close();
  }
  process.exit(0);
}

renderHomeSSR().catch(err => {
  console.error('[SSR ANA SAYFA HATA]', err);
  process.exit(1);
});
