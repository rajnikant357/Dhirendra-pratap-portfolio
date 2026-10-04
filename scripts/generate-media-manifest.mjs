import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const PHOTOS_DIR = path.resolve('public/photos');
const OUTPUT_JSON = path.resolve('src/data/media-manifest.json');
const OUTPUT_TS = path.resolve('src/data/media-manifest.ts');

const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext) && !entry.name.endsWith('.thumb.webp') && !entry.name.endsWith('.thumb.jpg')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function parseYearFromFilename(filename, relDir) {
  // 1. FB_IMG_timestamp (check before IMG_ so FB_IMG doesn't match IMG_)
  const fbMatch = filename.match(/FB_IMG_(\d{10,13})/i);
  if (fbMatch) {
    const ts = parseInt(fbMatch[1], 10);
    const ms = ts < 10000000000 ? ts * 1000 : ts;
    const year = new Date(ms).getFullYear();
    if (year >= 2012 && year <= 2026) return year;
  }

  // 2. WhatsApp Image YYYY-MM-DD
  const waMatch = filename.match(/WhatsApp Image (\d{4})-\d{2}-\d{2}/i);
  if (waMatch) {
    const y = parseInt(waMatch[1], 10);
    if (y >= 2010 && y <= 2026) return y;
  }

  // 3. Screenshot_YYYY-MM-DD
  const scMatch = filename.match(/Screenshot_(\d{4})-\d{2}-\d{2}/i);
  if (scMatch) {
    const y = parseInt(scMatch[1], 10);
    if (y >= 2010 && y <= 2026) return y;
  }

  // 4. IMG_YYYYMMDD or IMG-YYYYMMDD (ensure year is between 2010 and 2026)
  const imgMatch = filename.match(/(?:^|[^a-zA-Z])IMG[-_](\d{4})(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])/i);
  if (imgMatch) {
    const y = parseInt(imgMatch[1], 10);
    if (y >= 2010 && y <= 2026) return y;
  }

  // 5. Scanned items (SKM_...)
  if (filename.startsWith('SKM_')) {
    if (relDir.includes('certificates')) {
      return 2022; // Midpoint of verified certificates (2020-2024)
    }
    return 2023; // Press coverage archive
  }

  // 6. Set design
  if (relDir.includes('set design')) {
    if (filename.includes('2022')) return 2022;
    if (filename.includes('2023')) return 2023;
  }

  return 2024;
}

