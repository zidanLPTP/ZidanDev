const SPRITES = {
  js: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <rect x="1" y="1" width="14" height="14" fill="#f7df1e" />
      <text x="3" y="11" font-family="'Press Start 2P', monospace" font-size="7px" fill="#000000" font-weight="bold">JS</text>
    </svg>
  `,
  html: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <path d="M2,2 h12 l-2,10 l-4,2 l-4,-2 z" fill="#e34f26" />
      <path d="M8,2 v12 l4,-1.5 l1.5,-8.5 z" fill="#f06529" />
      <text x="4" y="9" font-family="'Press Start 2P', monospace" font-size="5px" fill="#ffffff">&lt;&gt;</text>
    </svg>
  `,
  css: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <path d="M2,2 h12 l-2,10 l-4,2 l-4,-2 z" fill="#1572b6" />
      <path d="M8,2 v12 l4,-1.5 l1.5,-8.5 z" fill="#33a9dc" />
      <text x="5" y="10" font-family="'Press Start 2P', monospace" font-size="6px" fill="#ffffff">#</text>
    </svg>
  `,
  python: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <!-- Blue Snake -->
      <path d="M3,2 h5 v3 h-3 v3 h-2 v-3 h-1 v-2 h2 z" fill="#3776ab" />
      <rect x="4" y="3" width="1" height="1" fill="#ffffff" />
      <!-- Yellow Snake -->
      <path d="M8,8 h3 v-3 h2 v3 h-1 v2 h-4 v-2 z" fill="#ffd343" />
      <rect x="11" y="9" width="1" height="1" fill="#ffffff" />
      <!-- Intersecting parts -->
      <rect x="6" y="5" width="2" height="3" fill="#3776ab" />
      <rect x="8" y="5" width="2" height="3" fill="#ffd343" />
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
      <!-- Outer red background badge -->
      <path d="M1,4 L8,1 L15,4 L15,12 L8,15 L1,12 Z" fill="#ff2d20" />
      <!-- Inner geometric L shape -->
      <path d="M5,5 L11,5 L11,8 L8,8 L8,11 L5,11 Z" fill="#ffffff" />
      <rect x="7" y="7" width="2" height="2" fill="#ff2d20" />
    </svg>
  `,
  dart: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <path d="M8,1 L14,4 L14,12 L8,15 L2,12 L2,4 Z" fill="#00b4ab" />
      <path d="M8,1 L14,4 L14,12 L8,15 Z" fill="#00d2c4" />
      <path d="M8,4 L11,6 L11,10 L8,12 L5,10 L5,6 Z" fill="#ffffff" />
    </svg>
  `,
  flutter: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <path d="M9,2 L14,7 L11,10 L6,5 Z" fill="#02569b" />
      <path d="M5,9 L9,13 L14,13 L8,7 Z" fill="#0175c2" />
      <path d="M10,11 L12,13 L14,13 L11,10 Z" fill="#13b9fd" />
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
  `,
  sql: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <rect x="1" y="2" width="14" height="12" fill="#0078d4" rx="1" />
      <text x="3" y="10" font-family="'Press Start 2P', monospace" font-size="5px" fill="#ffffff">SQL</text>
    </svg>
  `,
  rust: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <rect x="2" y="2" width="12" height="12" fill="#ce412b" rx="2" />
      <text x="4" y="11" font-family="'Press Start 2P', monospace" font-size="7px" fill="#ffffff">R</text>
    </svg>
  `,
  tauri: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges">
      <path d="M2,2 L8,0 L14,2 L14,10 L8,15 L2,10 Z" fill="#24c8db" />
      <text x="3" y="10" font-family="'Press Start 2P', monospace" font-size="5px" fill="#ffffff">TR</text>
    </svg>
  `
};



export function getSkillSprite(iconType) {
  return SPRITES[iconType] || '';
}
