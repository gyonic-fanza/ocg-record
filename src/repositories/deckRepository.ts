import { asc } from 'drizzle-orm';

import { db } from '../db';
import {
    decks,
    type Deck,
    type NewDeck,
} from '../db/schema/deck';

export type CreateDeckInput = Pick<
  NewDeck,
  'name' | 'description'
>;

export async function getAllDecks(): Promise<Deck[]> {
  return db
    .select()
    .from(decks)
    .orderBy(asc(decks.name));
}

export async function createDeck(
  input: CreateDeckInput,
): Promise<void> {
  await db.insert(decks).values(input);
}