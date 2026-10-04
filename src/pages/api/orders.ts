import type { APIRoute } from 'astro';
import { trackOrder, createOrder } from '../../lib/orders';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+\d\s().-]{7,25}$/;

function sanitizeString(str: any, maxLen: number): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/[<>]/g, '');
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const rawOrderNumber = url.searchParams.get('orderNumber') || '';
    const rawContact = url.searchParams.get('contact') || '';

    const orderNumber = sanitizeString(rawOrderNumber, 50);
    const contact = sanitizeString(rawContact, 150);

    // OWASP ASVS V13: Prevent order enumeration attacks by requiring both reference and matching email/phone
    if (!orderNumber || !contact) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Both the order reference number and associated email/phone are required to verify and track a consignment.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }

    const order = await trackOrder(orderNumber, contact);
    if (!order) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No consignment found matching the provided order reference and contact details.',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, order }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'A service error occurred while retrieving tracking information.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON request format.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const artwork_id = sanitizeString(body.artwork_id, 80);
    const customer_name = sanitizeString(body.customer_name, 100);
    const customer_email = typeof body.customer_email === 'string' ? body.customer_email.trim().toLowerCase() : '';
    const customer_phone = typeof body.customer_phone === 'string' ? body.customer_phone.trim() : '';
    const shipping_address = sanitizeString(body.shipping_address, 500);
    const amount = Number(body.amount);

    if (!artwork_id || !customer_name || !customer_email || !customer_phone || !shipping_address) {
      return new Response(
        JSON.stringify({ success: false, error: 'All acquisition and delivery details are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!EMAIL_REGEX.test(customer_email) || customer_email.length > 254) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please provide a valid delivery contact email.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!PHONE_REGEX.test(customer_phone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please provide a valid delivery contact telephone.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (isNaN(amount) || amount < 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid transaction amount provided.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await createOrder({
      artwork_id,
      customer_name,
      customer_email,
      customer_phone,
      amount,
      shipping_address,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not record acquisition order. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, order_number: result.order_number }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred while initializing your order.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
