# RPG Quest Log & Guilds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an RPG-style Quest Log and Guild Factions timeline system. Displays work experience, education history, and current organizational guilds in a tabbed accordion visual interface. Integrates `quests` and `guilds` commands in the CLI terminal.

**Tech Stack:** Vite, Vanilla JS, Vanilla CSS, Vitest (for test execution).

## Global Constraints
- Avoid third-party styling frameworks (no TailwindCSS/Bootstrap). Use pure Vanilla CSS with variables.
- Ponytail Constraint: Keep code short, concise, and prioritize native browser Web APIs and JS methods.
- Tab State Cleanups: Toggling between "Active Quests" and "Completed Quests" tabs must clear all `.expanded` classes from the DOM before rendering the newly selected tab.
- Empty Guilds Fallback: If no active guilds are found in the database when executing the `guilds` CLI command, output the message: `"Semua Guild Factions telah diselesaikan. Ketik 'quests' untuk melihat riwayat kejayaan masa lalu."`
- ID Consistency: Quest IDs inside the JSON database must follow lowercase kebab-case (e.g. `gdsc-staff`, `freelance-dev`).
- High-fidelity Retro Arcade design must use Google Fonts `Press Start 2P` and `VT323`.

---

### Task 1: Quest Log Dataset & Schema Test

**Files:**
- Create: `src/data/quests.json`
- Create: `tests/quests.test.js`

**Interfaces:**
- Produces: `src/data/quests.json` array containing quests.
- Produces: `tests/quests.test.js` validating schema properties.

- [ ] **Step 1: Create the database src/data/quests.json**

```json
[
  {
    "id": "gdsc-staff",
    "title": "Core Staff Member",
    "guild": "Google Developer Student Clubs (GDSC)",
    "period": "2025 - Present",
    "type": "active",
    "category": "guild",
    "rewards": "EXP +400, Leadership +1, Network +5",
    "description": "Contributing to organizing software engineering workshops, managing hackathon campaigns, and helping members with web development quests."
  },
  {
    "id": "freelance-dev",
    "title": "Freelance Web Developer",
    "guild": "Bumbu Studio",
    "period": "2024 - Present",
    "type": "active",
    "category": "work",
    "rewards": "EXP +600, HTML Skill +3, CSS Skill +2",
    "description": "Building custom responsive web applications for small businesses, implementing pixelated retro game graphics and layouts."
  },
  {
    "id": "school-grad",
    "title": "Software Engineering Student",
    "guild": "Vocal High School",
    "period": "2021 - 2024",
    "type": "completed",
    "category": "education",
    "rewards": "EXP +1000, Title: Graduate",
    "description": "Finished core software engineering curriculum, specialized in database schemas, basic algorithm structures, and web technologies."
  }
]
```

- [ ] **Step 2: Create tests/quests.test.js**

```javascript
import { expect, test } from 'vitest';
import quests from '../src/data/quests.json';

test('quests json schema and ID validation', () => {
  expect(Array.isArray(quests)).toBe(true);
  expect(quests.length).toBeGreaterThanOrEqual(3);

  const idRegex = /^[a-z0-9-]+$/;
  quests.forEach(q => {
    expect(q.id).toBeDefined();
    expect(idRegex.test(q.id)).toBe(true);
    expect(q.title).toBeDefined();
    expect(q.guild).toBeDefined();
    expect(q.period).toBeDefined();
    expect(['active', 'completed'].includes(q.type)).toBe(true);
    expect(['guild', 'work', 'education'].includes(q.category)).toBe(true);
    expect(q.rewards).toBeDefined();
    expect(q.description).toBeDefined();
  });
});
```

- [ ] **Step 3: Run tests to verify the suite passes**

Run: `npm run test`
Expected: 1 passed

- [ ] **Step 4: Commit**

```bash
git add src/data/quests.json tests/quests.test.js
git commit -m "feat: add quests JSON dataset and schema structure test"
```

---

