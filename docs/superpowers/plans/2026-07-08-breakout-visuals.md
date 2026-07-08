# Breakout Custom Visuals (Plate and Seasoning Packet) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the Breakout game visual elements to render a pixelated plate (piring) for the paddle and a seasoning packet (bungkusan bumbu) for the ball.

**Architecture:** Update the drawing methods in `src/components/RetroGame.js` to draw the custom styled path and color properties inside the Canvas 2D render loop. Run tests to ensure no physics logic is broken.

**Tech Stack:** HTML5 Canvas, Javascript, Vitest.

## Global Constraints
- Avoid third-party styling frameworks (no TailwindCSS/Bootstrap). Use pure Vanilla CSS with variables.
- Retain existing unit test suites and assert all 41 test suites pass.

---

### Task 1: Implement custom drawings for Plate and Seasoning Packet

**Files:**
- Modify: `src/components/RetroGame.js`
- Test: `tests/retro-game.test.js`

**Interfaces:**
- Consumes: Canvas 2D context
- Produces: Updated paddle and ball visual representations

- [ ] **Step 1: Write a unit test asserting drawing methods and canvas calls**

We will update [tests/retro-game.test.js](file:///D:/PortofolioWeb/tests/retro-game.test.js) to verify that the custom visual assets render methods do not throw errors.
```javascript
import { expect, test, vi } from 'vitest';
import { RetroGame } from '../src/components/RetroGame';

test('RetroGame custom drawing functions run without errors', () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'game-canvas-mock';
  document.body.appendChild(canvas);

  const game = new RetroGame('game-canvas-mock', null, null, null);
  
  // Spy on canvas context functions
  const fillRectSpy = vi.spyOn(game.ctx, 'fillRect');
  
  // Call draw
  game._draw();
  
  // Verify fillRect is called (representing drawing plate/bricks/packet)
  expect(fillRectSpy).toHaveBeenCalled();
  
  game.destroy();
  document.body.removeChild(canvas);
});
```

- [ ] **Step 2: Run tests to verify the suite fails or passes (mock checks)**

Run: `npm run test`
Expected: Test passes or fails depending on mock environment.

- [ ] **Step 3: Update src/components/RetroGame.js with custom Plate drawing**

In `src/components/RetroGame.js`, find the paddle drawing block around lines 268-270:
```javascript
    // Draw paddle
    this.ctx.fillStyle = "magenta";
    this.ctx.fillRect(this.paddleX, this.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
```
Replace it with:
```javascript
    // Draw plate (piring) paddle
    const px = this.paddleX;
    const py = this.height - this.paddleHeight;
    const pw = this.paddleWidth;
    const ph = this.paddleHeight;

    // Body piring abu-abu terang / putih seng
    this.ctx.fillStyle = "#e0e0e0";
    this.ctx.fillRect(px + 4, py + 2, pw - 8, ph - 2); // bagian tengah piring
    this.ctx.fillRect(px, py, 4, 3); // bibir piring kiri
    this.ctx.fillRect(px + 2, py + 2, 2, 2);
    this.ctx.fillRect(px + pw - 4, py, 4, 3); // bibir piring kanan
    this.ctx.fillRect(px + pw - 4, py + 2, 2, 2);

    // Garis hiasan piring tradisional biru
    this.ctx.fillStyle = "#0078d4";
    this.ctx.fillRect(px + 6, py + 4, pw - 12, 1.5);
```

- [ ] **Step 4: Update src/components/RetroGame.js with custom Seasoning Packet drawing**

In `src/components/RetroGame.js`, find the ball drawing block around lines 319-324:
```javascript
    // Draw ball (only when game is started)
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = "cyan";
    this.ctx.fill();
    this.ctx.closePath();
```
Replace it with:
```javascript
    // Draw seasoning packet (bungkusan bumbu) ball
    const bx = this.ballX - 4;
    const by = this.ballY - 4;
    const size = 8;

    // Warna dasar kuning kemasan
    this.ctx.fillStyle = "#ffd343";
    this.ctx.fillRect(bx, by, size, size);

    // Label tengah merah
    this.ctx.fillStyle = "#ff2d20";
    this.ctx.fillRect(bx + 2, by + 2, size - 4, size - 4);

    // Efek gerigi kemasan atas dan bawah
    this.ctx.fillStyle = "#b58d10";
    for (let i = 0; i < size; i += 2) {
      this.ctx.fillRect(bx + i, by, 1, 1);
      this.ctx.fillRect(bx + i + 1, by + size - 1, 1, 1);
    }
```

- [ ] **Step 5: Run Vitest tests**

Run: `npm run test`
Expected: All 42 tests pass.

- [ ] **Step 6: Run build check**

Run: `npm run build`
Expected: Build is successful.

- [ ] **Step 7: Commit local changes**

Run:
```bash
git add src/components/RetroGame.js tests/retro-game.test.js
git commit -m "feat: customize Breakout visuals to render plate paddle and seasoning packet ball"
```
