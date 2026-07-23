import { desc, eq } from 'drizzle-orm';
import { limitRegulations } from '../db/schema/limitRegulation';

import { db } from '../db';
import {
  deckVersions,
  type DeckVersion,
  type NewDeckVersion,
} from '../db/schema/deckVersion';

export type DeckVersionListItem = DeckVersion & {
  limitRegulationName: string;
};
export type CreateDeckVersionInput = Pick<
  NewDeckVersion,
  | 'deckId'
  | 'limitRegulationId'
  | 'name'
  | 'memo'
  | 'neuronUrl'
>;

export async function getDeckVersionsByDeckId(
  deckId: number,
): Promise<DeckVersionListItem[]> {
  const rows = await db
    .select({
      deckVersion: deckVersions,
      limitRegulationName: limitRegulations.name,
    })
    .from(deckVersions)
    .innerJoin(
      limitRegulations,
      eq(
        deckVersions.limitRegulationId,
        limitRegulations.id,
      ),
    )
    .where(eq(deckVersions.deckId, deckId))
    .orderBy(desc(deckVersions.id));

  return rows.map((row) => ({
    ...row.deckVersion,
    limitRegulationName: row.limitRegulationName,
  }));
}

export async function createDeckVersion(
  input: CreateDeckVersionInput,
): Promise<void> {
  await db
    .insert(deckVersions)
    .values(input);
}