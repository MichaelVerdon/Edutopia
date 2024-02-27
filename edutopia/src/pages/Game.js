import React, { useState, useEffect } from 'react';
import PopUp from './PopUp';
import Question from './Question';
import Board from './game/Board';
import PlayerObject from './game/PlayerObject';
import Store from './Store';
import './Game.css';
import GameHandler from './game/GameHandler';

function Game() {
  const api_link = "http://localhost:9020/get_question?topic_id=";
  const [question, setQuestion] = useState('');
  const [score, setScore] = useState(0)
  const [selectedTopics, setSelectedTopics] = useState([]);

  const [fakePlayer, setFakePlayer] = useState(new PlayerObject(1));
  

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
 const addScore = () => {
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
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

   //store modal
   const [storeModal, setStoreModal] = useState(false);
   const toggleStoreModal = () => {
     setStoreModal(!storeModal);
   };
 
 
   if(storeModal) {
     document.body.classList.add('active-storeModal')
   } else {
     document.body.classList.remove('active-storeModal')
   }

  function gameLoop(){
    var gameOver = false;
    //let gameHandler = new GameHandler();
    while(!gameOver){
      // Question Logic

      // Points Logic

      // Tile Claiming Logic

      // Buying Logic

      // Battle Logic

      // End turn Logic
    }
  }


  return (
    <div className="game">

        {modal && (
          <div className="modal">
            <div className="overlay">
              <Question questionJson={question} close={toggleModal} scoreAdd={addScore}></Question>
              </div>
          </div>
        )}

        {storeModal && (
        <div id="storeModal" class="storeModal">
          <div className="overlay">
            <Store storeModal={storeModal} close={toggleStoreModal} player={fakePlayer} setPlayer={setFakePlayer}></Store>
            </div>
        </div>
        )}

      <div className='hudContainer'>
        <button onClick={questionAndToggle} className="btn-modal">
        open
        </button>
        <button onClick={toggleStoreModal} className="btn-modal" href="storeModal">
        store
        </button>

        
        <PopUp isOpen={isModalOpen} onClose={closeModal} onTopicsChange={handleTopicsChange} />
        <div className='display: flex'>
          <p>GAMEEEE</p>
          <p>Score: {score}</p>
          <p>Tech: {fakePlayer.techPoints} wood: {fakePlayer.woodPoints} food: {fakePlayer.foodPoints} metal: {fakePlayer.metalPoints}</p>

        </div>
      </div>
      <div className='hexContainer'>
        <Board/>
      </div>
    </div>
  );
}

export default Game;
