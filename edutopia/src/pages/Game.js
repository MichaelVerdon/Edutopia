import React, { useReducer, useState, useEffect, createContext, useContext, useRef } from 'react';
import PopUp from './PopUp';
import Question from './Question';
import Board from './game/Board';
import PlayerObject from './game/PlayerObject';
import Store from './Store';
import ResourceBar from './ResourceBar';
import './Game.css';
import gameConfig from '../pages/game/configurations.json';
import NotificationManager from '../pages/game/NotificationManager';
import GameSettings from './game/GameSettings';
import Battle from './Battle';
import GameLoopModal from './GameLoopModal';


export const PlayerContext = createContext({
  player: {},
  setPlayer: () => {},
  opponent: {},
  setOpponent: () => {},
  opponent1: {},
  setOpponent1: () => {},
  opponent2: {},
  setOpponent2: () => {},
  turn: {},
  setTurn: () => {},
});

function Game() {
  const api_link = "http://localhost:9000/get_question?topic_id=";
  
  const [player, setPlayer] = useState(new PlayerObject(1, [0, 0, 0], "_Blue"));
  const [opponent, setOpponent] = useState(new PlayerObject(2, [1, 0, -1], "_Pink"));
  const [opponent1, setOpponent1] = useState(new PlayerObject(3, [0, 1, -1], "_Cyan"));
  const [opponent2, setOpponent2] = useState(new PlayerObject(4, [1, 1, -2], "_Yellow"));

  const [turn, setTurn] = useState(0);
  const [gameOver, setGameState] = useState(true);
  const [gameText, setGameText] = useState('');
  const [question, setQuestion] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [gameLoopModal, setGameLoopModal] = useState(false);
  const [battleModal, setBattleModal] = useState(false);
  const [storeModal, setStoreModal] = useState(false);
  const [gameLoopStep, setGameLoopStep] = useState(-1);
  const [shopAndTroopTime, setShopAndTroopTime] = useState(false);

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
  const toggleModal = () => {
    setModal(!modal);
  };
  const questionAndToggle = async () => {
    await getQuestionClick();
    setModal(!modal);

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

  //generic modal 
  const toggleGameLoopModal = () => {
    deselect();
    setGameLoopModal(!gameLoopModal);
  };

  if(gameLoopModal) {
    document.body.classList.add('gameLoopModal')
  } else {
    document.body.classList.remove('gameLoopModal')
  }

  //battle modal
  const toggleBattleModal = () => {
    deselect();
    setBattleModal(!battleModal);
  };

  if(battleModal) {
    document.body.classList.add('battleModal')
  } else {
    document.body.classList.remove('battleModal')
  }

   //store modal
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

  //shortcut function for delay
  const delay = ms => new Promise(res => setTimeout(res, ms));

   const playersTurn = async () => {
    if (turn === 1){
      return (2);
    } else if (turn === 2){
      return (3);
    }else if (turn === 3){
      return (4);
    }else{
      return (1);
    }
  }

  const continueGame = () =>{
    let cont = true;
    let deadCount = 0;
    console.log(player.liveStatus);

    if (player.liveStatus === false){
      cont = false;
    }else if (opponent.liveStatus === false){
      deadCount = deadCount + 1;
    }else if (opponent1.liveStatus === false){
      deadCount = deadCount + 1;
    }else if (opponent2.liveStatus === false){
      deadCount = deadCount + 1;
    }
    if(deadCount === 3){
      cont = false
    }
    return(cont);
  }

useEffect( () => {
    const fce = async () => {
      if(gameLoopStep===0){
        setGameText("It is player's " + turn + " turn");
        toggleGameLoopModal();
        await delay(2000);
        setGameLoopModal(false);
        //setGameLoopStep(1);
      } else if(gameLoopStep===1 && modal===false){
        await questionAndToggle();
      }else if(gameLoopStep===2){
        setGameText('Time to shop and assign troops');
        setShopAndTroopTime(true);
        toggleGameLoopModal();
        await delay(2000);
        setGameLoopModal(false);
        //setGameLoopStep(3);
      }else if(gameLoopStep===4 && battleModal===false){
        setShopAndTroopTime(false);
        toggleBattleModal();
      }else if(gameLoopStep===5){
        let cont = continueGame();
        if (cont === true){
          setGameText('Next players turn');
          toggleGameLoopModal();
          await delay(2000);
          setGameLoopModal(false);
          setTurn(await playersTurn());
        }else if (cont === false){
          gameOver(true);
          if(player.liveStatus === false){
            setGameText('You lost');
            toggleGameLoopModal();
            await delay(2000);
            setGameLoopModal(false);
          }else if(player.liveStatus === true){
            setGameText('You win');
            toggleGameLoopModal();
            await delay(2000);
            setGameLoopModal(false);
          }
        }
        
        //nextPlayer();
        //setGameLoopStep(0);
      
      } 
    }
    if (gameOver === false && gameLoopStep >= 0){
        fce();
    }
    

  }, [gameOver, gameLoopStep]);
 
  useEffect(() => {
    if (!gameLoopModal && gameLoopStep === 0) {
      // Perform your effect when variable changes from true to false
      // This block will run only when variable changes from true to false
      setGameLoopStep(1);
    }else if (!gameLoopModal && gameLoopStep === 2) {
      // Perform your effect when variable changes from true to false
      // This block will run only when variable changes from true to false
      setGameLoopStep(3);
    }else if (!gameLoopModal && gameLoopStep === 5) {
      // Perform your effect when variable changes from true to false
      // This block will run only when variable changes from true to false
      setGameLoopStep(0);
    }
  }, [gameLoopModal]); // Only run this effect when variable changes

  useEffect(() => {
    if (!modal) {
      // Perform your effect when variable changes from true to false
      // This block will run only when variable changes from true to false
      setGameLoopStep(2);
    }
  }, [modal]); // Only run this effect when variable changes

  useEffect(() => {
    if (!battleModal) {
      // Perform your effect when variable changes from true to false
      // This block will run only when variable changes from true to false
      setGameLoopStep(5);
    }
  }, [battleModal]); // Only run this effect when variable changes
  
  // Handles events in sequence
  const gameLoop = async () => {
    toggleGameState();
    setTurn(1);
    setGameLoopStep(0);
  }

  
  return (
    <PlayerContext.Provider value={{player, setPlayer, opponent, setOpponent, opponent1, setOpponent1, opponent2, setOpponent2, turn, setTurn}}>
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
              <Question questionJson={question} isOpen={modal} close={toggleModal}></Question>
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

        {gameLoopModal && (
          <div className="gameLoopModal">
            <div className="overlay">
              <GameLoopModal text={gameText} isOpen={gameLoopModal} close={toggleGameLoopModal}></GameLoopModal>
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

        {shopAndTroopTime && (
          <><button onClick={toggleStoreModal} className="btn-modal" href="storeModal">
                  Store
                </button><button onClick={() => setGameLoopStep(4)} className="btn-modal" href="battleModal">
                    Ready
                  </button></>
        )}
          {/* <button onClick={toggleBattleModal} className="btn-modal" href="battleModal">
          Battle
          </button> */}

          
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
