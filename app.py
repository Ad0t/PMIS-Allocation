import os
from flask import Flask, jsonify
from flask_cors import CORS
# from waitress import serve
import logging

# port = int(os.environ.get("PORT", 8080))
# serve(app, host='0.0.0.0', port=port)
logging.basicConfig(level=logging.INFO)
app = Flask(__name__)
CORS(app)

# origins = [
#     "https://pmisallocation.netlify.app/"
#     "http://localhost:8080"
# ]
# CORS(app, resources={r"/api/*": {"origins": origins}})

# --- Mock Data ---
internships_data = [
    { 
        "id": 1, 
        "title": "Software Development Intern", 
        "company": "GAIL (India) Limited", 
        "location": "New Delhi", 
        "applicants": 245, 
        "status": "active",
        "stipend": "₹ 25,000/month",
        "duration": "6 Months",
        "description": "Join our dynamic team to work on cutting-edge software solutions for the energy sector. You will be involved in the full software development lifecycle, from conception to deployment.",
        "skillsRequired": ["Python", "React", "Node.js", "MongoDB", "REST APIs"],
        "responsibilities": [
            "Develop and maintain web applications.",
            "Collaborate with cross-functional teams.",
            "Write clean, scalable code.",
            "Test and deploy applications and systems."
        ]
    },
    { 
        "id": 2, 
        "title": "Data Analytics Intern", 
        "company": "REC Limited", 
        "location": "Mumbai", 
        "applicants": 189, 
        "status": "active",
        "stipend": "₹ 20,000/month",
        "duration": "3 Months",
        "description": "This internship focuses on analyzing large datasets to extract meaningful insights that will drive business decisions in the renewable energy financing space.",
        "skillsRequired": ["SQL", "Python", "Pandas", "Tableau", "Statistics"],
        "responsibilities": [
            "Collect and interpret data.",
            "Identify patterns and trends in data sets.",
            "Work alongside teams to establish business needs.",
            "Define new data collection and analysis processes."
        ]
    },
    { "id": 3, "title": "Marketing Research Intern", "company": "Unilever India", "location": "Bangalore", "applicants": 156, "status": "closed", "stipend": "₹ 15,000/month", "duration": "4 Months", "description": "Support the marketing team in daily administrative tasks and help organize marketing events.", "skillsRequired": ["SEO", "Content Writing", "Social Media"], "responsibilities": ["Conduct market research.", "Assist in marketing campaigns."]},
    { "id": 4, "title": "Human Resources Intern", "company": "Tata Power", "location": "Pune", "applicants": 98, "status": "active", "stipend": "₹ 18,000/month", "duration": "6 Months", "description": "An exciting opportunity to learn the ropes of HR in a leading power company.", "skillsRequired": ["MS Office", "Communication", "Recruitment"], "responsibilities": ["Assist with recruitment process.", "Help with onboarding new hires."]},
    { "id": 5, "title": "Cloud DevOps Intern", "company": "HCLTech", "location": "Noida", "applicants": 215, "status": "active", "stipend": "₹ 30,000/month", "duration": "6 Months", "description": "Work with our cloud infrastructure team to build and maintain our CI/CD pipelines.", "skillsRequired": ["AWS", "Docker", "Kubernetes", "Jenkins"], "responsibilities": ["Manage cloud infrastructure.", "Automate deployment processes."]},
]

candidates_data = [
    { "id": 1, "name": "Priya Sharma", "education": "B.Tech Computer Science", "skills": ["React", "Node.js", "TypeScript"], "location": "Delhi", "applications": 3, "internship_ids": [1, 3, 5], "projects": "E-commerce Website", "status": "shortlisted", "ranking": 1 },
    { "id": 2, "name": "Rahul Kumar", "education": "MBA Finance", "skills": ["Excel", "Financial Analysis", "SQL"], "location": "Mumbai", "applications": 2, "internship_ids": [2], "projects": "Market Analysis Report", "status": "shortlisted", "ranking": 1 },
    { "id": 3, "name": "Anita Singh", "education": "B.Com Marketing", "skills": ["Digital Marketing", "SEO", "Content Writing"], "location": "Bangalore", "applications": 4, "internship_ids": [3], "projects": "SEO Campaign for a local business", "status": "promising", "ranking": 2 },
    { "id": 4, "name": "Suresh Gupta", "education": "B.Tech ECE", "skills": ["Python", "AWS", "Docker", "Kubernetes"], "location": "Noida", "applications": 1, "internship_ids": [5], "projects": "CI/CD Pipeline setup", "status": "shortlisted", "ranking": 1 },
    { "id": 5, "name": "Deepika Verma", "education": "MBA HR", "skills": ["Recruitment", "Employee Engagement"], "location": "Pune", "applications": 2, "internship_ids": [4], "projects": "HR Policy Review", "status": "promising", "ranking": 2 },
    { "id": 6, "name": "Arjun Mehta", "education": "B.Sc Statistics", "skills": ["Python", "Pandas", "Tableau"], "location": "Mumbai", "applications": 1, "internship_ids": [2], "projects": "Sales Dashboard", "status": "promising", "ranking": 2 },
    { "id": 7, "name": "Vikram Rathod", "education": "B.Tech IT", "skills": ["Java", "Spring Boot", "MySQL"], "location": "Delhi", "applications": 1, "internship_ids": [1], "projects": "Library Management System", "status": "not-recommended", "ranking": 3 },
]
# --- API Endpoints ---
@app.route('/')
def index():
    return "You're not supposed to be here!"

@app.route('/api/internships')
def get_internships():
    return jsonify(internships_data)

@app.route('/api/candidates')
def get_candidates():
    return jsonify(candidates_data)

@app.route('/api/internships/<int:internship_id>/candidates')
def get_candidates_for_internship(internship_id):
    applied_candidates = [
        candidate for candidate in candidates_data
        if internship_id in candidate.get("internship_ids", [])
    ]
    return jsonify(applied_candidates)

# if __name__ == '__main__':
#     # app.run(host='0.0.0.0', port=port, debug=True)
#     port = int(os.environ.get("PORT", 8080))
#     serve(app, host='0.0.0.0', port=port)
#     # pass
    # app.run()