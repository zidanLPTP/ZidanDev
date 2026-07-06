# Design Specification: Retro Arcade Portfolio Website

This document outlines the architecture, design tokens, CLI terminal mechanics, and component structure for a hybrid Retro Arcade portfolio website.

## 1. Overview

The Retro Arcade Portfolio is a modern Single Page Application (SPA) with a visual style inspired by 8-bit/16-bit arcade systems and classic terminal interfaces.

### Core Features:
- **Hybrid Interface**: A premium retro GUI with a floating, collapsible interactive CLI (Terminal) widget.
- **Bumbu Studio (Games/Apps)**: A dedicated section designed like an arcade cabinet console. Includes a visual "Coming Soon / Under Construction / Insert Coin" placeholder state until new games/apps are deployed.
- **3D Blender Gallery**: A grid of Blender 3D models (`.glb` format) rendered interactively in a retro modal using Google's `<model-viewer>`.
- **Random Projects**: A showcase of miscellaneous web development projects linking directly to GitHub or live demos.
- **CLI Terminal**: Interactive terminal supporting `help`, `projects`, `project <id>`, `use <id>`, `about`, `socials`, and `clear`, complete with Tab Autocomplete and Up/Down command history.

---

## 2. Tech Stack & Dependencies

- **Build Tool**: Vite (Vanilla JS configuration)
- **Framework**: None (Pure Vanilla JS modules and Custom Elements)
- **Styling**: Vanilla CSS with custom utility styles (Retro aesthetics, CRT scanlines, flicker effect)
- **3D Viewer**: `@google/model-viewer` (Google's lightweight 3D web component)
- **Fonts**:
  - `Press Start 2P` (Google Fonts) - Pixel headlines, buttons, and retro arcade titles
  - `VT323` (Google Fonts) - Monospaced terminal output and descriptions

---

## 3. Directory Structure

```text
D:\PortofolioWeb\
├── docs/superpowers/specs/
│   └── 2026-07-06-portfolio-retro-arcade-design.md # This Spec Doc
├── public/
│   ├── favicon.ico
│   └── models/               # Storage for raw Blender .glb files
│       ├── (e.g., mech.glb)
│       └── (e.g., retro-car.glb)
├── src/
│   ├── assets/               # Local static assets processed by Vite
│   │   ├── images/           # Card preview fallbacks / pixel art placeholders
│   │   └── css/
│   │       └── retro-crt.css # Scanlines, glow, flicker animations
│   ├── components/           # UI Components
│   │   ├── RetroTerminal.js  # Floating CLI Terminal (Web Component)
│   │   ├── ProjectCard.js    # Visual Grid Card (Helper Module)
│   │   └── ModelModal.js     # 3D Model Modal Overlay (Helper Module)
│   ├── data/
│   │   └── projects.json     # Unified database (Single Source of Truth)
│   ├── main.js               # App entry point & main event controllers
│   └── style.css             # Base retro styling, CSS variables, CRT config
├── index.html                # Entry HTML (Loads fonts and main.js)
├── package.json              # App configuration, Vite & model-viewer deps
└── vite.config.js            # Vite configurations
```

---

## 4. Unified Data Schema (`projects.json`)

To ensure CLI and GUI remain in sync, all project entries are defined in `src/data/projects.json`.

```json
[
  {
    "id": "bumbu-coming-soon",
    "name": "Project Omega",
    "category": "studio",
    "isPlaceholder": true,
    "description": "Bumbu Studio's next big project is currently cooking. Insert coin to play soon!",
    "link": "#",
    "image": ""
  },
  {
    "id": "robot-mech",
    "name": "Sci-Fi Retro Mech",
    "category": "3d",
    "isPlaceholder": false,
    "description": "A low-poly retro sci-fi robot mech modeled in Blender and textured with classic diffuse mappings.",
    "modelSrc": "models/mech.glb",
    "image": "assets/images/mech-preview.png"
  },
  {
    "id": "weather-cli",
    "name": "Retro Weather CLI",
    "category": "random",
    "isPlaceholder": false,
    "description": "A Node.js CLI tool that displays local weather using ASCII art charts.",
    "link": "https://github.com/username/weather-cli",
    "image": "assets/images/weather-preview.png"
  }
]
```

---

## 5. CLI Terminal Engine Design

The terminal is encapsulated in a custom HTML element `<retro-terminal>` which hooks up keyboard and toggle events.

### Interface Details
- **Toggle Key**: Backtick (`` ` ``) key toggles the terminal's open/close state (primarily for desktop users).
- **Floating Dock Button**: A fixed-position button `[ >_ CLI_MODE ]` sits in the bottom-right corner for visual toggle. For mobile/touch compatibility, it will have a minimum touch target hitbox of `48px x 48px` and respond to `pointerdown` and `click` events instantly.
- **Focus Control**: Toggling the terminal opens a drawer from the bottom, and automatically focuses the hidden text input.

### Supported Commands
- `help`: Lists all valid commands and formatting.
- `projects`: Lists all projects grouped by category.
- `project <id>`: Prints details (description, tech tags) for a project matching the ID.
- `use <id>`: Opens the project link/repository in a new browser tab. To prevent pop-up blockers and ensure security, it will trigger via `window.open(link, '_blank', 'noopener,noreferrer')` directly in response to the user's `Enter` keypress (a user-initiated gesture).
- `about`: Prints user bio in system boot/log style.
- `socials`: Displays clickable social media links (GitHub, LinkedIn, Itch.io).
- `clear`: Empties the command history list in the CLI DOM.

### Tab Autocomplete Engine
1. Matches first word against commands: `[help, projects, project, use, about, socials, clear]`.
2. Matches second word against project IDs (`projects.json`) only if the command is `project` or `use`.
3. If one match is found, auto-completes the input.
4. If multiple matches are found, pressing `Tab` repeatedly cycles through the matched options (e.g., `robot-mech` -> Tab -> `retro-car` -> Tab -> `robot-mech`), updating the input field dynamically while showing the list of matches below.

### Command History
- Navigated via `Arrow Up` and `Arrow Down` keys. Uses an internal array to track past executed commands.

---

## 6. Styling & Retro Aesthetic System

The website relies on high-fidelity retro styling using standard CSS variables and effects.

### CSS Variables (`style.css`)
```css
:root {
  --bg-primary: #0a0a0c;
  --bg-terminal: #050505;
  --text-green: #39ff14;     /* Neon Terminal Green */
  --text-cyan: #00f0ff;      /* Laser Cyan */
  --text-magenta: #ff007f;   /* Arcade Pink */
  --text-yellow: #ffcc00;    /* Retro Coin Gold */
  --font-title: 'Press Start 2P', monospace;
  --font-body: 'VT323', monospace;
  --border-retro: 4px double var(--text-cyan);
}
```

### Visual Enhancements
1. **CRT Scanlines**: A fixed overlay spanning the screen using a linear-gradient repeating pattern to mimic retro screen phosphor lines.
2. **Screen Flicker**: A subtle CSS keyframe opacity animation applied to the body / CRT overlay to simulate voltage fluctuations.
3. **Double Pixel Borders**: Custom border styling matching the NES/Gameboy style system UI.
4. **Active Terminal Glow**: Text shadow styling for monospaced texts (`text-shadow: 0 0 5px currentColor;`).

---

## 7. Next Steps & Extensibility

- **Bumbu Studio Expansion**: The client can add real projects to `projects.json` by setting `isPlaceholder: false` and updating metadata.
- **Model Loader Optimization**: `<model-viewer>` is configured to lazy-load (i.e. loads only when the modal opens) so that first page paints remain exceptionally fast.
