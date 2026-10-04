import type { APIRoute } from 'astro';
import { ACHIEVEMENTS_DATA } from '../../lib/data/achievements';
import { isSupabaseConfigured, getServiceSupabase } from '../../lib/supabase';
import { isAuthorizedAdminRequest, sanitizeString } from '../../lib/apiSecurity';
import type { Achievement } from '../../types/database';

export const GET: APIRoute = async () => {
  try {
    if (isSupabaseConfigured) {
      const client = getServiceSupabase();
      if (client) {
        const { data, error } = await client.from('achievements').select('*');
        if (!error && data) {
          return new Response(JSON.stringify({ success: true, achievements: data }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'X-Content-Type-Options': 'nosniff',
            },
          });
        }
      }
    }
    return new Response(JSON.stringify({ success: true, achievements: ACHIEVEMENTS_DATA }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'A service error occurred while retrieving achievements.' }),
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
  if (!isAuthorizedAdminRequest(request)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized: Studio curator authentication required.' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  }

  try {
    let body: any = {};
    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON payload.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const title = sanitizeString(body.title, 150);
    const organization = sanitizeString(body.organization, 150);
    const category = sanitizeString(body.category, 60);
    const location = sanitizeString(body.location, 100);
    const description = sanitizeString(body.description, 2000);
    const image_path = sanitizeString(body.image_path, 300);
    const year = parseInt(body.year) || new Date().getFullYear();
    const featured = Boolean(body.featured);

    if (!title || !organization || !category || !description) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required achievement fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newAch: Achievement = {
      id: sanitizeString(body.id, 80) || `ach-${Date.now()}`,
      title,
      organization,
      year,
      category,
      location,
      description,
      image_path: image_path || '/photos/awards/certificates%20and%20awards/FB_IMG_1659230957054.jpg',
      featured,
    };

    const client = getServiceSupabase();
    if (isSupabaseConfigured && client) {
      const { data, error } = await client.from('achievements').insert([{
        title: newAch.title,
        organization: newAch.organization,
        year: newAch.year,
        category: newAch.category,
        location: newAch.location,
        description: newAch.description,
        image_path: newAch.image_path,
        featured: newAch.featured,
      }]).select().single();

      if (!error && data) {
        newAch.id = data.id;
      }
    }

    return new Response(JSON.stringify({ success: true, achievement: newAch }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred while saving achievement.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
