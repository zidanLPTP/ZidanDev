const SPRITES = {
  js: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <rect x="1" y="1" width="14" height="14" fill="#f7df1e" />
      <text x="3" y="11" font-family="'Press Start 2P', monospace" font-size="7px" fill="#000000" font-weight="bold">JS</text>
    </svg>
  `,
  python: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <rect x="3" y="2" width="6" height="4" fill="#306998" />
      <rect x="5" y="6" width="4" height="2" fill="#306998" />
      <rect x="4" y="3" width="1" height="1" fill="#ffffff" />
      <rect x="7" y="10" width="6" height="4" fill="#ffd43b" />
      <rect x="7" y="8" width="4" height="2" fill="#ffd43b" />
      <rect x="11" y="12" width="1" height="1" fill="#ffffff" />
    </svg>
  `,
  php: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <rect x="1" y="3" width="14" height="10" fill="#777bb4" rx="2" />
      <text x="2" y="10" font-family="'Press Start 2P', monospace" font-size="5px" fill="#ffffff">PHP</text>
    </svg>
  `,
  laravel: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <rect x="2" y="2" width="12" height="12" fill="none" stroke="#ff2d20" stroke-width="2" />
      <rect x="5" y="5" width="6" height="6" fill="#ff2d20" />
      <rect x="7" y="7" width="2" height="2" fill="#ffffff" />
    </svg>
  `,
  blender: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <rect x="4" y="4" width="8" height="8" fill="#ea7625" />
      <rect x="6" y="6" width="4" height="4" fill="#ffffff" />
      <rect x="7" y="1" width="2" height="3" fill="#ea7625" />
      <rect x="11" y="2" width="3" height="2" fill="#ea7625" />
      <rect x="12" y="6" width="3" height="2" fill="#ea7625" />
    </svg>
  `,
  java: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <rect x="3" y="7" width="8" height="6" fill="#5382a1" />
      <rect x="11" y="8" width="2" height="4" fill="none" stroke="#5382a1" stroke-width="2" />
      <rect x="5" y="2" width="1" height="4" fill="#ff2d20" />
      <rect x="8" y="2" width="1" height="4" fill="#ff2d20" />
    </svg>
  `
};

export function getSkillSprite(iconType) {
  return SPRITES[iconType] || '';
}
