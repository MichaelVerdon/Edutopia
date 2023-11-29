import React, { useState, useEffect } from 'react';
import PopUp from './PopUp';
import Question from './Question';

function Game() {
  const api_link = "http://localhost:9020/get_question?topic_id=";
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

  //question modal
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };
  const questionAndToggle = () => {
    getQuestionClick;
    toggleModal;
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }


  return (
    <div className="game">
      <PopUp isOpen={isModalOpen} onClose={closeModal} />
      <p>GAMEEEE</p>
      <button onClick={getQuestionClick}>Get Question</button>
      <p>{question ? question : "empty"}</p>
      <button onClick={questionAndToggle} className="btn-modal">
        Open
      </button>

      {modal && (
        <div className="modal">
          <div className="overlay">
            <Question questionJson={question} close={toggleModal}></Question>
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
            </div>
        </div>
      )}
      
    </div>
  );
}

export default Game;
