import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import WordForm from '@/components/WordForm';

export const metadata: Metadata = {
  title: 'Добавить новое слово — LexiNote Словарь слов',
  description: 'Форма создания новой карточки иностранного слова с транскрипцией, переводом и категорией.',
};

export default async function NewWordPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return <WordForm categories={categories} />;
}
