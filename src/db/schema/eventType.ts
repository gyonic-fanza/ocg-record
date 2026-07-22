import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { timestamps } from './common';

export const eventTypes = sqliteTable('event_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull().unique(),

  description: text('description'),

  ...timestamps,
});

export type EventType = typeof eventTypes.$inferSelect;
export type NewEventType = typeof eventTypes.$inferInsert;