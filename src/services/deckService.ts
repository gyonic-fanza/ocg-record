import { createDeck as insertDeck } from '../repositories';

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