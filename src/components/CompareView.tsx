'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie, Comparison } from '@/lib/types';
import { selectNextPair } from '@/lib/bradley-terry';
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

  const getNextPair = useCallback(() => {
    const next = selectNextPair(movies, comparisons);
    setPair(next);
    setAnimKey(prev => prev + 1);
    setShowWinner(null);
  }, [movies, comparisons]);

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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.03] mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5c5c73" strokeWidth="1.5" strokeLinecap="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" />
            <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2 text-[#f0f0f5]">Add More Movies</h2>
        <p className="text-[#8b8ba3] max-w-sm text-sm">
          You need at least 2 movies to start comparing. Head to &quot;Add Movies&quot; to build your list.
        </p>
      </div>
    );
  }

  if (!pair) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#34d399]/20 to-[#34d399]/5 mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2 text-[#f0f0f5]">All Compared!</h2>
        <p className="text-[#8b8ba3] mb-6 text-sm">You&apos;ve made enough comparisons. Check your rankings!</p>
        <button
          onClick={getNextPair}
          className="px-6 py-3 rounded-xl bg-[#7c6cf0] text-white font-semibold text-sm hover:bg-[#6b5bdf] active:scale-[0.98] transition-all shadow-lg shadow-[#7c6cf0]/20"
        >
          Compare More
        </button>
      </div>
    );
  }

  const [movieA, movieB] = pair;

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-[#5c5c73]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7c6cf0] animate-pulse" />
          <span>{comparisons.length} comparison{comparisons.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            disabled={comparisons.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#8b8ba3] hover:text-[#f0f0f5] disabled:opacity-25 transition-all text-xs font-medium"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            Undo
          </button>
          <button
            onClick={getNextPair}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#8b8ba3] hover:text-[#f0f0f5] transition-all text-xs font-medium"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M16 3l4 4-4 4"/><path d="M20 7H4"/></svg>
            Skip
          </button>
        </div>
      </div>

      {/* Question */}
      <div className="text-center">
        <h2 className="text-lg sm:text-xl font-bold text-[#f0f0f5]">Which do you prefer?</h2>
        <p className="text-xs text-[#5c5c73] mt-1">Click the movie you like more</p>
      </div>

      {/* Comparison cards */}
      <div key={animKey} className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-10 items-start relative">
        {/* VS badge - center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7c6cf0] to-[#a599ff] flex items-center justify-center shadow-xl shadow-[#7c6cf0]/30 border-2 border-[#09090b]">
            <span className="text-white font-extrabold text-xs tracking-wider">VS</span>
          </div>
        </div>

        {/* Movie A */}
        <button
          onClick={() => handleChoice(movieA.id, movieB.id)}
          className={`slide-in-left group relative rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none ${
            showWinner === movieA.id
              ? 'ring-2 ring-[#34d399] winner-glow scale-[1.01]'
              : showWinner === movieB.id
              ? 'ring-1 ring-white/[0.04] opacity-40 scale-[0.97]'
              : 'ring-1 ring-white/[0.06] hover:ring-[#7c6cf0]/50 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          <div className="aspect-[2/3] relative">
            <PosterImage posterPath={movieA.poster_path} title={movieA.title} size="lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
              <h3 className="text-sm sm:text-lg font-bold text-white leading-tight">{movieA.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] sm:text-xs text-gray-400">{movieA.release_date?.split('-')[0]}</span>
                {movieA.vote_average > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] sm:text-xs text-[#fbbf24]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {movieA.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {showWinner === movieA.id && (
            <div className="absolute top-3 right-3 scale-in">
              <div className="flex items-center gap-1.5 bg-[#34d399] px-3 py-1.5 rounded-full shadow-lg shadow-[#34d399]/30">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                <span className="text-white font-bold text-xs">Winner</span>
              </div>
            </div>
          )}
        </button>

        {/* Movie B */}
        <button
          onClick={() => handleChoice(movieB.id, movieA.id)}
          className={`slide-in-right group relative rounded-2xl overflow-hidden transition-all duration-300 focus:outline-none ${
            showWinner === movieB.id
              ? 'ring-2 ring-[#34d399] winner-glow scale-[1.01]'
              : showWinner === movieA.id
              ? 'ring-1 ring-white/[0.04] opacity-40 scale-[0.97]'
              : 'ring-1 ring-white/[0.06] hover:ring-[#7c6cf0]/50 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          <div className="aspect-[2/3] relative">
            <PosterImage posterPath={movieB.poster_path} title={movieB.title} size="lg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
              <h3 className="text-sm sm:text-lg font-bold text-white leading-tight">{movieB.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] sm:text-xs text-gray-400">{movieB.release_date?.split('-')[0]}</span>
                {movieB.vote_average > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] sm:text-xs text-[#fbbf24]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {movieB.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {showWinner === movieB.id && (
            <div className="absolute top-3 right-3 scale-in">
              <div className="flex items-center gap-1.5 bg-[#34d399] px-3 py-1.5 rounded-full shadow-lg shadow-[#34d399]/30">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                <span className="text-white font-bold text-xs">Winner</span>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
