import type { APIRoute } from 'astro';
import { submitEnquiry } from '../../lib/enquiries';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+\d\s().-]{7,25}$/;
const ALLOWED_TYPES = new Set([
  'Artwork Purchase',
  'Artwork Commission',
  'Graphics Design',
  'Exhibition',
  'Collaboration',
  'Commercial Project',
  'General Enquiry'
]);

function sanitizeString(str: any, maxLen: number): string {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/[<>]/g, '');
}

// OWASP ASVS V13: Contact inquiries contain confidential PII. Public inspection via GET is disallowed.
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ success: false, error: 'Access denied. Inquiries are restricted to authorized studio personnel.' }),
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

    const name = sanitizeString(body.name, 100);
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const type = sanitizeString(body.type, 50);
    const message = sanitizeString(body.message, 3000);

    if (!name || !email || !phone || !type || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'All enquiry fields are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!ALLOWED_TYPES.has(type)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid enquiry type specified.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!PHONE_REGEX.test(phone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid phone number.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await submitEnquiry({
      name,
      email,
      phone,
      type: type as any,
      message,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to record your enquiry. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    // OWASP A05: Generic failure message
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred while submitting your enquiry.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
