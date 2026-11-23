import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import WordForm from '@/components/WordForm';

export const dynamic = 'force-dynamic';

export default async function EditWordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wordId = Number(id);
  if (Number.isNaN(wordId)) notFound();

  const [word, categories] = await Promise.all([
    prisma.word.findUnique({ where: { id: wordId } }),
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
