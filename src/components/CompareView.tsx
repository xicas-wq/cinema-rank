'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie, Comparison } from '@/lib/types';
import { selectNextPair, getRankingProgress } from '@/lib/bradley-terry';
import PosterImage from './PosterImage';

interface CompareViewProps {
  movies: Movie[];
  comparisons: Comparison[];
  onCompare: (winnerId: number, loserId: number) => void;
  onUndo: () => void;
}

export default function CompareView({ movies, comparisons, onCompare, onUndo }: CompareViewProps) {
  const [pair, setPair] = useState<[Movie, Movie] | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [showWinner, setShowWinner] = useState<number | null>(null);
  const [keepComparing, setKeepComparing] = useState(false);

  const progress = getRankingProgress(movies, comparisons);

  const getNextPair = useCallback(() => {
    if (progress.done && !keepComparing) {
      setPair(null);
      return;
    }
    const next = selectNextPair(movies, comparisons, { preferSameGenre: true });
    setPair(next);
    setAnimKey(prev => prev + 1);
    setShowWinner(null);
  }, [movies, comparisons, progress.done, keepComparing]);

  useEffect(() => {
    getNextPair();
  }, [getNextPair]);

  const handleChoice = (winnerId: number, loserId: number) => {
    setShowWinner(winnerId);
    setTimeout(() => {
      onCompare(winnerId, loserId);
    }, 500);
  };

  if (movies.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#16161e] border border-white/[0.06] mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5e5e7a" strokeWidth="1.5" strokeLinecap="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" />
            <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold mb-3 text-white">Add More Movies</h2>
        <p className="text-[#9494b0] max-w-sm text-base">
          You need at least 2 movies to start comparing. Head to &quot;Add Movies&quot; to build your list.
        </p>
      </div>
    );
  }

  // Ranking complete state
  if (!pair) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#22c584]/15 to-[#22c584]/5 border border-[#22c584]/15 mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c584" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold mb-3 text-white">Ranking Complete!</h2>
        <p className="text-[#9494b0] mb-2 text-base">
          {progress.comparedPairs}/{progress.totalPairs} unique pairs compared
        </p>
        <p className="text-[#5e5e7a] mb-8 text-sm">Your rankings are ready. Check the Rankings tab!</p>
        <button
          onClick={() => { setKeepComparing(true); }}
          className="px-8 py-3 rounded-xl bg-[#6d5cff] text-white font-semibold text-sm hover:bg-[#5d4ce6] active:scale-[0.97] transition-all shadow-lg shadow-[#6d5cff]/25"
        >
          Keep Comparing Anyway
        </button>
      </div>
    );
  }

  const [movieA, movieB] = pair;

  return (
    <div className="space-y-8">
      {/* Top bar: stats + progress + actions */}
      <div className="bg-[#1a1a2a] border border-[#2a2a40] rounded-2xl p-4 shadow-lg shadow-black/20">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2.5 text-sm text-[#9494b0]">
            <div className="w-2 h-2 rounded-full bg-[#6d5cff] animate-pulse" />
            <span className="font-medium">{progress.comparedPairs}/{progress.totalPairs} pairs</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onUndo}
              disabled={comparisons.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.06] border border-[#2a2a40] text-[#9494b0] hover:text-white hover:bg-white/[0.1] disabled:opacity-25 transition-all text-xs font-semibold"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
              Undo
            </button>
            <button onClick={getNextPair} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/[0.06] border border-[#2a2a40] text-[#9494b0] hover:text-white hover:bg-white/[0.1] transition-all text-xs font-semibold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M16 3l4 4-4 4"/><path d="M20 7H4"/></svg>
              Skip
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(progress.progress * 100, 100)}%`,
              background: progress.progress >= 1
                ? 'linear-gradient(90deg, #22c584, #22c584)'
                : 'linear-gradient(90deg, #6d5cff, #8b7fff)',
            }}
          />
        </div>
        <p className="text-[10px] text-[#5e5e7a] mt-1.5 text-right">{progress.reason}</p>
      </div>

      {/* Question */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Which do you prefer?</h2>
        <p className="text-sm text-[#5e5e7a] mt-2">Click the movie you like more</p>
      </div>

      {/* Comparison cards */}
      <div key={animKey} className="grid grid-cols-2 gap-4 sm:gap-8 items-start relative max-w-3xl mx-auto">
        {/* VS badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6d5cff] to-[#8b7fff] flex items-center justify-center shadow-xl shadow-[#6d5cff]/30 border-3 border-[#0a0a0f]">
            <span className="text-white font-extrabold text-xs tracking-widest">VS</span>
          </div>
        </div>

        {/* Movie A */}
        <button
          onClick={() => handleChoice(movieA.id, movieB.id)}
          className={`slide-in-left group relative rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none ${
            showWinner === movieA.id
              ? 'ring-3 ring-[#22c584] winner-glow scale-[1.02]'
              : showWinner === movieB.id
              ? 'opacity-40 scale-[0.96]'
              : 'border border-white/[0.08] hover:border-[#6d5cff]/50 hover:scale-[1.02] active:scale-[0.99] hover:shadow-2xl hover:shadow-[#6d5cff]/10'
          }`}
        >
          <div className="aspect-[2/3] relative bg-[#111118]">
            <PosterImage posterPath={movieA.poster_path} title={movieA.title} size="lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <h3 className="text-base sm:text-xl font-extrabold text-white leading-tight">{movieA.title}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs sm:text-sm text-gray-400">{movieA.release_date?.split('-')[0]}</span>
                {movieA.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-[#f5c542]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {movieA.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {showWinner === movieA.id && (
            <div className="absolute top-4 right-4 scale-in">
              <div className="flex items-center gap-2 bg-[#22c584] px-4 py-2 rounded-full shadow-lg shadow-[#22c584]/30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                <span className="text-white font-bold text-sm">Winner</span>
              </div>
            </div>
          )}
        </button>

        {/* Movie B */}
        <button
          onClick={() => handleChoice(movieB.id, movieA.id)}
          className={`slide-in-right group relative rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none ${
            showWinner === movieB.id
              ? 'ring-3 ring-[#22c584] winner-glow scale-[1.02]'
              : showWinner === movieA.id
              ? 'opacity-40 scale-[0.96]'
              : 'border border-white/[0.08] hover:border-[#6d5cff]/50 hover:scale-[1.02] active:scale-[0.99] hover:shadow-2xl hover:shadow-[#6d5cff]/10'
          }`}
        >
          <div className="aspect-[2/3] relative bg-[#111118]">
            <PosterImage posterPath={movieB.poster_path} title={movieB.title} size="lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <h3 className="text-base sm:text-xl font-extrabold text-white leading-tight">{movieB.title}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs sm:text-sm text-gray-400">{movieB.release_date?.split('-')[0]}</span>
                {movieB.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-xs sm:text-sm text-[#f5c542]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {movieB.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {showWinner === movieB.id && (
            <div className="absolute top-4 right-4 scale-in">
              <div className="flex items-center gap-2 bg-[#22c584] px-4 py-2 rounded-full shadow-lg shadow-[#22c584]/30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                <span className="text-white font-bold text-sm">Winner</span>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
