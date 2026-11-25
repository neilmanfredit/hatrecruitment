FROM node:22-alpine AS base

# ── deps ─────────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# ── builder ───────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copy prisma schema first so changes bust the generate cache
COPY prisma ./prisma
RUN npx prisma generate
# Copy full source for Next.js build
COPY . .
ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── runner ────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3010
ENV PORT=3010
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
