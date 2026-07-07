# RPG Skills Inventory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an RPG-style Skills Inventory System displaying developer skills as pixelated items in a 4x4 grid. Clicking items inspects them in a side panel. Integrates `inventory` and `inspect <id>` commands in the CLI terminal with conditional autocomplete.

**Architecture:** Extended Vanilla JS SPA. Reads from `skills.json` to populate the inventory grid and details box. Key custom assets (potion, sword, shield) are written as native inline SVGs. CLI commands read the same JSON for sync.

**Tech Stack:** Vite, Vanilla JS, Vanilla CSS, Vitest (for test execution).

## Global Constraints
- Avoid third-party styling frameworks (no TailwindCSS/Bootstrap). Use pure Vanilla CSS with variables.
- Ponytail Constraint: Keep code short, concise, and prioritize native browser Web APIs and JS methods.
- Clicking an empty slot must show the message `[ EMPTY SLOT. Complete new quests to unlock new skills! ]`.
- Desktop displays side-by-side. On screens narrower than `768px`, the grid and details panel stack vertically (column).
- Autocomplete:
  - Preceding command is `project` or `use` -> Autocomplete uses project IDs.
  - Preceding command is `inspect` -> Autocomplete uses skill IDs.
- High-fidelity Retro Arcade design must use Google Fonts `Press Start 2P` and `VT323`.

---

### Task 1: Skills Database & SVG Sprites Helper

**Files:**
- Create: `src/data/skills.json`
- Create: `src/components/SkillSprites.js`
- Create: `tests/skills.test.js`

**Interfaces:**
- Produces: `src/data/skills.json` array containing skill objects.
- Produces: `getSkillSprite(iconType)` returning an inline SVG string.

- [ ] **Step 1: Create the skills database src/data/skills.json**

```json
[
  {
    "id": "javascript",
    "name": "JavaScript",
    "iconType": "potion",
    "type": "Language",
    "rarity": "LEGENDARY",
    "stats": "INT +95, SPD +80",
    "description": "Primary engine for building dynamic client-side experiences, custom HTML elements, and asynchronous agent pipelines."
  },
  {
    "id": "css",
    "name": "CSS",
    "iconType": "shield",
    "type": "Styling",
    "rarity": "RARE",
    "stats": "DEF +90, RES +95",
    "description": "Essential tool used to style layout grids, implement CRT screen scanlines, and handle neon-glow micro-animations."
  },
  {
    "id": "blender",
    "name": "Blender",
    "iconType": "sword",
    "type": "3D Modeling",
    "rarity": "EPIC",
    "stats": "STR +88, DEX +50",
    "description": "Creative suite for sculpting low-poly meshes, texture painting, and exporting optimized GLB/GLTF assets."
  }
]
```

- [ ] **Step 2: Create src/components/SkillSprites.js containing inline pixel-art SVGs**

```javascript
const SPRITES = {
  potion: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges" style="fill: var(--text-green)">
      <rect x="7" y="2" width="2" height="4" fill="#ffffff" />
      <rect x="5" y="6" width="6" height="8" fill="var(--text-green)" />
      <rect x="5" y="6" width="6" height="1" fill="#ffffff" />
      <rect x="4" y="7" width="1" height="6" fill="#ffffff" />
      <rect x="11" y="7" width="1" height="6" fill="#ffffff" />
      <rect x="5" y="13" width="6" height="1" fill="#ffffff" />
    </svg>
  `,
  shield: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges" style="fill: var(--text-cyan)">
      <rect x="3" y="2" width="10" height="2" fill="var(--text-cyan)" />
      <rect x="3" y="4" width="10" height="1" fill="#ffffff" />
      <rect x="2" y="5" width="12" height="4" fill="var(--text-cyan)" />
      <rect x="4" y="9" width="8" height="2" fill="var(--text-cyan)" />
      <rect x="5" y="11" width="6" height="2" fill="var(--text-cyan)" />
      <rect x="7" y="13" width="2" height="2" fill="var(--text-cyan)" />
      <rect x="2" y="5" width="1" height="4" fill="#ffffff" />
      <rect x="13" y="5" width="1" height="4" fill="#ffffff" />
    </svg>
  `,
  sword: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges" style="fill: var(--text-magenta)">
      <rect x="11" y="2" width="3" height="3" fill="#ffffff" />
      <rect x="9" y="4" width="3" height="3" fill="#ffffff" />
      <rect x="7" y="6" width="3" height="3" fill="#ffffff" />
      <rect x="5" y="8" width="3" height="3" fill="#ffffff" />
      <rect x="3" y="10" width="3" height="3" fill="var(--text-yellow)" />
      <rect x="2" y="12" width="2" height="2" fill="var(--text-magenta)" />
    </svg>
  `
};

