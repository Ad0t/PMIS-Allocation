# PMIS Backend & Frontend Repository

This repository contains:
- A Flask backend (app.py) exposing internship & candidate API endpoints backed by Supabase.
- A Vite + React + TypeScript frontend (src/...) that can be deployed separately.

## Backend Overview
The backend is a lightweight Flask service designed for deployment on [Railway](https://railway.app). It uses:
- Flask + flask-cors
- Supabase Python client (optional – if credentials provided)
- Waitress (production WSGI server via Procfile)

Mock candidate data is bundled for demonstration. Real internship & candidate data is fetched from Supabase tables when credentials are configured.

### Key Files
- app.py – Flask application
- requirements.txt – Minimal production dependencies
- requirements-full.txt – Original (large) dependency snapshot (not used in deployment)
- Procfile – Startup command for Railway (waitress-serve)
- runtime.txt – Python version pin (3.12.x)
- .env.example – Environment variable template

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Service health & Supabase availability |
| GET | / | Basic landing message |
| GET | /api/data/<table_name> | Raw select * from a Supabase table |
| GET | /api/internships | Internship list (Supabase required) |
| GET | /api/candidates | Mock in-memory candidate list |
| GET | /api/candidate_db | Candidate subset from Supabase |
| GET | /api/internships/<id>/candidates | Mock mapping of candidates to internship |

If Supabase credentials are missing, Supabase-backed endpoints return HTTP 503 unless `ALLOW_EMPTY_FALLBACK=true` (then /api/internships returns `[]`).

## Environment Variables (.env)
Copy `.env.example` to `.env` and fill in values:
- SUPABASE_URL=https://<project>.supabase.co
- SUPABASE_KEY= (service role key recommended for server – DO NOT expose to frontend)
- CORS_ORIGINS=*
- LOG_LEVEL=INFO
- APP_ENV=production
- ALLOW_EMPTY_FALLBACK=false

## Local Development (Backend)
```bash
# 1. Create & activate virtual environment (Windows PowerShell)
python -m venv .venv
./.venv/Scripts/Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env
copy .env.example .env  # Then edit values

# 4. Run the server
python app.py
# Server listens on http://127.0.0.1:5000 (or PORT in env)
```
Test health:
```bash
curl http://127.0.0.1:5000/health
```

## Frontend Development
```bash
# Install Node deps
npm install
# Start Vite dev server
npm run dev
```
By default Vite serves the frontend (likely on http://localhost:5173). Point frontend API calls to the backend base URL (e.g., http://localhost:5000).

### Frontend Environment Variables
Create a `.env` or `.env.local` in the project root for development overrides:
```
VITE_API_BASE=http://127.0.0.1:5000
```
If omitted, the frontend will make same-origin requests (useful when Flask serves the built assets in production). Avoid trailing slash.

## Railway Deployment (Backend Only)
1. Push this repo to GitHub (or connect directly from local via Railway CLI if preferred).
2. In Railway dashboard: New Project > Deploy from Repo.
3. Railway auto-detects Python via `requirements.txt` & `runtime.txt`.
4. Set environment variables (under Variables):
   - SUPABASE_URL
   - SUPABASE_KEY
   - LOG_LEVEL=INFO
   - APP_ENV=production
   - CORS_ORIGINS=https://your-frontend-domain.com,https://other-allowed.com
   - ALLOW_EMPTY_FALLBACK=false (optional)
5. The Procfile provides the start command:
   ```
   web: waitress-serve --host=0.0.0.0 --port=$PORT app:app
   ```
6. Deploy – once running, open the public URL and check `/health`.

### Verifying Deployment
```bash
curl https://your-railway-domain.up.railway.app/health
curl https://your-railway-domain.up.railway.app/api/internships
```
If Supabase not configured, internships endpoint returns 503.

## Railway Deployment (Combined Backend + Built Frontend)
This repository can also deploy a single service that serves the built React SPA via Flask.

Two options:
1. Use existing Procfile (Railway auto-detects) and rely on `railway.toml` build steps.
2. Manually configure build & start commands in Railway UI.

`railway.toml` defines:
```toml
[build]
commands = [
   "pip install -r requirements.txt",
   "npm install",
   "npm run build"
]
[deploy]
startCommand = "waitress-serve --host=0.0.0.0 --port=$PORT app:app"
[env]
FRONTEND_BUILD_DIR = "dist"
```

During build, Vite outputs to `dist/`. The Flask app is configured (`app.py`) with `static_folder=dist` and will:
- Serve `index.html` at `/` if present.
- Return `index.html` for non-API 404 routes (SPA fallback) so client-side routing works.

Environment variable `FRONTEND_BUILD_DIR` can override the directory if needed.

### Steps
1. Connect repo to Railway.
2. Ensure `railway.toml` is present (already in repo).
3. Set environment variables (same as backend-only scenario).
4. Deploy – after build completes, open root URL to view the React app; API still under `/api/*`.

### Local Combined Test
```powershell
# Backend + build frontend locally
python -m venv .venv
./.venv/Scripts/Activate.ps1
pip install -r requirements.txt
npm install
npm run build
$env:FRONTEND_BUILD_DIR="dist"; python app.py  # or waitress-serve for closer parity
```
Visit: http://127.0.0.1:5000

### Notes
- Keep frontend API calls pointing to the same origin (relative `/api/...`) in production for simplicity.
- If you prefer separate deployments, remove `railway.toml` or adjust commands to skip `npm run build`.

## Optional: Serve Built Frontend Separately
Typical pattern:
- Deploy backend (this repo) on Railway.
- Deploy frontend (same repo or split) via a separate Railway Node service or a static host (Netlify, Vercel, etc.).
- Configure frontend environment to point to the backend base URL (e.g., `VITE_API_BASE=https://your-railway-domain.up.railway.app`).

## Security Notes
- Use the Supabase service role key ONLY on the server; never expose it to the browser bundle.
- Restrict CORS origins in production.
- Consider adding authentication (JWT or Supabase auth) for modifying endpoints if added later.

## Future Enhancements
- Add caching layer for frequently accessed internship data.
- Add pagination & filtering.
- Add structured logging (JSON) & monitoring hooks (Sentry already easy to add).
- Optional static file serving (could integrate a frontend build into /static with WhiteNoise if desired).

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| 503 from Supabase endpoints | Missing/invalid credentials | Set SUPABASE_URL & SUPABASE_KEY correctly |
| CORS errors | Origins blocked | Set correct CORS_ORIGINS env |
| Crashes on startup | Missing deps | Reinstall: `pip install -r requirements.txt` |
| 404 on /api/... | Wrong base URL | Confirm backend URL & path |

## License
Internal / Unspecified (add a LICENSE file if needed).
