-- ==============================================================================
-- DHIRENDRA ART GALLERY — SUPABASE INITIAL DATABASE SCHEMA
-- Migration: 20260913_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS / PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'curator', 'collector')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. ARTWORKS TABLE
CREATE TABLE IF NOT EXISTS public.artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  year INTEGER NOT NULL,
  medium TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Paintings', 'Portraits', 'Drawings', 'Contemporary', 'Abstract', 'Graphics', 'Other')),
  width TEXT NOT NULL,
  height TEXT NOT NULL,
  price NUMERIC(12, 2),
  sale_type TEXT NOT NULL DEFAULT 'FIXED_PRICE' CHECK (sale_type IN ('FIXED_PRICE', 'OFFER', 'NOT_FOR_SALE', 'SOLD')),
  availability TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (availability IN ('AVAILABLE', 'SOLD', 'ARCHIVED', 'IN_EXHIBITION')),
  featured BOOLEAN NOT NULL DEFAULT false,
  signature BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_artworks_slug ON public.artworks(slug);
CREATE INDEX IF NOT EXISTS idx_artworks_category ON public.artworks(category);
CREATE INDEX IF NOT EXISTS idx_artworks_availability ON public.artworks(availability);
CREATE INDEX IF NOT EXISTS idx_artworks_featured ON public.artworks(featured);

-- 3. ARTWORK IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.artwork_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_artwork_images_artwork_id ON public.artwork_images(artwork_id);

-- 4. BIDS / OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  offer_amount NUMERIC(12, 2) NOT NULL CHECK (offer_amount > 0),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTER_OFFER', 'CONVERTED')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bids_artwork_id ON public.bids(artwork_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON public.bids(status);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED', 'FAILED')),
  order_status TEXT NOT NULL DEFAULT 'PAYMENT_PENDING' CHECK (order_status IN (
    'OFFER_ACCEPTED',
    'PAYMENT_PENDING',
    'PAYMENT_RECEIVED',
    'PREPARING_ARTWORK',
    'PACKED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  )),
  shipping_address TEXT,
  tracking_courier TEXT,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);

-- 6. ORDER EVENTS / TIMELINE TABLE
CREATE TABLE IF NOT EXISTS public.order_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON public.order_events(order_id);

-- 7. ACHIEVEMENTS & RECOGNITION TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'National Awards',
    'State Awards',
    'Government Recognition',
    'District / DM Recognition',
    'Art Competitions',
    'Exhibitions',
    'Other Honours'
  )),
  location TEXT,
  description TEXT NOT NULL,
  image_path TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. PROJECTS TABLE (Beyond Fine Art: Graphics & Commercial Creative)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Graphic Design',
    'Visual Composition',
    'Commercial Creative',
    'Posters & Campaigns',
    'Film & Creative Direction'
  )),
  client_or_org TEXT,
  year INTEGER NOT NULL,
  description TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. PROJECT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1
);

-- 10. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'Artwork Purchase',
    'Artwork Commission',
    'Graphics Design',
    'Exhibition',
    'Collaboration',
    'Commercial Project',
    'General Enquiry'
  )),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'RESOLVED')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ARTWORKS: Public can read, Admins can write
CREATE POLICY "Public can view artworks" ON public.artworks
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage artworks" ON public.artworks
  FOR ALL USING (public.is_admin());

-- ARTWORK IMAGES: Public can read, Admins can write
CREATE POLICY "Public can view artwork images" ON public.artwork_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage artwork images" ON public.artwork_images
  FOR ALL USING (public.is_admin());

-- ACHIEVEMENTS: Public can view, Admins can manage
CREATE POLICY "Public can view achievements" ON public.achievements
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
  FOR ALL USING (public.is_admin());

-- PROJECTS: Public can view, Admins can manage
CREATE POLICY "Public can view projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL USING (public.is_admin());

-- PROJECT IMAGES: Public can view, Admins can manage
CREATE POLICY "Public can view project images" ON public.project_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage project images" ON public.project_images
  FOR ALL USING (public.is_admin());

-- BIDS: Public can insert their own bids, only admin can view/manage all bids
CREATE POLICY "Public can insert bids" ON public.bids
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage bids" ON public.bids
  FOR ALL USING (public.is_admin());

-- ORDERS: Public can view their order if order_number and email matches; admin can manage all
CREATE POLICY "Public can view own order by matching email" ON public.orders
  FOR SELECT USING (
    customer_email = current_setting('request.headers', true)::json->>'x-customer-email'
    OR public.is_admin()
  );

CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL USING (public.is_admin());

-- ORDER EVENTS: Accessible with order
CREATE POLICY "View order events" ON public.order_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = public.order_events.order_id
      AND (public.orders.customer_email = current_setting('request.headers', true)::json->>'x-customer-email' OR public.is_admin())
    )
  );

CREATE POLICY "Admins can manage order events" ON public.order_events
  FOR ALL USING (public.is_admin());

-- ENQUIRIES: Anyone can submit, only Admin can read
CREATE POLICY "Public can create enquiries" ON public.enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage enquiries" ON public.enquiries
  FOR ALL USING (public.is_admin());
