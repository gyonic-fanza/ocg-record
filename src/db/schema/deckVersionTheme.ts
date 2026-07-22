import {
    integer,
    primaryKey,
    sqliteTable,
} from 'drizzle-orm/sqlite-core';

import { deckVersions } from './deckVersion';
import { themes } from './theme';

export const deckVersionThemes = sqliteTable(
  'deck_version_themes',
  {
    deckVersionId: integer('deck_version_id')
      .notNull()
      .references(() => deckVersions.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),

    themeId: integer('theme_id')
      .notNull()
      .references(() => themes.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
  },
  (table) => [
    primaryKey({
      columns: [table.deckVersionId, table.themeId],
    }),
  ],
);

export type DeckVersionTheme = typeof deckVersionThemes.$inferSelect;
export type NewDeckVersionTheme = typeof deckVersionThemes.$inferInsert;