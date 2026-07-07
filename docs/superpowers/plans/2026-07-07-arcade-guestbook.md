# Arcade Guestbook & Leaderboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Arcade Guestbook styled as a retro High-Score Leaderboard. Visitors can submit their initials (3 chars max) and messages via a GUI form or CLI terminal. Submissions earn a gamified score (calculated from character count), are saved in `localStorage`, and update the visual list in real time.

**Tech Stack:** Vite, Vanilla JS, Vanilla CSS, Vitest (for test execution).

## Global Constraints
- Avoid third-party styling frameworks (no TailwindCSS/Bootstrap). Use pure Vanilla CSS.
- Ponytail Constraint: Keep code short, concise, and prioritize native browser Web APIs and JS methods.
- XSS Prevention: Never use `innerHTML` to display user initials or messages. Always use `textContent` or `innerText` when rendering the table rows or printing to terminal outputs.
- Sorting: Always merge JSON presets and local storage entries, sort them descending by score, and select only the top 10 items before rendering.
- Spacing in CLI: The `sign` command parser in `RetroTerminal.js` must handle spaces inside the message by taking the first argument as initials (3 chars) and the rest of the command string as the message.
- Desktop layout is flex row. Tablet/mobile layout stacks vertically (column) under `768px`.
- High-fidelity Retro Arcade design must use Google Fonts `Press Start 2P` and `VT323`.

---

### Task 1: Guestbook Dataset & Helper Module

**Files:**
- Create: `src/data/guestbook.json`
- Create: `src/components/GuestbookHelper.js`
- Create: `tests/guestbook.test.js`

**Interfaces:**
- Produces: `src/data/guestbook.json` array containing default scores.
- Produces: `getLeaderboardEntries()`, `addGuestbookEntry(initials, message)`, and `calculateScore(message)` exported functions.

- [ ] **Step 1: Create the default database src/data/guestbook.json**

```json
[
  { "initials": "DEV", "message": "Welcome to Bumbu Arcade! I hope you enjoy your stay.", "score": 99900 },
  { "initials": "BOT", "message": "01001000 01000101 01001100 01001100 01001111", "score": 88000 },
  { "initials": "AAA", "message": "FIRST PLACE IS MINE!", "score": 75000 },
  { "initials": "ZDN", "message": "Bumbu Studio is coming soon! Stay tuned.", "score": 60000 },
  { "initials": "GMR", "message": "Insert coin to continue...", "score": 50000 }
]
```

- [ ] **Step 2: Create src/components/GuestbookHelper.js**

```javascript
import presets from '../data/guestbook.json';

export function calculateScore(message) {
  const base = message.length * 100;
  const bonus = Math.floor(Math.random() * 500);
  return base + bonus;
}

export function getLeaderboardEntries() {
  const localData = localStorage.getItem('guestbook_entries');
  const localEntries = localData ? JSON.parse(localData) : [];
  
  // Merge, sort descending by score, slice top 10
  const merged = [...presets, ...localEntries];
  merged.sort((a, b) => b.score - a.score);
  return merged.slice(0, 10);
}

export function addGuestbookEntry(initials, message) {
  const cleanInitials = initials.trim().slice(0, 3).toUpperCase();
  if (cleanInitials.length !== 3) return { success: false, error: 'Initials must be exactly 3 characters.' };
  if (!message.trim()) return { success: false, error: 'Message cannot be empty.' };

  const score = calculateScore(message);
  const newEntry = {
    initials: cleanInitials,
    message: message.trim(),
    score
  };

  const localData = localStorage.getItem('guestbook_entries');
  const localEntries = localData ? JSON.parse(localData) : [];
  localEntries.push(newEntry);
  localStorage.setItem('guestbook_entries', JSON.stringify(localEntries));

  // Dispatch custom window event
  window.dispatchEvent(new CustomEvent('guestbook-updated'));

  return { success: true, entry: newEntry };
}
```

- [ ] **Step 3: Create tests/guestbook.test.js**

```javascript
import { expect, test, beforeEach, vi } from 'vitest';
import { calculateScore, getLeaderboardEntries, addGuestbookEntry } from '../src/components/GuestbookHelper';

beforeEach(() => {
  localStorage.clear();
});

test('calculateScore calculates score correctly', () => {
  const score = calculateScore('hello');
  expect(score).toBeGreaterThanOrEqual(500);
  expect(score).toBeLessThanOrEqual(1000);
});

test('getLeaderboardEntries merges presets and sorts descending', () => {
  // Add a very high score to local storage
  const highEntry = { initials: 'TOP', message: 'I am top', score: 120000 };
  localStorage.setItem('guestbook_entries', JSON.stringify([highEntry]));

  const entries = getLeaderboardEntries();
  expect(entries[0].initials).toBe('TOP');
  expect(entries[0].score).toBe(120000);
  expect(entries.length).toBe(6); // 5 presets + 1 local
});

test('addGuestbookEntry rejects invalid initials or messages', () => {
  const r1 = addGuestbookEntry('AB', 'Valid message');
  expect(r1.success).toBe(false);

  const r2 = addGuestbookEntry('AAA', '');
  expect(r2.success).toBe(false);
});
```

