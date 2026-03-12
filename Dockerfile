# ---------------------------
# Multi-stage Next.js (Eatery Kiosk) — optimized for ECS
# ---------------------------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f pnpm-lock.yaml ]; then \
		corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile --prod; \
	elif [ -f yarn.lock ]; then \
		corepack enable && corepack prepare yarn@stable --activate && yarn install --frozen-lockfile --production; \
	elif [ -f package-lock.json ]; then \
		npm ci --omit=dev --legacy-peer-deps; \
	else \
		npm install --omit=dev; \
	fi

FROM base AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml* yarn.lock* ./
RUN apk add --no-cache python3 build-base git \
	&& if [ -f pnpm-lock.yaml ]; then \
		corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile; \
	elif [ -f yarn.lock ]; then \
		corepack enable && corepack prepare yarn@stable --activate && yarn install --frozen-lockfile; \
	elif [ -f package-lock.json ]; then \
		npm ci --legacy-peer-deps; \
	else \
		npm install; \
	fi
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL=https://api.eaterycloud.com
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

FROM base AS runner
WORKDIR /app
RUN apk add --no-cache wget \
	&& addgroup --system --gid 1001 nodejs \
	&& adduser --system --uid 1001 nextjs
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
	CMD wget -q -O /dev/null http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
