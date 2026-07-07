export async function openModelModal(project) {
  // Dynamically import @google/model-viewer before creating the modal element
  await import('@google/model-viewer');

  // Create modal container element
  const modal = document.createElement('div');
  modal.id = 'model-modal';
  modal.className = 'modal-overlay';

  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2>${project.name.toUpperCase()}</h2>
        <button id="close-modal">[ X ]</button>
      </div>
      <div class="modal-body">
        <div class="viewer-container">
          <model-viewer src="${project.modelSrc}" auto-rotate camera-controls style="width: 100%; height: 350px; background-color: #111; border: 2px solid var(--text-cyan);"></model-viewer>
        </div>
        <div class="viewer-description">
          <p>${project.description}</p>
        </div>
      </div>
    </div>
  `;

  document.body.style.overflow = 'hidden';
  document.body.appendChild(modal);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const closeModal = () => {
    window.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
    modal.remove();
  };

  // Close trigger
  modal.querySelector('#close-modal').addEventListener('click', closeModal);

  // Backdrop click
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', handleKeyDown);
}
