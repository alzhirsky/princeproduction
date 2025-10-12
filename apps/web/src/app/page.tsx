import { Hero } from '@/components/hero';
import { ServiceCatalog } from '@/components/service-catalog';
import { DesignerSpotlight } from '@/components/designer-spotlight';
import { AdminOverview } from '@/components/admin-overview';
import { fetchServices } from '@/lib/api';
import type { ServiceSummary } from '@/lib/types';

export default async function HomePage() {
  let services: ServiceSummary[] | undefined;

  try {
    const apiServices = await fetchServices();
    if (apiServices.length > 0) {
      services = apiServices;
    } else {
      console.info('Каталог пуст — на главной показаны демонстрационные услуги');
      services = undefined;
    }
  } catch (error) {
    console.warn('Не удалось получить каталог для главной страницы, показаны демо-данные', error);
  }

  return (
    <div className="space-y-14">
      <Hero />
      <ServiceCatalog services={services} showFallbackNotice={false} />
      <DesignerSpotlight />
      <AdminOverview />
    </div>
  );
}
