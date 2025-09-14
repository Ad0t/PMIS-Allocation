from flask import Flask, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url=url, supabase_key=key)



# --- Mock Data ---
candidates_data = [
    { "id": 1, "name": "Priya Sharma", "education": "B.Tech Computer Science", "skills": ["React", "Node.js", "TypeScript"], "location": "Delhi", "applications": 3, "internship_ids": [1, 3, 5], "projects": "E-commerce Website", "status": "shortlisted", "ranking": 1 },
    { "id": 2, "name": "Rahul Kumar", "education": "MBA Finance", "skills": ["Excel", "Financial Analysis", "SQL"], "location": "Mumbai", "applications": 2, "internship_ids": [2], "projects": "Market Analysis Report", "status": "shortlisted", "ranking": 1 },
    { "id": 3, "name": "Anita Singh", "education": "B.Com Marketing", "skills": ["Digital Marketing", "SEO", "Content Writing"], "location": "Bangalore", "applications": 4, "internship_ids": [3], "projects": "SEO Campaign for a local business", "status": "promising", "ranking": 2 },
    { "id": 4, "name": "Suresh Gupta", "education": "B.Tech ECE", "skills": ["Python", "AWS", "Docker", "Kubernetes"], "location": "Noida", "applications": 1, "internship_ids": [5], "projects": "CI/CD Pipeline setup", "status": "shortlisted", "ranking": 1 },
    { "id": 5, "name": "Deepika Verma", "education": "MBA HR", "skills": ["Recruitment", "Employee Engagement"], "location": "Pune", "applications": 2, "internship_ids": [4], "projects": "HR Policy Review", "status": "promising", "ranking": 2 },
    { "id": 6, "name": "Arjun Mehta", "education": "B.Sc Statistics", "skills": ["Python", "Pandas", "Tableau"], "location": "Mumbai", "applications": 1, "internship_ids": [2], "projects": "Sales Dashboard", "status": "promising", "ranking": 2 },
    { "id": 7, "name": "Vikram Rathod", "education": "B.Tech IT", "skills": ["Java", "Spring Boot", "MySQL"], "location": "Delhi", "applications": 1, "internship_ids": [1], "projects": "Library Management System", "status": "not-recommended", "ranking": 3 },
]
def capitalize_words(s):
    if isinstance(s, str):
        return ' '.join(word.capitalize() for word in s.split())
    return s

# --- API Endpoints ---
@app.route('/api/data/<table_name>')
def get_table_data(table_name):
    """
    Fetches all data from the specified table in Supabase.
    """
    try:
        response = supabase.table(table_name).select("*").execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/')
def index():
    return "You're not supposed to be here!"

@app.route('/api/internships')
def get_internships():
    response = supabase.table('internships').select("*").execute()
    capitalized_internships = []
    for internship in response.data:
        new_internship = {}
        for key, value in internship.items():
            if isinstance(value, str):
                new_internship[key] = capitalize_words(value)
            elif isinstance(value, list):
                new_internship[key] = [capitalize_words(item) if isinstance(item, str) else item for item in value]
            else:
                new_internship[key] = value
        capitalized_internships.append(new_internship)
    return jsonify(capitalized_internships)

@app.route('/api/candidates')
def get_candidates():
    return jsonify(candidates_data)


@app.route('/api/candidate_db')
def get_candidates_database():
    response = supabase.table('candidates').select("id, name, education, skills, projects").execute()
    return jsonify(response.data)

@app.route('/api/internships/<int:internship_id>/candidates')
def get_candidates_for_internship(internship_id):
    applied_candidates = [
        candidate for candidate in candidates_data
        if internship_id in candidate.get("internship_ids", [])
    ]
    return jsonify(applied_candidates)

if __name__ == '__main__':
    app.run()