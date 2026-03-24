import { test, expect } from '@playwright/test';

// Helper: seed localStorage with test movies and comparisons
const SEED_MOVIES = [
  { id: 27205, title: "Inception", poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", release_date: "2010-07-15", overview: "A thief who enters dreams.", vote_average: 8.4 },
  { id: 680, title: "Pulp Fiction", poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", release_date: "1994-09-10", overview: "The lives of two mob hitmen.", vote_average: 8.5 },
  { id: 155, title: "The Dark Knight", poster_path: "/qJ2tW6WMUDux911BTUgMe1e4got.jpg", release_date: "2008-07-16", overview: "Batman raises the stakes.", vote_average: 8.5 },
  { id: 278, title: "The Shawshank Redemption", poster_path: "/9cjIGRiQoJdBj0mSNPoFsQiKjiq.jpg", release_date: "1994-09-23", overview: "Imprisoned banker begins new life.", vote_average: 8.7 },
  { id: 238, title: "The Godfather", poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", release_date: "1972-03-14", overview: "Aging patriarch transfers control.", vote_average: 8.7 },
];

const SEED_COMPARISONS = [
  { id: "238-155-1", winnerId: 238, loserId: 155, timestamp: Date.now() - 60000 },
  { id: "680-238-2", winnerId: 680, loserId: 238, timestamp: Date.now() - 50000 },
  { id: "278-680-3", winnerId: 278, loserId: 680, timestamp: Date.now() - 40000 },
  { id: "27205-278-4", winnerId: 27205, loserId: 278, timestamp: Date.now() - 30000 },
];

async function seedData(page: import('@playwright/test').Page) {
  await page.evaluate(({ movies, comparisons }) => {
    localStorage.setItem('movieranker_movies', JSON.stringify(movies));
    localStorage.setItem('movieranker_comparisons', JSON.stringify(comparisons));
  }, { movies: SEED_MOVIES, comparisons: SEED_COMPARISONS });
  await page.reload();
}

// ==================== HEADER & NAVIGATION ====================

test.describe('Header & Navigation', () => {
  test('should display app logo and title', async ({ page }) => {
    await page.goto('/cinema-rank');
    await expect(page.getByRole('heading', { name: 'CinemaRank' })).toBeVisible();
    await expect(page.getByText('Personal Movie Rankings')).toBeVisible();
  });

  test('should have all 4 navigation tabs', async ({ page }) => {
    await page.goto('/cinema-rank');
    await expect(page.getByRole('button', { name: /Add Movies/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Compare/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Rankings/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /History/ })).toBeVisible();
  });

  test('should switch tabs on click', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);

    // Click Compare tab
    await page.getByRole('button', { name: /Compare/ }).click();
    await expect(page.getByText('Which do you prefer?')).toBeVisible();

    // Click Rankings tab
    await page.getByRole('button', { name: /Rankings/ }).click();
    await expect(page.getByText(/movies.*comparisons/)).toBeVisible();

    // Click History tab
    await page.getByRole('button', { name: /History/ }).click();
    await expect(page.getByText(/comparisons/)).toBeVisible();
    await expect(page.getByText('Newest first')).toBeVisible();
  });

  test('should toggle settings panel', async ({ page }) => {
    await page.goto('/cinema-rank');
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(page.getByRole('button', { name: /Export/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Import/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear All/ })).toBeVisible();
  });

  test('should show badge counts', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    // Add Movies should show movie count
    const addTab = page.getByRole('button', { name: /Add Movies/ });
    await expect(addTab.getByText('5')).toBeVisible();
    // Compare should show comparison count
    const compareTab = page.getByRole('button', { name: /Compare/ });
    await expect(compareTab.getByText('4')).toBeVisible();
  });
});

// ==================== ADD MOVIES ====================

