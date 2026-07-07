# Floating Retro Minigame & Contact Panels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a floating retro Breakout game cabinet drawer overlay (supporting key/touch controls and CPU frame loop throttling) and integrate the third contact sidebar panel in the Guestbook section. Includes direct leaderboard scoring integrations and play/contact CLI commands.

**Tech Stack:** Vite, Vanilla JS, Vanilla CSS, Vitest.

## Global Constraints
- Avoid third-party styling frameworks (no TailwindCSS/Bootstrap). Use pure Vanilla CSS with variables.
- Ponytail Constraint: Keep code short, concise, and prioritize native browser Web APIs and JS methods.
- Keyboard Focus blur: The terminal `play` command must blur terminal text input focus (`this.input.blur()`) and focus the game canvas (`canvas.focus()`).
- Canvas Aesthetics: The canvas must render crisp pixel-borders on High-DPI screen via CSS `image-rendering: pixelated; image-rendering: crisp-edges;`.
- Performance Loops: Animating loops (`requestAnimationFrame`) must run only while the cabinet drawer is expanded, and be cancelled immediately via `cancelAnimationFrame` when collapsed to save CPU resources.
- Score Integration: The game dispatches `'game-finished'` with `{ score }` which pre-fills the Guestbook form with a visual score badge. Submitting this form uses `customScore` inside `addGuestbookEntry`.
- High-fidelity Retro Arcade design must use Google Fonts `Press Start 2P` and `VT323`.

---

### Task 1: Add Custom Score to Guestbook Database & Helper

**Files:**
- Modify: `src/components/GuestbookHelper.js`
- Create: `tests/guestbook-game.test.js`

**Interfaces:**
- Consumes: `src/components/GuestbookHelper.js` (`addGuestbookEntry`)
- Produces: Parameter `customScore` handling inside helper database loading.

- [ ] **Step 1: Modify addGuestbookEntry in src/components/GuestbookHelper.js**

Update `addGuestbookEntry` signature and scoring check:
```javascript
export function addGuestbookEntry(initials, message, customScore = null) {
  const cleanInitials = initials.trim().toUpperCase();
  if (!/^[A-Z0-9]{3}$/.test(cleanInitials)) {
    return { success: false, error: 'Initials must be exactly 3 alphanumeric characters.' };
  }
  if (!message.trim()) return { success: false, error: 'Message cannot be empty.' };
  if (message.length > 100) return { success: false, error: 'Message cannot exceed 100 characters.' };

  const score = customScore !== null ? Number(customScore) : calculateScore(message);
  const newEntry = {
    initials: cleanInitials,
    message,
    score
  };
  ...
```

- [ ] **Step 2: Create unit test tests/guestbook-game.test.js**

Verify customScore overrides text-length score:
```javascript
import { expect, test } from 'vitest';
import { addGuestbookEntry } from '../src/components/GuestbookHelper';

test('verify addGuestbookEntry accepts customScore parameter overrides', () => {
  localStorage.clear();
  const res = addGuestbookEntry('ZDN', 'Mini message', 5000);
  expect(res.success).toBe(true);
  expect(res.entry.score).toBe(5000); // 5000 instead of text length score
});
```

- [ ] **Step 3: Run tests**

Run: `npm run test`
Expected: 1 passed

- [ ] **Step 4: Commit**

```bash
git add src/components/GuestbookHelper.js tests/guestbook-game.test.js
git commit -m "feat: add support for registering direct minigame custom scores to guestbook helper"
```

---

### Task 2: Implement Breakout RetroGame Logic & Canvas Controls

**Files:**
- Create: `src/components/RetroGame.js`
- Create: `tests/retro-game.test.js`

**Interfaces:**
- Produces: `RetroGame` constructor managing drawing loops, key input listeners, touch coordinates, and event dispatches.

- [ ] **Step 1: Create Breakout game class src/components/RetroGame.js**

