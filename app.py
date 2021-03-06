

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
    session["skill"] = query[0]["autoprogress"]

    # Gets user_id of user
    session["user_id"] = db.execute("SELECT * FROM users WHERE username=:username;", username=session["username"])[0]["id"]

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
    session["skill"] = "1.1"

    # Adds them to the database
    db.execute('INSERT INTO users (username, hash, autoprogress) VALUES(:username, :password_hash, "1.1");',
                username=session["username"],
                password_hash=generate_password_hash(request.form.get("password"), "pbkdf2:sha256", 8))

    # Gets user_id of newly created user
    session["user_id"] = db.execute("SELECT * FROM users WHERE username=:username;", username=session["username"])[0]["id"]

    # Redirects them to the homepage
    return redirect("/")


# View your profile
@app.route("/profile", methods=["GET", "POST"])
def profile():
    # Check if some bully is trying to break the site by going to /profile while not logged in
    if get_user() == "":
        return redirect("/")

    # User is visiting their profile page
    if request.method == "GET":
        return render_template("profile.html", username=session["username"], skill=session["skill"])

    # User has just submitted a form

    # The user is trying to change their username
    if request.form.get("type") == "username":

        # Make sure user isn't trying to change their username to a username that is taken
        if len(db.execute("SELECT * FROM users WHERE username=:username;", username=request.form.get("one"))) != 0:
            return render_template("profile.html", username=session["username"],
                                    skill=session["skill"],
                                    status="That username is already taken, sorry")

        # Nothing wrong happened, so we can update the user's username
        db.execute("UPDATE users SET username=:new WHERE username=:old;", new=request.form.get("one"), old=session["username"])
        session["username"] = request.form.get("one")
        return render_template("profile.html", username=session["username"], skill=session["skill"])

    # The user is trying to change their password

    # Make sure user typed in the correct old password
    query = db.execute("SELECT * FROM users WHERE username=:username;", username=session["username"])
    if not check_password_hash(query[0]["hash"], request.form.get("one")):
        return render_template("profile.html", username=session["username"],
                                skill=session["skill"],
                                status="Incorrect old password. If you forgot your password, you will be very upset soon")

    # Nothing wrong happened, so we can change their password
    db.execute("UPDATE users SET hash=:password_hash WHERE username=:username",
                password_hash=generate_password_hash(request.form.get("two"), "pbkdf2:sha256", 8),
                username=session["username"])
    return render_template("profile.html", username=session["username"], skill=session["skill"], status="password changed successfully")


# Let user log out of their account
@app.route("/logout")
def logout():
    # Clear the saved information about the user
    session.clear()

    # Send them back to the homepage
    return redirect("/")


# Let user make their own workout
@app.route("/custom", methods=["GET", "POST"])
def custom():

    # Sees if user is signed in
    user = get_user()

    if request.method == "GET":
        # User is not signed in, and is viewing the page normally
        if user == "":
            return render_template("custom.html", user="")

        # User is signed in, and is viewing the page normally
        presets = db.execute("SELECT questions, preset_name FROM presets WHERE userid=:user_id;", user_id=session["user_id"])
        return render_template("custom.html", user=user, presets=presets)

    if user != "" and request.form.get("delete_preset") != "":
        # User wants to delete a preset
        db.execute("DELETE FROM presets WHERE userid=:user_id AND preset_name=:preset_name;",
        user_id=session["user_id"],
        preset_name=request.form.get("delete_preset"))

        # Let them see the page again
        presets = db.execute("SELECT questions, preset_name FROM presets WHERE userid=:user_id;", user_id=session["user_id"])
        return render_template("custom.html", user=user, presets=presets)

    if user != "" and request.form.get("preset_dropdown") != "":
            # User is signed in, so we need to update the SQL database

            # Check if that preset already exists
            if request.form.get("new_preset?") == "Yes":
                # Create a new preset for them
                db.execute("INSERT INTO presets (userid, questions, preset_name) VALUES (:userid, :questions, :name);",
                userid=session["user_id"],
                questions=request.form.get("j_questions"),
                name=request.form.get("preset_name"))

            else:
                # Update their existing preset
                db.execute("UPDATE presets SET questions=:questions WHERE preset_name=:preset_name AND userid=:userid",
                questions=request.form.get("j_questions"),
                preset_name=request.form.get("preset_name"),
                userid=session["user_id"])

    # Serve them the new customized.html page using the config they just made in custom.html
    return render_template("customized.html", user=user, config=request.form.get("j_questions"))


# Give user an automatically generate workout
@app.route("/auto", methods=["GET", "POST"])
def auto():
    if request.method == "GET":
        if get_user() == "":
            return render_template("auto.html", user="")

        return render_template("auto.html", user=get_user(), skill=session["skill"])

    db.execute("UPDATE users SET autoprogress=:skill WHERE username=:username;",
        skill=request.form.get("skill"),
        username=session["username"])

    session["skill"] = request.form.get("skill")

    song = request.form.get("song")
    song = song[len(song)-5:len(song)-4]

    if request.form.get("audio") == "yes":
        return render_template("auto.html", user=session["username"], skill=session["skill"],
        status=f"Congratulations, your skill has been raised to {session['skill']}!",
        audio="yes", song=song, time=request.form.get("time"))

    return render_template("auto.html", user=session["username"], skill=session["skill"],
        status=f"Congratulations, your skill has been raised to {session['skill']}!")