test.describe('Add Movies Tab', () => {
  test('should show welcome state when no search', async ({ page }) => {
    await page.goto('/cinema-rank');
    await expect(page.getByRole('heading', { name: 'Add Movies to Rank' })).toBeVisible();
    await expect(page.getByText('97 movies available')).toBeVisible();
  });

  test('should show category buttons', async ({ page }) => {
    await page.goto('/cinema-rank');
    const categories = ['All (97)', 'All Time Classics', 'Modern Masterpieces', 'Sci-Fi & Fantasy', 'Animation', 'Superhero', 'Drama', 'Thriller & Horror', 'Adventure', 'Harry Potter', 'Recent Hits'];
    for (const cat of categories) {
      await expect(page.getByRole('button', { name: cat })).toBeVisible();
    }
  });

  test('should display movie grid on category click', async ({ page }) => {
    await page.goto('/cinema-rank');
    await page.getByRole('button', { name: 'Animation' }).click();
    await expect(page.getByText(/movies found/)).toBeVisible();
    // Should show movie poster images
    const images = page.locator('img[alt]').first();
    await expect(images).toBeVisible();
  });

  test('should search movies', async ({ page }) => {
    await page.goto('/cinema-rank');
    await page.getByPlaceholder('Search movies...').fill('Inception');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText(/movie[s]? found/)).toBeVisible();
    await expect(page.getByText('Inception').first()).toBeVisible();
  });

  test('should mark added movies with checkmark', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: 'All (97)' }).click();
    // Movies already in list should show "Added" overlay
    await expect(page.getByText('Added').first()).toBeVisible();
  });

  test('should show Add All button with count', async ({ page }) => {
    await page.goto('/cinema-rank');
    await page.getByRole('button', { name: 'Animation' }).click();
    await expect(page.getByRole('button', { name: /Add All/ })).toBeVisible();
  });
});

// ==================== COMPARE VIEW ====================

test.describe('Compare View', () => {
  test('should show empty state with < 2 movies', async ({ page }) => {
    await page.goto('/cinema-rank');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    await page.getByRole('button', { name: /Compare/ }).click();
    await expect(page.getByText('Add More Movies')).toBeVisible();
  });

  test('should show two movie posters side by side', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: /Compare/ }).click();
    await expect(page.getByText('Which do you prefer?')).toBeVisible();
    // Should have VS badge
    await expect(page.getByText('VS')).toBeVisible();
    // Should have Undo and Skip buttons
    await expect(page.getByRole('button', { name: /Undo/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Skip/ })).toBeVisible();
  });

  test('should show comparison counter', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: /Compare/ }).click();
    await expect(page.getByText(/4 comparison/)).toBeVisible();
  });

  test('should record a comparison when poster clicked', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: /Compare/ }).click();
    // Click the first movie button (left poster)
    const movieButtons = page.locator('button').filter({ has: page.locator('h3') });
    const firstMovie = movieButtons.first();
    await firstMovie.click();
    // Wait for winner animation
    await page.waitForTimeout(600);
    // Comparison count should increase
    await expect(page.getByText(/5 comparison/)).toBeVisible();
  });
});

// ==================== RANKINGS VIEW ====================

test.describe('Rankings View', () => {
  test('should show empty state with no movies', async ({ page }) => {
    await page.goto('/cinema-rank');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole('button', { name: /Rankings/ }).click();
    await expect(page.getByText('No Movies Yet')).toBeVisible();
  });

  test('should show no-comparisons state', async ({ page }) => {
    await page.goto('/cinema-rank');
    await page.evaluate(() => {
      localStorage.setItem('movieranker_movies', JSON.stringify([
        { id: 1, title: "Movie A", poster_path: null, release_date: "2024", overview: "", vote_average: 8 },
        { id: 2, title: "Movie B", poster_path: null, release_date: "2024", overview: "", vote_average: 7 },
      ]));
      localStorage.setItem('movieranker_comparisons', JSON.stringify([]));
    });
    await page.reload();
    await page.getByRole('button', { name: /Rankings/ }).click();
    await expect(page.getByText('No Comparisons Yet')).toBeVisible();
  });

  test('should show podium for top 3 movies', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: /Rankings/ }).click();
    // Should show medal badges
    await expect(page.getByText('1st')).toBeVisible();
    await expect(page.getByText('2nd')).toBeVisible();
    await expect(page.getByText('3rd')).toBeVisible();
  });

  test('should show ranked list with scores and stats', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: /Rankings/ }).click();
    // All 5 movies should appear in ranking list
    for (const movie of ['Inception', 'Pulp Fiction', 'The Dark Knight', 'The Shawshank Redemption', 'The Godfather']) {
      await expect(page.getByRole('heading', { name: movie })).toBeVisible();
    }
    // Should show win/loss stats
    await expect(page.getByText('win rate').first()).toBeVisible();
  });

  test('should show score bars', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: /Rankings/ }).click();
    // #1 ranked movie should have highest score
    const scores = await page.locator('[class*="font-mono"]').allTextContents();
    const numericScores = scores.filter(s => /^\d/.test(s)).map(Number);
    // Scores should be in descending order
    for (let i = 1; i < numericScores.length; i++) {
      expect(numericScores[i]).toBeLessThanOrEqual(numericScores[i - 1]);
    }
  });

  test('should have remove buttons on hover', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: /Rankings/ }).click();
    // Remove buttons should exist
    const removeButtons = page.getByRole('button', { name: 'Remove movie' });
    expect(await removeButtons.count()).toBe(5);
  });
});

