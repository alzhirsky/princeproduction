const sections = [
  {
    title: 'Каталог',
    description: 'CRUD по разделам и услугам, скрытая наценка, назначение дизайнеров.',
    actions: ['Добавить услугу', 'Импорт шаблонов', 'Назначить дизайнера']
  },
  {
    title: 'Заявки дизайнеров',
    description: 'Просмотр карточки, deep-link «Связаться в Telegram», решение по заявке.',
    actions: ['Открыть заявки', 'Проверить портфолио']
  },
  {
    title: 'Заказы и чаты',
    description: 'Фильтрация по статусу, вход в любой обезличенный чат, перевод статусов.',
    actions: ['Список заказов', 'Войти в чат']
  },
  {
    title: 'Финансы и выплаты',
    description: 'Эскроу холд/капчур, балансы дизайнеров, экспорт CSV, ручные корректировки.',
    actions: ['Подтвердить выплату', 'Экспорт отчёта']
  },
  {
    title: 'Споры и отзывы',
    description: 'Решение спорных ситуаций, частичные возвраты, модерация отзывов.',
    actions: ['Открыть споры', 'Скрыть отзыв']
  }
];

export function AdminControlPanel() {
  return (
    <section className="glass p-6">
      <h2 className="text-2xl font-semibold">Зоны управления</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <article key={section.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold">{section.title}</h3>
            <p className="mt-2 text-sm text-white/60">{section.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
              {section.actions.map((action) => (
                <span key={action} className="rounded-full bg-white/10 px-3 py-1">
                  {action}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
