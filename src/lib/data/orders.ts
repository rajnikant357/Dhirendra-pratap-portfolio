import type { Order } from '../../types/database';
import { ARTWORKS_DATA } from './artworks';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-01',
    order_number: 'DAG-2026-0012',
    artwork_id: 'art-01',
    artwork: ARTWORKS_DATA[0],
    customer_name: 'Vikram Malhotra',
    customer_email: 'vikram.m@example.com',
    customer_phone: '+91 98765 43210',
    amount: 85000,
    payment_status: 'PAID',
    order_status: 'PREPARING_ARTWORK',
    shipping_address: '42 Kasturba Gandhi Marg, Connaught Place, New Delhi 110001',
    tracking_courier: 'Blue Dart Art Logistics / Secure Freight',
    tracking_number: 'BD-ART-984210',
    events: [
      {
        id: 'ev-01',
        order_id: 'ord-01',
        status: 'OFFER_ACCEPTED',
        note: 'Collector offer of ₹85,000 accepted by artist studio.',
        created_at: '2026-03-01T10:00:00Z'
      },
      {
        id: 'ev-02',
        order_id: 'ord-01',
        status: 'PAYMENT_RECEIVED',
        note: 'Escrow payment verified via Razorpay / Direct Studio Account.',
        created_at: '2026-03-02T14:30:00Z'
      },
      {
        id: 'ev-03',
        order_id: 'ord-01',
        status: 'PREPARING_ARTWORK',
        note: 'Final protective archival varnish applied; custom museum timber crate in fabrication.',
        created_at: '2026-03-04T11:00:00Z'
      }
    ],
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-04T11:00:00Z'
  },
  {
    id: 'ord-02',
    order_number: 'DAG-2026-0018',
    artwork_id: 'art-06',
    artwork: ARTWORKS_DATA[5],
    customer_name: 'Sunita Rao',
    customer_email: 'sunita.rao@example.com',
    customer_phone: '+91 91234 56789',
    amount: 110000,
    payment_status: 'PAID',
    order_status: 'DELIVERED',
    shipping_address: 'Flat 12B, Ocean Crest Towers, Worli, Mumbai 400018',
    tracking_courier: 'DHL Express Fine Art Service',
    tracking_number: 'DHL-IN-776201',
    events: [
      {
        id: 'ev-11',
        order_id: 'ord-02',
        status: 'OFFER_ACCEPTED',
        note: 'Acquisition finalized.',
        created_at: '2026-02-15T09:00:00Z'
      },
      {
        id: 'ev-12',
        order_id: 'ord-02',
        status: 'PAYMENT_RECEIVED',
        note: 'Payment received in full.',
        created_at: '2026-02-15T15:00:00Z'
      },
      {
        id: 'ev-13',
        order_id: 'ord-02',
        status: 'PREPARING_ARTWORK',
        note: 'Artwork authenticated with physical artist certificate of authenticity.',
        created_at: '2026-02-17T11:00:00Z'
      },
      {
        id: 'ev-14',
        order_id: 'ord-02',
        status: 'PACKED',
        note: 'Archival foam casing and climate-stabilized crating complete.',
        created_at: '2026-02-19T16:00:00Z'
      },
      {
        id: 'ev-15',
        order_id: 'ord-02',
        status: 'SHIPPED',
        note: 'Handed over to Fine Art transit team.',
        created_at: '2026-02-21T10:00:00Z'
      },
      {
        id: 'ev-16',
        order_id: 'ord-02',
        status: 'DELIVERED',
        note: 'Successfully received and unboxed by collector.',
        created_at: '2026-02-24T17:30:00Z'
      }
    ],
    created_at: '2026-02-15T09:00:00Z',
    updated_at: '2026-02-24T17:30:00Z'
  }
];
