'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState('student');
  const [password, setPassword] = useState('nsmk2026');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Неверный логин или пароль');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 p-6 bg-white border rounded-xl space-y-4 shadow-sm">
      <h1 className="text-xl font-bold text-center">Вход в словарь</h1>
      <p className="text-xs text-slate-500 text-center">
        Демо-доступ: логин <b>student</b>, пароль <b>nsmk2026</b>
      </p>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      <div>
        <label className="block text-sm font-medium mb-1">Логин</label>
        <input
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
      >
        Войти
      </button>
      <div className="text-center">
        <Link href="/" className="text-xs text-slate-500 hover:underline">
          Назад к просмотру словаря
        </Link>
      </div>
    </form>
  );
}
