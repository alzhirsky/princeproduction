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

## Подготовка окружения

1. Скопируйте шаблон `.env.example` в `.env.local` и скорректируйте переменные при необходимости.
2. При работе через Docker создайте файлы окружения для сервисов (доступны шаблоны в `deploy/env/*.dev.env.example`):

   ```bash
   cp deploy/env/postgres.dev.env.example deploy/env/postgres.env
   cp deploy/env/api.dev.env.example deploy/env/api.env
   cp deploy/env/web.dev.env.example deploy/env/web.env
   ```

3. Для продакшена используйте шаблоны `deploy/env/*.prod.env.example` и задайте собственные пароли/секреты/домены.

## Запуск локально

> Требования: Node.js ≥ 18.17, pnpm ≥ 8, Docker (для PostgreSQL/Redis), Prisma CLI.

```bash
pnpm install
docker compose up -d postgres redis     # поднимает PostgreSQL и Redis по умолчанию
pnpm prisma migrate deploy              # применяет схему
pnpm prisma db seed                     # заполняет демо-данные

# Запускаем API и фронтенд в отдельных терминалах
pnpm --filter @prince/api start:dev     # API доступен на http://localhost:4000
pnpm --filter @prince/web dev           # веб-клиент на http://localhost:3000
```

> ⚠️ Веб-клиент читает `NEXT_PUBLIC_API_BASE_URL`. При локальной разработке укажите `http://localhost:4000`; при работе в Docker значение в `deploy/env/web.env` должно ссылаться на публичный домен (например, `https://api.princeproduction.ru`) и дополнительно установите `API_BASE_URL=http://api:4000` для внутренних серверных запросов.

## Документация

- [docs/architecture.md](docs/architecture.md) — описание архитектуры, модулей и интеграций.
- [docs/infrastructure.md](docs/infrastructure.md) — рекомендации по инфраструктуре и docker-compose.
- [docs/miniapp-preview.html](docs/miniapp-preview.html) — статический предпросмотр Telegram mini-app.
- [docs/telegram-miniapp.md](docs/telegram-miniapp.md) — подробный гайд по запуску WebApp.
- [docs/telegram-miniapp.html](docs/telegram-miniapp.html) — HTML-версия гайда (на случай, если IDE не поддерживает Markdown Preview).
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

### Если `pnpm install` выдаёт `403` в песочнице

Иногда в изолированных окружениях (онлайн-песочницы, CI без прямого доступа к npm) команда установки зависимостей завершается ошибкой `403 Forbidden`. Это означает, что среда блокирует исходящие запросы к реестру npm, а не проблему в репозитории. Запускайте `pnpm install` на локальной машине или сервере с доступом в интернет — команда успешно завершится, и остальные шаги (`prisma migrate`, запуск сервисов) будут работать штатно.

## Продакшн на Ubuntu 22 + собственный домен

- В директории `deploy/` находится production-компоновка (`docker-compose.prod.yml`) и `Caddyfile` с готовым обратным прокси, автоматически получающим TLS-сертификаты.
- Пошаговый гайд с подготовкой VPS, DNS, SSL и запуском контейнеров опубликован в [docs/deployment-ubuntu.md](docs/deployment-ubuntu.md).

## Быстрый чек-лист деплоя на app.princeproduction.ru

1. **DNS** — убедитесь, что `app.princeproduction.ru` и `api.princeproduction.ru` указывают на IP вашего VPS (например, `95.181.213.96`).
2. **Сервер** — выполните `sudo apt update && sudo apt upgrade -y`, установите Docker (`curl -fsSL https://get.docker.com | sudo sh`) и добавьте пользователя в группу `docker`.
3. **Код** — клонируйте репозиторий и переключитесь на нужную ветку:
   ```bash
   git clone https://github.com/alzhirsky/princeproduction.git
   cd princeproduction
   git checkout codex/generate-production-level-code-for-ios-style-platform
   ```
4. **Переменные окружения** — создайте `deploy/env/postgres.env`, `deploy/env/api.env`, `deploy/env/web.env` из соответствующих `*.prod.env.example` и пропишите пароли/секреты, `NEXT_PUBLIC_API_BASE_URL=https://api.princeproduction.ru`.
5. **Caddy** — при необходимости обновите e-mail в `deploy/Caddyfile` (по умолчанию `admin@princeproduction.ru`).
6. **Запуск** — выполните `docker compose -f deploy/docker-compose.prod.yml up -d --build`.
7. **Сид данных (опционально)** — `docker compose -f deploy/docker-compose.prod.yml exec api pnpm prisma db seed`.
8. **Проверка** — откройте `https://app.princeproduction.ru` и `https://api.princeproduction.ru/services`.

Детальные пояснения и команды приведены в [docs/deployment-ubuntu.md](docs/deployment-ubuntu.md).

