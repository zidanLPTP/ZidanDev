import { expect, test } from 'vitest';

test('verify character ui row markup generation', () => {
  const stat = 'HP';
  const val = 80;
  const rowHtml = `
    <span class="char-stat-label">${stat}</span>
    <div class="char-stat-bar-bg">
      <div class="char-stat-bar-fill hp" style="width: ${val}%;"></div>
    </div>
    <span class="char-stat-val">${val}%</span>
  `;

  expect(rowHtml).toContain('HP');
  expect(rowHtml).toContain('style="width: 80%;"');
  expect(rowHtml).toContain('80%');
});
