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
  expect(entries.length).toBe(4); // 3 presets + 1 local
});

test('addGuestbookEntry rejects invalid initials or messages', () => {

  const r1 = addGuestbookEntry('AB', 'Valid message');
  expect(r1.success).toBe(false);
  expect(r1.error).toBe('Initials must be exactly 3 alphanumeric characters.');

  const r2 = addGuestbookEntry('AAA', '');
  expect(r2.success).toBe(false);
  expect(r2.error).toBe('Message cannot be empty.');
});

test('addGuestbookEntry rejects initials with punctuation, symbols, or incorrect length', () => {
  const r1 = addGuestbookEntry('A.B', 'Valid message');
  expect(r1.success).toBe(false);
  expect(r1.error).toBe('Initials must be exactly 3 alphanumeric characters.');

  const r2 = addGuestbookEntry('!!!', 'Valid message');
  expect(r2.success).toBe(false);
  expect(r2.error).toBe('Initials must be exactly 3 alphanumeric characters.');

  const r3 = addGuestbookEntry('AB', 'Valid message');
  expect(r3.success).toBe(false);
  expect(r3.error).toBe('Initials must be exactly 3 alphanumeric characters.');

  const r4 = addGuestbookEntry('ABCD', 'Valid message');
  expect(r4.success).toBe(false);
  expect(r4.error).toBe('Initials must be exactly 3 alphanumeric characters.');
});

test('addGuestbookEntry rejects messages longer than 100 characters', () => {
  const longMessage = 'A'.repeat(101);
  const r = addGuestbookEntry('AAA', longMessage);
  expect(r.success).toBe(false);
  expect(r.error).toBe('Message cannot exceed 100 characters.');

  // exactly 100 characters should be allowed
  const exactMessage = 'A'.repeat(100);
  const r2 = addGuestbookEntry('AAA', exactMessage);
  expect(r2.success).toBe(true);
});

test('handles corrupted or invalid JSON in localStorage safely', () => {
  // Corrupted JSON string
  localStorage.setItem('guestbook_entries', '{invalid_json');
  
  let entries;
  expect(() => {
    entries = getLeaderboardEntries();
  }).not.toThrow();
  expect(entries.length).toBe(3); // just presets

  let addRes;
  expect(() => {
    addRes = addGuestbookEntry('AAA', 'Hello');
  }).not.toThrow();
  expect(addRes.success).toBe(true);

  // Valid JSON but not an array
  localStorage.setItem('guestbook_entries', '{"not": "an array"}');
  expect(() => {
    entries = getLeaderboardEntries();
  }).not.toThrow();
  expect(entries.length).toBe(3); // just presets

  expect(() => {
    addRes = addGuestbookEntry('BBB', 'Hello again');
  }).not.toThrow();
  expect(addRes.success).toBe(true);
});

