import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { wordSchema } from '@/lib/validation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const categoryId = searchParams.get('categoryId');
  const status = searchParams.get('status');

  const words = await prisma.word.findMany({
    where: {
      AND: [
        q ? { OR: [{ term: { contains: q } }, { translation: { contains: q } }] } : {},
        categoryId ? { categoryId: Number(categoryId) } : {},
        status ? { status } : {},
      ],
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(words);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = wordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Ошибка валидации данных' },
        { status: 400 }
      );
    }

    const word = await prisma.word.create({ data: parsed.data });
    return NextResponse.json(word, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Ошибка при создании слова' }, { status: 500 });
  }
}
