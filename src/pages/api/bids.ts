import type { APIRoute } from 'astro';
import { submitBid, getBids } from '../../lib/bids';

export const GET: APIRoute = async () => {
  const bids = await getBids();
  return new Response(JSON.stringify({ success: true, bids }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { artwork_id, artwork_title, name, email, phone, offer_amount, message } = body;

    if (!artwork_id || !name || !email || !phone || !offer_amount) {
      return new Response(
        JSON.stringify({ success: false, error: 'All required fields must be completed.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const amt = parseFloat(offer_amount);
    if (isNaN(amt) || amt <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Offer amount must be a positive number.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await submitBid({
      artwork_id,
      artwork_title,
      name,
      email,
      phone,
      offer_amount: amt,
      message,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Could not register offer.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Malformed request.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
