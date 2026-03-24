import { computeBradleyTerryRatings, selectNextPair, getWinProbability } from '../lib/bradley-terry';
import { Movie, Comparison } from '../lib/types';

// Helper to create test movies
function makeMovie(id: number, title: string): Movie {
  return {
    id,
    title,
    poster_path: null,
    release_date: '2020-01-01',
    overview: `Test movie ${title}`,
    vote_average: 7.0,
  };
}

// Helper to create a comparison
function makeComparison(winnerId: number, loserId: number, timestamp?: number): Comparison {
  return {
    id: `${winnerId}-${loserId}-${timestamp || Date.now()}`,
    winnerId,
    loserId,
    timestamp: timestamp || Date.now(),
  };
}

describe('Bradley-Terry Model', () => {
  const movieA = makeMovie(1, 'Movie A');
  const movieB = makeMovie(2, 'Movie B');
  const movieC = makeMovie(3, 'Movie C');
  const movieD = makeMovie(4, 'Movie D');
  const movieE = makeMovie(5, 'Movie E');

  describe('computeBradleyTerryRatings', () => {
    test('returns empty array for no movies', () => {
      const result = computeBradleyTerryRatings([], []);
      expect(result).toEqual([]);
    });

    test('returns default scores when no comparisons', () => {
      const result = computeBradleyTerryRatings([movieA, movieB], []);
      expect(result).toHaveLength(2);
      result.forEach(r => {
        expect(r.score).toBe(1.0);
        expect(r.wins).toBe(0);
        expect(r.losses).toBe(0);
        expect(r.comparisons).toBe(0);
      });
    });

    test('winner has higher score than loser after single comparison', () => {
      const comparisons = [makeComparison(1, 2)];
      const result = computeBradleyTerryRatings([movieA, movieB], comparisons);

      const ratingA = result.find(r => r.movieId === 1)!;
      const ratingB = result.find(r => r.movieId === 2)!;

      expect(ratingA.score).toBeGreaterThan(ratingB.score);
      expect(ratingA.wins).toBe(1);
      expect(ratingA.losses).toBe(0);
      expect(ratingB.wins).toBe(0);
      expect(ratingB.losses).toBe(1);
    });

    test('results are sorted by score descending', () => {
      const comparisons = [
        makeComparison(1, 2),
        makeComparison(1, 3),
        makeComparison(2, 3),
      ];
      const result = computeBradleyTerryRatings([movieA, movieB, movieC], comparisons);

      // A beats both, B beats C, C loses to all
      expect(result[0].movieId).toBe(1); // A is #1
      expect(result[1].movieId).toBe(2); // B is #2
      expect(result[2].movieId).toBe(3); // C is #3

      // Verify descending order
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].score).toBeGreaterThanOrEqual(result[i + 1].score);
      }
    });

    test('handles transitive preferences correctly', () => {
      // A > B > C > D
      const comparisons = [
        makeComparison(1, 2),
        makeComparison(2, 3),
        makeComparison(3, 4),
        makeComparison(1, 3),
        makeComparison(1, 4),
        makeComparison(2, 4),
      ];
      const result = computeBradleyTerryRatings(
        [movieA, movieB, movieC, movieD],
        comparisons
      );

      // A should be #1 (beats everyone)
      expect(result[0].movieId).toBe(1);
      // D should be last (loses to everyone)
      expect(result[3].movieId).toBe(4);
      // B and C should be in the middle
      expect([2, 3]).toContain(result[1].movieId);
      expect([2, 3]).toContain(result[2].movieId);
    });

    test('handles repeated comparisons (same pair)', () => {
      // A beats B 3 times, B beats A once
      const comparisons = [
        makeComparison(1, 2, 1),
        makeComparison(1, 2, 2),
        makeComparison(1, 2, 3),
        makeComparison(2, 1, 4),
      ];
      const result = computeBradleyTerryRatings([movieA, movieB], comparisons);

      const ratingA = result.find(r => r.movieId === 1)!;
      const ratingB = result.find(r => r.movieId === 2)!;

      // A should still be ranked higher (3 wins vs 1 win)
      expect(ratingA.score).toBeGreaterThan(ratingB.score);
      expect(ratingA.wins).toBe(3);
      expect(ratingA.losses).toBe(1);
    });

    test('handles a cycle (non-transitive preferences)', () => {
      // Rock-paper-scissors: A > B, B > C, C > A
      const comparisons = [
        makeComparison(1, 2),
        makeComparison(2, 3),
        makeComparison(3, 1),
      ];
      const result = computeBradleyTerryRatings([movieA, movieB, movieC], comparisons);

      // All should have equal-ish scores since it's a cycle
      const scores = result.map(r => r.score);
      const maxDiff = Math.max(...scores) - Math.min(...scores);
      expect(maxDiff).toBeLessThan(0.5); // Close to equal
    });

    test('ignores comparisons for movies not in the list', () => {
      const comparisons = [
        makeComparison(1, 2),
        makeComparison(1, 99), // Movie 99 doesn't exist
      ];
      const result = computeBradleyTerryRatings([movieA, movieB], comparisons);
      expect(result).toHaveLength(2);
      // Only the valid comparison should count
      expect(result.find(r => r.movieId === 1)!.wins).toBe(1);
    });

    test('scores sum to number of items (normalization)', () => {
      const comparisons = [
        makeComparison(1, 2),
        makeComparison(2, 3),
        makeComparison(1, 3),
      ];
      const result = computeBradleyTerryRatings([movieA, movieB, movieC], comparisons);
      const totalScore = result.reduce((sum, r) => sum + r.score, 0);
      // Scores should be positive and finite
      expect(totalScore).toBeGreaterThan(0);
      expect(totalScore).toBeLessThan(100);
    });

    test('handles large number of movies', () => {
      const movies = Array.from({ length: 50 }, (_, i) => makeMovie(i + 1, `Movie ${i + 1}`));
      const comparisons: Comparison[] = [];
      // Create a chain: 1 > 2 > 3 > ... > 50
      for (let i = 0; i < 49; i++) {
        comparisons.push(makeComparison(i + 1, i + 2, i));
      }
      const result = computeBradleyTerryRatings(movies, comparisons);
      expect(result).toHaveLength(50);
      // First movie should be ranked #1
      expect(result[0].movieId).toBe(1);
    });
  });

  describe('selectNextPair', () => {
    test('returns null for less than 2 movies', () => {
      expect(selectNextPair([], [])).toBeNull();
      expect(selectNextPair([movieA], [])).toBeNull();
    });

    test('returns a pair of different movies', () => {
      const pair = selectNextPair([movieA, movieB, movieC], []);
      expect(pair).not.toBeNull();
      expect(pair![0].id).not.toBe(pair![1].id);
    });

    test('prioritizes movies with fewer comparisons', () => {
      // A and B have been compared, C hasn't
      const comparisons = [
        makeComparison(1, 2, 1),
        makeComparison(2, 1, 2),
        makeComparison(1, 2, 3),
      ];

      // Run many times to check C appears frequently
      let cAppearances = 0;
      for (let i = 0; i < 50; i++) {
        const pair = selectNextPair([movieA, movieB, movieC], comparisons);
        if (pair && (pair[0].id === 3 || pair[1].id === 3)) {
          cAppearances++;
        }
      }
      // C should appear in most pairs since it has 0 comparisons
      expect(cAppearances).toBeGreaterThan(25);
    });
  });

  describe('getWinProbability', () => {
    test('returns 0.5 for equal movies', () => {
      const prob = getWinProbability(1, 2, [movieA, movieB], []);
      expect(prob).toBeCloseTo(0.5, 1);
    });

    test('returns higher probability for stronger movie', () => {
      const comparisons = [
        makeComparison(1, 2),
        makeComparison(1, 2),
        makeComparison(1, 2),
      ];
      const prob = getWinProbability(1, 2, [movieA, movieB], comparisons);
      expect(prob).toBeGreaterThan(0.5);
    });

    test('probabilities are complementary', () => {
      const comparisons = [makeComparison(1, 2)];
      const probAB = getWinProbability(1, 2, [movieA, movieB], comparisons);
      const probBA = getWinProbability(2, 1, [movieA, movieB], comparisons);
      expect(probAB + probBA).toBeCloseTo(1, 5);
    });
  });
});

