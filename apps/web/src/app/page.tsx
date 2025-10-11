import { Hero } from '@/components/hero';
import { ServiceCatalog } from '@/components/service-catalog';
import { DesignerSpotlight } from '@/components/designer-spotlight';
import { AdminOverview } from '@/components/admin-overview';

export default function HomePage() {
  return (
    <div className="space-y-14">
      <Hero />
      <ServiceCatalog />
      <DesignerSpotlight />
      <AdminOverview />
    </div>
  );
}
