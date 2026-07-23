import {
  deleteDeck as deleteDeckRecord,
  createDeck as insertDeck,
  updateDeck as updateDeckRecord,
} from '../repositories';
export type CreateDeckInput = {
  name: string;
  description?: string | null;
};

export async function createDeck(
  input: CreateDeckInput,
): Promise<void> {
  const name = input.name.trim();
  const description = input.description?.trim() ?? '';

  if (!name) {
    throw new Error('デッキ名を入力してください。');
  }

  await insertDeck({
    name,
    description: description || null,
  });
}
export type UpdateDeckInput = CreateDeckInput;

export async function updateDeck(
  id: number,
  input: UpdateDeckInput,
): Promise<void> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('デッキIDが正しくありません。');
  }

  const name = input.name.trim();
  const description = input.description?.trim() ?? '';

  if (!name) {
    throw new Error('デッキ名を入力してください。');
  }

  await updateDeckRecord(id, {
    name,
    description: description || null,
  });
}
export async function deleteDeck(
  id: number,
): Promise<void> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('デッキIDが正しくありません。');
  }

  try {
    await deleteDeckRecord(id);
  } catch (caughtError: unknown) {
    const message =
      caughtError instanceof Error
        ? caughtError.message
        : String(caughtError);

    if (message.includes('FOREIGN KEY constraint failed')) {
      throw new Error(
        '構築や対戦記録から使用されているため、このデッキは削除できません。',
      );
    }

    throw caughtError;
  }
}