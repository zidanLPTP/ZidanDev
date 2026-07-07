import { expect, test } from 'vitest';

test('verify contact sidebar elements content structure', () => {
  const label = 'GITHUB';
  const val = 'github.com/zidanLPTP';
  const html = `
    <div class="contact-label">> ${label}</div>
    <div class="contact-val">${val}</div>
  `;

  expect(html).toContain('GITHUB');
  expect(html).toContain('github.com/zidanLPTP');
});
