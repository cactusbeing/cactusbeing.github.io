// Keep published game entries and the sidebar count on the same availability list.
export const gameEntries = [
  { id: 'chat-relay', available: false },
  { id: 'money', available: true },
  { id: 'campus', available: true },
] as const;

export const availableGameIds = new Set<(typeof gameEntries)[number]['id']>(
  gameEntries.filter((game) => game.available).map((game) => game.id),
);
