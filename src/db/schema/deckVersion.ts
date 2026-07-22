import {
    integer,
    sqliteTable,
    text,
    uniqueIndex,
} from 'drizzle-orm/sqlite-core';

import { timestamps } from './common';
import { decks } from './deck';
import { limitRegulations } from './limitRegulation';

export const deckVersions = sqliteTable(
  'deck_versions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    deckId: integer('deck_id')
      .notNull()
      .references(() => decks.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),

    limitRegulationId: integer('limit_regulation_id')
      .notNull()
      .references(() => limitRegulations.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),

    name: text('name').notNull(),

    memo: text('memo'),

    neuronUrl: text('neuron_url'),

    ...timestamps,
  },
  (table) => [
    uniqueIndex('deck_versions_deck_id_name_unique').on(
      table.deckId,
      table.name,
    ),
  ],
);

export type DeckVersion = typeof deckVersions.$inferSelect;
export type NewDeckVersion = typeof deckVersions.$inferInsert;