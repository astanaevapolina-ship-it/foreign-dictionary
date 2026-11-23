'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, Trash2, Edit, BookOpen } from 'lucide-react';

type Category = { id: number; name: string };
type Word = {
  id: number;
  term: string;
  transcription: string | null;
  translation: string;
  example: string | null;
  status: string;
  categoryId: number;
  category: Category;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Новое', color: 'bg-slate-100 text-slate-700' },
  LEARNING: { label: 'Изучается', color: 'bg-amber-100 text-amber-800' },
  LEARNED: { label: 'Выучено', color: 'bg-emerald-100 text-emerald-800' },
};

export default function DictionaryClient({
  initialWords,
  categories,
  isAuth,
}: {
  initialWords: Word[];
  categories: Category[];
  isAuth: boolean;
}) {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>(initialWords);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.term.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory ? w.categoryId === Number(selectedCategory) : true;
    const matchesStatus = selectedStatus ? w.status === selectedStatus : true;
    return matchesSearch && matchesCat && matchesStatus;
  });

  async function handleStatusChange(id: number, newStatus: string) {
    const res = await fetch(`/api/words/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setWords((prev) => prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w)));
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить это слово из словаря?')) return;
    const res = await fetch(`/api/words/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setWords((prev) => prev.filter((w) => w.id !== id));
    }
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.refresh();
  }

  const learnedCount = words.filter((w) => w.status === 'LEARNED').length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b">
        <div className="flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-900">LexiNote — Словарь слов</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">
            Выучено: <b>{learnedCount}</b> из <b>{words.length}</b>
          </span>
          {isAuth ? (
            <>
              <Link
                href="/words/new"
                className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" /> Добавить слово
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 border rounded-lg bg-white"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
            >
              Войти для редактирования
            </Link>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по слову или переводу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Любой статус изученности</option>
          <option value="NEW">Новое</option>
          <option value="LEARNING">Изучается</option>
          <option value="LEARNED">Выучено</option>
        </select>
      </div>

      {filteredWords.length === 0 ? (
        <p className="text-center text-slate-500 py-12">Слова по заданным параметрам не найдены.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className="border rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{word.term}</h2>
                    {word.transcription && (
                      <p className="text-sm text-slate-400 font-mono">{word.transcription}</p>
                    )}
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {word.category.name}
                  </span>
                </div>

                <p className="mt-3 text-base font-medium text-slate-800">{word.translation}</p>

                {word.example && (
                  <p className="mt-2 text-sm text-slate-500 italic">«{word.example}»</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between gap-2">
                <select
                  value={word.status}
                  onChange={(e) => handleStatusChange(word.id, e.target.value)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md border-0 cursor-pointer ${
                    STATUS_LABELS[word.status]?.color || 'bg-slate-100'
                  }`}
                >
                  <option value="NEW">Новое</option>
                  <option value="LEARNING">Изучается</option>
                  <option value="LEARNED">Выучено</option>
                </select>

                {isAuth && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/words/${word.id}/edit`}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 rounded"
                      title="Редактировать"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(word.id)}
                      className="p-1.5 text-slate-500 hover:text-red-600 rounded"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
