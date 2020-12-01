export function hasTeam(playerName: string): boolean {
  return playerName.includes(' | ');
}

export function separateTeamAndName(playerName: string): string[] {
  if (!hasTeam(playerName)) {
    return [ '', playerName ];
  }

  return playerName.split(' | ');
}
