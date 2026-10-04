import type { APIRoute } from 'astro';
import { submitBid } from '../../lib/bids';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+\d\s().-]{7,25}$/;

function sanitizeString(str: any, maxLen: number): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/[<>]/g, '');
}

// OWASP ASVS V13: Bids are private collector records. Public listing via GET is disallowed.
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ success: false, error: 'Access denied. Bid inspection is restricted to authorized studio personnel.' }),
    {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON payload.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const artwork_id = sanitizeString(body.artwork_id, 80);
    const artwork_title = sanitizeString(body.artwork_title, 200);
    const name = sanitizeString(body.name, 100);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const message = sanitizeString(body.message, 1500);
    const offer_amount = parseFloat(body.offer_amount);

    if (!artwork_id || !name || !email || !phone || isNaN(offer_amount)) {
      return new Response(
        JSON.stringify({ success: false, error: 'All required offer fields must be provided.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please provide a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!PHONE_REGEX.test(phone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please provide a valid contact telephone number.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (offer_amount <= 0 || offer_amount > 100000000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Offer amount must be a reasonable positive number.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await submitBid({
      artwork_id,
      artwork_title: artwork_title || 'Untitled Artwork',
      name,
      email,
      phone,
      offer_amount,
      message,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not register offer. Please try again later.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    // OWASP A05: Do not leak internal stack traces or database driver details
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred while processing your offer.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
