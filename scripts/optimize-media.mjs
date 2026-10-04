import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PHOTOS_DIR = path.resolve('public/photos');
const MAX_DIMENSION = 1920;
const THUMB_DIMENSION = 640;

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        // Skip already generated thumbnails or webp companions
        if (!entry.name.endsWith('.thumb.webp') && !entry.name.endsWith('.thumb.jpg')) {
          files.push(fullPath);
        }
      }
    }
  }
  return files;
}

async function optimizeMedia() {
  console.log('--- STARTING IMAGE OPTIMIZATION PIPELINE ---');
  const files = walk(PHOTOS_DIR);
  console.log(`Found ${files.length} images to inspect.`);

  let optimizedCount = 0;
  let webpGenerated = 0;
  let thumbsGenerated = 0;
  let totalSavedBytes = 0;

  for (const file of files) {
    try {
      const stat = fs.statSync(file);
      const ext = path.extname(file).toLowerCase();
      const dir = path.dirname(file);
      const name = path.basename(file, ext);

      const webpPath = path.join(dir, `${name}.webp`);
      const thumbWebpPath = path.join(dir, `${name}.thumb.webp`);

      const webpExists = fs.existsSync(webpPath);
      const thumbExists = fs.existsSync(thumbWebpPath);

      // Fast-path: if derivatives exist, source is <= 500KB and mtimes match, skip
      if (webpExists && thumbExists && stat.size <= 500 * 1024) {
        const webpMtime = fs.statSync(webpPath).mtimeMs;
        if (webpMtime >= stat.mtimeMs) {
          continue;
        }
      }

      // 1. Check if source needs downscaling/compression (> 1920px or > 500KB)
      const meta = await sharp(file).metadata();
      const isOversized = (meta.width && meta.width > MAX_DIMENSION) || (meta.height && meta.height > MAX_DIMENSION);
      const isHeavy = stat.size > 500 * 1024;

      if (isOversized || isHeavy) {
        const origSize = stat.size;
        const tempPath = `${file}.tmp`;

        if (ext === '.png') {
          await sharp(file)
            .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
            .png({ compressionLevel: 8 })
            .toFile(tempPath);
        } else {
          await sharp(file)
            .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 84, mozjpeg: true })
            .toFile(tempPath);
        }

        const newSize = fs.statSync(tempPath).size;
        if (newSize < origSize) {
          fs.unlinkSync(file);
          fs.renameSync(tempPath, file);
          totalSavedBytes += (origSize - newSize);
          optimizedCount++;
        } else {
          fs.unlinkSync(tempPath);
        }
      }

      // 2. Generate modern .webp companion if not exists or outdated
      if (!fs.existsSync(webpPath) || fs.statSync(webpPath).mtimeMs < stat.mtimeMs) {
        await sharp(file)
          .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(webpPath);
        webpGenerated++;
      }

      // 3. Generate responsive _thumb.webp for cards/gallery grids
      if (!fs.existsSync(thumbWebpPath) || fs.statSync(thumbWebpPath).mtimeMs < stat.mtimeMs) {
        await sharp(file)
          .resize({ width: THUMB_DIMENSION, height: THUMB_DIMENSION, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(thumbWebpPath);
        thumbsGenerated++;
      }
    } catch (err) {
      console.warn(`Could not optimize image ${file}:`, err.message);
    }
  }

  console.log('--- IMAGE OPTIMIZATION COMPLETE ---');
  console.log(`Original images compressed in-place: ${optimizedCount}`);
  console.log(`Modern WebP companions generated: ${webpGenerated}`);
  console.log(`Responsive WebP thumbnails generated: ${thumbsGenerated}`);
  console.log(`Total payload reduction on disk: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`);
}

optimizeMedia();
