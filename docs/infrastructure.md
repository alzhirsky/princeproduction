# Инфраструктура и окружение

## Docker Compose

- `docker-compose.yml` — сборка полного стека для локальной разработки (Next.js + NestJS + PostgreSQL + Redis).
- `deploy/docker-compose.prod.yml` — production-вариант с Caddy как обратным прокси и автоматическим TLS.
- Шаблоны переменных окружения находятся в `deploy/env/*.dev.env.example` и `deploy/env/*.prod.env.example`.

### Минимальная конфигурация БД/кэша

```yaml
services:
  postgres:
    image: postgres:15
    restart: unless-stopped
    env_file:
      - deploy/env/postgres.env
    volumes:
      - postgres:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: unless-stopped
```

Полный production-файл см. в `deploy/docker-compose.prod.yml` и сопроводительном гайде [docs/deployment-ubuntu.md](deployment-ubuntu.md).

## CI/CD

- GitHub Actions с workflow: lint → test → build → docker push → deploy.
- Prisma migrate deploy при релизе.
- Проверка commitlint + conventional commits.

## Мониторинг

- OpenTelemetry SDK → OTLP collector → Grafana Tempo.
- Метрики Prometheus (NestJS + custom провайдер).
- Логи в ELK/ClickHouse (JSON structured logs).

## Безопасность

- Secrets в Vault/SOPS.
- Rate limiting через Nginx + NestJS interceptor.
- CSP headers, Helmet middleware.

