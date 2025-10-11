# Prince Production Platform

Моно-репозиторий с фронтендом на Next.js и бэкендом на NestJS для платформы визуального продакшена в эстетике iOS «liquid glass».

## Структура

```
apps/
  web/      # Next.js App Router + Tailwind UI
  api/      # NestJS API + WebSocket шлюз
packages/
  shared/   # Общие схемы и типы (zod, роли, статусы)
prisma/     # Prisma schema и сид-скрипт
```

## Возможности текущей версии

- Демонстрационный интерфейс каталога, заказов, админки и Telegram Mini App в стилистике liquid glass.
- Zustand-хранилище для клиентской сессии, компоненты для чатов и стеклянных карточек.
- NestJS API-модули: каталог, заказы, дизайнеры, платежи, админ-обзор, WebSocket-чат.
- Общие схемы в `@prince/shared` для фронта и бэка.
- Prisma-схема доменных моделей и сид с тестовыми данными.

## Запуск локально

> Требования: Node.js ≥ 18.17, pnpm ≥ 8, Docker (для PostgreSQL/Redis), Prisma CLI.

```bash
pnpm install
pnpm --filter @prince/web dev    # фронтенд на http://localhost:3000
pnpm --filter @prince/api start:dev  # API на http://localhost:4000
```

Для запуска базы данных используйте docker-compose (см. `docs/infrastructure.md`). После поднятия БД выполните миграции и сид:

```bash
npx prisma migrate dev
npx ts-node prisma/seed.ts
```

## Документация

- [docs/architecture.md](docs/architecture.md) — описание архитектуры, модулей и интеграций.
- [docs/infrastructure.md](docs/infrastructure.md) — рекомендации по инфраструктуре и docker-compose.
- [docs/testing.md](docs/testing.md) — структура автотестов и сценарии.

## Следующие шаги

- Реализация реальных репозиториев Prisma вместо моков в сервисах.
- Подключение провайдера платежей и обработка webhook.
- Интеграция с Telegram Bot API и initData верификацией.
- Автоматические тесты (unit/e2e) и пайплайн CI/CD.

