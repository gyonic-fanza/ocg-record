import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { timestamps } from './common';
import { eventTypes } from './eventType';

export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  eventTypeId: integer('event_type_id')
    .notNull()
    .references(() => eventTypes.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),

  eventDate: text('event_date').notNull(),

  title: text('title'),

  venue: text('venue'),

  participantCount: integer('participant_count'),

  startedAt: integer('started_at', {
    mode: 'timestamp_ms',
  }),

  endedAt: integer('ended_at', {
    mode: 'timestamp_ms',
  }),

  memo: text('memo'),

  ...timestamps,
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;