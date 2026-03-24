// TMDB Genre IDs and mappings
export const TMDB_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const GENRE_IDS = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIFI: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
} as const;

export function getGenreName(id: number): string {
  return TMDB_GENRES[id] || 'Unknown';
}

export function getGenreNames(ids: number[]): string[] {
  return ids.map(id => TMDB_GENRES[id]).filter(Boolean);
}

// Check if two movies share at least one genre
export function sharesGenre(genreIdsA: number[], genreIdsB: number[]): boolean {
  return genreIdsA.some(id => genreIdsB.includes(id));
}
