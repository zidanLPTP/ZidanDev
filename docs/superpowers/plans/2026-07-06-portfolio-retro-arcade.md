# Retro Arcade Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-performance, single-page retro-arcade themed portfolio website featuring a floating interactive CLI terminal with cycling autocomplete and mobile support, an interactive 3D Blender model viewer, and project cards.

**Architecture:** Vanilla JS Single Page Application (SPA) powered by Vite. The project data resides in a unified JSON database (`projects.json`), which is read by both the visual GUI grid cards and the `<retro-terminal>` custom element. 3D GLB model rendering is achieved via Google's lightweight `<model-viewer>` library.

**Tech Stack:** Vite, Vanilla JS (ES Modules & Web Components), Vanilla CSS, `@google/model-viewer`, Vitest (for test execution).

## Global Constraints
- Avoid third-party styling frameworks (no TailwindCSS/Bootstrap). Use pure Vanilla CSS with variables.
- The CLI floating trigger button `[ >_ CLI_MODE ]` must have a touch target hitbox of at least `48px x 48px`.
- Tab Autocomplete in CLI must cycle through options sequentially upon repeated clicks.
- The `use <id>` redirection command must trigger a secure redirection using `window.open` with `noopener,noreferrer` as a direct user event handler callback.
- High-fidelity Retro Arcade design must use Google Fonts `Press Start 2P` and `VT323`.

---

### Task 1: Project Scaffolding & Data Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/data/projects.json`
- Create: `tests/data.test.js`

**Interfaces:**
- Produces: `src/data/projects.json` schema containing portfolio categories (`studio`, `3d`, `random`), model sources, and links.

- [ ] **Step 1: Write package.json with Dev Server, Vitest, and model-viewer dependency**

```json
{
  "name": "portfolio-retro-arcade",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@google/model-viewer": "^4.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "jsdom": "^24.0.0"
  }
}
```

- [ ] **Step 2: Write vite.config.js**

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 3: Write index.html with Google Fonts and model-viewer loader scripts**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bumbu Studio & Art Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/src/style.css">
  <link rel="stylesheet" href="/src/assets/css/retro-crt.css">
</head>
<body>
  <div id="crt-overlay"></div>
  <header>
    <h1 class="blink-fast">BUMBU ARCADE SYSTEM</h1>
  </header>
  <main id="app">
    <!-- Component grids go here -->
  </main>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create the unified data file src/data/projects.json**

```json
[
  {
    "id": "bumbu-coming-soon",
    "name": "Project Cooking",
    "category": "studio",
    "isPlaceholder": true,
    "description": "Bumbu Studio's next game is in active development. Insert coin to play soon!",
    "link": "#",
    "image": ""
  },
  {
    "id": "robot-mech",
    "name": "Sci-Fi Mech",
    "category": "3d",
    "isPlaceholder": false,
    "description": "A low-poly retro sci-fi robot mech modeled in Blender.",
    "modelSrc": "models/mech.glb",
    "image": ""
  },
  {
    "id": "weather-cli",
    "name": "Retro Weather App",
    "category": "random",
    "isPlaceholder": false,
    "description": "A Javascript terminal tool showcasing weather updates with ASCII visual representations.",
    "link": "https://github.com/username/weather-cli",
    "image": ""
  }
]
```

- [ ] **Step 5: Write the schema validation test tests/data.test.js**

```javascript
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
```

- [ ] **Step 6: Run tests to verify the schema test passes**

Run: `npm run test`
Expected output: 1 passed

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.js index.html src/data/projects.json tests/data.test.js
git commit -m "feat: scaffold workspace and projects json data database"
```

---

### Task 2: Global Retro CRT Styling & Layout

**Files:**
- Create: `src/style.css`
- Create: `src/assets/css/retro-crt.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: Google Fonts (`Press Start 2P`, `VT323`) loaded in `index.html`.

- [ ] **Step 1: Write base design tokens, reset, and layout in src/style.css**

```css
:root {
  --bg-primary: #0a0a0c;
  --bg-panel: #14151a;
  --text-green: #39ff14;
  --text-cyan: #00f0ff;
  --text-magenta: #ff007f;
  --text-yellow: #ffcc00;
  --font-title: 'Press Start 2P', monospace;
  --font-body: 'VT323', monospace;
  --border-neon: 4px double var(--text-cyan);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-primary);
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 1.25rem;
  line-height: 1.4;
  overflow-x: hidden;
  padding: 20px;
}

h1, h2, h3 {
  font-family: var(--font-title);
  color: var(--text-yellow);
}

.blink-fast {
  animation: blink 0.8s infinite alternate;
}

@keyframes blink {
  0% { opacity: 0.2; }
  100% { opacity: 1; }
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

.grid-section {
  margin-bottom: 40px;
  border: var(--border-neon);
  padding: 20px;
  background-color: var(--bg-panel);
}
```

