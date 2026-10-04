# Dhirendra Art Gallery — Real Media Inventory & Audit Report

**Generated:** October 2026  
**Auditor:** Antigravity Autonomous Agent  
**Media Root Directory:** `public/photos/`  
**Manifest Artifacts:** `src/data/media-manifest.json`, `src/data/media-manifest.ts`  
**Build-Time Generation Script:** `scripts/generate-media-manifest.mjs`

---

## 1. Executive Summary

A comprehensive, byte-level recursive scan of all visual assets stored in `public/photos/**` was completed. The scan examined metadata, image headers, SHA-256 cryptographic hashes, and visual content across all directories.

- **Total Media Files Scanned:** 544
- **Unique Media Assets:** 526
- **Byte-for-Byte Exact Duplicates:** 18
- **Featured Showcase Items:** 21 (curated across all creative categories)
- **Supported File Formats:** 447 `.jpg` files, 97 `.jpeg` files (100% valid image binaries)
- **Missing or Corrupted Files:** 0

---

## 2. Directory & Category Breakdown

| Category | Source Directory | Total Files | Unique Files | Duplicates | Featured |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Profile** | `photos/` | 1 | 1 | 0 | 1 |
| **Paintings & Sketches** | `photos/Work/sketches & paintings/` + root | 8 | 8 | 0 | 5 |
| **Wall Art** | `photos/Work/wall art/` + root | 67 | 67 | 0 | 5 |
| **Rangoli & Floor Art** | `photos/Work/Rangoli/` & `Work/CM Yogi/` | 33 | 33 | 0 | 4 |
| **Scrap Craft Sculptures** | `photos/Work/scrap craft/` | 73 | 73 | 0 | 3 |
| **Awards & Recognition** | `photos/awards/certificates and awards/` | 79 | 79 | 0 | 3 |
| **Press & Media Coverage** | `photos/awards/News articles/` | 283 | 265 | 18 | 1 |
| **TOTAL** | | **544** | **526** | **18** | **22** |

---

## 3. Discovered Subject Matter & Artistic Themes

### A. Profile (`public/photos/Dhirendra.jpeg`)
- **Subject:** Formal, high-resolution portrait of artist Dhirendra Pratap.
- **Visuals:** Warm studio lighting, traditional patterned printed kurta, direct gaze.
- **Placement:** Serves as the primary authentic portrait across the Hero, About, and Footer sections.

### B. Paintings & Sketches (8 items)
- **Magnolia Blossoms Diptych (`IMG_20250115_163125.jpg`):** Large acrylic painting on canvas showing textured white petals with golden centers against deep midnight blue.
- **Yellow Floral Composition (`IMG_20250115_145317.jpg`):** Acrylic floral study on canvas with vibrant yellow blossoms.
- **Contemplative Portrait in Graphite (`IMG_20221027_185129.jpg`):** Fine academic observational portrait of a young woman resting her chin in her hand, showcasing subtle graphite tonal blending.
- **Proportional Grid Portrait Study (`IMG_20221027_185117.jpg`):** Academic portrait drawing with visible graphite grid lines on paper.
- **Songbird on Blossoming Branch (`IMG_20250117_124751.jpg`):** Botanical painting on an interior architectural panel.
- **Official Portrait Presentations (`FB_IMG_1659231349500.jpg`, `FB_IMG_1672659981901.jpg`):** Documentation of custom-framed portrait sketches presented to senior officials.

### C. Wall Art & Public Murals (67 items)
- **Traditional Mud Folk Murals (`FB_IMG_1659977414990.jpg` et al.):** Vernacular wall paintings on mud plaster using natural white lime and terracotta pigments, featuring folk iconography, fish, lotus, rural deities, and regional rituals.
- **Urban Civic Retaining Wall Murals (`IMG_20230126_171344.jpg` et al.):** Multi-panel public murals painted along highway retainers and flyovers depicting Indian flora and fauna (rabbits, peacocks, tigers, cranes, wetlands).
- **On-Site Scaffolding & Compressor Practice (`IMG_20230118_164141.jpg` et al.):** Documentary photographs capturing scaffolding, industrial paint compressors, and team execution.

### D. Rangoli & Public Street Art (33 items)
- **Ceremonial Dignitary Welcome Rangoli (`Work/CM Yogi/` — 8 photos):** Grand geometric floor rangoli and floral carpets created for Uttar Pradesh Chief Minister Yogi Adityanath's ceremonial events in Lucknow.
- **COVID-19 Public Awareness Street Rangolis (`FB_IMG_1659231490342.jpg` et al.):** Monumental street rangolis painted on asphalt in Lucknow during 2020 lockdowns in collaboration with Civil Defence and the U.P. Recognized Journalist Association ("Stay Home", "Do Gaz Ki Doori").
- **Festive & Traditional Rangolis:** Intricate powdered pigment compositions.

### E. Scrap Craft Sculptures (73 items)
- **Monumental Elephant Sculpture (`FB_IMG_1669774667805.jpg` et al.):** Life-sized sculpted elephant with raised trunk constructed inside the artist's workshop.
- **Lion Head Relief Sculpture (`FB_IMG_1672844157572.jpg` et al.):** Expressive relief carving of a lion's head with stylized mane.
- **Humanoid Robot Sculpture:** Full-sized figurative robot assembled from discarded automotive components and industrial scrap metal.
- **Reptile & Animal Sculptures:** Monitor lizards and wildlife crafted from metal gears, bolts, and recycled mechanical parts.

