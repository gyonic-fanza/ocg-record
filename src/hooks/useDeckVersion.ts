import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
    getDeckVersionById,
    type DeckVersionListItem,
} from '../repositories';

type UseDeckVersionResult = {
  deckVersion: DeckVersionListItem | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
};

export function useDeckVersion(
  deckVersionId: number | null,
): UseDeckVersionResult {
  const [deckVersion, setDeckVersion] =
    useState<DeckVersionListItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDeckVersion = useCallback(async () => {
    if (deckVersionId === null) {
      setDeckVersion(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (
        !Number.isSafeInteger(deckVersionId) ||
        deckVersionId <= 0
      ) {
        throw new Error('構築が正しく指定されていません。');
      }

      const data = await getDeckVersionById(deckVersionId);
      setDeckVersion(data ?? null);
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error('構築情報の取得に失敗しました。'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [deckVersionId]);

  useFocusEffect(
    useCallback(() => {
      void loadDeckVersion();
    }, [loadDeckVersion]),
  );

  return {
    deckVersion,
    isLoading,
    error,
    reload: loadDeckVersion,
  };
}