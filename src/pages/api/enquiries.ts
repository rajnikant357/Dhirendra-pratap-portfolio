import type { APIRoute } from 'astro';
import { submitEnquiry, getEnquiries } from '../../lib/enquiries';

export const GET: APIRoute = async () => {
  const enquiries = await getEnquiries();
  return new Response(JSON.stringify({ success: true, enquiries }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, type, message } = body;

    if (!name || !email || !phone || !type || !message) {
      return new Response(
        JSON.stringify({ success: false, error: 'All enquiry fields are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await submitEnquiry({
      name,
      email,
      phone,
      type,
      message,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error || 'Failed to submit enquiry.' }),
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