function getProcessMetadata(filename, folder) {
  const normFolder = folder.replace(/\\/g, '/');
  const lowerName = filename.toLowerCase();

  // 1. Foam Art: Elephant
  if (normFolder === 'Work/Foam art' && lowerName.startsWith('elephant')) {
    if (lowerName.includes('start')) {
      return {
        processGroup: 'foam-elephant',
        processGroupName: 'Monumental Elephant Foam Art Sculpture',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — High-Density Foam Armature & Structural Layout'
      };
    }
    if (lowerName.includes('mid')) {
      return {
        processGroup: 'foam-elephant',
        processGroupName: 'Monumental Elephant Foam Art Sculpture',
        processStage: 'IN_PROGRESS',
        stageLabel: 'Work in Progress — Volumetric Foam Carving & Anatomical Shaping'
      };
    }
    if (lowerName.includes('finish')) {
      return {
        processGroup: 'foam-elephant',
        processGroupName: 'Monumental Elephant Foam Art Sculpture',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Completed Monumental Elephant Foam Sculpture'
      };
    }
  }

  // 2. Foam Art: Lion Face
  if (normFolder === 'Work/Foam art' && lowerName.startsWith('lion face')) {
    if (lowerName.includes('start')) {
      return {
        processGroup: 'foam-lion-face',
        processGroupName: 'Lion Face High-Density Foam Relief Sculpture',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Foam Core Blocking & Facial Proportional Contours'
      };
    }
    if (lowerName.includes('mid')) {
      return {
        processGroup: 'foam-lion-face',
        processGroupName: 'Lion Face High-Density Foam Relief Sculpture',
        processStage: 'IN_PROGRESS',
        stageLabel: 'Work in Progress — Mane Sculpting & Precision Detail Chiseled Layers'
      };
    }
    if (lowerName.includes('finish')) {
      return {
        processGroup: 'foam-lion-face',
        processGroupName: 'Lion Face High-Density Foam Relief Sculpture',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Finished & Painted Lion Face Architectural Relief'
      };
    }
  }

  // 3. Foam Art: Superman
  if (normFolder === 'Work/Foam art' && lowerName.startsWith('superman')) {
    if (lowerName.includes('start')) {
      return {
        processGroup: 'foam-superman',
        processGroupName: 'Superman 3D Foam Sculptural Figure',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Silhouette Grid Layout & Foam Armature Shaping'
      };
    }
    if (lowerName.includes('mid')) {
      return {
        processGroup: 'foam-superman',
        processGroupName: 'Superman 3D Foam Sculptural Figure',
        processStage: 'IN_PROGRESS',
        stageLabel: 'Work in Progress — Anatomical Sculpting & Cape Dynamic Carving'
      };
    }
    if (lowerName.includes('finish')) {
      return {
        processGroup: 'foam-superman',
        processGroupName: 'Superman 3D Foam Sculptural Figure',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Completed 3D Superman Foam Figure Installation'
      };
    }
  }

  // 4. Rangoli: 6 Years of GST
  if (normFolder === 'Work/Rangoli' && lowerName.startsWith('6 year of gst')) {
    if (lowerName.includes('start')) {
      return {
        processGroup: 'rangoli-gst-6-years',
        processGroupName: '6 Years of GST Ceremonial Floor Rangoli',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Geometric Floor Chalk Grid & Typographic Layout'
      };
    }
    if (lowerName.includes('mid')) {
      return {
        processGroup: 'rangoli-gst-6-years',
        processGroupName: '6 Years of GST Ceremonial Floor Rangoli',
        processStage: 'IN_PROGRESS',
        stageLabel: 'Work in Progress — Layering Multi-Coloured Powder Pigments'
      };
    }
    if (lowerName.includes('finish')) {
      return {
        processGroup: 'rangoli-gst-6-years',
        processGroupName: '6 Years of GST Ceremonial Floor Rangoli',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Completed 6 Years of GST Grand Rangoli Carpet'
      };
    }
  }

  // 5. Rangoli: BM Ceremonial Radial
  if (normFolder === 'Work/Rangoli' && lowerName.startsWith('bm')) {
    if (lowerName.includes('start')) {
      return {
        processGroup: 'rangoli-bm',
        processGroupName: 'Ceremonial Radial Dignitary Rangoli',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Radial Geometry & Axis Markers Drafting'
      };
    }
    if (lowerName.includes('mid')) {
      return {
        processGroup: 'rangoli-bm',
        processGroupName: 'Ceremonial Radial Dignitary Rangoli',
        processStage: 'IN_PROGRESS',
        stageLabel: 'Work in Progress — Intricate Petal Powder Shading & Outlines'
      };
    }
    if (lowerName.includes('finish')) {
      return {
        processGroup: 'rangoli-bm',
        processGroupName: 'Ceremonial Radial Dignitary Rangoli',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Grand Ceremonial Radial Rangoli Carpet'
      };
    }
  }

  // 6. Rangoli: Krishna Devotional Art
  if (normFolder === 'Work/Rangoli' && lowerName.startsWith('krishna')) {
    if (lowerName.includes('start')) {
      return {
        processGroup: 'rangoli-krishna',
        processGroupName: 'Shree Krishna Devotional Rangoli Art',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Sacred Figurative Linework & Chalk Contour'
      };
    }
    if (lowerName.includes('finish')) {
      return {
        processGroup: 'rangoli-krishna',
        processGroupName: 'Shree Krishna Devotional Rangoli Art',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Completed Shree Krishna Devotional Floor Rangoli'
      };
    }
  }

  // 7. Scrap Craft: Lion Sculpture (lion 1..5)
  if (normFolder === 'Work/scrap craft' && lowerName.startsWith('lion')) {
    if (lowerName === 'lion 1.jpg') {
      return {
        processGroup: 'scrap-lion-sculpture',
        processGroupName: 'Lion Head Reclaimed Scrap Metal Sculpture',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Steel Wireframe & Skeletal Armature Assembly'
      };
    }
    if (lowerName === 'lion 2.jpg' || lowerName === 'lion 3.jpg' || lowerName === 'lion 4.jpg') {
      return {
        processGroup: 'scrap-lion-sculpture',
        processGroupName: 'Lion Head Reclaimed Scrap Metal Sculpture',
        processStage: 'IN_PROGRESS',
        stageLabel: 'Work in Progress — Welding Cut Industrial Metal Strips for Textured Mane'
      };
    }
    if (lowerName === 'lion 5.jpg') {
      return {
        processGroup: 'scrap-lion-sculpture',
        processGroupName: 'Lion Head Reclaimed Scrap Metal Sculpture',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Completed Dynamic Lion Head Relief Sculpture'
      };
    }
  }

  // 8. Scrap Craft: Transformer Mech Warrior (transformer 1..6)
  if (normFolder === 'Work/scrap craft' && lowerName.startsWith('transformer')) {
    if (lowerName === 'transformer 1.jpg') {
      return {
        processGroup: 'scrap-transformer-mecha',
        processGroupName: 'Monumental Transformer Reclaimed Metal Sculpture',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Heavy Steel Chassis & Lower Leg Skeleton Assembly'
      };
    }
    if (
      lowerName === 'transformer 2.jpg' ||
      lowerName === 'transformer 3.jpg' ||
      lowerName === 'transformer 4.jpg' ||
      lowerName === 'transformer 5.jpg'
    ) {
      return {
        processGroup: 'scrap-transformer-mecha',
        processGroupName: 'Monumental Transformer Reclaimed Metal Sculpture',
        processStage: 'IN_PROGRESS',
        stageLabel: 'Work in Progress — Upper Torso Welding, Hydraulic Limbs & Armature Detailing'
      };
    }
    if (lowerName === 'transformer 6.jpg') {
      return {
        processGroup: 'scrap-transformer-mecha',
        processGroupName: 'Monumental Transformer Reclaimed Metal Sculpture',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Fully Assembled & Painted Cobalt Blue Transformer Mech Warrior'
      };
    }
  }

  // 9. Sketches & Paintings: Classical Portrait Study
  if (normFolder === 'Work/sketches & paintings') {
    if (filename.includes('185117')) {
      return {
        processGroup: 'graphite-portrait-study',
        processGroupName: 'Classical Observational Portraiture Study',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Proportional Grid & Facial Construction'
      };
    }
    if (filename.includes('185129')) {
      return {
        processGroup: 'graphite-portrait-study',
        processGroupName: 'Classical Observational Portraiture Study',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Completed Contemplative Portrait in Graphite'
      };
    }
    if (filename.includes('145317')) {
      return {
        processGroup: 'magnolia-diptych-canvas',
        processGroupName: 'Magnolia Blossoms in White Diptych',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Studio Floral Study on Midnight Navy Ground'
      };
    }
    if (filename.includes('163125')) {
      return {
        processGroup: 'magnolia-diptych-canvas',
        processGroupName: 'Magnolia Blossoms in White Diptych',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Completed Impasto Acrylic Diptych Masterpiece'
      };
    }
  }

  // 10. Wall Art: 2023 Civic Retaining Wall
  if (normFolder === 'Work/wall art') {
    if (
      filename.startsWith('IMG_20230126') ||
      filename.startsWith('IMG_20230127') ||
      filename.startsWith('IMG_20230129') ||
      filename.startsWith('IMG_20230130')
    ) {
      return {
        processGroup: 'civic-wall-art-2023',
        processGroupName: '2023 Urban Highway Civic Retaining Wall Mural',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Surface Preparation & Charcoal Structural Layout'
      };
    }
    if (filename.startsWith('IMG_202302')) {
      return {
        processGroup: 'civic-wall-art-2023',
        processGroupName: '2023 Urban Highway Civic Retaining Wall Mural',
        processStage: 'IN_PROGRESS',
        stageLabel: 'Work in Progress — Exterior Pigment Application & Foliage Modeling'
      };
    }
    if (filename.startsWith('IMG_202303')) {
      return {
        processGroup: 'civic-wall-art-2023',
        processGroupName: '2023 Urban Highway Civic Retaining Wall Mural',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Completed Monumental Public Retaining Wall Mural'
      };
    }
    // 11. Wall Art: 2024
    if (filename.startsWith('IMG_20240114') || (filename.startsWith('IMG_20240115') && filename < 'IMG_20240115_120000')) {
      return {
        processGroup: 'civic-wall-art-2024',
        processGroupName: '2024 Public Art Wall Installation',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Grid Layout & Surface Priming'
      };
    }
    if (filename.startsWith('IMG_20240115_19')) {
      return {
        processGroup: 'civic-wall-art-2024',
        processGroupName: '2024 Public Art Wall Installation',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Final Architectural Wall Composition'
      };
    }
    // 12. Wall Art: 2025
    if (filename.startsWith('IMG_20250114')) {
      return {
        processGroup: 'civic-wall-art-2025',
        processGroupName: '2025 Cultural Beautification Wall Art',
        processStage: 'STARTING',
        stageLabel: 'Starting Work — Base Plaster Preparation & Drafting'
      };
    }
    if (filename.startsWith('IMG_20250118') || filename.startsWith('IMG_20250119')) {
      return {
        processGroup: 'civic-wall-art-2025',
        processGroupName: '2025 Cultural Beautification Wall Art',
        processStage: 'IN_PROGRESS',
        stageLabel: 'Work in Progress — Pigment Blocking & Detailed Linework'
      };
    }
    if (filename.startsWith('IMG_20250124')) {
      return {
        processGroup: 'civic-wall-art-2025',
        processGroupName: '2025 Cultural Beautification Wall Art',
        processStage: 'FINISHED',
        stageLabel: 'Finished Work — Completed Civic Wall Art Installation'
      };
    }
  }

  return {
    processGroup: null,
    processGroupName: null,
    processStage: null,
    stageLabel: null
  };
}

