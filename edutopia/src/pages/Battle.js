import React, { useState, useEffect, useContext, useRef } from "react";
import PlayerObject from "./game/PlayerObject";
import gameSettings from "./game/GameSettings";
import Modal from "react-modal";
import "./Store.css";
import { PlayerContext } from "./Game";
import NotificationManager from "../pages/game/NotificationManager";
import { useAnimate } from "framer-motion";
import TroopIconBlue from "./images/sprites/Troop_Blue.png";
import TroopIconYellow from "./images/sprites/Troop_Yellow.png";
import TroopIconPink from "./images/sprites/Troop_Pink.png";
import TroopIconCyan from "./images/sprites/Troop_Cyan.png";
import Star from "./images/sprites/star.png";

Modal.setAppElement("#root");

function Battle({ close, isOpen }) {
  const [phase, setPhase] = useState(0);
  const {
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
  } = useContext(PlayerContext);
  const [winner, setWinner] = useState(0);
  const [attackedPlayer, setAttackedPlayer] = useState(3);
  const [attackLand, setAttackLand] = useState(null);
  const [attackTroops, setAttackTroops] = useState(0);
  const [opponentDead, setOpponentDead] = useState(false);
  const [opponentLand, setOpponentLand] = useState(null);
  const [opponentTroops, setOpponentTroops] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [TroopIconAttacker, setTroopIconAttacker] = useState("");
  const [TroopIconOpponent, setTroopIconOpponent] = useState("");

  const [scope, animate] = useAnimate();
  const winnerTextRef = useRef(null);

  useEffect(() => {
    if (phase === 3) {
      setTimeout(async () => {
        await enterAnimation();
      }, 10);
    }
  }, [phase]);

  const enterAnimation = async (callback) => {
    if (phase === 3) {
      await animate("#flipTroop", { scaleX: -1 });
      animate("#star", { opacity: [0, 0.8] }, { transition: { duration: 0.25 } });
      animate("#star", { opacity: [0.8, 0] }, { transition: { duration: 0.25 } });
      await animate("#nonFlipTroop", { x: -3 }, { transition: { duration: 0.5 } });
      await animate("#star", { x: 9 });
      animate("#star", { opacity: [0, 0.8] }, { transition: { duration: 0.25 } });
      animate("#star", { opacity: [0.8, 0] }, { transition: { duration: 0.25 } });
      animate("#nonFlipTroop", { x: 3 }, { transition: { duration: 0.5 } });
      await animate("#flipTroop", { x: -3 }, { transition: { duration: 0.5 } });
      await animate("#star", { x: -3 });
      animate("#star", { opacity: [0, 0.8] }, { transition: { duration: 0.25 } });
      animate("#star", { opacity: [0.8, 0] }, { transition: { duration: 0.25 } });
      animate("#flipTroop", { x: 3 }, { transition: { duration: 0.5 } });
      await animate("#nonFlipTroop", { x: -3 }, { transition: { duration: 0.5 } });
      await animate("#star", { x: 5 });
      animate("#star", { opacity: [0, 0.8] }, { transition: { duration: 0.25 } });
      animate("#star", { opacity: [0.8, 0] }, { transition: { duration: 0.25 } });
      animate("#flipTroop", { x: 3 }, { transition: { duration: 0.5 } });
      await animate("#nonFlipTroop", { x: -3 }, { transition: { duration: 0.5 } });

      setTimeout(() => {
        winnerTextRef.current.style.visibility = "visible";
      }, 10);
    }
  };

  const customStyles = {
    overlay: {
      backgroundColor: "transparent",
      pointerEvents: "none",
    },
    content: {
      padding: "15px",
      transform: "translate(-50%, -25%)",
      width: "auto",
      height: "auto",
      pointerEvents: "auto",
    },
  };
  const customStyles2 = {
    content: {
      padding: "15px",
      transform: "translate(-50%, -25%)",
      width: "auto",
      height: "auto",
      pointerEvents: "auto",
    },
  };

  const changePhase = () => {
    setPhase(phase + 1);
  };

  const errorPhase = () => {
    setPhase(4);
  };

  function selectColorTroop(color) {
    if (color === 1) {
      return TroopIconBlue;
    } else if (color === 2) {
      return TroopIconYellow;
    } else if (color === 3) {
      return TroopIconPink;
    } else {
      return TroopIconCyan;
    }
  }

  const playersTurn = async () => {
    if (turn === 1) {
      return player;
    } else if (turn === 2) {
      return opponent;
    } else if (turn === 3) {
      return opponent1;
    } else {
      return opponent2;
    }
  };

  const attackLandSelected = async () => {
    try {
      const { q, r, s } = gameSettings.getClickedHexagon();
      const currentPlayer = await playersTurn();
      console.log(`Selected land to attack with: (${q}, ${r}, ${s})`);
      if (currentPlayer.ownsTile({ q, r, s })) {
        const clickedHexagonTroops = gameSettings.getClickedHexagonTroops();
        gameSettings.clearClickedHexagon();
        setAttackLand({ q, r, s });
        setAttackTroops(clickedHexagonTroops);
        changePhase();
        setTroopIconAttacker(selectColorTroop(turn));
        console.log(`Attack land set: (${q}, ${r}, ${s}) with ${clickedHexagonTroops} troops`);
      } else {
        throw new Error("Invalid land selection.");
      }
    } catch (error) {
      console.error(error);
      errorPhase();
      NotificationManager.showSuccessNotification(
        `You picked the wrong land or didn't pick it at all.`
      );
    }
  };

  const opponentLandSelected = async () => {
    try {
      const { q, r, s } = gameSettings.getClickedHexagon();
      const { q: aq, r: ar, s: as } = attackLand;

      console.log(`Attacking from (${aq}, ${ar}, ${as}) to (${q}, ${r}, ${s})`);
      const adjacent = gameSettings.areTilesAdjacent(aq, ar, as, q, r, s);
      console.log(`Are tiles adjacent: ${adjacent}`);

      if (adjacent) {
        const currentPlayer = await playersTurn();
        let opponent = null;

        if (player.ownsTile({ q, r, s }) && player.playerId !== currentPlayer.playerId) {
          opponent = player;
          console.log("Opponent is player 1");
        } else if (opponent && opponent.ownsTile({ q, r, s }) && opponent.playerId !== currentPlayer.playerId) {
          console.log("Opponent is player 2");
        } else if (opponent1.ownsTile({ q, r, s }) && opponent1.playerId !== currentPlayer.playerId) {
          opponent = opponent1;
          console.log("Opponent is player 3");
        } else if (opponent2.ownsTile({ q, r, s }) && opponent2.playerId !== currentPlayer.playerId) {
          opponent = opponent2;
          console.log("Opponent is player 4");
        } else {
          console.log("Selected tile is neutral or unclaimed");
        }

        const clickedHexagonTroops = gameSettings.getClickedHexagonTroops();
        gameSettings.clearClickedHexagon();
        setOpponentLand({ q, r, s });
        setOpponentTroops(clickedHexagonTroops);
        setAttackedPlayer(opponent ? opponent.playerId : null);
        changePhase();
        setTroopIconOpponent(opponent ? selectColorTroop(opponent.playerId) : null);
        console.log(`Opponent land set: (${q}, ${r}, ${s}) with ${clickedHexagonTroops} troops`);
      } else {
        throw new Error("Selected tile is not adjacent to your attack land.");
      }
    } catch (error) {
      console.error(error);
      errorPhase();
      NotificationManager.showSuccessNotification(
        `You picked the wrong land or didn't pick it at all.`
      );
    }
  };

  // Comparing numbers of troops selected
  async function randomlyChoose(opponentTroopCount, land) {
    let currentPlayer = await playersTurn();
    const chanceOptionAttacker =
      attackTroops / ((attackTroops + opponentTroopCount) / 100) / 100;
    // Generate a random number between 0 and 1
    const randomValue = Math.random();
    // If the random number is less than the chance of option1, choose option1
    if (randomValue <= chanceOptionAttacker) {
      setWinner(turn);
      if (turn === 1) {
        player.addOwnedTile(land); // TODO: later replace with game handler functions later
        if (attackedPlayer === 2) {
          opponent.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(`Player 1`);
        } else if (attackedPlayer === 3) {
          opponent1.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(`Player 1`);
        } else {
          opponent2.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(`Player 1`);
        }
      } else if (turn === 2) {
        opponent.addOwnedTile(land); // TODO: later replace with game handler functions later
        if (attackedPlayer === 1) {
          player.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(`Player 2`);
        } else if (attackedPlayer === 3) {
          opponent1.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(`Player 2`);
        } else {
          opponent2.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(`Player 2`);
        }
      } else if (turn === 3) {
        opponent1.addOwnedTile(land); // TODO: later replace with game handler functions later
        if (attackedPlayer === 1) {
          player.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(`Player 3`);
        } else if (attackedPlayer === 2) {
          opponent.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(`Player 3`);
        } else {
          opponent2.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(`Player 3`);
        }
      } else {
        opponent2.addOwnedTile(land); // TODO: later replace with game handler functions later
        if (attackedPlayer === 1) {
          player.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(
            `Player 4 now owns ${opponent2.getOwnedTiles.length} tiles (player 1 owns ${player.getOwnedTiles.length})`
          );
        } else if (attackedPlayer === 2) {
          opponent.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(
            `Player 4 now owns ${opponent2.getOwnedTiles.length} tiles (player 2 owns ${opponent.getOwnedTiles.length})`
          );
        } else {
          opponent1.setOwnedTiles([]); // TODO: later replace with game handler functions later
          NotificationManager.showSuccessNotification(
            `Player 4 now owns ${opponent2.getOwnedTiles.length} tiles (player 3 owns ${opponent1.getOwnedTiles.length})`
          );
        }
      }
    } else {
      // Otherwise, choose option2
      setWinner(attackedPlayer); // TODO
    }
    // changePhase();
  }

  useEffect(() => {
    if (phase === 2) {
      // Perform your effect when variable changes from true to false
      // This block will run only when variable changes from true to false
      changePhase();
    }
  }, [winner]);

  // Check if after the player wins the opponent still has tiles left
  function OpponentAliveCheck() {
    // TODO: connect it to some dead player function when game handler is finished

    if (attackedPlayer === 2) {
      if (opponent.getOwnedTiles.length === 0) {
        setOpponentDead(true);
        opponent.setAliveStatus = false;
        console.log("dead");
      }
    } else if (attackedPlayer === 3) {
      if (opponent1.getOwnedTiles.length === 0) {
        setOpponentDead(true);
        opponent1.setAliveStatus = false;
        console.log("dead");
      }
    } else if (attackedPlayer === 4) {
      if (opponent2.getOwnedTiles.length === 0) {
        setOpponentDead(true);
        opponent2.setAliveStatus = false;
        console.log("dead");
      }
    } else if (attackedPlayer === 1) {
      if (player.getOwnedTiles.length === 0) {
        setOpponentDead(true);
        player.setAliveStatus = false;
        console.log("dead");
      }
    }
  }

  if (phase === 0) {
    // asking if you want to fight
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={close}
        contentLabel="Battle"
        className="storeModal"
        style={customStyles2}
      >
        <div className="phase-popup">
          <h1>Get ready to battle</h1>
          <h2>Do you want to battle?</h2>
          <button className="btn" onClick={changePhase}>
            yes
          </button>
          <button className="btn" onClick={close}>
            no
          </button>
          <button className="close-btn-small" onClick={close}>
            X
          </button>
        </div>
      </Modal>
    );
  } else if (phase === 1) {
    // select land to fight with
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={close}
        contentLabel="Battle"
        className="storeModal"
        style={customStyles}
      >
        <div className="phase-popup">
          <h1>Get ready to battle</h1>
          <h2>Select a land to attack with</h2>
          <button className="btn" onClick={attackLandSelected}>
            land selected
          </button>
          <button className="close-btn-small" onClick={close}>
            X
          </button>
        </div>
      </Modal>
    );
  } else if (phase === 2) {
    // select land to fight over
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={close}
        contentLabel="Battle"
        className="storeModal"
        style={customStyles}
      >
        <div className="phase-popup">
          <h1>Get ready to battle</h1>
          <h2>Select a land to attack</h2>
          <button className="btn" onClick={opponentLandSelected}>
            land selected
          </button>
          <button className="close-btn-small" onClick={close}>
            X
          </button>
        </div>
      </Modal>
    );
  } else if (phase === 3) {
    // display winner
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={close}
        contentLabel="Battle"
        className="storeModal"
        style={customStyles2}
      >
        <div ref={scope} className="phase-popup">
          <div id="imageParent" className="imageParent">
            <img
              id="nonFlipTroop"
              src={TroopIconAttacker}
              width={90}
              height={90}
              className="nonFlipImage"
              alt="Troop Icon"
            />
            <img
              id="flipTroop"
              src={TroopIconOpponent}
              width={90}
              height={90}
              className="flipImage"
              alt="Troop Icon"
            />
            <img
              id="star"
              src={Star}
              width={13}
              height={13}
              className="star"
              alt="star"
            />
          </div>
          <h1
            id="winnerText"
            className="winnerText"
            style={{ visibility: "hidden" }}
            ref={winnerTextRef}
          >
            Player {winner} wins the land
          </h1>
          <button className="close-btn-small" onClick={close}>
            X
          </button>
        </div>
      </Modal>
    );
  } else if (phase === 4) {
    // warning
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={close}
        contentLabel="Battle"
        className="storeModal"
        style={customStyles2}
      >
        <div className="phase-popup">
          <button className="close-btn-small" onClick={close}>
          X
          </button>
          <h1>Warning</h1>
          <p>You picked the wrong land or didn't pick it at all.</p>
          <button className="btn" onClick={() => setPhase(1)}>
            try again
          </button>
          <button className="btn" onClick={close}>
            close
          </button>
        </div>
      </Modal>
    );
  } else {
    // empty
    return (
      <div>
        <p>error</p>
        <button onClick={close}>close</button>
      </div>
    );
  }
}

export default Battle;

