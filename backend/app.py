from flask import Flask, request, jsonify, session
import random
from flask_cors import CORS

from flask_mysqldb import MySQL

app = Flask(__name__)
CORS(app)
app.secret_key = "290347520935670823"

app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "up930421"
app.config["MYSQL_DB"] = "questions"

mysql = MySQL(app)


@app.route("/get_question", methods=["GET"])
def get_question():
    topic_id = request.args.get("topic_id")

    session.setdefault("questions", [])

    # Check argument is valid
    if topic_id is None:
        return jsonify({"error": "missing 'topic_id' parameter"}), 400

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM topic_questions WHERE topic_id = %s", (topic_id,))
    questions = cur.fetchall()
    cur.close()

    # Return 404 if no questions found
    if not questions:
        return jsonify({"error": "No questions found for the specified topic_id"}), 404

    # Check if all questions have been asked, reset if needed
    if len(session["questions"]) == len(questions):
        session["questions"] = []

    # Select a random question from retrieved questions

    while True:
        question = questions[random.randint(0, len(questions) - 1)]
        if question not in session["questions"]:
            break

    session["questions"].append(question)
    session.modified = True

    return jsonify(question)


if __name__ == "__main__":
    app.run(debug=False, port=9020)

# http://localhost:9000/get_question?topic_id=1
