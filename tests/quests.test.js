import { expect, test } from 'vitest';
import quests from '../src/data/quests.json';

test('quests json schema and ID validation', () => {
  expect(Array.isArray(quests)).toBe(true);
  expect(quests.length).toBeGreaterThanOrEqual(3);

  const idRegex = /^[a-z0-9-]+$/;
  quests.forEach(q => {
    expect(q.id).toBeDefined();
    expect(idRegex.test(q.id)).toBe(true);
    expect(q.title).toBeDefined();
    expect(q.guild).toBeDefined();
    expect(q.period).toBeDefined();
    expect(['active', 'completed'].includes(q.type)).toBe(true);
    expect(['guild', 'work', 'education'].includes(q.category)).toBe(true);
    expect(q.rewards).toBeDefined();
    expect(q.description).toBeDefined();
  });
});
