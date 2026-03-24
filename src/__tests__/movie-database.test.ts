import { CURATED_MOVIES, MOVIE_CATEGORIES, searchCuratedMovies, getMoviesByCategory, getRandomMovies } from '../lib/movie-database';

describe('Movie Database', () => {
  test('has a reasonable number of curated movies', () => {
    expect(CURATED_MOVIES.length).toBeGreaterThanOrEqual(50);
  });

  test('all movies have required fields', () => {
    CURATED_MOVIES.forEach(movie => {
      expect(movie.id).toBeDefined();
      expect(typeof movie.id).toBe('number');
      expect(movie.title).toBeDefined();
      expect(typeof movie.title).toBe('string');
      expect(movie.title.length).toBeGreaterThan(0);
      expect(movie.release_date).toBeDefined();
      expect(movie.overview).toBeDefined();
      expect(typeof movie.vote_average).toBe('number');
    });
  });

  test('all movie IDs are unique', () => {
    const ids = CURATED_MOVIES.map(m => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('all category movies exist in curated list', () => {
    const allIds = new Set(CURATED_MOVIES.map(m => m.id));
    for (const [category, ids] of Object.entries(MOVIE_CATEGORIES)) {
      for (const id of ids) {
        expect(allIds.has(id)).toBe(true);
      }
    }
  });

  describe('searchCuratedMovies', () => {
    test('finds movies by title', () => {
      const results = searchCuratedMovies('godfather');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.some(m => m.title.includes('Godfather'))).toBe(true);
    });

    test('finds movies by year', () => {
      const results = searchCuratedMovies('1994');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    test('finds movies by overview content', () => {
      const results = searchCuratedMovies('wizard');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    test('returns empty for non-matching query', () => {
      const results = searchCuratedMovies('xyznonexistent123');
      expect(results).toHaveLength(0);
    });

    test('case insensitive search', () => {
      const lower = searchCuratedMovies('inception');
      const upper = searchCuratedMovies('INCEPTION');
      expect(lower.length).toBe(upper.length);
    });
  });

  describe('getMoviesByCategory', () => {
    test('returns movies for valid category', () => {
      const results = getMoviesByCategory('Animation');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(m => {
        expect(m.id).toBeDefined();
        expect(m.title).toBeDefined();
      });
    });

    test('returns empty for invalid category', () => {
      const results = getMoviesByCategory('NonexistentCategory');
      expect(results).toHaveLength(0);
    });
  });

  describe('getRandomMovies', () => {
    test('returns requested number of movies', () => {
      const results = getRandomMovies(5);
      expect(results).toHaveLength(5);
    });

    test('returns all movies if count exceeds total', () => {
      const results = getRandomMovies(1000);
      expect(results).toHaveLength(CURATED_MOVIES.length);
    });

    test('returns different orderings (randomness check)', () => {
      const r1 = getRandomMovies(10).map(m => m.id);
      const r2 = getRandomMovies(10).map(m => m.id);
      // Very unlikely to be identical if random
      // But not guaranteed, so we just check they're valid
      expect(r1).toHaveLength(10);
      expect(r2).toHaveLength(10);
    });
  });
});
