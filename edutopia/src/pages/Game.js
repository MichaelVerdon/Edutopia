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
import aiPlayer from './game/aiPlayer';
import Tile from './game/Tile';
import sounds from './game/sounds/soundImports.js';
import PopupMenu from './PopupMenu';

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
  battleTiles: {},
});

function Game() {
  const api_link = "http://localhost:9000/get_question?topic_id=";
  
  const [player, setPlayer] = useState(new PlayerObject(1, new Tile(1, 1, -2), "_Blue"));
  const [opponent, setOpponent] = useState(new aiPlayer(2, new Tile(2, 0, -2), "_Pink"));
  const [opponent1, setOpponent1] = useState(new aiPlayer(3, new Tile(0, 1, -1), "_Cyan"));
  const [opponent2, setOpponent2] = useState(new aiPlayer(4, new Tile(0, 0, 0), "_Yellow"));

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
  const [gameLoopStep, setGameLoopStep] = useState(-2);
  const [shopAndTroopTime, setShopAndTroopTime] = useState(false);
  const [battleTiles, setBattleTiles] = useState([]);
  const [ownedTroops, setOwnedTroops] = useState(player.getFreeTroops); // State for owned troops
  const [isPopupMenuOpen, setPopupMenuOpen] = useState(false); // State for popup menu
  const [loadedGameData, setLoadedGameData] = useState(null);

  const saveGame = () => {
  // save player data
  const saveData = {
    tilesOwned: player.ownedTiles,
    resources: {
      techPoints: player.techPoints,
      woodPoints: player.woodPoints,
      foodPoints: player.foodPoints,
      metalPoints: player.metalPoints
    },
    turn: turn
  };

  // Convert data to JSON
  const saveJSON = JSON.stringify(saveData);

  // Save data to localStorage 
  localStorage.setItem('gameSave', saveJSON);

  console.log('Game saved!');
  };

  const loadGame = () => {
    // Load saved game data from localStorage
    const savedData = localStorage.getItem('gameSave');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setLoadedGameData(parsedData);
      console.log('Saved Data:', parsedData);
    } else {
      console.log('No saved game data found.');
    }
  };

  useEffect(() => {
    if (turn === 1) {
      player.freeTroops = ownedTroops;
      console.log(player.freeTroops);

    } else if (turn === 2) {
      opponent.freeTroops = ownedTroops;
      console.log(opponent.freeTroops);

    } else if (turn === 3) {
      opponent1.freeTroops = ownedTroops;
      console.log(opponent1.freeTroops);

    } else if (turn === 4) {
      opponent2.freeTroops = ownedTroops;
      console.log(opponent2.freeTroops);

    }
  }, [ownedTroops]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPopupMenuOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const boardRef = useRef(null);

  const allocateTroops = (hex) => {
    if (boardRef.current) {
      boardRef.current.allocateTroops(hex);
    }
  };

  const storeRef = useRef();

  const handleAiPurchase = (tile, item) => {
    if (storeRef.current) {
      storeRef.current.aiPurchase(tile, item);
    }
  };

  const toggleGameState = () => {
    setGameState(!gameOver);
  }

  // Function to calculate and update resources per turn based on owned tiles
  const generateResourcesPerTurn = () => {
    // Calculate resources generated per turn based on owned tiles
    if (turn === 1) {
      player.calculateResourcesPerTurn();
    } else if (turn === 2) {
      opponent.calculateResourcesPerTurn();
    } else if (turn === 3) {
      opponent1.calculateResourcesPerTurn();
    } else if (turn === 4) {
      opponent2.calculateResourcesPerTurn();
    }
  };

  const handleTopicsChange = (newTopics) => {
    setSelectedTopics(newTopics);
  };

  const fetchQuestion = async (topic_id) => {
    try {
      const response = await fetch(api_link + topic_id);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  const getQuestionClick = () => {
    var topic = '1'; // Default for safety?
    if (selectedTopics.length !== 0) {
      const randomIndex = Math.floor(Math.random() * selectedTopics.length);
      topic = selectedTopics[randomIndex];
    }
    fetchQuestion(topic)
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

  const deselect = () => {
    GameSettings.clearClickedHexagon();
  };

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

  if (modal) {
    document.body.classList.add('active-modal');
  } else {
    document.body.classList.remove('active-modal');
  }

  const toggleGameLoopModal = () => {
    deselect();
    setGameLoopModal(!gameLoopModal);
  };

  if (gameLoopModal) {
    document.body.classList.add('gameLoopModal');
  } else {
    document.body.classList.remove('gameLoopModal');
  }

  const toggleBattleModal = () => {
    deselect();
    setBattleModal(!battleModal);
  };

  if (battleModal) {
    document.body.classList.add('battleModal');
  } else {
    document.body.classList.remove('battleModal');
  }

  const toggleStoreModal = () => {
    sounds[0].play();
    setStoreModal(!storeModal); // Toggle the visibility of the store modal

    // If we are opening the store, set the source to 'HUD', otherwise reset it
    const newSource = !storeModal ? 'HUD' : null;
    GameSettings.saveSourceOfStore(newSource);
  };

  if (storeModal) {
    document.body.classList.add('active-storeModal');
  } else {
    document.body.classList.remove('active-storeModal');
  }

  const delay = ms => new Promise(res => setTimeout(res, ms));

  const playersTurn = async () => {
    if (turn === 1 && opponent.liveStatus) {
      return (2);
    }else if ((turn === 2 && opponent1.liveStatus) || (turn === 1 && opponent1.liveStatus)) {
      return (3);
    } else if ((turn === 3 && opponent2.liveStatus) || (turn === 2 && opponent2.liveStatus) || (turn === 1 && opponent2.liveStatus)) {
      return (4);
    } else {
      return (1);
    }
  }

  const continueGame = () => {
    let cont = true;
    let deadCount = 0;
    console.log(player.liveStatus);

    if (player.liveStatus === false) {
      cont = false;
    } else if (opponent.liveStatus === false) {
      deadCount = deadCount + 1;
    } else if (opponent1.liveStatus === false) {
      deadCount = deadCount + 1;
    } else if (opponent2.liveStatus === false) {
      deadCount = deadCount + 1;
    }
    if (deadCount === 3) {
      cont = false
    }
    return (cont);
  }

  const setTroopsNumber = (plyr) =>{
    if(plyr === 1){
      setOwnedTroops(player.freeTroops);
    }else if(plyr === 2){
      setOwnedTroops(opponent.freeTroops);
    }else if(plyr === 3){
      setOwnedTroops(opponent1.freeTroops);
    }else if(plyr === 4){
      setOwnedTroops(opponent2.freeTroops);
    }
  }

  useEffect(() => {
    const fce = async () => {
      if (gameLoopStep === -1) {
        setGameText("Your starting tile is " + JSON.stringify(player.ownedTiles[0].getCoords()));
        toggleGameLoopModal();
        await delay(2000);
        setGameLoopModal(false);
      }
      else if (gameLoopStep === 0) {
        setGameText("It is player's " + turn + " turn");
        generateResourcesPerTurn();
        toggleGameLoopModal();
        await delay(2000);
        setGameLoopModal(false);
      } else if (gameLoopStep === 1 && modal === false) {
        await questionAndToggle();
      } else if (gameLoopStep === 2) {
        setGameText('Time to shop and assign troops');
        setShopAndTroopTime(true);
        toggleGameLoopModal();
        await delay(2000);
        setGameLoopModal(false);
      } else if (gameLoopStep === 4 && battleModal === false) {
        setShopAndTroopTime(false);
        toggleBattleModal();
      } else if (gameLoopStep === 5) {
        let cont = continueGame();
        if (cont === true) {
          setTurn(await playersTurn());
          setTroopsNumber(await playersTurn());
          setGameText('Next players turn');
          toggleGameLoopModal();
          await delay(2000);
          setGameLoopModal(false);
        } else if (cont === false) {
          gameOver(true);
          if (player.liveStatus === false) {
            setGameText('You lost');
            toggleGameLoopModal();
            await delay(2000);
            setGameLoopModal(false);
          } else if (player.liveStatus === true) {
            setGameText('You win');
            toggleGameLoopModal();
            await delay(2000);
            setGameLoopModal(false);
          }
        }
      }
    }
    const aiPlayerTurnFce = async () => {
      if (gameLoopStep === 0) {
        setGameText("It is player's " + turn + " turn");
        generateResourcesPerTurn();
        toggleGameLoopModal();
        await delay(2000);
        setGameLoopModal(false);
      } else if (gameLoopStep === 1 && modal === false) {
        if (turn === 2) {
          setOwnedTroops(opponent.getFreeTroops);
          await questionAndToggle();
          opponent.answerQuestion();
          await delay(2000);
          setModal(false);
        } else if (turn === 3) {
          setOwnedTroops(opponent1.getFreeTroops);
          await questionAndToggle();
          opponent1.answerQuestion();
          await delay(2000);
          setModal(false);
        } else if (turn === 4) {
          setOwnedTroops(opponent2.getFreeTroops);
          await questionAndToggle();
          opponent2.answerQuestion();
          await delay(2000);
          setModal(false);
        }
      } else if (gameLoopStep === 2) {
        setGameText('Time to shop and assign troops');
        //setShopAndTroopTime(true);
        //toggleGameLoopModal();
        toggleStoreModal();
        await delay(2000);
        //setGameLoopModal(false);
        let hex = [];
        if (turn === 2) {
          let arr = await opponent.shopping();
          handleAiPurchase(arr[0], arr[1]);
          console.log(opponent);
          hex = await opponent.allocateTroopsHex();
          //opponent.freeTroops = opponent.getFreeTroops - hex.length;
        } else if (turn === 3) {
          let arr = await opponent1.shopping();
          handleAiPurchase(arr[0], arr[1]);
          hex = await opponent1.allocateTroopsHex();
          //opponent1.freeTroops = opponent1.getFreeTroops - hex.length;
        } else if (turn === 4) {
          let arr = await opponent2.shopping();
          handleAiPurchase(arr[0], arr[1]);
          hex = await opponent2.allocateTroopsHex();
          //opponent2.freeTroops = opponent2.getFreeTroops - hex.length;
        }
        //toggleStoreModal();
        for (let i=0; i < hex.length; i++){
          allocateTroops(hex[i]);
        }
        setGameLoopStep(4);
      } else if (gameLoopStep === 4 && battleModal === false) {
        setShopAndTroopTime(false);
        if (turn === 2) {
          setBattleTiles(await opponent.battleOthers());
          toggleBattleModal();
        } else if (turn === 3) {
          setBattleTiles(await opponent1.battleOthers());
          toggleBattleModal();
        } else if (turn === 4) {
          setBattleTiles(await opponent2.battleOthers());
          toggleBattleModal();
        }
      } else if (gameLoopStep === 5) {
        let cont = continueGame();
        if (cont === true) {
          setTurn(await playersTurn());
          setGameText('Next players turn');
          toggleGameLoopModal();
          await delay(2000);
          setGameLoopModal(false);
        } else if (cont === false) {
          gameOver(true);
          if (player.liveStatus === false) {
            setGameText('You lost');
            toggleGameLoopModal();
            await delay(2000);
            setGameLoopModal(false);
          } else if (player.liveStatus === true) {
            setGameText('You win');
            toggleGameLoopModal();
            await delay(2000);
            setGameLoopModal(false);
          }
        }
      }
    }
    if (gameOver === false && gameLoopStep >= -1 && turn === 1) {
      fce();
    } else if (gameOver === false && gameLoopStep >= -1) {
      aiPlayerTurnFce();
    }
  }, [gameOver, gameLoopStep]);

  useEffect(() => {
    if (!gameLoopModal && gameLoopStep === -1) {
      setGameLoopStep(0);
    } else if (!gameLoopModal && gameLoopStep === 0) {
      setGameLoopStep(1);
    } else if (!gameLoopModal && gameLoopStep === 2) {
      setGameLoopStep(3);
    } else if (!gameLoopModal && gameLoopStep === 5) {
      setGameLoopStep(0);
    }
  }, [gameLoopModal]);

  useEffect(() => {
    if (!modal) {
      setGameLoopStep(2);
    }
  }, [modal]);

  useEffect(() => {
    if (!battleModal) {
      setGameLoopStep(5);
    }
  }, [battleModal]);

  const gameLoop = async () => {
    sounds[2].play();
    toggleGameState();
    setTurn(1);
    setGameLoopStep(-1);
  }

  return (
    <PlayerContext.Provider value={{ player, setPlayer, opponent, setOpponent, opponent1, setOpponent1, opponent2, setOpponent2, turn, setTurn, battleTiles, ownedTroops, setOwnedTroops }}>
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
            <Store ref={storeRef} storeModal={storeModal} isOpen={storeModal} close={() => { toggleStoreModal(); deselect(); }} ></Store>
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

      {isPopupMenuOpen && <PopupMenu isOpen={isPopupMenuOpen} onClose={() => setPopupMenuOpen(false)} saveGame={saveGame} loadGame={loadGame}/>}

      <div className="game">

        <div className='hudContainer'>

          <PopUp isOpen={isModalOpen} onClose={closeModal} onTopicsChange={handleTopicsChange} />

          <div className='hudElementContainer'>
            <div className='buttons-container'>

              {gameOver && (
                <button onClick={gameLoop} className="btn-modal">
                  Start Game
                </button>
              )}

              {shopAndTroopTime && (
                <>
                  <button onClick={toggleStoreModal} className="btn-modal" href="storeModal">
                    Shop
                  </button>
                  <button onClick={() => {setGameLoopStep(4); sounds[0].play()}} className="btn-modal" href="battleModal">
                    Battle
                  </button>
                </>
              )}

            </div>

            <ResourceBar techPoints={player.techPoints} woodPoints={player.woodPoints} foodPoints={player.foodPoints} metalPoints={player.metalPoints} ownedTroops={ownedTroops}>
            </ResourceBar>
          </div>

        </div>
        <div className='hexContainer'>
          <Board ref={boardRef} saveSelection={saveSelection} toggleStoreModal={toggleStoreModal} ownedTroops={ownedTroops} setOwnedTroops={setOwnedTroops} />
        </div>
      </div>
    </PlayerContext.Provider>
  );
}


export default Game;
