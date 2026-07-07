import characters from '../data/characters.json';
const charIds = characters.map(c => c.id);

export function getAutocompleteMatch(inputVal, cycleIndex, commands, projectIds, skillIds = []) {
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

  // Case 3: Autocomplete skill IDs (second word) after "inspect"
  if (parts.length >= 1 && commandInput === 'inspect') {
    const typedSkillVal = (parts.length === 2 ? parts[1] : '').toLowerCase();
    const matchingSkills = skillIds
      .map(s => s.toLowerCase())
      .filter(s => s.startsWith(typedSkillVal));
    if (matchingSkills.length === 0) return null;
    const match = matchingSkills[cycleIndex % matchingSkills.length];
    return { completed: `${commandInput} ${match}`, index: cycleIndex % matchingSkills.length, list: matchingSkills };
  }

  // Case 4: Autocomplete character IDs (second word) after "select"
  if (parts.length >= 1 && commandInput === 'select') {
    const typedCharVal = (parts.length === 2 ? parts[1] : '').toLowerCase();
    const matchingChars = charIds
      .map(c => c.toLowerCase())
      .filter(c => c.startsWith(typedCharVal));
    if (matchingChars.length === 0) return null;
    const match = matchingChars[cycleIndex % matchingChars.length];
    return { completed: `${commandInput} ${match}`, index: cycleIndex % matchingChars.length, list: matchingChars };
  }

  return null;
}
