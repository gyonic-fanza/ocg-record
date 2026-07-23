import {
    createTheme as insertTheme,
} from '../repositories';

export type CreateThemeInput = {
    name: string;
    parentThemeId?: number | null;
};

export async function createTheme(
    input: CreateThemeInput,
): Promise<void> {
    const name = input.name.trim();
    const parentThemeId = input.parentThemeId ?? null;

    if (!name) {
        throw new Error('テーマ名を入力してください。');
    }

    if (
        parentThemeId !== null &&
        (!Number.isSafeInteger(parentThemeId) ||
            parentThemeId <= 0)
    ) {
        throw new Error(
            '親テーマが正しく指定されていません。',
        );
    }

    await insertTheme({
        name,
        parentThemeId,
    });
}