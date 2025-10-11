import { SparklesIcon } from '@heroicons/react/24/outline';
import { Badge } from './ui/badge';
import { ServiceCard } from './ui/service-card';
import { ServiceSummary } from '@/lib/types';

interface ServiceCatalogProps {
  services: ServiceSummary[];
}

export function ServiceCatalog({ services }: ServiceCatalogProps) {
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
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
