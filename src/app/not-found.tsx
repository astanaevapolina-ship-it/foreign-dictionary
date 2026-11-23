import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-slate-900">Страница или запись не найдена</h2>
      <p className="text-slate-500 mt-2">Возможно, слово было удалено из словаря.</p>
      <Link
        href="/"
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
      >
        Вернуться к словарю
      </Link>
    </div>
  );
}
