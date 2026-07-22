import { db } from '..';
import { eventTypes } from '../schema/eventType';

import { initialEventTypes } from './eventTypes';

export async function seedDatabase(): Promise<void> {
  await db
    .insert(eventTypes)
    .values(initialEventTypes)
    .onConflictDoNothing({
      target: eventTypes.name,
    });
}