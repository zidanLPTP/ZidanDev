import { expect, test } from 'vitest';
import skills from '../src/data/skills.json';
import { getSkillSprite } from '../src/components/SkillSprites';

test('skills json format validation', () => {
  expect(Array.isArray(skills)).toBe(true);
  expect(skills.length).toBe(3);
  expect(skills[0].id).toBe('javascript');
});

test('getSkillSprite returns svg element text', () => {
  expect(getSkillSprite('potion')).toContain('<svg');
  expect(getSkillSprite('potion')).toContain('crispEdges');
  expect(getSkillSprite('non-existent')).toBe('');
});
