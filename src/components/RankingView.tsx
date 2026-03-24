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
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#16161e] border border-white/[0.06] mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5e5e7a" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3v18h18" />
            <path d="M7 16l4-8 4 5 5-9" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold mb-3 text-white">No Movies Yet</h2>
        <p className="text-[#9494b0] text-base">Add movies and start comparing to see your rankings.</p>
      </div>
    );
  }

  if (comparisons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#16161e] border border-white/[0.06] mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5e5e7a" strokeWidth="1.5" strokeLinecap="round">
            <path d="M16 3l4 4-4 4" />
            <path d="M20 7H4" />
            <path d="M8 21l-4-4 4-4" />
            <path d="M4 17h16" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold mb-3 text-white">No Comparisons Yet</h2>
        <p className="text-[#9494b0] text-base mb-1.5">
          You have {movies.length} movie{movies.length !== 1 ? 's' : ''} ready.
        </p>
        <p className="text-[#5e5e7a] text-sm">Head to Compare to start ranking them!</p>
      </div>
    );
  }

  const maxScore = ratings.length > 0 ? ratings[0].score : 1;

  const getMedalStyle = (rank: number) => {
    if (rank === 1) return { bg: 'from-[#f5c542]/12 to-[#f5c542]/4', border: 'border-[#f5c542]/20', color: '#f5c542', label: '1st' };
    if (rank === 2) return { bg: 'from-[#c9cdd4]/12 to-[#c9cdd4]/4', border: 'border-[#c9cdd4]/15', color: '#c9cdd4', label: '2nd' };
    if (rank === 3) return { bg: 'from-[#cd7f32]/12 to-[#cd7f32]/4', border: 'border-[#cd7f32]/15', color: '#cd7f32', label: '3rd' };
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="bg-[#1a1a2a] border border-[#2a2a40] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-4 text-sm text-[#9494b0]">
          <span className="font-medium">{movies.length} movies</span>
          <span className="w-1 h-1 rounded-full bg-[#5e5e7a]" />
          <span className="font-medium">{comparisons.length} comparisons</span>
        </div>
      </div>

      {/* Top 3 podium */}
      {ratings.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-2">
          {[1, 0, 2].map(idx => {
            const rating = ratings[idx];
            const rank = idx + 1;
            const medal = getMedalStyle(rank)!;
            const isFirst = rank === 1;
            return (
              <div
                key={rating.movieId}
                className={`stagger-item relative ${isFirst ? '' : 'mt-4'}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className={`relative bg-gradient-to-b ${medal.bg} rounded-2xl border ${medal.border} p-3 pb-4 text-center shadow-lg shadow-black/20`}>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 border border-white/[0.06] bg-[#111118]">
                    <PosterImage posterPath={rating.movie.poster_path} title={rating.movie.title} size="md" />
                  </div>
                  {/* Medal badge */}
                  <div
                    className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold shadow-lg"
                    style={{ backgroundColor: medal.color, color: '#0a0a0f' }}
                  >
                    {medal.label}
                  </div>
                  <p className="text-sm font-bold text-white truncate px-1">{rating.movie.title}</p>
                  <div className="flex items-center justify-center gap-3 mt-1.5 text-xs">
                    <span className="text-[#22c584] font-semibold">{rating.wins}W</span>
                    <span className="text-[#ef5757] font-semibold">{rating.losses}L</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full ranking list */}
      <div className="space-y-2">
        {ratings.map((rating, index) => {
          const rank = index + 1;
          const barWidth = (rating.score / maxScore) * 100;
          const medal = getMedalStyle(rank);
          const winRate = rating.comparisons > 0 ? Math.round((rating.wins / rating.comparisons) * 100) : 0;

          return (
            <div
              key={rating.movieId}
              className={`stagger-item group flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-200 ${
                medal
                  ? `bg-gradient-to-r ${medal.bg} rounded-2xl border ${medal.border} shadow-lg shadow-black/20`
                  : 'bg-[#1a1a2a] border border-[#2a2a40] rounded-2xl hover:bg-[#1e1e30] hover:border-[#3a3a50] shadow-lg shadow-black/20'
              }`}
              style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
            >
              {/* Rank number */}
              <div className="w-9 text-center shrink-0">
                {medal ? (
                  <span className="text-base font-extrabold" style={{ color: medal.color }}>{rank}</span>
                ) : (
                  <span className="text-base font-bold text-[#5e5e7a]">{rank}</span>
                )}
              </div>

              {/* Poster */}
              <div className="w-11 h-16 rounded-lg overflow-hidden shrink-0 border border-white/[0.06] bg-[#111118]">
                <PosterImage posterPath={rating.movie.poster_path} title={rating.movie.title} size="sm" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-bold text-white truncate">{rating.movie.title}</h3>
                  <span className="text-xs text-[#5e5e7a] shrink-0">{rating.movie.release_date?.split('-')[0]}</span>
                </div>

                {/* Score bar */}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${barWidth}%`,
                        background: medal
                          ? `linear-gradient(90deg, ${medal.color}50, ${medal.color}90)`
                          : 'linear-gradient(90deg, #6d5cff, #8b7fff)',
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#5e5e7a] font-mono w-11 text-right shrink-0">
                    {rating.score.toFixed(2)}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-1.5 text-xs">
                  <span className="text-[#22c584] font-semibold">{rating.wins}W</span>
                  <span className="text-[#ef5757] font-semibold">{rating.losses}L</span>
                  <span className="text-[#5e5e7a]">{winRate}% win rate</span>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveMovie(rating.movieId); }}
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-[#5e5e7a] hover:text-[#ef5757] hover:bg-[#ef5757]/10 transition-all shrink-0"
                title="Remove movie"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
