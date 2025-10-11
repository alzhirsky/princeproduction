# Инфраструктура и окружение

## Docker Compose (пример)

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_DB: prince
      POSTGRES_USER: prince
      POSTGRES_PASSWORD: prince
    ports:
      - '5432:5432'
    volumes:
      - postgres:/var/lib/postgresql/data
  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - '6379:6379'
volumes:
  postgres:
```

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

