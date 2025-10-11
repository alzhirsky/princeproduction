import { AdminOverview } from '@/components/admin-overview';
import { AdminControlPanel } from '@/components/ui/admin-control-panel';

export default function AdminPage() {
  return (
    <div className="space-y-10">
      <header className="glass p-8">
        <h1 className="text-3xl font-semibold">Админ-панель</h1>
        <p className="mt-2 text-sm text-white/60">
          Контроль каталога, заказов, заявок дизайнеров, финансов и споров. Все операции фиксируются в логах.
        </p>
      </header>
      <AdminOverview />
      <AdminControlPanel />
    </div>
  );
}
