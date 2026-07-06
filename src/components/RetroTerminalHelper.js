export function getAutocompleteMatch(inputVal, cycleIndex, commands, projectIds) {
  const parts = inputVal.trim().split(/\s+/);
  
  // Case 1: Autocomplete commands (first word)
  if (parts.length === 1 && !inputVal.endsWith(' ')) {
    const matchingCmds = commands.filter(c => c.startsWith(parts[0]));
    if (matchingCmds.length === 0) return null;
    const match = matchingCmds[cycleIndex % matchingCmds.length];
    return { completed: match, index: cycleIndex % matchingCmds.length, list: matchingCmds };
  }

  // Case 2: Autocomplete project IDs (second word) after "project" or "use"
  if (parts.length >= 1 && (parts[0] === 'project' || parts[0] === 'use')) {
    const typedProjectVal = parts.length === 2 ? parts[1] : '';
    const matchingProjects = projectIds.filter(p => p.startsWith(typedProjectVal));
    if (matchingProjects.length === 0) return null;
    const match = matchingProjects[cycleIndex % matchingProjects.length];
    return { completed: `${parts[0]} ${match}`, index: cycleIndex % matchingProjects.length, list: matchingProjects };
  }

  return null;
}
