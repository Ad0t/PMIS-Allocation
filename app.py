from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import logging
from typing import Optional

load_dotenv()

BUILD_DIR = os.getenv("FRONTEND_BUILD_DIR", "dist")
app = Flask(__name__, static_folder=BUILD_DIR, static_url_path="/")

# Configure logging
logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

# CORS configuration (allow all by default, configurable via env)
CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGINS", "*").split(",")}})

# Supabase initialization (safe)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized")
    except Exception as e:  # noqa: BLE001
        logger.error(f"Failed to initialize Supabase: {e}")
else:
    logger.warning("Supabase credentials not set; related endpoints will return 503")

# Mock data (for demo)
candidates_data = [
    {"id": 1, "name": "Priya Sharma", "education": "B.Tech Computer Science", "skills": ["React", "Node.js", "TypeScript"], "location": "Delhi", "applications": 3, "internship_ids": [1, 3, 5], "projects": "E-commerce Website", "status": "shortlisted", "ranking": 1},
    {"id": 2, "name": "Rahul Kumar", "education": "MBA Finance", "skills": ["Excel", "Financial Analysis", "SQL"], "location": "Mumbai", "applications": 2, "internship_ids": [2], "projects": "Market Analysis Report", "status": "shortlisted", "ranking": 1},
    {"id": 3, "name": "Anita Singh", "education": "B.Com Marketing", "skills": ["Digital Marketing", "SEO", "Content Writing"], "location": "Bangalore", "applications": 4, "internship_ids": [3], "projects": "SEO Campaign for a local business", "status": "promising", "ranking": 2},
    {"id": 4, "name": "Suresh Gupta", "education": "B.Tech ECE", "skills": ["Python", "AWS", "Docker", "Kubernetes"], "location": "Noida", "applications": 1, "internship_ids": [5], "projects": "CI/CD Pipeline setup", "status": "shortlisted", "ranking": 1},
    {"id": 5, "name": "Deepika Verma", "education": "MBA HR", "skills": ["Recruitment", "Employee Engagement"], "location": "Pune", "applications": 2, "internship_ids": [4], "projects": "HR Policy Review", "status": "promising", "ranking": 2},
    {"id": 6, "name": "Arjun Mehta", "education": "B.Sc Statistics", "skills": ["Python", "Pandas", "Tableau"], "location": "Mumbai", "applications": 1, "internship_ids": [2], "projects": "Sales Dashboard", "status": "promising", "ranking": 2},
    {"id": 7, "name": "Vikram Rathod", "education": "B.Tech IT", "skills": ["Java", "Spring Boot", "MySQL"], "location": "Delhi", "applications": 1, "internship_ids": [1], "projects": "Library Management System", "status": "not-recommended", "ranking": 3},
]


def capitalize_words(s):
    if isinstance(s, str):
        return ' '.join(word.capitalize() for word in s.split())
    return s


def supabase_required():
    if supabase is None:
        return jsonify({"error": "Supabase not configured"}), 503
    return None

# Routes
@app.route('/health')
def health():
    return jsonify({
        "status": "ok",
        "supabase": supabase is not None,
        "environment": os.getenv("APP_ENV", "production")
    })


@app.route('/')
def root():
    index_path = os.path.join(app.static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, 'index.html')
    return "Backend service is running. See /health and /api endpoints."


@app.errorhandler(404)
def spa_fallback(e):  # noqa: D401, ANN001
    """If a built SPA exists, serve index.html for unmatched routes (excluding API)."""
    if request.path.startswith('/api') or request.path.startswith('/health'):
        return jsonify({"error": "Not Found"}), 404
    index_path = os.path.join(app.static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({"error": "Not Found"}), 404


@app.route('/api/data/<table_name>')
def get_table_data(table_name):
    guard = supabase_required()
    if guard:
        return guard
    try:
        response = supabase.table(table_name).select("*").execute()  # type: ignore[union-attr]
        return jsonify(response.data), 200
    except Exception as e:  # noqa: BLE001
        logger.exception("Error fetching table data")
        return jsonify({"error": str(e)}), 500


@app.route('/api/internships')
def get_internships():
    guard = supabase_required()
    if guard:
        if os.getenv("ALLOW_EMPTY_FALLBACK", "false").lower() == "true":
            return jsonify([])
        return guard
    try:
        response = supabase.table('internships').select("*").execute()  # type: ignore[union-attr]
        transformed = []
        for internship in response.data:
            new_item = {}
            for k, v in internship.items():
                if isinstance(v, str):
                    new_item[k] = capitalize_words(v)
                elif isinstance(v, list):
                    new_item[k] = [capitalize_words(i) if isinstance(i, str) else i for i in v]
                else:
                    new_item[k] = v
            transformed.append(new_item)
        return jsonify(transformed)
    except Exception as e:  # noqa: BLE001
        logger.exception("Error fetching internships")
        return jsonify({"error": str(e)}), 500


@app.route('/api/internships/<int:internship_id>')
def get_internship(internship_id):
    guard = supabase_required()
    if guard:
        if os.getenv("ALLOW_EMPTY_FALLBACK", "false").lower() == "true":
            return jsonify({"error": "Not available"}), 404
        return guard
    try:
        response = supabase.table('internships').select("*").eq('id', internship_id).execute()  # type: ignore[union-attr]
        data = response.data or []
        if not data:
            return jsonify({"error": "Not found"}), 404
        internship = data[0]
        transformed = {}
        for k, v in internship.items():
            if isinstance(v, str):
                transformed[k] = capitalize_words(v)
            elif isinstance(v, list):
                transformed[k] = [capitalize_words(i) if isinstance(i, str) else i for i in v]
            else:
                transformed[k] = v
        return jsonify(transformed)
    except Exception as e:  # noqa: BLE001
        logger.exception("Error fetching internship detail")
        return jsonify({"error": str(e)}), 500


@app.route('/api/candidates')
def get_candidates():
    return jsonify(candidates_data)


@app.route('/api/candidate_db')
def get_candidates_database():
    guard = supabase_required()
    if guard:
        return guard
    try:
        response = supabase.table('candidates').select("id, name, education, skills, projects").execute()  # type: ignore[union-attr]
        return jsonify(response.data)
    except Exception as e:  # noqa: BLE001
        logger.exception("Error fetching candidates from db")
        return jsonify({"error": str(e)}), 500


@app.route('/api/internships/<int:internship_id>/candidates')
def get_candidates_for_internship(internship_id):
    filtered = [c for c in candidates_data if internship_id in c.get("internship_ids", [])]
    return jsonify(filtered)


if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Starting development server on port {port}")
    app.run(host='0.0.0.0', port=port)
