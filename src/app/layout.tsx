import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LexiNote — Словарь иностранных слов',
  description: 'Учебный проект по практике УП.01 (Next.js + SQLite + Prisma)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
