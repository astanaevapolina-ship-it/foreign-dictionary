import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-md mx-auto mt-20 p-6 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Страница не найдена (404)</h1>
      <p className="text-sm text-slate-600 mb-6">
        Запрашиваемая карточка слова или страница не существует.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
      >
        Вернуться в словарь
      </Link>
    </main>
  );
}
