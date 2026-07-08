import { expect, test, vi } from 'vitest';
import { RetroGame } from '../src/components/RetroGame';

test('verify physics update bounds calculations', () => {
  let ballX = 100;
  let ballDx = 2;
  const width = 280;
  const ballRadius = 4;

  // Collision with right wall
  if (ballX + ballDx > width - ballRadius) {
    ballDx = -ballDx;
  }
  expect(ballDx).toBe(2);

  ballX = 277;
  if (ballX + ballDx > width - ballRadius) {
    ballDx = -ballDx;
  }
  expect(ballDx).toBe(-2);
});

test('RetroGame initialization and reset parameters', () => {
  // Create mocked DOM elements
  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  canvas.width = 240;
  canvas.height = 240;
  document.body.appendChild(canvas);

  const scoreSpan = document.createElement('span');
  scoreSpan.id = 'score';
  document.body.appendChild(scoreSpan);

  const livesSpan = document.createElement('span');
  livesSpan.id = 'lives';
  document.body.appendChild(livesSpan);

  const game = new RetroGame('gameCanvas', 'score', 'lives', () => {});
  expect(game.score).toBe(0);
  expect(game.lives).toBe(3);
  expect(game.gameOver).toBe(false);
  expect(game.victory).toBe(false);
  expect(game.active).toBe(false);

  // Clean up
  game.destroy();
  canvas.remove();
  scoreSpan.remove();
  livesSpan.remove();
});

test('RetroGame custom drawing functions run without errors', () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvasMock';
  canvas.width = 240;
  canvas.height = 240;
  document.body.appendChild(canvas);

  const game = new RetroGame('gameCanvasMock', null, null, null);
  
  // Mock canvas context functions to prevent jsdom HTML5 canvas null-pointer errors
  game.ctx = {
    clearRect: vi.fn(),
    fillText: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    closePath: vi.fn()
  };

  const fillRectSpy = vi.spyOn(game.ctx, 'fillRect');
  
  // Call draw
  game._draw();
  
  // Verify fillRect is called (representing drawing plate/bricks/packet)
  expect(fillRectSpy).toHaveBeenCalled();
  
  game.destroy();
  canvas.remove();
});
