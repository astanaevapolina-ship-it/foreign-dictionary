import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { login, password } = await request.json();

  if (login === 'student' && password === 'nsmk2026') {
    const cookieStore = await cookies();
    cookieStore.set('auth_session', 'authenticated', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_session');
  return NextResponse.json({ success: true });
}
