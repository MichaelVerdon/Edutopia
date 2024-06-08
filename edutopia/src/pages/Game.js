import React, { useReducer, useState, useEffect, createContext, useContext, useRef } from 'react';
import { GridGenerator } from "react-hexgrid";
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

  const [tiles, setTiles] = useState([]); // Added by Zaid
  const [focusedTile, setFocusedTile] = useState(null); // Added By Zaid
  const [player, setPlayer] = useState(null); // Added By Zaid
  const [opponent, setOpponent] = useState(null); // Added By Zaid
  const [opponent1, setOpponent1] = useState(null); // Added By Zaid
  const [opponent2, setOpponent2] = useState(null); // Added By Zaid

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
  const [ownedTroops, setOwnedTroops] = useState(0); // Initialize with 0
  const [isPopupMenuOpen, setPopupMenuOpen] = useState(false); // State for popup menu
  const [questionAsked, setQuestionAsked] = useState(false);


  // Initialize Tiles and Players
  useEffect(() => {
    const initTiles = initializeTiles();
    setTiles(initTiles);
    console.log('Initializing tiles and players', initTiles);

    const newPlayerTile = initTiles.find(tile => tile.owner === 1);
    const newOpponentTile = initTiles.find(tile => tile.owner === 2);
    const newOpponent1Tile = initTiles.find(tile => tile.owner === 3);
    const newOpponent2Tile = initTiles.find(tile => tile.owner === 4);

    if (!newPlayerTile || !newOpponentTile || !newOpponent1Tile || !newOpponent2Tile) {
      console.error('Failed to assign tiles to all players.', {
        newPlayerTile,
        newOpponentTile,
        newOpponent1Tile,
        newOpponent2Tile,
      });
      return;
    }

    const newPlayer = new PlayerObject(1, newPlayerTile, "Blue");
    const newOpponent = new aiPlayer(2, newOpponentTile, "Pink");
    const newOpponent1 = new aiPlayer(3, newOpponent1Tile, "Cyan");
    const newOpponent2 = new aiPlayer(4, newOpponent2Tile, "Yellow");

    if (newPlayer && newOpponent && newOpponent1 && newOpponent2) {
      setPlayer(newPlayer);
      setOpponent(newOpponent);
      setOpponent1(newOpponent1);
      setOpponent2(newOpponent2);
      setOwnedTroops(newPlayer.getFreeTroops); // Correctly access freeTroops
    } else {
      console.error('Failed to create one or more players.');
    }
  }, []);

  // Validate that player object is updated correctly when ownedTroops changes
  useEffect(() => {
    if (turn === 1 && player) {
      player.freeTroops = ownedTroops;
      console.log('Updated player freeTroops:', player.freeTroops);
    }
  }, [ownedTroops, turn, player]);

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
    console.log("Attempting to allocate troops. Available troops:", ownedTroops);
    console.log("Target hex:", hex);
    if (boardRef.current && ownedTroops > 0) {
      boardRef.current.allocateTroops(hex);
      setOwnedTroops(ownedTroops - 1); // Decrease the number of available troops
      console.log("Troops allocated. Remaining troops:", ownedTroops - 1);
    } else {
      console.log("No troops available to allocate.");
    }
  };

  // Function to Initialize Tiles / Zaid
  const initializeTiles = () => {
    const hexCoordinates = GridGenerator.hexagon(10); // Adjust the size as necessary
    const playerColors = ["Blue", "Pink", "Cyan", "Yellow"];
    const assignedTiles = [];

    // Shuffle array utility function
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Adjust board bounds dynamically based on the q value
    const boardBounds = (q) => {
      let rMin, rMax;
      switch (q) {
        case -13: rMin = 26; rMax = 29; break;
        case -12: rMin = 24; rMax = 29; break;
        case -11: rMin = 22; rMax = 29; break;
        case -10: rMin = 20; rMax = 29; break;
        case -9: rMin = 18; rMax = 29; break;
        case -8: rMin = 16; rMax = 29; break;
        case -7: rMin = 14; rMax = 29; break;
        case -6: rMin = 12; rMax = 29; break;
        case -5: rMin = 10; rMax = 29; break;
        case -4: rMin = 8; rMax = 29; break;
        case -3: rMin = 6; rMax = 29; break;
        case -2: rMin = 4; rMax = 29; break;
        case -1: rMin = 2; rMax = 29; break;
        case 0: rMin = 0; rMax = 29; break;
        case 1: rMin = 0; rMax = 29; break;
        case 2: rMin = 0; rMax = 29; break;
        case 3: rMin = 0; rMax = 29; break;
        case 4: rMin = 0; rMax = 29; break;
        case 5: rMin = 0; rMax = 29; break;
        case 6: rMin = 0; rMax = 29; break;
        case 7: rMin = 0; rMax = 29; break;
        case 8: rMin = 0; rMax = 29; break;
        case 9: rMin = 0; rMax = 29; break;
        case 10: rMin = 0; rMax = 29; break;
        case 11: rMin = 0; rMax = 29; break;
        case 12: rMin = 0; rMax = 29; break;
        case 13: rMin = 0; rMax = 29; break;
        case 14: rMin = 0; rMax = 29; break;
        case 15: rMin = 0; rMax = 29; break;
        case 16: rMin = 0; rMax = 27; break;
        case 17: rMin = 0; rMax = 25; break;
        case 18: rMin = 0; rMax = 23; break;
        case 19: rMin = 0; rMax = 21; break;
        case 20: rMin = 0; rMax = 19; break;
        case 21: rMin = 0; rMax = 17; break;
        case 22: rMin = 0; rMax = 15; break;
        case 23: rMin = 0; rMax = 13; break;
        case 24: rMin = 0; rMax = 11; break;
        case 25: rMin = 0; rMax = 9; break;
        case 26: rMin = 0; rMax = 7; break;
        case 27: rMin = 0; rMax = 5; break;
        case 28: rMin = 0; rMax = 3; break;
        case 29: rMin = 0; rMax = 1; break;
        default: rMin = -5; rMax = 29; break;
      }
      return { rMin, rMax };
    };

    // Calculate the distance between two hexCoordinates
    const hexDistance = (a, b) => {
      return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
    };

    // Filter hexCoordinates to only include valid tiles (not Water) and valid s values
    const validCoordinates = hexCoordinates.filter((coord) => {
      const { rMin, rMax } = boardBounds(coord.q);
      if (coord.r < rMin || coord.r > rMax || coord.s > 0 || coord.s < -44) {
        return false;
      }
      const biome = GameSettings.getBiomeForCoordinates(coord.q, coord.r, coord.s);
      return biome !== "Water"; // Ensure it excludes water tiles
    });

    // Shuffle hex coordinates to randomize starting positions
    const shuffledCoords = shuffleArray(validCoordinates);

    // Assign one tile to each player, ensuring they are not within 5 tiles of each other
    playerColors.forEach((color, index) => {
      let assigned = false;
      while (!assigned && shuffledCoords.length > 0) {
        const tileCoord = shuffledCoords.pop(); // Get a random tile from shuffled coordinates
        if (tileCoord) {
          const isFarEnough = assignedTiles.every(assignedTile => hexDistance(tileCoord, assignedTile) >= 5);
          if (isFarEnough) {
            const tile = new Tile(tileCoord.q, tileCoord.r, tileCoord.s);
            tile.setOwner(index + 1); // Set owner based on player index (1-based)
            tile.setBiome(`Grassland_${color}`); // Set biome to Grassland with player color
            assignedTiles.push(tile); // Add tile to assigned tiles
            assigned = true;
          }
        }
      }
    });

    // Ensure all players have a tile
    if (assignedTiles.length !== playerColors.length) {
      console.error("Not all players could be assigned a tile. Check tile initialization logic.");
    }

    // Assign remaining tiles with their respective biomes based on coordinates
    const allTiles = hexCoordinates.map(coord => {
      const tile = new Tile(coord.q, coord.r, coord.s);
      const existingTile = assignedTiles.find(t => t.q === coord.q && t.r === coord.r && t.s === coord.s);
      if (!existingTile) {
        const biome = GameSettings.getBiomeForCoordinates(coord.q, coord.r, coord.s); // Determine biome based on coordinates
        tile.setBiome(biome);
      } else {
        tile.setOwner(existingTile.owner);
        tile.setBiome(existingTile.biome);
      }
      return tile;
    });

    return allTiles;
  };

  // Function to calculate and update resources per turn based on owned tiles
  const generateResourcesPerTurn = () => {
    if (turn === 1 && player) {
      player.calculateResourcesPerTurn();
    } else if (turn === 2 && opponent) {
      opponent.calculateResourcesPerTurn();
    } else if (turn === 3 && opponent1) {
      opponent1.calculateResourcesPerTurn();
    } else if (turn === 4 && opponent2) {
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
  };

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
  };

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
  if (!questionAsked) {
    await getQuestionClick();
    setQuestionAsked(true); // Set to true after asking the question
    setModal(!modal); // This toggles the modal based on its previous state
  }
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
    if (turn === 1) {
      return (2);
    } else if (turn === 2) {
      return (3);
    } else if (turn === 3) {
      return (4);
    } else {
      return (1);
    }
  };

  const continueGame = () => {
    let cont = true;
    let deadCount = 0;
    if (player.liveStatus === false) {
      cont = false;
    } else {
      if (opponent.liveStatus === false) deadCount++;
      if (opponent1.liveStatus === false) deadCount++;
      if (opponent2.liveStatus === false) deadCount++;
    }
    if (deadCount === 3) {
      cont = false;
    }
    return cont;
  };

  useEffect(() => {
    const fce = async () => {
      if (gameLoopStep === -1) {
        setGameText("Your starting tile is " + JSON.stringify(player.ownedTiles[0].getCoords()));
        toggleGameLoopModal();
        await delay(2000);
        setGameLoopModal(false);
      } else if (gameLoopStep === 0) {
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
          setGameText('Next players turn');
          toggleGameLoopModal();
          await delay(2000);
          setGameLoopModal(false);
          setTurn(await playersTurn());
        } else if (cont === false) {
          setGameState(true);
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
    };

    const aiPlayerTurnFce = async () => {
      if (gameLoopStep === 0) {
        setGameText("It is player's " + turn + " turn");
        generateResourcesPerTurn();
        toggleGameLoopModal();
        await delay(2000);
        setGameLoopModal(false);
      } else if (gameLoopStep === 1 && modal === false) {
        if (turn === 2) {
          await questionAndToggle();
          opponent.answerQuestion();
          await delay(2000);
          setModal(false);
        } else if (turn === 3) {
          await questionAndToggle();
          opponent1.answerQuestion();
          await delay(2000);
          setModal(false);
        } else if (turn === 4) {
          await questionAndToggle();
          opponent2.answerQuestion();
          await delay(2000);
          setModal(false);
        }
      } else if (gameLoopStep === 2) {
        setGameText('Time to shop and assign troops');
        setShopAndTroopTime(true);
        toggleGameLoopModal();
        await delay(2000);
        setGameLoopModal(false);
        let hex = [];
        if (turn === 2) {
          setOwnedTroops(opponent.getFreeTroops);
          hex = await opponent.allocateTroopsHex();
          opponent.freeTroops = opponent.getFreeTroops - hex.length;
        } else if (turn === 3) {
          setOwnedTroops(opponent1.getFreeTroops);
          hex = await opponent1.allocateTroopsHex();
          opponent1.freeTroops = opponent1.getFreeTroops - hex.length;
        } else if (turn === 4) {
          setOwnedTroops(opponent2.getFreeTroops);
          hex = await opponent2.allocateTroopsHex();
          opponent2.freeTroops = opponent2.getFreeTroops - hex.length;
        }
        for (let i = 0; i < hex.length; i++) {
          allocateTroops(hex[i]);
        }
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
          setGameText('Next players turn');
          toggleGameLoopModal();
          await delay(2000);
          setGameLoopModal(false);
          setTurn(await playersTurn());
        } else if (cont === false) {
          setGameState(true);
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
    };
    if (gameOver === false && gameLoopStep >= -1 && turn === 1) {
      fce();
    } else if (gameOver === false && gameLoopStep >= -1) {
      aiPlayerTurnFce();
    }
  }, [gameOver, gameLoopStep, player, opponent, opponent1, opponent2, modal, turn]);

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
    setGameState(false); // Ensure game state is set to false to indicate the game is running
    setTurn(1);
    setGameLoopStep(-1);
  };

  return (
    <PlayerContext.Provider value={{ player, setPlayer, opponent, setOpponent, opponent1, setOpponent1, opponent2, setOpponent2, turn, setTurn, battleTiles, ownedTroops, setOwnedTroops }}>
      {battleModal && (
        <div id="battleModal" className="battleModal">
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
        <div id="storeModal" className="storeModal">
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

      {isPopupMenuOpen && <PopupMenu isOpen={isPopupMenuOpen} onClose={() => setPopupMenuOpen(false)} />}

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
                  <button onClick={() => { setGameLoopStep(4); sounds[0].play() }} className="btn-modal" href="battleModal">
                    Battle
                  </button>
                </>
              )}

            </div>

            {player && <ResourceBar techPoints={player.techPoints} woodPoints={player.woodPoints} foodPoints={player.foodPoints} metalPoints={player.metalPoints} ownedTroops={ownedTroops} />}

          </div>

        </div>
        <div className='hexContainer'>
          <Board
            ref={boardRef}
            toggleStoreModal={toggleStoreModal}
            ownedTroops={ownedTroops}
            setOwnedTroops={setOwnedTroops}
            tiles={tiles} // Pass the initialized tiles to Board ###Zaid
            currentPlayer={player} // Pass the current player ###Zaid
          />
        </div>

      </div>
    </PlayerContext.Provider>
  );
}

export default Game;
