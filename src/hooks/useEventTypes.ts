import { useCallback, useEffect, useState } from 'react';

import type { EventType } from '../db/schema/eventType';
import { getAllEventTypes } from '../repositories';

type UseEventTypesResult = {
  eventTypes: EventType[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
};

export function useEventTypes(): UseEventTypesResult {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEventTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllEventTypes();
      setEventTypes(data);
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error('イベント種別の取得に失敗しました。'),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEventTypes();
  }, [loadEventTypes]);

  return {
    eventTypes,
    isLoading,
    error,
    reload: loadEventTypes,
  };
}