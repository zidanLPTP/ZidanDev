import { expect, test } from 'vitest';
import projects from '../src/data/projects.json';
import characters from '../src/data/characters.json';
import skills from '../src/data/skills.json';
import quests from '../src/data/quests.json';

test('projects database schema validation', () => {
  expect(Array.isArray(projects)).toBe(true);
  expect(projects.length).toBeGreaterThan(0);
  projects.forEach(project => {
    expect(project).toHaveProperty('id');
    expect(project).toHaveProperty('name');
    expect(project).toHaveProperty('category');
    expect(project).toHaveProperty('isPlaceholder');
    expect(project).toHaveProperty('description');
  });
});

test('characters data has correct adjusted stats', () => {
  const developer = characters.find(c => c.id === 'developer');
  expect(developer.stats.INT).toBe(72);
  expect(developer.stats.HP).toBe(65);

  const gamer = characters.find(c => c.id === 'gamer');
  expect(gamer.stats.MP).toBe(20);
});

test('sql skill is present in skills data', () => {
  const sql = skills.find(s => s.id === 'sql');
  expect(sql).toBeDefined();
  expect(sql.type).toBe('Database');
});

test('quests data contains active and completed missions correctly', () => {
  const ieee = quests.find(q => q.id === 'ieee-webmaster');
  expect(ieee).toBeDefined();
  expect(ieee.type).toBe('active');

  const school = quests.find(q => q.id === 'school-grad');
  expect(school).toBeDefined();
  expect(school.type).toBe('completed');
  expect(school.guild).toBe('SMA Negeri 2 Sawahlunto');
});
