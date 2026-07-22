import { asc } from 'drizzle-orm';

import { db } from '../db';
import {
    eventTypes,
    type EventType,
} from '../db/schema/eventType';

export async function getAllEventTypes(): Promise<EventType[]> {
  return db
    .select()
    .from(eventTypes)
    .orderBy(asc(eventTypes.id));
}