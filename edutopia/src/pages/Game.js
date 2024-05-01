import React, { useState, useEffect, createContext, useContext } from 'react';
import PopUp from './PopUp';
import Question from './Question';
import Board from './game/Board';
import PlayerObject from './game/PlayerObject';
import Store from './Store';
//import Battle from './Battle';
import ResourceBar from './ResourceBar';
import './Game.css';
import gameConfig from '../pages/game/configurations.json';
import NotificationManager from '../pages/game/NotificationManager';
import GameSettings from './game/GameSettings';
import Battle from './Battle';


export const PlayerContext = createContext({
  player: {},
  setPlayer: () => {},
  opponent: {},
  setOpponent: () => {},
});

function Game() {
  const api_link = "http://localhost:9000/get_question?topic_id=";
  const [question, setQuestion] = useState('');
  const [score, setScore] = useState(0)
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedHex, setSelectedHex] = useState(null);
  const [shouldTriggerSaveSelection, setShouldTriggerSaveSelection] = useState(false);
  
  const [player, setPlayer] = useState(new PlayerObject(1, [-0,0,0], "_Blue"));
  const [opponent, setOpponent] = useState(new PlayerObject(2, [1,0,-1], "_Pink"));
  const [gameOver, setGameState] = useState(true);

  const toggleGameState = () => {
    setGameState(!gameOver);
  }

  const handleTopicsChange = (newTopics) => {
    
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

  const deselect = () => {
    GameSettings.clearClickedHexagon();
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

  const saveSelection = () => {
    console.log("Selection Saved");
    toggleStoreModal();
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  //battle modal
  const [battleModal, setBattleModal] = useState(false);
  const toggleBattleModal = () => {
    deselect();
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

   //store modal
   const [storeModal, setStoreModal] = useState(false);
   const toggleStoreModal = () => {
    setStoreModal(!storeModal); // Toggle the visibility of the store modal

    // If we are opening the store, set the source to 'HUD', otherwise reset it
    const newSource = !storeModal ? 'HUD' : null;
    GameSettings.saveSourceOfStore(newSource);
};

 
 
   if(storeModal) {
     document.body.classList.add('active-storeModal')
   } else {
     document.body.classList.remove('active-storeModal')
     //NotificationManager.showSuccessNotification("Test");
   }

  //<Battle close={toggleBattleModal} isOpen={battleModal}></Battle>

  // Handles events in sequence
  const gameLoop = () => {
    //toggleGameState();
    questionAndToggle();
    
  }
  
  return (
    <PlayerContext.Provider value={{player, setPlayer, opponent, setOpponent}}>
      {battleModal && (
        <div id="battleModal" class="battleModal">
          <div className="overlay">
             <Battle close={toggleBattleModal} isOpen={battleModal}></Battle>
            </div>
        </div>
      )}

      {modal && (
          <div className="modal">
            <div className="overlay">
              <Question questionJson={question} close={toggleModal}></Question>
              </div>
          </div>
        )}

      {storeModal && (
        <div id="storeModal" class="storeModal">
          <div className="overlay">
            <Store storeModal={storeModal} isOpen={storeModal} close={() => { toggleStoreModal(); deselect(); }} ></Store>
            </div>
        </div>
        )}

      <div className="game">

      <div className='hudContainer'>

        <PopUp isOpen={isModalOpen} onClose={closeModal} onTopicsChange={handleTopicsChange} />

        <div className='hudElementContainer'>
        <div className='buttons-container'> {/* New container for the buttons */}

        {gameOver && (
        <button onClick={gameLoop} className="btn-modal">
        Start Game
        </button>
        )}

          <button onClick={toggleStoreModal} className="btn-modal" href="storeModal">
          Store
          </button>

          <button onClick={toggleBattleModal} className="btn-modal" href="battleModal">
          Battle
          </button>
        </div>
        
          <ResourceBar techPoints={player.techPoints} woodPoints={player.woodPoints} foodPoints={player.foodPoints} metalPoints={player.metalPoints}>
          </ResourceBar>
      </div>

    </div>
    <div className='hexContainer'>
        <Board saveSelection={saveSelection} toggleStoreModal={toggleStoreModal}/>
      </div>
  </div>
  </PlayerContext.Provider>
  );
}

export default Game;
