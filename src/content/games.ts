// Keep published game entries and the sidebar count on the same availability list.
export const gameEntries = [
  { id: 'bakery', available: true },
  { id: 'money', available: true },
  { id: 'campus', available: true },
  { id: 'chat-relay', available: false },
] as const;

export const availableGameIds = new Set<(typeof gameEntries)[number]['id']>(
  gameEntries.filter((game) => game.available).map((game) => game.id),
);
