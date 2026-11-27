'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Category = { id: number; name: string };
type WordData = {
  id?: number;
  term: string;
  transcription: string;
  translation: string;
  example: string;
  status: string;
  categoryId: number;
};

export default function WordForm({
  categories,
  initialData,
}: {
  categories: Category[];
  initialData?: WordData;
}) {
  const router = useRouter();
  const [form, setForm] = useState<WordData>(
    initialData || {
      term: '',
      transcription: '',
      translation: '',
      example: '',
      status: 'NEW',
      categoryId: categories[0]?.id || 1,
    }
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    const url = initialData?.id ? `/api/words/${initialData.id}` : '/api/words';
    const method = initialData?.id ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Проверьте правильность заполнения обязательных полей.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <main className="px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 space-y-4 bg-white border border-slate-200 rounded-xl shadow-sm"
      >
        <h1 className="text-xl font-bold text-slate-900">
          {initialData?.id ? 'Редактировать слово' : 'Добавить новое слово'}
        </h1>

        {error && (
          <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="term" className="block text-sm font-medium text-slate-700 mb-1">
            Иностранное слово *
          </label>
          <input
            id="term"
            required
            value={form.term}
            onChange={(e) => setForm({ ...form, term: e.target.value })}
            className="w-full min-h-[44px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Например: Achievement"
          />
        </div>

        <div>
          <label htmlFor="transcription" className="block text-sm font-medium text-slate-700 mb-1">
            Транскрипция
          </label>
          <input
            id="transcription"
            value={form.transcription}
            onChange={(e) => setForm({ ...form, transcription: e.target.value })}
            className="w-full min-h-[44px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="[əˈtʃiːvmənt]"
          />
        </div>

        <div>
          <label htmlFor="translation" className="block text-sm font-medium text-slate-700 mb-1">
            Перевод *
          </label>
          <input
            id="translation"
            required
            value={form.translation}
            onChange={(e) => setForm({ ...form, translation: e.target.value })}
            className="w-full min-h-[44px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Достижение"
          />
        </div>

        <div>
          <label htmlFor="example" className="block text-sm font-medium text-slate-700 mb-1">
            Пример использования
          </label>
          <textarea
            id="example"
            value={form.example}
            onChange={(e) => setForm({ ...form, example: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
            placeholder="Completing this project is a great achievement."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 mb-1">
              Категория *
            </label>
            <select
              id="categoryId"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
              className="w-full min-h-[44px] border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
              Статус изученности
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full min-h-[44px] border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="NEW">Новое</option>
              <option value="LEARNING">Изучается</option>
              <option value="LEARNED">Выучено</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Отмена
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center min-h-[44px] bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </main>
  );
}
