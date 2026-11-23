import { z } from 'zod';

export const wordSchema = z.object({
  term: z.string().min(1, 'Введите иностранное слово'),
  transcription: z.string().optional(),
  translation: z.string().min(1, 'Введите перевод'),
  example: z.string().optional(),
  status: z.enum(['NEW', 'LEARNING', 'LEARNED']).default('NEW'),
  categoryId: z.coerce.number().int().positive('Выберите категорию'),
});
