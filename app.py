

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

# Used for checking if the user is logged in
def get_user():
    if "username" in session.keys():
        return session["username"]
    else:
        return ""


# Homepage
@app.route("/")
def index():
    # Serves the index.html page
    return render_template("index.html", user=get_user())


# Sign in page
@app.route("/signin", methods=["GET", "POST"])
def signin():
    if request.method == "GET":
        # If the user isn't logged in, serve them the login page
        if get_user() == "":
            return render_template("signin.html", status="")

        # If someone who is logged in is trying to break the site by going to /signin, kick them off
        return redirect("/")
    
    # If the user just submitted the sign in form
    query = db.execute("SELECT * FROM users WHERE username=:username;",
            username=request.form.get("username"))

    # Make sure they typed in valid login info
    if len(query) != 1:
        return render_template("signin.html", status="Incorrect username/password, lol")

    if not check_password_hash(query[0]["hash"], request.form.get("password")):
        return render_template("signin.html", status="Incorrect username/password, lol")

    # Updates local dictionary, thereby actually loggin the user in
    session["username"] = request.form.get("username")

    # Redirects them to the homepage
    return redirect("/")


# Register page
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        # If the user isn't logged in, serve them the register page
        if get_user() == "":
            return render_template("register.html", status="")

        # If someone who is logged in is trying to break the site by going to /register, kick them off
        return redirect("/")

    # If a user just submitted the register form
    query = db.execute("SELECT * FROM users WHERE username=:username;", username=request.form.get("username"))

    # Make sure username isn't already taken
    if len(query) != 0:
        return render_template("register.html", status="Username already taken, lol")

    # Sets local dictionary to store user's information
    session["username"] = request.form.get("username")

    # Adds them to the database
    db.execute('INSERT INTO users (username, hash, autoprogress) VALUES(:username, :password_hash, "1.1");',
                username=session["username"],
                password_hash=generate_password_hash(request.form.get("password"), "pbkdf2:sha256", 8))

    # Redirects them to the homepage
    return redirect("/")


# Let user log out of their account
@app.route("/logout")
def logout():
    # Clear the saved information about the user
    session.clear()

    # Send them back to the homepage
    return redirect("/")

