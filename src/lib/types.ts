export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
}

export interface Comparison {
  id: string;
  winnerId: number;
  loserId: number;
  timestamp: number;
}

export interface MovieRating {
  movieId: number;
  movie: Movie;
  score: number;        // Bradley-Terry score (higher = better)
  wins: number;
  losses: number;
  comparisons: number;
}

export interface UserData {
  movies: Movie[];
  comparisons: Comparison[];
  ratings: Map<number, MovieRating>;
}
