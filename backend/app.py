from flask import Flask, request, jsonify

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

    if topic_id is None:
        return jsonify({"error": "missing 'topic_id' paramter"}), 400

    cur = mysql.connection.cursor()
    cur.execute(f"SELECT * FROM topic_questions WHERE topic_id = {topic_id}")
    question = cur.fetchall()
    cur.close()

    return jsonify(question)


if __name__ == "__main__":
    app.run(debug=False, port=9000)
