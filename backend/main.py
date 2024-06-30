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


app = FastAPI()

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/query-jobs/")
async def query_jobs(query: JobQuery):
    all_skills = await database.fetch_all(select(skills.c.skillName))
    skills_list = [skill['skillName'] for skill in all_skills]
    
    matching_skills = process.extract(query.semanticSearchString, skills_list, limit=10)
    matching_skill_names = [match[0] for match in matching_skills if match[1] > 70]  # assuming a threshold score of 70

    query_statement = select(jobs).where(jobs.c.preferredRole.in_(matching_skill_names))
    results = await database.fetch_all(query_statement)
    return results


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
