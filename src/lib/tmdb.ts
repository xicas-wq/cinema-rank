import { Movie } from './types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// We'll use the API key from environment variable
function getApiKey(): string {
  return process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
}

export function getPosterUrl(posterPath: string | null, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342'): string {
  if (!posterPath) return '/no-poster.svg';
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('TMDB API key not configured');

  const url = `${TMDB_BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('TMDB API key not configured');

  const url = `${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB popular fetch failed: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export async function getTopRatedMovies(page: number = 1): Promise<Movie[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('TMDB API key not configured');

  const url = `${TMDB_BASE_URL}/movie/top_rated?api_key=${apiKey}&language=en-US&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB top_rated fetch failed: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('TMDB API key not configured');

  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${apiKey}&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB movie details failed: ${res.status}`);
  return await res.json();
}

export async function discoverMovies(options: {
  genres?: number[];
  yearFrom?: number;
  yearTo?: number;
  sortBy?: string;
  page?: number;
}): Promise<Movie[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('TMDB API key not configured');

  const params = new URLSearchParams({
    api_key: apiKey,
    language: 'en-US',
    sort_by: options.sortBy || 'popularity.desc',
    page: String(options.page || 1),
    include_adult: 'false',
  });

  if (options.genres?.length) {
    params.set('with_genres', options.genres.join(','));
  }
  if (options.yearFrom) {
    params.set('primary_release_date.gte', `${options.yearFrom}-01-01`);
  }
  if (options.yearTo) {
    params.set('primary_release_date.lte', `${options.yearTo}-12-31`);
  }

  const url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB discover failed: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}
