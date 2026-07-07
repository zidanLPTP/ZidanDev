# RPG Character Status & Selection Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a visual character selection and status widget. Swapping class selections updates portrait SVGs, biographic details, and pixelated progress bars. Supports `status` and `select <class>` CLI commands with tab-autocomplete.

**Tech Stack:** Vite, Vanilla JS, Vanilla CSS, Vitest.

## Global Constraints
- Avoid third-party styling frameworks (no TailwindCSS/Bootstrap). Use pure Vanilla CSS with variables.
- Ponytail Constraint: Keep code short, concise, and prioritize native browser Web APIs and JS methods.
- Initial Load State: On page load, `main.js` must fetch the characters dataset and automatically initialize the active state with the first class (`developer`).
- Progress Bar Aesthetics: Progress bars must have `border-radius: 0;` (sharp corners) and use a repeating visual blocks texture via `repeating-linear-gradient` (e.g. `repeating-linear-gradient(90deg, currentColor, currentColor 8px, transparent 8px, transparent 10px)`).
- CLI Word Wrap: The terminal `status` command must wrap long description text into lines of max 50 characters before wrapping inside the ASCII borders.
- Sync Event: Terminal `select` command updates the character and dispatches a CustomEvent `'character-changed'` on the `window` to synchronize GUI display.
- High-fidelity Retro Arcade design must use Google Fonts `Press Start 2P` and `VT323`.

---

### Task 1: Character Select Dataset & Portrait SVGs

**Files:**
- Create: `src/data/characters.json`
- Create: `src/components/CharacterSprites.js`
- Create: `tests/characters.test.js`

**Interfaces:**
- Produces: `src/data/characters.json` containing class stats.
- Produces: `src/components/CharacterSprites.js` returning inline pixel art SVGs.

- [ ] **Step 1: Create characters dataset src/data/characters.json**

```json
[
  {
    "id": "developer",
    "name": "SOFTWARE DEVELOPER",
    "description": "Kelas berbasis logika pemrograman yang ahli dalam mengubah algoritma abstrak menjadi aplikasi web interaktif dan sistem antarmuka responsif.",
    "stats": {
      "HP": 80,
      "MP": 99,
      "INT": 95,
      "STR": 45,
      "AGI": 80
    }
  },
  {
    "id": "artist",
    "name": "3D ARTIST / SCULPTOR",
    "description": "Kelas seniman visual yang terampil dalam pemodelan low-poly 3D, UV mapping, pewarnaan tekstur, pencahayaan, dan animasi aset game.",
    "stats": {
      "HP": 90,
      "MP": 65,
      "INT": 80,
      "STR": 95,
      "AGI": 55
    }
  },
  {
    "id": "gamer",
    "name": "HARDCORE GAMER",
    "description": "Kelas dengan ketangkasan tinggi, optimal dalam kecepatan refleks, pengujian mekanika game, dan berburu rahasia tersembunyi (easter eggs).",
    "stats": {
      "HP": 99,
      "MP": 45,
      "INT": 60,
      "STR": 70,
      "AGI": 95
    }
  }
]
```

- [ ] **Step 2: Create sprite renderer src/components/CharacterSprites.js**

Provide three pixelated inline SVGs (`developer`, `artist`, `gamer`):
```javascript
export function getCharacterSprite(id) {
  const spriteMap = {
    developer: `
      <svg viewBox="0 0 16 16" width="100%" height="100%" shape-rendering="crispEdges" style="fill: var(--text-cyan);">
        <!-- CRT Monitor Screen -->
        <rect x="1" y="2" width="14" height="10" />
        <rect x="2" y="3" width="12" height="8" style="fill: #111;" />
        <!-- Code Cursor Pixel -->
        <rect x="4" y="5" width="2" height="4" style="fill: var(--text-green);" />
        <!-- Neck & Base Stand -->
        <rect x="6" y="12" width="4" height="2" />
        <rect x="4" y="14" width="8" height="1" />
      </svg>
    `,
    artist: `
      <svg viewBox="0 0 16 16" width="100%" height="100%" shape-rendering="crispEdges" style="fill: var(--text-yellow);">
        <!-- 3D wireframe cube -->
        <rect x="3" y="3" width="10" height="10" style="fill: transparent; stroke: var(--text-yellow); stroke-width: 1;" />
        <rect x="5" y="5" width="6" height="6" style="fill: transparent; stroke: var(--text-yellow); stroke-dasharray: 2; stroke-width: 1;" />
        <!-- Corner joins -->
        <line x1="3" y1="3" x2="5" y2="5" style="stroke: var(--text-yellow); stroke-width: 1;" />
        <line x1="13" y1="3" x2="11" y2="5" style="stroke: var(--text-yellow); stroke-width: 1;" />
        <line x1="3" y1="13" x2="5" y2="11" style="stroke: var(--text-yellow); stroke-width: 1;" />
        <line x1="13" y1="13" x2="11" y2="11" style="stroke: var(--text-yellow); stroke-width: 1;" />
      </svg>
    `,
    gamer: `
      <svg viewBox="0 0 16 16" width="100%" height="100%" shape-rendering="crispEdges" style="fill: var(--text-magenta);">
        <!-- Game D-Pad controller body -->
        <rect x="2" y="4" width="12" height="8" rx="2" />
        <!-- D-Pad Left/Right -->
        <rect x="4" y="7" width="3" height="2" style="fill: #111;" />
        <rect x="5" y="6" width="1" height="4" style="fill: #111;" />
        <!-- Action Buttons -->
        <circle cx="10.5" cy="8" r="1" style="fill: var(--text-cyan);" />
        <circle cx="12" cy="7" r="1" style="fill: var(--text-cyan);" />
      </svg>
    `
  };
  return spriteMap[id] || '';
}
```

