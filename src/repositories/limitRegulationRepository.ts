import { desc } from 'drizzle-orm';

import { db } from '../db';
import {
    limitRegulations,
    type LimitRegulation,
    type NewLimitRegulation,
} from '../db/schema/limitRegulation';

export type CreateLimitRegulationInput = Pick<
  NewLimitRegulation,
  'name' | 'startDate' | 'endDate'
>;

export async function getAllLimitRegulations(): Promise<
  LimitRegulation[]
> {
  return db
    .select()
    .from(limitRegulations)
    .orderBy(desc(limitRegulations.startDate));
}

export async function createLimitRegulation(
  input: CreateLimitRegulationInput,
): Promise<void> {
  await db
    .insert(limitRegulations)
    .values(input);
}