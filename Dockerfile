FROM node:20-alpine AS base

# ── 1. Install OS deps ──────────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f pnpm-lock.yaml ]; then \
	corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile; \
	elif [ -f yarn.lock ]; then \
	corepack enable && corepack prepare yarn@stable --activate && yarn install --frozen-lockfile; \
	elif [ -f package-lock.json ]; then \
	npm ci --legacy-peer-deps; \
	else \
	npm install; \
	fi

# ── 2. Build ────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache python3 build-base git
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL=https://api.eaterycloud.com
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ── 3. Production runner ────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
RUN apk add --no-cache wget

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
	&& adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
