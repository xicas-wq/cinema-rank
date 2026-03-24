'use client';

import { Movie, Comparison } from '@/lib/types';

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
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold mb-2">No History Yet</h2>
        <p className="text-[#9090a8]">Your comparison history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#9090a8]">{comparisons.length} comparisons (newest first)</p>
      <div className="space-y-2">
        {reversed.map((comp, i) => {
          const winner = movieMap.get(comp.winnerId);
          const loser = movieMap.get(comp.loserId);
          if (!winner || !loser) return null;

          return (
            <div
              key={comp.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#12121a] border border-[#1a1a2e]"
            >
              <span className="text-xs text-[#9090a8] w-8 shrink-0">#{comparisons.length - i}</span>

              {/* Winner */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {winner.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${winner.poster_path}`}
                    alt={winner.title}
                    className="w-8 h-12 rounded object-cover shrink-0"
                    loading="lazy"
                  />
                )}
                <span className="text-sm text-[#00b894] truncate font-medium">{winner.title}</span>
              </div>

              <span className="text-xs text-[#9090a8] shrink-0">beat</span>

              {/* Loser */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {loser.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${loser.poster_path}`}
                    alt={loser.title}
                    className="w-8 h-12 rounded object-cover shrink-0"
                    loading="lazy"
                  />
                )}
                <span className="text-sm text-[#e17055] truncate">{loser.title}</span>
              </div>

              <span className="text-[10px] text-[#9090a8] shrink-0">
                {new Date(comp.timestamp).toLocaleDateString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
