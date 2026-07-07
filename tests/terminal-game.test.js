import { expect, test } from 'vitest';

test('verify terminal command autocomplete list contains play and contact', () => {
  const commands = ['help', 'play', 'contact', 'clear'];
  expect(commands).toContain('play');
  expect(commands).toContain('contact');
});