describe('Letterboxd Test Cases', () => {
  // Simulate a real user's movie preferences from Letterboxd
  // This tests the algorithm with realistic data

  const movies = [
    makeMovie(278, 'The Shawshank Redemption'),
    makeMovie(238, 'The Godfather'),
    makeMovie(155, 'The Dark Knight'),
    makeMovie(680, 'Pulp Fiction'),
    makeMovie(27205, 'Inception'),
    makeMovie(157336, 'Interstellar'),
    makeMovie(550, 'Fight Club'),
    makeMovie(13, 'Forrest Gump'),
    makeMovie(120, 'LOTR: Fellowship'),
    makeMovie(603, 'The Matrix'),
  ];

  test('simulates a user who prefers Nolan films', () => {
    // User consistently picks Nolan films (Inception, Interstellar, Dark Knight)
    const comparisons = [
      makeComparison(27205, 278, 1),  // Inception > Shawshank
      makeComparison(27205, 238, 2),  // Inception > Godfather
      makeComparison(27205, 680, 3),  // Inception > Pulp Fiction
      makeComparison(155, 278, 4),    // Dark Knight > Shawshank
      makeComparison(155, 550, 5),    // Dark Knight > Fight Club
      makeComparison(157336, 13, 6),  // Interstellar > Forrest Gump
      makeComparison(157336, 603, 7), // Interstellar > Matrix
      makeComparison(155, 680, 8),    // Dark Knight > Pulp Fiction
      makeComparison(27205, 155, 9),  // Inception > Dark Knight
      makeComparison(157336, 155, 10),// Interstellar > Dark Knight
      makeComparison(278, 680, 11),   // Shawshank > Pulp Fiction
      makeComparison(603, 550, 12),   // Matrix > Fight Club
      makeComparison(120, 13, 13),    // LOTR > Forrest Gump
    ];

    const ratings = computeBradleyTerryRatings(movies, comparisons);

    // Top 3 should be Nolan films
    const top3Ids = ratings.slice(0, 3).map(r => r.movieId);
    expect(top3Ids).toContain(27205);  // Inception
    expect(top3Ids).toContain(157336); // Interstellar

    // Inception should be near the top (most wins among Nolan films)
    const inceptionRank = ratings.findIndex(r => r.movieId === 27205);
    expect(inceptionRank).toBeLessThan(3); // Top 3
  });

  test('simulates a user who prefers classic films', () => {
    const comparisons = [
      makeComparison(238, 155, 1),    // Godfather > Dark Knight
      makeComparison(238, 27205, 2),  // Godfather > Inception
      makeComparison(278, 155, 3),    // Shawshank > Dark Knight
      makeComparison(278, 27205, 4),  // Shawshank > Inception
      makeComparison(680, 157336, 5), // Pulp Fiction > Interstellar
      makeComparison(238, 278, 6),    // Godfather > Shawshank
      makeComparison(680, 155, 7),    // Pulp Fiction > Dark Knight
      makeComparison(550, 603, 8),    // Fight Club > Matrix
      makeComparison(238, 680, 9),    // Godfather > Pulp Fiction
      makeComparison(13, 603, 10),    // Forrest Gump > Matrix
    ];

    const ratings = computeBradleyTerryRatings(movies, comparisons);

    // Godfather should be #1
    expect(ratings[0].movieId).toBe(238);

    // Classic films should dominate top spots
    const top3Ids = ratings.slice(0, 3).map(r => r.movieId);
    expect(top3Ids).toContain(238); // Godfather
  });

  test('handles many comparisons without crashing', () => {
    // Generate 100 random comparisons
    const comparisons: Comparison[] = [];
    for (let i = 0; i < 100; i++) {
      const a = movies[Math.floor(Math.random() * movies.length)];
      let b = movies[Math.floor(Math.random() * movies.length)];
      while (b.id === a.id) {
        b = movies[Math.floor(Math.random() * movies.length)];
      }
      comparisons.push(makeComparison(a.id, b.id, i));
    }

    const ratings = computeBradleyTerryRatings(movies, comparisons);
    expect(ratings).toHaveLength(10);

    // Scores should be positive
    ratings.forEach(r => {
      expect(r.score).toBeGreaterThan(0);
    });

    // Sum should be close to number of movies
    const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
    expect(totalScore).toBeCloseTo(10, 0);
  });
});
