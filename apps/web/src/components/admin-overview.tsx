import { ShieldCheckIcon, BanknotesIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { AdminStatCard } from './ui/admin-stat-card';

const stats = [
  {
    id: 'orders',
    label: 'Активные заказы',
    value: '12',
    trend: '+3 сегодня',
    icon: ChatBubbleBottomCenterTextIcon,
    description: 'Администратор может войти в любой обезличенный чат и подтвердить выполнение.'
  },
  {
    id: 'applications',
    label: 'Заявки дизайнеров',
    value: '4',
    trend: '2 ожидают связи',
    icon: ShieldCheckIcon,
    description: 'Просмотр портфолио, deep-link в Telegram, кнопки «Принять/Отклонить».'
  },
  {
    id: 'balance',
    label: 'Выплаты дизайнерам',
    value: '₽ 128 400',
    trend: '3 заявки на вывод',
    icon: BanknotesIcon,
    description: 'Эскроу холд, capture после подтверждения, CSV для бухгалтерии.'
  }
];

export function AdminOverview() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Админ-панель</h2>
        <p className="text-sm text-white/60">
          Управление каталогом, заявками, чатами, финансами и спорами. Все действия логируются.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <AdminStatCard key={stat.id} {...stat} />
        ))}
      </div>
    </section>
  );
}
