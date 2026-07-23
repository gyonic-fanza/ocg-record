import { useCallback, useEffect, useState } from 'react';

import type { Deck } from '../db/schema/deck';
import { getAllDecks } from '../repositories';

type UseDecksResult = {
  decks: Deck[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
};

export function useDecks(): UseDecksResult {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDecks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllDecks();
      setDecks(data);
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error('デッキ一覧の取得に失敗しました。'),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDecks();
  }, [loadDecks]);

  return {
    decks,
    isLoading,
    error,
    reload: loadDecks,
  };
}