import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Deck } from '../db/schema/deck';
import { getDeckById } from '../repositories';

type UseDeckResult = {
  deck: Deck | undefined;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
};

export function useDeck(id: number | null): UseDeckResult {
  const [deck, setDeck] = useState<Deck>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDeck = useCallback(async () => {
    if (id === null) {
      setDeck(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getDeckById(id);
      setDeck(data);
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error('デッキ情報の取得に失敗しました。'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void loadDeck();
    }, [loadDeck]),
  );

  return {
    deck,
    isLoading,
    error,
    reload: loadDeck,
  };
}