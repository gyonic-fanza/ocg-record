import {
    createLimitRegulation as insertLimitRegulation,
} from '../repositories';

export type CreateLimitRegulationInput = {
  name: string;
  startDate: Date;
  endDate?: Date | null;
};

export async function createLimitRegulation(
  input: CreateLimitRegulationInput,
): Promise<void> {
  const name = input.name.trim();
  const { startDate } = input;
  const endDate = input.endDate ?? null;

  if (!name) {
    throw new Error(
      'リミットレギュレーション名を入力してください。',
    );
  }

  if (Number.isNaN(startDate.getTime())) {
    throw new Error('開始日が正しくありません。');
  }

  if (
    endDate !== null &&
    Number.isNaN(endDate.getTime())
  ) {
    throw new Error('終了日が正しくありません。');
  }

  if (
    endDate !== null &&
    endDate.getTime() < startDate.getTime()
  ) {
    throw new Error(
      '終了日は開始日以降の日付を指定してください。',
    );
  }

  await insertLimitRegulation({
    name,
    startDate,
    endDate,
  });
}