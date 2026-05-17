# Multi-stage build for React SSR frontend
FROM node:20-alpine AS builder

ARG GEMINI_API_KEY=AIzaSyDT-aHThMfo4GjxyT594cBwxV-9LNe5fpw
ENV GEMINI_API_KEY=${GEMINI_API_KEY}

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Ensure GEMINI_API_KEY is available to Vite during build.
RUN echo "GEMINI_API_KEY=${GEMINI_API_KEY}" > .env

RUN npm run build

FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

EXPOSE 3000

CMD ["node", "server.js", "--production"]
