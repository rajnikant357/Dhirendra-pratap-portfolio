import type { Bid } from '../types/database';
import { supabase, isSupabaseConfigured, getServiceSupabase } from './supabase';

// In-memory cache for development/demo when Supabase is not actively hooked up
const memoryBids: Bid[] = [
  {
    id: 'bid-demo-01',
    artwork_id: 'art-02',
    artwork_title: 'The Solitary Observer',
    name: 'Ananya Sharma',
    email: 'ananya.s@galleryart.in',
    phone: '+91 98112 34567',
    offer_amount: 60000,
    message: 'We would love to acquire this work for our contemporary collection in Bengaluru.',
    status: 'PENDING',
    created_at: new Date().toISOString()
  }
];

export async function submitBid(bidData: Omit<Bid, 'id' | 'status' | 'created_at'>): Promise<{ success: boolean; id?: string; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bids')
        .insert([
          {
            artwork_id: bidData.artwork_id,
            name: bidData.name,
            email: bidData.email,
            phone: bidData.phone,
            offer_amount: bidData.offer_amount,
            message: bidData.message || null,
            status: 'PENDING'
          }
        ])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, id: data.id };
    } catch (err: any) {
      return { success: false, error: err.message || 'Database error occurred' };
    }
  }

  // Fallback in-memory persistence
  const newBid: Bid = {
    id: 'bid-' + Date.now(),
    ...bidData,
    status: 'PENDING',
    created_at: new Date().toISOString()
  };
  memoryBids.unshift(newBid);
  return { success: true, id: newBid.id };
}

export async function getBids(): Promise<Bid[]> {
  const serviceClient = getServiceSupabase();
  if (serviceClient) {
    const { data } = await serviceClient
      .from('bids')
      .select('*, artworks(title)')
      .order('created_at', { ascending: false });
    if (data) {
      return data.map((b: any) => ({
        ...b,
        artwork_title: b.artworks?.title
      }));
    }
  }
  return memoryBids;
}
