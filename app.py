from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import logging
from typing import Optional
import requests
from gradio_client import Client
import time
import time
import json

load_dotenv()

BUILD_DIR = os.getenv("FRONTEND_BUILD_DIR", "dist")
app = Flask(__name__, static_folder=BUILD_DIR, static_url_path="/")

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGINS", "*").split(",")}})

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
MODEL_URL = os.getenv("MODEL_URL")
SPACE_ID = os.getenv("SPACE_ID")
API_FUNCTION_NAME = os.getenv("API_FUNCTION_NAME")


def call_remote_space(space_id, api_name, *inputs):
    try:
        print(f"\nAttempting to connect to Space: {space_id}")

        client = Client(space_id)


        # print("\n--- Available API Endpoints ---")
        # print(client.view_api())
        # print("Confirmed endpoint for Run Allocation is:", API_FUNCTION_NAME)
        # print("---------------------------------------------------------")


        print(f"Calling remote function '{api_name}' with Internship ID: {inputs[0]}")

        # Call the remote predict function. This is a blocking call.
        result = client.predict(
            *inputs,  # Unpack the list of inputs (e.g., just the Internship ID)
            api_name=api_name
        )

        return result

    except Exception as e:
        print(f"\n--- ERROR during remote API call ---")
        print(f"Check if the Space ID is correct and if inputs match the remote function's arguments.")
        print(f"If the error persists, ensure API_FUNCTION_NAME is correct based on the view_api() output.")
        print(f"Error details: {e}")
        return None

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized")
    except Exception as e:  # noqa: BLE001
        logger.error(f"Failed to initialize Supabase: {e}")
else:
    logger.warning("Supabase credentials not set; related endpoints will return 503")

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

@app.route('/api/login', methods=['POST'])
def login():
    guard = supabase_required()
    if guard:
        return guard

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        response = supabase.table('login_creds').select("*").eq('username', username).eq('password', password).execute()
        if response.data:
            return jsonify({"success": True, "message": "Login successful", "username": username})
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except Exception as e:
        logger.exception("Error during login")
        return jsonify({"error": str(e)}), 500

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
        response = supabase.table('internship').select("*").execute()  # type: ignore[union-attr]
        return jsonify(response.data)
    except Exception as e:  # noqa: BLE001
        logger.exception("Error fetching internships")
        return jsonify({"error": str(e)}), 500


@app.route('/api/internships/<internship_id>')
def get_internship(internship_id):
    guard = supabase_required()
    if guard:
        if os.getenv("ALLOW_EMPTY_FALLBACK", "false").lower() == "true":
            return jsonify({"error": "Not available"}), 404
        return guard
    try:
        response = supabase.table('internship').select("*").eq('internship_id', internship_id).execute()
        data = response.data or []
        if not data:
            return jsonify({"error": "Not found"}), 404
        internship = data[0]
        return jsonify(internship)
    except Exception as e:
        logger.exception("Error fetching internship detail")
        return jsonify({"error": str(e)}), 500


@app.route('/api/candidates')
def get_candidates():
    guard = supabase_required()
    if guard:
        return guard
    try:
        response = supabase.table('candidates_ts').select("*").execute()  # type: ignore[union-attr]
        return jsonify(response.data)
    except Exception as e:  # noqa: BLE001
        logger.exception("Error fetching candidates from db")
        return jsonify({"error": str(e)}), 500


@app.route('/api/candidate_db')
def get_candidates_database():
    guard = supabase_required()
    if guard:
        return guard
    try:
        response = supabase.table('candidates_ts').select("id, name, education, skills, projects").execute()  # type: ignore[union-attr]
        return jsonify(response.data)
    except Exception as e:  # noqa: BLE001
        logger.exception("Error fetching candidates from db")
        return jsonify({"error": str(e)}), 500


@app.route('/api/internships/<internship_id>/candidates')
def get_candidates_for_internship(internship_id):
    guard = supabase_required()
    if guard:
        return guard
    try:
        # This is the corrected query to filter candidates by the internship_id
        response = supabase.table('candidates_ts').select("*").eq('internship_id', internship_id).execute()
        return jsonify(response.data)
    except Exception as e:
        logger.exception(f"Error fetching candidates for internship {internship_id}")
        return jsonify({"error": str(e)}), 500

# In app.py

@app.route('/api/shortlist/<internship_id>')
def shortlist_candidates(internship_id):
    guard = supabase_required()
    if guard:
        return guard

    logger.info(f"Fetching shortlist for internship {internship_id} from 'results' table.")
    response = call_remote_space(SPACE_ID, API_FUNCTION_NAME, internship_id)
    try:
        # Fetch the results from the 'results' table, filtered by the internship_id
        # The .order() method will sort the results by the 'Rank' column
        response = supabase.table('results').select("*").eq('InternshipID', internship_id).order('Rank').execute()
        results = response.data or []

        if not results:
            # Return an empty list in the expected format if no results are found
            return jsonify({"data": [[]]}), 200

        # The frontend expects the results to be nested inside a list within the 'data' key
        final_response = {"data": [results]}
        
        return jsonify(final_response)

    except Exception as e:
        logger.exception(f"An error occurred while fetching shortlist for internship {internship_id}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Starting development server on port {port}")
    app.run(host='0.0.0.0', port=port)
