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

test('RetroTerminal executes guestbook and sign commands correctly', async () => {
  const terminal = document.createElement('retro-terminal');
  document.body.appendChild(terminal);

  const lines = [];
  terminal.writeLine = (text) => {
    lines.push(text);
  };

  // Test guestbook command
  await terminal.executeCommand('guestbook');
  expect(lines.length).toBeGreaterThan(0);
  expect(lines[0]).toBe("============================================================");
  expect(lines[1]).toBe("PERINGKAT  INISIAL  SKOR   PESAN");

  lines.length = 0; // reset lines

  // Test sign command with missing arguments
  await terminal.executeCommand('sign ABC');
  expect(lines[0]).toBe("Penggunaan: sign <inisial> <pesan>");

  lines.length = 0; // reset lines

  // Test sign command successfully
  await terminal.executeCommand('sign TST hello from test suite');
  expect(lines[0]).toBe("MEMASUKKAN KOIN... SUKSES!");
  expect(lines[1]).toBe("MENYIMPAN TANDA TANGAN... SUKSES!");
  expect(lines[2]).toContain("SKOR ANDA:");
  expect(lines[3]).toContain("SELAMAT!");

  document.body.removeChild(terminal);
});

test('RetroTerminal sign command handles non-leaderboard placements correctly', async () => {
  // Populate local storage with 10 entries having very high scores
  const highEntries = [];
  for (let i = 0; i < 10; i++) {
    highEntries.push({ initials: `H0${i}`, message: 'High score entry', score: 100000 + i });
  }
  localStorage.setItem('guestbook_entries', JSON.stringify(highEntries));

  const terminal = document.createElement('retro-terminal');
  document.body.appendChild(terminal);

  const lines = [];
  terminal.writeLine = (text) => {
    lines.push(text);
  };

  // Test sign command with a low scoring entry (short message, max score around 600)
  await terminal.executeCommand('sign LOW x');
  expect(lines[0]).toBe("MEMASUKKAN KOIN... SUKSES!");
  expect(lines[1]).toBe("MENYIMPAN TANDA TANGAN... SUKSES!");
  expect(lines[2]).toContain("SKOR ANDA:");
  expect(lines[3]).toBe("Skor Anda belum masuk 10 besar leaderboard. Coba pesan yang lebih panjang lain kali!");

  document.body.removeChild(terminal);
  localStorage.clear();
});
