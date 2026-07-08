import { expect, test } from 'vitest';
import { getAutocompleteMatch } from '../src/components/RetroTerminalHelper';

function wordWrap(text, limit) {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length > limit) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

test('word wrap limits line length under target thresholds', () => {
  const desc = "Kelas berbasis logika pemrograman yang ahli dalam mengubah algoritma abstrak menjadi aplikasi web interaktif.";
  const wrapped = wordWrap(desc, 40);
  expect(wrapped.length).toBeGreaterThan(1);
  wrapped.forEach(line => {
    expect(line.length).toBeLessThanOrEqual(45);
  });
});

test('autocomplete select matches character classes', () => {
  const commands = ['help', 'select'];
  const projectIds = [];
  const skillIds = [];
  const characterIds = ['developer', 'artist', 'gamer'];

  expect(getAutocompleteMatch('select de', 0, commands, projectIds, skillIds)).toEqual({
    completed: 'select developer',
    index: 0,
    list: ['developer']
  });
});

import '../src/components/RetroTerminal';

test('retro-terminal default character is developer', () => {
  const terminal = document.createElement('retro-terminal');
  document.body.appendChild(terminal);
  expect(terminal.activeCharId).toBe('developer');
  document.body.removeChild(terminal);
});

test('retro-terminal updates activeCharId on character-changed event', () => {
  const terminal = document.createElement('retro-terminal');
  document.body.appendChild(terminal);
  expect(terminal.activeCharId).toBe('developer');

  window.dispatchEvent(new CustomEvent('character-changed', {
    detail: { id: 'artist' }
  }));

  expect(terminal.activeCharId).toBe('artist');
  document.body.removeChild(terminal);
});

test('retro-terminal select command updates activeCharId and dispatches event', () => {
  const terminal = document.createElement('retro-terminal');
  document.body.appendChild(terminal);
  
  let eventDispatched = false;
  let dispatchedId = '';
  const handler = (e) => {
    eventDispatched = true;
    dispatchedId = e.detail.id;
  };
  window.addEventListener('character-changed', handler);

  terminal.executeCommand('select gamer');
  
  expect(terminal.activeCharId).toBe('gamer');
  expect(eventDispatched).toBe(true);
  expect(dispatchedId).toBe('gamer');

  window.removeEventListener('character-changed', handler);
  document.body.removeChild(terminal);
});

test('retro-terminal status command outputs correct lines', () => {
  const terminal = document.createElement('retro-terminal');
  document.body.appendChild(terminal);

  // Clear previous lines
  terminal.output.innerHTML = '';
  terminal.executeCommand('status');

  const lines = Array.from(terminal.output.children).map(c => c.textContent);
  expect(lines.some(l => l.includes('STATUS KARAKTER: SOFTWARE DEVELOPER'))).toBe(true);

  expect(lines.some(l => l.includes('HP  :'))).toBe(true);
  expect(lines.some(l => l.includes('BIO :'))).toBe(true);

  document.body.removeChild(terminal);
});