// Generate the manifest
function generateManifest() {
  console.log('Scanning directory:', PHOTOS_DIR);
  const rawFiles = walk(PHOTOS_DIR);

  console.log(`Found ${rawFiles.length} supported media files.`);

  const seenHashes = new Map();
  const fileRecords = [];

  for (const absPath of rawFiles) {
    const relFromPhotos = path.relative(PHOTOS_DIR, absPath).replace(/\\/g, '/');
    const relFromPublic = ('photos/' + relFromPhotos).replace(/\\/g, '/');
    const filename = path.basename(absPath);
    const folder = path.dirname(relFromPhotos).replace(/\\/g, '/');
    const folderNorm = folder === '.' ? '' : folder;

    const fileBuffer = fs.readFileSync(absPath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    let isDuplicate = false;
    let canonicalRel = null;

    if (seenHashes.has(hash)) {
      isDuplicate = true;
      canonicalRel = seenHashes.get(hash);
    } else {
      seenHashes.set(hash, relFromPhotos);
    }

    const year = parseYearFromFilename(filename, folderNorm);

    fileRecords.push({
      absPath,
      relFromPublic,
      relFromPhotos,
      filename,
      folder: folderNorm,
      hash,
      year,
      isDuplicate,
      canonicalRel,
      sizeBytes: fileBuffer.length
    });
  }

  // Sort files logically:
  // 1. Category primary order
  // 2. Process stage: STARTING (0), IN_PROGRESS (1), FINISHED (2)
  // 3. Numbered sequence (lion 1..5, transformer 1..6)
  // 4. Year descending, then filename
  const stageOrder = { STARTING: 0, IN_PROGRESS: 1, FINISHED: 2 };

  fileRecords.sort((a, b) => {
    // Keep in same folder block
    if (a.folder !== b.folder) {
      return a.folder.localeCompare(b.folder);
    }

    const procA = getProcessMetadata(a.filename, a.folder);
    const procB = getProcessMetadata(b.filename, b.folder);

    // If both belong to same process group, sort by stage
    if (procA.processGroup && procB.processGroup && procA.processGroup === procB.processGroup) {
      const sA = procA.processStage ? stageOrder[procA.processStage] ?? 9 : 9;
      const sB = procB.processStage ? stageOrder[procB.processStage] ?? 9 : 9;
      if (sA !== sB) return sA - sB;
    }

    // Natural numeric sort for names like "lion 1" vs "lion 2"
    const numA = a.filename.match(/(\d+)/);
    const numB = b.filename.match(/(\d+)/);
    if (numA && numB) {
      const baseA = a.filename.replace(/\d+/g, '');
      const baseB = b.filename.replace(/\d+/g, '');
      if (baseA === baseB) {
        return parseInt(numA[1], 10) - parseInt(numB[1], 10);
      }
    }

    return a.filename.localeCompare(b.filename);
  });

  // Assign IDs and rich metadata
  const manifest = [];
  const counters = {
    profile: 0,
    painting: 0,
    wallart: 0,
    rangoli: 0,
    scrap: 0,
    foam: 0,
    setdesign: 0,
    cert: 0,
    media: 0,
    work: 0
  };
  const canonicalIdMap = new Map();

  for (const item of fileRecords) {
    let id = '';
    let category = '';
    let subcategory = '';
    let title = '';
    let description = '';
    let alt = '';
    let featured = false;
    let tags = [];
    let duplicateOf = null;

    const f = item.folder;
    const name = item.filename;

    if (item.filename === 'Dhirendra.jpeg' || item.filename === 'team.jpg' || f === '') {
      counters.profile++;
      id = `profile-${String(counters.profile).padStart(3, '0')}`;
      category = 'Profile';
      if (item.filename === 'team.jpg') {
        subcategory = 'Studio Team & Assistants';
        title = 'Dhirendra Pratap Studio Team & Mural Crew';
        description = 'The dedicated artist and studio assistant team collaborating on monumental public murals and large-scale cultural installations.';
        alt = 'Dhirendra Pratap with artist team and assistants';
      } else {
        subcategory = 'Artist Studio Portrait';
        title = 'Dhirendra Pratap — Artist & Graphic Designer';
        description = 'Authentic studio portrait of visual artist and graphic designer Dhirendra Pratap. Based in Uttar Pradesh, his studio practice bridges fine art painting, observational drawing, public wall murals, and sculptural craft.';
        alt = 'Studio portrait of artist Dhirendra Pratap wearing patterned kurta';
      }
      featured = false;
      tags = ['artist', 'portrait', 'dhirendra pratap', 'studio'];
    } else if (f.startsWith('Work/sketches & paintings')) {
      counters.painting++;
      id = `art-painting-${String(counters.painting).padStart(3, '0')}`;
      category = 'Paintings & Sketches';

      if (name.includes('163125')) {
        subcategory = 'Fine Art Painting';
        title = 'Magnolia Blossoms in White (Diptych)';
        description = 'Large-scale contemporary acrylic diptych on canvas depicting blooming white magnolia blossoms with tactile impasto brushwork on a midnight navy ground.';
        alt = 'Contemporary acrylic diptych painting of blooming white magnolia flowers on dark canvas';
        featured = true;
        tags = ['painting', 'acrylic', 'magnolia', 'floral', 'diptych', 'fine art'];
      } else if (name.includes('145317')) {
        subcategory = 'Fine Art Painting';
        title = 'Yellow Floral Study on Midnight Ground';
        description = 'Large-format acrylic canvas painting presenting layered yellow flower petals with dark central accents on deep midnight blue.';
        alt = 'Contemporary acrylic painting of bright yellow floral blooms on midnight navy background';
        featured = true;
        tags = ['painting', 'acrylic', 'yellow floral', 'contemporary', 'fine art'];
      } else if (name.includes('185129')) {
        subcategory = 'Pencil & Charcoal Portrait';
        title = 'Contemplative Portrait Study in Graphite';
        description = 'Academic graphite portrait drawing on archival paper capturing a young woman resting her chin in thoughtful contemplation.';
        alt = 'Detailed observational pencil portrait sketch of a young woman resting chin on hand';
        featured = true;
        tags = ['drawing', 'graphite', 'portrait', 'observational study', 'sketch'];
      } else if (name.includes('185117')) {
        subcategory = 'Pencil & Charcoal Portrait';
        title = 'Portrait of a Young Woman with Academic Grid';
        description = 'Observational pencil portrait study displaying subtle proportional grid lines on drawing paper, reflecting classical human anatomy foundation.';
        alt = 'Graphite portrait drawing of a young woman showing academic proportional grid';
        featured = true;
        tags = ['drawing', 'graphite', 'portrait', 'classical foundation', 'grid study'];
      } else if (name.includes('IMG_20230320')) {
        subcategory = 'Observational Life Drawing';
        title = `Figurative Observational Life Study ${name.includes('171628') ? 'in Warm Ochre & Charcoal' : name.includes('171812') ? '— Dynamic Gesture' : name.includes('171829') ? '— Spatial Form' : '— Anatomical Contours'}`;
        description = 'Classical academic life drawing and observational figurative study exploring human proportion, dynamic gesture, and tonal draftsmanship on archival paper.';
        alt = 'Observational figurative life drawing study by Dhirendra Pratap';
        featured = name.includes('171628');
        tags = ['drawing', 'sketch', 'life study', 'figurative', 'charcoal', 'academic art'];
      } else if (name.includes('1659231349500') || name.includes('1672659981901') || name.includes('1659231358701')) {
        subcategory = 'Official Presentation';
        title = `Commissioned Dignitary Portrait Presentation ${counters.painting}`;
        description = 'Photographic documentation showing Dhirendra presenting a custom-framed graphite portrait sketch to an official dignitary.';
        alt = 'Dhirendra presenting a framed graphite portrait sketch to an official dignitary';
        featured = true;
        tags = ['portrait', 'presentation', 'official', 'commission'];
      } else {
        subcategory = 'Observational Drawing';
        title = `Drawing Study & Composition ${counters.painting}`;
        description = 'Studio drawing and compositional study from Dhirendra’s sketchbook archive, demonstrating foundational draftsmanship and form.';
        alt = 'Studio drawing study by Dhirendra Pratap';
        tags = ['drawing', 'sketch', 'studio'];
      }
    } else if (f.startsWith('Work/Foam art')) {
      counters.foam++;
      id = `art-foam-${String(counters.foam).padStart(3, '0')}`;
      category = 'Foam Art';

      if (name.toLowerCase().startsWith('elephant')) {
        subcategory = 'Monumental 3D Foam Carving';
        title = `Monumental Elephant Foam Art Sculpture (${name.includes('start') ? 'Beginning' : name.includes('mid') ? 'In Progress' : 'Completed'})`;
        description = 'Monumental life-sized elephant sculpted from high-density foam and thermocol blocks with textured anatomical carving.';
        alt = 'Sculpted monumental foam elephant art by Dhirendra';
        featured = name.includes('finished');
        tags = ['foam art', 'elephant', 'sculpture', '3d art', 'thermocol'];
      } else if (name.toLowerCase().startsWith('lion face')) {
        subcategory = 'Architectural Foam Relief';
        title = `Lion Face High-Density Foam Relief (${name.includes('start') ? 'Beginning' : name.includes('mid') ? 'In Progress' : 'Completed'})`;
        description = 'Expressive lion face sculpted in high-density foam featuring a flowing mane, precise facial contours, and dimensional depth.';
        alt = 'Lion face carved foam relief sculpture';
        featured = name.includes('finished');
        tags = ['foam art', 'lion face', 'relief sculpture', '3d art'];
      } else if (name.toLowerCase().startsWith('superman')) {
        subcategory = 'Character & Figurative 3D Foam';
        title = `Superman 3D Foam Sculptural Figure (${name.includes('start') ? 'Beginning' : name.includes('mid') ? 'In Progress' : 'Completed'})`;
        description = 'Full-scale three-dimensional Superman figure carved by hand from layered high-density foam blocks.';
        alt = 'Superman sculpted 3D foam statue';
        featured = name.includes('finished');
        tags = ['foam art', 'superman', 'sculpture', 'character art'];
      } else {
        subcategory = 'Monumental 3D Foam Carving';
        title = `Hand-Carved Foam Sculptural Installation ${counters.foam}`;
        description = 'Large-scale decorative and architectural installation sculpted by hand from high-density foam and thermocol for public exhibitions.';
        alt = 'Hand-carved foam sculpture by Dhirendra Pratap';
        featured = counters.foam % 7 === 0;
        tags = ['foam art', 'sculpture', 'thermocol carving', '3d art'];
      }
    } else if (f.startsWith('Work/scrap craft')) {
      counters.scrap++;
      id = `art-scrap-${String(counters.scrap).padStart(3, '0')}`;
      category = 'Scrap Craft';

      if (name.toLowerCase().startsWith('lion')) {
        subcategory = 'Wildlife Relief Sculptures';
        title = `Lion Head Reclaimed Scrap Metal Sculpture (Stage ${name.match(/\d+/)?.[0] || '1'})`;
        description = 'Monumental lion head relief forged from industrial scrap metal, cut steel sheets, discarded chain links, and structural bolts.';
        alt = 'Scrap metal lion sculpture forged from industrial recycled metal';
        featured = name === 'lion 5.jpg';
        tags = ['scrap craft', 'lion', 'sculpture', 'welded steel', 'recycled metal'];
      } else if (name.toLowerCase().startsWith('transformer')) {
        subcategory = 'Monumental Scrap Metal Sculptures';
        title = `Monumental Reclaimed Scrap Transformer Mech Warrior (Stage ${name.match(/\d+/)?.[0] || '1'})`;
        description = 'Monumental multi-component mech warrior sculpture constructed entirely from discarded automotive gears, suspension springs, wheel rims, and industrial scrap plates, finished in striking cobalt blue.';
        alt = 'Monumental scrap metal Transformer mech warrior sculpture welded from recycled industrial parts';
        featured = name === 'transformer 6.jpg';
        tags = ['scrap craft', 'transformer', 'sculpture', 'robot', 'welded steel', 'reclaimed metal', 'public art'];
      } else if (name.toLowerCase().includes('chess')) {
        subcategory = 'Reclaimed Sculptural Craft';
        title = 'Handcrafted Scrap Metal Chess Figures';
        description = 'Hand-assembled decorative chess pieces forged from recycled machine bearings, nuts, bolts, and hardware elements.';
        alt = 'Recycled hardware scrap metal chess pieces';
        featured = true;
        tags = ['scrap craft', 'chess', 'sculpture', 'recycled art'];
      } else {
        subcategory = 'Recycled Material Sculpture';
        title = `Recycled Scrap Metal Sculpture ${counters.scrap}`;
        description = 'Creative sculptural installation constructed from discarded metallic components and industrial scrap.';
        alt = 'Three-dimensional sculpture crafted from reclaimed materials by Dhirendra';
        featured = counters.scrap === 1;
        tags = ['scrap craft', 'recycled art', 'sculpture'];
      }
    } else if (f.startsWith('Work/set design')) {
      counters.setdesign++;
      id = `art-setdesign-${String(counters.setdesign).padStart(3, '0')}`;
      category = 'Set Design';
      subcategory = 'Theatrical & Stage Set Design';

      if (name.includes('IMG_20221231_172130')) {
        title = 'Grand Thematic Proscenium & Set Architecture';
        description = 'Stage set design for New Year cultural festival featuring multi-tiered proscenium arch, integrated illumination, and architectural backdrop.';
        alt = 'Stage Set Design for New Year Festival by Dhirendra';
        featured = true;
      } else if (name.includes('IMG_20221231_175849')) {
        title = 'New Year Cultural Festival Lighting & Arch Rigging';
        description = 'Architectural lighting rig, truss construction, and proscenium frame for New Year festival stage.';
        alt = 'Stage lighting and arch rigging design by Dhirendra';
      } else if (name.includes('IMG_20230303_165456')) {
        title = 'Sant Kabir Utsav Ceremonial Entrance Arch & Scenography';
        description = 'Architectural entrance portal and ceremonial arch structure fabricated for the Sant Kabir State Cultural Festival.';
        alt = 'Sant Kabir Utsav stage arch and scenography structure by Dhirendra';
        featured = true;
      } else if (name.includes('IMG_20230303_165951')) {
        title = 'Sant Kabir State Festival Stage Scenography & Proscenium';
        description = 'Ceremonial stage proscenium and thematic arch structure designed for Sant Kabir Utsav celebrations.';
        alt = 'Sant Kabir State Festival stage scenography by Dhirendra';
      } else if (name.includes('IMG_20230307_173307')) {
        title = 'Rangotsav 2023 Thematic Pavilion & Stage Architecture';
        description = 'Custom-designed festival stage booth and decorative pavilion structure executed for Rangotsav 2023 cultural celebrations.';
        alt = 'Rangotsav 2023 stage booth and thematic pavilion by Dhirendra';
        featured = true;
      } else if (name.includes('IMG_20230318_150926')) {
        title = 'Cultural Festival Monumental Entry Gate Architecture';
        description = 'Monumental decorative entry gateway and spatial event portal structure created for civic cultural celebrations.';
        alt = 'Cultural festival entrance gateway architecture by Dhirendra';
        featured = true;
      } else if (name.includes('IMG_20230318_161108')) {
        title = 'Civic Cultural Festival Ceremonial Set Assembly';
        description = 'On-site ceremonial stage set and proscenium assembly for government cultural conventions.';
        alt = 'Civic cultural festival ceremonial set assembly by Dhirendra';
      } else if (name.includes('IMG_20230322_200625')) {
        title = 'Civic Stage and Floral Set Assembly';
        description = 'Event scenography and spatial fabrication for public state convention, incorporating floral accents and backdrop paneling.';
        alt = 'Civic Stage and Floral Set Assembly by Dhirendra';
        featured = true;
      } else if (name.includes('IMG_20230322_200648')) {
        title = 'Thematic Proscenium & Stage Assembly Perspective';
        description = 'Illuminated stage proscenium architecture and ceremonial decor execution.';
        alt = 'Thematic proscenium and stage assembly by Dhirendra';
      } else if (name.includes('IMG_20230515_220959')) {
        title = 'Evening Gala Stage Production & Theatrical Backdrop';
        description = 'Atmospheric night-time illuminated stage setup with acoustic backdrop and ambient lighting.';
        alt = 'Evening stage production and theatrical backdrop by Dhirendra';
      } else if (name.toLowerCase().includes('screenshot')) {
        title = 'Stage Spatial Layout & Elevation Blueprint';
        description = 'Preliminary digital elevation plan and stage proscenium layout drafting for festival client approval.';
        alt = 'Stage spatial layout and elevation drafting by Dhirendra';
      } else {
        title = `Theatrical & Event Stage Set Design ${counters.setdesign}`;
        description = 'Custom-designed theatrical stage set, ceremonial event backdrop, and architectural environmental installation executed by Dhirendra Pratap.';
        alt = 'Theatrical stage set and ceremonial backdrop design by Dhirendra';
        featured = counters.setdesign === 1 || counters.setdesign === 3;
      }
      tags = ['set design', 'theatrical', 'stage', 'event design', 'environmental art'];
    } else if (f.startsWith('Work/CM Yogi') || f.startsWith('Work/Rangoli')) {
      counters.rangoli++;
      id = `art-rangoli-${String(counters.rangoli).padStart(3, '0')}`;
      category = 'Rangoli';

      if (f.includes('CM Yogi')) {
        subcategory = 'Ceremonial Dignitary Welcome';
        title = `Ceremonial Dignitary Welcome Rangoli & Floral Carpet ${counters.rangoli}`;
        description = 'Photographic documentation from a state event involving Uttar Pradesh Chief Minister Yogi Adityanath. Features a grand multi-coloured floor rangoli and fresh flower carpet created by Dhirendra at the ceremonial venue.';
        alt = 'Ceremonial multi-coloured geometric rangoli and floral carpet for UP CM Yogi Adityanath event';
        featured = counters.rangoli === 1 || counters.rangoli === 4;
        tags = ['rangoli', 'ceremonial', 'cm yogi', 'floral art', 'state event'];
      } else if (name.toLowerCase().startsWith('6 year of gst')) {
        subcategory = 'State Event Floor Rangoli';
        title = `6 Years of GST Ceremonial Floor Rangoli (${name.includes('start') ? 'Beginning' : name.includes('mid') ? 'In Progress' : 'Completed'})`;
        description = 'Monumental floor rangoli carpet celebrating 6 years of GST, featuring intricate geometric emblems, Indian national colors, and ceremonial dye powder.';
        alt = '6 Years of GST ceremonial floor rangoli carpet';
        featured = name.includes('finished');
        tags = ['rangoli', 'gst', 'ceremonial', 'state event', 'floor art'];
      } else if (name.toLowerCase().startsWith('bm')) {
        subcategory = 'Ceremonial Radial Dignitary Rangoli';
        title = `Ceremonial Radial Dignitary Rangoli (${name.includes('start') ? 'Beginning' : name.includes('mid') ? 'In Progress' : 'Completed'})`;
        description = 'Grand radial mandalic rangoli carpet laid out with concentric floral borders and vibrant organic pigments.';
        alt = 'Ceremonial radial mandalic rangoli carpet';
        featured = name.includes('finished');
        tags = ['rangoli', 'ceremonial', 'mandala', 'floor art'];
      } else if (name.toLowerCase().startsWith('krishna')) {
        subcategory = 'Devotional Fine Art Rangoli';
        title = `Shree Krishna Devotional Rangoli Art (${name.includes('start') ? 'Beginning' : 'Completed'})`;
        description = 'Exquisite figurative rangoli depicting Lord Krishna, rendered with colored dry pigments and fine contour lines.';
        alt = 'Shree Krishna devotional fine art rangoli by Dhirendra';
        featured = name.includes('finished');
        tags = ['rangoli', 'krishna', 'devotional', 'fine art rangoli'];
      } else if (name.includes('1659231490342') || name.includes('1659231596078') || name.includes('1659231603773') || name.includes('1659231614985')) {
        subcategory = 'Civic Awareness Street Art';
        title = `COVID-19 Awareness Street Rangoli — 'Stay Home' ${counters.rangoli}`;
        description = 'Monumental public street rangoli created in Lucknow during the 2020 pandemic in collaboration with Civil Defence and the Journalist Association. Illustrates frontline workers and public health messages.';
        alt = 'Large circular street rangoli promoting COVID-19 safety and honoring frontline healthcare workers';
        featured = true;
        tags = ['rangoli', 'street art', 'covid-19 awareness', 'civil defence', 'lucknow'];
      } else {
        subcategory = 'Traditional & Floral Rangoli';
        title = `Decorative Floor Rangoli Art ${counters.rangoli}`;
        description = 'Intricate floor art composition created using vibrant coloured powders, sacred geometric motifs, and floral arrangements.';
        alt = 'Decorative coloured powder rangoli composition by Dhirendra';
        featured = counters.rangoli % 5 === 0;
        tags = ['rangoli', 'floor art', 'traditional'];
      }
    } else if (f.startsWith('Work/wall art')) {
      counters.wallart++;
      id = `art-wallart-${String(counters.wallart).padStart(3, '0')}`;
      category = 'Wall Art';

      if (name.includes('IMG_20240115_090548')) {
        subcategory = 'Civic & Devotional Murals';
        title = 'Lord Ram Divine Architectural Wall Mural (Ayodhya)';
        description = 'Monumental architectural wall mural of Lord Ram executed in Ayodhya, capturing divine iconography with rich mineral pigments and intricate architectural detailing.';
        alt = 'Lord Ram Divine Architectural Wall Mural in Ayodhya by Dhirendra';
        featured = true;
        tags = ['wall art', 'lord ram', 'ayodhya', 'mural', 'devotional art', 'civic mural'];
      } else if (name.includes('IMG_20230326_201126')) {
        subcategory = 'Traditional & Folk Murals';
        title = '"Son Chiraiya" (सोन चिरैया) Traditional Folk Art & Mythological Mural';
        description = 'Vernacular folk heritage mural titled "Son Chiraiya", depicting regional avian folklore and traditional cultural motifs in earthy mineral pigments.';
        alt = 'Son Chiraiya Traditional Folk Art and Mythological Wall Mural by Dhirendra';
        featured = true;
        tags = ['wall art', 'son chiraiya', 'folk art', 'traditional mural', 'heritage'];
      } else if (name.includes('1659977414990') || name.includes('1659977420144') || name.includes('1659977426208')) {
        subcategory = 'Traditional & Folk Murals';
        title = `Traditional Folk Mud Wall Mural ${counters.wallart}`;
        description = 'Large-scale vernacular wall mural executed on clay plaster using natural white lime and terracotta pigments. Depicts indigenous folk motifs, sacred figures, aquatic life, and regional cultural symbolism.';
        alt = 'Traditional Indian folk wall mural painted with white and terracotta pigments on rural mud house';
        featured = counters.wallart <= 3;
        tags = ['wall art', 'folk mural', 'traditional', 'vernacular', 'clay wall'];
      } else if (name.includes('171344') || name.includes('120650') || name.includes('160548') || name.includes('164520')) {
        subcategory = 'Public Civic Murals';
        title = `Urban Civic Retaining Wall Mural ${counters.wallart}`;
        description = 'Large-format outdoor civic mural painted across urban infrastructure retaining walls. Incorporates botanical foliage, wildlife, and vibrant public art themes executed with weather-resistant exterior coatings.';
        alt = 'Large urban civic mural depicting wildlife and flora painted on concrete highway retaining wall';
        featured = counters.wallart === 10 || counters.wallart === 11;
        tags = ['wall art', 'mural', 'public art', 'civic beautification', 'exterior'];
      } else {
        subcategory = 'Public & Architectural Murals';
        title = `Architectural Wall Art Installation ${counters.wallart}`;
        description = 'Site-specific wall mural executed as part of public cultural beautification and architectural enhancement projects in Uttar Pradesh.';
        alt = 'Site-specific wall art installation by Dhirendra Pratap';
        featured = counters.wallart % 8 === 0;
        tags = ['wall art', 'mural', 'public art'];
      }
    } else if (f.startsWith('awards/certificates and awards')) {
      counters.cert++;
      id = `award-cert-${String(counters.cert).padStart(3, '0')}`;
      category = 'Awards & Recognition';

      if (name.includes('15170')) {
        subcategory = 'Journalism & Media Citation';
        title = 'Shan-e-Siddharth (Urdu Daily) Appreciation Certificate';
        description = 'Certificate of appreciation conferred to Dhirendra Pratap by Shan-e-Siddharth Daily, commending his exceptional contributions to visual painting and cultural heritage preservation.';
        alt = 'Shan-e-Siddharth appreciation certificate awarded to Dhirendra Pratap';
        featured = true;
        tags = ['award', 'certificate', 'shan-e-siddharth', 'recognition'];
      } else if (name.includes('15180')) {
        subcategory = 'National Academy Honors';
        title = "Lalit Kala Akademi 'Har Ghar Tiranga' Workshop Certificate";
        description = 'Certificate of participation and merit awarded to Dhirendra Pratap by Lalit Kala Akademi Regional Centre Lucknow (Ministry of Culture, Govt. of India) during the national Har Ghar Tiranga visual arts workshop.';
        alt = 'Lalit Kala Akademi Regional Centre Lucknow certificate of participation for Har Ghar Tiranga workshop';
        featured = true;
        tags = ['award', 'lalit kala akademi', 'ministry of culture', 'national certificate'];
      } else if (name.includes('1659231484703') || name.includes('1659231446075')) {
        subcategory = 'State Cultural Felicitation';
        title = `Kala Shree Samman & COVID-19 Warrior Award ${counters.cert}`;
        description = 'Honored by the U.P. District Recognized Journalist Association with the Kala Shree Samman for public health awareness street artwork created in Lucknow.';
        alt = 'Kala Shree Samman recognition certificate and memento';
        featured = true;
      } else if (name.includes('438304121')) {
        subcategory = 'Dignitary Felicitation & Citations';
        title = 'Artistic Portfolio Presentation to DGP (UP Police)';
        description = 'Visual artist Dhirendra Pratap presenting his artistic portfolio and creative documentation to the Director General of Police (DGP) at Uttar Pradesh Police Headquarters, Lucknow.';
        alt = 'Visual artist Dhirendra Pratap presenting art portfolio to the DGP at Uttar Pradesh Police Headquarters';
        featured = true;
        tags = ['award', 'felicitation', 'dgp up police', 'recognition'];
      } else {
        subcategory = 'Certificates & Citations';
        title = `Documented Recognition & Citation ${counters.cert}`;
        description = "Documented honor, workshop credential, or certificate of appreciation preserved in Dhirendra Pratap's verified artistic archive.";
        alt = 'Artistic recognition certificate awarded to Dhirendra Pratap';
        tags = ['award', 'certificate', 'recognition'];
      }
    } else if (f.startsWith('awards/News articles')) {
      counters.media++;
      id = `media-press-${String(counters.media).padStart(3, '0')}`;
      category = 'Press & Media';

      if (name.includes('15410')) {
        subcategory = 'Newspaper Feature Articles';
        title = 'Mankameshwar Math Mandir Felicitation for COVID-19 Murals';
        description = 'Press report documenting the felicitation of Dhirendra Pratap and artist team by Mahant Devyagiri at Mankameshwar Math Mandir for creating COVID-19 public awareness murals on temple precinct walls.';
        alt = 'Newspaper article documenting Mankameshwar Math Mandir artist felicitation';
        featured = true;
        tags = ['press', 'newspaper', 'mankameshwar mandir', 'covid-19 awareness'];
      } else {
        subcategory = 'Press Clippings & Features';
        title = `Published Press Coverage ${counters.media}`;
        description = "Published newspaper article from the artist's media scrapbook covering public wall art projects, scrap metal sculptures, and cultural art exhibitions.";
        alt = 'Published press clipping covering artwork by Dhirendra Pratap';
        tags = ['press', 'news clipping', 'media archive'];
      }
    } else {
      counters.work++;
      id = `media-misc-${String(counters.work).padStart(3, '0')}`;
      category = 'Works';
      subcategory = 'Studio Documentation';
      title = `Artistic Documentation ${counters.work}`;
      description = 'Archival documentary photograph recording creative activities and works in progress.';
      alt = 'Studio and project documentation by Dhirendra Pratap';
      tags = ['documentation', 'archive'];
    }

    if (!canonicalIdMap.has(item.hash)) {
      canonicalIdMap.set(item.hash, id);
    } else {
      duplicateOf = canonicalIdMap.get(item.hash);
    }

    // Clean public src path: encodeURI preserves '&', '(', ')', etc. while encoding spaces to %20
    const encodedSrc = '/' + encodeURI(item.relFromPublic);
    const processMeta = getProcessMetadata(item.filename, item.folder);

    manifest.push({
      id,
      src: encodedSrc,
      rawSrc: '/' + item.relFromPublic,
      filename: item.filename,
      relativePath: item.relFromPublic,
      folder: item.folder,
      category,
      subcategory,
      title,
      description,
      alt,
      featured,
      year: item.year,
      tags,
      isDuplicate: item.isDuplicate,
      duplicateOf,
      sizeBytes: item.sizeBytes,
      processGroup: processMeta.processGroup,
      processGroupName: processMeta.processGroupName,
      processStage: processMeta.processStage,
      stageLabel: processMeta.stageLabel,
    });
  }

  // Calculate statistics
  const total = manifest.length;
  const uniqueCount = manifest.filter(m => !m.isDuplicate).length;
  const duplicateCount = manifest.filter(m => m.isDuplicate).length;
  const featuredCount = manifest.filter(m => m.featured && !m.isDuplicate).length;

  const categoryBreakdown = {};
  for (const item of manifest) {
    if (!item.isDuplicate) {
      categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1;
    }
  }

  console.log('--- MANIFEST SUMMARY ---');
  console.log(`Total Media Items: ${total}`);
  console.log(`Unique Items: ${uniqueCount}`);
  console.log(`Duplicate Items: ${duplicateCount}`);
  console.log(`Featured Items: ${featuredCount}`);
  console.log('Category Breakdown (Unique):', JSON.stringify(categoryBreakdown, null, 2));

  // Write JSON
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`Saved JSON manifest to: ${OUTPUT_JSON}`);

  // Write TypeScript
  const tsContent = `// Auto-generated by scripts/generate-media-manifest.mjs
// Do not edit directly. Run \`node scripts/generate-media-manifest.mjs\` to regenerate.

export interface MediaItem {
  id: string;
  src: string;
  rawSrc: string;
  filename: string;
  relativePath: string;
  folder: string;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  alt: string;
  featured: boolean;
  year: number;
  tags: string[];
  isDuplicate: boolean;
  duplicateOf: string | null;
  sizeBytes: number;
  processGroup?: string | null;
  processGroupName?: string | null;
  processStage?: 'STARTING' | 'IN_PROGRESS' | 'FINISHED' | null;
  stageLabel?: string | null;
}

export const MEDIA_MANIFEST: MediaItem[] = ${JSON.stringify(manifest, null, 2)};

export const UNIQUE_MEDIA: MediaItem[] = MEDIA_MANIFEST.filter((item) => !item.isDuplicate);

export const FEATURED_MEDIA: MediaItem[] = UNIQUE_MEDIA.filter((item) => item.featured);

export const MEDIA_STATS = {
  total: ${total},
  unique: ${uniqueCount},
  duplicates: ${duplicateCount},
  featured: ${featuredCount},
  categoryBreakdown: ${JSON.stringify(categoryBreakdown, null, 2)}
} as const;
`;

  fs.writeFileSync(OUTPUT_TS, tsContent, 'utf-8');
  console.log(`Saved TypeScript manifest to: ${OUTPUT_TS}`);
}

generateManifest();
