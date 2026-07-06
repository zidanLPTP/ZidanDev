import './style.css';
import './assets/css/retro-crt.css';
import projects from './data/projects.json';
import { renderCard } from './components/ProjectCard';
import { openModelModal } from './components/ModelModal';
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
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-3d')) {
      const projId = e.target.getAttribute('data-id');
      const project = projects.find(p => p.id === projId);
      if (project) {
        openModelModal(project);
      }
    }
  });
});
