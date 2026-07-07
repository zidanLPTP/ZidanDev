import { expect, test } from 'vitest';
import { getAutocompleteMatch } from '../src/components/RetroTerminalHelper';

test('routes autocomplete targets based on preceding command', () => {
  const commands = ['help', 'projects', 'project', 'use', 'inspect', 'inventory'];
  const projectIds = ['robot-mech', 'weather-cli'];
  const skillIds = ['javascript', 'css', 'blender'];

  // inspect -> matches skills
  expect(getAutocompleteMatch('inspect ja', 0, commands, projectIds, skillIds)).toEqual({
    completed: 'inspect javascript',
    index: 0,
    list: ['javascript']
  });

  // project -> matches projects
  expect(getAutocompleteMatch('project ro', 0, commands, projectIds, skillIds)).toEqual({
    completed: 'project robot-mech',
    index: 0,
    list: ['robot-mech']
  });
});
