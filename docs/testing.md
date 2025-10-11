# Тестирование

## Unit-тесты

- **Shared** — валидация схем zod через Vitest.
- **API** — сервисы NestJS с моками Prisma и платежного провайдера.
- **Web** — компоненты с React Testing Library (планируется).

## Интеграционные тесты

- NestJS e2e через `@nestjs/testing` + Supertest (auth, заказы, платежный холд).
- WebSocket чат: имитация нескольких клиентов, проверка обезличивания.

## E2E сценарии

1. Покупатель создаёт заказ → холд → чат → подтверждение → capture → баланс дизайнера.
2. Отмена/спор → админ решает, частичный возврат.
3. Заявка дизайнера → deep-link → approve.
4. Telegram mini-app: initData → каталог → чат.

## Команды

```bash
pnpm --filter @prince/api test
pnpm --filter @prince/web test # TODO
```

