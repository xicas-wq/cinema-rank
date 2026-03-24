'use client';

import { Movie, Comparison } from '@/lib/types';
import { computeBradleyTerryRatings } from '@/lib/bradley-terry';
import PosterImage from './PosterImage';

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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.03] mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5c5c73" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3v18h18" />
            <path d="M7 16l4-8 4 5 5-9" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2 text-[#f0f0f5]">No Movies Yet</h2>
        <p className="text-[#8b8ba3] text-sm">Add movies and start comparing to see your rankings.</p>
      </div>
    );
  }

  if (comparisons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.03] mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5c5c73" strokeWidth="1.5" strokeLinecap="round">
            <path d="M16 3l4 4-4 4" />
            <path d="M20 7H4" />
            <path d="M8 21l-4-4 4-4" />
            <path d="M4 17h16" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2 text-[#f0f0f5]">No Comparisons Yet</h2>
        <p className="text-[#8b8ba3] text-sm mb-1">
          You have {movies.length} movie{movies.length !== 1 ? 's' : ''} ready.
        </p>
        <p className="text-[#5c5c73] text-xs">Head to Compare to start ranking them!</p>
      </div>
    );
  }

  const maxScore = ratings.length > 0 ? ratings[0].score : 1;

  const getMedalStyle = (rank: number) => {
    if (rank === 1) return { bg: 'from-[#fbbf24]/15 to-[#fbbf24]/5', border: 'border-[#fbbf24]/20', color: '#fbbf24', label: '1st' };
    if (rank === 2) return { bg: 'from-[#d1d5db]/15 to-[#d1d5db]/5', border: 'border-[#d1d5db]/15', color: '#d1d5db', label: '2nd' };
    if (rank === 3) return { bg: 'from-[#d97706]/15 to-[#d97706]/5', border: 'border-[#d97706]/15', color: '#d97706', label: '3rd' };
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-[#5c5c73]">
          <span>{movies.length} movies</span>
          <span className="w-1 h-1 rounded-full bg-[#5c5c73]/50" />
          <span>{comparisons.length} comparisons</span>
        </div>
      </div>

      {/* Top 3 podium (only if 3+ movies) */}
      {ratings.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-2">
          {[1, 0, 2].map(idx => {
            const rating = ratings[idx];
            const rank = idx + 1;
            const medal = getMedalStyle(rank)!;
            const isFirst = rank === 1;
            return (
              <div
                key={rating.movieId}
                className={`stagger-item relative rounded-xl overflow-hidden ${isFirst ? 'row-span-1' : ''}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`relative bg-gradient-to-b ${medal.bg} rounded-xl border ${medal.border} p-2 pb-3 text-center`}>
                  <div className={`relative ${isFirst ? 'aspect-[2/3]' : 'aspect-[2/3]'} rounded-lg overflow-hidden mb-2 ring-1 ring-white/[0.06]`}>
                    <PosterImage posterPath={rating.movie.poster_path} title={rating.movie.title} size="md" />
                  </div>
                  <div
                    className="absolute -top-1 -left-1 w-7 h-7 rounded-br-lg rounded-tl-lg flex items-center justify-center text-[10px] font-extrabold"
                    style={{ backgroundColor: medal.color, color: '#09090b' }}
                  >
                    {medal.label}
                  </div>
                  <p className="text-xs font-semibold text-[#f0f0f5] truncate px-1">{rating.movie.title}</p>
                  <div className="flex items-center justify-center gap-2 mt-1 text-[10px]">
                    <span className="text-[#34d399]">{rating.wins}W</span>
                    <span className="text-[#f87171]">{rating.losses}L</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full ranking list */}
      <div className="space-y-1.5">
        {ratings.map((rating, index) => {
          const rank = index + 1;
          const barWidth = (rating.score / maxScore) * 100;
          const medal = getMedalStyle(rank);
          const winRate = rating.comparisons > 0 ? Math.round((rating.wins / rating.comparisons) * 100) : 0;

          return (
            <div
              key={rating.movieId}
              className={`stagger-item group flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.02] ${
                medal ? `bg-gradient-to-r ${medal.bg} border ${medal.border}` : 'border border-white/[0.03]'
              }`}
              style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
            >
              {/* Rank */}
              <div className="w-8 text-center shrink-0">
                {medal ? (
                  <span className="text-sm font-extrabold" style={{ color: medal.color }}>{rank}</span>
                ) : (
                  <span className="text-sm font-bold text-[#5c5c73]">{rank}</span>
                )}
              </div>

              {/* Poster */}
              <div className="w-10 h-[60px] rounded-lg overflow-hidden shrink-0 ring-1 ring-white/[0.06]">
                <PosterImage posterPath={rating.movie.poster_path} title={rating.movie.title} size="sm" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#f0f0f5] truncate">{rating.movie.title}</h3>
                  <span className="text-[10px] text-[#5c5c73] shrink-0">{rating.movie.release_date?.split('-')[0]}</span>
                </div>

                {/* Score bar */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${barWidth}%`,
                        background: medal
                          ? `linear-gradient(90deg, ${medal.color}40, ${medal.color}80)`
                          : 'linear-gradient(90deg, #7c6cf0, #a599ff)',
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-[#5c5c73] font-mono w-10 text-right shrink-0">
                    {rating.score.toFixed(2)}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 mt-1 text-[10px]">
                  <span className="text-[#34d399] font-medium">{rating.wins}W</span>
                  <span className="text-[#f87171] font-medium">{rating.losses}L</span>
                  <span className="text-[#5c5c73]">{winRate}% win rate</span>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveMovie(rating.movieId); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#5c5c73] hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all shrink-0"
                title="Remove movie"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
