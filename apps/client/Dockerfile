FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpm-approve-builds.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/client/package.json apps/client/package.json
COPY packages/sdk/package.json packages/sdk/package.json
COPY packages/utils/package.json packages/utils/package.json

RUN pnpm install --frozen-lockfile

# ---

FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpm-approve-builds.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY apps/client/package.json apps/client/package.json
COPY packages/sdk/package.json packages/sdk/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY apps/api/swagger.json apps/api/swagger.json
COPY apps/client/ apps/client/
COPY packages/sdk/ packages/sdk/
COPY packages/utils/ packages/utils/

RUN pnpm install --frozen-lockfile --prefer-offline
RUN pnpm --filter @app/sdk run generate
RUN pnpm --filter @app/theme run generate

ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm --filter @app/client run build

# ---

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=4000

COPY --from=build /app/apps/client/.next/standalone ./
COPY --from=build /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=build /app/apps/client/public ./apps/client/public

EXPOSE 4000

CMD ["node", "apps/client/server.js"]
