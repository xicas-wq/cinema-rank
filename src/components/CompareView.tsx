'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie, Comparison } from '@/lib/types';
import { selectNextPair } from '@/lib/bradley-terry';

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
    }, 400);
  };

  if (movies.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-2xl font-bold mb-2">Add More Movies</h2>
        <p className="text-[#9090a8] max-w-md">
          You need at least 2 movies to start comparing. Go to the &quot;Add Movies&quot; tab to search and add movies to your list.
        </p>
      </div>
    );
  }

  if (!pair) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold mb-2">All Compared!</h2>
        <p className="text-[#9090a8] mb-4">You&apos;ve made enough comparisons. Check your rankings!</p>
        <button
          onClick={getNextPair}
          className="px-6 py-3 rounded-lg bg-[#6c5ce7] text-white font-medium hover:bg-[#5a4bd6] transition-colors"
        >
          Compare More Anyway
        </button>
      </div>
    );
  }

  const [movieA, movieB] = pair;

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="flex justify-between items-center text-sm text-[#9090a8]">
        <span>{comparisons.length} comparisons made</span>
        <div className="flex gap-2">
          <button
            onClick={onUndo}
            disabled={comparisons.length === 0}
            className="px-3 py-1 rounded bg-[#1a1a2e] border border-[#2a2a40] text-[#9090a8] hover:text-[#e8e8f0] disabled:opacity-30 transition-colors text-sm"
          >
            ↩ Undo
          </button>
          <button
            onClick={getNextPair}
            className="px-3 py-1 rounded bg-[#1a1a2e] border border-[#2a2a40] text-[#9090a8] hover:text-[#e8e8f0] transition-colors text-sm"
          >
            ⟳ Skip
          </button>
        </div>
      </div>

      {/* Which do you prefer? */}
      <h2 className="text-center text-xl font-bold text-[#a29bfe]">Which movie do you prefer?</h2>

      {/* Comparison cards */}
      <div key={animKey} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Movie A */}
        <button
          onClick={() => handleChoice(movieA.id, movieB.id)}
          className={`slide-in-left group relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
            showWinner === movieA.id
              ? 'border-[#00b894] winner-glow scale-[1.02]'
              : showWinner === movieB.id
              ? 'border-[#2a2a40] opacity-50 scale-95'
              : 'border-[#2a2a40] hover:border-[#6c5ce7] hover:scale-[1.02]'
          }`}
        >
          <div className="aspect-[2/3] relative">
            {movieA.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movieA.poster_path}`}
                alt={movieA.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center text-[#9090a8] text-lg">
                {movieA.title}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white">{movieA.title}</h3>
              <p className="text-sm text-gray-300">
                {movieA.release_date?.split('-')[0] || 'N/A'}
                {movieA.vote_average ? ` · TMDB: ${movieA.vote_average.toFixed(1)}` : ''}
              </p>
              {movieA.overview && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{movieA.overview}</p>
              )}
            </div>
          </div>
          {showWinner === movieA.id && (
            <div className="absolute top-4 right-4 bg-[#00b894] text-white rounded-full px-3 py-1 font-bold text-sm">
              ✓ Winner
            </div>
          )}
        </button>

        {/* VS divider for mobile */}
        <div className="md:hidden flex items-center justify-center -my-2">
          <span className="bg-[#6c5ce7] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
            VS
          </span>
        </div>

        {/* Movie B */}
        <button
          onClick={() => handleChoice(movieB.id, movieA.id)}
          className={`slide-in-right group relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
            showWinner === movieB.id
              ? 'border-[#00b894] winner-glow scale-[1.02]'
              : showWinner === movieA.id
              ? 'border-[#2a2a40] opacity-50 scale-95'
              : 'border-[#2a2a40] hover:border-[#6c5ce7] hover:scale-[1.02]'
          }`}
        >
          <div className="aspect-[2/3] relative">
            {movieB.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movieB.poster_path}`}
                alt={movieB.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center text-[#9090a8] text-lg">
                {movieB.title}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white">{movieB.title}</h3>
              <p className="text-sm text-gray-300">
                {movieB.release_date?.split('-')[0] || 'N/A'}
                {movieB.vote_average ? ` · TMDB: ${movieB.vote_average.toFixed(1)}` : ''}
              </p>
              {movieB.overview && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{movieB.overview}</p>
              )}
            </div>
          </div>
          {showWinner === movieB.id && (
            <div className="absolute top-4 right-4 bg-[#00b894] text-white rounded-full px-3 py-1 font-bold text-sm">
              ✓ Winner
            </div>
          )}
        </button>
      </div>

      {/* Hidden VS for desktop */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* The VS is handled in the grid gap */}
      </div>
    </div>
  );
}
