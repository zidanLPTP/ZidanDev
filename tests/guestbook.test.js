import { expect, test, beforeEach, vi } from 'vitest';
import { calculateScore, getLeaderboardEntries, addGuestbookEntry } from '../src/components/GuestbookHelper';

beforeEach(() => {
  localStorage.clear();
});

test('calculateScore calculates score correctly', () => {
  const score = calculateScore('hello');
  expect(score).toBeGreaterThanOrEqual(500);
  expect(score).toBeLessThanOrEqual(1000);
});

test('getLeaderboardEntries merges presets and sorts descending', () => {
  // Add a very high score to local storage
  const highEntry = { initials: 'TOP', message: 'I am top', score: 120000 };
  localStorage.setItem('guestbook_entries', JSON.stringify([highEntry]));

  const entries = getLeaderboardEntries();
  expect(entries[0].initials).toBe('TOP');
  expect(entries[0].score).toBe(120000);
  expect(entries.length).toBe(6); // 5 presets + 1 local
});

test('addGuestbookEntry rejects invalid initials or messages', () => {
  const r1 = addGuestbookEntry('AB', 'Valid message');
  expect(r1.success).toBe(false);

  const r2 = addGuestbookEntry('AAA', '');
  expect(r2.success).toBe(false);
});