Write a clean Breakout game implementation:
```javascript
export class RetroGame {
  constructor(canvasId, scoreId, livesId, onFinished) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.scoreSpan = document.getElementById(scoreId);
    this.livesSpan = document.getElementById(livesId);
    this.onFinished = onFinished;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Reset Parameters
    this.reset();

    // Bind controls
    this.rightPressed = false;
    this.leftPressed = false;
    this._setupControls();
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.victory = false;
    this.active = false;
    this.rAF = null;

    // Paddle
    this.paddleHeight = 8;
    this.paddleWidth = 50;
    this.paddleX = (this.width - this.paddleWidth) / 2;

    // Ball
    this.ballRadius = 4;
    this.ballX = this.width / 2;
    this.ballY = this.height - 30;
    this.ballDx = 2;
    this.ballDy = -2;

    // Bricks Grid (3 rows x 6 columns)
    this.brickRows = 3;
    this.brickCols = 6;
    this.brickWidth = 40;
    this.brickHeight = 10;
    this.brickPadding = 4;
    this.brickOffsetTop = 20;
    this.brickOffsetLeft = 10;

    this.bricks = [];
    for (let c = 0; c < this.brickCols; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRows; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    this._updateScoreBoard();
  }

  _setupControls() {
    this._keydownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.rightPressed = true;
      if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.leftPressed = true;
    };

    this._keyupHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.rightPressed = false;
      if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.leftPressed = false;
    };

    this._touchHandler = (e) => {
      if (!this.active) return;
      const rect = this.canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      // Scale coordinates to canvas width
      const canvasTouchX = (touchX / rect.width) * this.width;
      this.paddleX = canvasTouchX - this.paddleWidth / 2;

      // Keep inside bounds
      if (this.paddleX < 0) this.paddleX = 0;
      if (this.paddleX > this.width - this.paddleWidth) this.paddleX = this.width - this.paddleWidth;
    };

    this._clickHandler = () => {
      if (this.gameOver || this.victory) {
        this.reset();
        this.start();
      }
    };

    window.addEventListener('keydown', this._keydownHandler);
    window.addEventListener('keyup', this._keyupHandler);
    this.canvas.addEventListener('touchmove', this._touchHandler, { passive: true });
    this.canvas.addEventListener('touchstart', this._touchHandler, { passive: true });
    this.canvas.addEventListener('click', this._clickHandler);
  }

  destroy() {
    window.removeEventListener('keydown', this._keydownHandler);
    window.removeEventListener('keyup', this._keyupHandler);
    this.canvas.removeEventListener('touchmove', this._touchHandler);
    this.canvas.removeEventListener('touchstart', this._touchHandler);
    this.canvas.removeEventListener('click', this._clickHandler);
    this.stop();
  }

  start() {
    if (this.active) return;
    this.active = true;
    const loop = () => {
      if (!this.active) return;
      this._updatePhysics();
      this._draw();
      this.rAF = requestAnimationFrame(loop);
    };
    this.rAF = requestAnimationFrame(loop);
  }

  stop() {
    this.active = false;
    if (this.rAF) {
      cancelAnimationFrame(this.rAF);
      this.rAF = null;
    }
  }

  _updateScoreBoard() {
    if (this.scoreSpan) this.scoreSpan.textContent = this.score.toString().padStart(3, '0');
    if (this.livesSpan) this.livesSpan.textContent = this.lives.toString();
  }

  _updatePhysics() {
    if (this.gameOver || this.victory) return;

    // Move paddle
    if (this.rightPressed && this.paddleX < this.width - this.paddleWidth) this.paddleX += 3;
    if (this.leftPressed && this.paddleX > 0) this.paddleX -= 3;

    // Collision with walls
    if (this.ballX + this.ballDx > this.width - this.ballRadius || this.ballX + this.ballDx < this.ballRadius) {
      this.ballDx = -this.ballDx;
    }

    // Ceiling collision
    if (this.ballY + this.ballDy < this.ballRadius) {
      this.ballDy = -this.ballDy;
    } else if (this.ballY + this.ballDy > this.height - this.ballRadius - this.paddleHeight) {
      // Bounce off paddle
      if (this.ballX > this.paddleX && this.ballX < this.paddleX + this.paddleWidth) {
        this.ballDy = -this.ballDy;
      } else {
        // Drop ball: lose a life
        this.lives--;
        this._updateScoreBoard();
        if (this.lives === 0) {
          this.gameOver = true;
          if (this.onFinished) this.onFinished(this.score);
        } else {
          // Reset ball position
          this.ballX = this.width / 2;
          this.ballY = this.height - 30;
          this.ballDx = 2;
          this.ballDy = -2;
          this.paddleX = (this.width - this.paddleWidth) / 2;
        }
      }
    }

    // Brick Collision
    let activeBricks = 0;
    for (let c = 0; c < this.brickCols; c++) {
      for (let r = 0; r < this.brickRows; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          activeBricks++;
          const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
          const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
          b.x = brickX;
          b.y = brickY;

          if (this.ballX > brickX && this.ballX < brickX + this.brickWidth &&
              this.ballY > brickY && this.ballY < brickY + this.brickHeight) {
            this.ballDy = -this.ballDy;
            b.status = 0;
            this.score += 100;
            this._updateScoreBoard();
          }
        }
      }
    }

    // Victory Check
    if (activeBricks === 0) {
      this.victory = true;
      if (this.onFinished) this.onFinished(this.score);
    }

    // Move ball
    this.ballX += this.ballDx;
    this.ballY += this.ballDy;
  }

  _draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.gameOver) {
      this.ctx.font = "14px 'Press Start 2P', sans-serif";
      this.ctx.fillStyle = "red";
      this.ctx.textAlign = "center";
      this.ctx.fillText("GAME OVER", this.width / 2, this.height / 2 - 10);
      this.ctx.font = "8px 'Press Start 2P', sans-serif";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("TAP OR CLICK TO RESTART", this.width / 2, this.height / 2 + 15);
      return;
    }

    if (this.victory) {
      this.ctx.font = "14px 'Press Start 2P', sans-serif";
      this.ctx.fillStyle = "lime";
      this.ctx.textAlign = "center";
      this.ctx.fillText("VICTORY!", this.width / 2, this.height / 2 - 10);
      this.ctx.font = "8px 'Press Start 2P', sans-serif";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("TAP OR CLICK TO PLAY AGAIN", this.width / 2, this.height / 2 + 15);
      return;
    }

    // Draw paddle
    this.ctx.fillStyle = "magenta";
    this.ctx.fillRect(this.paddleX, this.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);

    // Draw ball
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = "cyan";
    this.ctx.fill();
    this.ctx.closePath();

    // Draw bricks
    for (let c = 0; c < this.brickCols; c++) {
      for (let r = 0; r < this.brickRows; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
          const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
          
          // Color coding by row
          if (r === 0) this.ctx.fillStyle = "red";
          else if (r === 1) this.ctx.fillStyle = "yellow";
          else this.ctx.fillStyle = "green";

          this.ctx.fillRect(brickX, brickY, this.brickWidth, this.brickHeight);
        }
      }
    }
  }
}
```

