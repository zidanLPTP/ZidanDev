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

export async function getLeaderboardEntries() {
  try {
    const res = await fetch('/api/guestbook.php');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const merged = [...presets, ...data];
        merged.sort((a, b) => b.score - a.score);
        return merged.slice(0, 10);
      }
    }
  } catch (e) {
    // Fail-safe fallback to localStorage/presets
  }

  const localEntries = getLocalEntries();
  const merged = [...presets, ...localEntries];
  merged.sort((a, b) => b.score - a.score);
  return merged.slice(0, 10);
}

export async function addGuestbookEntry(initials, message, customScore = null) {
  const cleanInitials = initials.trim().toUpperCase();
  if (!/^[A-Z0-9]{3}$/.test(cleanInitials)) {
    return { success: false, error: 'Initials must be exactly 3 alphanumeric characters.' };
  }
  if (!message.trim()) return { success: false, error: 'Message cannot be empty.' };
  if (message.length > 100) return { success: false, error: 'Message cannot exceed 100 characters.' };

  const score = customScore !== null ? Number(customScore) : calculateScore(message);
  const newEntry = {
    initials: cleanInitials,
    message: message.trim(),
    score
  };

  try {
    const res = await fetch('/api/guestbook.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry)
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        window.dispatchEvent(new CustomEvent('guestbook-updated'));
        return { success: true, entry: result.entry };
      }
    }
  } catch (e) {
    // Fallback to local storage if API is offline or not configured yet
  }

  const localEntries = getLocalEntries();
  localEntries.push(newEntry);
  localStorage.setItem('guestbook_entries', JSON.stringify(localEntries));

  window.dispatchEvent(new CustomEvent('guestbook-updated'));

  return { success: true, entry: newEntry };
}
