import { expect, test } from 'vitest';
import '../src/components/RetroTerminal';

test('verify terminal sign command substring parser logic', () => {
  const cmdStr = "sign zdn hello my friend how are you";
  const parts = cmdStr.split(/\s+/);
  const command = parts[0]; // "sign"
  
  // Custom substring parser
  const initials = parts[1] ? parts[1].toUpperCase() : '';
  const messageStartIndex = cmdStr.indexOf(parts[1]) + parts[1].length;
  const message = cmdStr.substring(messageStartIndex).trim();

  expect(command).toBe('sign');
  expect(initials).toBe('ZDN');
  expect(message).toBe('hello my friend how are you');
});

test('RetroTerminal executes guestbook and sign commands correctly', () => {
  const terminal = document.createElement('retro-terminal');
  document.body.appendChild(terminal);

  const lines = [];
  terminal.writeLine = (text) => {
    lines.push(text);
  };

  // Test guestbook command
  terminal.executeCommand('guestbook');
  expect(lines.length).toBeGreaterThan(0);
  expect(lines[0]).toBe("============================================================");
  expect(lines[1]).toBe("RANK  INIT  SCORE   MESSAGE");

  lines.length = 0; // reset lines

  // Test sign command with missing arguments
  terminal.executeCommand('sign ABC');
  expect(lines[0]).toBe("Usage: sign <initials> <message>");

  lines.length = 0; // reset lines

  // Test sign command successfully
  terminal.executeCommand('sign TST hello from test suite');
  expect(lines[0]).toBe("INSERTING COIN... SUCCESS!");
  expect(lines[1]).toBe("SAVING SIGNATURE... SUCCESS!");
  expect(lines[2]).toContain("YOUR SCORE:");
  expect(lines[3]).toContain("CONGRATULATIONS!");

  document.body.removeChild(terminal);
});