- [ ] **Step 2: Create tests/retro-game.test.js**

```javascript
import { expect, test } from 'vitest';

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
```

- [ ] **Step 3: Run tests**

Run: `npm run test`
Expected: 2 passed

- [ ] **Step 4: Commit**

```bash
git add src/components/RetroGame.js tests/retro-game.test.js
git commit -m "feat: implement breakout mini game canvas logic with controls and updates loops"
```

---

### Task 3: GUI layout panels, Game Cabinet drawer, and Contact panel integration

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`
- Create: `tests/minigame-ui.test.js`

**Interfaces:**
- Consumes: `src/components/RetroGame.js` in `src/main.js`.
- Produces: CSS overlay drawer sliding variables, contact panel layouts, and scoreboard integration triggers.

- [ ] **Step 1: Modify index.html to add panels and drawer layout**

Append game toggle button and game-panel container after header or before script block in `index.html`:
```html
  <button id="game-toggle" class="cli-toggle-btn" style="left: 20px; right: auto; z-index: 999;">[ 🎮 GAME_MODE ]</button>
  <div id="game-panel" class="terminal-container" style="left: 20px; right: auto; transform: translateY(120%); z-index: 998; width: 320px; height: auto;">
    <div class="terminal-header">
      <span>🎮 BUMBU_CONSOLE.EXE</span>
      <button id="game-close-btn" style="background:none; border:none; color:var(--text-magenta); font-family:var(--font-title); cursor:pointer;">[ X ]</button>
    </div>
    <div class="terminal-body" style="padding: 15px; display: flex; flex-direction: column; align-items: center; gap: 12px; background-color: #050505;">
      <canvas id="game-canvas" width="280" height="180" style="border: 2px solid var(--text-cyan); background-color: #000; cursor: none;" tabindex="0"></canvas>
      <div style="font-family: var(--font-title); font-size: 0.65rem; color: var(--text-yellow); display: flex; gap: 20px;">
        <span>SCORE: <span id="game-score">000</span></span>
        <span>LIVES: <span id="game-lives">3</span></span>
      </div>
      <div style="font-size: 0.75rem; color: #888; text-align: center;">
        [ A/D / Panah Kiri-Kanan / Drag Layar untuk Bergerak ]
      </div>
    </div>
  </div>
