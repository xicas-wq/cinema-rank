'use client';

import { Movie, Comparison, MovieRating } from '@/lib/types';
import { computeBradleyTerryRatings } from '@/lib/bradley-terry';

interface RankingViewProps {
  movies: Movie[];
  comparisons: Comparison[];
  onRemoveMovie: (movieId: number) => void;
}

export default function RankingView({ movies, comparisons, onRemoveMovie }: RankingViewProps) {
  const ratings = computeBradleyTerryRatings(movies, comparisons);

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-2">No Movies Yet</h2>
        <p className="text-[#9090a8]">Add movies and start comparing to see your rankings here.</p>
      </div>
    );
  }

  if (comparisons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">⚖️</div>
        <h2 className="text-2xl font-bold mb-2">No Comparisons Yet</h2>
        <p className="text-[#9090a8] mb-2">
          You have {movies.length} movie{movies.length !== 1 ? 's' : ''} added.
        </p>
        <p className="text-[#9090a8]">Go to the Compare tab to start ranking them!</p>
      </div>
    );
  }

  const maxScore = ratings.length > 0 ? ratings[0].score : 1;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex justify-between items-center text-sm text-[#9090a8] mb-2">
        <span>{movies.length} movies · {comparisons.length} comparisons</span>
      </div>

      {/* Ranking list */}
      <div className="space-y-2">
        {ratings.map((rating, index) => {
          const rank = index + 1;
          const barWidth = (rating.score / maxScore) * 100;
          const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

          return (
            <div
              key={rating.movieId}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                rank <= 3
                  ? 'bg-[#1a1a2e] border-[#2a2a40]'
                  : 'bg-[#12121a] border-[#1a1a2e]'
              }`}
            >
              {/* Rank */}
              <div className="w-10 text-center shrink-0">
                {medalEmoji ? (
                  <span className="text-2xl">{medalEmoji}</span>
                ) : (
                  <span className="text-lg font-bold text-[#9090a8]">#{rank}</span>
                )}
              </div>

              {/* Poster thumbnail */}
              <div className="w-12 h-18 rounded overflow-hidden shrink-0">
                {rating.movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${rating.movie.poster_path}`}
                    alt={rating.movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2a2a40] flex items-center justify-center text-[10px] text-[#9090a8]">
                    N/A
                  </div>
                )}
              </div>

              {/* Movie info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#e8e8f0] truncate">
                  {rating.movie.title}
                  <span className="text-xs text-[#9090a8] ml-2">
                    ({rating.movie.release_date?.split('-')[0] || 'N/A'})
                  </span>
                </h3>

                {/* Score bar */}
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#2a2a40] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        background: rank <= 3
                          ? 'linear-gradient(90deg, #6c5ce7, #a29bfe)'
                          : '#6c5ce7',
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#9090a8] w-12 text-right shrink-0">
                    {rating.score.toFixed(2)}
                  </span>
                </div>

                {/* Win/Loss */}
                <div className="flex gap-3 mt-1 text-xs">
                  <span className="text-[#00b894]">{rating.wins}W</span>
                  <span className="text-[#e17055]">{rating.losses}L</span>
                  <span className="text-[#9090a8]">{rating.comparisons} total</span>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => onRemoveMovie(rating.movieId)}
                className="text-[#9090a8] hover:text-[#e17055] transition-colors p-1 shrink-0"
                title="Remove movie"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
