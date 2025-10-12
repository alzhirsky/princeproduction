#!/bin/sh
set -euo pipefail

cd /app

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "Running database migrations..."
  pnpm prisma migrate deploy
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Seeding database with demo data..."
  pnpm prisma db seed
fi

echo "Starting NestJS API"
exec pnpm --filter @prince/api start:prod
