import './style.css';
import './assets/css/retro-crt.css';
import projects from './data/projects.json';
import skills from './data/skills.json';
import { renderCard } from './components/ProjectCard';
import { openModelModal } from './components/ModelModal';
import { getSkillSprite } from './components/SkillSprites';
import './components/RetroTerminal';

document.addEventListener('DOMContentLoaded', () => {
  // Instantiate and append the Retro Terminal custom element
  const terminal = document.createElement('retro-terminal');
  document.body.appendChild(terminal);

  const studioGrid = document.getElementById('studio-grid');
  const blenderGrid = document.getElementById('blender-grid');
  const randomGrid = document.getElementById('random-grid');

  projects.forEach(project => {
    const cardHTML = renderCard(project);
    if (project.category === 'studio' && studioGrid) {
      studioGrid.innerHTML += cardHTML;
    } else if (project.category === '3d' && blenderGrid) {
      blenderGrid.innerHTML += cardHTML;
    } else if (project.category === 'random' && randomGrid) {
      randomGrid.innerHTML += cardHTML;
    }
  });

  // Event listener delegation for 3D buttons
  document.body.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-3d')) {
      const projId = e.target.getAttribute('data-id');
      const project = projects.find(p => p.id === projId);
      if (project) {
        await openModelModal(project);
      }
    }
  });

  const inventoryGrid = document.getElementById('inventory-grid');
  const inventoryDetails = document.getElementById('inventory-details');

  if (inventoryGrid && inventoryDetails) {
    // Create 16 slots
    for (let i = 0; i < 16; i++) {
      const slot = document.createElement('div');
      const skill = skills[i];

      if (skill) {
        slot.className = 'inventory-slot';
        slot.dataset.id = skill.id;
        slot.innerHTML = getSkillSprite(skill.iconType);

        slot.addEventListener('click', () => {
          // Toggle active class
          document.querySelectorAll('.inventory-slot').forEach(s => s.classList.remove('active'));
          slot.classList.add('active');

          // Update details panel
          inventoryDetails.innerHTML = `
            <div class="details-header">
              <h3 style="color: var(--text-yellow); font-family: var(--font-title); font-size: 1.1rem; margin-bottom: 5px;">${skill.name.toUpperCase()}</h3>
              <div class="details-row">
                <span>TYPE: ${skill.type}</span>
                <span style="color: var(--text-magenta)">${skill.rarity}</span>
              </div>
              <div class="details-row">
                <span style="color: var(--text-green)">STATS: ${skill.stats}</span>
              </div>
            </div>
            <p style="font-size: 1.25rem;">${skill.description}</p>
          `;
        });
      } else {
        slot.className = 'inventory-slot inventory-slot-empty';
        slot.textContent = '.';
        slot.addEventListener('click', () => {
          document.querySelectorAll('.inventory-slot').forEach(s => s.classList.remove('active'));
          slot.classList.add('active');
          inventoryDetails.innerHTML = `
            <p class="blink-fast text-yellow" style="text-align: center; margin-top: 50px;">[ EMPTY SLOT. Complete new quests to unlock new skills! ]</p>
          `;
        });
      }
      inventoryGrid.appendChild(slot);
    }
  }
});
