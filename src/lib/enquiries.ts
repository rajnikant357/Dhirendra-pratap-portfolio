import type { Enquiry } from '../types/database';
import { supabase, isSupabaseConfigured, getServiceSupabase } from './supabase';

const memoryEnquiries: Enquiry[] = [];

export async function submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'created_at'>): Promise<{ success: boolean; id?: string; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([
          {
            name: enquiry.name,
            email: enquiry.email,
            phone: enquiry.phone,
            type: enquiry.type,
            message: enquiry.message,
            status: 'NEW'
          }
        ])
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, id: data.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const newEnquiry: Enquiry = {
    id: 'enq-' + Date.now(),
    ...enquiry,
    status: 'NEW',
    created_at: new Date().toISOString()
  };
  memoryEnquiries.unshift(newEnquiry);
  return { success: true, id: newEnquiry.id };
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const service = getServiceSupabase();
  if (service) {
    const { data } = await service
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) return data as Enquiry[];
  }
  return memoryEnquiries;
}
