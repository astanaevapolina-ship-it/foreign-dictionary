import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import DictionaryClient from '@/components/DictionaryClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuth = Boolean(cookieStore.get('auth_session'));

  const [words, categories] = await Promise.all([
    prisma.word.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return <DictionaryClient initialWords={words} categories={categories} isAuth={isAuth} />;
}
