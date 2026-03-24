import { Movie, Comparison } from './types';

const MOVIES_KEY = 'movieranker_movies';
const COMPARISONS_KEY = 'movieranker_comparisons';

export function getStoredMovies(): Movie[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(MOVIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function storeMovies(movies: Movie[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOVIES_KEY, JSON.stringify(movies));
}

export function addMovie(movie: Movie): Movie[] {
  const movies = getStoredMovies();
  if (movies.some(m => m.id === movie.id)) return movies;
  const updated = [...movies, movie];
  storeMovies(updated);
  return updated;
}

export function removeMovie(movieId: number): Movie[] {
  const movies = getStoredMovies().filter(m => m.id !== movieId);
  storeMovies(movies);
  // Also remove comparisons involving this movie
  const comparisons = getStoredComparisons().filter(
    c => c.winnerId !== movieId && c.loserId !== movieId
  );
  storeComparisons(comparisons);
  return movies;
}

export function getStoredComparisons(): Comparison[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(COMPARISONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function storeComparisons(comparisons: Comparison[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COMPARISONS_KEY, JSON.stringify(comparisons));
}

export function addComparison(comparison: Comparison): Comparison[] {
  const comparisons = getStoredComparisons();
  const updated = [...comparisons, comparison];
  storeComparisons(updated);
  return updated;
}

export function undoLastComparison(): { comparisons: Comparison[]; removed: Comparison | null } {
  const comparisons = getStoredComparisons();
  if (comparisons.length === 0) return { comparisons: [], removed: null };
  const removed = comparisons[comparisons.length - 1];
  const updated = comparisons.slice(0, -1);
  storeComparisons(updated);
  return { comparisons: updated, removed };
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MOVIES_KEY);
  localStorage.removeItem(COMPARISONS_KEY);
}

export function exportData(): string {
  return JSON.stringify({
    movies: getStoredMovies(),
    comparisons: getStoredComparisons(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}

export function importData(jsonString: string): { movies: Movie[]; comparisons: Comparison[] } {
  const data = JSON.parse(jsonString);
  if (!data.movies || !data.comparisons) {
    throw new Error('Invalid data format');
  }
  storeMovies(data.movies);
  storeComparisons(data.comparisons);
  return { movies: data.movies, comparisons: data.comparisons };
}
