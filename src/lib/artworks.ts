import { ARTWORKS_DATA } from './data/artworks';
import { supabase, isSupabaseConfigured } from './supabase';
import type { Artwork, ArtworkCategory, Availability } from '../types/database';

export async function getAllArtworks(): Promise<Artwork[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          images:artwork_images(*)
        `)
        .order('year', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Artwork[];
      }
    } catch (err) {
      console.warn('Supabase fetch error, falling back to local dataset', err);
    }
  }
  return ARTWORKS_DATA;
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  const all = await getAllArtworks();
  return all.filter((art) => art.featured);
}

export async function getSignatureArtworks(): Promise<Artwork[]> {
  const all = await getAllArtworks();
  return all.filter((art) => art.signature);
}

const LEGACY_SLUG_MAP: Record<string, string> = {
  'artistic-presentation-dgp-prashant-kumar': 'artistic-presentation-dgp-up-police',
  'magnolia-blossoms-in-white': 'artistic-presentation-dgp-up-police',
  'silent-resonance-in-crimson': 'artistic-presentation-dgp-up-police',
  'the-solitary-observer': 'contemplative-portrait-study',
  'ephemeral-horizons': 'yellow-floral-study',
  'study-of-form-and-shadow-iv': 'portrait-young-woman-grid',
  'passage-of-ochre': 'traditional-folk-mud-wall-mural',
  'monologue-in-indigo': 'urban-civic-retaining-wall-mural',
  'whispering-canvas': 'floral-branch-with-songbird',
  'terra-sancta-ii': 'ceremonial-dignitary-welcome-rangoli',
};

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const normalizedSlug = LEGACY_SLUG_MAP[slug] || slug;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          images:artwork_images(*)
        `)
        .eq('slug', normalizedSlug)
        .single();

      if (!error && data) {
        return data as Artwork;
      }
    } catch (err) {
      console.warn('Supabase slug fetch error, falling back to local dataset', err);
    }
  }
  const found = ARTWORKS_DATA.find((art) => art.slug === normalizedSlug || art.slug === slug || art.id === slug);
  return found || null;
}

export async function getRelatedArtworks(currentId: string, category: ArtworkCategory, limit = 3): Promise<Artwork[]> {
  const all = await getAllArtworks();
  return all
    .filter((art) => art.id !== currentId && (art.category === category || art.featured))
    .slice(0, limit);
}
