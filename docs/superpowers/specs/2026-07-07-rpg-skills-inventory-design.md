# Design Specification: RPG Skills Inventory System

This document outlines the architecture, data schema, visual layout, and CLI commands for the RPG-Style Skills Inventory System.

## 1. Overview

The RPG Skills Inventory System displays the developer's technical skills as items inside a retro 8-bit style grid (a backpack). Selecting an item display its stats (like proficiency levels, attributes) and a description.

### Core Features:
- **Skills Grid (GUI)**: A 4x4 grid container showing retro pixel art icons representing different skills (e.g. JavaScript, CSS, Blender). Clicking a slot "inspects" the item in a detailed side panel.
- **Retro Pixel Art Icons (SVGs)**: Inline native SVGs designed as pixelated sprites (e.g., a potion beaker for JavaScript, a sword for Blender, a shield for CSS) using crisp rendering.
- **Terminal Integration (CLI)**: Floating CLI terminal supports `inventory` (lists items) and `inspect <id>` (prints item specs) commands with tab autocomplete cycling.
- **Ponytail Constraints**: Keep code minimum, use standard browser events, and avoid external libraries.

---

## 2. Directory Structure

```text
D:\PortofolioWeb\
├── docs/superpowers/specs/
│   ├── 2026-07-06-portfolio-retro-arcade-design.md
│   └── 2026-07-07-rpg-skills-inventory-design.md  # This Spec Doc
├── src/
│   ├── components/
│   │   ├── ProjectCard.js
│   │   ├── ModelModal.js
│   │   ├── RetroTerminal.js        # Add inventory/inspect commands
│   │   └── RetroTerminalHelper.js  # Add autocomplete support for inspect/inventory
│   ├── data/
│   │   ├── projects.json
│   │   └── skills.json             # New unified skills database
│   ├── main.js                     # Instantiate and render the inventory grid
│   └── style.css                   # Grid layout, slot visuals, and detail panel
```

---

## 3. Data Schema (`skills.json`)

To keep CLI and GUI synced, all skills are defined in `src/data/skills.json`. Emojis are replaced by custom inline SVG layouts in the UI, but we track IDs and categories professionally.

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

---

## 4. UI Grid & SVG Sprites

### SVG Sprites Dictionary
We will implement a clean javascript dictionary mapping `iconType` to inline SVG string templates in a helper module, or hardcoded directly in the rendering code:
- `potion`: Beaker bottle containing colorful liquid.
- `sword`: Diagonal retro broadsword blade and handle.
- `shield`: Flat vertical defensive crest.

These SVGs use `shape-rendering="crispEdges"` to guarantee sharp, non-blurry pixels.

### Layout Specs (`index.html`)
The inventory component sits inside the main app body layout:
- Left Panel: `inventory-grid` containing 16 slots (4x4). Active skills occupy the first slots. The remaining empty slots render a centered dot (`.`) with dim opacity.
- Right Panel: `inventory-details` displaying a stylized item stats sheet.

---

## 5. CLI Commands Specification

The terminal Custom Element `<retro-terminal>` will read `skills.json` and support:
- `inventory`: Lists all items in a formatted table.
- `inspect <id>`: Prints the details of a skill using ASCII border decoration.

### Tab Autocomplete Cycling
- Command level: typing `inv` -> `inventory`, `ins` -> `inspect`.
- Parameter level: typing `inspect j` -> cycles through matching skill IDs (e.g. `javascript`) from the database.