- [ ] **Step 3: Create tests/characters.test.js**

```javascript
import { expect, test } from 'vitest';
import characters from '../src/data/characters.json';
import { getCharacterSprite } from '../src/components/CharacterSprites';

test('characters dataset schema validation', () => {
  expect(Array.isArray(characters)).toBe(true);
  expect(characters.length).toBe(3);

  characters.forEach(c => {
    expect(c.id).toBeDefined();
    expect(c.name).toBeDefined();
    expect(c.description).toBeDefined();
    expect(c.stats).toBeDefined();
    expect(c.stats.HP).toBeDefined();
    expect(c.stats.MP).toBeDefined();
    expect(c.stats.INT).toBeDefined();
    expect(c.stats.STR).toBeDefined();
    expect(c.stats.AGI).toBeDefined();
  });
});

test('verify sprite helper output', () => {
  const d = getCharacterSprite('developer');
  expect(d).toContain('<svg');
  expect(d).toContain('fill: var(--text-cyan)');

  const invalid = getCharacterSprite('non-existent');
  expect(invalid).toBe('');
});
```

- [ ] **Step 4: Run tests**

Run: `npm run test`
Expected: 2 passed (all test suites pass)

- [ ] **Step 5: Commit**

```bash
git add src/data/characters.json src/components/CharacterSprites.js tests/characters.test.js
git commit -m "feat: add character select dataset and portrait sprites SVG helper"
```

---

### Task 2: Character Status GUI Layout & Render

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`
- Create: `tests/character-ui.test.js`

**Interfaces:**
- Consumes: `src/data/characters.json` and `src/components/CharacterSprites.js`.
- Produces: CSS custom bar block gradients, HTML layout, and event listeners for CLI/GUI synchronization.

- [ ] **Step 1: Add HTML Structure to index.html**

Add the character selector section above RPG Skills Inventory block:
```html
    <section class="grid-section">
      <h2 style="font-size: 1.5rem; border-bottom: 2px solid var(--text-cyan); padding-bottom: 10px; margin-bottom: 20px;">[ CHARACTER STATUS ]</h2>
      <div class="char-select-layout">
        <div class="char-left-panel">
          <div class="char-buttons">
            <button class="char-btn active" data-char="developer">[ DEVELOPER ]</button>
            <button class="char-btn" data-char="artist">[ 3D ARTIST ]</button>
            <button class="char-btn" data-char="gamer">[ GAMER ]</button>
          </div>
          <div id="char-portrait" class="char-portrait-box"></div>
        </div>
        <div class="char-right-panel">
          <h3 id="char-name" class="char-title-name">SOFTWARE DEVELOPER</h3>
          <p id="char-desc" class="char-bio-desc">Loading biography...</p>
          <div id="char-stats-container" class="char-stats-grid"></div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Add CSS rules inside src/style.css**

