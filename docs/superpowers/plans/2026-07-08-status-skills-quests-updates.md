# Characters, Skills and Quests Data Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update stats/descriptions in characters data, add SQL to skills inventory, and update completed/active quests in the quest log.

**Architecture:** Modify static JSON data files (`src/data/characters.json`, `src/data/skills.json`, `src/data/quests.json`) and update the SVG icon library `src/components/SkillSprites.js` for SQL representation. Run tests and verify build.

**Tech Stack:** JSON, HTML5, CSS3, ES Modules, Vitest.

## Global Constraints
- Avoid third-party styling frameworks (no TailwindCSS/Bootstrap). Use pure Vanilla CSS with variables.
- Naming and structure follows Indonesian translation rules established.
- Retain existing unit test suites and assert all 38 test suites pass.

---

### Task 1: Update Characters, Skills and Quests Data

**Files:**
- Modify: `src/data/characters.json`
- Modify: `src/data/skills.json`
- Modify: `src/data/quests.json`
- Modify: `src/components/SkillSprites.js`
- Test: `tests/data.test.js`

**Interfaces:**
- Consumes: None
- Produces: Updated characters, skills, and quests datasets

- [ ] **Step 1: Write failing data assertions in tests/data.test.js**

We will update [tests/data.test.js](file:///D:/PortofolioWeb/tests/data.test.js) to check that the newly added SQL skill exists and that the active quests correctly contain the new university and IEEE roles.
```javascript
import { expect, test } from 'vitest';
import characters from '../src/data/characters.json';
import skills from '../src/data/skills.json';
import quests from '../src/data/quests.json';

test('characters data has correct adjusted stats', () => {
  const developer = characters.find(c => c.id === 'developer');
  expect(developer.stats.INT).toBe(72);
  expect(developer.stats.HP).toBe(65);

  const gamer = characters.find(c => c.id === 'gamer');
  expect(gamer.stats.MP).toBe(20);
});

test('sql skill is present in skills data', () => {
  const sql = skills.find(s => s.id === 'sql');
  expect(sql).toBeDefined();
  expect(sql.type).toBe('Database');
});

test('quests data contains active and completed missions correctly', () => {
  const ieee = quests.find(q => q.id === 'ieee-webmaster');
  expect(ieee).toBeDefined();
  expect(ieee.type).toBe('active');

  const school = quests.find(q => q.id === 'school-grad');
  expect(school).toBeDefined();
  expect(school.type).toBe('completed');
  expect(school.guild).toBe('SMA Negeri 2 Sawahlunto');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test`
Expected: Failure on new assertions.

- [ ] **Step 3: Update src/data/characters.json**

Overwrite `src/data/characters.json` with the following content:
```json
[
  {
    "id": "developer",
    "name": "SOFTWARE DEVELOPER",
    "description": "Menguasai JavaScript dan Python untuk membangun aplikasi web yang cepat, interaktif, serta skrip otomatisasi/scraping data dinamis.",
    "stats": {
      "HP": 65,
      "MP": 70,
      "INT": 72,
      "STR": 50,
      "AGI": 68
    }
  },
  {
    "id": "artist",
    "name": "3D ARTIST",
    "description": "Fokus pada pembuatan pemodelan bangunan 3D bergaya low-to-mid poly dengan detail struktural murni tanpa shader kompleks.",
    "stats": {
      "HP": 45,
      "MP": 30,
      "INT": 40,
      "STR": 35,
      "AGI": 45
    }
  },
  {
    "id": "gamer",
    "name": "HARDCORE GAMER",
    "description": "Menggemari game retro klasik dan mulai mempelajari dasar-dasar pengembangan game menggunakan game engine Godot.",
    "stats": {
      "HP": 55,
      "MP": 20,
      "INT": 40,
      "STR": 30,
      "AGI": 50
    }
  }
]
```

- [ ] **Step 4: Update src/data/skills.json**

Append the SQL item to the list in `src/data/skills.json`:
```json
  {
    "id": "sql",
    "name": "SQL",
    "iconType": "sql",
    "type": "Database",
    "stats": "INT +50, DEX +42",
    "description": "Menguasai dasar-dasar query SQL (SELECT, INSERT, JOIN) untuk pengelolaan database relasional."
  }
```

- [ ] **Step 5: Update src/components/SkillSprites.js**

Add the SQL SVG icon to `SPRITES` in `src/components/SkillSprites.js`:
```javascript
  sql: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <rect x="1" y="2" width="14" height="12" fill="#0078d4" rx="1" />
      <text x="3" y="10" font-family="'Press Start 2P', monospace" font-size="5px" fill="#ffffff">SQL</text>
    </svg>
  `,
```

- [ ] **Step 6: Update src/data/quests.json**

Replace the entire content of `src/data/quests.json` with the updated list:
```json
[
  {
    "id": "unri-student",
    "title": "Mahasiswa Teknik Informatika (Semester 5)",
    "guild": "Universitas Riau",
    "period": "2024 - Sekarang",
    "type": "active",
    "category": "education",
    "rewards": "EXP +800, Programming Logic +5",
    "description": "Menempuh pendidikan tinggi program studi Teknik Informatika di UNRI, fokus pada pengembangan perangkat lunak dan sistem informasi."
  },
  {
    "id": "ieee-webmaster",
    "title": "Web Master IEEE SB UNRI",
    "guild": "IEEE Student Branch UNRI",
    "period": "2025 - Sekarang",
    "type": "active",
    "category": "guild",
    "rewards": "EXP +500, Web Skill +4, Network +5",
    "description": "Mengelola situs web dan infrastruktur digital IEEE Student Branch UNRI sejak awal kepengurusan tanggal 22 Desember 2025."
  },
  {
    "id": "kse-divisi",
    "title": "Anggota Divisi Pendidikan & Pelatihan",
    "guild": "KSE UNRI",
    "period": "2025 - 2026",
    "type": "active",
    "category": "guild",
    "rewards": "EXP +400, Teaching Skill +3, Public Speaking +2",
    "description": "Berkontribusi dalam divisi Pendidikan dan Pelatihan KSE UNRI untuk merancang program edukasi bagi mahasiswa."
  },
  {
    "id": "erc-researcher",
    "title": "Anggota Department Research",
    "guild": "ERC UNRI",
    "period": "2026 - Sekarang",
    "type": "active",
    "category": "guild",
    "rewards": "EXP +450, Research Skill +4, Python +3",
    "description": "Bergabung dalam Department Research ERC UNRI untuk melakukan riset teknologi terbaru dan analisis data."
  },
  {
    "id": "school-grad",
    "title": "Lulusan SMA",
    "guild": "SMA Negeri 2 Sawahlunto",
    "period": "2021 - 2024",
    "type": "completed",
    "category": "education",
    "rewards": "EXP +1000, Title: Graduate",
    "description": "Menyelesaikan pendidikan tingkat menengah atas di SMA Negeri 2 Sawahlunto."
  }
]
```

- [ ] **Step 7: Run tests to verify all pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 8: Run build check**

Run: `npm run build`
Expected: Build is successful.

- [ ] **Step 9: Commit changes locally**

Run:
```bash
git add src/data/characters.json src/data/skills.json src/data/quests.json src/components/SkillSprites.js tests/data.test.js
git commit -m "feat: update characters stats, add SQL to skills inventory, and update quests log with UNRI, IEEE, ERC, and KSE entries"
```
