import {
    integer,
    sqliteTable,
    text,
    uniqueIndex,
} from 'drizzle-orm/sqlite-core';

import { timestamps } from './common';
import { matches } from './match';

export const duels = sqliteTable(
  'duels',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    matchId: integer('match_id')
      .notNull()
      .references(() => matches.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),

    sequenceNumber: integer('sequence_number').notNull(),

    result: text('result', {
      enum: ['win', 'loss', 'draw'],
    }).notNull(),

    turnOrder: text('turn_order', {
      enum: ['first', 'second'],
    }),

    memo: text('memo'),

    ...timestamps,
  },
  (table) => [
    uniqueIndex('duels_match_id_sequence_number_unique').on(
      table.matchId,
      table.sequenceNumber,
    ),
  ],
);

export type Duel = typeof duels.$inferSelect;
export type NewDuel = typeof duels.$inferInsert;