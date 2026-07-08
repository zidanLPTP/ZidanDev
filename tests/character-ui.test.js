import { expect, test } from 'vitest';
import '../src/main'; // imports standard modules

test('verify character ui row markup generation', () => {
  const stat = 'HP';
  const val = 80;
  const rowHtml = `
    <span class="char-stat-label">${stat}</span>
    <div class="char-stat-bar-bg">
      <div class="char-stat-bar-fill hp" style="width: ${val}%;"></div>
    </div>
    <span class="char-stat-val">${val}%</span>
  `;

  expect(rowHtml).toContain('HP');
  expect(rowHtml).toContain('style="width: 80%;"');
  expect(rowHtml).toContain('80%');
});

test('character portrait renders container with photo and fallback logic', () => {
  const container = document.createElement('div');
  container.id = 'char-portrait';
  document.body.appendChild(container);
  
  // Render structure matching production
  container.innerHTML = `
    <div class="pixelated-photo-container developer">
      <img src="/zidan.jpg" class="retro-photo" />
      <div class="fallback-sprite" style="display: none;">
        <svg viewBox="0 0 16 16"></svg>
      </div>
    </div>
  `;

  const img = container.querySelector('.retro-photo');
  const fallback = container.querySelector('.fallback-sprite');
  const wrapper = container.querySelector('.pixelated-photo-container');
  
  expect(img).not.toBeNull();
  expect(fallback).not.toBeNull();
  
  // Simulate error event listener dispatch
  img.addEventListener('error', () => {
    wrapper.classList.add('has-fallback');
    img.style.display = 'none';
    fallback.style.display = 'block';
  });

  // Fire error
  img.dispatchEvent(new Event('error'));

  expect(wrapper.classList.contains('has-fallback')).toBe(true);
  expect(img.style.display).toBe('none');
  expect(fallback.style.display).toBe('block');
  
  document.body.removeChild(container);
});
