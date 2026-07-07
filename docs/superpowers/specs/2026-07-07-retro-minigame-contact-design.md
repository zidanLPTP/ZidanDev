# Design Specification: Floating Retro Minigame & Contact Panels

This document outlines the architecture, layout, styling, and commands for the Floating Retro Minigame Console (Breakout) and the third sidebar Contact panel in the Arcade Guestbook section.

## 1. Overview

To finalize the Retro Arcade Portfolio cabinet experience, we implement:
- **Floating Minigame Console**: A bottom-left drawer containing an HTML5 Canvas running a pure JS Breakout brick-breaker game. Supports key controls, mobile touch/drag controls, and performance-saving frame loops (stopping layout reflow loops when closed).
- **Contact Panel (Comm Channels)**: Formats GitHub, Instagram, and Email into a glowing retro panel added alongside the Leaderboard and Sign Guestbook blocks.
- **CLI Commands**: CLI support for `play` (opens/starts the game drawer) and `contact` (displays contact info inside ASCII borders).
- **Ponytail Constraints**: Minimal code structure, vanilla JS/CSS variables, zero dependencies, and CPU/performance throttling loops when the game overlay is closed.

---

## 2. Directory Structure

```text
D:\PortofolioWeb\
├── docs/superpowers/specs/
│   ├── 2026-07-06-portfolio-retro-arcade-design.md
│   ├── 2026-07-07-rpg-skills-inventory-design.md
│   ├── 2026-07-07-arcade-guestbook-design.md
│   ├── 2026-07-07-rpg-quest-log-design.md
│   ├── 2026-07-07-rpg-character-select-design.md
│   └── 2026-07-07-retro-minigame-contact-design.md  # This Spec Doc
├── src/
│   ├── components/
│   │   ├── ProjectCard.js
│   │   ├── ModelModal.js
│   │   ├── RetroTerminal.js        # Add play/contact commands
│   │   ├── RetroTerminalHelper.js  # Add autocomplete support for play/contact
│   │   └── RetroGame.js            # New Retro Breakout game logic & loops
│   ├── data/
│   │   ├── projects.json
│   │   ├── skills.json
│   │   ├── guestbook.json
│   │   ├── quests.json
│   │   └── characters.json
│   ├── main.js                     # Instantiate RetroGame, toggle drawer, reorder layout
│   └── style.css                   # Floating game console styles, contact panels styles
```

---

## 3. Minigame Mechanics (`RetroGame.js`)

The minigame is a standard Canvas Brick Breaker:
- **Canvas Size**: 280 width x 180 height.
- **Bricks Grid**: 3 rows of 6 columns. Width: 40px, Height: 10px, Padding: 4px. Offset Top: 20px, Offset Left: 10px.
- **Lives & Scores**: Starts with 3 lives and 0 score. Breaking each brick increases score by 100.
- **Controls & Keyboard Focus**: ArrowLeft/ArrowRight/A/D for keyboard movement. Touchstart/touchmove event triggers on the canvas track horizontal finger positions and set the paddle position directly. When the terminal executes the `play` command, it must call `this.input.blur()` to release keyboard input focus, and call `canvas.focus()` (with `tabindex="0"` on the canvas) to direct all keyboard inputs to the game console.
- **CPU Throttling**: The animation update loop `requestAnimationFrame` runs only while the game drawer is expanded. Closing the drawer executes `cancelAnimationFrame` to freeze CPU execution.
- **Leaderboard Score Integration**: When the game ends (Win or Game Over), the game dispatches a custom window event `'game-finished'` with the final score: `detail: { score }`. The Guestbook GUI form listens to this event, displaying a visual badge `[ 🏆 UNLOCKED GAME SCORE: XXX PTS ]` and setting a hidden score value. When the guestbook form is submitted, it passes this game score to `addGuestbookEntry(initials, message, customScore)` which registers the direct game score on the leaderboard rather than calculating a score based on message length.

---

## 4. UI Layout Restructuring

### index.html Restructure
1. Add `<link rel="icon" type="image/svg+xml" href="/icon.svg">` in `<head>`.
2. Restructure the Arcade Guestbook section to include the third panel `.contact-channels-panel` containing GitHub, Instagram, and Email.
3. Place `#game-toggle` button and `#game-panel` drawer inside the body container. Set `tabindex="0"` on `#game-canvas` so it can receive keyboard focus.

### style.css Restructure
1. Add `.contact-channels-panel` and `.contact-link-item` layout styling.
2. Restructure `.guestbook-layout` to support `display: flex; gap: 20px;` and add screen media queries (`max-width: 992px`) to stack columns vertically.
3. Add floating game drawer sliding animation using CSS transitions.
4. Set `#game-canvas` styling with `image-rendering: pixelated; image-rendering: crisp-edges;` to lock sharp retro borders on high-DPI retina screens.

---

## 5. CLI Commands Specification

The Custom Element `<retro-terminal>` will support:
- `play`: Automatically toggles the game drawer open, starts the canvas rendering loop, blurs terminal input, and focuses the game canvas.
- `contact`: Outputs a formatted ASCII table containing the links to GitHub, Instagram, and Email.
- Autocomplete supports `play` and `contact` commands.
