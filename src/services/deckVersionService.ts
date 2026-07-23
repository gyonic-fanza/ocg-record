import {
    createDeckVersion as insertDeckVersion,
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
}