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

  const [tiles, setTiles] = useState(initializeTiles());
  const [focusedTile, setFocusedTile] = useState(null);

  const createPlayer = (id, color, tile) => {
    tile.setOwner(id);
    return new PlayerObject(id, tile, color);
  };

  const [player, setPlayer] = useState(() =>
    createPlayer(1, "_Blue", tiles[0])
  );
  const [opponent, setOpponent] = useState(() =>
    createPlayer(2, "_Pink", tiles[1])
  );
  const [opponent1, setOpponent1] = useState(() =>
    createPlayer(3, "_Cyan", tiles[2])
  );
  const [opponent2, setOpponent2] = useState(() =>
    createPlayer(4, "_Yellow", tiles[3])
  );

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
  const [showClaimTilePopup, setShowClaimTilePopup] = useState(true); // New state to control claim tile popup

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
    } else if (opponent.liveStatus === false) {
      deadCount += 1;
    } else if (opponent1.liveStatus === false) {
      deadCount += 1;
    } else if (opponent2.liveStatus === false) {
      deadCount += 1;
    }
    if (deadCount === 3) {
      cont = false;
    }
    return cont;
  };


  // Function to handle claiming tiles
const handleClaimTile = (hexData) => {
  const currentPlayer = player; // Assuming 'player' is the current player
  if (currentPlayer.isTileAdjacent(hexData) && !hexData.isOwned()) {
    currentPlayer.addOwnedTile(hexData);
    hexData.setOwner(currentPlayer.getPlayerID());
    setTiles([...tiles]); // Update state to trigger re-render
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
          setGameState(true); // End the game
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
            <ResourceBar
              techPoints={player.techPoints}
              woodPoints={player.woodPoints}
              foodPoints={player.foodPoints}
              metalPoints={player.metalPoints}
            ></ResourceBar>
          </div>
        </div>
        <div className="hexContainer">
          <Board
            player={player}
            saveSelection={saveSelection}
            toggleStoreModal={toggleStoreModal}
            currentPlayer={player}
            tiles={tiles}
            focusedTile={focusedTile}
            showClaimTilePopup={showClaimTilePopup}
            handleClaimTile={handleClaimTile} // Pass the claim tile handler
          />
        </div>
      </div>
      <ToastContainer />
    </PlayerContext.Provider>
  );
}

// Game.js - initializeTiles function already provided in previous step
function initializeTiles() {
  const hexCoordinates = GridGenerator.hexagon(5); // Adjust radius as needed for more space
  const spacing = 3; // Minimum spacing between player tiles

  // Filter hexCoordinates to only include light green tiles
  const validCoordinates = hexCoordinates.filter((coord) => {
    const biome = gameSettings.getBiomeForCoordinates(coord.q, coord.r, coord.s);
    return biome === "Grassland_Unclaimed";
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

  // Function to calculate distance between two hexes
  const hexDistance = (hex1, hex2) => {
    return (
      (Math.abs(hex1.q - hex2.q) +
        Math.abs(hex1.r - hex2.r) +
        Math.abs(hex1.s - hex2.s)) /
      2
    );
  };

  // Assign tiles to players ensuring they are at least 'spacing' apart
  const assignedTiles = [];
  for (const hex of shuffledCoords) {
    if (
      assignedTiles.every(
        (assignedHex) => hexDistance(hex, assignedHex) > spacing
      )
    ) {
      assignedTiles.push(hex);
      if (assignedTiles.length === 4) {
        // Assuming 4 players, adjust as necessary
        break;
      }
    }
  }

  // Convert to Tile objects and assign owners
  return assignedTiles.map((coord, index) => {
    const tile = new Tile(coord.q, coord.r, coord.s);
    tile.setOwner(index + 1); // Set owner based on index (1, 2, 3, 4)
    return tile;
  });
}


export default Game;
