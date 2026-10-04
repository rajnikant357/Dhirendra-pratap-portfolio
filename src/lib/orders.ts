import type { Order, OrderStatus } from '../types/database';
import { INITIAL_ORDERS } from './data/orders';
import { supabase, isSupabaseConfigured, getServiceSupabase } from './supabase';

const memoryOrders: Order[] = [...INITIAL_ORDERS];

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***';
  const [user, domain] = email.split('@');
  return `${user.slice(0, 1)}***@${domain}`;
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '****';
  return `******${phone.slice(-4)}`;
}

function maskAddress(addr: string): string {
  if (!addr) return '';
  const parts = addr.split(',').map((p) => p.trim());
  if (parts.length > 1) {
    return `[Protected Location], ${parts[parts.length - 1]}`;
  }
  return '[Protected Location]';
}

export async function trackOrder(orderNumber: string, contact: string): Promise<Order | null> {
  const normalizedOrderNumber = orderNumber.trim().toUpperCase();
  const normalizedContact = contact.trim().toLowerCase().replace(/\s+/g, '');

  // OWASP ASVS V13: Both Order Reference AND Verification Contact are mandatory
  if (!normalizedOrderNumber || !normalizedContact) {
    return null;
  }

  let matchedOrder: Order | null = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          artwork:artworks(*),
          events:order_events(*)
        `)
        .eq('order_number', normalizedOrderNumber)
        .single();

      if (!error && data) {
        const emailMatch = data.customer_email.toLowerCase() === normalizedContact;
        const phoneMatch = data.customer_phone.replace(/\s+/g, '').includes(normalizedContact);
        if (emailMatch || phoneMatch) {
          matchedOrder = data as Order;
        }
      }
    } catch (err) {
      console.warn('Supabase order tracking error, checking fallback', err);
    }
  }

  // Fallback memory search
  if (!matchedOrder) {
    const found = memoryOrders.find((ord) => {
      const numMatch = ord.order_number.toUpperCase() === normalizedOrderNumber;
      const emailMatch = ord.customer_email.toLowerCase() === normalizedContact;
      const phoneMatch = ord.customer_phone.replace(/\s+/g, '').includes(normalizedContact);
      return numMatch && (emailMatch || phoneMatch);
    });
    if (found) matchedOrder = found;
  }

  if (!matchedOrder) return null;

  // Mask PII before returning public consignment status
  return {
    ...matchedOrder,
    customer_email: maskEmail(matchedOrder.customer_email),
    customer_phone: maskPhone(matchedOrder.customer_phone),
    shipping_address: maskAddress(matchedOrder.shipping_address || ''),
  };
}

export async function createOrder(orderData: {
  artwork_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  shipping_address: string;
}): Promise<{ success: boolean; order_number?: string; error?: string }> {
  const nextNumber = `DAG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            order_number: nextNumber,
            artwork_id: orderData.artwork_id,
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email,
            customer_phone: orderData.customer_phone,
            amount: orderData.amount,
            payment_status: 'PENDING',
            order_status: 'PAYMENT_PENDING',
            shipping_address: orderData.shipping_address
          }
        ])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Add initial event
      await supabase.from('order_events').insert([
        {
          order_id: data.id,
          status: 'PAYMENT_PENDING',
          note: 'Order initiated by collector. Awaiting payment confirmation.'
        }
      ]);

      return { success: true, order_number: nextNumber };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Fallback memory creation
  const newOrder: Order = {
    id: 'ord-' + Date.now(),
    order_number: nextNumber,
    artwork_id: orderData.artwork_id,
    customer_name: orderData.customer_name,
    customer_email: orderData.customer_email,
    customer_phone: orderData.customer_phone,
    amount: orderData.amount,
    payment_status: 'PENDING',
    order_status: 'PAYMENT_PENDING',
    shipping_address: orderData.shipping_address,
    events: [
      {
        id: 'ev-' + Date.now(),
        order_id: 'ord-' + Date.now(),
        status: 'PAYMENT_PENDING',
        note: 'Order placed. Awaiting payment completion.',
        created_at: new Date().toISOString()
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  memoryOrders.unshift(newOrder);
  return { success: true, order_number: nextNumber };
}

export async function getAllOrders(): Promise<Order[]> {
  const service = getServiceSupabase();
  if (service) {
    const { data } = await service
      .from('orders')
      .select('*, artwork:artworks(title), events:order_events(*)')
      .order('created_at', { ascending: false });
    if (data) return data as Order[];
  }
  return memoryOrders;
}
