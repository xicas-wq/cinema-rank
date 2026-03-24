import { Comparison, Movie, MovieRating } from './types';

/**
 * Bradley-Terry Model Implementation
 *
 * The Bradley-Terry model estimates the probability that item i beats item j as:
 *   P(i beats j) = p_i / (p_i + p_j)
 *
 * where p_i and p_j are the "strength" parameters for items i and j.
 *
 * We use iterative maximum likelihood estimation to find the strength parameters.
 */

const MAX_ITERATIONS = 100;
const CONVERGENCE_THRESHOLD = 1e-6;
const DEFAULT_SCORE = 1.0;

export function computeBradleyTerryRatings(
  movies: Movie[],
  comparisons: Comparison[]
): MovieRating[] {
  if (movies.length === 0) return [];
  if (comparisons.length === 0) {
    return movies.map(movie => ({
      movieId: movie.id,
      movie,
      score: DEFAULT_SCORE,
      wins: 0,
      losses: 0,
      comparisons: 0,
    }));
  }

  // Build win/loss counts
  const movieIds = new Set(movies.map(m => m.id));
  const movieMap = new Map(movies.map(m => [m.id, m]));

  const wins = new Map<number, number>();
  const losses = new Map<number, number>();
  const totalComparisons = new Map<number, number>();

  // Track pairwise data: pairWins[i][j] = number of times i beat j
  const pairWins = new Map<number, Map<number, number>>();
  // pairTotal[i][j] = total games between i and j
  const pairTotal = new Map<number, Map<number, number>>();

  for (const id of movieIds) {
    wins.set(id, 0);
    losses.set(id, 0);
    totalComparisons.set(id, 0);
    pairWins.set(id, new Map());
    pairTotal.set(id, new Map());
  }

  for (const comp of comparisons) {
    if (!movieIds.has(comp.winnerId) || !movieIds.has(comp.loserId)) continue;

    wins.set(comp.winnerId, (wins.get(comp.winnerId) || 0) + 1);
    losses.set(comp.loserId, (losses.get(comp.loserId) || 0) + 1);
    totalComparisons.set(comp.winnerId, (totalComparisons.get(comp.winnerId) || 0) + 1);
    totalComparisons.set(comp.loserId, (totalComparisons.get(comp.loserId) || 0) + 1);

    // Pairwise data
    const wMap = pairWins.get(comp.winnerId)!;
    wMap.set(comp.loserId, (wMap.get(comp.loserId) || 0) + 1);

    for (const id of [comp.winnerId, comp.loserId]) {
      const otherId = id === comp.winnerId ? comp.loserId : comp.winnerId;
      const tMap = pairTotal.get(id)!;
      tMap.set(otherId, (tMap.get(otherId) || 0) + 1);
    }
  }

  // Initialize scores uniformly
  const scores = new Map<number, number>();
  for (const id of movieIds) {
    scores.set(id, DEFAULT_SCORE);
  }

  // Iterative MLE update
  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    const newScores = new Map<number, number>();
    let maxChange = 0;

    for (const id of movieIds) {
      const w_i = wins.get(id) || 0;

      if (w_i === 0 && (totalComparisons.get(id) || 0) === 0) {
        newScores.set(id, DEFAULT_SCORE);
        continue;
      }

      // Sum over all opponents j: n_ij / (p_i + p_j)
      let denomSum = 0;
      const pairTotalMap = pairTotal.get(id)!;

      for (const [oppId, n_ij] of pairTotalMap) {
        const p_j = scores.get(oppId) || DEFAULT_SCORE;
        const p_i = scores.get(id) || DEFAULT_SCORE;
        denomSum += n_ij / (p_i + p_j);
      }

      // New score: w_i / denomSum
      const EPSILON = 0.01;
      const newScore = denomSum > 0 ? Math.max(w_i / denomSum, EPSILON) : DEFAULT_SCORE;
      newScores.set(id, newScore);

      const oldScore = scores.get(id) || DEFAULT_SCORE;
      maxChange = Math.max(maxChange, Math.abs(newScore - oldScore));
    }

    // Normalize scores (sum to number of items)
    const sumScores = Array.from(newScores.values()).reduce((a, b) => a + b, 0);
    const normFactor = sumScores > 0 ? movieIds.size / sumScores : 1;

    for (const [id, score] of newScores) {
      scores.set(id, score * normFactor);
    }

    if (maxChange < CONVERGENCE_THRESHOLD) {
      break;
    }
  }

  // Build results
  const ratings: MovieRating[] = [];
  for (const id of movieIds) {
    const movie = movieMap.get(id)!;
    ratings.push({
      movieId: id,
      movie,
      score: scores.get(id) || DEFAULT_SCORE,
      wins: wins.get(id) || 0,
      losses: losses.get(id) || 0,
      comparisons: totalComparisons.get(id) || 0,
    });
  }

  // Sort by score descending
  ratings.sort((a, b) => b.score - a.score);

  return ratings;
}

/**
 * Get a canonical key for a pair of movie IDs (order-independent)
 */
function pairKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

/**
 * Build a set of already-compared pair keys from comparisons
 */
function getComparedPairs(comparisons: Comparison[]): Set<string> {
  const pairs = new Set<string>();
  for (const c of comparisons) {
    pairs.add(pairKey(c.winnerId, c.loserId));
  }
  return pairs;
}

/**
 * Check if ranking is complete enough to stop.
 * Returns { done: boolean, progress: number (0-1), reason: string }
 */
