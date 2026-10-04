import type { Artwork } from '../../types/database';

export const ARTWORKS_DATA: Artwork[] = [
  {
    id: 'art-01',
    title: 'Artistic Portfolio Presentation to DGP (UP Police)',
    slug: 'artistic-presentation-dgp-up-police',
    description: 'Special felicitation and artistic portfolio presentation by visual artist Dhirendra Pratap to the Director General of Police (DGP) at the Uttar Pradesh Police Headquarters, Lucknow.',
    year: 2024,
    medium: 'Artistic Portfolio & Dignitary Felicitation',
    category: 'Portraits',
    width: '12 in',
    height: '16 in',
    price: null,
    sale_type: 'NOT_FOR_SALE',
    availability: 'ARCHIVED',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-01a',
        artwork_id: 'art-01',
        storage_path: '/photos/awards/certificates%20and%20awards/438304121_950748996557945_5294600570921436411_n.jpg',
        alt_text: 'Artistic portfolio presentation to the DGP (UP Police) by visual artist Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2024-04-15T10:00:00Z'
  },
  {
    id: 'art-02',
    title: 'Contemplative Portrait Study in Graphite',
    slug: 'contemplative-portrait-study',
    description: 'A delicate observational pencil portrait study of a young woman resting her chin in thoughtful repose. Drawn from life observations capturing the quiet dignity of human expression, subtle graphite gradations, and intricate hair texture.',
    year: 2022,
    medium: 'Graphite on Heavyweight Archival Drawing Paper',
    category: 'Portraits',
    width: '18 in',
    height: '24 in',
    price: null,
    sale_type: 'OFFER',
    availability: 'AVAILABLE',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-02a',
        artwork_id: 'art-02',
        storage_path: '/photos/Work/sketches%20&%20paintings/IMG_20221027_185129.jpg',
        alt_text: 'Contemplative Portrait Study - Graphite drawing by Dhirendra Pratap, 2022',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2022-10-27T18:51:00Z'
  },
  {
    id: 'art-03',
    title: 'Yellow Floral Study on Midnight Ground',
    slug: 'yellow-floral-study',
    description: 'Luminous acrylic floral study with broad, gestural yellow petals and dark textured centers. The contrast against deep navy grounds reflects Dhirendra’s inquiry into spatial depth and botanical balance.',
    year: 2025,
    medium: 'Acrylic on Stretched Canvas',
    category: 'Paintings',
    width: '36 in',
    height: '48 in',
    price: 65000,
    sale_type: 'FIXED_PRICE',
    availability: 'AVAILABLE',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-03a',
        artwork_id: 'art-03',
        storage_path: '/photos/Work/sketches%20&%20paintings/IMG_20250115_145317.jpg',
        alt_text: 'Yellow Floral Study on Midnight Ground - Acrylic painting by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2025-01-15T14:53:00Z'
  },
  {
    id: 'art-04',
    title: 'Portrait of a Young Woman with Academic Grid',
    slug: 'portrait-young-woman-grid',
    description: 'An academic graphite portrait study displaying the artist’s preliminary proportional grid. Created as part of classical drawing studies at the Faculty of Fine Arts, University of Lucknow.',
    year: 2022,
    medium: 'Graphite and Academic Grid on Archival Paper',
    category: 'Drawings',
    width: '16 in',
    height: '22 in',
    price: 35000,
    sale_type: 'FIXED_PRICE',
    availability: 'AVAILABLE',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-04a',
        artwork_id: 'art-04',
        storage_path: '/photos/Work/sketches%20&%20paintings/IMG_20221027_185117.jpg',
        alt_text: 'Portrait of a Young Woman with Academic Grid - Drawing by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2022-10-27T18:51:00Z'
  },
  {
    id: 'art-05',
    title: 'Traditional Folk Mud Wall Mural',
    slug: 'traditional-folk-mud-wall-mural',
    description: 'Monumental vernacular wall mural painted on clay-plastered walls using natural white lime and terracotta pigments. Depicts indigenous regional motifs, sacred symbolism, river fauna, and rural figures in an enduring folk tradition.',
    year: 2022,
    medium: 'Natural Lime & Terracotta Pigment on Mud Plaster',
    category: 'Wall Art',
    width: '180 in',
    height: '96 in',
    price: null,
    sale_type: 'NOT_FOR_SALE',
    availability: 'ARCHIVED',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-05a',
        artwork_id: 'art-05',
        storage_path: '/photos/Work/wall%20art/FB_IMG_1659977414990.jpg',
        alt_text: 'Traditional Indian Folk Mud Wall Mural by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2022-08-08T12:00:00Z'
  },
  {
    id: 'art-06',
    title: 'Urban Civic Retaining Wall Mural — Wildlife & Flora',
    slug: 'urban-civic-retaining-wall-mural',
    description: 'Large-scale civic infrastructure mural painted across urban concrete retaining walls. Features Indian wildlife, botanical foliage, and environmental themes executed with weather-resistant exterior coatings.',
    year: 2023,
    medium: 'Exterior Weather-Resistant Pigments on Concrete Infrastructure',
    category: 'Wall Art',
    width: '240 in',
    height: '120 in',
    price: null,
    sale_type: 'NOT_FOR_SALE',
    availability: 'ARCHIVED',
    featured: true,
    signature: false,
    images: [
      {
        id: 'img-06a',
        artwork_id: 'art-06',
        storage_path: '/photos/Work/wall%20art/IMG_20230126_171344.jpg',
        alt_text: 'Urban Civic Retaining Wall Mural - Public art by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2023-01-26T17:13:00Z'
  },
  {
    id: 'art-07',
    title: 'Monumental Transformer Reclaimed Metal Sculpture',
    slug: 'monumental-transformer-sculpture',
    description: 'Monumental multi-component mech warrior sculpture constructed entirely from discarded automotive gears, suspension springs, wheel rims, and industrial scrap plates, finished in striking cobalt blue.',
    year: 2023,
    medium: 'Welded Reclaimed Industrial Steel & Automotive Scrap',
    category: 'Scrap Craft',
    width: '48 in',
    height: '84 in',
    price: null,
    sale_type: 'OFFER',
    availability: 'AVAILABLE',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-07a',
        artwork_id: 'art-07',
        storage_path: '/photos/Work/scrap%20craft/transformer%206.jpg',
        alt_text: 'Monumental Transformer Reclaimed Metal Sculpture by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2023-08-18T18:00:00Z'
  },
  {
    id: 'art-08',
    title: 'Ceremonial Dignitary Welcome Rangoli',
    slug: 'ceremonial-dignitary-welcome-rangoli',
    description: 'Photographic documentation of a grand ceremonial floor rangoli and fresh flower carpet created by Dhirendra for the official visit of Uttar Pradesh Chief Minister Yogi Adityanath. An elaborate composition of sacred geometry and vibrant natural dyes.',
    year: 2023,
    medium: 'Natural Dry Pigments, Sacred Powders & Fresh Floral Petals',
    category: 'Rangoli',
    width: '144 in',
    height: '144 in',
    price: null,
    sale_type: 'NOT_FOR_SALE',
    availability: 'ARCHIVED',
    featured: true,
    signature: false,
    images: [
      {
        id: 'img-08a',
        artwork_id: 'art-08',
        storage_path: '/photos/Work/CM%20Yogi/FB_IMG_1672659784107.jpg',
        alt_text: 'Ceremonial floor rangoli and floral carpet for UP CM Yogi Adityanath event by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2023-01-02T10:00:00Z'
  },
  {
    id: 'art-09',
    title: 'COVID-19 Awareness Street Rangoli — "Stay Home"',
    slug: 'covid19-awareness-street-rangoli',
    description: 'Monumental civic street art created on asphalt during the 2020 pandemic in Lucknow in collaboration with Civil Defence and the Journalist Association. Depicts frontline workers combating the coronavirus and urging citizens to stay safe.',
    year: 2020,
    medium: 'Civic Powder Pigments on City Asphalt',
    category: 'Rangoli',
    width: '216 in',
    height: '216 in',
    price: null,
    sale_type: 'NOT_FOR_SALE',
    availability: 'ARCHIVED',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-09a',
        artwork_id: 'art-09',
        storage_path: '/photos/Work/Rangoli/FB_IMG_1659231490342.jpg',
        alt_text: 'COVID-19 Stay Home Civil Defence Street Rangoli by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2020-05-10T09:00:00Z'
  },
  {
    id: 'art-10',
    title: 'Monumental Elephant Foam Art Sculpture',
    slug: 'monumental-elephant-sculpture',
    description: 'Full-scale three-dimensional sculpture of an elephant with raised trunk, sculpted inside the artist’s workshop using high-density foam blocks and structural armatures.',
    year: 2022,
    medium: 'Hand-Carved High-Density Foam & Sculpted Armature',
    category: 'Foam Art',
    width: '96 in',
    height: '84 in',
    price: null,
    sale_type: 'OFFER',
    availability: 'AVAILABLE',
    featured: true,
    signature: false,
    images: [
      {
        id: 'img-10a',
        artwork_id: 'art-10',
        storage_path: '/photos/Work/Foam%20art/elephant%20finished.jpg',
        alt_text: 'Life-sized sculpted foam elephant by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2022-11-30T10:00:00Z'
  },
  {
    id: 'art-11',
    title: 'Lion Head Relief Sculpture',
    slug: 'lion-head-relief-sculpture',
    description: 'Expressive sculptural relief of a lion’s head with a stylized flowing mane, forged from reclaimed industrial scrap metal.',
    year: 2023,
    medium: 'Forged & Welded Industrial Scrap Metal Relief',
    category: 'Scrap Craft',
    width: '36 in',
    height: '48 in',
    price: null,
    sale_type: 'OFFER',
    availability: 'AVAILABLE',
    featured: true,
    signature: false,
    images: [
      {
        id: 'img-11a',
        artwork_id: 'art-11',
        storage_path: '/photos/Work/scrap%20craft/lion%201.jpg',
        alt_text: 'The Majestic Recycled Scrap Metal Lion by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2023-01-04T12:00:00Z'
  },
  {
    id: 'art-12',
    title: 'Commissioned Dignitary Portrait Presentation',
    slug: 'commissioned-dignitary-portrait-presentation',
    description: 'Photographic documentation of artist Dhirendra presenting a custom-framed graphite portrait sketch to an official dignitary. Part of the artist’s commissioned portraiture work.',
    year: 2022,
    medium: 'Framed Graphite on Paper Presentation',
    category: 'Portraits',
    width: '20 in',
    height: '26 in',
    price: null,
    sale_type: 'NOT_FOR_SALE',
    availability: 'SOLD',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-12a',
        artwork_id: 'art-12',
        storage_path: '/photos/Work/sketches%20&%20paintings/FB_IMG_1659231349500.jpg',
        alt_text: 'Framed portrait presentation by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
  },
  {
    id: 'art-13',
    title: 'Portrait Presentation to Hon\'ble CM Yogi Adityanath',
    slug: 'portrait-presentation-cm-yogi-adityanath',
    description: 'Special felicitation and ceremonial presentation of a custom-framed fine art portrait directly to Uttar Pradesh Chief Minister Yogi Adityanath by artist Dhirendra Pratap.',
    year: 2023,
    medium: 'Commissioned Portrait & Ceremonial Felicitation',
    category: 'Portraits',
    width: '24 in',
    height: '32 in',
    price: null,
    sale_type: 'NOT_FOR_SALE',
    availability: 'ARCHIVED',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-13a',
        artwork_id: 'art-13',
        storage_path: '/photos/Work/CM%20Yogi/FB_IMG_1672659760788%20-%20Copy.jpg',
        alt_text: 'Portrait presentation to Hon\'ble CM Yogi Adityanath by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2023-01-02T11:00:00Z'
  },
  {
    id: 'art-14',
    title: 'Architectural Wall Art Installation 48',
    slug: 'architectural-wall-art-installation-48',
    description: 'Site-specific architectural wall mural executed as part of public cultural beautification and heritage enhancement projects in Uttar Pradesh.',
    year: 2024,
    medium: 'Exterior Weather-Resistant Pigments & Acrylic on Prepared Concrete',
    category: 'Wall Art',
    width: '192 in',
    height: '96 in',
    price: null,
    sale_type: 'NOT_FOR_SALE',
    availability: 'ARCHIVED',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-14a',
        artwork_id: 'art-14',
        storage_path: '/photos/Work/wall%20art/IMG_20240114_124057.jpg',
        alt_text: 'Architectural Wall Art Installation 48 by Dhirendra Pratap',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2024-01-14T12:40:57Z'
  }
];
