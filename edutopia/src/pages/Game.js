import React, { useState, useEffect } from 'react';
import PopUp from './PopUp';
import Question from './Question';
import Battle from './Battle';
import PlayerObject from './game/PlayerObject.js';

function Game() {
  const api_link = "http://localhost:9020/get_question?topic_id=";
  const api_link = "http://localhost:9020/get_question?topic_id=";
  const [question, setQuestion] = useState('');
  const [score, setScore] = useState(0)
  const [selectedTopics, setSelectedTopics] = useState([]);

  const playerEx = new PlayerObject(1);

  const playerEx = new PlayerObject(1);

  // This function will be passed to the PopUp component
  const handleTopicsChange = (newTopics) => {
    // Update the selected topics in the parent component
    setSelectedTopics(newTopics);
  };

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
  

  const getQuestionClick = async() => {
    var topic = '1' // Default for safety?
    if (selectedTopics.length !== 0) {
      const randomIndex = Math.floor(Math.random() * selectedTopics.length);
      topic = selectedTopics[randomIndex];
    }
    await fetchQuestion(topic)
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
 //score add
 const addScore = (time) => {
 const addScore = (time) => {
  setScore(score + 1);
  };

  //question modal
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };
  const questionAndToggle = async () => {
    await getQuestionClick();
    toggleModal();
  };

  if(modal) {
    document.body.classList.add('questionModal')
  } else {
    document.body.classList.remove('questionModal')
  }

  //battle modal
  const [battleModal, setBattleModal] = useState(false);
  const toggleBattleModal = () => {
    setBattleModal(!battleModal);
  };

  const questionAndBattle = async () => {
    await getQuestionClick();
    toggleBattleModal();
  };

  if(battleModal) {
    document.body.classList.add('battleModal')
    document.body.classList.add('questionModal')
  } else {
    document.body.classList.remove('questionModal')
  }

  //battle modal
  const [battleModal, setBattleModal] = useState(false);
  const toggleBattleModal = () => {
    setBattleModal(!battleModal);
  };

  const questionAndBattle = async () => {
    await getQuestionClick();
    toggleBattleModal();
  };

  if(battleModal) {
    document.body.classList.add('battleModal')
  } else {
    document.body.classList.remove('battleModal')
  }


  return (
    <div className="game">
      <PopUp isOpen={isModalOpen} onClose={closeModal} onTopicsChange={handleTopicsChange} />
      <div>
      <p>GAMEEEE</p>
      <p>Score: {score}</p>
      <p>Number of troops: {playerEx.troopAmount}</p>
      <p>Number of troops: {playerEx.troopAmount}</p>
      </div>
      
      
      
      <button onClick={questionAndToggle} href="questionModal" class="modal-button">
      <button onClick={questionAndToggle} href="questionModal" class="modal-button">
       open
      </button>

      <button onClick={questionAndBattle} href="battleModal" class="modal-button">
       open battle
      </button>

      <button onClick={questionAndBattle} href="battleModal" class="modal-button">
       open battle
      </button>

      {modal && (
        <div id="questionModal" class="modal">
          <div className="overlay">
            <Question questionJson={question} close={toggleModal} scoreAdd={addScore}></Question>
            </div>
        </div>
      )}

      {battleModal && (
        <div id="battleModal" class="battleModal">
          <div className="overlay">
            <Battle player={playerEx} questionJson={question} close={toggleBattleModal}></Battle>
            </div>
        </div>
      )}
      
    </div>
  );
}

export default Game;
