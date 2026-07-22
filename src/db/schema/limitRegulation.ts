import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { timestamps } from './common';

export const limitRegulations = sqliteTable('limit_regulations', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull().unique(),

  startDate: integer('start_date', {
    mode: 'timestamp_ms',
  }).notNull(),

  endDate: integer('end_date', {
    mode: 'timestamp_ms',
  }),

  ...timestamps,
});