- [ ] **Step 2: Create CRT Scanline and voltage flicker animations in src/assets/css/retro-crt.css**

```css
#crt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.25) 50%
  ), linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.06),
    rgba(0, 255, 0, 0.02),
    rgba(0, 0, 255, 0.06)
  );
  background-size: 100% 4px, 6px 100%;
  pointer-events: none;
  z-index: 9999;
}

/* Flicker effect to simulate cathode-ray tube screen */
body::after {
  content: " ";
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(18, 16, 16, 0.1);
  opacity: 0;
  z-index: 9998;
  pointer-events: none;
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0% { opacity: 0.27861; }
  5% { opacity: 0.34769; }
  10% { opacity: 0.23604; }
  15% { opacity: 0.90626; }
  20% { opacity: 0.18128; }
  25% { opacity: 0.83891; }
  30% { opacity: 0.65583; }
  35% { opacity: 0.67807; }
  40% { opacity: 0.26559; }
  45% { opacity: 0.84693; }
  50% { opacity: 0.96019; }
  55% { opacity: 0.13594; }
  60% { opacity: 0.88013; }
  65% { opacity: 0.19083; }
  70% { opacity: 0.63403; }
  75% { opacity: 0.53654; }
  80% { opacity: 0.82469; }
  85% { opacity: 0.2101; }
  90% { opacity: 0.4439; }
  95% { opacity: 0.98247; }
  100% { opacity: 0.46356; }
}
```

- [ ] **Step 3: Modify index.html to create layout categories**

```html
<!-- Replace body inner contents in index.html -->
<body>
  <div id="crt-overlay"></div>
  <header style="text-align: center; margin-bottom: 30px;">
    <h1 class="blink-fast" style="font-size: 2rem;">BUMBU ARCADE SYSTEM</h1>
  </header>
  <main id="app">
    <section class="grid-section">
      <h2 style="font-size: 1.5rem; border-bottom: 2px solid var(--text-magenta); padding-bottom: 10px; margin-bottom: 20px;">[ BUMBU STUDIO ]</h2>
      <div id="studio-grid" class="cards-container"></div>
    </section>
    <section class="grid-section">
      <h2 style="font-size: 1.5rem; border-bottom: 2px solid var(--text-cyan); padding-bottom: 10px; margin-bottom: 20px;">[ 3D BLENDER ART ]</h2>
      <div id="blender-grid" class="cards-container"></div>
    </section>
    <section class="grid-section">
      <h2 style="font-size: 1.5rem; border-bottom: 2px solid var(--text-yellow); padding-bottom: 10px; margin-bottom: 20px;">[ RANDOM PROJECTS ]</h2>
      <div id="random-grid" class="cards-container"></div>
    </section>
  </main>
  <script type="module" src="/src/main.js"></script>
</body>
```

- [ ] **Step 4: Create a dummy src/main.js**

```javascript
import './style.css';
import './assets/css/retro-crt.css';

console.log('Arcade Loaded Successfully.');
```

- [ ] **Step 5: Visual Check**

Launch Dev Server: `npx vite --port 3000` (open browser to see screen flicker, neon typography, and sections).

- [ ] **Step 6: Commit**

```bash
git add src/style.css src/assets/css/retro-crt.css index.html src/main.js
git commit -m "style: implement basic styling, CRT scanline overlay, layout categories"
```

---

### Task 3: Projects Visual Cards Grid & 3D Model Modal

**Files:**
- Create: `src/components/ProjectCard.js`
- Create: `src/components/ModelModal.js`
- Modify: `src/main.js`
- Create: `tests/components.test.js`

**Interfaces:**
- Consumes: Unified data array from `src/data/projects.json`.
- Produces: HTML representation helper classes `ProjectCard` and `ModelModal` that dynamically render HTML.

- [ ] **Step 1: Write tests/components.test.js containing card markup validation tests**

```javascript
import { expect, test } from 'vitest';
import { renderCard } from '../src/components/ProjectCard';

test('renders card placeholder and regular project cards', () => {
  const placeholder = { id: 'test-soon', name: 'Locked', category: 'studio', isPlaceholder: true, description: 'Coming soon!' };
  const project = { id: 'test-real', name: 'Real', category: 'random', isPlaceholder: false, description: 'Real project' };

  const placeholderHTML = renderCard(placeholder);
  expect(placeholderHTML).toContain('INSERT COIN');
  expect(placeholderHTML).toContain('Coming soon!');

  const realHTML = renderCard(project);
  expect(realHTML).not.toContain('INSERT COIN');
  expect(realHTML).toContain('Real');
});
```

