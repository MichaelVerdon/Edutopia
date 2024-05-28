import React, { useState, useEffect, createContext } from "react";
import PopUp from "./PopUp";
import Question from "./Question";
import Board from "./game/Board";
import PlayerObject from "./game/PlayerObject";
import Store from "./Store";
import ResourceBar from "./ResourceBar";
import "./Game.css";
import NotificationManager from "../pages/game/NotificationManager";
import gameSettings from "./game/GameSettings";
import Battle from "./Battle";
import GameLoopModal from "./GameLoopModal";
import Tile from "./game/Tile";
import { GridGenerator } from "react-hexgrid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const PlayerContext = createContext({
  player: null,
  setPlayer: () => {},
  opponent: null,
  setOpponent: () => {},
  opponent1: null,
  setOpponent1: () => {},
  opponent2: null,
  setOpponent2: () => {},
  turn: 0,
  setTurn: () => {},
});

function Game() {
  const api_link = "http://localhost:9000/get_question?topic_id=";

  const [tiles, setTiles] = useState([]);
  const [focusedTile, setFocusedTile] = useState(null);

  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [opponent1, setOpponent1] = useState(null);
  const [opponent2, setOpponent2] = useState(null);

  const [turn, setTurn] = useState(0);
  const [gameOver, setGameState] = useState(true);
  const [gameText, setGameText] = useState("");
  const [question, setQuestion] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [gameLoopModal, setGameLoopModal] = useState(false);
  const [battleModal, setBattleModal] = useState(false);
  const [storeModal, setStoreModal] = useState(false);
  const [gameLoopStep, setGameLoopStep] = useState(-1);
  const [shopAndTroopTime, setShopAndTroopTime] = useState(false);
  const [showClaimTilePopup, setShowClaimTilePopup] = useState(true);

  const createPlayer = (id, color, tile) => {
    if (!tile) {
      console.error(`No tile available for player ${id} with color ${color}`);
      return null;
    }
    tile.setOwner(id);
    tile.setBiome(`Grassland_${color}`);
    return new PlayerObject(id, tile, color);
  };

  const initializeTiles = () => {
    // Adjust the hexCoordinates to generate a grid with q values from -5 to 6
    const hexCoordinates = GridGenerator.hexagon(29 + 13).filter(coord => coord.q >= -13 && coord.q <= 29);
    const playerColors = ["Blue", "Pink", "Cyan", "Yellow"];
    const assignedTiles = [];
  
    // Adjust board bounds dynamically based on the q value
    const boardBounds = (q) => {
      let rMin, rMax;
      switch (q) { // Size of Hexagons must be between 0,0,0 and 15,29,-44
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
      const biome = gameSettings.getBiomeForCoordinates(coord.q, coord.r, coord.s);
      return biome !== "Water"; // Ensure it excludes water tiles
    });
  
    // Shuffle array utility function
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
  
    // Randomly shuffle the coordinates to get random starting positions
    const shuffledCoords = shuffleArray(validCoordinates);
  
    // Assign one tile to each player, ensuring they are not within 5 tiles of each other
    playerColors.forEach((color, index) => {
      let assigned = false;
      while (!assigned && shuffledCoords.length > 0) {
        const tileCoord = shuffledCoords.pop(); // Remove a tile from shuffledCoords
        if (tileCoord) {
          const { rMin, rMax } = boardBounds(tileCoord.q);
          if (tileCoord.r >= rMin && tileCoord.r <= rMax) {
            // Check if the tile is at least 5 tiles away from already assigned tiles
            const isFarEnough = assignedTiles.every(assignedTile => hexDistance(tileCoord, assignedTile) >= 5);
            if (isFarEnough) {
              const tile = new Tile(tileCoord.q, tileCoord.r, tileCoord.s);
              tile.setOwner(index + 1); // Set owner based on player index
              tile.setBiome(`Grassland_${color}`);
              tile.calculateResourceYield(); // Calculate initial resources based on biome
              assignedTiles.push(tile);
              assigned = true;
            }
          }
        }
      }
    });
  
    // Ensure all players have a tile
    if (assignedTiles.length !== 4) {
      console.error("Not all players could be assigned a tile. Check tile initialization logic.");
    }
  
    return assignedTiles;
  };
  

  useEffect(() => {
    const initTiles = initializeTiles();
    setTiles(initTiles);
    console.log('Initial Tiles:', initTiles); // Debug log

    const newPlayer = createPlayer(1, "Blue", initTiles.find(tile => tile.owner === 1));
    const newOpponent = createPlayer(2, "Pink", initTiles.find(tile => tile.owner === 2));
    const newOpponent1 = createPlayer(3, "Cyan", initTiles.find(tile => tile.owner === 3));
    const newOpponent2 = createPlayer(4, "Yellow", initTiles.find(tile => tile.owner === 4));

    if (newPlayer && newOpponent && newOpponent1 && newOpponent2) {
      setPlayer(newPlayer);
      setOpponent(newOpponent);
      setOpponent1(newOpponent1);
      setOpponent2(newOpponent2);
    } else {
      console.error('Failed to create one or more players.');
    }
  }, []);

  const redistributeTiles = () => {
    const allPlayers = [player, opponent, opponent1, opponent2];
    allPlayers.forEach((p) => {
      if (p && p.ownedTiles.length < 1) {  // Ensure at least one tile is owned
        const additionalTiles = tiles.filter((tile) => !tile.isOwned()).slice(0, 1);
        additionalTiles.forEach((tile) => {
          p.addOwnedTile(tile);
          tile.setOwner(p.playerId);
        });
      }
    });
    setTiles([...tiles]);
  };

  useEffect(() => {
    const interval = setInterval(redistributeTiles, 10000); 
    return () => clearInterval(interval);
  }, [tiles, player, opponent, opponent1, opponent2]);

  const toggleGameState = () => {
    setGameState(!gameOver);
  };

  const handleTopicsChange = (newTopics) => {
    setSelectedTopics(newTopics);
  };

  const fetchQuestion = async (topic_id) => {
    return fetch(api_link + topic_id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        throw error;
      });
  };

  const getQuestionClick = async () => {
    var topic = "1";
    if (selectedTopics.length !== 0) {
      const randomIndex = Math.floor(Math.random() * selectedTopics.length);
      topic = selectedTopics[randomIndex];
    }
    await fetchQuestion(topic)
      .then((data) => {
        setQuestion(data);
      })
      .catch((error) => console.error("Error fetching question:", error));
  };

  useEffect(() => {
    setModalOpen(true);
  }, []);

  const closeModal = () => {
    setModalOpen(false);
  };

  const deselect = () => {
    gameSettings.clearClickedHexagon();
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
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const toggleGameLoopModal = () => {
    deselect();
    setGameLoopModal(!gameLoopModal);
  };

  if (gameLoopModal) {
    document.body.classList.add("gameLoopModal");
  } else {
    document.body.classList.remove("gameLoopModal");
  }

  const toggleBattleModal = () => {
    deselect();
    setBattleModal(!battleModal);
  };

  if (battleModal) {
    document.body.classList.add("battleModal");
  } else {
    document.body.classList.remove("battleModal");
  }

  const toggleStoreModal = () => {
    setStoreModal(!storeModal);

    const newSource = !storeModal ? "HUD" : null;
    gameSettings.saveSourceOfStore(newSource);
  };

  if (storeModal) {
    document.body.classList.add("active-storeModal");
  } else {
    document.body.classList.remove("active-storeModal");
  }

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const playersTurn = async () => {
    if (turn === 1) {
      return 2;
    } else if (turn === 2) {
      return 3;
    } else if (turn === 3) {
      return 4;
    } else {
      return 1;
    }
  };

  const continueGame = () => {
    let cont = true;
    let deadCount = 0;
    console.log(player.liveStatus);

    if (player.liveStatus === false) {
      cont = false;
    } else {
      if (opponent.liveStatus === false) deadCount += 1;
      if (opponent1.liveStatus === false) deadCount += 1;
      if (opponent2.liveStatus === false) deadCount += 1;
    }
    if (deadCount === 3) {
      cont = false;
    }
    return cont;
  };

  const handleClaimTile = (hexData) => {
    const currentPlayer = turn === 1 ? player : turn === 2 ? opponent : turn === 3 ? opponent1 : turn === 4 ? opponent2 : null;
    if (currentPlayer.isTileAdjacent(hexData) && !hexData.isOwned()) {
      currentPlayer.addOwnedTile(hexData);
      hexData.setOwner(currentPlayer.getPlayerID());
      setTiles([...tiles]);
    }
  };

  useEffect(() => {
    const fce = async () => {
      if (gameLoopStep === 0) {
        setGameText("It is player's " + turn + " turn");
        toggleGameLoopModal();
        await delay(2000);
        setGameLoopModal(false);
      } else if (gameLoopStep === 1 && modal === false) {
        await questionAndToggle();
      } else if (gameLoopStep === 2) {
        setGameText("Time to shop and assign troops");
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
          setGameText("Next player's turn");
          toggleGameLoopModal();
          await delay(2000);
          setGameLoopModal(false);
          setTurn(await playersTurn());
        } else if (cont === false) {
          setGameState(true);
          if (player.liveStatus === false) {
            setGameText("You lost");
            toggleGameLoopModal();
            await delay(2000);
            setGameLoopModal(false);
          } else if (player.liveStatus === true) {
            setGameText("You win");
            toggleGameLoopModal();
            await delay(2000);
            setGameLoopModal(false);
          }
        }
      }
    };
    if (gameOver === false && gameLoopStep >= 0) {
      fce();
    }
  }, [gameOver, gameLoopStep]);

  useEffect(() => {
    if (!gameLoopModal && gameLoopStep === 0) {
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
    toggleGameState();
    setTurn(1);
    setGameLoopStep(0);
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        setPlayer,
        opponent,
        setOpponent,
        opponent1,
        setOpponent1,
        opponent2,
        setOpponent2,
        turn,
        setTurn,
      }}
    >
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
            <Question
              questionJson={question}
              isOpen={modal}
              close={toggleModal}
            ></Question>
          </div>
        </div>
      )}

      {storeModal && (
        <div id="storeModal" className="storeModal">
          <div className="overlay">
            <Store
              storeModal={storeModal}
              isOpen={storeModal}
              close={() => {
                toggleStoreModal();
                deselect();
              }}
            ></Store>
          </div>
        </div>
      )}

      {gameLoopModal && (
        <div className="gameLoopModal">
          <div className="overlay">
            <GameLoopModal
              text={gameText}
              isOpen={gameLoopModal}
              close={toggleGameLoopModal}
            ></GameLoopModal>
          </div>
        </div>
      )}

      <div className="game">
        <div className="hudContainer">
          <PopUp
            isOpen={isModalOpen}
            onClose={closeModal}
            onTopicsChange={handleTopicsChange}
          />
          <div className="hudElementContainer">
            <div className="buttons-container">
              {gameOver && (
                <button onClick={gameLoop} className="btn-modal">
                  Start Game
                </button>
              )}

              {shopAndTroopTime && (
                <>
                  <button
                    onClick={toggleStoreModal}
                    className="btn-modal"
                    href="storeModal"
                  >
                    Store
                  </button>
                  <button
                    onClick={() => setGameLoopStep(4)}
                    className="btn-modal"
                    href="battleModal"
                  >
                    Ready
                  </button>
                </>
              )}
            </div>
            <ResourceBar />
          </div>
        </div>
        <div className="hexContainer">
          {player && opponent && opponent1 && opponent2 && (
            <Board
              players={[player, opponent, opponent1, opponent2]}
              saveSelection={saveSelection}
              toggleStoreModal={toggleStoreModal}
              currentPlayer={player}
              tiles={tiles}
              focusedTile={focusedTile}
              showClaimTilePopup={showClaimTilePopup}
              handleClaimTile={handleClaimTile}
            />
          )}
        </div>
      </div>
      <ToastContainer />
    </PlayerContext.Provider>
  );
}

export default Game;
