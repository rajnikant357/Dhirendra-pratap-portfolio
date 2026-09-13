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

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          images:artwork_images(*)
        `)
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return data as Artwork;
      }
    } catch (err) {
      console.warn('Supabase slug fetch error, falling back to local dataset', err);
    }
  }
  const found = ARTWORKS_DATA.find((art) => art.slug === slug);
  return found || null;
}

export async function getRelatedArtworks(currentId: string, category: ArtworkCategory, limit = 3): Promise<Artwork[]> {
  const all = await getAllArtworks();
  return all
    .filter((art) => art.id !== currentId && (art.category === category || art.featured))
    .slice(0, limit);
}
