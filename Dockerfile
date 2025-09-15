# --- Stage 1: Frontend Build ---
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json* bun.lockb* ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

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

# Expose port
EXPOSE 8000

ENV PORT=8000 FRONTEND_BUILD_DIR=dist APP_ENV=production

# Healthcheck (simple HTTP ping)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl -fsS http://localhost:$PORT/health || exit 1

# Start via waitress
CMD ["python", "-m", "waitress", "--host=0.0.0.0", "--port=8000", "app:app"]
