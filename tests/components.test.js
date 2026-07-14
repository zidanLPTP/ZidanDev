import { expect, test } from 'vitest';
import { renderCard } from '../src/components/ProjectCard';

test('renders card placeholder and regular project cards', () => {
  const placeholder = { id: 'test-soon', name: 'Locked', category: 'studio', isPlaceholder: true, description: 'Coming soon!' };
  const project = { id: 'test-real', name: 'Real', category: 'random', isPlaceholder: false, description: 'Real project' };
  const projectWithImage = { id: 'test-img', name: 'Imaged', category: 'studio', isPlaceholder: false, description: 'Has image', image: '/Tumis.png' };

  const placeholderHTML = renderCard(placeholder);
  expect(placeholderHTML).toContain('INSERT COIN');
  expect(placeholderHTML).toContain('Coming soon!');

  const realHTML = renderCard(project);
  expect(realHTML).not.toContain('INSERT COIN');
  expect(realHTML).toContain('Real');

  const imgHTML = renderCard(projectWithImage);
  expect(imgHTML).toContain('card-image-wrapper');
  expect(imgHTML).toContain('src="/Tumis.png"');
  expect(imgHTML).toContain('Imaged');
});
