'use client';

import { useState, useCallback } from 'react';
import { Movie } from '@/lib/types';
import { CURATED_MOVIES, MOVIE_CATEGORIES, searchCuratedMovies, getMoviesByCategory } from '@/lib/movie-database';

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
  const [useTmdb, setUseTmdb] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setActiveCategory(null);

    if (useTmdb) {
      try {
        const res = await fetch(`/api/tmdb?action=search&query=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
        } else {
          // Fallback to curated
          setResults(searchCuratedMovies(query.trim()));
        }
      } catch {
        setResults(searchCuratedMovies(query.trim()));
      }
    } else {
      setResults(searchCuratedMovies(query.trim()));
    }
    setLoading(false);
  }, [query, useTmdb]);

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

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search for a movie..."
          className="flex-1 px-4 py-3 rounded-lg bg-[#1a1a2e] border border-[#2a2a40] text-[#e8e8f0] placeholder-[#9090a8] focus:outline-none focus:border-[#6c5ce7] transition-colors"
        />
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          className="px-6 py-3 rounded-lg bg-[#6c5ce7] text-white font-medium hover:bg-[#5a4bd6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={showAll}
          className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#6c5ce7] border-[#6c5ce7] text-white'
              : 'bg-[#1a1a2e] border-[#2a2a40] text-[#9090a8] hover:text-[#e8e8f0] hover:border-[#6c5ce7]'
          }`}
        >
          All ({CURATED_MOVIES.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => showCategory(cat)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              activeCategory === cat
                ? 'bg-[#6c5ce7] border-[#6c5ce7] text-white'
                : 'bg-[#1a1a2e] border-[#2a2a40] text-[#9090a8] hover:text-[#e8e8f0] hover:border-[#6c5ce7]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add all button */}
      {searched && results.length > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#9090a8]">{results.length} movies found</span>
          <button
            onClick={addAll}
            className="px-4 py-1.5 rounded-lg bg-[#00b894]/20 border border-[#00b894]/40 text-[#00b894] text-sm hover:bg-[#00b894]/30 transition-colors"
          >
            + Add All to List
          </button>
        </div>
      )}

      {/* Results grid */}
      {searched && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {results.map(movie => {
            const isAdded = existingMovieIds.has(movie.id);
            return (
              <div
                key={movie.id}
                className={`relative rounded-lg overflow-hidden border transition-all ${
                  isAdded
                    ? 'border-[#00b894] opacity-60'
                    : 'border-[#2a2a40] hover:border-[#6c5ce7] cursor-pointer hover:-translate-y-1'
                }`}
                onClick={() => !isAdded && onAddMovie(movie)}
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-[#1a1a2e] flex items-center justify-center text-[#9090a8] text-sm p-2 text-center">
                    {movie.title}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                  <p className="text-xs font-medium text-white truncate">{movie.title}</p>
                  <p className="text-[10px] text-gray-400">
                    {movie.release_date?.split('-')[0] || 'N/A'}
                    {movie.vote_average ? ` · ${movie.vote_average.toFixed(1)}★` : ''}
                  </p>
                </div>
                {isAdded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-[#00b894] font-bold text-sm">✓ Added</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {searched && results.length === 0 && !loading && (
        <p className="text-center text-[#9090a8] py-8">No movies found. Try a different search or browse categories above.</p>
      )}

      {/* Hint when no search yet */}
      {!searched && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-xl font-bold mb-2 text-[#e8e8f0]">Add Movies to Rank</h2>
          <p className="text-[#9090a8] max-w-md mx-auto mb-4">
            Search for movies or browse by category. Add at least 2 movies to start comparing and building your personal ranking.
          </p>
          <p className="text-xs text-[#9090a8]">
            {CURATED_MOVIES.length} movies available in our database
          </p>
        </div>
      )}
    </div>
  );
}