- [ ] **Step 2: Create src/components/ProjectCard.js with render logic**

```javascript
export function renderCard(project) {
  if (project.isPlaceholder) {
    return `
      <div class="card card-placeholder card-studio">
        <div class="card-inner">
          <div class="lock-icon">🔒</div>
          <h3>${project.name.toUpperCase()}</h3>
          <p class="blink-fast text-yellow">[ INSERT COIN TO UNLOCK ]</p>
          <p>${project.description}</p>
        </div>
      </div>
    `;
  }

  const actionButton = project.category === '3d' 
    ? `<button class="card-btn btn-3d" data-id="${project.id}">[ VIEW 3D ]</button>`
    : `<a class="card-btn" href="${project.link}" target="_blank" rel="noopener noreferrer">[ GO TO PROJECT ]</a>`;

  return `
    <div class="card card-${project.category}" id="project-card-${project.id}">
      <div class="card-inner">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="card-footer">
          ${actionButton}
        </div>
      </div>
    </div>
  `;
}
```

- [ ] **Step 3: Create style variables for Card Elements inside src/style.css**

Append the following styles to `src/style.css`:
```css
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  border: 2px solid var(--text-cyan);
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px var(--text-cyan);
}

.card-studio {
  border-color: var(--text-magenta);
}
.card-studio:hover {
  box-shadow: 0 0 15px var(--text-magenta);
}

.card-placeholder {
  opacity: 0.7;
  text-align: center;
  border-style: dashed;
}

.card-btn {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 12px;
  background: none;
  color: var(--text-yellow);
  border: 1px solid var(--text-yellow);
  font-family: var(--font-title);
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: none;
}

.card-btn:hover {
  background: var(--text-yellow);
  color: #000;
}
```

- [ ] **Step 4: Create src/components/ModelModal.js to render 3D GLB model overlays using model-viewer**

```javascript
import '@google/model-viewer';

export function openModelModal(project) {
  // Create modal container element
  const modal = document.createElement('div');
  modal.id = 'model-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  modal.style.zIndex = '999';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';

  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2>${project.name.toUpperCase()}</h2>
        <button id="close-modal">[ X ]</button>
      </div>
      <div class="modal-body">
        <div class="viewer-container">
          <model-viewer src="${project.modelSrc}" auto-rotate camera-controls style="width: 100%; height: 350px; background-color: #111; border: 2px solid var(--text-cyan);"></model-viewer>
        </div>
        <div class="viewer-description">
          <p>${project.description}</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close trigger
  modal.querySelector('#close-modal').addEventListener('click', () => {
    modal.remove();
  });
}
```

- [ ] **Step 5: Write styling for Modal inside src/style.css**

Append the following modal styles to `src/style.css`:
```css
.modal-box {
  width: 90%;
  max-width: 700px;
  background-color: var(--bg-panel);
  border: var(--border-neon);
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--text-cyan);
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.modal-header button {
  background: none;
  border: none;
  color: var(--text-magenta);
  font-family: var(--font-title);
  font-size: 1rem;
  cursor: pointer;
}

.viewer-description {
  margin-top: 15px;
  color: #fff;
  font-family: var(--font-body);
}
```

- [ ] **Step 6: Modify src/main.js to pull data and populate categories**

```javascript
import './style.css';
import './assets/css/retro-crt.css';
import projects from './data/projects.json';
import { renderCard } from './components/ProjectCard';
import { openModelModal } from './components/ModelModal';

document.addEventListener('DOMContentLoaded', () => {
  const studioGrid = document.getElementById('studio-grid');
  const blenderGrid = document.getElementById('blender-grid');
  const randomGrid = document.getElementById('random-grid');

  projects.forEach(project => {
    const cardHTML = renderCard(project);
    if (project.category === 'studio') {
      studioGrid.innerHTML += cardHTML;
    } else if (project.category === '3d') {
      blenderGrid.innerHTML += cardHTML;
    } else if (project.category === 'random') {
      randomGrid.innerHTML += cardHTML;
    }
  });

  // Event listener delegation for 3D buttons
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-3d')) {
      const projId = e.target.getAttribute('data-id');
      const project = projects.find(p => p.id === projId);
      if (project) {
        openModelModal(project);
      }
    }
  });
});
```

- [ ] **Step 7: Run test to verify HTML matches expectations**

