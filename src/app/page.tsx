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

type Tab = 'add' | 'compare' | 'ranking' | 'history';

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'add',
    label: 'Add Movies',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    ),
  },
  {
    key: 'compare',
    label: 'Compare',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M16 3l4 4-4 4" />
        <path d="M20 7H4" />
        <path d="M8 21l-4-4 4-4" />
        <path d="M4 17h16" />
      </svg>
    ),
  },
  {
    key: 'ranking',
    label: 'Rankings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    key: 'history',
    label: 'History',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>
    ),
  },
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setMovies(getStoredMovies());
    setComparisons(getStoredComparisons());
  }, []);

  const handleAddMovie = useCallback((movie: Movie) => {
    const updated = storeAddMovie(movie);
    setMovies(updated);
  }, []);

  const handleRemoveMovie = useCallback((movieId: number) => {
    const updated = storeRemoveMovie(movieId);
    setMovies(updated);
    setComparisons(getStoredComparisons());
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
      setShowSettings(false);
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
        } catch {
          alert('Failed to import data. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const existingMovieIds = new Set(movies.map(m => m.id));

  const getCount = (tab: Tab) => {
    if (tab === 'add') return movies.length;
    if (tab === 'compare' || tab === 'history') return comparisons.length;
    return undefined;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7c6cf0]/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c6cf0] to-[#a599ff] flex items-center justify-center shadow-lg shadow-[#7c6cf0]/20">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 11v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" />
                <path d="m4 11 3.5-6A1 1 0 0 1 8.37 4.5h7.26a1 1 0 0 1 .87.5L20 11" />
                <path d="M8 11V8" />
                <path d="M16 11V8" />
                <path d="M12 11V4.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#f0f0f5]">
                CinemaRank
              </h1>
              <p className="text-[11px] text-[#5c5c73] font-medium tracking-wide uppercase">
                Personal Movie Rankings
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`relative p-2.5 rounded-xl transition-all duration-200 ${
              showSettings
                ? 'bg-[#7c6cf0]/15 text-[#a599ff]'
                : 'text-[#5c5c73] hover:text-[#8b8ba3] hover:bg-white/[0.03]'
            }`}
            title="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </div>

        {/* Settings dropdown */}
        {showSettings && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4 relative fade-in">
            <div className="flex flex-wrap gap-2 p-3 rounded-xl glass-card">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-[#8b8ba3] hover:text-[#f0f0f5] hover:bg-white/[0.06] transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                Export
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-[#8b8ba3] hover:text-[#f0f0f5] hover:bg-white/[0.06] transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg>
                Import
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-[#f87171]/20 text-sm text-[#f87171]/70 hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                Clear All
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Tab navigation */}
      <nav className="sticky top-0 z-30 border-b border-white/[0.04]">
        <div className="absolute inset-0 glass" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex relative">
          {tabs.map(tab => {
            const count = getCount(tab.key);
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[#f0f0f5]'
                    : 'text-[#5c5c73] hover:text-[#8b8ba3]'
                }`}
              >
                <span className={isActive ? 'text-[#a599ff]' : ''}>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {count !== undefined && count > 0 && (
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${
                    isActive
                      ? 'bg-[#7c6cf0]/20 text-[#a599ff]'
                      : 'bg-white/[0.04] text-[#5c5c73]'
                  }`}>
                    {count}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-[#7c6cf0] to-[#a599ff] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="fade-in">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.03] py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#5c5c73]">
            <p>
              Powered by the{' '}
              <a
                href="https://en.wikipedia.org/wiki/Bradley%E2%80%93Terry_model"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8b8ba3] hover:text-[#a599ff] transition-colors"
              >
                Bradley-Terry model
              </a>
            </p>
            <p>
              Movie data from{' '}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8b8ba3] hover:text-[#a599ff] transition-colors"
              >
                TMDB
              </a>
              {' '}&middot; All data stored locally
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
