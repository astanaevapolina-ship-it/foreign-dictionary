'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-md mx-auto mt-20 p-6 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
      <h1 className="text-xl font-bold text-slate-900 mb-2">Произошла ошибка при загрузке</h1>
      <p className="text-sm text-slate-600 mb-6">
        Не удалось обработать запрос. Попробуйте обновить страницу.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
      >
        Попробовать снова
      </button>
    </main>
  );
}
