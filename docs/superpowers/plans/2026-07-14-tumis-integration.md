# TUMIS Integration & Git Repositories Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the TUMIS application under Bumbu Studio, register Rust & Tauri skills in the inventory grid, configure Y2K pixelated project card image support, and clean untracked internal folders from Git tracking.

**Tech Stack:** JavaScript, CSS3, JSON, HTML5, Git.

## Global Constraints
- Avoid third-party styling frameworks (no TailwindCSS/Bootstrap). Use pure Vanilla CSS with variables.
- Preserve the existing desktop and mobile layouts exactly as-is.
- Retain existing unit test suites and assert all 43 test suites pass.

---

### Task 1: Copy Image, Register Data & Add SVG Sprites

**Files:**
- Modify: `src/data/projects.json`
- Modify: `src/data/skills.json`
- Modify: `src/components/SkillSprites.js`

**Interfaces:**
- Consumes: `d:\Proyek Coding\PortofolioWeb\Tumis.png`
- Produces: Updated assets, project data, and skills dataset with sprites.

- [ ] **Step 1: Copy Tumis.png to the public folder**

We will copy `d:\Proyek Coding\PortofolioWeb\Tumis.png` to `D:\Proyek Coding\PortofolioWeb\public\Tumis.png` using a local filesystem command.

- [ ] **Step 2: Add TUMIS project to src/data/projects.json**

Add the project entry with `"category": "studio"` and `"image": "/Tumis.png"` at the beginning of [src/data/projects.json](file:///D:/Proyek%20Coding/PortofolioWeb/src/data/projects.json).

- [ ] **Step 3: Add Rust and Tauri to src/data/skills.json**

Add the skills for `rust` and `tauri` to [src/data/skills.json](file:///D:/Proyek%20Coding/PortofolioWeb/src/data/skills.json).

- [ ] **Step 4: Implement Rust and Tauri sprites in src/components/SkillSprites.js**

Add SVG definitions for `rust` and `tauri` keys within the `SPRITES` object in [src/components/SkillSprites.js](file:///D:/Proyek%20Coding/PortofolioWeb/src/components/SkillSprites.js).

---

### Task 2: Implement Project Card Image Rendering & Style Sheet Adjustments

**Files:**
- Modify: `src/components/ProjectCard.js`
- Modify: `src/style.css`
- Modify: `tests/components.test.js`

- [ ] **Step 1: Update ProjectCard.js image rendering logic**

Modify `renderCard` in [src/components/ProjectCard.js](file:///D:/Proyek%20Coding/PortofolioWeb/src/components/ProjectCard.js) to render `<div class="card-image-wrapper"><img src="${project.image}" alt="${project.name}" class="card-image" /></div>` if `project.image` is specified.

- [ ] **Step 2: Add card image CSS classes to src/style.css**

Add styling rules for `.card-image-wrapper` and `.card-image` to [src/style.css](file:///D:/Proyek%20Coding/PortofolioWeb/src/style.css).

- [ ] **Step 3: Update components test suite**

Ensure [tests/components.test.js](file:///D:/Proyek%20Coding/PortofolioWeb/tests/components.test.js) verifies that `renderCard` successfully renders images.

---

### Task 3: Git Cleanup, Verification & Push to GitHub

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Update .gitignore to exclude internal folders and temporary files**

Add `.superpowers/`, `image.png`, and `readme tumis.md` to [.gitignore](file:///D:/Proyek%20Coding/PortofolioWeb/.gitignore).

- [ ] **Step 2: Remove .superpowers/sdd/progress.md from Git cache**

Run `git rm --cached -r .superpowers/` via terminal.

- [ ] **Step 3: Verify all unit tests and builds**

Run `npm run test` and `npm run build`.

- [ ] **Step 4: Commit and push changes to GitHub**

Commit all changes and run `git push origin master`.
