import Link from 'next/link';
import { ServiceSummary } from '@/lib/types';

interface ServiceCardProps {
  service: ServiceSummary;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const coverUrl =
    service.coverUrl ?? 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80';
  const description = service.description?.trim() ?? 'Описание скоро появится.';
  const format = service.format ?? '—';
  const turnaround = service.turnaround ?? '—';
  const platform = service.platform ?? '—';
  const designerAlias = service.designerAlias || 'Дизайнер платформы';

  return (
    <article className="glass glass-hover flex flex-col justify-between gap-6 p-6">
      <div className="space-y-4">
        <img
          src={coverUrl}
          alt={service.title}
          className="h-40 w-full rounded-2xl object-cover"
          loading="lazy"
        />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{service.title}</h3>
          <p className="text-sm text-white/60">{description}</p>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs text-white/50">
          <div>
            <dt className="uppercase tracking-[0.2em]">Формат</dt>
            <dd className="text-white/80">{format}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.2em]">Срок</dt>
            <dd className="text-white/80">{turnaround}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.2em]">Платформа</dt>
            <dd className="text-white/80">{platform}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.2em]">Стоимость</dt>
            <dd className="text-white/80">{service.totalPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</dd>
          </div>
        </dl>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Куратор: {designerAlias}</span>
        <Link
          href={`/orders/new?service=${service.id}`}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Заказать
        </Link>
      </div>
    </article>
  );
}
