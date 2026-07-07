# Design Specification: RPG Quest Log & Guilds System

This document outlines the architecture, data schema, visual layout, and CLI commands for the RPG Quest Log & Guild Factions System.

## 1. Overview

The RPG Quest Log presents the developer's work experience, educational timeline, and current organizational participations as RPG missions.

### Core Features:
- **Tabbed Accordion GUI**: A tabbed list separating "Active Quests" (current jobs, education, and active guilds) and "Completed Quests" (past experience). Individual quests expand to reveal descriptions, dates, guilds, and exp rewards.
- **Active Guilds / Factions**: Represents active organization memberships as guild quests, detailing titles and organizational factions.
- **CLI Commands**: CLI terminal support for `quests` (lists active and completed missions) and `guilds` (lists currently active factions/organizations).
- **Ponytail Constraints**: Keep code short, use standard browser events, load data from a single unified JSON file, and avoid external dependencies.

---

## 2. Directory Structure

```text
D:\PortofolioWeb\
├── docs/superpowers/specs/
│   ├── 2026-07-06-portfolio-retro-arcade-design.md
│   ├── 2026-07-07-rpg-skills-inventory-design.md
│   ├── 2026-07-07-arcade-guestbook-design.md
│   └── 2026-07-07-rpg-quest-log-design.md          # This Spec Doc
├── src/
│   ├── components/
│   │   ├── ProjectCard.js
│   │   ├── ModelModal.js
│   │   ├── RetroTerminal.js        # Add quests/guilds commands
│   │   └── RetroTerminalHelper.js  # Add autocomplete support for quests/guilds
│   ├── data/
│   │   ├── projects.json
│   │   ├── skills.json
│   │   ├── guestbook.json
│   │   └── quests.json             # New unified quests database
│   ├── main.js                     # Render quest tabs and toggle accordion expansion
│   └── style.css                   # Tabs layout, accordion styles, checkbox styling
```

---

## 3. Data Schema (`quests.json`)

All timelines and memberships are saved in a unified `src/data/quests.json` file.

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

---

## 4. UI Accordion & Tabs Layout

### Tabs Component
- Tab Button Active: Filters `type === 'active'` (current work, school, or organizations).
- Tab Button Completed: Filters `type === 'completed'` (past school or work).

### Accordion Mechanics
- Clicking a quest header toggles class `.expanded` on the item.
- Only one item can be expanded at any time. Clicking an item collapses any currently active item.
- Checkbox markers:
  - Active: displays `[ ]`
  - Completed: displays `[x]`

---

## 5. CLI Commands Specification

The terminal Custom Element `<retro-terminal>` will support:
- `quests`: Displays both active and completed quests in a list formatted with checkbox symbols (`[ ]` / `[x]`).
- `guilds`: Filters for active guild entries (`type === 'active' && category === 'guild'`) and prints them alongside metadata (role, term, and attributes bonus).
- Tab autocomplete supports `quests` and `guilds` commands.
