import { relations } from 'drizzle-orm';

import { decks } from './schema/deck';
import { deckVersions } from './schema/deckVersion';
import { deckVersionThemes } from './schema/deckVersionTheme';
import { limitRegulations } from './schema/limitRegulation';
import { themes } from './schema/theme';

export const decksRelations = relations(decks, ({ many }) => ({
  versions: many(deckVersions),
}));

export const limitRegulationsRelations = relations(
  limitRegulations,
  ({ many }) => ({
    deckVersions: many(deckVersions),
  }),
);

export const themesRelations = relations(themes, ({ many }) => ({
  deckVersionLinks: many(deckVersionThemes),
}));

export const deckVersionsRelations = relations(
  deckVersions,
  ({ one, many }) => ({
    deck: one(decks, {
      fields: [deckVersions.deckId],
      references: [decks.id],
    }),

    limitRegulation: one(limitRegulations, {
      fields: [deckVersions.limitRegulationId],
      references: [limitRegulations.id],
    }),

    themeLinks: many(deckVersionThemes),
  }),
);

export const deckVersionThemesRelations = relations(
  deckVersionThemes,
  ({ one }) => ({
    deckVersion: one(deckVersions, {
      fields: [deckVersionThemes.deckVersionId],
      references: [deckVersions.id],
    }),

    theme: one(themes, {
      fields: [deckVersionThemes.themeId],
      references: [themes.id],
    }),
  }),
);