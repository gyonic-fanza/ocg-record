import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { LimitRegulation } from '../db/schema/limitRegulation';
import { getAllLimitRegulations } from '../repositories';

type UseLimitRegulationsResult = {
  limitRegulations: LimitRegulation[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
};

export function useLimitRegulations(): UseLimitRegulationsResult {
  const [limitRegulations, setLimitRegulations] = useState<
    LimitRegulation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadLimitRegulations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllLimitRegulations();
      setLimitRegulations(data);
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error(
              'リミットレギュレーション一覧の取得に失敗しました。',
            ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadLimitRegulations();
    }, [loadLimitRegulations]),
  );

  return {
    limitRegulations,
    isLoading,
    error,
    reload: loadLimitRegulations,
  };
}