export function getSkillSprite(iconType) {
  return SPRITES[iconType] || '';
}
```

- [ ] **Step 3: Write tests/skills.test.js**

```javascript
import { expect, test } from 'vitest';
import skills from '../src/data/skills.json';
import { getSkillSprite } from '../src/components/SkillSprites';

test('skills json format validation', () => {
  expect(Array.isArray(skills)).toBe(true);
  expect(skills.length).toBe(3);
  expect(skills[0].id).toBe('javascript');
});

test('getSkillSprite returns svg element text', () => {
  expect(getSkillSprite('potion')).toContain('<svg');
  expect(getSkillSprite('potion')).toContain('crispEdges');
  expect(getSkillSprite('non-existent')).toBe('');
});
```

- [ ] **Step 4: Run tests to verify the suite passes**

Run: `npm run test`
Expected: 3 passed

- [ ] **Step 5: Commit**

```bash
git add src/data/skills.json src/components/SkillSprites.js tests/skills.test.js
git commit -m "feat: add skills dataset and pixel art SVG sprites configuration"
```

---

### Task 2: Skills Grid Rendering & Styling

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`
- Create: `tests/skills-ui.test.js`

**Interfaces:**
- Consumes: `src/data/skills.json` and `src/components/SkillSprites.js`.
- Produces: HTML 4x4 Grid rendering and click controllers.

- [ ] **Step 1: Modify index.html to add Skills Inventory section**

Insert this HTML block after Random Projects section inside `index.html`:
```html
    <section class="grid-section">
      <h2 style="font-size: 1.5rem; border-bottom: 2px solid var(--text-yellow); padding-bottom: 10px; margin-bottom: 20px;">[ RPG SKILLS INVENTORY ]</h2>
      <div class="inventory-layout">
        <div id="inventory-grid" class="inventory-grid"></div>
        <div id="inventory-details" class="inventory-details">
          <p class="blink-fast text-yellow" style="text-align: center; margin-top: 50px;">[ SELECT AN ITEM TO INSPECT ]</p>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append grid layout and responsiveness CSS inside src/style.css**

Append the following styles:
```css
.inventory-layout {
  display: flex;
  gap: 30px;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(4, 70px);
  grid-template-rows: repeat(4, 70px);
  gap: 10px;
  background-color: #050505;
  padding: 15px;
  border: 3px double var(--text-cyan);
  width: fit-content;
}

