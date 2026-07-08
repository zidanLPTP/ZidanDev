import { expect, test } from 'vitest';
import { addGuestbookEntry } from '../src/components/GuestbookHelper';

test('verify addGuestbookEntry accepts customScore parameter overrides', async () => {
  localStorage.clear();
  const res = await addGuestbookEntry('ZDN', 'Mini message', 5000);
  expect(res.success).toBe(true);
  expect(res.entry.score).toBe(5000); // 5000 instead of text length score
});
