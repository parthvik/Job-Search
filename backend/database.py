from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, DateTime, Boolean, Text, JSON
import urllib.parse
# For mysqlclient
import MySQLdb

# For mysql-connector-python
import mysql.connector

username = urllib.parse.quote_plus('trial_user')
password = urllib.parse.quote_plus('trial_user_12345#')
host = '35.224.61.48'
port = '3306'
database_name = 'MERCOR_TRIAL_SCHEMA'

DATABASE_URL = f"mysql://{username}:{password}@{host}:{port}/{database_name}"
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Define your table
jobs = Table(
    "MercorUsers", metadata,
    Column("userId", String(255), primary_key=True),
    Column("email", String(255), unique=True),
    Column("name", String(255)),
    Column("phone", String(255)),
    Column("residence", JSON),
    Column("profilePic", Text),
    Column("createdAt", DateTime),
    Column("lastLogin", DateTime),
    Column("notes", Text),
    Column("referralCode", String(255), unique=True),
    Column("isGptEnabled", Boolean),
    Column("preferredRole", String(255)),  # Ensure this column is included
    Column("fullTimeStatus", String(255)),
    Column("workAvailability", String(255)),
    Column("fullTimeSalaryCurrency", String(255)),
    Column("fullTimeSalary", String(255)),
    Column("partTimeSalaryCurrency", String(255)),
    Column("partTimeSalary", String(255)),
    Column("fullTime", Boolean),
    Column("fullTimeAvailability", Integer),
    Column("partTime", Boolean),
    Column("partTimeAvailability", Integer),
    Column("w8BenUrl", JSON),
    Column("tosUrl", Text),
    Column("policyUrls", JSON),
    Column("isPreVetted", Boolean),
    Column("isActive", Boolean),
    Column("isComplete", Boolean),
    Column("summary", Text),
    Column("preVettedAt", DateTime)
)

# Create the tables in the database
metadata.create_all(engine)
