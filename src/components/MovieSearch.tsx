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
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c5c73]"
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
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#f0f0f5] placeholder-[#5c5c73] focus:outline-none focus:border-[#7c6cf0]/50 focus:bg-white/[0.04] transition-all text-sm"
            />
          </div>
          <button
            onClick={search}
            disabled={loading || !query.trim()}
            className="px-6 py-3.5 rounded-xl bg-[#7c6cf0] text-white font-semibold text-sm hover:bg-[#6b5bdf] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#7c6cf0]/20"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={showAll}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeCategory === 'all'
              ? 'bg-[#7c6cf0] text-white shadow-md shadow-[#7c6cf0]/20'
              : 'bg-white/[0.03] text-[#8b8ba3] hover:text-[#f0f0f5] hover:bg-white/[0.06] border border-white/[0.04]'
          }`}
        >
          All ({CURATED_MOVIES.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => showCategory(cat)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-[#7c6cf0] text-white shadow-md shadow-[#7c6cf0]/20'
                : 'bg-white/[0.03] text-[#8b8ba3] hover:text-[#f0f0f5] hover:bg-white/[0.06] border border-white/[0.04]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add all button */}
      {searched && results.length > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#8b8ba3]">
            {results.length} movie{results.length !== 1 ? 's' : ''} found
          </span>
          {addableCount > 0 && (
            <button
              onClick={addAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-semibold hover:bg-[#34d399]/15 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add All ({addableCount})
            </button>
          )}
        </div>
      )}

      {/* Results grid */}
      {searched && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((movie, i) => {
            const isAdded = existingMovieIds.has(movie.id);
            return (
              <div
                key={movie.id}
                className="stagger-item"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              >
                <div
                  className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
                    isAdded
                      ? 'ring-1 ring-[#34d399]/30 opacity-60'
                      : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 cursor-pointer ring-1 ring-white/[0.04] hover:ring-[#7c6cf0]/40'
                  }`}
                  onClick={() => !isAdded && onAddMovie(movie)}
                >
                  <div className="aspect-[2/3] relative">
                    <PosterImage posterPath={movie.poster_path} title={movie.title} size="md" />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-[11px] font-semibold text-white leading-tight">{movie.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#8b8ba3]">{movie.release_date?.split('-')[0]}</span>
                        {movie.vote_average > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-[#fbbf24]">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            {movie.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Added overlay */}
                    {isAdded && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="flex items-center gap-1.5 bg-[#34d399]/20 px-3 py-1.5 rounded-full">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span className="text-[#34d399] font-semibold text-xs">Added</span>
                        </div>
                      </div>
                    )}

                    {/* Add icon on hover (not added) */}
                    {!isAdded && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-7 h-7 rounded-full bg-[#7c6cf0] flex items-center justify-center shadow-lg">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
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
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.03] mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5c5c73" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M8 11h6" />
            </svg>
          </div>
          <p className="text-[#8b8ba3] text-sm">No movies found</p>
          <p className="text-[#5c5c73] text-xs mt-1">Try a different search or browse categories above</p>
        </div>
      )}

      {/* Welcome state */}
      {!searched && (
        <div className="text-center py-16 sm:py-24">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7c6cf0]/20 to-[#a599ff]/10 mb-6 float">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a599ff" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" />
              <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#f0f0f5] mb-2">Add Movies to Rank</h2>
          <p className="text-[#8b8ba3] max-w-md mx-auto text-sm leading-relaxed mb-6">
            Search for movies or browse by category. Add at least 2 movies to start comparing and discover your true preferences.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#5c5c73]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
              {CURATED_MOVIES.length} movies available
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
