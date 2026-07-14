export function renderCard(project) {
  if (project.isPlaceholder) {
    return `
      <div class="card card-placeholder card-studio">
        <div class="card-inner">
          <div class="lock-icon">🔒</div>
          <h3>${project.name.toUpperCase()}</h3>
          <p class="blink-fast text-yellow">[ INSERT COIN TO UNLOCK ]</p>
          <p>${project.description}</p>
        </div>
      </div>
    `;
  }

  const actionButton = project.category === '3d' 
    ? `<button class="card-btn btn-3d" data-id="${project.id}">[ VIEW 3D ]</button>`
    : `<a class="card-btn" href="${project.link}" target="_blank" rel="noopener noreferrer">[ GO TO PROJECT ]</a>`;

  const imageHTML = project.image 
    ? `<div class="card-image-wrapper">
         <img src="${project.image}" alt="${project.name}" class="card-image" />
       </div>`
    : '';

  return `
    <div class="card card-${project.category}" id="project-card-${project.id}">
      <div class="card-inner">
        ${imageHTML}
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="card-footer">
          ${actionButton}
        </div>
      </div>
    </div>
  `;
}