### F. Certificates & Awards Archive (79 items)
- High-resolution batch scans (`SKM_C226i...`) and event photographs documenting:
  - **University of Lucknow:** Faculty of Arts / Fine Arts Department academic credentials and South Asia Wall Map appreciation certificate (April 2022).
  - **Lalit Kala Akademi (Ministry of Culture, Govt. of India):** Har Ghar Tiranga National Workshop Certificate (August 2022).
  - **Kala Shree Samman (2020):** Conferred by U.P. District Recognized Journalist Association for pandemic awareness street art.
  - **Uttar Pradesh Kala Ratna (2020):** Conferred by Afadul Hasan Welfare Society, Lucknow.
  - **Shan-e-Siddharth Urdu Daily:** Chitrakala appreciation certificate.
  - Stage mementoes, medals, and commendations from regional dignitaries.

### G. Press & Media Articles (283 items, 265 unique)
- **Konica Minolta bizhub Scans (`SKM_C226i250819...`):** 187 flatbed scans of printed scrapbooks and clippings.
- **Newspaper Clippings (`WhatsApp Image...`):** 96 photographs of articles from *Lok Nakshatra*, *Mohan Dhara*, *Shere Ballia*, *Dainik Jagran*, *Amar Ujala*, etc.
- **Documented Stories:** Feature articles on Dhirendra's scrap metal sculptures in Lucknow Zoo and Ayodhya, G20 beautification murals, COVID-19 temple wall art at Mankameshwar Math Mandir, and student achievements at University of Lucknow.

---

## 4. Cryptographic Duplicate Log (SHA-256 Exact Matches)

All 18 duplicates were identified within the `photos/awards/News articles/` directory, resulting from redundant WhatsApp image saves. The manifest flags each duplicate with `"isDuplicate": true` and links it to its canonical item via `"duplicateOf"`.

| # | Duplicate File | Canonical Original File | Canonical ID |
| :--- | :--- | :--- | :--- |
| 1 | `WhatsApp Image 2025-08-28 at 16.40.28.jpeg` | `WhatsApp Image 2025-08-28 at 16.40.25.jpeg` | `media-press-191` |
| 2 | `WhatsApp Image 2025-08-28 at 16.41.03.jpeg` | `WhatsApp Image 2025-08-28 at 16.40.20.jpeg` | `media-press-190` |
| 3 | `WhatsApp Image 2025-08-28 at 16.41.04.jpeg` | `WhatsApp Image 2025-08-28 at 16.41.04 (1).jpeg` | `media-press-194` |
| 4 | `WhatsApp Image 2025-08-28 at 16.41.05 (1).jpeg` | `WhatsApp Image 2025-08-28 at 16.41.03 (1).jpeg` | `media-press-193` |
| 5 | `WhatsApp Image 2025-08-28 at 16.41.05.jpeg` | `WhatsApp Image 2025-08-28 at 16.40.15.jpeg` | `media-press-188` |
| 6 | `WhatsApp Image 2025-08-28 at 16.41.06 (1).jpeg` | `WhatsApp Image 2025-08-28 at 16.41.04 (2).jpeg` | `media-press-195` |
| 7 | `WhatsApp Image 2025-08-28 at 16.41.06.jpeg` | `WhatsApp Image 2025-08-28 at 16.41.05 (2).jpeg` | `media-press-196` |
| 8 | `WhatsApp Image 2025-08-28 at 16.41.07 (2).jpeg` | `WhatsApp Image 2025-08-28 at 16.41.07 (1).jpeg` | `media-press-198` |
| 9 | `WhatsApp Image 2025-08-28 at 16.41.08.jpeg` | `WhatsApp Image 2025-08-28 at 16.40.18.jpeg` | `media-press-189` |
| 10 | `WhatsApp Image 2025-08-28 at 16.41.09 (2).jpeg` | `WhatsApp Image 2025-08-28 at 16.41.09 (1).jpeg` | `media-press-201` |
| 11 | `WhatsApp Image 2025-08-28 at 16.41.09.jpeg` | `WhatsApp Image 2025-08-28 at 16.41.08 (1).jpeg` | `media-press-200` |
| 12 | `WhatsApp Image 2025-08-28 at 16.41.11 (1).jpeg` | `WhatsApp Image 2025-08-28 at 16.41.09 (1).jpeg` | `media-press-201` |
| 13 | `WhatsApp Image 2025-08-28 at 16.41.36 (2).jpeg` | `WhatsApp Image 2025-08-28 at 16.41.33.jpeg` | `media-press-243` |
| 14 | `WhatsApp Image 2025-08-28 at 16.41.36.jpeg` | `WhatsApp Image 2025-08-28 at 16.41.32 (2).jpeg` | `media-press-242` |
| 15 | `WhatsApp Image 2025-08-28 at 16.41.37 (2).jpeg` | `WhatsApp Image 2025-08-28 at 16.41.35 (1).jpeg` | `media-press-246` |
| 16 | `WhatsApp Image 2025-08-28 at 16.41.37.jpeg` | `WhatsApp Image 2025-08-28 at 16.41.33.jpeg` | `media-press-243` |
| 17 | `WhatsApp Image 2025-08-28 at 16.41.38.jpeg` | `WhatsApp Image 2025-08-28 at 16.41.38 (1).jpeg` | `media-press-248` |
| 18 | `WhatsApp Image 2025-08-28 at 16.41.39.jpeg` | `WhatsApp Image 2025-08-28 at 16.41.38 (2).jpeg` | `media-press-249` |

---

## 5. Scalability & Automation Architecture

1. **Manifest Regeneration:** Whenever new images are added to `public/photos/**`, executing `npm run manifest` immediately re-indexes the directory, calculates SHA-256 hashes, categorizes assets, generates structured titles and descriptions, and updates both `src/data/media-manifest.json` and `src/data/media-manifest.ts`.
2. **Build-Time Integration:** The `npm run build` command is bound to run `manifest` first, ensuring that production static output is always in sync with real disk media without requiring manual Astro page editing.
