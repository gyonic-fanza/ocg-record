import { asc } from 'drizzle-orm';

import { db } from '../db';
import {
    themes,
    type NewTheme,
    type Theme,
} from '../db/schema/theme';

export type CreateThemeInput = Pick<
    NewTheme,
    'name' | 'parentThemeId'
>;

export async function getAllThemes(): Promise<Theme[]> {
    return db
        .select()
        .from(themes)
        .orderBy(asc(themes.name));
}

export async function createTheme(
    input: CreateThemeInput,
): Promise<void> {
    await db
        .insert(themes)
        .values(input);
}