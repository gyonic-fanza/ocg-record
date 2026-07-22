import {
    integer,
    sqliteTable,
    text,
    uniqueIndex,
} from 'drizzle-orm/sqlite-core';

import { timestamps } from './common';
import { deckVersions } from './deckVersion';
import { events } from './event';

export const matches = sqliteTable(
  'matches',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    eventId: integer('event_id')
      .notNull()
      .references(() => events.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),

    deckVersionId: integer('deck_version_id')
      .notNull()
      .references(() => deckVersions.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),

    sequenceNumber: integer('sequence_number').notNull(),

    result: text('result', {
      enum: ['win', 'loss', 'draw'],
    }).notNull(),

    roundLabel: text('round_label'),

    opponentName: text('opponent_name'),

    memo: text('memo'),

    ...timestamps,
  },
  (table) => [
    uniqueIndex('matches_event_id_sequence_number_unique').on(
      table.eventId,
      table.sequenceNumber,
    ),
  ],
);

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;