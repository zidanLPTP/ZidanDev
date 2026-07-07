import { expect, test } from 'vitest';

test('verify XSS protection via textContent usage mockup', () => {
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  
  const exploitText = "<script>alert('hack')</script>";
  td.textContent = exploitText;
  tr.appendChild(td);

  expect(tr.innerHTML).not.toContain('<script>');
  expect(td.innerHTML).toBe('&lt;script&gt;alert(\'hack\')&lt;/script&gt;');
});
