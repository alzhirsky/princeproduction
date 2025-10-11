import Link from 'next/link';
import { ServiceSummary } from '@/lib/types';

interface ServiceCardProps {
  service: ServiceSummary;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="glass glass-hover flex flex-col justify-between gap-6 p-6">
      <div className="space-y-4">
        <img
          src={service.coverUrl}
          alt={service.title}
          className="h-40 w-full rounded-2xl object-cover"
          loading="lazy"
        />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{service.title}</h3>
          <p className="text-sm text-white/60">{service.description}</p>
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs text-white/50">
          <div>
            <dt className="uppercase tracking-[0.2em]">Формат</dt>
            <dd className="text-white/80">{service.format}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.2em]">Срок</dt>
            <dd className="text-white/80">{service.turnaround}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.2em]">Платформа</dt>
            <dd className="text-white/80">{service.platform}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-[0.2em]">Стоимость</dt>
            <dd className="text-white/80">{service.totalPrice.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</dd>
          </div>
        </dl>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Куратор: {service.designerAlias}</span>
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
