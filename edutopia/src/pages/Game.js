import React, { useState, useEffect } from 'react';
import PopUp from './PopUp';

function Game() {
  const api_link = "http://localhost:9000/get_question?topic_id=";
  const [question, setQuestion] = useState(null);

  const fetchQuestion = (topic_id) => {
    return fetch(api_link + topic_id)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        throw error;
      });
  }
  

  const getQuestionClick = () => {
    // Change "1" to the desired topic_id
    fetchQuestion("1")
      .then(data => {
        setQuestion(data);
      })
      .catch(error => console.error('Error fetching question:', error));
  }

  const [isModalOpen, setModalOpen] = useState(false); 

  // Use useEffect to open the modal on page load
  useEffect(() => {
    setModalOpen(true);
  }, []);

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="game">
      <PopUp isOpen={isModalOpen} onClose={closeModal} />
      <p>GAMEEEE</p>
      <button onClick={getQuestionClick}>Get Question</button>
      <p>{question !== null ? question : "empty"}</p>
    </div>
  );
}

export default Game;
