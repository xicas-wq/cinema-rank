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
 * Starting from uniform strengths, we iteratively update each item's strength based on
 * the observed win/loss data until convergence.
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
      // Add small epsilon to avoid zero scores for items that only lost
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
 * Select the most informative pair of movies to compare next.
 * Uses uncertainty sampling: pick the pair whose outcome is most uncertain
 * (i.e., scores are closest together), with a bias toward movies with fewer comparisons.
 */
export function selectNextPair(
  movies: Movie[],
  comparisons: Comparison[]
): [Movie, Movie] | null {
  if (movies.length < 2) return null;

  const ratings = computeBradleyTerryRatings(movies, comparisons);
  const ratingMap = new Map(ratings.map(r => [r.movieId, r]));

  // If we have fewer than 2 movies with any comparisons, just pick randomly
  const comparedMovies = ratings.filter(r => r.comparisons > 0);

  if (comparedMovies.length < 2 || comparisons.length < movies.length) {
    // Prioritize movies with fewer comparisons
    const sorted = [...ratings].sort((a, b) => a.comparisons - b.comparisons);

    // Pick two least-compared movies, with some randomness
    const pool = sorted.slice(0, Math.max(4, Math.ceil(sorted.length * 0.3)));
    const shuffled = pool.sort(() => Math.random() - 0.5);

    const first = shuffled[0];
    let second = shuffled[1];

    // Make sure we don't pick the same movie
    if (first.movieId === second.movieId && shuffled.length > 2) {
      second = shuffled[2];
    }

    return [first.movie, second.movie];
  }

  // Find the pair with the most uncertain outcome
  let bestPair: [Movie, Movie] | null = null;
  let bestScore = -Infinity;

  // Sample pairs to avoid O(n^2) for large movie lists
  const sampleSize = Math.min(ratings.length, 20);
  const sampled = [...ratings].sort(() => Math.random() - 0.5).slice(0, sampleSize);

  for (let i = 0; i < sampled.length; i++) {
    for (let j = i + 1; j < sampled.length; j++) {
      const a = sampled[i];
      const b = sampled[j];

      // Uncertainty: how close are the scores? (closer = more uncertain)
      const p_a = a.score / (a.score + b.score);
      const uncertainty = 1 - Math.abs(p_a - 0.5) * 2; // 1 = maximally uncertain, 0 = certain

      // Bonus for movies with fewer comparisons
      const compPenalty = 1 / (1 + Math.min(a.comparisons, b.comparisons) * 0.2);

      const infoScore = uncertainty * 0.7 + compPenalty * 0.3;

      if (infoScore > bestScore) {
        bestScore = infoScore;
        bestPair = [a.movie, b.movie];
      }
    }
  }

  // Random tiebreak
  if (bestPair && Math.random() < 0.15) {
    const shuffled = [...movies].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }

  return bestPair;
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