```

Modify the Guestbook section grid inside `index.html` to add the third panel:
```html
      <div class="guestbook-layout">
        <div class="leaderboard-panel" style="flex: 1.2;">
          <h3 class="blink-slow text-cyan" style="text-align: center; margin-bottom: 15px; font-family: var(--font-title); font-size: 1.2rem;">TOP 10 PLAYERS</h3>
          <table id="leaderboard-table" class="retro-table">
            <thead>
              <tr>
                <th style="width: 15%;">RNK</th>
                <th style="width: 25%;">INIT</th>
                <th style="width: 25%;">SCORE</th>
                <th style="width: 35%;">MESSAGE</th>
              </tr>
            </thead>
            <tbody id="leaderboard-body"></tbody>
          </table>
        </div>
        <div class="guestbook-form-panel" style="flex: 0.9;">
          <h3 style="color: var(--text-yellow); margin-bottom: 15px; font-family: var(--font-title); font-size: 1.1rem;">[ SIGN THE LEADERBOARD ]</h3>
          
          <!-- Game Score Badge Hook -->
          <div id="game-score-badge" style="display: none; background-color: #111; border: 2px dashed var(--text-magenta); padding: 8px; margin-bottom: 15px; font-family: var(--font-title); font-size: 0.7rem; color: var(--text-magenta); text-align: center;">
            [ 🏆 UNLOCKED GAME SCORE: <span id="game-score-val">0</span> PTS ]
          </div>
          
          <form id="guestbook-form" autocomplete="off">
            <div class="form-group">
              <label for="gb-initials">YOUR INITIALS (3 CHARS):</label>
              <input type="text" id="gb-initials" maxlength="3" required placeholder="AAA" style="text-transform: uppercase;" />
            </div>
            <div class="form-group" style="margin-top: 15px;">
              <label for="gb-message">YOUR NOTE/MESSAGE (MAX 100 CHARS):</label>
              <textarea id="gb-message" maxlength="100" required placeholder="ENTER MESSAGE..."></textarea>
            </div>
            <button type="submit" class="gb-submit-btn">[ INSERT COIN & SUBMIT ]</button>
          </form>
        </div>
        
        <!-- 3. Contact panel -->
        <div class="contact-channels-panel" style="flex: 0.7;">
          <h3 style="color: var(--text-yellow); margin-bottom: 15px; font-family: var(--font-title); font-size: 1.1rem;">[ COMM CHANNELS ]</h3>
          <div class="contact-links" style="display: flex; flex-direction: column; gap: 15px;">
            <a href="https://github.com/zidanLPTP" target="_blank" rel="noopener noreferrer" class="contact-link-item">
              <div class="contact-label">> GITHUB</div>
              <div class="contact-val">github.com/zidanLPTP</div>
            </a>
            <a href="https://instagram.com/zidan.lptp" target="_blank" rel="noopener noreferrer" class="contact-link-item">
              <div class="contact-label">> INSTAGRAM</div>
              <div class="contact-val">@zidan.lptp</div>
            </a>
            <a href="mailto:zidan@example.com" class="contact-link-item">
              <div class="contact-label">> EMAIL</div>
              <div class="contact-val">zidan@example.com</div>
            </a>
          </div>
        </div>
      </div>
