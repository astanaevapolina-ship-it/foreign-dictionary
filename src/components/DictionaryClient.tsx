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
  NEW: { label: 'Новое', color: 'bg-slate-200 text-slate-800' },
  LEARNING: { label: 'Изучается', color: 'bg-amber-100 text-amber-900' },
  LEARNED: { label: 'Выучено', color: 'bg-emerald-100 text-emerald-900' },
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
    <main className="max-w-5xl mx-auto px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-indigo-600 shrink-0" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-slate-900">LexiNote — Словарь слов</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-700">
            Выучено: <b>{learnedCount}</b> из <b>{words.length}</b>
          </span>
          {isAuth ? (
            <>
              <Link
                href="/words/new"
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" aria-hidden="true" /> Добавить слово
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center min-h-[44px] text-sm text-slate-700 hover:text-slate-900 px-4 py-2 border border-slate-300 bg-white rounded-lg"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center min-h-[44px] bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
            >
              Войти для редактирования
            </Link>
          )}
        </div>
      </header>

      <section aria-label="Поиск и фильтрация" className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" aria-hidden="true" />
          <input
            type="text"
            aria-label="Поиск по слову или переводу"
            placeholder="Поиск по слову или переводу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-h-[44px] pl-9 pr-3 py-2 border border-slate-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          aria-label="Фильтр по категории"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="min-h-[44px] border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Фильтр по статусу изученности"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="min-h-[44px] border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">Любой статус изученности</option>
          <option value="NEW">Новое</option>
          <option value="LEARNING">Изучается</option>
          <option value="LEARNED">Выучено</option>
        </select>
      </section>

      {filteredWords.length === 0 ? (
        <p className="text-center text-slate-600 py-12">Слова по заданным параметрам не найдены.</p>
      ) : (
        <section aria-label="Список карточек слов" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((word) => (
            <article
              key={word.id}
              className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 break-words">{word.term}</h2>
                    {word.transcription && (
                      <p className="text-sm text-slate-600 font-mono">{word.transcription}</p>
                    )}
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 shrink-0">
                    {word.category.name}
                  </span>
                </div>

                <p className="mt-3 text-base font-medium text-slate-800">{word.translation}</p>

                {word.example && (
                  <p className="mt-2 text-sm text-slate-600 italic">«{word.example}»</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <select
                  aria-label={`Статус слова ${word.term}`}
                  value={word.status}
                  onChange={(e) => handleStatusChange(word.id, e.target.value)}
                  className={`min-h-[44px] text-xs font-semibold px-3 py-2 rounded-lg border-0 cursor-pointer ${
                    STATUS_LABELS[word.status]?.color || 'bg-slate-200 text-slate-800'
                  }`}
                >
                  <option value="NEW">Новое</option>
                  <option value="LEARNING">Изучается</option>
                  <option value="LEARNED">Выучено</option>
                </select>

                {isAuth && (
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/words/${word.id}/edit`}
                      className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-600 hover:text-indigo-700 hover:bg-slate-50 rounded-lg"
                      title="Редактировать"
                      aria-label={`Редактировать слово ${word.term}`}
                    >
                      <Edit className="w-4 h-4" aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(word.id)}
                      className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      title="Удалить"
                      aria-label={`Удалить слово ${word.term}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
