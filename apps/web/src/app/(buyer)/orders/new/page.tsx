'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { sampleServices } from '@/lib/sample-data';
import { briefSchema } from '@prince/shared';
import { z } from 'zod';

const formSchema = z.object({
  goal: z.string().min(3),
  platform: z.string().min(2),
  format: z.string().min(2),
  deadline: z.string().min(3),
  notes: z.string().optional()
});

export default function NewOrderPage() {
  const params = useSearchParams();
  const serviceId = params.get('service');
  const service = useMemo(() => sampleServices.find((item) => item.id === serviceId) ?? sampleServices[0], [serviceId]);

  return (
    <div className="glass p-8">
      <h1 className="text-3xl font-semibold">Оформление заказа</h1>
      <p className="mt-2 text-sm text-white/60">Эскроу-холд создаётся после подтверждения стоимости.</p>
      <form className="mt-8 grid gap-6">
        <section>
          <h2 className="text-xl font-semibold">Услуга</h2>
          <p className="text-sm text-white/60">{service.description}</p>
          <p className="mt-2 text-lg font-semibold">
            {service.totalPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
          </p>
        </section>
        <section className="grid gap-4">
          <label className="space-y-2">
            <span className="text-sm text-white/80">Цель</span>
            <input className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white" defaultValue="Повысить CTR" />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-white/80">Платформа</span>
            <input className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white" defaultValue={service.platform} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-white/80">Формат</span>
            <input className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white" defaultValue={service.format} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-white/80">Сроки</span>
            <input className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white" defaultValue={service.turnaround} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-white/80">Дополнительно</span>
            <textarea className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white" placeholder="Референсы, брендбук, сценарий" />
          </label>
        </section>
        <button
          type="button"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:shadow-glow/70"
        >
          Перейти к оплате (мок)
        </button>
        <p className="text-xs text-white/50">
          Отправляя форму, вы соглашаетесь с удержанием средств в холде до подтверждения администратором.
        </p>
      </form>
    </div>
  );
}
