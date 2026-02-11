#!/bin/sh
set -e

CONTAINER_NAME="app-sandbox-db"

# Check if postgres container already exists (fresh setup needs seeding)
NEEDS_SEED=false
if ! docker container inspect "$CONTAINER_NAME" > /dev/null 2>&1; then
  NEEDS_SEED=true
fi

# Start PostgreSQL and wait for it to be healthy
docker compose -f docker-compose.dev.yml up -d --wait

# Run migrations
pnpm --filter @app/api run prisma:migrate

# Seed only on fresh container creation
if [ "$NEEDS_SEED" = true ]; then
  echo "New database detected — running seed..."
  pnpm --filter @app/api run prisma:seed
fi

# Start dev servers concurrently
pnpm --filter @app/api run start:dev &
pnpm --filter @app/admin run dev &
pnpm --filter @app/client run dev &
wait