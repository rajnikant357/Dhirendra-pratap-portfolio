-- ==============================================================================
-- DHIRENDRA ART GALLERY — SEED DATA
-- ==============================================================================

-- 1. Insert Initial Artworks
INSERT INTO public.artworks (id, title, slug, description, year, medium, category, width, height, price, sale_type, availability, featured, signature)
VALUES
  ('c1a2e5d1-1111-4444-9999-000000000001', 'Silent Resonance in Crimson', 'silent-resonance-in-crimson', 'An evocative exploration of interiority and emotional stillness. The interplay of deep alizarin crimson and muted earth tones creates a contemplative atmospheric presence.', 2025, 'Oil and Mineral Pigment on Belgian Linen', 'Paintings', '48 in', '60 in', 85000, 'FIXED_PRICE', 'AVAILABLE', true, true),
  ('c1a2e5d1-1111-4444-9999-000000000002', 'The Solitary Observer', 'the-solitary-observer', 'A delicate study of contemplative posture executed in raw vine charcoal and white gouache highlights on hand-toned rag paper.', 2024, 'Charcoal and Gouache on Arches Archival Paper', 'Portraits', '30 in', '42 in', NULL, 'OFFER', 'AVAILABLE', true, true),
  ('c1a2e5d1-1111-4444-9999-000000000003', 'Ephemeral Horizons', 'ephemeral-horizons', 'Layered textures created with palette knives, natural sand, and raw acrylic impasto, evoking morning mist over ancient riverbanks.', 2025, 'Mixed Media, Natural Sand & Acrylic on Stretched Canvas', 'Abstract', '54 in', '36 in', 95000, 'FIXED_PRICE', 'AVAILABLE', true, false),
  ('c1a2e5d1-1111-4444-9999-000000000004', 'Study of Form & Shadow IV', 'study-of-form-and-shadow-iv', 'An academic and expressive charcoal investigation examining anatomical tension and balance.', 2024, 'Willow Charcoal & Sanguine on Heavyweight Cotton', 'Drawings', '24 in', '34 in', 45000, 'FIXED_PRICE', 'SOLD', false, false),
  ('c1a2e5d1-1111-4444-9999-000000000005', 'Dialogue of Monoliths', 'dialogue-of-monoliths', 'A monumental contemporary canvas engaging architectural rhythm and minimalist geometric tension.', 2025, 'Oil, Cold Wax & Graphite on Canvas', 'Contemporary', '60 in', '72 in', NULL, 'OFFER', 'AVAILABLE', true, true),
  ('c1a2e5d1-1111-4444-9999-000000000006', 'Varanasi Nocturne: Steps of Light', 'varanasi-nocturne-steps-of-light', 'Deep nocturnal blues and radiant temple lamplight dancing across the river water.', 2023, 'Oil on Stretched Linen', 'Paintings', '40 in', '50 in', 110000, 'FIXED_PRICE', 'SOLD', true, true),
  ('c1a2e5d1-1111-4444-9999-000000000007', 'Typographic Harmony & Vernacular Echo', 'typographic-harmony-vernacular-echo', 'Bridging fine art composition with graphic typography. Archival silkscreen print exploring Devanagari script structures.', 2024, 'Archival Screenprint & Letterpress Ink on Somerset 300gsm', 'Graphics', '28 in', '40 in', 32000, 'FIXED_PRICE', 'AVAILABLE', false, false),
  ('c1a2e5d1-1111-4444-9999-000000000008', 'Gaze into the Monsoon', 'gaze-into-the-monsoon', 'A striking figurative portrait capturing the anticipation of the seasonal rains.', 2025, 'Oil & Tempera on Wood Panel', 'Portraits', '32 in', '40 in', NULL, 'OFFER', 'AVAILABLE', true, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Artwork Images
INSERT INTO public.artwork_images (artwork_id, storage_path, alt_text, sort_order, is_primary)
VALUES
  ('c1a2e5d1-1111-4444-9999-000000000001', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=85', 'Silent Resonance in Crimson - Oil on Belgian Linen by Dhirendra', 1, true),
  ('c1a2e5d1-1111-4444-9999-000000000002', 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1400&q=85', 'The Solitary Observer - Charcoal and gouache portrait by Dhirendra', 1, true),
  ('c1a2e5d1-1111-4444-9999-000000000003', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=85', 'Ephemeral Horizons - Mixed media abstract landscape by Dhirendra', 1, true),
  ('c1a2e5d1-1111-4444-9999-000000000004', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85', 'Study of Form & Shadow IV - Charcoal drawing by Dhirendra', 1, true),
  ('c1a2e5d1-1111-4444-9999-000000000005', 'https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=1600&q=85', 'Dialogue of Monoliths - Contemporary canvas by Dhirendra', 1, true),
  ('c1a2e5d1-1111-4444-9999-000000000006', 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1600&q=85', 'Varanasi Nocturne - Oil on linen by Dhirendra', 1, true),
  ('c1a2e5d1-1111-4444-9999-000000000007', 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85', 'Typographic Harmony - Archival screenprint by Dhirendra', 1, true),
  ('c1a2e5d1-1111-4444-9999-000000000008', 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1400&q=85', 'Gaze into the Monsoon - Portrait by Dhirendra', 1, true)
ON CONFLICT DO NOTHING;

-- 3. Insert Achievements
INSERT INTO public.achievements (title, organization, year, category, location, description, featured)
VALUES
  ('National Lalit Kala Akademi Participation & Merit', 'Lalit Kala Akademi, New Delhi', 2024, 'National Awards', 'New Delhi, India', 'Recognized at the premier national level visual arts exhibition for innovative contemporary figurative practice.', true),
  ('State Kala Ratna Award for Visual Arts', 'State Academy of Fine Arts', 2023, 'State Awards', 'Uttar Pradesh, India', 'Conferred for outstanding dedication to contemporary fine arts and cultural revival.', true),
  ('Government Excellence Citation by District Magistrate (DM)', 'District Administration / Cultural Affairs Department', 2023, 'District / DM Recognition', 'Varanasi Division, India', 'Special felicitation and citation by the District Magistrate in recognition of public artistic contribution.', true),
  ('Ministry of Culture Visual Arts Fellowship Grant', 'Ministry of Culture, Government of India', 2022, 'Government Recognition', 'India', 'Awarded research and studio grant for documenting traditional Indian pigments in modern context.', true),
  ('Annual Visual Arts Solo Exhibition: "Resonance of Soil"', 'State Lalit Kala Gallery', 2024, 'Exhibitions', 'Lucknow, India', 'Curated solo exhibition displaying 24 large-scale oil and charcoal works.', true)
ON CONFLICT DO NOTHING;
