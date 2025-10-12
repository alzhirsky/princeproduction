import { SparklesIcon } from '@heroicons/react/24/outline';
import { Badge } from './ui/badge';
import { ServiceCard } from './ui/service-card';
import { ServiceSummary } from '@/lib/types';
import { sampleServices } from '@/lib/sample-data';

interface ServiceCatalogProps {
  services?: ServiceSummary[];
  showFallbackNotice?: boolean;
}

export function ServiceCatalog({ services, showFallbackNotice = true }: ServiceCatalogProps) {
  const catalogItems = services && services.length > 0 ? services : sampleServices;
  const isFallback = !services || services.length === 0;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Каталог услуг</h2>
          <p className="text-sm text-white/60">Фильтры по формату, платформе и срокам; готов к Telegram WebApp.</p>
        </div>
        <Badge variant="outline" icon={SparklesIcon}>
          Liquid Glass UI
        </Badge>
      </header>
      {isFallback && showFallbackNotice ? (
        <p className="text-sm text-white/60">
          Каталог недоступен или пуст.
          <br />
          Ниже показаны демо-услуги; настройте NEXT_PUBLIC_API_BASE_URL, чтобы увидеть реальные данные.
        </p>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {catalogItems.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