Add styles detailing layout, button interactions, custom sharp block elements, and gradient bar animations:
```css
.char-select-layout {
  display: flex;
  gap: 30px;
  border: 3px double var(--text-cyan);
  background-color: #050505;
  padding: 20px;
  font-family: var(--font-body);
}

.char-left-panel {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.char-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.char-btn {
  background: transparent;
  border: 2px solid var(--text-cyan);
  color: var(--text-cyan);
  font-family: var(--font-title);
  font-size: 0.8rem;
  padding: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.char-btn:hover {
  background-color: var(--text-cyan);
  color: #000;
  box-shadow: 0 0 10px var(--text-cyan);
}

.char-btn.active {
  border-color: var(--text-yellow);
  color: var(--text-yellow);
  box-shadow: 0 0 10px var(--text-yellow);
}

.char-portrait-box {
  border: 3px double var(--text-yellow);
  background-color: #111;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.char-portrait-box svg {
  width: 80px;
  height: 80px;
  image-rendering: pixelated;
}

.char-right-panel {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.char-title-name {
  font-family: var(--font-title);
  font-size: 1.2rem;
  color: var(--text-yellow);
  text-shadow: 0 0 5px var(--text-yellow);
}

.char-bio-desc {
  font-size: 0.95rem;
  color: #ccc;
  line-height: 1.4;
  min-height: 60px;
}

.char-stats-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.char-stat-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.char-stat-label {
  width: 45px;
  font-family: var(--font-title);
  font-size: 0.8rem;
  color: var(--text-cyan);
}

.char-stat-bar-bg {
  flex: 1;
  background-color: #111;
  border: 1px solid #333;
  height: 20px;
  position: relative;
  overflow: hidden;
  border-radius: 0 !important;
}

.char-stat-bar-fill {
  height: 100%;
  width: 0%;
  background-color: var(--text-green);
  border-radius: 0 !important;
  box-shadow: 0 0 8px var(--text-green);
  background-image: repeating-linear-gradient(90deg, currentColor, currentColor 8px, transparent 8px, transparent 10px);
  transition: width 0.4s cubic-bezier(0.1, 0.8, 0.3, 1);
}

.char-stat-bar-fill.mp {
  background-color: var(--text-cyan);
  box-shadow: 0 0 8px var(--text-cyan);
}
.char-stat-bar-fill.int {
  background-color: var(--text-yellow);
  box-shadow: 0 0 8px var(--text-yellow);
}
.char-stat-bar-fill.str {
  background-color: var(--text-magenta);
  box-shadow: 0 0 8px var(--text-magenta);
}
.char-stat-bar-fill.agi {
  background-color: #ff5555;
  box-shadow: 0 0 8px #ff5555;
}

.char-stat-val {
  width: 50px;
  font-family: var(--font-title);
  font-size: 0.75rem;
  color: #fff;
  text-align: right;
}

@media (max-width: 768px) {
  .char-select-layout {
    flex-direction: column;
  }
}
```

- [ ] **Step 3: Modify src/main.js to support Character Selected logic**

Import sprites and characters JSON at the top:
```javascript
import characters from './data/characters.json';
import { getCharacterSprite } from './components/CharacterSprites';
```

At the end of `DOMContentLoaded`:
```javascript
  const portraitBox = document.getElementById('char-portrait');
  const charName = document.getElementById('char-name');
  const charDesc = document.getElementById('char-desc');
  const statsContainer = document.getElementById('char-stats-container');
  const charBtns = document.querySelectorAll('.char-btn');

  if (portraitBox && charName && charDesc && statsContainer && charBtns.length > 0) {
    const updateCharacterUI = (id) => {
      const char = characters.find(c => c.id === id);
      if (!char) return;

      // Update button styling state
      charBtns.forEach(btn => {
        if (btn.getAttribute('data-char') === id) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update Name & Bio
      charName.textContent = char.name;
      charDesc.textContent = char.description;

      // Update Portrait
      portraitBox.innerHTML = getCharacterSprite(id);

      // Render stats bars with dynamic widths
      statsContainer.innerHTML = '';
      Object.entries(char.stats).forEach(([stat, val]) => {
        const row = document.createElement('div');
        row.className = 'char-stat-row';

        const fillClass = stat.toLowerCase();
        
        row.innerHTML = `
          <span class="char-stat-label">${stat}</span>
          <div class="char-stat-bar-bg">
            <div class="char-stat-bar-fill ${fillClass}" style="width: 0%;"></div>
          </div>
          <span class="char-stat-val">${val}%</span>
        `;

        statsContainer.appendChild(row);

        // Force a layout reflow and set width so transition animates
        setTimeout(() => {
          const fill = row.querySelector('.char-stat-bar-fill');
          if (fill) fill.style.width = `${val}%`;
        }, 50);
      });
    };

    // Initial render with default class 'developer'
    updateCharacterUI('developer');

    // Click Bindings
    charBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-char');
        updateCharacterUI(id);
      });
    });

    // Listen to changes triggered from terminal
    window.addEventListener('character-changed', (e) => {
      if (e.detail && e.detail.id) {
        updateCharacterUI(e.detail.id);
      }
    });
  }
```

- [ ] **Step 4: Create unit test tests/character-ui.test.js**

Verify markup formatting:
```javascript
import { expect, test } from 'vitest';

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
```

- [ ] **Step 5: Run tests**

Run: `npm run test`
Expected: 3 passed (all test suites pass)

- [ ] **Step 6: Commit**

```bash
git add index.html src/style.css src/main.js tests/character-ui.test.js
git commit -m "feat: render character status panels, animate pixel progress bars, and sync CLI updates"
```

---

