import { expect, test } from 'vitest';
import characters from '../src/data/characters.json';
import { getCharacterSprite } from '../src/components/CharacterSprites';

test('characters dataset schema validation', () => {
  expect(Array.isArray(characters)).toBe(true);
  expect(characters.length).toBe(3);

  characters.forEach(c => {
    expect(c.id).toBeDefined();
    expect(c.name).toBeDefined();
    expect(c.description).toBeDefined();
    expect(c.stats).toBeDefined();
    expect(c.stats.HP).toBeDefined();
    expect(c.stats.MP).toBeDefined();
    expect(c.stats.INT).toBeDefined();
    expect(c.stats.STR).toBeDefined();
    expect(c.stats.AGI).toBeDefined();
  });
});

test('verify sprite helper output', () => {
  const d = getCharacterSprite('developer');
  expect(d).toContain('<svg');
  expect(d).toContain('fill: var(--text-cyan)');

  const invalid = getCharacterSprite('non-existent');
  expect(invalid).toBe('');
});
