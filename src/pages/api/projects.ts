import type { APIRoute } from 'astro';
import { PROJECTS_DATA } from '../../lib/data/projects';
import { isSupabaseConfigured, getServiceSupabase } from '../../lib/supabase';
import { isAuthorizedAdminRequest, sanitizeString } from '../../lib/apiSecurity';
import type { Project } from '../../types/database';

export const GET: APIRoute = async () => {
  try {
    if (isSupabaseConfigured) {
      const client = getServiceSupabase();
      if (client) {
        const { data, error } = await client.from('projects').select('*, images:project_images(*)');
        if (!error && data) {
          return new Response(JSON.stringify({ success: true, projects: data }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'X-Content-Type-Options': 'nosniff',
            },
          });
        }
      }
    }
    return new Response(JSON.stringify({ success: true, projects: PROJECTS_DATA }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'A service error occurred while retrieving projects.' }),
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
    const category = sanitizeString(body.category, 60);
    const client_or_org = sanitizeString(body.client_or_org, 150);
    const description = sanitizeString(body.description, 2000);
    const year = parseInt(body.year) || new Date().getFullYear();
    const featured = Boolean(body.featured);
    const images = Array.isArray(body.images) ? body.images : [];

    if (!title || !category || !description) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required project fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newProject: Project = {
      id: sanitizeString(body.id, 80) || `proj-${Date.now()}`,
      title,
      category,
      client_or_org,
      year,
      description,
      featured,
      images: images.length > 0 ? images : [
        {
          id: `pimg-${Date.now()}`,
          project_id: body.id || `proj-${Date.now()}`,
          storage_path: '/photos/Work/scrap%20craft/transformer%206.jpg',
          sort_order: 1
        }
      ],
      created_at: new Date().toISOString(),
    };

    const client = getServiceSupabase();
    if (isSupabaseConfigured && client) {
      const { data, error } = await client.from('projects').insert([{
        title: newProject.title,
        category: newProject.category,
        client_or_org: newProject.client_or_org,
        year: newProject.year,
        description: newProject.description,
        featured: newProject.featured,
      }]).select().single();

      if (!error && data) {
        newProject.id = data.id;
        if (newProject.images.length > 0) {
          await client.from('project_images').insert(
            newProject.images.map((img: any, idx: number) => ({
              project_id: data.id,
              storage_path: sanitizeString(img.storage_path, 300),
              sort_order: idx + 1,
            }))
          );
        }
      }
    }

    return new Response(JSON.stringify({ success: true, project: newProject }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred while saving project.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
