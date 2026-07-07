import { expect, test } from 'vitest';
import quests from '../src/data/quests.json';

test('verify quest active filter and guild command mapping', () => {
  const activeGuilds = quests.filter(q => q.category === 'guild' && q.type === 'active');
  expect(activeGuilds.length).toBe(1);
  expect(activeGuilds[0].id).toBe('gdsc-staff');
});
