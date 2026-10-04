import type { APIRoute } from 'astro';
import { isSupabaseConfigured, getServiceSupabase } from '../../lib/supabase';
import { getAllArtworks } from '../../lib/artworks';
import { isAuthorizedAdminRequest, sanitizeString } from '../../lib/apiSecurity';
import type { Artwork } from '../../types/database';

export const GET: APIRoute = async () => {
  try {
    const artworks = await getAllArtworks();
    return new Response(JSON.stringify({ success: true, artworks }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'A service error occurred while retrieving artworks.' }),
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
  // OWASP ASVS V4: Authentication & Authorization verification for mutations
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
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON payload.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const title = sanitizeString(body.title, 150);
    const slug = sanitizeString(body.slug, 150);
    const description = sanitizeString(body.description, 2000);
    const medium = sanitizeString(body.medium, 150);
    const category = sanitizeString(body.category, 50);
    const width = sanitizeString(body.width, 30);
    const height = sanitizeString(body.height, 30);
    const year = parseInt(body.year) || new Date().getFullYear();
    const price = body.price !== undefined && body.price !== null && body.price !== '' ? parseFloat(body.price) : null;
    const sale_type = sanitizeString(body.sale_type, 30) || (price ? 'FIXED_PRICE' : 'OFFER');
    const availability = sanitizeString(body.availability, 30) || 'AVAILABLE';
    const featured = Boolean(body.featured);
    const signature = Boolean(body.signature);
    const images = Array.isArray(body.images) ? body.images : [];

    if (!title || !description || !medium || !category || !width || !height) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required artwork parameters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newArtwork: Artwork = {
      id: sanitizeString(body.id, 80) || `art-${Date.now()}`,
      title,
      slug: generatedSlug,
      description,
      year,
      medium,
      category,
      width,
      height,
      price,
      sale_type: sale_type as any,
      availability: availability as any,
      featured,
      signature,
      images: images.length > 0 ? images : [
        {
          id: `img-${Date.now()}`,
          artwork_id: body.id || `art-${Date.now()}`,
          storage_path: '/photos/awards/certificates%20and%20awards/438304121_950748996557945_5294600570921436411_n.jpg',
          alt_text: title,
          sort_order: 1,
          is_primary: true
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const serviceClient = getServiceSupabase();
    if (isSupabaseConfigured && serviceClient) {
      const { data: artData, error: artError } = await serviceClient
        .from('artworks')
        .insert([
          {
            title: newArtwork.title,
            slug: newArtwork.slug,
            description: newArtwork.description,
            year: newArtwork.year,
            medium: newArtwork.medium,
            category: newArtwork.category,
            width: newArtwork.width,
            height: newArtwork.height,
            price: newArtwork.price,
            sale_type: newArtwork.sale_type,
            availability: newArtwork.availability,
            featured: newArtwork.featured,
            signature: newArtwork.signature,
          }
        ])
        .select()
        .single();

      if (artError) {
        return new Response(
          JSON.stringify({ success: false, error: 'Database write error encountered.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (newArtwork.images.length > 0) {
        await serviceClient.from('artwork_images').insert(
          newArtwork.images.map((img, idx) => ({
            artwork_id: artData.id,
            storage_path: sanitizeString(img.storage_path, 300),
            alt_text: sanitizeString(img.alt_text || newArtwork.title, 150),
            sort_order: idx + 1,
            is_primary: idx === 0,
          }))
        );
      }

      newArtwork.id = artData.id;
    }

    return new Response(JSON.stringify({ success: true, artwork: newArtwork }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred while creating artwork.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
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
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON payload.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const id = sanitizeString(body.id, 80);
    const { id: _ignored, ...updates } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Artwork ID is required for update.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const serviceClient = getServiceSupabase();
    if (isSupabaseConfigured && serviceClient) {
      const { error } = await serviceClient
        .from('artworks')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: 'Database update failed.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(JSON.stringify({ success: true, updated: { id, ...updates } }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred while updating artwork.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ request }) => {
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
    const url = new URL(request.url);
    const id = sanitizeString(url.searchParams.get('id'), 80);

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Artwork ID is required for deletion.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const serviceClient = getServiceSupabase();
    if (isSupabaseConfigured && serviceClient) {
      const { error } = await serviceClient.from('artworks').delete().eq('id', id);
      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: 'Database record deletion failed.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(JSON.stringify({ success: true, deletedId: id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred while deleting artwork.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
