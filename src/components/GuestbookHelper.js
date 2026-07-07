import presets from '../data/guestbook.json';

export function calculateScore(message) {
  const base = message.length * 100;
  const bonus = Math.floor(Math.random() * 500);
  return base + bonus;
}

export function getLeaderboardEntries() {
  const localData = localStorage.getItem('guestbook_entries');
  const localEntries = localData ? JSON.parse(localData) : [];
  
  // Merge, sort descending by score, slice top 10
  const merged = [...presets, ...localEntries];
  merged.sort((a, b) => b.score - a.score);
  return merged.slice(0, 10);
}

export function addGuestbookEntry(initials, message) {
  const cleanInitials = initials.trim().slice(0, 3).toUpperCase();
  if (cleanInitials.length !== 3) return { success: false, error: 'Initials must be exactly 3 characters.' };
  if (!message.trim()) return { success: false, error: 'Message cannot be empty.' };

  const score = calculateScore(message);
  const newEntry = {
    initials: cleanInitials,
    message: message.trim(),
    score
  };

  const localData = localStorage.getItem('guestbook_entries');
  const localEntries = localData ? JSON.parse(localData) : [];
  localEntries.push(newEntry);
  localStorage.setItem('guestbook_entries', JSON.stringify(localEntries));

  // Dispatch custom window event
  window.dispatchEvent(new CustomEvent('guestbook-updated'));

  return { success: true, entry: newEntry };
}