Run: `npm run test`
Expected: 2 passed

- [ ] **Step 8: Commit**

```bash
git add src/components/ProjectCard.js src/components/ModelModal.js src/main.js tests/components.test.js src/style.css
git commit -m "feat: render dynamic projects grids and GLB modal viewers"
```

---

### Task 4: CLI Terminal Engine & Autocomplete Logic

**Files:**
- Create: `src/components/RetroTerminal.js`
- Modify: `src/main.js`
- Modify: `src/style.css`
- Create: `tests/terminal.test.js`

**Interfaces:**
- Consumes: Unified data array from `src/data/projects.json`.
- Produces: `<retro-terminal>` Custom Component rendering input feeds, tab autocomplete states, and command parser.

- [ ] **Step 1: Write unit tests tests/terminal.test.js targeting autocomplete and parsing logic**

```javascript
import { expect, test } from 'vitest';
import { getAutocompleteMatch } from '../src/components/RetroTerminalHelper';

test('autocompletes commands and projects', () => {
  const commands = ['help', 'projects', 'project', 'use', 'clear', 'about', 'socials'];
  const projectIds = ['robot-mech', 'weather-cli'];

  // Command Autocomplete
  expect(getAutocompleteMatch('pr', 0, commands, projectIds)).toEqual({ completed: 'projects', index: 0 });
  
  // Project Autocomplete after space
  expect(getAutocompleteMatch('project ro', 0, commands, projectIds)).toEqual({ completed: 'project robot-mech', index: 0 });
  expect(getAutocompleteMatch('use we', 0, commands, projectIds)).toEqual({ completed: 'use weather-cli', index: 0 });

  // Cycling Autocomplete
  expect(getAutocompleteMatch('p', 0, commands, projectIds)).toEqual({ completed: 'projects', index: 0 });
  expect(getAutocompleteMatch('p', 1, commands, projectIds)).toEqual({ completed: 'project', index: 1 });
});
```

- [ ] **Step 2: Create src/components/RetroTerminalHelper.js to encapsulate pure autocomplete logic**

```javascript
export function getAutocompleteMatch(inputVal, cycleIndex, commands, projectIds) {
  const parts = inputVal.trim().split(/\s+/);
  
  // Case 1: Autocomplete commands (first word)
  if (parts.length === 1 && !inputVal.endsWith(' ')) {
    const matchingCmds = commands.filter(c => c.startsWith(parts[0]));
    if (matchingCmds.length === 0) return null;
    const match = matchingCmds[cycleIndex % matchingCmds.length];
    return { completed: match, index: cycleIndex % matchingCmds.length, list: matchingCmds };
  }

  // Case 2: Autocomplete project IDs (second word) after "project" or "use"
  if (parts.length >= 1 && (parts[0] === 'project' || parts[0] === 'use')) {
    const typedProjectVal = parts.length === 2 ? parts[1] : '';
    const matchingProjects = projectIds.filter(p => p.startsWith(typedProjectVal));
    if (matchingProjects.length === 0) return null;
    const match = matchingProjects[cycleIndex % matchingProjects.length];
    return { completed: `${parts[0]} ${match}`, index: cycleIndex % matchingProjects.length, list: matchingProjects };
  }

  return null;
}
```

- [ ] **Step 3: Create src/components/RetroTerminal.js defining custom element `<retro-terminal>`**

