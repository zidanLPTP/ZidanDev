import presets from '../data/guestbook.json';

export function calculateScore(message) {
  const base = message.length * 100;
  const bonus = Math.floor(Math.random() * 500);
  return base + bonus;
}

function getLocalEntries() {
  try {
    const localData = localStorage.getItem('guestbook_entries');
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    // Fail-safe fallback to empty array
  }
  return [];
}

export function getLeaderboardEntries() {
  const localEntries = getLocalEntries();
  
  // Merge, sort descending by score, slice top 10
  const merged = [...presets, ...localEntries];
  merged.sort((a, b) => b.score - a.score);
  return merged.slice(0, 10);
}

export function addGuestbookEntry(initials, message) {
  const cleanInitials = initials.trim().toUpperCase();
  if (!/^[A-Z0-9]{3}$/.test(cleanInitials)) {
    return { success: false, error: 'Initials must be exactly 3 alphanumeric characters.' };
  }
  if (!message.trim()) return { success: false, error: 'Message cannot be empty.' };
  if (message.length > 100) return { success: false, error: 'Message cannot exceed 100 characters.' };

  const score = calculateScore(message);
  const newEntry = {
    initials: cleanInitials,
    message: message.trim(),
    score
  };

  const localEntries = getLocalEntries();
  localEntries.push(newEntry);
  localStorage.setItem('guestbook_entries', JSON.stringify(localEntries));

  // Dispatch custom window event
  window.dispatchEvent(new CustomEvent('guestbook-updated'));

  return { success: true, entry: newEntry };
}

