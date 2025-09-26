# --- Stage 1: Frontend Build ---
# Using bookworm-slim instead of alpine to avoid potential musl-related build issues with some tooling
FROM node:20-bookworm-slim AS frontend
WORKDIR /app

# Install minimal OS deps (git sometimes needed for certain packages pulling optional deps)
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*

# Leverage caching by copying only lock files first
COPY package.json package-lock.json* bun.lockb* ./

# Ensure npm install includes dev dependencies regardless of environment flags that Railway might set
RUN npm set fund false \
    && npm set audit false \
    && echo "Node version:" $(node -v) " | npm version:" $(npm -v) \
    && npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy the rest of the source
COPY . .

# Build the frontend (add explicit log for clarity)
RUN echo "Starting Vite production build..." && npm run build

# --- Stage 2: Python Backend ---
FROM python:3.12-slim AS backend
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app

# System deps (optional minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app code
COPY app.py start_server.py railway_start.sh ./
COPY runtime.txt ./
COPY .env.example ./

# Copy built frontend from previous stage
COPY --from=frontend /app/dist ./dist

# (Optional) Copy package.json for static serving references if ever needed
COPY --from=frontend /app/package.json ./dist/package.json

# Expose port
EXPOSE 8000

ENV PORT=8000 FRONTEND_BUILD_DIR=dist APP_ENV=production

# Healthcheck (simple HTTP ping)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl -fsS http://localhost:$PORT/health || exit 1

# Start via waitress
CMD ["python", "-m", "waitress", "--host=0.0.0.0", "--port=8000", "app:app"]
