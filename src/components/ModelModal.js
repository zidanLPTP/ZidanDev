import '@google/model-viewer';

export function openModelModal(project) {
  // Create modal container element
  const modal = document.createElement('div');
  modal.id = 'model-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  modal.style.zIndex = '999';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';

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

  document.body.appendChild(modal);

  // Close trigger
  modal.querySelector('#close-modal').addEventListener('click', () => {
    modal.remove();
  });
}
