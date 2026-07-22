import {
    integer,
    primaryKey,
    sqliteTable,
} from 'drizzle-orm/sqlite-core';

import { matches } from './match';
import { themes } from './theme';

export const matchOpponentThemes = sqliteTable(
  'match_opponent_themes',
  {
    matchId: integer('match_id')
      .notNull()
      .references(() => matches.id, {
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
      columns: [table.matchId, table.themeId],
    }),
  ],
);

export type MatchOpponentTheme =
  typeof matchOpponentThemes.$inferSelect;

export type NewMatchOpponentTheme =
  typeof matchOpponentThemes.$inferInsert;