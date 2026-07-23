import { asc, eq } from 'drizzle-orm';
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
export async function getDeckById(
  id: number,
): Promise<Deck | undefined> {
  const [deck] = await db
    .select()
    .from(decks)
    .where(eq(decks.id, id))
    .limit(1);

  return deck;
}
export async function createDeck(
  input: CreateDeckInput,
): Promise<void> {
  await db.insert(decks).values(input);
}
export type UpdateDeckInput = Pick<
  NewDeck,
  'name' | 'description'
>;

export async function updateDeck(
  id: number,
  input: UpdateDeckInput,
): Promise<void> {
  await db
    .update(decks)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(decks.id, id));
}
export async function deleteDeck(
  id: number,
): Promise<void> {
  await db
    .delete(decks)
    .where(eq(decks.id, id));
}