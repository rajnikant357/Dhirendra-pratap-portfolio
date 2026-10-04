import fs from 'fs';
import path from 'path';

const indexHtml = fs.readFileSync('dist/index.html', 'utf8');
const imgMatches = [...indexHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => decodeURIComponent(m[1]));

console.log('Total img elements on index.html:', imgMatches.length);

let totalBytes = 0;
const seen = new Set();
imgMatches.forEach((src, idx) => {
  const localPath = path.join('public', src.replace(/^\//, ''));
  if (fs.existsSync(localPath)) {
    const size = fs.statSync(localPath).size;
    if (!seen.has(src)) {
      totalBytes += size;
      seen.add(src);
    }
    console.log(`${idx + 1}. ${(size / 1024).toFixed(1)} KB: ${src}`);
  } else {
    console.log(`${idx + 1}. [NOT LOCAL]: ${src}`);
  }
});

console.log('--- UNIQUE IMAGE PAYLOAD on Home Page ---');
console.log(`${(totalBytes / (1024 * 1024)).toFixed(2)} MB across ${seen.size} unique images`);
