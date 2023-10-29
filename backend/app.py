from flask import Flask, request, jsonify, session
import random

from flask_mysqldb import MySQL

app = Flask(__name__)

app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = "teammeng"
app.config["MYSQL_DB"] = "questions"

mysql = MySQL(app)


@app.route("/get_question", methods=["GET"])
def get_question():
    topic_id = request.args.get("topic_id")

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

    session.setdefault("retrieved_questions", [])
    unretrieved_questions = [
        question
        for question in questions
        if question["id"] not in session["retrieved_questions"]
    ]

    # Select a random question from retrieved questions
    question = unretrieved_questions[random.randint(0, len(questions) - 1)]

    return jsonify(question)


if __name__ == "__main__":
    app.run(debug=False, port=9000)
