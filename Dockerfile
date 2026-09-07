# Multi-stage build for KEO Hotel Monorepo using Bun
FROM oven/bun:1 AS base

# Stage 1: Build Frontend
FROM base AS frontend-builder
WORKDIR /build

# Copy and build frontend
COPY frontend/package*.json frontend/bun.lock* ./frontend/
WORKDIR /build/frontend
RUN bun install

COPY frontend/ ./
# Override outDir to build to dist instead of ../api/public/landing
RUN bun run build --outDir=dist

# Stage 2: Build Admin
FROM base AS admin-builder
WORKDIR /build

# Copy and build admin
COPY admin/package*.json admin/bun.lock* ./admin/
WORKDIR /build/admin
RUN bun install

COPY admin/ ./
# Override outDir to build to dist instead of ../api/public/admin
RUN bun run build --outDir=dist

# Stage 3: Build API and assemble
FROM base AS final
WORKDIR /app

# Install API dependencies
COPY api/package.json api/bun.lock* ./
RUN bun install

# Copy API source
COPY api/ ./

# Copy built frontends from previous stages
COPY --from=frontend-builder /build/frontend/dist ./public/landing
COPY --from=admin-builder /build/admin/dist ./public/admin

# Expose port (Render uses PORT env var, defaults to 10000)
EXPOSE 10000

# Health check (Render will set PORT env var)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e "fetch('http://localhost:' + (process.env.PORT || 10000) + '/api/health').then(r => r.ok ? process.exit(0) : process.exit(1))"

# Start the server
CMD ["bun", "run", "src/index.ts"]
