export interface ServiceImage {
  src: string;
  alt: string;
  caption: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  features: string[];
  images: ServiceImage[];
  inquiryParam: string;
  galleryCategory: string;
  galleryLink: string;
  featured?: boolean;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'wall-art-murals',
    title: 'Wall Art & Architectural Murals',
    badge: 'Civic & Commercial',
    description: 'Transforming bland concrete, urban boundaries, and interior spaces into vibrant visual stories. From landmark civic murals celebrating regional history to modern corporate feature walls and private luxury residences.',
    features: [
      'High-durability all-weather exterior primers and UV-stable pigments',
      'Thematic conceptualization (Cultural Heritage, Ramayana, Modern Abstract, Environmental)',
      'Large-scale surface scaffolding, wall preparation & anti-fungal sealing',
      'Execution across commercial spaces, educational campuses, highways & municipal walls'
    ],
    images: [
      {
        src: '/photos/Work/wall art/IMG_20240115_090548.jpg',
        alt: 'Lord Ram Divine Architectural Wall Mural in Ayodhya',
        caption: 'Ayodhya Civic Wall Art — Lord Ram Narrative Mural'
      },
      {
        src: '/photos/Work/wall art/IMG_20230326_201126.jpg',
        alt: 'Son Chiraiya Traditional Folk Art & Mythological Mural',
        caption: 'Folk Heritage Wall Art — Son Chiraiya Mural'
      }
    ],
    inquiryParam: 'Wall%20Art%20and%20Murals',
    galleryCategory: 'Wall Art',
    galleryLink: '/gallery?category=Wall%20Art',
    featured: true
  },
  {
    id: 'scrap-metal-sculptures',
    title: 'Recycled Scrap Metal Sculptures',
    badge: 'Eco & Monumental',
    description: 'Bespoke sculptural engineering created from industrial scrap, automotive components, discarded machinery gears, and steel structures. Turning scrap into iconic public monuments that command attention.',
    features: [
      'Life-sized animal, robotic, and abstract figurative steel fabrications',
      'Heavy-duty electric arc & MIG welding with internal structural armatures',
      'Anti-corrosion primer coats and weather-resistant industrial clear lacquers',
      'Turnkey delivery: design, fabrication, transport, and site anchoring'
    ],
    images: [
      {
        src: '/photos/Work/scrap craft/lion 1.jpg',
        alt: 'Recycled Scrap Metal Lion Sculpture by Dhirendra',
        caption: 'The Majestic Recycled Scrap Metal Lion'
      },
      {
        src: '/photos/Work/scrap craft/transformer 1.jpg',
        alt: 'Futuristic Scrap Metal Robot Sculpture',
        caption: 'Industrial Robot from Salvaged Machine Parts'
      }
    ],
    inquiryParam: 'Recycled%20Scrap%20Metal%20Sculptures',
    galleryCategory: 'Scrap Art',
    galleryLink: '/gallery?category=Scrap%20Art',
    featured: true
  },
  {
    id: 'foam-thermocol-art',
    title: 'Thermocol & Foam 3D Art & Reliefs',
    badge: '3D Sculpted & Thematic',
    description: 'Ultra-detailed three-dimensional sculptural models, festival tableaux, architectural temple replicas, and dynamic event centerpieces carved from high-density EPS foam and thermocol.',
    features: [
      'Precision hot-wire shaping, manual contour carving, and textured modeling',
      'Lightweight structural engineering ideal for suspended and grand overhead displays',
      'Plaster, acrylic, and composite coating for durability and realistic finishes',
      'Perfect for brand activations, cultural exhibitions, theatrical stages & festive themes'
    ],
    images: [
      {
        src: '/photos/Work/Foam art/elephant finished.jpg',
        alt: '3D Sculpted Foam Elephant Art by Dhirendra',
        caption: 'Hand-Carved Dimensional Elephant Artwork'
      },
      {
        src: '/photos/Work/Foam art/FB_IMG_1669785190621.jpg',
        alt: 'Architectural Foam Relief Installation',
        caption: 'High-Density Thematic Foam Structure'
      }
    ],
    inquiryParam: 'Thermocol%20and%20Foam%203D%20Art',
    galleryCategory: 'Foam Art',
    galleryLink: '/gallery?category=Foam%20Art'
  },
  {
    id: 'stage-scenography',
    title: 'Stage Design & Scenography',
    badge: 'Spatial & Events',
    description: 'Immersive stage environments, ceremonial backdrops, and architectural entrance gates for government galas, corporate annual conventions, and seasonal cultural festivals.',
    features: [
      'Spatial proscenium layout planning, 3D thematic gate structures, and backdrops',
      'Seamless integration of architectural illumination, banners, and sculptural props',
      'End-to-end on-site management: fabrication, rapid setup, and safe dismantling',
      'Proven execution for New Year festivals, state conventions, and cultural convocations'
    ],
    images: [
      {
        src: '/photos/Work/set design/IMG_20221231_172130.jpg',
        alt: 'Stage Set Design for New Year Festival by Dhirendra',
        caption: 'Grand Thematic Proscenium & Set Architecture'
      },
      {
        src: '/photos/Work/set design/IMG_20230322_200625.jpg',
        alt: 'Civic Stage and Floral Set Assembly',
        caption: 'Event Scenography & Spatial Fabrication'
      }
    ],
    inquiryParam: 'Stage%20and%20Set%20Design',
    galleryCategory: 'Set Design',
    galleryLink: '/gallery?category=Set%20Design'
  },
  {
    id: 'traditional-rangoli',
    title: 'Traditional & Ceremonial Rangoli',
    badge: 'Floor Art & Awareness',
    description: 'Signature ceremonial floor art and monumental public pavement installations created with mineral powders, vibrant sawdust, and organic floral petals for VIP convocations and civic occasions.',
    features: [
      'Portrait-precision floor rangoli honoring dignitary guests and national leaders',
      'Social awareness street rangolis (COVID-19 frontline tributes, Road Safety, Clean Air)',
      'Large-format geometric mandalas and cultural motifs spanning hundreds of square feet',
      'Celebrated across Raj Bhavan, Lucknow University, IAS/IPS forums, and civic centers'
    ],
    images: [
      {
        src: '/photos/Work/CM Yogi/FB_IMG_1672659784107.jpg',
        alt: 'Ceremonial Dignitary Welcome Rangoli for UP CM Yogi Adityanath by Dhirendra',
        caption: 'VIP Ceremonial Floor Rangoli & Floral Carpet'
      },
      {
        src: '/photos/Work/Rangoli/BM finished.jpg',
        alt: 'Portrait and Cultural Rangoli Installation',
        caption: 'Intricate Mineral Powder Ceremonial Rangoli'
      }
    ],
    inquiryParam: 'Ceremonial%20Rangoli',
    galleryCategory: 'Rangoli',
    galleryLink: '/gallery?category=Rangoli',
    featured: true
  },
  {
    id: 'fine-art-portraits',
    title: 'Fine Art Paintings & Custom Portraits',
    badge: 'Archival & Studio',
    description: 'Museum-standard original fine art paintings, custom portrait commissions, and observational sketches executed in oils, acrylics on linen, graphite, and charcoal.',
    features: [
      'MVA-level academic draftsmanship capturing nuanced likeness and psychological depth',
      'Archival canvas preparation, lightfast pigments, and protective varnishes',
      'VIP presentations, including commissioned portraits presented to Hon\'ble CM Yogi Adityanath',
      'Includes signed physical Certificate of Authenticity recording provenance and pigments'
    ],
    images: [
      {
        src: '/photos/Work/CM Yogi/FB_IMG_1672659760788 - Copy.jpg',
        alt: 'Portrait Presentation to Hon\'ble CM Yogi Adityanath',
        caption: 'Ceremonial Presentation to UP CM Yogi Adityanath'
      },
      {
        src: '/photos/Work/sketches & paintings/FB_IMG_1672659981901.jpg',
        alt: 'Studio Fine Art Portrait by Dhirendra',
        caption: 'Fine Art Canvas & Portrait Study'
      }
    ],
    inquiryParam: 'Fine%20Art%20and%20Portrait%20Commissions',
    galleryCategory: 'Paintings & Sketches',
    galleryLink: '/gallery?category=Paintings%20%26%20Sketches'
  },
  {
    id: 'graphic-design-branding',
    title: 'Graphic Design, Branding & Digital Art',
    badge: 'Vector & Visual Identity',
    description: 'Contemporary visual communication, logo design, vector illustrations, signage layouts, and brand identity systems that bridge classical artistic sensibility with digital precision.',
    features: [
      'Custom vector logos, brand identity guides, and typography palettes',
      'Promotional graphics, exhibition catalogues, and event signage systems',
      'High-resolution vector deliverables (AI, EPS, SVG, print-ready CMYK PDF)',
      'Direct creative direction tailored for commercial businesses, institutions & events'
    ],
    images: [
      {
        src: '/photos/Work/wall art/IMG_20230222_163323.jpg',
        alt: 'Graphic Vector Typography and Visual Design by Dhirendra',
        caption: 'Creative Typography & Visual Communication'
      },
      {
        src: '/photos/Work/wall art/IMG_20250114_170150.jpg',
        alt: 'Digital Grid Layout and Architectural Branding Composition',
        caption: 'Architectural Branding & Grid Composition'
      }
    ],
    inquiryParam: 'Graphic%20Design%20and%20Branding',
    galleryCategory: 'Paintings & Sketches',
    galleryLink: '/gallery?category=Paintings%20%26%20Sketches',
    featured: true
  }
];
