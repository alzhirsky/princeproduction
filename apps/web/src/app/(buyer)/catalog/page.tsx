import { ServiceCatalog } from '@/components/service-catalog';
import { fetchServices } from '@/lib/api';
import type { ServiceSummary } from '@/lib/types';

export default async function CatalogPage() {
  let services: ServiceSummary[] | undefined;

  try {
    const apiServices = await fetchServices();
    if (apiServices.length > 0) {
      services = apiServices;
    } else {
      console.info('Каталог пуст — на странице каталога показаны демонстрационные услуги');
      services = undefined;
    }
  } catch (error) {
    console.warn('Не удалось загрузить каталог из API, используется пресет', error);
  }

  return (
    <div className="space-y-10">
      <header className="glass p-8">
        <h1 className="text-3xl font-semibold">Каталог</h1>
        <p className="mt-2 text-sm text-white/60">
          Публично доступные услуги с фильтрами и i18n-готовой структурой.
        </p>
      </header>
      <ServiceCatalog services={services} />
    </div>
  );
}