export function getRankingProgress(
  movies: Movie[],
  comparisons: Comparison[]
): { done: boolean; progress: number; reason: string; totalPairs: number; comparedPairs: number } {
  const n = movies.length;
  if (n < 2) return { done: true, progress: 1, reason: 'Need at least 2 movies', totalPairs: 0, comparedPairs: 0 };

  const totalPairs = n * (n - 1) / 2;
  const comparedPairs = getComparedPairs(
    comparisons.filter(c => {
      const movieIds = new Set(movies.map(m => m.id));
      return movieIds.has(c.winnerId) && movieIds.has(c.loserId);
    })
  ).size;

  // For small lists (≤20 movies), we can compare all pairs
  if (n <= 20) {
    const progress = comparedPairs / totalPairs;
    if (comparedPairs >= totalPairs) {
      return { done: true, progress: 1, reason: 'All pairs compared!', totalPairs, comparedPairs };
    }
    return { done: false, progress, reason: `${comparedPairs}/${totalPairs} pairs compared`, totalPairs, comparedPairs };
  }

  // For larger lists, use N*log2(N) as target (enough for reliable ranking)
  const target = Math.ceil(n * Math.log2(n) * 1.5);
  const progress = Math.min(comparedPairs / target, 1);

  if (comparedPairs >= target) {
    return { done: true, progress: 1, reason: 'Ranking is reliable!', totalPairs, comparedPairs };
  }

  return { done: false, progress, reason: `${comparedPairs}/${target} comparisons for reliable ranking`, totalPairs, comparedPairs };
}

/**
 * Select the most informative pair of movies to compare next.
 *
 * Key improvements:
 * - NEVER repeats an already-compared pair (unless all pairs are done)
 * - Prioritizes movies with fewer comparisons (coverage first)
 * - Uses uncertainty sampling for informative pairs
 * - Optional genre-aware matching (prefers same-genre pairs)
 */
export function selectNextPair(
  movies: Movie[],
  comparisons: Comparison[],
  options?: { preferSameGenre?: boolean }
): [Movie, Movie] | null {
  if (movies.length < 2) return null;

  const movieIds = new Set(movies.map(m => m.id));
  const relevantComps = comparisons.filter(c => movieIds.has(c.winnerId) && movieIds.has(c.loserId));
  const comparedPairs = getComparedPairs(relevantComps);

  // Build all possible uncompared pairs
  const uncomparedPairs: [Movie, Movie][] = [];
  for (let i = 0; i < movies.length; i++) {
    for (let j = i + 1; j < movies.length; j++) {
      const key = pairKey(movies[i].id, movies[j].id);
      if (!comparedPairs.has(key)) {
        uncomparedPairs.push([movies[i], movies[j]]);
      }
    }
  }

  // If all pairs have been compared, return null (ranking complete)
  if (uncomparedPairs.length === 0) {
    return null;
  }

  const ratings = computeBradleyTerryRatings(movies, relevantComps);
  const ratingMap = new Map(ratings.map(r => [r.movieId, r]));

  // Score each uncompared pair
  const scoredPairs = uncomparedPairs.map(([a, b]) => {
    const ratingA = ratingMap.get(a.id);
    const ratingB = ratingMap.get(b.id);

    if (!ratingA || !ratingB) return { pair: [a, b] as [Movie, Movie], score: Math.random() };

    // Factor 1: Coverage — prefer movies with fewer comparisons (0 to 1, higher = more needed)
    const minComps = Math.min(ratingA.comparisons, ratingB.comparisons);
    const maxComps = Math.max(...ratings.map(r => r.comparisons), 1);
    const coverageScore = 1 - (minComps / (maxComps + 1));

    // Factor 2: Uncertainty — prefer pairs with similar scores (most informative)
    let uncertaintyScore = 0.5; // default for uncompared movies
    if (ratingA.comparisons > 0 && ratingB.comparisons > 0) {
      const p_a = ratingA.score / (ratingA.score + ratingB.score);
      uncertaintyScore = 1 - Math.abs(p_a - 0.5) * 2;
    }

    // Factor 3: Genre similarity — bonus for same-genre pairs
    let genreBonus = 0;
    if (options?.preferSameGenre && a.genre_ids?.length && b.genre_ids?.length) {
      const shared = a.genre_ids.filter(g => b.genre_ids!.includes(g));
      genreBonus = shared.length > 0 ? 0.2 : 0;
    }

    // Weighted combination: coverage most important early, uncertainty later
    const totalComps = relevantComps.length;
    const coverageWeight = totalComps < movies.length ? 0.7 : 0.3;
    const uncertaintyWeight = totalComps < movies.length ? 0.3 : 0.7;

    const score = coverageScore * coverageWeight + uncertaintyScore * uncertaintyWeight + genreBonus;

    return { pair: [a, b] as [Movie, Movie], score };
  });

  // Sort by score descending, then pick from top candidates with slight randomness
  scoredPairs.sort((a, b) => b.score - a.score);

  // Pick randomly from top 3 candidates to avoid being too predictable
  const topN = Math.min(3, scoredPairs.length);
  const pick = scoredPairs[Math.floor(Math.random() * topN)];

  return pick.pair;
}

/**
 * Get win probability for movie A vs movie B
 */
export function getWinProbability(
  movieAId: number,
  movieBId: number,
  movies: Movie[],
  comparisons: Comparison[]
): number {
  const ratings = computeBradleyTerryRatings(movies, comparisons);
  const ratingMap = new Map(ratings.map(r => [r.movieId, r]));

  const a = ratingMap.get(movieAId);
  const b = ratingMap.get(movieBId);

  if (!a || !b) return 0.5;

  return a.score / (a.score + b.score);
}
