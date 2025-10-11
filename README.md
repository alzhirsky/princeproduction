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
cp .env.example .env.local              # при необходимости скорректируйте пути/порты
pnpm install
docker compose up -d database redis     # поднимает PostgreSQL и Redis по умолчанию
pnpm prisma migrate deploy              # применяет схему
pnpm prisma db seed                     # заполняет демо-данные

# Запускаем API и фронтенд в отдельных терминалах
pnpm --filter @prince/api start:dev     # API доступен на http://localhost:4000
pnpm --filter @prince/web dev           # веб-клиент на http://localhost:3000
```

> ⚠️ Веб-клиент читает `NEXT_PUBLIC_API_BASE_URL`. Убедитесь, что переменная указывает на адрес API (по умолчанию `http://localhost:4000`).

## Документация

- [docs/architecture.md](docs/architecture.md) — описание архитектуры, модулей и интеграций.
- [docs/infrastructure.md](docs/infrastructure.md) — рекомендации по инфраструктуре и docker-compose.
- [docs/miniapp-preview.html](docs/miniapp-preview.html) — статический предпросмотр Telegram mini-app.
- [docs/testing.md](docs/testing.md) — структура автотестов и сценарии.

## Следующие шаги

- Реализация реальных репозиториев Prisma вместо моков в сервисах.
- Подключение провайдера платежей и обработка webhook.
- Интеграция с Telegram Bot API и initData верификацией.
- Автоматические тесты (unit/e2e) и пайплайн CI/CD.

## Как посмотреть готовый интерфейс

1. Поднимите базу и выполните миграции/сид (см. раздел «Запуск локально»).
2. Запустите API (`pnpm --filter @prince/api start:dev`). После запуска доступны REST эндпоинты (`/services`, `/orders`, `/designer-applications`, `/payments`).
3. Запустите фронтенд (`pnpm --filter @prince/web dev`). Страницы:
   - `http://localhost:3000/catalog` — живая витрина услуг, данные приходят из API `/services`.
   - `http://localhost:3000/orders/new?service=<ID>` — форма оформления заказа с автоподстановкой данных из каталога.
   - `http://localhost:3000/orders/<ID>` — чат заказа с отправкой сообщений в API (`POST /orders/:id/messages`).
   - `http://localhost:3000/admin` / `.../designer` — демонстрация админки и кабинета дизайнера с моковыми карточками.
4. Мини-приложение Telegram доступно двумя способами:
   - Быстрый предпросмотр внутри Next.js — откройте `http://localhost:3000/miniapp` после запуска фронтенда.
   - Статическая демо-страница `docs/miniapp-preview.html` — подойдёт, если нужно просто взглянуть на визуал.

Подробная инструкция по запуску WebApp внутри Telegram описана в [docs/telegram-miniapp.md](docs/telegram-miniapp.md).

При необходимости соберите всё через Docker Compose (`docker compose up --build`) — конфигурация поднимает API, фронтенд и сервисы PostgreSQL/Redis. Подробнее в `docs/infrastructure.md`.

