import type { APIRoute } from 'astro';
import { trackOrder, createOrder } from '../../lib/orders';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const orderNumber = url.searchParams.get('orderNumber');
    const contact = url.searchParams.get('contact') || '';

    if (!orderNumber) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order reference number is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const order = await trackOrder(orderNumber, contact);
    if (!order) {
      return new Response(
        JSON.stringify({ success: false, error: 'No consignment found matching this order reference.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, order }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Server error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { artwork_id, customer_name, customer_email, customer_phone, amount, shipping_address } = body;

    if (!artwork_id || !customer_name || !customer_email || !customer_phone || !shipping_address) {
      return new Response(
        JSON.stringify({ success: false, error: 'All acquisition details are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await createOrder({
      artwork_id,
      customer_name,
      customer_email,
      customer_phone,
      amount: Number(amount) || 0,
      shipping_address,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Failed to initialize order.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, order_number: result.order_number }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Malformed request.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
