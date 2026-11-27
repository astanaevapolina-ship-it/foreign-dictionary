import { z } from 'zod';

export const wordSchema = z.object({
  term: z.string().trim().min(1, 'Введите иностранное слово'),
  transcription: z.string().trim().optional(),
  translation: z.string().trim().min(1, 'Введите перевод'),
  example: z.string().trim().optional(),
  status: z.enum(['NEW', 'LEARNING', 'LEARNED']).default('NEW'),
  categoryId: z.coerce.number().int().positive('Выберите категорию'),
});
