from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__)

app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "teammeng"
app.config["MYSQL_DB"] = "questions"

mysql = MySQL(app)

@app.route("/")
def index():
    return "Hello Flask!"

if __name__ == "__main__":
    app.run(debug=True)