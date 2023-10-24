from flask import Flask
from flask_mysqldb import MySql

app = Flask(__name__)

app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "teammeng"
app.config["MYSQL_DB"] = "questions"

@app.route("/")
def hello_world():
    return "Hello Flask!"

if __name__ == "__main__":
    app.run(debug=True)