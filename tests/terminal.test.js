import { expect, test } from 'vitest';
import { getAutocompleteMatch } from '../src/components/RetroTerminalHelper';
import '../src/components/RetroTerminal';

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

test('case-insensitive autocomplete', () => {
  const commands = ['help', 'projects', 'project', 'use', 'clear', 'about', 'socials'];
  const projectIds = ['robot-mech', 'weather-cli'];

  // Test uppercase command input
  expect(getAutocompleteMatch('PR', 0, commands, projectIds)).toEqual({
    completed: 'projects',
    index: 0,
    list: ['projects', 'project']
  });

  // Test uppercase project input with uppercase command
  expect(getAutocompleteMatch('PROJECT RO', 0, commands, projectIds)).toEqual({
    completed: 'project robot-mech',
    index: 0,
    list: ['robot-mech']
  });

  // Test mixed case command and project
  expect(getAutocompleteMatch('UsE wE', 0, commands, projectIds)).toEqual({
    completed: 'use weather-cli',
    index: 0,
    list: ['weather-cli']
  });
});

test('resets autocomplete state on arrow keys', () => {
  const terminal = document.createElement('retro-terminal');
  document.body.appendChild(terminal);

  terminal.history = ['help', 'projects'];
  terminal.historyIndex = 2;
  
  // Set tab autocomplete states
  terminal.lastTabInput = 'p';
  terminal.cycleIndex = 2;

  // Dispatch ArrowUp keydown event
  const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
  terminal.input.dispatchEvent(arrowUpEvent);

  expect(terminal.lastTabInput).toBe('');
  expect(terminal.cycleIndex).toBe(0);

  // Set tab autocomplete states again
  terminal.lastTabInput = 'p';
  terminal.cycleIndex = 2;

  // Dispatch ArrowDown keydown event
  const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
  terminal.input.dispatchEvent(arrowDownEvent);

  expect(terminal.lastTabInput).toBe('');
  expect(terminal.cycleIndex).toBe(0);

  document.body.removeChild(terminal);
});

test('cleans up window event listener on disconnectedCallback', () => {
  const terminal = document.createElement('retro-terminal');
  let toggleCalled = 0;
  terminal.toggle = () => { toggleCalled++; };

  // Mount
  document.body.appendChild(terminal);

  // Dispatch keydown on window
  const backtickEvent1 = new KeyboardEvent('keydown', { key: '`' });
  window.dispatchEvent(backtickEvent1);
  expect(toggleCalled).toBe(1);

  // Unmount
  document.body.removeChild(terminal);

  // Dispatch keydown on window again
  const backtickEvent2 = new KeyboardEvent('keydown', { key: '`' });
  window.dispatchEvent(backtickEvent2);
  expect(toggleCalled).toBe(1); // should still be 1, not 2
});



