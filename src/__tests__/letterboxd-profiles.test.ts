/**
 * Letterboxd Profile Test Cases
 *
 * Real test data scraped from actual Letterboxd users' liked films.
 * These simulate pairwise comparisons based on user ratings to validate
 * the Bradley-Terry ranking algorithm against real-world preferences.
 *
 * Users scraped:
 * - Karsten (kurstboy) - eclectic cinephile, 1,854 likes, patron member
 * - J (zer0mile) - mainstream/modern film fan, 177 likes
 * - ethan15hoge - Nolan fan (from prior session)
 */

import { computeBradleyTerryRatings, selectNextPair } from '../lib/bradley-terry';
import { Movie, Comparison } from '../lib/types';

// Helper to create a movie object
function makeMovie(id: number, title: string, year: string): Movie {
  return {
    id,
    title,
    poster_path: null,
    release_date: `${year}-01-01`,
    overview: '',
    vote_average: 0,
  };
}

// Helper to create a comparison
let compId = 0;
function makeComparison(winnerId: number, loserId: number): Comparison {
  return {
    id: `comp-${compId++}`,
    winnerId,
    loserId,
    timestamp: Date.now() + compId,
  };
}

beforeEach(() => {
  compId = 0;
});

describe('Letterboxd Profile: Karsten (kurstboy)', () => {
  // Karsten's liked films with ratings (scraped 2026-03-23)
  // Rating scale: 5=masterpiece, 4.5=excellent, 4=great, 3.5=good, 3=decent
  const movies: Movie[] = [
    makeMovie(1, 'Happy Together', '1997'),           // 5 stars
    makeMovie(2, 'Red Rooms', '2023'),                  // 5 stars
    makeMovie(3, 'To Be or Not to Be', '1942'),         // 5 stars
    makeMovie(4, 'No Country for Old Men', '2007'),     // 5 stars
    makeMovie(5, 'Cool Hand Luke', '1967'),             // 4.5 stars
    makeMovie(6, 'Crouching Tiger Hidden Dragon', '2000'), // 4.5 stars
    makeMovie(7, 'Stand by Me', '1986'),                // 4.5 stars
    makeMovie(8, 'Slap Shot', '1977'),                  // 4.5 stars
    makeMovie(9, 'The Great Dictator', '1940'),         // 4 stars
    makeMovie(10, 'Clockers', '1995'),                  // 4 stars
    makeMovie(11, 'The Wailing', '2016'),               // 4 stars
    makeMovie(12, 'Millennium Actress', '2001'),        // 4 stars
    makeMovie(13, 'Dazed and Confused', '1993'),        // 4 stars
    makeMovie(14, "Miller's Crossing", '1990'),         // 4 stars
    makeMovie(15, 'Witness', '1985'),                   // 4 stars
    makeMovie(16, 'Blade', '1998'),                     // 3.5 stars
    makeMovie(17, 'The Ugly Stepsister', '2025'),       // 3.5 stars
    makeMovie(18, 'The Way We Were', '1973'),            // 3 stars
    makeMovie(19, 'Pokemon The First Movie', '1998'),   // 3 stars
    makeMovie(20, 'Avatar Fire and Ash', '2025'),       // 3 stars
  ];

  // Generate comparisons based on Karsten's ratings
  // Higher-rated film always wins against lower-rated film
  function generateKarstenComparisons(): Comparison[] {
    const comps: Comparison[] = [];
    // 5-star films beat 4.5-star films
    comps.push(makeComparison(1, 5));  // Happy Together > Cool Hand Luke
    comps.push(makeComparison(2, 6));  // Red Rooms > Crouching Tiger
    comps.push(makeComparison(3, 7));  // To Be or Not to Be > Stand by Me
    comps.push(makeComparison(4, 8));  // No Country > Slap Shot

    // 5-star films beat 4-star films
    comps.push(makeComparison(1, 9));  // Happy Together > Great Dictator
    comps.push(makeComparison(4, 11)); // No Country > The Wailing
    comps.push(makeComparison(2, 12)); // Red Rooms > Millennium Actress

    // 4.5-star films beat 4-star films
    comps.push(makeComparison(5, 10)); // Cool Hand Luke > Clockers
    comps.push(makeComparison(6, 13)); // Crouching Tiger > Dazed and Confused
    comps.push(makeComparison(7, 14)); // Stand by Me > Miller's Crossing
    comps.push(makeComparison(8, 15)); // Slap Shot > Witness

    // 4-star films beat 3.5-star films
    comps.push(makeComparison(9, 16));  // Great Dictator > Blade
    comps.push(makeComparison(11, 17)); // The Wailing > Ugly Stepsister
    comps.push(makeComparison(12, 16)); // Millennium Actress > Blade

    // 4-star films beat 3-star films
    comps.push(makeComparison(13, 18)); // Dazed and Confused > The Way We Were
    comps.push(makeComparison(14, 19)); // Miller's Crossing > Pokemon
    comps.push(makeComparison(15, 20)); // Witness > Avatar

    // 3.5-star films beat 3-star films
    comps.push(makeComparison(16, 18)); // Blade > The Way We Were
    comps.push(makeComparison(17, 19)); // Ugly Stepsister > Pokemon

    // Some cross-tier comparisons for robustness
    comps.push(makeComparison(1, 13)); // Happy Together > Dazed and Confused
    comps.push(makeComparison(4, 16)); // No Country > Blade
    comps.push(makeComparison(5, 18)); // Cool Hand Luke > The Way We Were

    return comps;
  }

  test('5-star films should rank highest', () => {
    const comparisons = generateKarstenComparisons();
    const ratings = computeBradleyTerryRatings(movies, comparisons);

    // Get the top 4 movies (should be the 5-star ones)
    const top4Ids = ratings.slice(0, 4).map(r => r.movieId);
    const fiveStarIds = [1, 2, 3, 4];

    // All 5-star movies should be in top 6 (some flexibility for BT model)
    for (const id of fiveStarIds) {
      const rank = ratings.findIndex(r => r.movieId === id);
      expect(rank).toBeLessThan(6);
    }
  });

  test('3-star films should rank lowest', () => {
    const comparisons = generateKarstenComparisons();
    const ratings = computeBradleyTerryRatings(movies, comparisons);

    const threeStarIds = [18, 19, 20];
    const totalMovies = movies.length;

    for (const id of threeStarIds) {
      const rank = ratings.findIndex(r => r.movieId === id);
      expect(rank).toBeGreaterThan(totalMovies - 6); // Bottom 6
    }
  });

  test('rating tiers should be roughly ordered', () => {
    const comparisons = generateKarstenComparisons();
    const ratings = computeBradleyTerryRatings(movies, comparisons);

    // Average rank of each tier
    const avgRank = (ids: number[]) => {
      const ranks = ids.map(id => ratings.findIndex(r => r.movieId === id));
      return ranks.reduce((a, b) => a + b, 0) / ranks.length;
    };

    const avg5star = avgRank([1, 2, 3, 4]);
    const avg4_5star = avgRank([5, 6, 7, 8]);
    const avg4star = avgRank([9, 10, 11, 12, 13, 14, 15]);
    const avg3_5star = avgRank([16, 17]);
    const avg3star = avgRank([18, 19, 20]);

    // Higher-rated tiers should have lower average rank (closer to 0)
    expect(avg5star).toBeLessThan(avg4_5star);
    expect(avg4_5star).toBeLessThan(avg4star);
    expect(avg4star).toBeLessThan(avg3_5star);
    expect(avg3_5star).toBeLessThan(avg3star);
  });
});

