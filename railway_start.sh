#!/usr/bin/env bash
set -euo pipefail

echo "[railway] Python version: $(python --version 2>&1)"

if [ -f requirements.txt ]; then
  echo "[railway] Installing Python dependencies..."
  pip install --no-cache-dir -r requirements.txt
fi

if [ -f package.json ]; then
  echo "[railway] Installing Node dependencies (production build)..."
  npm install --legacy-peer-deps
  echo "[railway] Building frontend (Vite)..."
  npm run build
fi

export FRONTEND_BUILD_DIR=${FRONTEND_BUILD_DIR:-dist}

echo "[railway] Starting Waitress (module form)..."
exec python -m waitress --host=0.0.0.0 --port="${PORT:-5000}" app:app
