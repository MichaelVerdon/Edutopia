import React , { useState, useEffect } from 'react';

function Game() {

  // Using the Api to obtain a question.
  var api_link = "http://localhost:9000/get_question?topic_id="
  // Topics to be questioned on will be stored in this array with their equivalent id number.
  var topic_ids = []

  const [question, setQuestion] = useState(null);

  // This function will fetch a question using the api
  const fetchQuestion = (topic_id) => {
    fetch(api_link + topic_id)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setQuestion(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  useEffect(() => {
    fetchQuestion("1"); // Fetch a question when the component mounts
  }, []);

  return (
    <div className="game">
      <p>GAMEEEE</p>
      <p>{question ? question : "Loading question..."}</p>
    </div>
  );
}

export default Game;
