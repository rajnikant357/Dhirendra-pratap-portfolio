import fs from 'fs';
import path from 'path';

const filesToScan = [
  'src/lib/data/artworks.ts',
  'src/lib/data/achievements.ts',
  'src/lib/data/projects.ts',
  'src/lib/data/services.ts',
  'src/components/hero/HeroBackgroundSlideshow.tsx',
  'src/pages/index.astro',
  'src/pages/about.astro'
];

const found = new Set();
filesToScan.forEach((f) => {
  if (fs.existsSync(f)) {
    const txt = fs.readFileSync(f, 'utf8');
    const matches = [...txt.matchAll(/\/photos\/[^"'`\s<>]+/g)];
    matches.forEach((m) => {
      let cleanUrl = m[0].replace(/[;,]$/, '');
      found.add(decodeURIComponent(cleanUrl));
    });
  }
});

console.log('Total referenced images across main site:', found.size);
let totalBytes = 0;
const list = [];
found.forEach((url) => {
  const local = path.join('public', url.replace(/^\//, ''));
  if (fs.existsSync(local)) {
    const sz = fs.statSync(local).size;
    totalBytes += sz;
    list.push({ url, sz, local });
  } else {
    console.log('MISSING:', url);
  }
});

list.sort((a, b) => b.sz - a.sz);
console.log('Top 15 largest referenced images:');
list.slice(0, 15).forEach((item, i) => {
  console.log(`${i + 1}. ${(item.sz / (1024 * 1024)).toFixed(2)} MB: ${item.url}`);
});

console.log('TOTAL BYTES of all directly referenced images:', (totalBytes / (1024 * 1024)).toFixed(2), 'MB');
