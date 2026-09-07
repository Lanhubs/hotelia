# Multi-stage build for KEO Hotel Monorepo using Bun
FROM oven/bun:1 AS base

# Stage 1: Build Frontend
FROM base AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
COPY frontend/bun.lock* ./
RUN bun install
COPY frontend/ ./
RUN bun run build

# Stage 2: Build Admin
FROM base AS admin-builder
WORKDIR /app/admin

COPY admin/package*.json ./
COPY admin/bun.lock* ./
RUN bun install
COPY admin/ ./
RUN bun run build

# Stage 3: Build API and assemble
FROM base AS final
WORKDIR /app

# Install dependencies
COPY api/package.json api/bun.lock* ./
RUN bun install

# Copy API source
COPY api/ ./

# Copy built frontends from previous stages
COPY --from=frontend-builder /app/frontend/dist ./public/landing
COPY --from=admin-builder /app/admin/dist ./public/admin

# Expose port (Render uses PORT env var, defaults to 10000)
EXPOSE 10000

# Health check (Render will set PORT env var)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:' + (process.env.PORT || 10000) + '/api/health').then(r => r.ok ? process.exit(0) : process.exit(1))"

# Start the server
CMD ["bun", "run", "src/index.ts"]