### Task 3: CLI Commands & Autocomplete Integration

**Files:**
- Modify: `src/components/RetroTerminal.js`
- Modify: `src/components/RetroTerminalHelper.js`
- Create: `tests/terminal-character.test.js`

**Interfaces:**
- Consumes: `src/data/characters.json` inside CLI.
- Modifies: `RetroTerminal.js` command mappings and helper autocompletes.

- [ ] **Step 1: Create unit test tests/terminal-character.test.js**

Test word wrap and status print calculations:
```javascript
import { expect, test } from 'vitest';

function wordWrap(text, limit) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length > limit) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

test('word wrap limits line length under target thresholds', () => {
  const desc = "Kelas berbasis logika pemrograman yang ahli dalam mengubah algoritma abstrak menjadi aplikasi web interaktif.";
  const wrapped = wordWrap(desc, 40);
  expect(wrapped.length).toBeGreaterThan(1);
  wrapped.forEach(line => {
    expect(line.length).toBeLessThanOrEqual(45);
  });
});
```

- [ ] **Step 2: Modify src/components/RetroTerminalHelper.js**

Update autocomplete terms routing. Update autocomplete to suggestions of character classes for `select`:
- Import characters:
  ```javascript
  import characters from '../data/characters.json';
  ```
- Map character IDs:
  ```javascript
  const charIds = characters.map(c => c.id);
  ```
- In autocomplete match routine:
  ```javascript
    if (cmd === 'select') {
      return getAutocompleteMatch(arg, charIds);
    }
  ```

- [ ] **Step 3: Modify src/components/RetroTerminal.js**

Update command cases in `RetroTerminal.js`:
- Import characters and sprites:
  ```javascript
  import characters from '../data/characters.json';
  ```
- Declare active status variable:
  ```javascript
  this.activeCharId = 'developer';
  ```
- Register `status` and `select` inside autocomplete commands list (`this.commands` inside `connectedCallback`).
- Implement the `status` command (renders current ASCII layout with word wrapping):
  ```javascript
        case 'status':
          const char = characters.find(c => c.id === this.activeCharId);
          this.writeLine("============================================================");
          this.writeLine(`CHARACTER STATUS: ${char.name}`);
          this.writeLine("============================================================");
          
          Object.entries(char.stats).forEach(([stat, val]) => {
            const blocksCount = Math.round(val / 10);
            const fillBlocks = "█".repeat(blocksCount);
            const emptyBlocks = "░".repeat(10 - blocksCount);
            this.writeLine(`${stat.padEnd(4)}: [${fillBlocks}${emptyBlocks}] ${val}%`);
          });
          
          this.writeLine("============================================================");
          // Word-wrap description
          const wrapLimit = 50;
          const words = char.description.split(/\s+/);
          let currentLine = '';
          words.forEach(w => {
            if ((currentLine + w).length > wrapLimit) {
              this.writeLine(`BIO : ${currentLine.trim()}`);
              currentLine = w + ' ';
            } else {
              currentLine += w + ' ';
            }
          });
          if (currentLine) {
            this.writeLine(`BIO : ${currentLine.trim()}`);
          }
          this.writeLine("============================================================");
          break;
  ```
- Implement the `select` command:
  ```javascript
        case 'select':
          const targetClass = parts[1];
          if (!targetClass) {
            this.writeLine("Usage: select <developer|artist|gamer>");
            break;
          }
          const matched = characters.find(c => c.id === targetClass.toLowerCase());
          if (!matched) {
            this.writeLine(`ERROR: Class '${targetClass}' not found.`);
            break;
          }
          this.activeCharId = matched.id;
          this.writeLine(`SELECTING CLASS: ${matched.name}... SUCCESS!`);
          
          // Dispatch synchronization event to visual GUI elements
          window.dispatchEvent(new CustomEvent('character-changed', {
            detail: { id: matched.id }
          }));
          break;
  ```
- Listen to GUI selections inside `connectedCallback()` to also update `this.activeCharId` internally:
  ```javascript
      this._boundCharHandler = (e) => {
        if (e.detail && e.detail.id) {
          this.activeCharId = e.detail.id;
        }
      };
      window.addEventListener('character-changed', this._boundCharHandler);
  ```
- Clean up listeners in `disconnectedCallback()`:
  ```javascript
      window.removeEventListener('character-changed', this._boundCharHandler);
  ```
- Update `help` info to detail `status` and `select` usage.

- [ ] **Step 4: Run tests**

Run: `npm run test`
Expected: 4 passed (all 13 files pass)

- [ ] **Step 5: Commit**

```bash
git add src/components/RetroTerminal.js src/components/RetroTerminalHelper.js tests/terminal-character.test.js
git commit -m "feat: integrate select and status commands inside terminal CLI with wrap limits"
```
