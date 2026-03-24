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
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#16161e] border border-white/[0.06] mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5e5e7a" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold mb-3 text-white">No History Yet</h2>
        <p className="text-[#9494b0] text-base">Your comparison history will appear here.</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1a1a2a] border border-[#2a2a40] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-2.5 text-sm text-[#9494b0]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span className="font-medium">{comparisons.length} comparison{comparisons.length !== 1 ? 's' : ''}</span>
        </div>
        <span className="text-xs text-[#5e5e7a]">Newest first</span>
      </div>

      {/* History list */}
      <div className="space-y-2">
        {reversed.map((comp, i) => {
          const winner = movieMap.get(comp.winnerId);
          const loser = movieMap.get(comp.loserId);
          if (!winner || !loser) return null;

          return (
            <div
              key={comp.id}
              className="stagger-item group flex items-center gap-3 sm:gap-4 p-3.5 bg-[#1a1a2a] border border-[#2a2a40] rounded-2xl hover:bg-[#1e1e30] hover:border-[#3a3a50] shadow-md shadow-black/15 transition-all"
              style={{ animationDelay: `${Math.min(i * 20, 200)}ms` }}
            >
              {/* Number */}
              <span className="text-xs font-mono text-[#5e5e7a] w-8 text-right shrink-0 font-medium">
                #{comparisons.length - i}
              </span>

              {/* Winner */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-12 rounded-lg overflow-hidden shrink-0 border border-[#22c584]/20 bg-[#111118]">
                  <PosterImage posterPath={winner.poster_path} title={winner.title} size="sm" />
                </div>
                <span className="text-sm text-[#22c584] truncate font-semibold">{winner.title}</span>
              </div>

              {/* Beat badge */}
              <div className="shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22c584]/8 border border-[#22c584]/15">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c584" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  <span className="text-[10px] text-[#5e5e7a] font-semibold uppercase tracking-wider">beat</span>
                </div>
              </div>

              {/* Loser */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-12 rounded-lg overflow-hidden shrink-0 border border-[#ef5757]/15 bg-[#111118]">
                  <PosterImage posterPath={loser.poster_path} title={loser.title} size="sm" />
                </div>
                <span className="text-sm text-[#ef5757]/70 truncate font-medium">{loser.title}</span>
              </div>

              {/* Time */}
              <span className="text-xs text-[#5e5e7a] shrink-0 hidden sm:block font-medium">
                {formatTime(comp.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
