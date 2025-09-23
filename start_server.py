import os

# Optional central start script; Railway uses Procfile/railway.toml but this allows
# alternative invocation: `python start_server.py`
if __name__ == "__main__":
    from waitress import serve  # type: ignore
    from app import app

    port = int(os.getenv("PORT", 5000))
    serve(app, host="0.0.0.0", port=port)