```

- [ ] **Step 2: Append CSS styling in src/style.css**

```css
.contact-channels-panel {
  border: 3px double var(--text-magenta);
  background-color: #050505;
  padding: 20px;
  font-family: var(--font-body);
}

.contact-link-item {
  display: block;
  text-decoration: none;
  border: 1px dashed #333;
  background-color: #111;
  padding: 10px;
  transition: all 0.2s;
}

.contact-link-item:hover {
  border-color: var(--text-magenta);
  box-shadow: 0 0 8px rgba(255, 0, 255, 0.3);
}

.contact-label {
  font-family: var(--font-title);
  font-size: 0.75rem;
  color: var(--text-cyan);
  margin-bottom: 4px;
}

.contact-val {
  font-size: 0.9rem;
  color: var(--text-green);
}

.guestbook-layout {
  display: flex;
  gap: 20px;
}

#game-canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  outline: none;
}

@media (max-width: 992px) {
  .guestbook-layout {
    flex-direction: column;
  }
}
```

- [ ] **Step 3: Update src/main.js to instantiate RetroGame and hook scoring events**

Import game:
```javascript
import { RetroGame } from './components/RetroGame';
```

At the end of `DOMContentLoaded`:
```javascript
  // Minigame Panel Overlay
  const gameToggle = document.getElementById('game-toggle');
  const gamePanel = document.getElementById('game-panel');
  const gameClose = document.getElementById('game-close-btn');
  const gameCanvas = document.getElementById('game-canvas');
  const gameScoreBadge = document.getElementById('game-score-badge');
  const gameScoreVal = document.getElementById('game-score-val');

  if (gameToggle && gamePanel && gameClose && gameCanvas) {
    let unlockedScore = null;

    const game = new RetroGame('game-canvas', 'game-score', 'game-lives', (finalScore) => {
      // Game Over / Victory Callback
      unlockedScore = finalScore;
      if (gameScoreBadge && gameScoreVal) {
        gameScoreVal.textContent = finalScore.toString();
        gameScoreBadge.style.display = 'block';
      }
      
      // Dispatch game-finished custom event
      window.dispatchEvent(new CustomEvent('game-finished', {
        detail: { score: finalScore }
      }));
    });

    const toggleGame = () => {
      const isVisible = gamePanel.style.transform === 'translateY(0px)';
      if (isVisible) {
        gamePanel.style.transform = 'translateY(120%)';
        game.stop();
      } else {
        gamePanel.style.transform = 'translateY(0px)';
        // Start game loop and focus canvas so keyboard works instantly
        game.start();
        gameCanvas.focus();
      }
    };

    gameToggle.addEventListener('click', toggleGame);
    gameClose.addEventListener('click', () => {
      gamePanel.style.transform = 'translateY(120%)';
      game.stop();
    });

    // Listen to CLI command play trigger
    window.addEventListener('play-triggered', () => {
      // Toggle open if closed
      if (gamePanel.style.transform !== 'translateY(0px)') {
        toggleGame();
      }
    });

    // Intercept Guestbook Form submit to inject customScore
    const guestbookForm = document.getElementById('guestbook-form');
    if (guestbookForm) {
      guestbookForm.addEventListener('submit', (e) => {
        if (unlockedScore !== null) {
          e.preventDefault();
          const initialsInput = document.getElementById('gb-initials');
          const messageInput = document.getElementById('gb-message');
          
          import('./components/GuestbookHelper').then(({ addGuestbookEntry }) => {
            const res = addGuestbookEntry(initialsInput.value, messageInput.value, unlockedScore);
            if (res.success) {
              initialsInput.value = '';
              messageInput.value = '';
              unlockedScore = null;
              if (gameScoreBadge) gameScoreBadge.style.display = 'none';
            } else {
              alert(res.error);
            }
          });
        }
      });
    }
  }
