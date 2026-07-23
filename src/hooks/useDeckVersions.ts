import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
    getDeckVersionsByDeckId,
    type DeckVersionListItem,
} from '../repositories';

type UseDeckVersionsResult = {
  deckVersions: DeckVersionListItem[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
};

export function useDeckVersions(
  deckId: number | null,
): UseDeckVersionsResult {
const [deckVersions, setDeckVersions] = useState<
  DeckVersionListItem[]
>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

const loadDeckVersions = useCallback(async () => {
  if (deckId === null) {
    setDeckVersions([]);
    setError(null);
    setIsLoading(false);
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    if (!Number.isSafeInteger(deckId) || deckId <= 0) {
      throw new Error('デッキが正しく指定されていません。');
    }

    const data = await getDeckVersionsByDeckId(deckId);
    setDeckVersions(data);
  } catch (caughtError: unknown) {
    setError(
      caughtError instanceof Error
        ? caughtError
        : new Error('構築一覧の取得に失敗しました。'),
    );
  } finally {
    setIsLoading(false);
  }
}, [deckId]);

  useFocusEffect(
    useCallback(() => {
      void loadDeckVersions();
    }, [loadDeckVersions]),
  );

  return {
    deckVersions,
    isLoading,
    error,
    reload: loadDeckVersions,
  };
}