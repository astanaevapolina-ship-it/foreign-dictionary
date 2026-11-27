'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [login, setLogin] = useState('student');
  const [password, setPassword] = useState('nsmk2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Неверный логин или пароль');
    }
  }

  return (
    <main className="px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center text-slate-900">Вход в словарь</h1>
        <p className="text-xs text-slate-600 text-center">
          Демо-доступ: логин <b>student</b>, пароль <b>nsmk2026</b>
        </p>

        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg text-center">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="login" className="block text-sm font-medium text-slate-700 mb-1">
            Логин
          </label>
          <input
            id="login"
            required
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full min-h-[44px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full min-h-[44px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[44px] bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>

        <div className="text-center pt-1">
          <Link href="/" className="inline-flex items-center justify-center min-h-[44px] text-xs text-slate-600 hover:text-slate-900 underline">
            Вернуться к просмотру словаря
          </Link>
        </div>
      </form>
    </main>
  );
}
