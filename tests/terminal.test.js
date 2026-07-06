import { expect, test } from 'vitest';
import { getAutocompleteMatch } from '../src/components/RetroTerminalHelper';

test('autocompletes commands and projects', () => {
  const commands = ['help', 'projects', 'project', 'use', 'clear', 'about', 'socials'];
  const projectIds = ['robot-mech', 'weather-cli'];

  // Command Autocomplete
  expect(getAutocompleteMatch('pr', 0, commands, projectIds)).toEqual({
    completed: 'projects',
    index: 0,
    list: ['projects', 'project']
  });
  
  // Project Autocomplete after space
  expect(getAutocompleteMatch('project ro', 0, commands, projectIds)).toEqual({
    completed: 'project robot-mech',
    index: 0,
    list: ['robot-mech']
  });
  expect(getAutocompleteMatch('use we', 0, commands, projectIds)).toEqual({
    completed: 'use weather-cli',
    index: 0,
    list: ['weather-cli']
  });

  // Cycling Autocomplete
  expect(getAutocompleteMatch('p', 0, commands, projectIds)).toEqual({
    completed: 'projects',
    index: 0,
    list: ['projects', 'project']
  });
  expect(getAutocompleteMatch('p', 1, commands, projectIds)).toEqual({
    completed: 'project',
    index: 1,
    list: ['projects', 'project']
  });
});
