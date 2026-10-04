import type { Project } from '../../types/database';

export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj-01',
    title: 'COVID-19 Public Awareness Street Art Campaign',
    category: 'Public & Civic Art',
    client_or_org: 'Civil Defence H.S. 7 & U.P. Recognized Journalist Association',
    year: 2020,
    description: 'A large-scale street art and pavement rangoli campaign across Lucknow during the 2020 pandemic. Created to foster public vigilance and honor healthcare, police, and sanitation workers on the front lines.',
    featured: true,
    images: [
      {
        id: 'pimg-01',
        project_id: 'proj-01',
        storage_path: '/photos/Work/Rangoli/FB_IMG_1659231490342.jpg',
        sort_order: 1
      }
    ],
    created_at: '2020-05-10T10:00:00Z'
  },
  {
    id: 'proj-02',
    title: 'Monumental Wildlife & Recycled Scrap Sculptures',
    category: 'Scrap Sculptures',
    client_or_org: 'Urban Cultural & Ecological Initiatives',
    year: 2023,
    description: 'Large-scale 3D sculptures including a life-sized elephant, lion head reliefs, and humanoid robotics assembled from industrial scrap metal and recycled materials.',
    featured: true,
    images: [
      {
        id: 'pimg-02',
        project_id: 'proj-02',
        storage_path: '/photos/Work/scrap%20craft/transformer%206.jpg',
        sort_order: 1
      }
    ],
    created_at: '2023-01-10T14:00:00Z'
  },
  {
    id: 'proj-03',
    title: 'Urban Infrastructure Beautification Murals',
    category: 'Wall Murals',
    client_or_org: 'Civic Public Works & Heritage Councils',
    year: 2023,
    description: 'Large-format exterior wall murals executed across city flyovers, concrete retaining panels, and public walls celebrating Indian flora, fauna, and regional heritage.',
    featured: true,
    images: [
      {
        id: 'pimg-03',
        project_id: 'proj-03',
        storage_path: '/photos/Work/wall%20art/IMG_20230126_171344.jpg',
        sort_order: 1
      }
    ],
    created_at: '2023-01-26T09:00:00Z'
  },
  {
    id: 'proj-04',
    title: 'Ceremonial Dignitary Welcome Rangolis',
    category: 'Public & Civic Art',
    client_or_org: 'State Protocol & Cultural Affairs, Uttar Pradesh',
    year: 2024,
    description: 'Bespoke ceremonial floor art installations and floral carpets designed for high-profile state visits and occasions involving Hon\'ble Chief Minister Yogi Adityanath.',
    featured: true,
    images: [
      {
        id: 'pimg-04',
        project_id: 'proj-04',
        storage_path: '/photos/Work/CM%20Yogi/FB_IMG_1672659784107.jpg',
        sort_order: 1
      }
    ],
    created_at: '2024-03-08T07:00:00Z'
  }
];
