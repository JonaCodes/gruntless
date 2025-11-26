// Returns a consistent color for a given characterId.
export const getCharacterColor = (characterId: number | undefined): string => {
  if (characterId === undefined || !characterId) {
    return '#228BE6';
  }

  const baseColors: string[] = [
    '#C2255C',
    '#FFA500',
    '#2F9E44',
    '#228BE6',
    '#F44336',
    '#9C27B0',
    '#3F51B5',
    '#009688',
    '#795548',
    '#607D8B',
  ];

  const index = (characterId + 1) % baseColors.length;
  return baseColors[index];
};
