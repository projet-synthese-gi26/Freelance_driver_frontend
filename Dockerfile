# =============================================================
# DOCKERFILE — FRONTEND NEXT.JS
# =============================================================

# -----------------------------------------------------------
# STAGE 1 — builder
# -----------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install && npm ci --prefer-offline

COPY . .

# --- Variables NEXT_PUBLIC_* : baked au build ---
ARG GEMINI_API_KEY
ARG DRIVER_SERVICE_URL
ARG REVIEW_SERVICE_URL
ARG SEARCH_SERVICE_URL
ARG SUBSCRIPTION_SERVICE_URL
ARG PAYEMENT_SERVICE_URL
ARG BOOKING_SERVICE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SOCKET_URL
ARG NEXT_PUBLIC_COMPLIANCE_API_URL

RUN printf "GEMINI_API_KEY=AIzaSyCJwFZZojgfQO6X2gJLNCA3U4aUkoSYp1M \
DRIVER_SERVICE_URL=https://traefikdev.yowyob.com/freelance-driver\
PAYEMENT_SERVICE_URL=https://traefikdev.yowyob.com/payment \
NEXT_PUBLIC_API_URL=https://traefikdev.yowyob.com/freelance-driver \
NEXT_PUBLIC_SOCKET_URL=https://traefikdev.yowyob.com/freelance-driver \
NEXT_PUBLIC_COMPLIANCE_API_URL=https://traefikdev.yowyob.com/ugate \
REVIEW_SERVICE_URL=%s\n\
SEARCH_SERVICE_URL=%s\n\
BOOKING_SERVICE_URL=%s\n\
SUBSCRIPTION_SERVICE_URL=%s\n" \
  "$REVIEW_SERVICE_URL" \
  "$SEARCH_SERVICE_URL" \
  "$BOOKING_SERVICE_URL" \
  "$SUBSCRIPTION_SERVICE_URL" \
  > .env

RUN npm run build

# -----------------------------------------------------------
# STAGE 2 — runner
# Seul .next/standalone est copié → image finale légère
# -----------------------------------------------------------
FROM node:20-alpine AS runner

RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Standalone contient le serveur Node minimal
COPY --from=builder /app/.next/standalone ./
# Fichiers statiques publics (images, fonts, etc.)
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

#HEALTHCHECK --interval=30s --timeout=10s --retries=5 --start-period=20s \
#  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