### Task 2: Tabbed Accordion GUI Layout & Rendering

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`
- Create: `tests/quest-ui.test.js`

**Interfaces:**
- Consumes: `src/data/quests.json`.
- Produces: CSS tab selectors, accordion elements, and tab switcher state clearing.

- [ ] **Step 1: Modify index.html to add Quest Log Section**

Insert this HTML block after RPG Skills Inventory section (or Bumbu Studio, depending on placement) inside `index.html`:
```html
    <section class="grid-section">
      <h2 style="font-size: 1.5rem; border-bottom: 2px solid var(--text-cyan); padding-bottom: 10px; margin-bottom: 20px;">[ RPG QUEST LOG ]</h2>
      <div class="quest-log-layout">
        <div class="quest-tabs">
          <button class="quest-tab-btn active" data-tab="active">[ ACTIVE QUESTS ]</button>
          <button class="quest-tab-btn" data-tab="completed">[ COMPLETED QUESTS ]</button>
        </div>
        <div id="quest-list" class="quest-list"></div>
      </div>
    </section>
```

- [ ] **Step 2: Append grid layout and responsiveness CSS inside src/style.css**

Append the following styles:
```css
.quest-log-layout {
  border: 3px double var(--text-cyan);
  background-color: #050505;
  padding: 20px;
  font-family: var(--font-body);
}

.quest-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  border-bottom: 2px dashed #333;
  padding-bottom: 15px;
}

