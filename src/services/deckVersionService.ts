import {
  deleteDeckVersion as deleteDeckVersionRecord,
  createDeckVersion as insertDeckVersion,
  updateDeckVersion as updateDeckVersionRecord,
} from '../repositories';
export type CreateDeckVersionInput = {
  deckId: number;
  limitRegulationId: number;
  name: string;
  memo?: string | null;
  neuronUrl?: string | null;
};

export async function createDeckVersion(
  input: CreateDeckVersionInput,
): Promise<void> {
  const name = input.name.trim();
  const memo = input.memo?.trim() || null;
  const neuronUrl = input.neuronUrl?.trim() || null;

  if (
    !Number.isInteger(input.deckId) ||
    input.deckId <= 0
  ) {
    throw new Error('デッキが正しく指定されていません。');
  }

  if (
    !Number.isInteger(input.limitRegulationId) ||
    input.limitRegulationId <= 0
  ) {
    throw new Error(
      'リミットレギュレーションが正しく指定されていません。',
    );
  }

  if (!name) {
    throw new Error('構築名を入力してください。');
  }

  await insertDeckVersion({
    deckId: input.deckId,
    limitRegulationId: input.limitRegulationId,
    name,
    memo,
    neuronUrl,
  });
}export type UpdateDeckVersionInput = {
  limitRegulationId: number;
  name: string;
  memo?: string | null;
  neuronUrl?: string | null;
};

export async function updateDeckVersion(
  id: number,
  input: UpdateDeckVersionInput,
): Promise<void> {
  const name = input.name.trim();
  const memo = input.memo?.trim() || null;
  const neuronUrl = input.neuronUrl?.trim() || null;

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('構築が正しく指定されていません。');
  }

  if (
    !Number.isInteger(input.limitRegulationId) ||
    input.limitRegulationId <= 0
  ) {
    throw new Error(
      'リミットレギュレーションが正しく指定されていません。',
    );
  }

  if (!name) {
    throw new Error('構築名を入力してください。');
  }

  await updateDeckVersionRecord(id, {
    limitRegulationId: input.limitRegulationId,
    name,
    memo,
    neuronUrl,
  });
}
export async function deleteDeckVersion(
  id: number,
): Promise<void> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('構築が正しく指定されていません。');
  }

  try {
    await deleteDeckVersionRecord(id);
  } catch (caughtError: unknown) {
    if (
      caughtError instanceof Error &&
      caughtError.message.includes(
        'FOREIGN KEY constraint failed',
      )
    ) {
      throw new Error(
        '大会記録や対戦記録から使用されているため、この構築は削除できません。',
      );
    }

    throw caughtError;
  }
}