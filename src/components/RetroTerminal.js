import projects from '../data/projects.json';
import skills from '../data/skills.json';
import quests from '../data/quests.json';
import characters from '../data/characters.json';
import { getAutocompleteMatch } from './RetroTerminalHelper';
import { getLeaderboardEntries, addGuestbookEntry } from './GuestbookHelper';

class RetroTerminal extends HTMLElement {
  connectedCallback() {
    this.commands = ['help', 'projects', 'project', 'use', 'inspect', 'inventory', 'guestbook', 'sign', 'quests', 'guilds', 'status', 'select', 'play', 'contact', 'clear', 'about', 'socials', 'reset-guestbook'];
    this.projectIds = projects.map(p => p.id);
    this.skillIds = skills.map(s => s.id);
    this.activeCharId = 'developer';
    this.history = [];
    this.historyIndex = -1;
    this.cycleIndex = 0;
    this.lastTabInput = '';

    this.innerHTML = `
      <div id="cli-panel" class="closed">
        <div id="cli-output"></div>
        <div id="cli-input-line">
          <span class="prompt">visitor@bumbustudio:~$</span>
          <input type="text" id="cli-input" autofocus autocomplete="off" spellcheck="false" />
        </div>
      </div>
      <button id="cli-toggle" aria-label="Toggle Terminal">[ >_ CLI_MODE ]</button>
    `;

    this.panel = this.querySelector('#cli-panel');
    this.output = this.querySelector('#cli-output');
    this.input = this.querySelector('#cli-input');
    this.toggleBtn = this.querySelector('#cli-toggle');

    this.toggleBtn.addEventListener('click', () => this.toggle());
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Desktop Backtick Listener
    this._boundBacktickHandler = (e) => {
      if (e.key === '`') {
        e.preventDefault();
        this.toggle();
      }
    };
    window.addEventListener('keydown', this._boundBacktickHandler);

    this._boundCharHandler = (e) => {
      if (e.detail && e.detail.id) {
        this.activeCharId = e.detail.id;
      }
    };
    window.addEventListener('character-changed', this._boundCharHandler);

    this.writeLine("Selamat datang di Sistem CLI Bumbu Arcade. Ketik 'help' untuk daftar perintah.");
  }


  disconnectedCallback() {
    window.removeEventListener('keydown', this._boundBacktickHandler);
    window.removeEventListener('character-changed', this._boundCharHandler);
  }

  toggle() {
    const gamePanel = document.getElementById('game-panel');
    const isGameOpen = gamePanel && gamePanel.style.transform === 'translate(-50%, -50%)';
    if (isGameOpen) return;

    this.panel.classList.toggle('closed');
    const isOpen = !this.panel.classList.contains('closed');
    
    const gameToggle = document.getElementById('game-toggle');
    if (gameToggle) {
      if (isOpen) {
        gameToggle.style.pointerEvents = 'none';
        gameToggle.style.opacity = '0.3';
      } else {
        gameToggle.style.pointerEvents = 'auto';
        gameToggle.style.opacity = '1';
      }
    }

    if (isOpen) {
      setTimeout(() => this.input.focus(), 50);
    }
  }

