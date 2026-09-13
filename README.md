# Dhirendra — Artist & Graphics Designer
### Premium Digital Art Gallery & Artwork Acquisition Platform

A high-performance, contemporary digital art gallery and portfolio for **Dhirendra**, an accomplished Indian visual artist with BVA and MVA academic foundations, over seven years of dedicated studio practice, and honors across national, state, and government levels.

Designed with an **exhibition catalogue art direction** (editorial typography, asymmetric compositions, museum-grade framing, and generous negative space) — strictly avoiding generic AI templates or SaaS styling.

---

## 🏛️ Key Capabilities

1. **Exhibition Catalogue (`/gallery`)**:
   - Interactive filtering by artistic disciplines (Paintings, Portraits, Drawings, Contemporary, Abstract, Graphics & Prints).
   - Filter by acquisition availability (Available, Acquired / Sold).
   - Curated ordering, creation year sorting, and view toggling (Editorial Asymmetric vs Exhibition Grid).
   - High-resolution modal zoom lightbox for surface texture inspection.

2. **Artwork Detail & Direct Acquisition (`/gallery/[slug]`)**:
   - Individual canonical URLs with structured data (`VisualArtwork` JSON-LD).
   - Fixed Studio Valuation acquisition flow with customer address collection.
   - **Direct Collector Offers / Bidding**: Collectors can propose offers directly to the artist's curatorial desk for designated masterworks.
   - Hand-signed Certificate of Authenticity guarantee.

3. **Curatorial Biography & Provenance (`/about`)**:
   - Academic foundations: Bachelor of Visual Arts (BVA) and Master of Visual Arts (MVA) with first-class distinction.
   - Artistic philosophy in the artist's own words.
   - Chronological career timeline (2017 to Present).
   - Verified awards: National Lalit Kala Akademi, State Kala Ratna, District Magistrate Citations, and Ministry of Culture Fellowship.
   - Secondary discipline presentation: Graphics design, typography, and commercial creative direction without overshadowing the fine art core.

4. **Studio Inquiries & Commissions (`/contact`)**:
   - Multi-channel inquiry dispatch for artwork purchase, private commissions, exhibitions, and graphic design collaborations.

5. **Consignment Order Tracking (`/order-tracking`)**:
   - Real-time consignment status tracking using Order Reference IDs (e.g. `DAG-2026-0012`).
   - Visual 6-stage lifecycle: *Offer Accepted &rarr; Payment Verified &rarr; Archival Preparation &rarr; Museum Crated &rarr; In Transit &rarr; Delivered*.
   - Complete event audit history and carrier waybill details.

6. **Studio CMS Administration (`/admin`)**:
   - Curatorial Dashboard displaying total artworks, available works, sold works, pending offers, active consignments, and inquiries.
   - Offer management with Accept / Reject controls.
   - Shipment logistics tracking and status updates.

---

## ⚙️ Technical Architecture

```text
                     VERCEL / Portable Host
                               │
                               ▼
                            ASTRO 5+
                               │
             ┌─────────────────┴─────────────────┐
             │                                   │
        Astro Pages                         React Islands
             │                                   │
      Static Generation                 ┌────────┼────────┐
      • Home (`/`)                      │        │        │
      • Gallery (`/gallery`)         Gallery   Bids    Tracking
      • Detail (`/gallery/[slug]`)   Filter    Modal   Timeline
      • About (`/about`)
      • Contact (`/contact`)
      • Admin (`/admin`)
             │
             ▼
          Supabase (PostgreSQL + RLS + Storage)
             ├── artworks & artwork_images
             ├── bids / offers
             ├── orders & order_events
             ├── achievements
             ├── projects & project_images
             └── enquiries
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `>=22.12.0`
- npm

### 2. Installation
```bash
npm install
```

### 3. Development Server
Start the dev server in background mode as per project standard:
```bash
npm run astro -- dev --background
```
Manage the background server:
```bash
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

Or run interactively:
```bash
npm run dev
```
Visit `http://localhost:4321` in your browser.

### 4. Production Build
```bash
npm run build
```
Preview the built static release:
```bash
npm run preview
```

---

## 🗄️ Supabase Setup & Database Migration

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Run the initial SQL migration located at:
   ```text
   supabase/migrations/20260913_initial_schema.sql
   ```
   This script creates all 10 tables, indexes, and Row Level Security (RLS) policies.
3. Run the initial seed script to populate sample exhibition artworks and verified achievements:
   ```text
   supabase/seed/seed_data.sql
   ```
