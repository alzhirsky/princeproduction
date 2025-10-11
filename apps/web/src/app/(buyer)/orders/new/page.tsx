import { fetchService, fetchServices } from '@/lib/api';
import { notFound } from 'next/navigation';

interface NewOrderPageProps {
  searchParams?: { service?: string };
}

export default async function NewOrderPage({ searchParams }: NewOrderPageProps) {
  const requestedServiceId = searchParams?.service;

  let service = null;
  if (requestedServiceId) {
    try {
      service = await fetchService(requestedServiceId);
    } catch (error) {
      console.warn('Service not found, falling back to first available', error);
    }
  }

  if (!service) {
    const services = await fetchServices();
    service = services[0] ?? null;
  }

  if (!service) {
    notFound();
  }

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
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white"
              defaultValue={service.platform ?? ''}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-white/80">Формат</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white"
              defaultValue={service.format ?? ''}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-white/80">Сроки</span>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white"
              defaultValue={service.turnaround ?? ''}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-white/80">Дополнительно</span>
            <textarea
              className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white"
              placeholder="Референсы, брендбук, сценарий"
            />
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
