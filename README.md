# 🕹️ Retro Arcade Portfolio Website

Welcome to **Bumbu Arcade**, a high-fidelity, interactive developer portfolio website styled after classic 80s arcade cabinets and RPG interfaces. Built using modern web technologies with a lightweight, dependency-free code architecture.

This portfolio features a hybrid interface: a gorgeous visual grid UI and a fully functional floating command-line terminal widget.

---

## 🚀 Live Demo & Repository
- **Target URL**: [https://github.com/zidanLPTP/ZidanDev.git](https://github.com/zidanLPTP/ZidanDev.git)
- **Local Dev Server**: Run `npm run dev` to start locally.

---

## 👾 Core Features

### 1. Interactive CLI Terminal Widget (`<retro-terminal>`)
Floating terminal drawer placed in the bottom right corner (toggled via backtick `` ` `` key or mobile touch button `[ >_ CLI_MODE ]` with `48px` touch target).
- **Tab Autocomplete Cycling**: Case-insensitive command and argument completion that cycles sequentially.
- **Command History**: Navigate previous commands using Arrow Up/Down keys.
- **Contextual Autocomplete Routing**:
  - `project <id>` & `use <id>` autocomplete targets project IDs from `projects.json`.
  - `inspect <id>` autocompletes skill IDs from `skills.json`.
- **Command Executions**:
  - `help` - Lists instructions.
  - `about` / `socials` - Developer bio & social channels.
  - `projects` - Print structured project listings.
  - `project <id>` - Inspect project specifications.
  - `use <id>` - Securely opens external link in a new tab (`noopener,noreferrer`).
  - `inventory` / `inspect <item-id>` - Read skills data.
  - `quests` - List all active and completed quests.
  - `guilds` - List active guilds and faction associations.
  - `status` - Show active character stats.
  - `select <class-id>` - Switch active character class.
  - `guestbook` / `sign <init> <msg>` - Interact with guestbook.
  - `clear` - Clear console logs.

### 2. RPG Character Status & Selection (About Me)
Interactive profile bio page designed like an RPG status screen.
- **Dynamic Character Selection**: Choose between classes (Developer, 3D Artist, Gamer) to swap portraits, attributes, and descriptions.
- **Aesthetic Progress Bars**: Renders HP, MP, INT, STR, and AGI attributes using sharp pixel blocks styled with repeating linear gradients.
- **Synchronized CLI select**: Use `select <class>` to change choices from the terminal, which triggers immediate GUI redraws.

### 3. 3D Blender Art Showcase & Modal Viewer
Showcases 3D modeling work natively using `.glb` assets.
- **Lazy-Loaded 3D Engine**: `@google/model-viewer` and `three.js` are dynamically imported on-demand when a user clicks a 3D asset card, ensuring fast initial page loads.
- **Accessible Modal Interactions**: Backdrop click closing, body scroll locking, and keyboard `Escape` key close listeners.

### 4. RPG Skills Inventory (Backpack Grid)
Technical skills are displayed as items inside a 4x4 inventory grid backpack.
- **Custom Pixel Art SVGs**: Custom pixelated vector icons (potion for languages, sword for 3D modeling, shield for styling) rendering sharp-pixel borders.
- **Inventory Detail Sheet**: Click slots to update the side panel with item type, rarity rank (LEGENDARY, EPIC, RARE), attributes (INT, STR, DEF stats), and usage notes.
- **Responsive mobile grid**: Flex row layout on desktop, stacking into vertical columns on screens under `768px`.

### 5. RPG Quest Log & Guild Factions (Timeline)
Chronicles work experience, educational history, and organization memberships as RPG quests.
- **Active & Completed Quests Tab Controls**: A visual interface separating active tasks from completed achievements.
- **Accordion Misi**: Click quest titles to dynamically expand and reveal the quest giver (Guild/Faction), dates, description, and EXP rewards.
- **Tab State Auto-Reset**: Automatically clears active accordion expanded states when switching tabs.
- **Empty Guilds Fallback**: If no active guilds are present, the CLI command handles a fallback response message.

### 6. Arcade Guestbook & Leaderboard (Contact Form)
A contact guestbook styled as a classic High-Score Board sorting entries by score descending.
- **Gamified Scoring**: Scores calculate dynamically based on message length (`length * 100` + random bonus), incentivizing detailed entries.
- **Safe Rendering (XSS Protection)**: Sanitizes input by strictly rendering messages/initials using `.textContent` / `.innerText` to prevent HTML/Script injections.
- **Event-Driven Synchronization**: Updates visually in real-time across CLI and GUI components upon custom event signals.
- **Local Storage Persistence**: Saves entries locally using try-catch blocks to prevent crashes on invalid storage data.

### 5. Retro CRT Monitor Aesthetics
- **CRT Overlay Scanlines**: Faux phosphors and horizontal scanline grids.
- **Flicker Overlay**: Electrical CRT monitor screen flicker animation.
- **Pixel Typography**: Loaded Google Fonts `Press Start 2P` & `VT323` matching retro system configurations.

---

## 🛠️ Tech Stack & Architecture

- **Bundler & Server**: Vite
- **Logic**: Vanilla JS (Custom Web Elements, ES Modules)
- **Styling**: Vanilla CSS (Variables, Flexbox, CSS Grid)
- **3D Render**: Google `@google/model-viewer` & `three.js` (Lazy-loaded)
- **Testing**: Vitest with `jsdom` (TDD verification)
- **Design Philosophy**: **Ponytail Style** (Zero framework boilerplate, standard web APIs, minimal lines of code).

---

## 🧪 Running Tests & Development

Start the development server:
```bash
npm run dev
```

Run the unit and integration test suite:
```bash
npm run test
```

The test coverage validates:
- Autocomplete routing logic
- Space-preserving CLI argument parsing
- XSS prevention escaping
- High-score sorting & JSON structure schemas
- Card markup generation
- Quest schema validation and kebab-case ID consistency
- Tab-reset accordion click handlers and mock UI rendering
- Character JSON dataset schemas and SVG icon helper outputs
- Character select CLI status console visual rendering and string word-wraps
