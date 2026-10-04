import fs from 'node:fs';
import path from 'node:path';

const html = fs.readFileSync('dist/index.html', 'utf8');
const webpUrls = new Set();
const fallbackUrls = new Set();

const regex = /(?:src|srcset)="([^"]+?)"/g;
let match;
while ((match = regex.exec(html)) !== null) {
  const url = decodeURIComponent(match[1]).split('?')[0];
  if (url.startsWith('/photos/')) {
    const clean = url.replace(/^\//, '');
    if (clean.endsWith('.webp')) {
      webpUrls.add(clean);
    } else {
      fallbackUrls.add(clean);
    }
  }
}

let modernBytes = 0;
console.log('--- MODERN WEBP ASSETS REFERENCED ON HOMEPAGE ---');
for (const rawUrl of webpUrls) {
  const diskPath = path.join('public', rawUrl.replace(/&amp;/g, '&'));
  if (fs.existsSync(diskPath)) {
    const sz = fs.statSync(diskPath).size;
    modernBytes += sz;
    console.log(diskPath.padEnd(70), (sz / 1024).toFixed(1).padStart(7), 'KB');
  } else {
    console.log('MISSING:', diskPath);
  }
}

console.log('\nTotal Modern WebP Payload:', (modernBytes / (1024 * 1024)).toFixed(2), 'MB');
console.log('Count of WebP files:', webpUrls.size);
