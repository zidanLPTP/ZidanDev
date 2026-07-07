import { expect, test } from 'vitest';
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