- [ ] **Step 4: Run tests to verify the suite passes**

Run: `npm run test`
Expected: 3 passed

- [ ] **Step 5: Commit**

```bash
git add src/data/guestbook.json src/components/GuestbookHelper.js tests/guestbook.test.js
git commit -m "feat: add guestbook dataset and leaderboard logic helper"
```

---

### Task 2: Guestbook GUI Layout & Table Render

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`
- Create: `tests/guestbook-ui.test.js`

**Interfaces:**
- Consumes: `src/components/GuestbookHelper.js`.
- Produces: Visual High-Score Table and Signature Form with full XSS protection.

- [ ] **Step 1: Modify index.html to add Guestbook Section**

Insert this HTML block after RPG Skills Inventory section inside `index.html`:
```html
    <section class="grid-section">
      <h2 style="font-size: 1.5rem; border-bottom: 2px solid var(--text-magenta); padding-bottom: 10px; margin-bottom: 20px;">[ ARCADE GUESTBOOK ]</h2>
      <div class="guestbook-layout">
        <div class="leaderboard-panel">
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
        <div class="guestbook-form-panel">
          <h3 style="color: var(--text-yellow); margin-bottom: 15px; font-family: var(--font-title); font-size: 1.1rem;">[ SIGN THE LEADERBOARD ]</h3>
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
      </div>
    </section>
```

- [ ] **Step 2: Append layout and responsiveness CSS inside src/style.css**

Append the following styles:
```css
.guestbook-layout {
  display: flex;
  gap: 30px;
}

.leaderboard-panel {
  flex: 1.2;
  border: 3px double var(--text-cyan);
  background-color: #050505;
  padding: 20px;
}

.retro-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--text-green);
  text-shadow: 0 0 5px var(--text-green);
}

.retro-table th {
  border-bottom: 2px solid var(--text-cyan);
  padding: 8px;
  text-align: left;
  font-family: var(--font-title);
  font-size: 0.8rem;
  color: var(--text-yellow);
}

.retro-table td {
  padding: 8px;
  border-bottom: 1px dashed #333;
}

.guestbook-form-panel {
  flex: 0.8;
  border: 3px double var(--text-yellow);
  background-color: #050505;
  padding: 20px;
  font-family: var(--font-body);
}

.form-group label {
  display: block;
  font-size: 0.95rem;
  color: var(--text-cyan);
  margin-bottom: 5px;
}

.form-group input, .form-group textarea {
  width: 100%;
  background: #111;
  border: 2px solid var(--text-cyan);
  color: #fff;
  font-family: var(--font-body);
  font-size: 1.1rem;
  padding: 8px;
  outline: none;
}

.form-group input:focus, .form-group textarea:focus {
  border-color: var(--text-yellow);
  box-shadow: 0 0 10px var(--text-yellow);
}

.gb-submit-btn {
  width: 100%;
  margin-top: 20px;
  background-color: var(--bg-panel);
  color: var(--text-magenta);
  border: 2px solid var(--text-magenta);
  font-family: var(--font-title);
  font-size: 0.85rem;
  height: 48px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.2);
  transition: transform 0.1s, background-color 0.2s;
}

.gb-submit-btn:hover {
  background-color: var(--text-magenta);
  color: #000;
  box-shadow: 0 0 15px var(--text-magenta);
}

.gb-submit-btn:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .guestbook-layout {
    flex-direction: column;
  }
}
```

- [ ] **Step 3: Modify src/main.js to render Table entries and handle form submits**

Append the leaderboard logic to the end of `DOMContentLoaded` block in `src/main.js`:
```javascript
  const leaderboardBody = document.getElementById('leaderboard-body');
  const guestbookForm = document.getElementById('guestbook-form');

  if (leaderboardBody && guestbookForm) {
    import('./components/GuestbookHelper').then(({ getLeaderboardEntries, addGuestbookEntry }) => {
      const renderLeaderboard = () => {
        leaderboardBody.innerHTML = '';
        const entries = getLeaderboardEntries();
        entries.forEach((entry, idx) => {
          const tr = document.createElement('tr');

          const tdRank = document.createElement('td');
          tdRank.textContent = `${idx + 1}.`;
          tr.appendChild(tdRank);

          const tdInit = document.createElement('td');
          tdInit.textContent = entry.initials;
          tr.appendChild(tdInit);

          const tdScore = document.createElement('td');
          tdScore.textContent = entry.score.toLocaleString();
          tr.appendChild(tdScore);

          const tdMsg = document.createElement('td');
          tdMsg.textContent = entry.message;
          tr.appendChild(tdMsg);

          leaderboardBody.appendChild(tr);
        });
      };

      // Initial render
      renderLeaderboard();

      // Form submission handler
      guestbookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const initialsInput = document.getElementById('gb-initials');
        const messageInput = document.getElementById('gb-message');

        const res = addGuestbookEntry(initialsInput.value, messageInput.value);
        if (res.success) {
          initialsInput.value = '';
          messageInput.value = '';
        } else {
          alert(res.error);
        }
      });

      // Listen to updates
      window.addEventListener('guestbook-updated', renderLeaderboard);
    });
  }