4. Copy `.env.example` to `.env` and configure your credentials:
   ```bash
   cp .env.example .env
   ```
   Fill in `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

*(Note: When Supabase environment variables are omitted during local design exploration, the application gracefully operates using the verified local curatorial dataset).*

---

## 📦 Project Directory Structure

```text
dhirendra-pratap/
├── src/
│   ├── components/
│   │   ├── artwork/
│   │   │   ├── ArtworkActionButtons.tsx   # React acquisition & offer buttons
│   │   │   └── ArtworkCard.astro          # Editorial artwork exhibition plaque
│   │   ├── forms/
│   │   │   ├── ContactForm.tsx            # Multi-category inquiry form
│   │   │   ├── MakeOfferModal.tsx         # Direct collector offer proposal modal
│   │   │   └── PurchaseModal.tsx          # Fixed valuation acquisition modal
│   │   ├── gallery/
│   │   │   └── GalleryFilter.tsx          # Interactive catalogue filter & lightbox
│   │   ├── layout/
│   │   │   ├── Header.astro               # Exhibition navigation bar
│   │   │   └── Footer.astro               # Museum colophon & certificate assurance
│   │   └── tracking/
│   │       └── OrderTracker.tsx           # Interactive 6-stage consignment timeline
│   ├── layouts/
│   │   └── BaseLayout.astro               # SEO metadata, Google Fonts, JSON-LD Schema
│   ├── lib/
│   │   ├── artworks.ts                    # Artwork repository & Supabase queries
│   │   ├── bids.ts                        # Collector offer submission service
│   │   ├── enquiries.ts                   # Studio inquiry service
│   │   ├── orders.ts                      # Order tracking & reservation service
│   │   ├── supabase.ts                    # Supabase client & fallback initialization
│   │   └── data/
│   │       ├── achievements.ts            # Verified awards & honors dataset
│   │       ├── artworks.ts                # Verified initial artworks dataset
│   │       ├── orders.ts                  # Sample orders (e.g. DAG-2026-0012)
│   │       └── projects.ts                # Secondary graphics/commercial projects
│   ├── pages/
│   │   ├── index.astro                    # Exhibition homepage
│   │   ├── about.astro                    # Curatorial biography, BVA/MVA, timeline
│   │   ├── contact.astro                  # Studio inquiries & commissions
│   │   ├── order-tracking.astro           # Consignment tracking console
│   │   ├── admin/
│   │   │   ├── dashboard.astro            # CMS metrics, bids, inventory & orders
│   │   │   ├── index.astro                # Redirects to dashboard
│   │   │   └── login.astro                # Studio administrative login
│   │   ├── api/
│   │   │   ├── bids.ts                    # Offer endpoint (GET & POST)
│   │   │   ├── enquiries.ts               # Inquiries endpoint (GET & POST)
│   │   │   └── orders.ts                  # Orders & tracking endpoint (GET & POST)
│   │   └── gallery/
│   │       ├── index.astro                # Digital exhibition catalogue
│   │       └── [slug].astro               # Dynamic individual artwork showcase
│   ├── styles/
│   │   └── global.css                     # Tailwind v4 theme, gallery canvas & fonts
│   └── types/
│       └── database.ts                    # TypeScript interfaces for Supabase schema
├── supabase/
│   ├── migrations/
│   │   └── 20260913_initial_schema.sql    # Complete SQL schema & RLS policies
│   └── seed/
│       └── seed_data.sql                  # Seed data SQL
├── public/
│   └── favicon.svg                        # Artist monogram mark
├── astro.config.mjs                       # Astro config with React & Tailwind v4 Vite
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎨 Design System & Anti-AI Rules Adherence

- **Visual Direction**: Contemporary digital gallery & museum exhibition catalogue.
- **Palette**: Natural gallery canvas (`#FBFBF9`), warm subtle matting (`#F4F1EA`), deep charcoal ink (`#141311`), and terracotta bronze accents (`#9B4722`, `#B68B35`).
- **Typography**: Display serif (`Cormorant Garamond`) paired with modern structural sans (`Plus Jakarta Sans`).
- **No Generic Cards**: Asymmetric editorial layout with variable artwork aspect ratios, avoiding repetitive 3-column boilerplate templates.
- **Artist Positioning**: **“Dhirendra — Artist & Graphics Designer”** is the headline identity throughout the site. Film and commercial creative projects are kept strictly as a secondary capability.
