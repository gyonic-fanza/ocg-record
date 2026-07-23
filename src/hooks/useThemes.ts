import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import type { Theme } from '../db/schema/theme';
import { getAllThemes } from '../repositories';

type UseThemesResult = {
    themes: Theme[];
    isLoading: boolean;
    error: Error | null;
    reload: () => Promise<void>;
};

export function useThemes(): UseThemesResult {
    const [themes, setThemes] = useState<Theme[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadThemes = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getAllThemes();
            setThemes(data);
        } catch (caughtError: unknown) {
            setError(
                caughtError instanceof Error
                    ? caughtError
                    : new Error('テーマ一覧の取得に失敗しました。'),
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadThemes();
        }, [loadThemes]),
    );

    return {
        themes,
        isLoading,
        error,
        reload: loadThemes,
    };
}