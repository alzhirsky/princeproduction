# Развёртывание на Ubuntu 22.04 с доменом app.princeproduction.ru

Пошаговое руководство по запуску платформы на VPS с Ubuntu 22.04 LTS и доменом, зарегистрированным на reg.ru. Аналогичный сценарий подойдёт для любого другого домена — замените имена хостов и e-mail.

## 1. Предпосылки

- Активный VPS с Ubuntu 22.04 и публичным IP.
- Домен `princeproduction.ru` (или другой), доступ к панели DNS.
- Пользователь с правами `sudo` на сервере.

## 2. Настройка DNS

Убедитесь, что в панели управления reg.ru созданы A-записи:

1. `app.princeproduction.ru` → `95.181.213.96` (или ваш фактический IP VPS) — фронтенд.
2. `api.princeproduction.ru` → `95.181.213.96` — API и WebSocket.

Опционально можно добавить корневой домен `princeproduction.ru` и `www` (CNAME на `app`), но для работы мини-приложения достаточно двух записей выше.

DNS может обновляться до 30 минут. Продолжайте настройку сервера параллельно.

## 3. Подготовка сервера

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем вспомогательные пакеты
sudo apt install -y ca-certificates curl git ufw

# Устанавливаем Docker Engine и compose plugin
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker  # применяем группу без выхода

# Настраиваем UFW (опционально)
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

Перезайдите в сессию SSH, чтобы права Docker вступили в силу.

## 4. Клонирование репозитория

```bash
cd ~
git clone https://github.com/alzhirsky/princeproduction.git
cd princeproduction
git checkout codex/generate-production-level-code-for-ios-style-platform
```

> Если используется форк, замените URL на адрес своего репозитория. Команда `git checkout` переключит проект на ветку с актуальным кодом платформы.

## 5. Подготовка переменных окружения

Скопируйте шаблоны и отредактируйте их под продакшн:

```bash
cp deploy/env/postgres.prod.env.example deploy/env/postgres.env
cp deploy/env/api.prod.env.example deploy/env/api.env
cp deploy/env/web.prod.env.example deploy/env/web.env
```

Отредактируйте созданные файлы:

- `deploy/env/postgres.env` — задайте надёжный пароль БД.
- `deploy/env/api.env` — обновите `DATABASE_URL` (пароль должен совпадать с БД) и задайте длинный `JWT_SECRET`.
- `deploy/env/web.env` — укажите `NEXT_PUBLIC_API_BASE_URL=https://api.princeproduction.ru`. Значение `API_BASE_URL` оставьте `http://api:4000` для внутренних серверных запросов.

При необходимости обновите `deploy/Caddyfile`:

```text
{
  email admin@princeproduction.ru  # укажите рабочий email для Let's Encrypt уведомлений
}

app.princeproduction.ru {
  reverse_proxy web:3000
}

api.princeproduction.ru {
  reverse_proxy api:4000
  # ...
}
```

> Caddy автоматически выпустит TLS-сертификаты, когда записи `app` и `api` будут указывать на ваш IP.

## 6. Сборка и запуск контейнеров

```bash
# Собираем и запускаем в фоне
docker compose -f deploy/docker-compose.prod.yml up -d --build
```

Образы будут собраны локально, затем контейнеры стартуют в такой конфигурации:

- `postgres` — база данных.
- `redis` — брокер/кэш.
- `api` — NestJS API (прогоняет миграции при запуске).
- `web` — Next.js фронтенд в production-режиме.
- `caddy` — обратный прокси и TLS-терминатор.

Проверить статус контейнеров:

```bash
docker compose -f deploy/docker-compose.prod.yml ps
```

Просмотреть логи (например, API):

```bash
docker compose -f deploy/docker-compose.prod.yml logs -f api
```

## 7. Первичная миграция и демо-данные

Миграции выполняются автоматически (`RUN_MIGRATIONS=true`). Для загрузки демо-контента запустите сидер вручную:

```bash
docker compose -f deploy/docker-compose.prod.yml exec api pnpm prisma db seed
```

Команда безопасно выполнит сидер один раз. При необходимости можно оставить `RUN_SEED=true` в `deploy/env/api.env`, чтобы сидер выполнялся при каждом запуске контейнера (не рекомендуется для продакшна).

## 8. Проверка работы сайта

1. Откройте `https://app.princeproduction.ru` — загрузится фронтенд/мини-приложение.
2. Откройте `https://api.princeproduction.ru/services` — убедитесь, что API отдаёт JSON.
3. Выполните быструю проверку чата/заказов, создав тестовый заказ и сообщение.

Если DNS ещё не обновился, используйте IP-адрес в hosts-файле для временной проверки.

## 9. Обновления приложения

```bash
cd ~/princeproduction
git pull origin main
# Обновляем образа и перезапускаем
docker compose -f deploy/docker-compose.prod.yml up -d --build
```

Миграции применяются автоматически. Если структура БД изменилась существенно, дополнительно проверяйте логи `api`.

## 10. Резервное копирование

Снимайте дампы PostgreSQL и резервируйте Caddy-сертификаты:

```bash
# Бэкап БД
pg_dump -h 127.0.0.1 -p 5432 -U prince -d prince > ~/backups/prince-$(date +%F).sql

# Бэкап сертификатов Caddy
sudo tar czf ~/backups/caddy-data-$(date +%F).tar.gz /var/lib/docker/volumes/princeproduction_caddy_data/
```

Автоматизируйте задачи с cron/systemd timer по необходимости.

## 11. Диагностика

- `docker compose -f deploy/docker-compose.prod.yml logs -f caddy` — ошибки TLS/прокси.
- `docker compose -f deploy/docker-compose.prod.yml logs -f api` — ошибки NestJS/Prisma.
- `docker compose -f deploy/docker-compose.prod.yml exec postgres psql -U prince -d prince` — доступ в консоль PostgreSQL.

При обновлении конфигурации Caddy перезапускайте только прокси:

```bash
docker compose -f deploy/docker-compose.prod.yml restart caddy
```

---

После успешного запуска весь стек будет доступен по адресу `https://app.princeproduction.ru`, а Telegram Mini App сможет обращаться к API по `https://api.princeproduction.ru` без дополнительной настройки.
