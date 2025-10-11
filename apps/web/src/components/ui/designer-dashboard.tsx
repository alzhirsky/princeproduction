import { sampleServices } from '@/lib/sample-data';

const activeOrders = sampleServices.slice(0, 2).map((service, index) => ({
  id: `${service.id}-${index}`,
  title: service.title,
  status: index === 0 ? 'В работе' : 'Ожидает проверки',
  due: index === 0 ? 'Сегодня' : 'Завтра'
}));

export function DesignerDashboard() {
  return (
    <div className="space-y-6">
      <header className="glass p-6">
        <h1 className="text-3xl font-semibold">Мои заказы</h1>
        <p className="text-sm text-white/60">Баланс пополняется после подтверждения администратором.</p>
      </header>
      <section className="glass p-6">
        <h2 className="text-xl font-semibold">Активные</h2>
        <ul className="mt-4 space-y-4">
          {activeOrders.map((order) => (
            <li key={order.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-base font-medium">{order.title}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">{order.status}</p>
              </div>
              <span className="text-sm text-white/60">Срок: {order.due}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="glass p-6">
        <h2 className="text-xl font-semibold">Баланс</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Доступно</p>
            <p className="text-2xl font-semibold">₽ 42 800</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">В ожидании</p>
            <p className="text-2xl font-semibold">₽ 18 900</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Запросы на вывод</p>
            <p className="text-2xl font-semibold">2</p>
          </div>
        </div>
      </section>
    </div>
  );
}
