'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass glass-hover p-10"
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm uppercase tracking-[0.3em] text-white/60">
            Liquid Glass Production Hub
          </span>
          <h1 className="text-4xl font-semibold md:text-5xl">Визуал для соцсетей под ключ</h1>
          <p className="max-w-2xl text-lg text-white/70">
            Каталог услуг, эскроу-оплата, обезличенные чаты и контроль качества — в одном интерфейсе, готовом к Telegram
            Mini App.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
          >
            Открыть каталог
          </Link>
          <Link href="/admin" className="text-sm text-white/60 hover:text-white">
            Войти как администратор
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
