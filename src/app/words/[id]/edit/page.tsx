import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import WordForm from '@/components/WordForm';

export const metadata: Metadata = {
  title: 'Редактирование слова — LexiNote Словарь слов',
  description: 'Изменение перевода, примера использования, категории или статуса изученности слова.',
};

export default async function EditWordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    notFound();
  }

  const [word, categories] = await Promise.all([
    prisma.word.findUnique({ where: { id: numericId } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!word) notFound();

  return (
    <WordForm
      categories={categories}
      initialData={{
        id: word.id,
        term: word.term,
        transcription: word.transcription || '',
        translation: word.translation,
        example: word.example || '',
        status: word.status,
        categoryId: word.categoryId,
      }}
    />
  );
}