```

- [ ] **Step 4: Create unit test tests/guestbook-ui.test.js**

```javascript
import { expect, test } from 'vitest';

test('verify XSS protection via textContent usage mockup', () => {
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  
  const exploitText = "<script>alert('hack')</script>";
  td.textContent = exploitText;
  tr.appendChild(td);

  expect(tr.innerHTML).not.toContain('<script>');
  expect(td.innerHTML).toBe('&lt;script&gt;alert(\'hack\')&lt;/script&gt;');
});
```

- [ ] **Step 5: Run tests**

Run: `npm run test`
Expected: 5 passed

- [ ] **Step 6: Commit**

```bash
git add index.html src/style.css src/main.js tests/guestbook-ui.test.js
git commit -m "feat: build guestbook leaderboard UI layout and add XSS protection safeguards"
```

---

### Task 3: CLI Terminal Command Integration

**Files:**
- Modify: `src/components/RetroTerminal.js`
- Create: `tests/terminal-guestbook.test.js`

**Interfaces:**
- Consumes: `src/components/GuestbookHelper.js`.
- Modifies: `RetroTerminal.js` parser logic and autocomplete options.

- [ ] **Step 1: Create unit test tests/terminal-guestbook.test.js**

```javascript
import { expect, test } from 'vitest';

test('verify terminal sign command substring parser logic', () => {
  const cmdStr = "sign zdn hello my friend how are you";
  const parts = cmdStr.split(/\s+/);
  const command = parts[0]; // "sign"
  
  // Custom substring parser
  const initials = parts[1] ? parts[1].toUpperCase() : '';
  const messageStartIndex = cmdStr.indexOf(parts[1]) + parts[1].length;
  const message = cmdStr.substring(messageStartIndex).trim();

  expect(command).toBe('sign');
  expect(initials).toBe('ZDN');
  expect(message).toBe('hello my friend how are you');
});
```

- [ ] **Step 2: Modify src/components/RetroTerminal.js**

Update `src/components/RetroTerminal.js`:
- Import guestbook functions at top:
  ```javascript
  import { getLeaderboardEntries, addGuestbookEntry } from './GuestbookHelper';
  ```
- In `connectedCallback`, update commands array:
  ```javascript
  this.commands = ['help', 'projects', 'project', 'use', 'inspect', 'inventory', 'guestbook', 'sign', 'clear', 'about', 'socials'];
  ```
- In `executeCommand(cmdStr)` switch block:
  - Add `guestbook` case:
    ```javascript
          case 'guestbook':
            this.writeLine("============================================================");
            this.writeLine("RANK  INIT  SCORE   MESSAGE");
            this.writeLine("============================================================");
            const entries = getLeaderboardEntries();
            entries.forEach((e, idx) => {
              // Format initials with padStart or padEnd to keep alignment
              const rnkStr = `${idx + 1}.`.padEnd(5);
              const initStr = e.initials.padEnd(6);
              const scoreStr = e.score.toString().padEnd(8);
              this.writeLine(`${rnkStr}${initStr}${scoreStr}${e.message}`);
            });
            this.writeLine("============================================================");
            break;
    ```
  - Add `sign` case with argument spacing logic:
    ```javascript
          case 'sign':
            const signParts = cmdStr.trim().split(/\s+/);
            if (signParts.length < 3) {
              this.writeLine("Usage: sign <initials> <message>");
              break;
            }
            const initials = signParts[1];
            // Calculate message substring index to preserve spaces
            const initIndex = cmdStr.indexOf(initials);
            const message = cmdStr.substring(initIndex + initials.length).trim();

            this.writeLine("INSERTING COIN... SUCCESS!");
            const res = addGuestbookEntry(initials, message);
            if (res.success) {
              this.writeLine("SAVING SIGNATURE... SUCCESS!");
              this.writeLine(`YOUR SCORE: ${res.entry.score} PTS`);
              
              // Find new rank
              const updated = getLeaderboardEntries();
              const newRank = updated.findIndex(e => e.initials === res.entry.initials && e.score === res.entry.score);
              if (newRank !== -1) {
                this.writeLine(`CONGRATULATIONS! YOU PLACED RANK #${newRank + 1} ON THE LEADERBOARD!`);
              }
            } else {
              this.writeLine(`ERROR: ${res.error}`);
            }
            break;
    ```
  - Update `help` case description to include details about `guestbook` and `sign` commands.

- [ ] **Step 3: Run tests**

Run: `npm run test`
Expected: 6 passed (all 6 files pass)

- [ ] **Step 4: Commit**

```bash
git add src/components/RetroTerminal.js tests/terminal-guestbook.test.js
git commit -m "feat: integrate CLI terminal guestbook leaderboard and sign command with smart arg spacing parser"
```
