import projects from '../data/projects.json';
import skills from '../data/skills.json';
import { getAutocompleteMatch } from './RetroTerminalHelper';

class RetroTerminal extends HTMLElement {
  connectedCallback() {
    this.commands = ['help', 'projects', 'project', 'use', 'inspect', 'inventory', 'clear', 'about', 'socials'];
    this.projectIds = projects.map(p => p.id);
    this.skillIds = skills.map(s => s.id);
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

    this.writeLine("Welcome to Bumbu Arcade CLI System. Type 'help' for command list.");
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this._boundBacktickHandler);
  }

  toggle() {
    this.panel.classList.toggle('closed');
    if (!this.panel.classList.contains('closed')) {
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
        this.writeLine("Available commands:");
        this.writeLine("  help               - Show instruction guidelines");
        this.writeLine("  projects           - Display project lists");
        this.writeLine("  project <id>       - Show project detail information");
        this.writeLine("  use <id>           - Securely open target project link in browser");
        this.writeLine("  inspect <item-id>  - Inspect details of a skill item");
        this.writeLine("  inventory          - Show inventory skills items");
        this.writeLine("  about              - Boot up developer profile biography");
        this.writeLine("  socials            - Clickable social channels listings");
        this.writeLine("  clear              - Wipe CLI panel clear");
        break;

      case 'inventory':
        this.writeLine("--- RPG INVENTORY ITEMS ---");
        skills.forEach(s => this.writeLine(` - ${s.id} : ${s.name}`));
        break;

      case 'inspect':
        if (!arg) {
          this.writeLine("Usage: inspect <item-id>");
          break;
        }
        const skill = skills.find(s => s.id === arg.toLowerCase());
        if (skill) {
          this.writeLine("================================================");
          this.writeLine(`ITEM   : ${skill.name}`);
          this.writeLine(`TYPE   : ${skill.type} | RARITY: ${skill.rarity}`);
          this.writeLine(`STATS  : ${skill.stats}`);
          this.writeLine("------------------------------------------------");
          this.writeLine(skill.description);
          this.writeLine("================================================");
        } else {
          this.writeLine(`Item '${arg}' not found in inventory.`);
        }
        break;

      case 'projects':
        const categories = { studio: 'BUMBU STUDIO (GAMES & APPS)', '3d': '3D BLENDER ART', random: 'RANDOM PROJECTS' };
        for (const [cat, label] of Object.entries(categories)) {
          this.writeLine(`--- ${label} ---`);
          projects.filter(p => p.category === cat).forEach(p => this.writeLine(` - ${p.id} : ${p.name}`));
        }
        break;

      case 'project':
        if (!arg) {
          this.writeLine("Usage: project <project-id>");
          break;
        }
        const proj = projects.find(p => p.id === arg);
        if (proj) {
          this.writeLine(`Name: ${proj.name}`);
          this.writeLine(`Category: ${proj.category.toUpperCase()}`);
          this.writeLine(`Description: ${proj.description}`);
          if (proj.link && proj.link !== '#') this.writeLine(`Link: ${proj.link}`);
        } else {
          this.writeLine(`Project '${arg}' not found.`);
        }
        break;

      case 'use':
        if (!arg) {
          this.writeLine("Usage: use <project-id>");
          break;
        }
        const useProj = projects.find(p => p.id === arg);
        if (useProj) {
          if (useProj.link && useProj.link !== '#') {
            this.writeLine(`Redirecting to: ${useProj.link}...`);
            window.open(useProj.link, '_blank', 'noopener,noreferrer');
          } else {
            this.writeLine(`Project '${arg}' does not have a redirect link. (Coming Soon)`);
          }
        } else {
          this.writeLine(`Project '${arg}' not found.`);
        }
        break;

      case 'about':
        this.writeLine("BOOTING DEVELOPER BIO...");
        this.writeLine("Dev: Game Enthusiast & Creative Coder");
        this.writeLine("Blender Art: Specialized in Retro & Low-poly mesh models");
        this.writeLine("Core Stack: Javascript, WebDev, & Interactive Visuals");
        break;

      case 'socials':
        this.writeLine("GitHub: https://github.com/your-username");
        this.writeLine("Itch.io: https://your-profile.itch.io");
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      default:
        this.writeLine(`Command not recognized: '${command}'. Type 'help' for options.`);
    }
  }
}

customElements.define('retro-terminal', RetroTerminal);
export { RetroTerminal };
