export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-slate-200 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-11 bg-slate-200 rounded-lg" />
          <div className="h-11 bg-slate-200 rounded-lg" />
          <div className="h-11 bg-slate-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="h-40 bg-slate-200 rounded-xl" />
          <div className="h-40 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
