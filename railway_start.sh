#!/usr/bin/env bash
set -euo pipefail

PY_CMD="python"
if ! command -v "$PY_CMD" >/dev/null 2>&1; then
  if command -v python3 >/dev/null 2>&1; then
    PY_CMD="python3"
  else
    echo "[railway][FATAL] No python or python3 command found in PATH." >&2
    exit 1
  fi
fi

echo "[railway] Python version: $($PY_CMD --version 2>&1)"

if [ -f requirements.txt ]; then
  echo "[railway] Installing Python dependencies..."
  if ! $PY_CMD -m pip install --no-cache-dir -r requirements.txt; then
    echo "[railway][ERROR] Failed to install Python dependencies" >&2
    exit 1
  fi
fi

if [ -f package.json ]; then
  echo "[railway] Installing Node dependencies (production build)..."
  npm install --legacy-peer-deps
  echo "[railway] Building frontend (Vite)..."
  npm run build
fi

export FRONTEND_BUILD_DIR=${FRONTEND_BUILD_DIR:-dist}

echo "[railway] Starting Waitress (module form)..."
exec $PY_CMD -m waitress --host=0.0.0.0 --port="${PORT:-5000}" app:app
