'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie, Comparison } from '@/lib/types';
import {
  getStoredMovies,
  getStoredComparisons,
  addMovie as storeAddMovie,
  removeMovie as storeRemoveMovie,
  addComparison,
  undoLastComparison,
  clearAllData,
  exportData,
  importData,
} from '@/lib/storage';
import MovieSearch from '@/components/MovieSearch';
import CompareView from '@/components/CompareView';
import RankingView from '@/components/RankingView';
import HistoryView from '@/components/HistoryView';

type Tab = 'compare' | 'add' | 'ranking' | 'history';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [showSettings, setShowSettings] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setMovies(getStoredMovies());
    setComparisons(getStoredComparisons());
  }, []);

  // Auto-switch to compare once user has enough movies
  useEffect(() => {
    if (movies.length >= 2 && activeTab === 'add' && comparisons.length === 0) {
      // Don't auto-switch, let the user decide
    }
  }, [movies.length, activeTab, comparisons.length]);

  const handleAddMovie = useCallback((movie: Movie) => {
    const updated = storeAddMovie(movie);
    setMovies(updated);
  }, []);

  const handleRemoveMovie = useCallback((movieId: number) => {
    const updated = storeRemoveMovie(movieId);
    setMovies(updated);
    setComparisons(getStoredComparisons()); // Re-read since removals also clean comparisons
  }, []);

  const handleCompare = useCallback((winnerId: number, loserId: number) => {
    const comparison: Comparison = {
      id: `${winnerId}-${loserId}-${Date.now()}`,
      winnerId,
      loserId,
      timestamp: Date.now(),
    };
    const updated = addComparison(comparison);
    setComparisons(updated);
  }, []);

  const handleUndo = useCallback(() => {
    const { comparisons: updated } = undoLastComparison();
    setComparisons(updated);
  }, []);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllData();
      setMovies([]);
      setComparisons([]);
      setActiveTab('add');
    }
  }, []);

  const handleExport = useCallback(() => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cinemarank-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = importData(ev.target?.result as string);
          setMovies(data.movies);
          setComparisons(data.comparisons);
          alert(`Imported ${data.movies.length} movies and ${data.comparisons.length} comparisons!`);
        } catch {
          alert('Failed to import data. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const existingMovieIds = new Set(movies.map(m => m.id));

  const tabs: { key: Tab; label: string; icon: string; count?: number }[] = [
    { key: 'add', label: 'Add Movies', icon: '🔍', count: movies.length },
    { key: 'compare', label: 'Compare', icon: '⚔️', count: comparisons.length },
    { key: 'ranking', label: 'Rankings', icon: '🏆' },
    { key: 'history', label: 'History', icon: '📜', count: comparisons.length },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#2a2a40] bg-[#12121a]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎬</span>
            <div>
              <h1 className="text-xl font-bold text-[#e8e8f0]">CinemaRank</h1>
              <p className="text-xs text-[#9090a8]">Rank movies by pairwise comparison</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg text-[#9090a8] hover:text-[#e8e8f0] hover:bg-[#1a1a2e] transition-colors"
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Settings dropdown */}
        {showSettings && (
          <div className="max-w-5xl mx-auto px-4 pb-4">
            <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-[#1a1a2e] border border-[#2a2a40]">
              <button
                onClick={handleExport}
                className="px-3 py-1.5 rounded bg-[#12121a] border border-[#2a2a40] text-sm text-[#9090a8] hover:text-[#e8e8f0] transition-colors"
              >
                📥 Export Data
              </button>
              <button
                onClick={handleImport}
                className="px-3 py-1.5 rounded bg-[#12121a] border border-[#2a2a40] text-sm text-[#9090a8] hover:text-[#e8e8f0] transition-colors"
              >
                📤 Import Data
              </button>
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 rounded bg-[#12121a] border border-[#e17055]/30 text-sm text-[#e17055] hover:bg-[#e17055]/10 transition-colors"
              >
                🗑️ Clear All Data
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Tab navigation */}
      <nav className="border-b border-[#2a2a40] bg-[#12121a] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 flex">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#6c5ce7] text-[#e8e8f0]'
                  : 'border-transparent text-[#9090a8] hover:text-[#e8e8f0]'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? 'bg-[#6c5ce7]/20 text-[#a29bfe]'
                    : 'bg-[#2a2a40] text-[#9090a8]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {activeTab === 'add' && (
          <MovieSearch onAddMovie={handleAddMovie} existingMovieIds={existingMovieIds} />
        )}
        {activeTab === 'compare' && (
          <CompareView
            movies={movies}
            comparisons={comparisons}
            onCompare={handleCompare}
            onUndo={handleUndo}
          />
        )}
        {activeTab === 'ranking' && (
          <RankingView
            movies={movies}
            comparisons={comparisons}
            onRemoveMovie={handleRemoveMovie}
          />
        )}
        {activeTab === 'history' && (
          <HistoryView movies={movies} comparisons={comparisons} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a2a40] bg-[#12121a] py-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-[#9090a8]">
          <p>CinemaRank uses the <a href="https://en.wikipedia.org/wiki/Bradley%E2%80%93Terry_model" target="_blank" rel="noopener noreferrer" className="text-[#a29bfe] hover:underline">Bradley-Terry model</a> to rank movies based on your pairwise preferences.</p>
          <p className="mt-1">Movie data from <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-[#a29bfe] hover:underline">TMDB</a>. All rankings stored locally in your browser.</p>
        </div>
      </footer>
    </div>
  );
}
