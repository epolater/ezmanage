import os
import requests
import urllib.parse
import openpyxl
from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
from functools import wraps
from datetime import datetime, timedelta


# Configure SQLite database
db = SQL("sqlite:///database.db")

project_name = 'Astana Towers'
cutoff_date = '2021-11-30'
project_id = db.execute("SELECT project_id FROM projects WHERE project_name=?", project_name)[0]['project_id']
list = db.execute("SELECT project_id, cutoff FROM data WHERE project_id=? AND cutoff=?", project_id, cutoff_date)

print(len(list))

"""for i in range(25,96):
    db.execute("DELETE FROM data WHERE id=?", i)"""
