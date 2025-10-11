import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/state/providers';

export const metadata: Metadata = {
  title: 'Prince Production Studio',
  description: 'Платформа визуального продакшена в эстетике liquid glass.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>
          <main className="min-h-screen">
            <div className="mx-auto w-full max-w-6xl px-6 py-10">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
