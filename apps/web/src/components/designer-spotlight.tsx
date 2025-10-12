import { Avatar } from './ui/avatar';
import { sampleDesigners } from '@/lib/sample-data';

export function DesignerSpotlight() {
  const featured = sampleDesigners.filter((designer) => designer.status === 'approved').slice(0, 3);

  return (
    <section className="glass glass-hover grid gap-6 p-8 md:grid-cols-[1.2fr,1fr]">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Верифицированные дизайнеры</h2>
        <p className="text-sm text-white/60">
          Заявки проходят модерацию. Администратор видит портфолио и связывается через Telegram deep-link перед одобрением.
        </p>
        <ul className="space-y-4">
          {featured.map((designer) => (
            <li key={designer.id} className="flex items-center gap-4">
              <Avatar name={designer.alias} accent={designer.accent} />
              <div>
                <p className="text-base font-medium">{designer.alias}</p>
                <p className="text-sm text-white/60">{designer.skills.join(' · ')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70 backdrop-blur-xl">
        <p className="font-medium text-white">Как стать дизайнером платформы?</p>
        <ol className="list-decimal space-y-2 pl-6">
          <li>Заполните заявку с портфолио и ссылками.</li>
          <li>Дождитесь контакта администратора через Telegram.</li>
          <li>Получите доступ к заказам и защищённым чатам.</li>
        </ol>
      </div>
    </section>
  );
}
