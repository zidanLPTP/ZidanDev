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

  const leaderboardBody = document.getElementById('leaderboard-body');
  const guestbookForm = document.getElementById('guestbook-form');

  if (leaderboardBody && guestbookForm) {
    import('./components/GuestbookHelper').then(({ getLeaderboardEntries, addGuestbookEntry }) => {
      const renderLeaderboard = () => {
        leaderboardBody.innerHTML = '';
        const entries = getLeaderboardEntries();
        entries.forEach((entry, idx) => {
          const tr = document.createElement('tr');

          const tdRank = document.createElement('td');
          tdRank.textContent = `${idx + 1}.`;
          tr.appendChild(tdRank);

          const tdInit = document.createElement('td');
          tdInit.textContent = entry.initials;
          tr.appendChild(tdInit);

          const tdScore = document.createElement('td');
          tdScore.textContent = entry.score.toLocaleString();
          tr.appendChild(tdScore);

          const tdMsg = document.createElement('td');
          tdMsg.textContent = entry.message;
          tr.appendChild(tdMsg);

          leaderboardBody.appendChild(tr);
        });
      };

      // Initial render
      renderLeaderboard();

      // Form submission handler
      guestbookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const initialsInput = document.getElementById('gb-initials');
        const messageInput = document.getElementById('gb-message');

        const res = addGuestbookEntry(initialsInput.value, messageInput.value);
        if (res.success) {
          initialsInput.value = '';
          messageInput.value = '';
        } else {
          alert(res.error);
        }
      });

      // Listen to updates
      window.addEventListener('guestbook-updated', renderLeaderboard);
    }).catch(err => console.error("Failed to load GuestbookHelper:", err));
  }

  const questList = document.getElementById('quest-list');
  const questTabs = document.querySelectorAll('.quest-tab-btn');

  if (questList && questTabs.length > 0) {
    import('./data/quests.json').then(({ default: quests }) => {
      const renderQuests = (tabType) => {
        // Step 1: Clean all active expanded states before rendering new tab content
        document.querySelectorAll('.quest-item').forEach(el => el.classList.remove('expanded'));

        questList.innerHTML = '';
        const filtered = quests.filter(q => q.type === tabType);

        filtered.forEach(q => {
          const item = document.createElement('div');
          item.className = 'quest-item';
          
          const checkbox = q.type === 'active' ? '[ ]' : '[x]';

          item.innerHTML = `
            <div class="quest-header">
              <div class="quest-title-row">
                <span class="quest-checkbox">${checkbox}</span>
                <span class="quest-title">${q.title}</span>
              </div>
              <span class="quest-period">${q.period}</span>
            </div>
            <div class="quest-body">
              <div class="quest-guild">GUILD/FACTION: ${q.guild}</div>
              <p>${q.description}</p>
              <div class="quest-rewards">REWARDS: ${q.rewards}</div>
            </div>
          `;

          item.addEventListener('click', () => {
            const isExpanded = item.classList.contains('expanded');
            document.querySelectorAll('.quest-item').forEach(el => el.classList.remove('expanded'));
            if (!isExpanded) {
              item.classList.add('expanded');
            }
          });

          questList.appendChild(item);
        });
      };

      // Initial render
      renderQuests('active');

      // Bind Tab Button Clicks
      questTabs.forEach(btn => {
        btn.addEventListener('click', () => {
          questTabs.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const tab = btn.getAttribute('data-tab');
          renderQuests(tab);
        });
      });
    });
  }
});
