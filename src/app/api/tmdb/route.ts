import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';

// Allowed TMDB endpoints to prevent abuse
const ALLOWED_ENDPOINTS = [
  'search/movie',
  'movie/popular',
  'movie/top_rated',
  'discover/movie',
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 });
  }

  if (!endpoint || !ALLOWED_ENDPOINTS.includes(endpoint)) {
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  }

  // Build TMDB URL with all query params except our 'endpoint' param
  const tmdbParams = new URLSearchParams();
  tmdbParams.set('api_key', TMDB_API_KEY);
  for (const [key, value] of searchParams.entries()) {
    if (key !== 'endpoint') {
      tmdbParams.set(key, value);
    }
  }

  try {
    const tmdbUrl = `${TMDB_BASE_URL}/${endpoint}?${tmdbParams.toString()}`;
    const res = await fetch(tmdbUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `TMDB returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('TMDB proxy error:', err);
    return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: 502 });
  }
}
