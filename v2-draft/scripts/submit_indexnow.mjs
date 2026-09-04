import fs from 'fs';
import path from 'path';

const key = '59e61ccda679e18fe8c8eebdb0c0ee11';
const host = 'trendmasterakademi.com';
const keyLocation = `https://${host}/${key}.txt`;

const sitemapPath = path.resolve('sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map(m => m[1]);

console.log(`Submitting ${urlList.length} URLs to IndexNow (Bing & Yandex & Copilot)...`);

const payload = {
  host,
  key,
  keyLocation,
  urlList
};

async function submit() {
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log(`IndexNow HTTP Status: ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
      console.log('SUCCESS: All URLs successfully submitted to IndexNow!');
    } else {
      const txt = await res.text();
      console.warn('IndexNow Response:', txt);
    }
  } catch (err) {
    console.error('Failed to submit to IndexNow:', err.message);
  }
}

submit();
