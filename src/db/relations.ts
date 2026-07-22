import { relations } from 'drizzle-orm';

import { decks } from './schema/deck';
import { deckVersions } from './schema/deckVersion';
import { limitRegulations } from './schema/limitRegulation';

export const decksRelations = relations(decks, ({ many }) => ({
  versions: many(deckVersions),
}));

export const limitRegulationsRelations = relations(
  limitRegulations,
  ({ many }) => ({
    deckVersions: many(deckVersions),
  }),
);

export const deckVersionsRelations = relations(
  deckVersions,
  ({ one }) => ({
    deck: one(decks, {
      fields: [deckVersions.deckId],
      references: [decks.id],
    }),

    limitRegulation: one(limitRegulations, {
      fields: [deckVersions.limitRegulationId],
      references: [limitRegulations.id],
    }),
  }),
);