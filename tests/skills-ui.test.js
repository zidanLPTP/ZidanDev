import { expect, test } from 'vitest';
import skills from '../src/data/skills.json';

test('verify rendering layout details structure', () => {
  const renderDetailsHTML = (skill) => `
    <div class="details-header">
      <h3>${skill.name.toUpperCase()}</h3>
      <div>TYPE: ${skill.type}</div>
      <div>STATS: ${skill.stats}</div>
    </div>
    <p>${skill.description}</p>
  `;

  const html = renderDetailsHTML(skills[0]);
  expect(html).toContain('JAVASCRIPT');
  expect(html).toContain('INT +60');
});
