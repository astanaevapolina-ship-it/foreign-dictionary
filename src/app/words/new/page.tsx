import { prisma } from '@/lib/prisma';
import WordForm from '@/components/WordForm';

export const dynamic = 'force-dynamic';

export default async function NewWordPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return <WordForm categories={categories} />;
}
