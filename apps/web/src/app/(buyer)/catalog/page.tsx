import { ServiceCatalog } from '@/components/service-catalog';
import { motion } from 'framer-motion';
import { fetchServices } from '@/lib/api';

export default async function CatalogPage() {
  const services = await fetchServices();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <header className="glass p-8">
        <h1 className="text-3xl font-semibold">Каталог</h1>
        <p className="mt-2 text-sm text-white/60">
          Публично доступные услуги с фильтрами и i18n-готовой структурой.
        </p>
      </header>
      <ServiceCatalog services={services} />
    </motion.div>
  );
}