```

- [ ] **Step 4: Create unit test tests/minigame-ui.test.js**

```javascript
import { expect, test } from 'vitest';

test('verify contact sidebar elements content structure', () => {
  const label = 'GITHUB';
  const val = 'github.com/zidanLPTP';
  const html = `
    <div class="contact-label">> ${label}</div>
    <div class="contact-val">${val}</div>
  `;

  expect(html).toContain('GITHUB');
  expect(html).toContain('github.com/zidanLPTP');
});
```

- [ ] **Step 5: Run tests**

Run: `npm run test`
Expected: 3 passed

- [ ] **Step 6: Commit**

```bash
git add index.html src/style.css src/main.js tests/minigame-ui.test.js
git commit -m "feat: build contact sidebar panel layout and connect minigame event handler to main GUI loop"
```

---

### Task 4: CLI Commands & Autocomplete Integration

**Files:**
- Modify: `src/components/RetroTerminal.js`
- Modify: `src/components/RetroTerminalHelper.js`
- Create: `tests/terminal-game.test.js`

**Interfaces:**
- Consumes: `RetroTerminal.js` command router.
- Produces: CLI `play` and `contact` command executes.

- [ ] **Step 1: Create unit test tests/terminal-game.test.js**

```javascript
import { expect, test } from 'vitest';

test('verify terminal command autocomplete list contains play and contact', () => {
  const commands = ['help', 'play', 'contact', 'clear'];
  expect(commands).toContain('play');
  expect(commands).toContain('contact');
});
```

- [ ] **Step 2: Modify src/components/RetroTerminalHelper.js**

Register `play` and `contact` commands:
```javascript
  const commandList = ['help', 'projects', 'project', 'use', 'inspect', 'inventory', 'guestbook', 'sign', 'quests', 'guilds', 'status', 'select', 'play', 'contact', 'clear', 'about', 'socials'];
```

- [ ] **Step 3: Modify src/components/RetroTerminal.js**

Update `this.commands` inside `connectedCallback`:
```javascript
    this.commands = ['help', 'projects', 'project', 'use', 'inspect', 'inventory', 'guestbook', 'sign', 'quests', 'guilds', 'status', 'select', 'play', 'contact', 'clear', 'about', 'socials'];
```

Add `play` and `contact` commands under the `executeCommand` switch block:
```javascript
      case 'play':
        this.writeLine("STARTING RETRO GAME CABINET CONSOLE... SUCCESS!");
        // Release typing focus from terminal to canvas controls
        if (this.input) this.input.blur();
        
        // Dispatch event so main.js opens the game drawer
        window.dispatchEvent(new CustomEvent('play-triggered'));
        break;

      case 'contact':
        this.writeLine("============================================================");
        this.writeLine("BUMBU ARCADE - COMM CHANNELS");
        this.writeLine("============================================================");
        this.writeLine("GITHUB    : https://github.com/zidanLPTP");
        this.writeLine("INSTAGRAM : https://instagram.com/zidan.lptp");
        this.writeLine("EMAIL     : zidan@example.com");
        this.writeLine("============================================================");
        break;
```
Update `help` instruction text in `RetroTerminal.js` to detail `play` and `contact` usage.

- [ ] **Step 4: Run tests**

Run: `npm run test`
Expected: 4 passed (all 16 files pass)

- [ ] **Step 5: Commit**

```bash
git add src/components/RetroTerminal.js src/components/RetroTerminalHelper.js tests/terminal-game.test.js
git commit -m "feat: integrate play and contact commands inside retro terminal CLI widget"
```
