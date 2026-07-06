import './style.css';
import './assets/css/retro-crt.css';
import projects from './data/projects.json';
import { renderCard } from './components/ProjectCard';
import { openModelModal } from './components/ModelModal';

document.addEventListener('DOMContentLoaded', () => {
  const studioGrid = document.getElementById('studio-grid');
  const blenderGrid = document.getElementById('blender-grid');
  const randomGrid = document.getElementById('random-grid');

  projects.forEach(project => {
    const cardHTML = renderCard(project);
    if (project.category === 'studio') {
      studioGrid.innerHTML += cardHTML;
    } else if (project.category === '3d') {
      blenderGrid.innerHTML += cardHTML;
    } else if (project.category === 'random') {
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
