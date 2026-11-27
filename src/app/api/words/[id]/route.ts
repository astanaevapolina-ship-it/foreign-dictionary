import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { wordSchema } from '@/lib/validation';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (Object.keys(body).length === 1 && body.status) {
      const updated = await prisma.word.update({
        where: { id: Number(id) },
        data: { status: body.status },
      });
      return NextResponse.json(updated);
    }

    const parsed = wordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Ошибка валидации данных' },
        { status: 400 }
      );
    }

    const updated = await prisma.word.update({
      where: { id: Number(id) },
      data: parsed.data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Не удалось обновить запись' }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.word.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Запись не найдена' }, { status: 404 });
  }
}
