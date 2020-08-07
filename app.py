

# Imports libraries
from cs50 import SQL
from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from tempfile import mkdtemp

# Configure application
app = Flask(__name__)

# Reloads the server when I make changes to the files
# This saves a bunch of time, so I don't have to reload it manually to test things
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure flask so that it stores session files in a temporary filesystem instead of using cookies
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure the database
db = SQL("sqlite:///mt.db")


# Homepage
@app.route("/")
def index():
    # Check if user is logged in
    if not "username" in session.keys():
        user = ""
    else:
        user = session["username"]

    # Serves the index.html page
    return render_template("index.html", user=user)

# Sign in page
@app.route("/signin")
def signin():
    session["username"] = "it works!"
    return redirect("/")