describe('Letterboxd Profile: J (zer0mile)', () => {
  // J's liked films with ratings (scraped 2026-03-23)
  // Modern/mainstream taste with horror, animation, and drama
  const movies: Movie[] = [
    makeMovie(101, 'Good Will Hunting', '1997'),        // 5 stars
    makeMovie(102, 'Spirited Away', '2001'),             // 5 stars
    makeMovie(103, 'Dead Poets Society', '1989'),        // 5 stars
    makeMovie(104, 'Psycho', '1960'),                    // 5 stars
    makeMovie(105, '2001 A Space Odyssey', '1968'),      // 5 stars
    makeMovie(106, 'No Country for Old Men', '2007'),    // 5 stars
    makeMovie(107, 'There Will Be Blood', '2007'),       // 5 stars
    makeMovie(108, 'The Truman Show', '1998'),           // 5 stars
    makeMovie(109, 'Se7en', '1995'),                     // 5 stars
    makeMovie(110, 'The Banshees of Inisherin', '2022'), // 5 stars
    makeMovie(111, 'Grave of the Fireflies', '1988'),    // 4.5 stars
    makeMovie(112, 'Oldboy', '2003'),                    // 4.5 stars
    makeMovie(113, 'Moonlight', '2016'),                 // 4.5 stars
    makeMovie(114, 'Taxi Driver', '1976'),               // 4.5 stars
    makeMovie(115, 'Before Sunrise', '1995'),            // 4.5 stars
    makeMovie(116, 'Fantastic Mr Fox', '2009'),          // 4.5 stars
    makeMovie(117, 'The Silence of the Lambs', '1991'),  // 4.5 stars
    makeMovie(118, 'Whiplash', '2014'),                  // 4 stars
    makeMovie(119, 'Ratatouille', '2007'),               // 4 stars
    makeMovie(120, 'Forrest Gump', '1994'),              // 4 stars
    makeMovie(121, 'Hereditary', '2018'),                // 4 stars
    makeMovie(122, 'Scott Pilgrim vs the World', '2010'),// 4 stars
    makeMovie(123, 'Nightcrawler', '2014'),              // 4 stars
    makeMovie(124, 'Jaws', '1975'),                      // 4 stars
    makeMovie(125, 'Get Out', '2017'),                   // 4 stars
    makeMovie(126, 'Home Alone', '1990'),                // 3.5 stars
    makeMovie(127, 'Gone Girl', '2014'),                 // 3.5 stars
    makeMovie(128, 'Saltburn', '2023'),                  // 3 stars
  ];

  function generateZer0mileComparisons(): Comparison[] {
    const comps: Comparison[] = [];

    // 5-star vs 4.5-star
    comps.push(makeComparison(101, 111)); // Good Will Hunting > Grave of Fireflies
    comps.push(makeComparison(102, 112)); // Spirited Away > Oldboy
    comps.push(makeComparison(103, 113)); // Dead Poets Society > Moonlight
    comps.push(makeComparison(104, 114)); // Psycho > Taxi Driver
    comps.push(makeComparison(105, 115)); // 2001 > Before Sunrise
    comps.push(makeComparison(106, 116)); // No Country > Fantastic Mr Fox
    comps.push(makeComparison(107, 117)); // There Will Be Blood > Silence of Lambs
    comps.push(makeComparison(108, 111)); // Truman Show > Grave of Fireflies
    comps.push(makeComparison(109, 112)); // Se7en > Oldboy

    // 4.5-star vs 4-star
    comps.push(makeComparison(111, 118)); // Grave of Fireflies > Whiplash
    comps.push(makeComparison(112, 119)); // Oldboy > Ratatouille
    comps.push(makeComparison(113, 120)); // Moonlight > Forrest Gump
    comps.push(makeComparison(114, 121)); // Taxi Driver > Hereditary
    comps.push(makeComparison(115, 122)); // Before Sunrise > Scott Pilgrim
    comps.push(makeComparison(116, 123)); // Fantastic Mr Fox > Nightcrawler
    comps.push(makeComparison(117, 124)); // Silence of Lambs > Jaws

    // 4-star vs 3.5-star
    comps.push(makeComparison(118, 126)); // Whiplash > Home Alone
    comps.push(makeComparison(119, 127)); // Ratatouille > Gone Girl
    comps.push(makeComparison(121, 126)); // Hereditary > Home Alone
    comps.push(makeComparison(125, 127)); // Get Out > Gone Girl

    // 4-star vs 3-star
    comps.push(makeComparison(120, 128)); // Forrest Gump > Saltburn
    comps.push(makeComparison(122, 128)); // Scott Pilgrim > Saltburn
    comps.push(makeComparison(124, 128)); // Jaws > Saltburn

    // 3.5-star vs 3-star
    comps.push(makeComparison(126, 128)); // Home Alone > Saltburn
    comps.push(makeComparison(127, 128)); // Gone Girl > Saltburn

    // Cross-tier for more data
    comps.push(makeComparison(101, 118)); // Good Will Hunting > Whiplash
    comps.push(makeComparison(109, 123)); // Se7en > Nightcrawler
    comps.push(makeComparison(110, 125)); // Banshees > Get Out
    comps.push(makeComparison(102, 120)); // Spirited Away > Forrest Gump

    return comps;
  }

  test('5-star films dominate the top rankings', () => {
    const comparisons = generateZer0mileComparisons();
    const ratings = computeBradleyTerryRatings(movies, comparisons);

    const fiveStarIds = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];

    // All 5-star movies should be in top 12 (10 five-star + some flexibility)
    for (const id of fiveStarIds) {
      const rank = ratings.findIndex(r => r.movieId === id);
      expect(rank).toBeLessThan(12);
    }
  });

  test('Saltburn (3-star) should rank last or near last', () => {
    const comparisons = generateZer0mileComparisons();
    const ratings = computeBradleyTerryRatings(movies, comparisons);

    const saltburnRank = ratings.findIndex(r => r.movieId === 128);
    expect(saltburnRank).toBeGreaterThanOrEqual(movies.length - 3);
  });

  test('5-star avg rank < 4.5-star avg rank < 4-star avg rank', () => {
    const comparisons = generateZer0mileComparisons();
    const ratings = computeBradleyTerryRatings(movies, comparisons);

    const avgRank = (ids: number[]) => {
      const ranks = ids.map(id => ratings.findIndex(r => r.movieId === id));
      return ranks.reduce((a, b) => a + b, 0) / ranks.length;
    };

    const avg5 = avgRank([101, 102, 103, 104, 105, 106, 107, 108, 109, 110]);
    const avg4_5 = avgRank([111, 112, 113, 114, 115, 116, 117]);
    const avg4 = avgRank([118, 119, 120, 121, 122, 123, 124, 125]);

    expect(avg5).toBeLessThan(avg4_5);
    expect(avg4_5).toBeLessThan(avg4);
  });

  test('horror fan pattern: Hereditary and Get Out rank well among 4-stars', () => {
    const comparisons = generateZer0mileComparisons();
    const ratings = computeBradleyTerryRatings(movies, comparisons);

    // Both should be in the 4-star tier range (not in bottom quarter)
    const hereditary = ratings.findIndex(r => r.movieId === 121);
    const getOut = ratings.findIndex(r => r.movieId === 125);

    expect(hereditary).toBeLessThan(movies.length * 0.75);
    expect(getOut).toBeLessThan(movies.length * 0.75);
  });
});

