/**
 * @jest-environment jsdom
 */

import {
  getStoredMovies,
  storeMovies,
  addMovie,
  removeMovie,
  getStoredComparisons,
  storeComparisons,
  addComparison,
  undoLastComparison,
  clearAllData,
  exportData,
  importData,
} from '../lib/storage';
import { Movie, Comparison } from '../lib/types';

const testMovie1: Movie = {
  id: 1,
  title: 'Test Movie 1',
  poster_path: '/test1.jpg',
  release_date: '2020-01-01',
  overview: 'Test movie 1',
  vote_average: 7.5,
};

const testMovie2: Movie = {
  id: 2,
  title: 'Test Movie 2',
  poster_path: '/test2.jpg',
  release_date: '2021-06-15',
  overview: 'Test movie 2',
  vote_average: 8.0,
};

const testComparison: Comparison = {
  id: '1-2-12345',
  winnerId: 1,
  loserId: 2,
  timestamp: 12345,
};

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Movies', () => {
    test('getStoredMovies returns empty array when no data', () => {
      expect(getStoredMovies()).toEqual([]);
    });

    test('storeMovies and getStoredMovies round-trip', () => {
      storeMovies([testMovie1, testMovie2]);
      const result = getStoredMovies();
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Test Movie 1');
      expect(result[1].title).toBe('Test Movie 2');
    });

    test('addMovie adds a new movie', () => {
      const result = addMovie(testMovie1);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test('addMovie prevents duplicates', () => {
      addMovie(testMovie1);
      const result = addMovie(testMovie1);
      expect(result).toHaveLength(1);
    });

    test('removeMovie removes movie and its comparisons', () => {
      addMovie(testMovie1);
      addMovie(testMovie2);
      addComparison(testComparison);

      const movies = removeMovie(1);
      expect(movies).toHaveLength(1);
      expect(movies[0].id).toBe(2);

      // Comparisons involving movie 1 should also be removed
      const comparisons = getStoredComparisons();
      expect(comparisons).toHaveLength(0);
    });
  });

  describe('Comparisons', () => {
    test('getStoredComparisons returns empty array when no data', () => {
      expect(getStoredComparisons()).toEqual([]);
    });

    test('addComparison adds to the list', () => {
      const result = addComparison(testComparison);
      expect(result).toHaveLength(1);
      expect(result[0].winnerId).toBe(1);
    });

    test('undoLastComparison removes the last comparison', () => {
      const comp2: Comparison = { id: '2-1-99', winnerId: 2, loserId: 1, timestamp: 99 };
      addComparison(testComparison);
      addComparison(comp2);

      const { comparisons, removed } = undoLastComparison();
      expect(comparisons).toHaveLength(1);
      expect(removed!.winnerId).toBe(2);
      expect(comparisons[0].winnerId).toBe(1);
    });

    test('undoLastComparison on empty returns null', () => {
      const { comparisons, removed } = undoLastComparison();
      expect(comparisons).toHaveLength(0);
      expect(removed).toBeNull();
    });
  });

  describe('Data Management', () => {
    test('clearAllData removes everything', () => {
      addMovie(testMovie1);
      addComparison(testComparison);

      clearAllData();

      expect(getStoredMovies()).toHaveLength(0);
      expect(getStoredComparisons()).toHaveLength(0);
    });

    test('exportData produces valid JSON', () => {
      addMovie(testMovie1);
      addComparison(testComparison);

      const exported = exportData();
      const parsed = JSON.parse(exported);

      expect(parsed.movies).toHaveLength(1);
      expect(parsed.comparisons).toHaveLength(1);
      expect(parsed.exportedAt).toBeDefined();
    });

    test('importData restores data correctly', () => {
      const data = JSON.stringify({
        movies: [testMovie1, testMovie2],
        comparisons: [testComparison],
      });

      const result = importData(data);
      expect(result.movies).toHaveLength(2);
      expect(result.comparisons).toHaveLength(1);

      // Verify persisted
      expect(getStoredMovies()).toHaveLength(2);
      expect(getStoredComparisons()).toHaveLength(1);
    });

    test('importData throws on invalid data', () => {
      expect(() => importData('{"invalid": true}')).toThrow('Invalid data format');
      expect(() => importData('not json')).toThrow();
    });

    test('export then import produces identical data', () => {
      addMovie(testMovie1);
      addMovie(testMovie2);
      addComparison(testComparison);

      const exported = exportData();
      clearAllData();

      expect(getStoredMovies()).toHaveLength(0);

      importData(exported);

      expect(getStoredMovies()).toHaveLength(2);
      expect(getStoredComparisons()).toHaveLength(1);
    });
  });
});