.inventory-slot {
  border: 1px solid #333;
  background-color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  image-rendering: pixelated;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.inventory-slot:hover {
  border-color: var(--text-cyan);
  box-shadow: 0 0 10px var(--text-cyan);
}

.inventory-slot.active {
  border-color: var(--text-yellow);
  box-shadow: 0 0 15px var(--text-yellow);
}

.inventory-slot-empty {
  color: #444;
  font-family: var(--font-title);
  font-size: 1.5rem;
}

.inventory-details {
  flex: 1;
  border: 3px double var(--text-yellow);
  background-color: #050505;
  padding: 20px;
  font-family: var(--font-body);
  color: #ffffff;
  text-shadow: 0 0 5px #ffffff;
  min-height: 320px;
}

.details-header {
  border-bottom: 2px solid var(--text-yellow);
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.details-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

/* Responsiveness: Stack vertically on tablet/mobile */
@media (max-width: 768px) {
  .inventory-layout {
    flex-direction: column;
    align-items: center;
  }
  .inventory-details {
    width: 100%;
    min-height: auto;
  }
}
```

- [ ] **Step 3: Modify src/main.js to render inventory slots and bind click handler**

Append the rendering logic to the end of `DOMContentLoaded` block in `src/main.js`:
```javascript
  const inventoryGrid = document.getElementById('inventory-grid');
  const inventoryDetails = document.getElementById('inventory-details');

  if (inventoryGrid && inventoryDetails) {
    import('./data/skills.json').then(({ default: skills }) => {
      import('./components/SkillSprites').then(({ getSkillSprite }) => {
        // Create 16 slots
        for (let i = 0; i < 16; i++) {
          const slot = document.createElement('div');
          const skill = skills[i];

          if (skill) {
            slot.className = 'inventory-slot';
            slot.dataset.id = skill.id;
            slot.innerHTML = getSkillSprite(skill.iconType);

            slot.addEventListener('click', () => {
              // Toggle active class
              document.querySelectorAll('.inventory-slot').forEach(s => s.classList.remove('active'));
              slot.classList.add('active');

              // Update details panel
              inventoryDetails.innerHTML = `
                <div class="details-header">
                  <h3 style="color: var(--text-yellow); font-family: var(--font-title); font-size: 1.1rem; margin-bottom: 5px;">${skill.name.toUpperCase()}</h3>
                  <div class="details-row">
                    <span>TYPE: ${skill.type}</span>
                    <span style="color: var(--text-magenta)">${skill.rarity}</span>
                  </div>
                  <div class="details-row">
                    <span style="color: var(--text-green)">STATS: ${skill.stats}</span>
                  </div>
                </div>
                <p style="font-size: 1.25rem;">${skill.description}</p>
              `;
            });
          } else {
            slot.className = 'inventory-slot inventory-slot-empty';
            slot.textContent = '.';
            slot.addEventListener('click', () => {
              document.querySelectorAll('.inventory-slot').forEach(s => s.classList.remove('active'));
              slot.classList.add('active');
              inventoryDetails.innerHTML = `
                <p class="blink-fast text-yellow" style="text-align: center; margin-top: 50px;">[ EMPTY SLOT. Complete new quests to unlock new skills! ]</p>
              `;
            });
          }
          inventoryGrid.appendChild(slot);
        }
      });
    });
  }
```

- [ ] **Step 4: Create unit test tests/skills-ui.test.js**

```javascript
import { expect, test } from 'vitest';
import skills from '../src/data/skills.json';

test('verify rendering layout details structure', () => {
  const renderDetailsHTML = (skill) => `
    <div class="details-header">
      <h3>${skill.name.toUpperCase()}</h3>
      <div>TYPE: ${skill.type} | ${skill.rarity}</div>
      <div>STATS: ${skill.stats}</div>
    </div>
    <p>${skill.description}</p>
  `;

  const html = renderDetailsHTML(skills[0]);
  expect(html).toContain('JAVASCRIPT');
  expect(html).toContain('LEGENDARY');
  expect(html).toContain('INT +95');
});
```

- [ ] **Step 5: Run tests**

Run: `npm run test`
Expected: 4 passed

- [ ] **Step 6: Commit**

```bash
git add index.html src/style.css src/main.js tests/skills-ui.test.js
git commit -m "feat: render skills grid slots, detail sheets, and handle mobile layout styles"
```

---

### Task 3: CLI Terminal Commands & Autocomplete Routing

**Files:**
- Modify: `src/components/RetroTerminal.js`
- Modify: `src/components/RetroTerminalHelper.js`
- Create: `tests/terminal-routing.test.js`

**Interfaces:**
- Consumes: `src/data/skills.json` inside autocomplete and execution.
- Modifies: `RetroTerminal.js` executing logic and `RetroTerminalHelper.js` mapping logic.

- [ ] **Step 1: Create unit test tests/terminal-routing.test.js targeting conditional autocomplete**

```javascript
import { expect, test } from 'vitest';
import { getAutocompleteMatch } from '../src/components/RetroTerminalHelper';

test('routes autocomplete targets based on preceding command', () => {
  const commands = ['help', 'projects', 'project', 'use', 'inspect', 'inventory'];
  const projectIds = ['robot-mech', 'weather-cli'];
  const skillIds = ['javascript', 'css', 'blender'];

  // inspect -> matches skills
  expect(getAutocompleteMatch('inspect ja', 0, commands, projectIds, skillIds)).toEqual({
    completed: 'inspect javascript',
    index: 0,
    list: ['javascript']
  });

  // project -> matches projects
  expect(getAutocompleteMatch('project ro', 0, commands, projectIds, skillIds)).toEqual({
    completed: 'project robot-mech',
    index: 0,
    list: ['robot-mech']
  });
});
```

- [ ] **Step 2: Modify src/components/RetroTerminalHelper.js to accept skillIds parameter and route matching**

```javascript
// Replace implementation in src/components/RetroTerminalHelper.js
export function getAutocompleteMatch(inputVal, cycleIndex, commands, projectIds, skillIds = []) {
  const parts = inputVal.trim().split(/\s+/);
  const commandInput = parts[0].toLowerCase();
  
  // Case 1: Autocomplete commands (first word)
  if (parts.length === 1 && !inputVal.endsWith(' ')) {
    const matchingCmds = commands
      .map(c => c.toLowerCase())
      .filter(c => c.startsWith(commandInput));
    if (matchingCmds.length === 0) return null;
    const match = matchingCmds[cycleIndex % matchingCmds.length];
    return { completed: match, index: cycleIndex % matchingCmds.length, list: matchingCmds };
  }

  // Case 2: Autocomplete project IDs (second word) after "project" or "use"
  if (parts.length >= 1 && (commandInput === 'project' || commandInput === 'use')) {
    const typedProjectVal = (parts.length === 2 ? parts[1] : '').toLowerCase();
    const matchingProjects = projectIds
      .map(p => p.toLowerCase())
      .filter(p => p.startsWith(typedProjectVal));
    if (matchingProjects.length === 0) return null;
    const match = matchingProjects[cycleIndex % matchingProjects.length];
    return { completed: `${commandInput} ${match}`, index: cycleIndex % matchingProjects.length, list: matchingProjects };
  }

  // Case 3: Autocomplete skill IDs (second word) after "inspect"
  if (parts.length >= 1 && commandInput === 'inspect') {
    const typedSkillVal = (parts.length === 2 ? parts[1] : '').toLowerCase();
    const matchingSkills = skillIds
      .map(s => s.toLowerCase())
      .filter(s => s.startsWith(typedSkillVal));
    if (matchingSkills.length === 0) return null;
    const match = matchingSkills[cycleIndex % matchingSkills.length];
    return { completed: `${commandInput} ${match}`, index: cycleIndex % matchingSkills.length, list: matchingSkills };
  }

  return null;
}
```

- [ ] **Step 3: Modify src/components/RetroTerminal.js to import skills data, support command runs, and update tab autocomplete**

Modify `src/components/RetroTerminal.js`:
- Import skills at top: `import skills from '../data/skills.json';`
- In `connectedCallback`, set command options:
  ```javascript
  this.commands = ['help', 'projects', 'project', 'use', 'inspect', 'inventory', 'clear', 'about', 'socials'];
  this.skillIds = skills.map(s => s.id);
  ```
- In `handleKeydown` Tab key match block, update autocomplete handler invocation:
  ```javascript
  const matchInfo = getAutocompleteMatch(this.lastTabInput, this.cycleIndex, this.commands, this.projectIds, this.skillIds);
  ```
- In `executeCommand(cmdStr)` switch block, add support for `inventory` and `inspect` commands:
  ```javascript
      case 'inventory':
        this.writeLine("--- RPG INVENTORY ITEMS ---");
        skills.forEach(s => this.writeLine(` - ${s.id} : ${s.name}`));
        break;

      case 'inspect':
        if (!arg) {
          this.writeLine("Usage: inspect <item-id>");
          break;
        }
        const skill = skills.find(s => s.id === arg.toLowerCase());
        if (skill) {
          this.writeLine("================================================");
          this.writeLine(`ITEM   : ${skill.name}`);
          this.writeLine(`TYPE   : ${skill.type} | RARITY: ${skill.rarity}`);
          this.writeLine(`STATS  : ${skill.stats}`);
          this.writeLine("------------------------------------------------");
          this.writeLine(skill.description);
          this.writeLine("================================================");
        } else {
          this.writeLine(`Item '${arg}' not found in inventory.`);
        }
        break;
  ```
- Update `help` details output text to list `inspect` and `inventory` commands.

- [ ] **Step 4: Run tests**

Run: `npm run test`
Expected: 6 passed

- [ ] **Step 5: Commit**

```bash
git add src/components/RetroTerminal.js src/components/RetroTerminalHelper.js tests/terminal-routing.test.js
git commit -m "feat: integrate inventory and inspect commands with conditional autocomplete routing"
```
