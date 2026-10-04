export type SaleType = 'FIXED_PRICE' | 'OFFER' | 'NOT_FOR_SALE' | 'SOLD';
export type Availability = 'AVAILABLE' | 'SOLD' | 'ARCHIVED' | 'IN_EXHIBITION';
export type ArtworkCategory = 
  | 'Paintings' 
  | 'Portraits' 
  | 'Drawings' 
  | 'Contemporary' 
  | 'Abstract' 
  | 'Graphics' 
  | 'Wall Art'
  | 'Rangoli'
  | 'Scrap Craft'
  | 'Foam Art'
  | 'Other';

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTER_OFFER' | 'CONVERTED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

export type OrderStatus = 
  | 'OFFER_ACCEPTED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_RECEIVED'
  | 'PREPARING_ARTWORK'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type AchievementCategory = 
  | 'National Awards'
  | 'State Awards'
  | 'Government Recognition'
  | 'District / DM Recognition'
  | 'Art Competitions'
  | 'Exhibitions'
  | 'Other Honours';

export type ProjectCategory = 
  | 'Graphic Design'
  | 'Visual Composition'
  | 'Commercial Creative'
  | 'Posters & Campaigns'
  | 'Film & Creative Direction'
  | 'Public & Civic Art'
  | 'Scrap Sculptures'
  | 'Wall Murals';

export type EnquiryType = 
  | 'Artwork Purchase'
  | 'Artwork Commission'
  | 'Graphics Design'
  | 'Exhibition'
  | 'Collaboration'
  | 'Commercial Project'
  | 'General Enquiry';

export interface ArtworkImage {
  id: string;
  artwork_id: string;
  storage_path: string; // URL or storage path
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  description: string;
  year: number;
  medium: string;
  category: ArtworkCategory;
  width: string; // e.g. "36 in" or "91 cm"
  height: string; // e.g. "48 in" or "122 cm"
  price?: number | null; // in INR
  sale_type: SaleType;
  availability: Availability;
  featured: boolean;
  signature: boolean;
  images: ArtworkImage[];
  created_at: string;
  updated_at?: string;
}

export interface Bid {
  id: string;
  artwork_id: string;
  artwork_title?: string;
  name: string;
  email: string;
  phone: string;
  offer_amount: number;
  message?: string;
  status: BidStatus;
  created_at: string;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  status: OrderStatus;
  note?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string; // e.g. "DAG-2026-0012"
  artwork_id: string;
  artwork?: Artwork;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  shipping_address?: string;
  tracking_courier?: string;
  tracking_number?: string;
  events: OrderEvent[];
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: number;
  category: AchievementCategory;
  location?: string;
  description: string;
  image_path?: string;
  featured: boolean;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  storage_path: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  client_or_org?: string;
  year: number;
  description: string;
  featured: boolean;
  images: ProjectImage[];
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: EnquiryType;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'RESOLVED';
  created_at: string;
}
