import { Movie } from './types';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Use our server-side proxy to keep the API key hidden
function getProxyUrl(endpoint: string, params: Record<string, string> = {}): string {
  const searchParams = new URLSearchParams({ endpoint, ...params });
  // Use relative URL - works in both dev and production
  return `/api/tmdb?${searchParams.toString()}`;
}

export function getPosterUrl(posterPath: string | null, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342'): string {
  if (!posterPath) return '/no-poster.svg';
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const url = getProxyUrl('search/movie', {
    query: query,
    include_adult: 'false',
    language: 'en-US',
    page: '1',
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return (data.results || []).filter((m: Movie) => m.poster_path);
}

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const url = getProxyUrl('movie/popular', {
    language: 'en-US',
    page: String(page),
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB popular fetch failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return (data.results || []).filter((m: Movie) => m.poster_path);
}

export async function getTopRatedMovies(page: number = 1): Promise<Movie[]> {
  const url = getProxyUrl('movie/top_rated', {
    language: 'en-US',
    page: String(page),
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB top_rated fetch failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return (data.results || []).filter((m: Movie) => m.poster_path);
}

export async function discoverMovies(options: {
  genres?: number[];
  yearFrom?: number;
  yearTo?: number;
  sortBy?: string;
  page?: number;
}): Promise<Movie[]> {
  const params: Record<string, string> = {
    language: 'en-US',
    sort_by: options.sortBy || 'popularity.desc',
    page: String(options.page || 1),
    include_adult: 'false',
  };

  if (options.genres?.length) {
    params.with_genres = options.genres.join(',');
  }
  if (options.yearFrom) {
    params['primary_release_date.gte'] = `${options.yearFrom}-01-01`;
  }
  if (options.yearTo) {
    params['primary_release_date.lte'] = `${options.yearTo}-12-31`;
  }

  const url = getProxyUrl('discover/movie', params);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB discover failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return (data.results || []).filter((m: Movie) => m.poster_path);
}
