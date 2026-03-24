'use client';

import { Movie, Comparison } from '@/lib/types';
import PosterImage from './PosterImage';

interface HistoryViewProps {
  movies: Movie[];
  comparisons: Comparison[];
}

export default function HistoryView({ movies, comparisons }: HistoryViewProps) {
  const movieMap = new Map(movies.map(m => [m.id, m]));
  const reversed = [...comparisons].reverse();

  if (comparisons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.03] mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5c5c73" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2 text-[#f0f0f5]">No History Yet</h2>
        <p className="text-[#8b8ba3] text-sm">Your comparison history will appear here.</p>
      </div>
    );
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#5c5c73]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>{comparisons.length} comparison{comparisons.length !== 1 ? 's' : ''}</span>
        </div>
        <span className="text-[10px] text-[#5c5c73]">Newest first</span>
      </div>

      <div className="space-y-1">
        {reversed.map((comp, i) => {
          const winner = movieMap.get(comp.winnerId);
          const loser = movieMap.get(comp.loserId);
          if (!winner || !loser) return null;

          return (
            <div
              key={comp.id}
              className="stagger-item group flex items-center gap-2.5 sm:gap-3 p-2.5 rounded-xl border border-white/[0.03] hover:bg-white/[0.02] transition-all"
              style={{ animationDelay: `${Math.min(i * 20, 200)}ms` }}
            >
              {/* Number */}
              <span className="text-[10px] font-mono text-[#5c5c73] w-7 text-right shrink-0">
                {comparisons.length - i}
              </span>

              {/* Winner */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-7 h-[42px] rounded-md overflow-hidden shrink-0 ring-1 ring-[#34d399]/20">
                  <PosterImage posterPath={winner.poster_path} title={winner.title} size="sm" />
                </div>
                <span className="text-xs text-[#34d399] truncate font-medium">{winner.title}</span>
              </div>

              {/* Beat badge */}
              <div className="shrink-0">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.03]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  <span className="text-[9px] text-[#5c5c73] font-medium">beat</span>
                </div>
              </div>

              {/* Loser */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-7 h-[42px] rounded-md overflow-hidden shrink-0 ring-1 ring-[#f87171]/15">
                  <PosterImage posterPath={loser.poster_path} title={loser.title} size="sm" />
                </div>
                <span className="text-xs text-[#f87171]/70 truncate">{loser.title}</span>
              </div>

              {/* Time */}
              <span className="text-[9px] text-[#5c5c73] shrink-0 hidden sm:block">
                {formatTime(comp.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
