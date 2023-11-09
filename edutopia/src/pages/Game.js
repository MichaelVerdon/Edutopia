import React, { useState, useEffect } from 'react';

function Game() {
  const api_link = "http://localhost:9000/get_question?topic_id=";
  const [question, setQuestion] = useState(null);

  const fetchQuestion = (topic_id) => {
    fetch(api_link + topic_id)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        response.json()
      })
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  const getQuestionClick = () => {
    fetchQuestion("1"); // Change "1" to the desired topic_id
  }

  return (
    <div className="game">
      <p>GAMEEEE</p>
      <button onClick={getQuestionClick}>Get Question</button>
      <p>{question ? question : "empty"}</p>
    </div>
  );
}

export default Game;
