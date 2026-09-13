import type { Artwork } from '../../types/database';

export const ARTWORKS_DATA: Artwork[] = [
  {
    id: 'art-01',
    title: 'Silent Resonance in Crimson',
    slug: 'silent-resonance-in-crimson',
    description: 'An evocative exploration of interiority and emotional stillness. The interplay of deep alizarin crimson and muted earth tones creates a contemplative atmospheric presence, reflecting the artist’s inquiry into human expression and physical space.',
    year: 2025,
    medium: 'Oil and Mineral Pigment on Belgian Linen',
    category: 'Paintings',
    width: '48 in',
    height: '60 in',
    price: 85000,
    sale_type: 'FIXED_PRICE',
    availability: 'AVAILABLE',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-01a',
        artwork_id: 'art-01',
        storage_path: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Silent Resonance in Crimson - Oil painting on linen by Dhirendra, 2025',
        sort_order: 1,
        is_primary: true
      },
      {
        id: 'img-01b',
        artwork_id: 'art-01',
        storage_path: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=85',
        alt_text: 'Detail texture of Silent Resonance in Crimson',
        sort_order: 2,
        is_primary: false
      }
    ],
    created_at: '2025-02-10T10:00:00Z'
  },
  {
    id: 'art-02',
    title: 'The Solitary Observer',
    slug: 'the-solitary-observer',
    description: 'A delicate study of contemplative posture executed in raw vine charcoal and white gouache highlights on hand-toned rag paper. Drawn from life observations capturing the quiet dignity of rural elders.',
    year: 2024,
    medium: 'Charcoal and Gouache on Arches Archival Paper',
    category: 'Portraits',
    width: '30 in',
    height: '42 in',
    price: null,
    sale_type: 'OFFER',
    availability: 'AVAILABLE',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-02a',
        artwork_id: 'art-02',
        storage_path: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1400&q=85',
        alt_text: 'The Solitary Observer - Charcoal and gouache portrait by Dhirendra, 2024',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2024-11-15T12:30:00Z'
  },
  {
    id: 'art-03',
    title: 'Ephemeral Horizons',
    slug: 'ephemeral-horizons',
    description: 'Layered textures created with palette knives, natural sand, and raw acrylic impasto. This piece marks a transitional phase in the artist’s work towards expansive abstract landscapes that evoke morning mist over ancient riverbanks.',
    year: 2025,
    medium: 'Mixed Media, Natural Sand & Acrylic on Stretched Canvas',
    category: 'Abstract',
    width: '54 in',
    height: '36 in',
    price: 95000,
    sale_type: 'FIXED_PRICE',
    availability: 'AVAILABLE',
    featured: true,
    signature: false,
    images: [
      {
        id: 'img-03a',
        artwork_id: 'art-03',
        storage_path: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Ephemeral Horizons - Mixed media abstract landscape by Dhirendra',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2025-01-20T08:00:00Z'
  },
  {
    id: 'art-04',
    title: 'Study of Form & Shadow IV',
    slug: 'study-of-form-and-shadow-iv',
    description: 'An academic and expressive charcoal investigation examining anatomical tension and balance. Created as part of a master suite exploring Indian classical performance postures.',
    year: 2024,
    medium: 'Willow Charcoal & Sanguine on Heavyweight Cotton',
    category: 'Drawings',
    width: '24 in',
    height: '34 in',
    price: 45000,
    sale_type: 'FIXED_PRICE',
    availability: 'SOLD',
    featured: false,
    signature: false,
    images: [
      {
        id: 'img-04a',
        artwork_id: 'art-04',
        storage_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        alt_text: 'Study of Form & Shadow IV - Charcoal drawing by Dhirendra',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2024-08-14T14:00:00Z'
  },
  {
    id: 'art-05',
    title: 'Dialogue of Monoliths',
    slug: 'dialogue-of-monoliths',
    description: 'A monumental contemporary canvas engaging architectural rhythm and minimalist geometric tension. Dark graphite surfaces juxtaposed against raw burnt sienna bands.',
    year: 2025,
    medium: 'Oil, Cold Wax & Graphite on Canvas',
    category: 'Contemporary',
    width: '60 in',
    height: '72 in',
    price: null,
    sale_type: 'OFFER',
    availability: 'AVAILABLE',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-05a',
        artwork_id: 'art-05',
        storage_path: 'https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Dialogue of Monoliths - Contemporary oil and graphite on canvas by Dhirendra',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2025-03-01T15:00:00Z'
  },
  {
    id: 'art-06',
    title: 'Varanasi Nocturne: Steps of Light',
    slug: 'varanasi-nocturne-steps-of-light',
    description: 'Deep nocturnal blues and radiant temple lamplight dancing across the river water. A poignant tribute to North Indian spiritual architecture rendered through expressive impasto brushwork.',
    year: 2023,
    medium: 'Oil on Stretched Linen',
    category: 'Paintings',
    width: '40 in',
    height: '50 in',
    price: 110000,
    sale_type: 'FIXED_PRICE',
    availability: 'SOLD',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-06a',
        artwork_id: 'art-06',
        storage_path: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Varanasi Nocturne - Oil on linen by Dhirendra',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2023-10-18T11:00:00Z'
  },
  {
    id: 'art-07',
    title: 'Typographic Harmony & Vernacular Echo',
    slug: 'typographic-harmony-vernacular-echo',
    description: 'Bridging fine art composition with graphic typography. A limited-edition silkscreen print series exploring Devanagari script structures merged with modernist grid discipline.',
    year: 2024,
    medium: 'Archival Screenprint & Letterpress Ink on Somerset 300gsm',
    category: 'Graphics',
    width: '28 in',
    height: '40 in',
    price: 32000,
    sale_type: 'FIXED_PRICE',
    availability: 'AVAILABLE',
    featured: false,
    signature: false,
    images: [
      {
        id: 'img-07a',
        artwork_id: 'art-07',
        storage_path: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85',
        alt_text: 'Typographic Harmony - Archival screenprint by Dhirendra',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2024-05-12T09:00:00Z'
  },
  {
    id: 'art-08',
    title: 'Gaze into the Monsoon',
    slug: 'gaze-into-the-monsoon',
    description: 'A striking figurative portrait capturing the anticipation of the seasonal rains. Bold, expressive strokes contrast with delicate glazed treatment of facial contours.',
    year: 2025,
    medium: 'Oil & Tempera on Wood Panel',
    category: 'Portraits',
    width: '32 in',
    height: '40 in',
    price: null,
    sale_type: 'OFFER',
    availability: 'AVAILABLE',
    featured: true,
    signature: true,
    images: [
      {
        id: 'img-08a',
        artwork_id: 'art-08',
        storage_path: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1400&q=85',
        alt_text: 'Gaze into the Monsoon - Portrait by Dhirendra',
        sort_order: 1,
        is_primary: true
      }
    ],
    created_at: '2025-02-28T16:00:00Z'
  }
];
