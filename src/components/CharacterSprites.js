export function getCharacterSprite(id) {
  const spriteMap = {
    developer: `
      <svg viewBox="0 0 16 16" width="100%" height="100%" shape-rendering="crispEdges" style="fill: var(--text-cyan);">
        <!-- CRT Monitor Screen -->
        <rect x="1" y="2" width="14" height="10" />
        <rect x="2" y="3" width="12" height="8" style="fill: #111;" />
        <!-- Code Cursor Pixel -->
        <rect x="4" y="5" width="2" height="4" style="fill: var(--text-green);" />
        <!-- Neck & Base Stand -->
        <rect x="6" y="12" width="4" height="2" />
        <rect x="4" y="14" width="8" height="1" />
      </svg>
    `,
    artist: `
      <svg viewBox="0 0 16 16" width="100%" height="100%" shape-rendering="crispEdges" style="fill: var(--text-yellow);">
        <!-- 3D wireframe cube -->
        <rect x="3" y="3" width="10" height="10" style="fill: transparent; stroke: var(--text-yellow); stroke-width: 1;" />
        <rect x="5" y="5" width="6" height="6" style="fill: transparent; stroke: var(--text-yellow); stroke-dasharray: 2; stroke-width: 1;" />
        <!-- Corner joins -->
        <line x1="3" y1="3" x2="5" y2="5" style="stroke: var(--text-yellow); stroke-width: 1;" />
        <line x1="13" y1="3" x2="11" y2="5" style="stroke: var(--text-yellow); stroke-width: 1;" />
        <line x1="3" y1="13" x2="5" y2="11" style="stroke: var(--text-yellow); stroke-width: 1;" />
        <line x1="13" y1="13" x2="11" y2="11" style="stroke: var(--text-yellow); stroke-width: 1;" />
      </svg>
    `,
    gamer: `
      <svg viewBox="0 0 16 16" width="100%" height="100%" shape-rendering="crispEdges" style="fill: var(--text-magenta);">
        <!-- Game D-Pad controller body -->
        <rect x="2" y="4" width="12" height="8" rx="2" />
        <!-- D-Pad Left/Right -->
        <rect x="4" y="7" width="3" height="2" style="fill: #111;" />
        <rect x="5" y="6" width="1" height="4" style="fill: #111;" />
        <!-- Action Buttons -->
        <circle cx="10.5" cy="8" r="1" style="fill: var(--text-cyan);" />
        <circle cx="12" cy="7" r="1" style="fill: var(--text-cyan);" />
      </svg>
    `
  };
  return spriteMap[id] || '';
}
