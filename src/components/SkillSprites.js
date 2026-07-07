const SPRITES = {
  potion: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges" style="fill: var(--text-green)">
      <rect x="7" y="2" width="2" height="4" fill="#ffffff" />
      <rect x="5" y="6" width="6" height="8" fill="var(--text-green)" />
      <rect x="5" y="6" width="6" height="1" fill="#ffffff" />
      <rect x="4" y="7" width="1" height="6" fill="#ffffff" />
      <rect x="11" y="7" width="1" height="6" fill="#ffffff" />
      <rect x="5" y="13" width="6" height="1" fill="#ffffff" />
    </svg>
  `,
  shield: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges" style="fill: var(--text-cyan)">
      <rect x="3" y="2" width="10" height="2" fill="var(--text-cyan)" />
      <rect x="3" y="4" width="10" height="1" fill="#ffffff" />
      <rect x="2" y="5" width="12" height="4" fill="var(--text-cyan)" />
      <rect x="4" y="9" width="8" height="2" fill="var(--text-cyan)" />
      <rect x="5" y="11" width="6" height="2" fill="var(--text-cyan)" />
      <rect x="7" y="13" width="2" height="2" fill="var(--text-cyan)" />
      <rect x="2" y="5" width="1" height="4" fill="#ffffff" />
      <rect x="13" y="5" width="1" height="4" fill="#ffffff" />
    </svg>
  `,
  sword: `
    <svg viewBox="0 0 16 16" width="32" height="32" shape-rendering="crispEdges" style="fill: var(--text-magenta)">
      <rect x="11" y="2" width="3" height="3" fill="#ffffff" />
      <rect x="9" y="4" width="3" height="3" fill="#ffffff" />
      <rect x="7" y="6" width="3" height="3" fill="#ffffff" />
      <rect x="5" y="8" width="3" height="3" fill="#ffffff" />
      <rect x="3" y="10" width="3" height="3" fill="var(--text-yellow)" />
      <rect x="2" y="12" width="2" height="2" fill="var(--text-magenta)" />
    </svg>
  `
};

export function getSkillSprite(iconType) {
  return SPRITES[iconType] || '';
}
