# Design Specification: RPG Character Status / Selection Screen

This document outlines the architecture, data schema, visual layout, and CLI commands for the RPG Character Status & Selection Screen.

## 1. Overview

The Character Status section serves as the developer's "About Me" bio block, gamifying their capabilities by mapping them onto classic RPG classes (Developer, 3D Artist, Hardcore Gamer) with dynamically animating statistic bars.

### Core Features:
- **Interactive Character Grid**: Buttons on the left let users choose a class. Swapping a class changes the pixel-art SVG avatar, bio description, and attributes progress bars.
- **Pixel-styled Progress Bars**: Uses CSS transition triggers to animate HP, MP, INT, STR, and AGI parameters dynamically using retro blocks.
- **CLI Commands**: CLI terminal support for `status` (renders current class ASCII chart) and `select <class>` (dynamically changes the active class).
- **Custom Event Sync**: Updating the selection via terminal dispatches a window event `'character-changed'` to immediately redraw the visual UI panels.
- **Ponytail Constraints**: Keep code short, use native browser APIs, avoid heavy canvas rendering libraries, and load data from a single JSON database.

---

## 2. Directory Structure

```text
D:\PortofolioWeb\
├── docs/superpowers/specs/
│   ├── 2026-07-06-portfolio-retro-arcade-design.md
│   ├── 2026-07-07-rpg-skills-inventory-design.md
│   ├── 2026-07-07-arcade-guestbook-design.md
│   ├── 2026-07-07-rpg-quest-log-design.md
│   └── 2026-07-07-rpg-character-select-design.md  # This Spec Doc
├── src/
│   ├── components/
│   │   ├── ProjectCard.js
│   │   ├── ModelModal.js
│   │   ├── RetroTerminal.js        # Add status/select commands
│   │   └── RetroTerminalHelper.js  # Add autocomplete support for status/select class arguments
│   ├── data/
│   │   ├── projects.json
│   │   ├── skills.json
│   │   ├── guestbook.json
│   │   ├── quests.json
│   │   └── characters.json         # New unified characters class database
│   ├── main.js                     # Bind buttons click and update portrait/bar metrics
│   └── style.css                   # Grid layout, pixel bars styles, active selections
```

---

## 3. Data Schema (`characters.json`)

All class descriptions and attribute distributions are saved in `src/data/characters.json`.

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

---

## 4. UI Rendering Details

### Portrait SVG Sprites (Inlined in JS helper)
To keep the JSON payload clean, sharp pixelated SVGs representing the classes will be mapped dynamically in a javascript helper:
- `developer`: Floppy disk / pixel screen.
- `artist`: 3D pixelated wireframe wire-cube.
- `gamer`: Game controller.

### State Transitions
- Buttons are marked with class `.active`.
- Toggling selection updates:
  - Portrait container (`#char-portrait`).
  - Name header (`#char-name`) and description paragraph (`#char-desc`).
  - Statistical bar widths (`.char-stat-bar-fill`). The width transition triggers automatically via CSS: `transition: width 0.4s`.

---

## 5. CLI Commands Specification

The terminal Custom Element `<retro-terminal>` will support:
- `status`: Displays current selected class attributes and description formatted inside an ASCII panel box.
- `select <class>`: Validates input class against `developer`, `artist`, and `gamer`. On success, updates local variable, dispatches window custom event `'character-changed'` with `detail: { id }`, and outputs confirmation.
- Autocomplete routing:
  - Command autocomplete supports `status` and `select`.
  - Typing `select ` and pressing `Tab` cycles through `developer`, `artist`, and `gamer` sequentially.
