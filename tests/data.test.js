import { expect, test } from 'vitest';
import projects from '../src/data/projects.json';

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
