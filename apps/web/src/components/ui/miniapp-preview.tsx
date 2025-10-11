import Image from 'next/image';

export function MiniAppPreview() {
  return (
    <section className="glass grid gap-8 p-8 md:grid-cols-[1.2fr,1fr]">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Telegram Mini App</h1>
        <p className="text-sm text-white/60">
          Веб-клиент адаптирован под WebApp API Telegram: авторизация через initData, компактный каталог, чаты и баланс.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
          <li>Плавная анимация и стеклянные карточки в мобильном формате.</li>
          <li>Поддержка тёмной темы Telegram и динамических размеров.</li>
          <li>Быстрые действия: запрос правок, подтверждение, отмена.</li>
        </ul>
      </div>
      <div className="relative">
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/0 blur-3xl" aria-hidden />
        <div className="relative mx-auto h-[500px] w-[260px] rounded-[2.5rem] border border-white/20 bg-white/10 p-4 shadow-glass">
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-black/80">
            <Image
              src="https://images.unsplash.com/photo-1529338296731-c4280a44fc48?auto=format&fit=crop&w=600&q=80"
              alt="Телеграм мини-апп"
              fill
              className="object-cover opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
