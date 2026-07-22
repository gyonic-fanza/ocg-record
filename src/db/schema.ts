import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const themes = sqliteTable('themes', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull().unique(),

  parentThemeId: integer('parent_theme_id'),

  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});
export const limitRegulations = sqliteTable('limit_regulations', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull().unique(),

  startDate: integer('start_date', { mode: 'timestamp_ms' }).notNull(),

  endDate: integer('end_date', { mode: 'timestamp_ms' }),

  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});
export const decks = sqliteTable('decks', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull().unique(),

  description: text('description'),

  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});