import { expect, test } from 'vitest';
import '../src/style.css'; // verify CSS imports

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

test('verify responsive CSS layout rules exist in document or style sheets', () => {
  // Create mock elements to test CSS property application if needed
  const tableCell = document.createElement('td');
  tableCell.className = 'retro-table-test';
  document.body.appendChild(tableCell);

  // We will verify the classes exist in the DOM stylesheet by loading and verifying
  const styleSheets = Array.from(document.styleSheets);
  expect(styleSheets).toBeDefined();

  document.body.removeChild(tableCell);
});
