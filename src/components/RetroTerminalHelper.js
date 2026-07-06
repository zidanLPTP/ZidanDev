export function getAutocompleteMatch(inputVal, cycleIndex, commands, projectIds) {
  const parts = inputVal.trim().split(/\s+/);
  const commandInput = parts[0].toLowerCase();
  
  // Case 1: Autocomplete commands (first word)
  if (parts.length === 1 && !inputVal.endsWith(' ')) {
    const matchingCmds = commands
      .map(c => c.toLowerCase())
      .filter(c => c.startsWith(commandInput));
    if (matchingCmds.length === 0) return null;
    const match = matchingCmds[cycleIndex % matchingCmds.length];
    return { completed: match, index: cycleIndex % matchingCmds.length, list: matchingCmds };
  }

  // Case 2: Autocomplete project IDs (second word) after "project" or "use"
  if (parts.length >= 1 && (commandInput === 'project' || commandInput === 'use')) {
    const typedProjectVal = (parts.length === 2 ? parts[1] : '').toLowerCase();
    const matchingProjects = projectIds
      .map(p => p.toLowerCase())
      .filter(p => p.startsWith(typedProjectVal));
    if (matchingProjects.length === 0) return null;
    const match = matchingProjects[cycleIndex % matchingProjects.length];
    return { completed: `${commandInput} ${match}`, index: cycleIndex % matchingProjects.length, list: matchingProjects };
  }

  return null;
}
