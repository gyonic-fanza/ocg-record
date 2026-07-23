import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { timestamps } from './common';

export const decks = sqliteTable('decks', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull().unique(),

  description: text('description'),

  ...timestamps,
});
export type Deck = typeof decks.$inferSelect;
export type NewDeck = typeof decks.$inferInsert;