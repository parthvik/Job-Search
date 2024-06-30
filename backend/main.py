from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import databases
import sqlalchemy
from sqlalchemy.sql import select
from fuzzywuzzy import process
import urllib.parse
import os
from dotenv import load_dotenv
import json
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, DateTime, Boolean, Text, JSON
import time

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
    sqlalchemy.Column("preferredRole", sqlalchemy.String),  # Make sure this column is included
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


app = FastAPI()

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/query-jobs/")
async def query_jobs(query: JobQuery):
    start_time = time.time()  # Start timing
    
    # Fetch skills and process query
    all_skills = await database.fetch_all(select(skills.c.skillId, skills.c.skillName))
    skills_dict = {skill['skillName']: skill['skillId'] for skill in all_skills}
    
    # Match skills using fuzzy logic
    matching_skills = process.extract(query.semanticSearchString, skills_dict.keys(), limit=10)
    matching_skill_ids = [skills_dict[skill[0]] for skill in matching_skills if skill[1] > 70]

    if not matching_skill_ids:
        return {"message": "No skills matched your query.", "query": query.semanticSearchString}

    # Get user IDs from matched skills
    user_skill_query = select(MercorUserSkills.c.userId).where(MercorUserSkills.c.skillId.in_(matching_skill_ids)).distinct()
    user_ids = await database.fetch_all(user_skill_query)
    user_ids = [user['userId'] for user in user_ids]

    if not user_ids:
        return {"message": "No users found with the matching skills."}

    # Retrieve user details for the top matching users
    user_query = select(jobs).where(jobs.c.userId.in_(user_ids)).limit(4)  # Limiting results
    users_with_skills = await database.fetch_all(user_query)

    result = []
    for user in users_with_skills:
        user_skills_query = select(skills.c.skillName).join(MercorUserSkills, skills.c.skillId == MercorUserSkills.c.skillId).where(MercorUserSkills.c.userId == user['userId'])
        user_skills = await database.fetch_all(user_skills_query)
        user_skills_list = [skill['skillName'] for skill in user_skills]

        result.append({
            "user_id": user['userId'],
            "name": user['name'],
            "email": user['email'],
            "skills": user_skills_list
        })

    end_time = time.time()  # End timing
    execution_time = end_time - start_time  # Calculate execution time

    return {"users": result, "execution_time": execution_time}






if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
