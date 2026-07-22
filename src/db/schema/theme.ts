import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { timestamps } from './common';

export const themes = sqliteTable('themes', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull().unique(),

  parentThemeId: integer('parent_theme_id'),

  ...timestamps,
});