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
export async function getDeckVersionById(
  id: number,
): Promise<DeckVersionListItem | undefined> {
  const [row] = await db
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
    .where(eq(deckVersions.id, id))
    .limit(1);

  if (!row) {
    return undefined;
  }

  return {
    ...row.deckVersion,
    limitRegulationName: row.limitRegulationName,
  };
}
export type UpdateDeckVersionInput = Pick<
  NewDeckVersion,
  | 'limitRegulationId'
  | 'name'
  | 'memo'
  | 'neuronUrl'
>;

export async function updateDeckVersion(
  id: number,
  input: UpdateDeckVersionInput,
): Promise<void> {
  await db
    .update(deckVersions)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(deckVersions.id, id));
}
export async function deleteDeckVersion(
  id: number,
): Promise<void> {
  await db
    .delete(deckVersions)
    .where(eq(deckVersions.id, id));
}