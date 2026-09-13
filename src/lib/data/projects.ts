import type { Project } from '../../types/database';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj-01',
    title: 'Heritage Typographic Visual Identity & Poster Campaign',
    category: 'Graphic Design',
    client_or_org: 'National Cultural Heritage Initiative',
    year: 2024,
    description: 'A contemporary visual communication system integrating classical Devanagari letterforms with modernist spatial hierarchy for a national cultural festival.',
    featured: true,
    images: [
      {
        id: 'pimg-01',
        project_id: 'proj-01',
        storage_path: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        sort_order: 1
      }
    ],
    created_at: '2024-06-10T10:00:00Z'
  },
  {
    id: 'proj-02',
    title: 'Cinematic Mood Palette & Atmospheric Set Concept Art',
    category: 'Film & Creative Direction',
    client_or_org: 'Independent Cinema Production',
    year: 2023,
    description: 'Visual composition, color scripting, and spatial atmosphere sketches for a period narrative feature exploring northern architectural heritage.',
    featured: true,
    images: [
      {
        id: 'pimg-02',
        project_id: 'proj-02',
        storage_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
        sort_order: 1
      }
    ],
    created_at: '2023-11-20T14:00:00Z'
  },
  {
    id: 'proj-03',
    title: 'Editorial Visual Composition & Book Jacket Design',
    category: 'Visual Composition',
    client_or_org: 'Literary Arts Guild',
    year: 2024,
    description: 'Hand-rendered linocut textures digitized and combined with refined serif typesetting for an anthology of modern regional poetry.',
    featured: true,
    images: [
      {
        id: 'pimg-03',
        project_id: 'proj-03',
        storage_path: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        sort_order: 1
      }
    ],
    created_at: '2024-09-05T09:00:00Z'
  },
  {
    id: 'proj-04',
    title: 'Brand Visual Architecture & Packaging Aesthetics',
    category: 'Commercial Creative',
    client_or_org: 'Organic Artisanal Botanicals',
    year: 2024,
    description: 'Art-led brand packaging incorporating botanical watercolor studies, custom typography, and gold-foil debossing.',
    featured: false,
    images: [
      {
        id: 'pimg-04',
        project_id: 'proj-04',
        storage_path: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
        sort_order: 1
      }
    ],
    created_at: '2024-04-18T16:00:00Z'
  }
];
