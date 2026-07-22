import { relations } from 'drizzle-orm';

import { decks } from './schema/deck';
import { deckVersions } from './schema/deckVersion';
import { deckVersionThemes } from './schema/deckVersionTheme';
import { duels } from './schema/duel';
import { events } from './schema/event';
import { eventTypes } from './schema/eventType';
import { limitRegulations } from './schema/limitRegulation';
import { matches } from './schema/match';
import { matchOpponentThemes } from './schema/matchOpponentTheme';
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
  matchOpponentLinks: many(matchOpponentThemes),
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
matches: many(matches),
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
export const eventTypesRelations = relations(
  eventTypes,
  ({ many }) => ({
    events: many(events),
  }),
);

export const eventsRelations = relations(
  events,
  ({ one, many }) => ({
    eventType: one(eventTypes, {
      fields: [events.eventTypeId],
      references: [eventTypes.id],
    }),

    matches: many(matches),
  }),
);
export const matchesRelations = relations(
  matches,
  ({ one, many }) => ({
    event: one(events, {
      fields: [matches.eventId],
      references: [events.id],
    }),

    deckVersion: one(deckVersions, {
      fields: [matches.deckVersionId],
      references: [deckVersions.id],
    }),

    duels: many(duels),

    opponentThemeLinks: many(matchOpponentThemes),
  }),
);

export const duelsRelations = relations(duels, ({ one }) => ({
  match: one(matches, {
    fields: [duels.matchId],
    references: [matches.id],
  }),
}));

export const matchOpponentThemesRelations = relations(
  matchOpponentThemes,
  ({ one }) => ({
    match: one(matches, {
      fields: [matchOpponentThemes.matchId],
      references: [matches.id],
    }),

    theme: one(themes, {
      fields: [matchOpponentThemes.themeId],
      references: [themes.id],
    }),
  }),
);