```javascript
import projects from '../data/projects.json';
import { getAutocompleteMatch } from './RetroTerminalHelper';

class RetroTerminal extends HTMLElement {
  connectedCallback() {
    this.commands = ['help', 'projects', 'project', 'use', 'clear', 'about', 'socials'];
    this.projectIds = projects.map(p => p.id);
    this.history = [];
    this.historyIndex = -1;
    this.cycleIndex = 0;
    this.lastTabInput = '';

    this.innerHTML = `
      <div id="cli-panel" class="closed">
        <div id="cli-output"></div>
        <div id="cli-input-line">
          <span class="prompt">visitor@bumbustudio:~$</span>
          <input type="text" id="cli-input" autofocus autocomplete="off" spellcheck="false" />
        </div>
      </div>
      <button id="cli-toggle" aria-label="Toggle Terminal">[ >_ CLI_MODE ]</button>
    `;

    this.panel = this.querySelector('#cli-panel');
    this.output = this.querySelector('#cli-output');
    this.input = this.querySelector('#cli-input');
    this.toggleBtn = this.querySelector('#cli-toggle');

    this.toggleBtn.addEventListener('click', () => this.toggle());
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Desktop Backtick Listener
    window.addEventListener('keydown', (e) => {
      if (e.key === '`') {
        e.preventDefault();
        this.toggle();
      }
    });

    this.writeLine("Welcome to Bumbu Arcade CLI System. Type 'help' for command list.");
  }

  toggle() {
    this.panel.classList.toggle('closed');
    if (!this.panel.classList.contains('closed')) {
      setTimeout(() => this.input.focus(), 50);
    }
  }

  writeLine(text, className = '') {
    const line = document.createElement('div');
    line.className = className;
    line.textContent = text;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  handleKeydown(e) {
    if (e.key === 'Enter') {
      const value = this.input.value.trim();
      this.input.value = '';
      this.cycleIndex = 0;
      this.lastTabInput = '';
      if (!value) return;
      
      this.history.push(value);
      this.historyIndex = this.history.length;
      
      this.writeLine(`visitor@bumbustudio:~$ ${value}`);
      this.executeCommand(value);
    } 
    else if (e.key === 'Tab') {
      e.preventDefault();
      const value = this.input.value;
      if (!value) return;

      if (this.lastTabInput === '') {
        this.lastTabInput = value;
        this.cycleIndex = 0;
      } else {
        this.cycleIndex++;
      }

      const matchInfo = getAutocompleteMatch(this.lastTabInput, this.cycleIndex, this.commands, this.projectIds);
      if (matchInfo) {
        this.input.value = matchInfo.completed;
        if (matchInfo.list.length > 1) {
          this.writeLine(`Matches: ${matchInfo.list.join(', ')}`);
        }
      }
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    }
    else {
      this.lastTabInput = '';
      this.cycleIndex = 0;
    }
  }

  executeCommand(cmdStr) {
    const parts = cmdStr.split(/\s+/);
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (command) {
      case 'help':
        this.writeLine("Available commands:");
        this.writeLine("  help               - Show instruction guidelines");
        this.writeLine("  projects           - Display project lists");
        this.writeLine("  project <id>       - Show project detail information");
        this.writeLine("  use <id>           - Securely open target project link in browser");
        this.writeLine("  about              - Boot up developer profile biography");
        this.writeLine("  socials            - Clickable social channels listings");
        this.writeLine("  clear              - Wipe CLI panel clear");
        break;

      case 'projects':
        this.writeLine("--- BUMBU STUDIO (GAMES & APPS) ---");
        projects.filter(p => p.category === 'studio').forEach(p => this.writeLine(` - ${p.id} : ${p.name}`));
        this.writeLine("--- 3D BLENDER ART ---");
        projects.filter(p => p.category === '3d').forEach(p => this.writeLine(` - ${p.id} : ${p.name}`));
        this.writeLine("--- RANDOM PROJECTS ---");
        projects.filter(p => p.category === 'random').forEach(p => this.writeLine(` - ${p.id} : ${p.name}`));
        break;

      case 'project':
        if (!arg) {
          this.writeLine("Usage: project <project-id>");
          break;
        }
        const proj = projects.find(p => p.id === arg);
        if (proj) {
          this.writeLine(`Name: ${proj.name}`);
          this.writeLine(`Category: ${proj.category.toUpperCase()}`);
          this.writeLine(`Description: ${proj.description}`);
          if (proj.link && proj.link !== '#') this.writeLine(`Link: ${proj.link}`);
        } else {
          this.writeLine(`Project '${arg}' not found.`);
        }
        break;

      case 'use':
        if (!arg) {
          this.writeLine("Usage: use <project-id>");
          break;
        }
        const useProj = projects.find(p => p.id === arg);
        if (useProj) {
          if (useProj.link && useProj.link !== '#') {
            this.writeLine(`Redirecting to: ${useProj.link}...`);
            window.open(useProj.link, '_blank', 'noopener,noreferrer');
          } else {
            this.writeLine(`Project '${arg}' does not have a redirect link. (Coming Soon)`);
          }
        } else {
          this.writeLine(`Project '${arg}' not found.`);
        }
        break;

      case 'about':
        this.writeLine("BOOTING DEVELOPER BIO...");
        this.writeLine("Dev: Game Enthusiast & Creative Coder");
        this.writeLine("Blender Art: Specialized in Retro & Low-poly mesh models");
        this.writeLine("Core Stack: Javascript, WebDev, & Interactive Visuals");
        break;

      case 'socials':
        this.writeLine("GitHub: https://github.com/your-username");
        this.writeLine("Itch.io: https://your-profile.itch.io");
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      default:
        this.writeLine(`Command not recognized: '${command}'. Type 'help' for options.`);
    }
  }
}

customElements.define('retro-terminal', RetroTerminal);
export { RetroTerminal };
