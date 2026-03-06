FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++ git
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json pnpm-lock.yaml* yarn.lock* ./
# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then \
		corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile --prod; \
	elif [ -f yarn.lock ]; then \
		corepack enable && corepack prepare yarn@stable --activate && yarn install --frozen-lockfile --production; \
	elif [ -f package-lock.json ]; then \
		npm install --omit=dev --legacy-peer-deps; \
	else \
		npm install --omit=dev; \
	fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml* yarn.lock* ./
# Install build-time tools and all dependencies (including dev dependencies)
RUN apk add --no-cache python3 build-base git \
	&& if [ -f pnpm-lock.yaml ]; then \
			 corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile; \
		 elif [ -f yarn.lock ]; then \
			 corepack enable && corepack prepare yarn@stable --activate && yarn install --frozen-lockfile; \
		 elif [ -f package-lock.json ]; then \
			 npm install --legacy-peer-deps; \
		 else \
			 npm install; \
		 fi

COPY . .

# Build-time API URL for rewrites (default for local dev; override in docker-compose build args)
ARG NEXT_PUBLIC_API_BASE_URL=https://api.myhrmscloud.com
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check - use dedicated /health endpoint (same as ELB target group)
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
