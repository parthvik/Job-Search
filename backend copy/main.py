from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import databases
import sqlalchemy
from sqlalchemy.sql import select, and_
from fuzzywuzzy import process
import urllib.parse
import os
from dotenv import load_dotenv
import json
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, DateTime, Boolean, Text, JSON
import time
from datetime import datetime

load_dotenv()

class JobQuery(BaseModel):
    budget: str
    experience: str
    startDate: str
    workType: str
    semanticSearchString: str

username = urllib.parse.quote_plus('trial_user')
password = urllib.parse.quote_plus('trial_user_12345#')
host = '35.224.61.48'
port = '3306'
database_name = 'MERCOR_TRIAL_SCHEMA'

DATABASE_URL = f"mysql://{username}:{password}@{host}:{port}/{database_name}"
database = databases.Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

skills = sqlalchemy.Table(
    "Skills",
    metadata,
    sqlalchemy.Column("skillId", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("skillName", sqlalchemy.String),
    sqlalchemy.Column("skillValue", sqlalchemy.String, unique=True),
)

jobs = sqlalchemy.Table(
    "MercorUsers",
    metadata,
    sqlalchemy.Column("userId", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("email", sqlalchemy.String, unique=True),
    sqlalchemy.Column("name", sqlalchemy.String),
    sqlalchemy.Column("phone", sqlalchemy.String),
    sqlalchemy.Column("residence", JSON),
    sqlalchemy.Column("profilePic", Text),
    sqlalchemy.Column("createdAt", DateTime),
    sqlalchemy.Column("lastLogin", DateTime),
    sqlalchemy.Column("notes", Text),
    sqlalchemy.Column("referralCode", sqlalchemy.String, unique=True),
    sqlalchemy.Column("isGptEnabled", sqlalchemy.Boolean),
    sqlalchemy.Column("preferredRole", sqlalchemy.String),
    sqlalchemy.Column("fullTimeStatus", sqlalchemy.String),
    sqlalchemy.Column("workAvailability", sqlalchemy.String),
    sqlalchemy.Column("fullTimeSalaryCurrency", sqlalchemy.String),
    sqlalchemy.Column("fullTimeSalary", sqlalchemy.String),
    sqlalchemy.Column("partTimeSalaryCurrency", sqlalchemy.String),
    sqlalchemy.Column("partTimeSalary", sqlalchemy.String),
    sqlalchemy.Column("fullTime", sqlalchemy.Boolean),
    sqlalchemy.Column("fullTimeAvailability", sqlalchemy.Integer),
    sqlalchemy.Column("partTime", sqlalchemy.Boolean),
    sqlalchemy.Column("partTimeAvailability", sqlalchemy.Integer),
    sqlalchemy.Column("w8BenUrl", JSON),
    sqlalchemy.Column("tosUrl", Text),
    sqlalchemy.Column("policyUrls", JSON),
    sqlalchemy.Column("isPreVetted", sqlalchemy.Boolean),
    sqlalchemy.Column("isActive", sqlalchemy.Boolean),
    sqlalchemy.Column("isComplete", sqlalchemy.Boolean),
    sqlalchemy.Column("summary", Text),
    sqlalchemy.Column("preVettedAt", DateTime)
)

MercorUserSkills = sqlalchemy.Table(
    "MercorUserSkills",
    metadata,
    sqlalchemy.Column("userId", sqlalchemy.String, sqlalchemy.ForeignKey("MercorUsers.userId"), primary_key=True),
    sqlalchemy.Column("skillId", sqlalchemy.String, sqlalchemy.ForeignKey("Skills.skillId"), primary_key=True),
    sqlalchemy.Column("isPrimary", sqlalchemy.Boolean, default=False),
    sqlalchemy.Column("order", Integer, default=0)
)

UserResume = sqlalchemy.Table(
    "UserResume",
    metadata,
    sqlalchemy.Column("resumeId", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("userId", sqlalchemy.String, sqlalchemy.ForeignKey("MercorUsers.userId")),
    sqlalchemy.Column("url", Text),
    sqlalchemy.Column("filename", String),
    sqlalchemy.Column("createdAt", DateTime),
    sqlalchemy.Column("updatedAt", DateTime),
    sqlalchemy.Column("source", String),
    sqlalchemy.Column("ocrText", Text),
    sqlalchemy.Column("ocrEmail", String),
    sqlalchemy.Column("ocrGithubUsername", String),
    sqlalchemy.Column("resumeBasedQuestions", Text),
    sqlalchemy.Column("isInvitedToInterview", Boolean),
    sqlalchemy.Column("reminderTasksIds", JSON)
)

WorkExperience = sqlalchemy.Table(
    "WorkExperience",
    metadata,
    sqlalchemy.Column("workExperienceId", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("company", String),
    sqlalchemy.Column("role", String),
    sqlalchemy.Column("startDate", String),
    sqlalchemy.Column("endDate", String),
    sqlalchemy.Column("description", Text),
    sqlalchemy.Column("locationCity", String),
    sqlalchemy.Column("locationCountry", String),
    sqlalchemy.Column("resumeId", String, sqlalchemy.ForeignKey("UserResume.resumeId"))
)

app = FastAPI()
# Configure CORS
origins = [
    "http://localhost:3000",  # Adjust this to the URL of your frontend
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/query-jobs/")
async def query_jobs(query: JobQuery):
    start_time = time.time()  # Start timing
    
    # Fetch and match skills
    all_skills = await database.fetch_all(select(skills.c.skillId, skills.c.skillName))
    skills_dict = {skill['skillName']: skill['skillId'] for skill in all_skills}
    matching_skills = process.extract(query.semanticSearchString, skills_dict.keys(), limit=10)
    matching_skill_ids = [skills_dict[skill[0]] for skill in matching_skills if skill[1] > 70]

    if not matching_skill_ids:
        return {"message": "No skills matched your query.", "query": query.semanticSearchString}

    user_skill_query = select(MercorUserSkills.c.userId).where(MercorUserSkills.c.skillId.in_(matching_skill_ids)).distinct()
    user_ids = await database.fetch_all(user_skill_query)
    user_ids = [user['userId'] for user in user_ids]

    if not user_ids:
        return {"message": "No users found with the matching skills."}

    user_query = (
        select(jobs)
        .where(jobs.c.userId.in_(user_ids), jobs.c.fullTimeSalary <= int(query.budget))
        .order_by(jobs.c.fullTimeSalary.desc())  # Sorting by fullTimeSalary descending
        .limit(4)  # Limiting to 4 results
    )
    users_with_skills = await database.fetch_all(user_query)

    result = []
    for user in users_with_skills:
        user_skills_query = select(skills.c.skillName).join(MercorUserSkills, skills.c.skillId == MercorUserSkills.c.skillId).where(MercorUserSkills.c.userId == user['userId'])
        user_skills = await database.fetch_all(user_skills_query)
        user_skills_list = [skill['skillName'] for skill in user_skills]

        # Fetch resume ID for user
        resume_query = select(UserResume.c.resumeId).where(UserResume.c.userId == user['userId'])
        resume_id = await database.fetch_one(resume_query)

        # Fetch and process work experience
        experience_query = select(WorkExperience).where(WorkExperience.c.resumeId == resume_id['resumeId'])
        experiences = await database.fetch_all(experience_query)
        companies = set()
        total_experience = 0

        for exp in experiences:
            companies.add(exp['company'])
            # Calculate duration
            start_date = datetime.strptime(exp['startDate'], '%Y') if exp['startDate'] else None
            end_date = datetime.strptime(exp['endDate'], '%Y') if exp['endDate'] else datetime.now()
            if start_date:
                duration_years = (end_date.year - start_date.year)
                total_experience += duration_years

        experiences_list = [{'company': exp['company'], 'role': exp['role'], 'startDate': exp['startDate'], 'endDate': exp['endDate']} for exp in experiences]

        result.append({
            "user_id": user['userId'],
            "name": user['name'],
            "email": user['email'],
            "skills": user_skills_list,
            "full_time_salary": user['fullTimeSalary'],
            "companies": list(companies),
            "total_experience_years": total_experience
        })

    execution_time = time.time() - start_time  # Calculate execution time

    return {"users": result, "execution_time": execution_time}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