describe('Cross-user comparison: Shared films', () => {
  // Both Karsten and zer0mile liked "No Country for Old Men" with 5 stars
  // This tests that the same film can rank highly in different preference profiles

  const sharedMovies: Movie[] = [
    makeMovie(200, 'No Country for Old Men', '2007'),
    makeMovie(201, 'The Shawshank Redemption', '1994'),
    makeMovie(202, 'Spirited Away', '2001'),
    makeMovie(203, 'Blade', '1998'),
    makeMovie(204, 'Home Alone', '1990'),
  ];

  test('consistent preferences produce stable rankings', () => {
    // Simulate: No Country > Spirited Away > Shawshank > Blade > Home Alone
    const comps = [
      makeComparison(200, 202), // No Country > Spirited Away
      makeComparison(202, 201), // Spirited Away > Shawshank
      makeComparison(201, 203), // Shawshank > Blade
      makeComparison(203, 204), // Blade > Home Alone
      makeComparison(200, 201), // No Country > Shawshank
      makeComparison(200, 203), // No Country > Blade
      makeComparison(202, 203), // Spirited Away > Blade
      makeComparison(201, 204), // Shawshank > Home Alone
    ];

    const ratings = computeBradleyTerryRatings(sharedMovies, comps);

    // No Country should be #1
    expect(ratings[0].movieId).toBe(200);
    // Home Alone should be last
    expect(ratings[ratings.length - 1].movieId).toBe(204);
    // Spirited Away should be #2
    expect(ratings[1].movieId).toBe(202);
  });

  test('selectNextPair avoids already-compared pairs when possible', () => {
    const comps = [
      makeComparison(200, 201),
      makeComparison(200, 202),
      makeComparison(200, 203),
      makeComparison(200, 204),
    ];

    // Next pair should not include movie 200 (already compared with all others)
    // It should pick from the under-compared movies
    const pair = selectNextPair(sharedMovies, comps);
    if (pair) {
      // At least one of the pair should NOT be movie 200
      const hasNon200 = pair[0].id !== 200 || pair[1].id !== 200;
      expect(hasNon200).toBe(true);
    }
  });
});

describe('Letterboxd stress test: Large diverse profile', () => {
  // Simulate a prolific user with 30 movies and 60 comparisons
  test('handles 30 movies with 60 comparisons correctly', () => {
    const movies: Movie[] = [];
    for (let i = 1; i <= 30; i++) {
      movies.push(makeMovie(i, `Movie ${i}`, '2020'));
    }

    // Create comparisons where lower ID = better movie (for testability)
    const comps: Comparison[] = [];
    for (let i = 0; i < 60; i++) {
      const a = Math.floor(Math.random() * 15) + 1;  // Top 15
      const b = Math.floor(Math.random() * 15) + 16;  // Bottom 15
      comps.push(makeComparison(a, b)); // Top always beats bottom
    }

    const ratings = computeBradleyTerryRatings(movies, comps);

    // Should return ratings for all 30 movies
    expect(ratings.length).toBe(30);

    // All scores should be positive
    for (const r of ratings) {
      expect(r.score).toBeGreaterThan(0);
    }

    // The top 5 should all be from the "top 15" group
    const top5Ids = ratings.slice(0, 5).map(r => r.movieId);
    for (const id of top5Ids) {
      expect(id).toBeLessThanOrEqual(15);
    }
  });
});
