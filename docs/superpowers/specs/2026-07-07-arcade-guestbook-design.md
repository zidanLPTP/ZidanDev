# Design Specification: Arcade Guestbook & Leaderboard System

This document outlines the architecture, data schema, visual layouts, and CLI commands for the Arcade Guestbook & Leaderboard System.

## 1. Overview

The Arcade Guestbook acts as the portfolio's contact form, styled as a classic 80s arcade High-Score Leaderboard. Visitors can submit their initials and message to earn a gamified score.

### Core Features:
- **Leaderboard GUI**: A retro-styled table displaying the Rank, Initials (3 letters), Score (gamified), and Message of the top 10 players.
- **Submission Form GUI**: A form allowing visitors to input 3-character initials and a message. Submitting calculates a score, saves to local storage, and updates the leaderboard instantly using custom DOM events.
- **CLI Commands**: CLI terminal support for `guestbook` (prints the text table) and `sign <initials> <message>` (adds signature directly from terminal).
- **Ponytail Constraints**: Minimal code, standard browser local storage, native custom events, and zero dependencies.

---

## 2. Directory Structure

```text
D:\PortofolioWeb\
├── docs/superpowers/specs/
│   ├── 2026-07-06-portfolio-retro-arcade-design.md
│   ├── 2026-07-07-rpg-skills-inventory-design.md
│   └── 2026-07-07-arcade-guestbook-design.md       # This Spec Doc
├── src/
│   ├── components/
│   │   ├── ProjectCard.js
│   │   ├── ModelModal.js
│   │   ├── RetroTerminal.js        # Add guestbook/sign commands
│   │   └── RetroTerminalHelper.js  # Add autocomplete support for guestbook/sign
│   ├── data/
│   │   ├── projects.json
│   │   ├── skills.json
│   │   └── guestbook.json          # New unified default leaderboard scores
│   ├── main.js                     # Render leaderboard, bind submit click handlers
│   └── style.css                   # Leaderboard layouts, forms, and tables
```

---

## 3. Data Schema (`guestbook.json`)

To bootstrap the leaderboard, default scores are defined in `src/data/guestbook.json`.

```json
[
  { "initials": "DEV", "message": "Welcome to Bumbu Arcade! I hope you enjoy your stay.", "score": 99900 },
  { "initials": "BOT", "message": "01001000 01000101 01001100 01001100 01001111", "score": 88000 },
  { "initials": "AAA", "message": "FIRST PLACE IS MINE!", "score": 75000 },
  { "initials": "ZDN", "message": "Bumbu Studio is coming soon! Stay tuned.", "score": 60000 },
  { "initials": "GMR", "message": "Insert coin to continue...", "score": 50000 }
]
```

---

## 4. UI Layout & Event Dispatching

### Scoring Formula
The high score is calculated in Javascript:
`score = (message.length * 100) + Math.floor(Math.random() * 500)`

### Event Synching
- When a user submits an entry from the GUI form or the CLI command `sign`:
  1. Calculate the score.
  2. Load current items from local storage, push the new entry, and save it back.
  3. Dispatch custom event `window.dispatchEvent(new CustomEvent('guestbook-updated'));`.
- The GUI rendering code listens to `guestbook-updated` on the `window` and automatically refreshes the table content.

### Mobile Responsiveness
On desktop, the layout displays side-by-side (flex row). On mobile/tablet screens narrower than `768px`, the layout stacks vertically (column).

---

## 5. CLI Commands Specification

The `<retro-terminal>` element supports:
- `guestbook`: Prints a text representation of the top 10 leaderboard.
- `sign <initials> <message>`: Validates initials (exactly 3 alphanumeric characters) and message (must not be empty), performs submission, and logs confirmation text.
- Tab autocomplete supports `guestbook` and `sign` command keywords.