.quest-tab-btn {
  background: transparent;
  border: 2px solid var(--text-cyan);
  color: var(--text-cyan);
  font-family: var(--font-title);
  font-size: 0.8rem;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.quest-tab-btn:hover {
  background-color: var(--text-cyan);
  color: #000;
  box-shadow: 0 0 10px var(--text-cyan);
}

.quest-tab-btn.active {
  border-color: var(--text-yellow);
  color: var(--text-yellow);
  box-shadow: 0 0 10px var(--text-yellow);
}

.quest-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quest-item {
  border: 1px solid #333;
  background-color: #111;
  padding: 15px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.quest-item:hover {
  border-color: var(--text-cyan);
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quest-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quest-checkbox {
  font-family: var(--font-title);
  font-size: 0.9rem;
  color: var(--text-yellow);
}

.quest-title {
  color: #fff;
  font-size: 1.1rem;
}

.quest-period {
  color: #888;
  font-size: 0.9rem;
}

.quest-body {
  margin-top: 15px;
  border-top: 1px dashed #333;
  padding-top: 15px;
  display: none;
}

.quest-item.expanded .quest-body {
  display: block;
}

.quest-guild {
  color: var(--text-cyan);
  font-size: 0.95rem;
  margin-bottom: 5px;
}

.quest-rewards {
  margin-top: 10px;
  color: var(--text-magenta);
  font-family: var(--font-title);
  font-size: 0.8rem;
}
```

- [ ] **Step 3: Modify src/main.js to render Quests list and handle tab toggles**

Append the rendering logic to the end of `DOMContentLoaded` block in `src/main.js`:
```javascript
  const questList = document.getElementById('quest-list');
  const questTabs = document.querySelectorAll('.quest-tab-btn');

  if (questList && questTabs.length > 0) {
    import('./data/quests.json').then(({ default: quests }) => {
      const renderQuests = (tabType) => {
        // Step 1: Clean all active expanded states before rendering new tab content
        document.querySelectorAll('.quest-item').forEach(el => el.classList.remove('expanded'));

        questList.innerHTML = '';
        const filtered = quests.filter(q => q.type === tabType);

        filtered.forEach(q => {
          const item = document.createElement('div');
          item.className = 'quest-item';
          
          const checkbox = q.type === 'active' ? '[ ]' : '[x]';

          item.innerHTML = `
            <div class="quest-header">
              <div class="quest-title-row">
                <span class="quest-checkbox">${checkbox}</span>
                <span class="quest-title">${q.title}</span>
              </div>
              <span class="quest-period">${q.period}</span>
            </div>
            <div class="quest-body">
              <div class="quest-guild">GUILD/FACTION: ${q.guild}</div>
              <p>${q.description}</p>
              <div class="quest-rewards">REWARDS: ${q.rewards}</div>
            </div>
          `;

          item.addEventListener('click', () => {
            const isExpanded = item.classList.contains('expanded');
            document.querySelectorAll('.quest-item').forEach(el => el.classList.remove('expanded'));
            if (!isExpanded) {
              item.classList.add('expanded');
            }
          });

          questList.appendChild(item);
        });
      };

      // Initial render
      renderQuests('active');

      // Bind Tab Button Clicks
      questTabs.forEach(btn => {
        btn.addEventListener('click', () => {
          questTabs.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const tab = btn.getAttribute('data-tab');
          renderQuests(tab);
        });
      });
    });
  }
```

- [ ] **Step 4: Create unit test tests/quest-ui.test.js**

```javascript
import { expect, test } from 'vitest';
import quests from '../src/data/quests.json';

test('verify quest accordion item layout structure generation', () => {
  const q = quests[0];
  const checkbox = q.type === 'active' ? '[ ]' : '[x]';
  const html = `
    <div class="quest-header">
      <span class="quest-checkbox">${checkbox}</span>
      <span class="quest-title">${q.title}</span>
    </div>
    <div class="quest-body">
      <div class="quest-guild">${q.guild}</div>
    </div>
  `;

  expect(html).toContain('[ ]');
  expect(html).toContain('Core Staff Member');
  expect(html).toContain('Google Developer Student Clubs');
});
```

- [ ] **Step 5: Run tests**

Run: `npm run test`
Expected: 2 passed

- [ ] **Step 6: Commit**

```bash
git add index.html src/style.css src/main.js tests/quest-ui.test.js
git commit -m "feat: render quest log accordions, manage tabs, and handle state reset"
```

---

### Task 3: CLI Terminal Command Integration

**Files:**
- Modify: `src/components/RetroTerminal.js`
- Create: `tests/terminal-quests.test.js`

**Interfaces:**
- Consumes: `src/data/quests.json` in CLI.
- Modifies: `RetroTerminal.js` command executions and autocomplete terms.

- [ ] **Step 1: Create unit test tests/terminal-quests.test.js**

```javascript
import { expect, test } from 'vitest';
import quests from '../src/data/quests.json';

test('verify quest active filter and guild command mapping', () => {
  const activeGuilds = quests.filter(q => q.category === 'guild' && q.type === 'active');
  expect(activeGuilds.length).toBe(1);
  expect(activeGuilds[0].id).toBe('gdsc-staff');
});
```

- [ ] **Step 2: Modify src/components/RetroTerminal.js**

Update `src/components/RetroTerminal.js`:
- Import quests data:
  ```javascript
  import quests from '../data/quests.json';
  ```
- In `connectedCallback()`, add commands to `this.commands`:
  ```javascript
  this.commands = ['help', 'projects', 'project', 'use', 'inspect', 'inventory', 'guestbook', 'sign', 'quests', 'guilds', 'clear', 'about', 'socials'];
  ```
- In `executeCommand(cmdStr)` switch block:
  - Add `quests` case:
    ```javascript
          case 'quests':
            this.writeLine("--- ACTIVE QUESTS ---");
            quests.filter(q => q.type === 'active').forEach(q => {
              this.writeLine(` [ ] ${q.id.padEnd(14)} : ${q.title} (${q.guild}) [${q.period}]`);
            });
            this.writeLine("");
            this.writeLine("--- COMPLETED QUESTS ---");
            quests.filter(q => q.type === 'completed').forEach(q => {
              this.writeLine(` [x] ${q.id.padEnd(14)} : ${q.title} (${q.guild}) [${q.period}]`);
            });
            break;
    ```
  - Add `guilds` case with fallback empty checks:
    ```javascript
          case 'guilds':
            const activeGuilds = quests.filter(q => q.category === 'guild' && q.type === 'active');
            if (activeGuilds.length === 0) {
              this.writeLine("Semua Guild Factions telah diselesaikan. Ketik 'quests' untuk melihat riwayat kejayaan masa lalu.");
              break;
            }
            this.writeLine("--- ACTIVE GUILDS & FACTIONS ---");
            activeGuilds.forEach(g => {
              this.writeLine(`* ${g.guild}`);
              this.writeLine(`  Role : ${g.title}`);
              this.writeLine(`  Term : ${g.period}`);
              this.writeLine(`  Bonus: ${g.rewards}`);
              this.writeLine("");
            });
            break;
    ```
  - Update `help` case description to include `quests` and `guilds` list info.

- [ ] **Step 3: Run tests**

Run: `npm run test`
Expected: 3 passed (all 9 files pass)

- [ ] **Step 4: Commit**

```bash
git add src/components/RetroTerminal.js tests/terminal-quests.test.js
git commit -m "feat: add quests and guilds commands inside retro terminal CLI element"
```
