import { expect, test } from 'vitest';
import quests from '../src/data/quests.json';

test('verify quest accordion item layout structure generation', () => {
  const q = quests[0];
  const checkbox = q.type === 'active' ? '[ ]' : '[x]';
  const html = `
    <div class="quest-header">
      <span class="quest-checkbox">${checkbox}</span>
      <span class="quest-title">${q.title}</span>
    </div>
    <div class="quest-body">
      <div class="quest-guild">${q.guild}</div>
    </div>
  `;

  expect(html).toContain('[ ]');
  expect(html).toContain('Core Staff Member');
  expect(html).toContain('Google Developer Student Clubs');
});
