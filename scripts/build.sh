#!/bin/sh
set -e

BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RESET='\033[0m'

step() { printf "\n${BOLD}${CYAN}==>${RESET} ${BOLD}%s${RESET}\n" "$1"; }
done_() { printf "${GREEN}  ✓ %s${RESET}\n" "$1"; }
info() { printf "${YELLOW}  ℹ %s${RESET}\n" "$1"; }

CONTAINER_NAME="forge-db"

# Check if postgres container already exists (fresh setup needs seeding)
NEEDS_SEED=false
if ! docker container inspect "$CONTAINER_NAME" > /dev/null 2>&1; then
  NEEDS_SEED=true
fi

step "Starting PostgreSQL"
docker-compose -f docker-compose.build.yml up -d --wait --build
done_ "Database is healthy"

step "Running migrations"
pnpm --filter @app/api run prisma:migrate
done_ "Migrations applied"

if [ "$NEEDS_SEED" = true ]; then
  step "Seeding database"
  info "New container detected — running seed"
  pnpm --filter @app/api run prisma:seed
  done_ "Seed complete"
fi

step "Build complete"
done_ "All steps finished successfully"

exit 0