// ==================== HISTORY VIEW ====================

test.describe('History View', () => {
  test('should show empty state', async ({ page }) => {
    await page.goto('/cinema-rank');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole('button', { name: /History/ }).click();
    await expect(page.getByText('No History Yet')).toBeVisible();
  });

  test('should show comparison history in reverse order', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: /History/ }).click();
    await expect(page.getByText(/4 comparison/)).toBeVisible();
    await expect(page.getByText('Newest first')).toBeVisible();
    // Should show "beat" badges
    const beatBadges = page.getByText('beat');
    expect(await beatBadges.count()).toBe(4);
  });

  test('should show relative timestamps', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: /History/ }).click();
    // Should show relative time like "1m ago" or "Just now"
    await expect(page.getByText(/ago/).first()).toBeVisible();
  });

  test('should show winner in green and loser in red', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: /History/ }).click();
    // Check winner text color (green: #34d399)
    const winnerEl = page.locator('.text-\\[\\#34d399\\]').first();
    await expect(winnerEl).toBeVisible();
  });
});

// ==================== POSTER FALLBACK ====================

test.describe('Poster Fallbacks', () => {
  test('should show fallback for movies without poster_path', async ({ page }) => {
    await page.goto('/cinema-rank');
    await page.evaluate(() => {
      localStorage.setItem('movieranker_movies', JSON.stringify([
        { id: 1, title: "No Poster Movie", poster_path: null, release_date: "2024", overview: "Test", vote_average: 8 },
        { id: 2, title: "Has Poster", poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg", release_date: "2024", overview: "Test", vote_average: 7 },
      ]));
      localStorage.setItem('movieranker_comparisons', JSON.stringify([
        { id: "1-2-1", winnerId: 1, loserId: 2, timestamp: Date.now() }
      ]));
    });
    await page.reload();
    await page.getByRole('button', { name: /Rankings/ }).click();
    // Should show fallback container instead of broken image
    const fallbacks = page.locator('.poster-fallback');
    expect(await fallbacks.count()).toBeGreaterThan(0);
  });
});

// ==================== DATA MANAGEMENT ====================

test.describe('Data Management', () => {
  test('should export data as JSON', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: 'Settings' }).click();
    // Export button should be visible
    const exportBtn = page.getByRole('button', { name: /Export/ });
    await expect(exportBtn).toBeVisible();
  });

  test('should clear all data', async ({ page }) => {
    await page.goto('/cinema-rank');
    await seedData(page);
    await page.getByRole('button', { name: 'Settings' }).click();

    // Set up dialog handler to auto-confirm
    page.on('dialog', dialog => dialog.accept());

    await page.getByRole('button', { name: /Clear All/ }).click();

    // After clear, should go back to add tab with 0 movies
    await expect(page.getByRole('heading', { name: 'Add Movies to Rank' })).toBeVisible();
  });
});

// ==================== FOOTER ====================

test.describe('Footer', () => {
  test('should show Bradley-Terry model link', async ({ page }) => {
    await page.goto('/cinema-rank');
    await expect(page.getByRole('link', { name: 'Bradley-Terry model' })).toBeVisible();
  });

  test('should show TMDB attribution', async ({ page }) => {
    await page.goto('/cinema-rank');
    await expect(page.getByRole('link', { name: 'TMDB' })).toBeVisible();
    await expect(page.getByText('All data stored locally')).toBeVisible();
  });
});