  writeLine(text, className = '') {
    const line = document.createElement('div');
    line.className = className;
    line.textContent = text;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  handleKeydown(e) {
    if (e.key === 'Enter') {
      const value = this.input.value.trim();
      this.input.value = '';
      this.cycleIndex = 0;
      this.lastTabInput = '';
      if (!value) return;
      
      this.history.push(value);
      this.historyIndex = this.history.length;
      
      this.writeLine(`visitor@bumbustudio:~$ ${value}`);
      this.executeCommand(value);
    } 
    else if (e.key === 'Tab') {
      e.preventDefault();
      const value = this.input.value;
      if (!value) return;

      if (this.lastTabInput === '') {
        this.lastTabInput = value;
        this.cycleIndex = 0;
      } else {
        this.cycleIndex++;
      }

      const matchInfo = getAutocompleteMatch(this.lastTabInput, this.cycleIndex, this.commands, this.projectIds, this.skillIds);
      if (matchInfo) {
        this.input.value = matchInfo.completed;
        if (matchInfo.list.length > 1 && this.cycleIndex === 0) {
          this.writeLine(`Matches: ${matchInfo.list.join(', ')}`);
        }
      }
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.lastTabInput = '';
      this.cycleIndex = 0;
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.lastTabInput = '';
      this.cycleIndex = 0;
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    }
    else {
      this.lastTabInput = '';
      this.cycleIndex = 0;
    }
  }

  executeCommand(cmdStr) {
    const parts = cmdStr.split(/\s+/);
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (command) {
      case 'help':
        this.writeLine("Daftar perintah yang tersedia:");
        this.writeLine("  help               - Menampilkan panduan instruksi");
        this.writeLine("  projects           - Menampilkan daftar proyek");
        this.writeLine("  project <id>       - Menampilkan detail informasi proyek");
        this.writeLine("  use <id>           - Membuka tautan proyek di browser");
        this.writeLine("  inspect <item-id>  - Memeriksa detail item keahlian");
        this.writeLine("  inventory          - Menampilkan item inventaris keahlian");
        this.writeLine("  quests             - Menampilkan misi aktif dan selesai");
        this.writeLine("  guilds             - Menampilkan faksi guild aktif dan hadiah");
        this.writeLine("  guestbook          - Menampilkan papan skor buku tamu");
        this.writeLine("  sign <init> <msg>  - Mengisi buku tamu dan mendapatkan poin arkade");
        this.writeLine("  about              - Memuat biografi profil pengembang");
        this.writeLine("  status             - Menampilkan statistik karakter RPG saat ini");
        this.writeLine("  select <class-id>  - Memilih kelas karakter");
        this.writeLine("  play               - Memulai konsol game kabinet retro");
        this.writeLine("  contact            - Menampilkan saluran komunikasi pengembang");
        this.writeLine("  socials            - Tautan saluran sosial media aktif");
        this.writeLine("  clear              - Membersihkan panel CLI");
        this.writeLine("  reset-guestbook    - Mereset database lokal buku tamu");
        break;

      case 'inventory':
        this.writeLine("--- ITEM INVENTARIS RPG ---");
        skills.forEach(s => this.writeLine(` - ${s.id} : ${s.name}`));
        break;

      case 'inspect':
        if (!arg) {
          this.writeLine("Penggunaan: inspect <item-id>");
          break;
        }
        const skill = skills.find(s => s.id === arg.toLowerCase());
        if (skill) {
          this.writeLine("================================================");
          this.writeLine(`ITEM   : ${skill.name}`);
          this.writeLine(`TIPE   : ${skill.type}`);
          this.writeLine(`STAT   : ${skill.stats}`);
          this.writeLine("------------------------------------------------");
          this.writeLine(skill.description);
          this.writeLine("================================================");
        } else {
          this.writeLine(`Item '${arg}' tidak ditemukan di inventaris.`);
        }
        break;

      case 'projects':
        const categories = { studio: 'BUMBU STUDIO (GAMES & APPS)', '3d': 'SENI 3D BLENDER', random: 'PROYEK LAINNYA' };
        for (const [cat, label] of Object.entries(categories)) {
          this.writeLine(`--- ${label} ---`);
          projects.filter(p => p.category === cat).forEach(p => this.writeLine(` - ${p.id} : ${p.name}`));
        }
        break;

      case 'project':
        if (!arg) {
          this.writeLine("Penggunaan: project <project-id>");
          break;
        }
        const proj = projects.find(p => p.id === arg);
        if (proj) {
          this.writeLine(`Nama: ${proj.name}`);
          this.writeLine(`Kategori: ${proj.category.toUpperCase()}`);
          this.writeLine(`Deskripsi: ${proj.description}`);
          if (proj.link && proj.link !== '#') this.writeLine(`Tautan: ${proj.link}`);
        } else {
          this.writeLine(`Proyek '${arg}' tidak ditemukan.`);
        }
        break;

      case 'use':
        if (!arg) {
          this.writeLine("Penggunaan: use <project-id>");
          break;
        }
        const useProj = projects.find(p => p.id === arg);
        if (useProj) {
          if (useProj.link && useProj.link !== '#') {
            this.writeLine(`Mengalihkan ke: ${useProj.link}...`);
            window.open(useProj.link, '_blank', 'noopener,noreferrer');
          } else {
            this.writeLine(`Proyek '${arg}' tidak memiliki tautan pengalihan. (Segera Hadir)`);
          }
        } else {
          this.writeLine(`Proyek '${arg}' tidak ditemukan.`);
        }
        break;

      case 'about':
        this.writeLine("MEMULAI BIOGRAFI PENGEMBANG...");
        this.writeLine("Pengembang: Penggemar Game & Pemrogram Kreatif");
        this.writeLine("Seni Blender: Spesialisasi dalam model mesh low-poly retro");
        this.writeLine("Keahlian Utama: Javascript, WebDev, & Visual Interaktif");
        break;

      case 'socials':
        this.writeLine("GitHub    : https://github.com/zidanLPTP");
        this.writeLine("Instagram : https://instagram.com/zidan.lptp");
        break;

      case 'quests':
        this.writeLine("--- MISI AKTIF ---");
        quests.filter(q => q.type === 'active').forEach(q => {
          this.writeLine(` [ ] ${q.id.padEnd(14)} : ${q.title} (${q.guild}) [${q.period}]`);
        });
        this.writeLine("");
        this.writeLine("--- MISI SELESAI ---");
        quests.filter(q => q.type === 'completed').forEach(q => {
          this.writeLine(` [x] ${q.id.padEnd(14)} : ${q.title} (${q.guild}) [${q.period}]`);
        });
        break;

      case 'guilds':
        const activeGuilds = quests.filter(q => q.category === 'guild' && q.type === 'active');
        if (activeGuilds.length === 0) {
          this.writeLine("Semua Guild Factions telah diselesaikan. Ketik 'quests' untuk melihat riwayat kejayaan masa lalu.");
          break;
        }
        this.writeLine("--- GUILD & FAKSI AKTIF ---");
        activeGuilds.forEach(g => {
          this.writeLine(`* ${g.guild}`);
          this.writeLine(`  Peran : ${g.title}`);
          this.writeLine(`  Waktu : ${g.period}`);
          this.writeLine(`  Hadiah: ${g.rewards}`);
          this.writeLine("");
        });
        break;

      case 'guestbook':
        this.writeLine("============================================================");
        this.writeLine("PERINGKAT  INISIAL  SKOR   PESAN");
        this.writeLine("============================================================");
        const entries = getLeaderboardEntries();
        entries.forEach((e, idx) => {
          const rnkStr = `${idx + 1}.`.padEnd(11);
          const initStr = e.initials.padEnd(8);
          const scoreStr = e.score.toString().padEnd(7);
          this.writeLine(`${rnkStr}${initStr}${scoreStr}${e.message}`);
        });
        this.writeLine("============================================================");
        break;

      case 'sign':
        const signParts = cmdStr.trim().split(/\s+/);
        if (signParts.length < 3) {
          this.writeLine("Penggunaan: sign <inisial> <pesan>");
          break;
        }
        const initials = signParts[1];
        const commandIndex = cmdStr.indexOf(signParts[0]);
        const initIndex = cmdStr.indexOf(initials, commandIndex + signParts[0].length);
        const message = cmdStr.substring(initIndex + initials.length).trim();

        this.writeLine("MEMASUKKAN KOIN... SUKSES!");
        const res = addGuestbookEntry(initials, message);
        if (res.success) {
          this.writeLine("MENYIMPAN TANDA TANGAN... SUKSES!");
          this.writeLine(`SKOR ANDA: ${res.entry.score} PTS`);
          
          const updated = getLeaderboardEntries();
          const newRank = updated.findIndex(e => e.initials === res.entry.initials && e.score === res.entry.score);
          if (newRank !== -1) {
            this.writeLine(`SELAMAT! ANDA MENEMPATI PERINGKAT #${newRank + 1} DI LEADERBOARD!`);
          } else {
            this.writeLine("Skor Anda belum masuk 10 besar leaderboard. Coba pesan yang lebih panjang lain kali!");
          }
        } else {
          this.writeLine(`ERROR: ${res.error}`);
        }
        break;

      case 'status':
        const char = characters.find(c => c.id === this.activeCharId);
        this.writeLine("============================================================");
        this.writeLine(`STATUS KARAKTER: ${char.name}`);
        this.writeLine("============================================================");
        
        Object.entries(char.stats).forEach(([stat, val]) => {
          const blocksCount = Math.round(val / 10);
          const fillBlocks = "█".repeat(blocksCount);
          const emptyBlocks = "░".repeat(10 - blocksCount);
          this.writeLine(`${stat.padEnd(4)}: [${fillBlocks}${emptyBlocks}] ${val}%`);
        });
        
        this.writeLine("============================================================");
        const wrapLimit = 50;
        const words = char.description.split(/\s+/);
        let currentLine = '';
        words.forEach(w => {
          if ((currentLine + w).length > wrapLimit) {
            this.writeLine(`BIO : ${currentLine.trim()}`);
            currentLine = w + ' ';
          } else {
            currentLine += w + ' ';
          }
        });
        if (currentLine) {
          this.writeLine(`BIO : ${currentLine.trim()}`);
        }
        this.writeLine("============================================================");
        break;

      case 'select':
        const targetClass = parts[1];
        if (!targetClass) {
          this.writeLine("Penggunaan: select <developer|artist|gamer>");
          break;
        }
        const matched = characters.find(c => c.id === targetClass.toLowerCase());
        if (!matched) {
          this.writeLine(`ERROR: Kelas '${targetClass}' tidak ditemukan.`);
          break;
        }
        this.activeCharId = matched.id;
        this.writeLine(`MEMILIH KELAS: ${matched.name}... SUKSES!`);
        
        window.dispatchEvent(new CustomEvent('character-changed', {
          detail: { id: matched.id }
        }));
        break;

      case 'play':
        this.writeLine("MEMULAI KONSOL GAME KABINET RETRO... SUKSES!");
        if (this.input) this.input.blur();
        window.dispatchEvent(new CustomEvent('play-triggered'));
        break;

      case 'contact':
        this.writeLine("============================================================");
        this.writeLine("BUMBU ARCADE - SALURAN KOMUNIKASI");
        this.writeLine("============================================================");
        this.writeLine("GITHUB    : https://github.com/zidanLPTP");
        this.writeLine("INSTAGRAM : https://instagram.com/zidan.lptp");
        this.writeLine("EMAIL     : zidan@example.com");
        this.writeLine("============================================================");
        break;

      case 'reset-guestbook':
        try {
          localStorage.removeItem('guestbook_entries');
          this.writeLine("Arcade Guestbook local database reset... SUCCESS!");
          window.dispatchEvent(new CustomEvent('guestbook-updated'));
        } catch (e) {
          this.writeLine("ERROR: Failed to reset database.");
        }
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      default:
        this.writeLine(`Perintah tidak dikenal: '${command}'. Ketik 'help' untuk bantuan.`);
    }
  }
}

customElements.define('retro-terminal', RetroTerminal);
export { RetroTerminal };
