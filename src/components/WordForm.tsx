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
    setError('');
    setLoading(true);

    const url = initialData?.id ? `/api/words/${initialData.id}` : '/api/words';
    const method = initialData?.id ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      setError('Проверьте правильность заполнения обязательных полей.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-4 bg-white border rounded-xl mt-8 shadow-sm">
      <h1 className="text-xl font-bold">
        {initialData?.id ? 'Редактировать слово' : 'Добавить новое слово'}
      </h1>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Иностранное слово *</label>
        <input
          required
          value={form.term}
          onChange={(e) => setForm({ ...form, term: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Например: Achievement"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Транскрипция</label>
        <input
          value={form.transcription}
          onChange={(e) => setForm({ ...form, transcription: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="[əˈtʃiːvmənt]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Перевод *</label>
        <input
          required
          value={form.translation}
          onChange={(e) => setForm({ ...form, translation: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Достижение"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Пример использования</label>
        <textarea
          value={form.example}
          onChange={(e) => setForm({ ...form, example: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm"
          rows={2}
          placeholder="Completing this project is a great achievement."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Категория *</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Статус изученности</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="NEW">Новое</option>
            <option value="LEARNING">Изучается</option>
            <option value="LEARNED">Выучено</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Link href="/" className="px-4 py-2 text-sm border rounded-lg">
          Отмена
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}
