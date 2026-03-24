'use client';

import { useState, useCallback } from 'react';
import { Movie } from '@/lib/types';
import { CURATED_MOVIES, MOVIE_CATEGORIES, searchCuratedMovies, getMoviesByCategory } from '@/lib/movie-database';
import PosterImage from './PosterImage';

interface MovieSearchProps {
  onAddMovie: (movie: Movie) => void;
  existingMovieIds: Set<number>;
}

export default function MovieSearch({ onAddMovie, existingMovieIds }: MovieSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setActiveCategory(null);
    setResults(searchCuratedMovies(query.trim()));
    setLoading(false);
  }, [query]);

  const showCategory = useCallback((category: string) => {
    setActiveCategory(category);
    setSearched(true);
    setQuery('');
    setResults(getMoviesByCategory(category));
  }, []);

  const showAll = useCallback(() => {
    setActiveCategory('all');
    setSearched(true);
    setQuery('');
    setResults([...CURATED_MOVIES]);
  }, []);

  const addAll = useCallback(() => {
    results.forEach(movie => {
      if (!existingMovieIds.has(movie.id)) {
        onAddMovie(movie);
      }
    });
  }, [results, existingMovieIds, onAddMovie]);

  const categories = Object.keys(MOVIE_CATEGORIES);
  const addableCount = results.filter(m => !existingMovieIds.has(m.id)).length;

  return (
    <div className="space-y-7">
      {/* Search bar in a visible card */}
      <div className="bg-[#1a1a2a] border border-[#2a2a40] rounded-2xl p-5 shadow-lg shadow-black/30">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5e5e7a]"
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
              placeholder="Search movies..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0e0e1a] border border-[#2a2a40] text-white placeholder-[#5e5e7a] focus:outline-none focus:border-[#6d5cff] focus:ring-2 focus:ring-[#6d5cff]/20 transition-all text-sm"
            />
          </div>
          <button
            onClick={search}
            disabled={loading || !query.trim()}
            className="px-8 py-3.5 rounded-xl bg-[#6d5cff] text-white font-semibold text-sm hover:bg-[#5d4ce6] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#6d5cff]/25"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {/* Category chips - horizontal scroll */}
      <div className="overflow-x-auto category-scroll -mx-5 sm:-mx-8 px-5 sm:px-8">
        <div className="flex gap-2.5 pb-2 min-w-max">
          <button
            onClick={showAll}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-[#6d5cff] text-white shadow-lg shadow-[#6d5cff]/30'
                : 'bg-[#1a1a2a] text-[#9494b0] hover:text-white hover:bg-[#222235] border border-[#2a2a40]'
            }`}
          >
            All ({CURATED_MOVIES.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => showCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#6d5cff] text-white shadow-lg shadow-[#6d5cff]/30'
                  : 'bg-[#1a1a2a] text-[#9494b0] hover:text-white hover:bg-[#222235] border border-[#2a2a40]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results header */}
      {searched && results.length > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#9494b0] font-medium">
            {results.length} movie{results.length !== 1 ? 's' : ''} found
          </span>
          {addableCount > 0 && (
            <button
              onClick={addAll}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#22c584]/10 text-[#22c584] border border-[#22c584]/25 text-sm font-semibold hover:bg-[#22c584]/20 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add All ({addableCount})
            </button>
          )}
        </div>
      )}

      {/* Movie grid */}
      {searched && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((movie, i) => {
            const isAdded = existingMovieIds.has(movie.id);
            return (
              <div
                key={movie.id}
                className="stagger-item"
                style={{ animationDelay: `${Math.min(i * 25, 250)}ms` }}
              >
                <div
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${
                    isAdded
                      ? 'ring-2 ring-[#22c584]/30 opacity-60'
                      : 'hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#6d5cff]/10 cursor-pointer border border-[#2a2a40] hover:border-[#6d5cff]/50'
                  }`}
                  onClick={() => !isAdded && onAddMovie(movie)}
                >
                  <div className="aspect-[2/3] relative bg-[#12121e]">
                    <PosterImage posterPath={movie.poster_path} title={movie.title} size="md" />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-sm font-bold text-white leading-tight">{movie.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-[#9494b0]">{movie.release_date?.split('-')[0]}</span>
                        {movie.vote_average > 0 && (
                          <span className="flex items-center gap-1 text-xs text-[#f5c542]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            {movie.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Added overlay */}
                    {isAdded && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="flex items-center gap-2 bg-[#22c584]/20 backdrop-blur-sm px-4 py-2 rounded-full border border-[#22c584]/30">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c584" strokeWidth="3" strokeLinecap="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span className="text-[#22c584] font-bold text-sm">Added</span>
                        </div>
                      </div>
                    )}

                    {/* Add icon on hover */}
                    {!isAdded && (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100">
                        <div className="w-9 h-9 rounded-full bg-[#6d5cff] flex items-center justify-center shadow-lg shadow-[#6d5cff]/40">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {searched && results.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#1a1a2a] border border-[#2a2a40] mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5e5e7a" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M8 11h6" />
            </svg>
          </div>
          <p className="text-[#9494b0] text-lg font-semibold">No movies found</p>
          <p className="text-[#5e5e7a] text-sm mt-2">Try a different search or browse categories above</p>
        </div>
      )}

      {/* Welcome state */}
      {!searched && (
        <div className="text-center py-16 sm:py-24">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#6d5cff]/15 to-[#8b7fff]/8 border border-[#6d5cff]/15 mb-8 float">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#8b7fff" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" />
              <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Add Movies to Rank</h2>
          <p className="text-[#9494b0] max-w-lg mx-auto text-base leading-relaxed mb-8">
            Search for movies or browse by category. Add at least 2 movies to start comparing and discover your true preferences.
          </p>
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#1a1a2a] border border-[#2a2a40] text-sm text-[#5e5e7a]">
            <div className="w-2 h-2 rounded-full bg-[#22c584]" />
            {CURATED_MOVIES.length} movies available
          </div>
        </div>
      )}
    </div>
  );
}
