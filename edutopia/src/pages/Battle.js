import React, { useState, useEffect, useContext, useRef } from 'react';
import Modal from 'react-modal';
import { PlayerContext } from './Game';
import { useAnimate } from "framer-motion";
import NotificationManager from '../pages/game/NotificationManager';
import gameSettings from './game/GameSettings';
import Tile from './game/Tile.js';
import sounds from './game/sounds/soundImports.js';
import TroopIconBlue from './images/sprites/Troop_Blue.png';
import TroopIconYellow from './images/sprites/Troop_Yellow.png';
import TroopIconPink from './images/sprites/Troop_Pink.png';
import TroopIconCyan from './images/sprites/Troop_Cyan.png';
import Star from './images/sprites/star.png';
import './Store.css';


Modal.setAppElement('#root');

function Battle({ close, isOpen }) {
    const [phase, setPhase] = useState(0);
    const { player, setPlayer, opponent, setOpponent, opponent1, setOpponent1, opponent2, setOpponent2, turn, setTurn, battleTiles } = useContext(PlayerContext);
    const [winner, setWinner] = useState(0);
    const [attackedPlayer, setAttackedPlayer] = useState(0);
    const [attackLand, setAttackLand] = useState(null);
    const [attackTroops, setAttackTroops] = useState(0);
    const [opponentLand, setOpponentLand] = useState(null);
    const [opponentTroops, setOpponentTroops] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [TroopIconAttacker, setTroopIconAttacker] = useState('');
    const [TroopIconOpponent, setTroopIconOpponent] = useState('');
    const [opponentDead, setOpponentDead] = useState(false);

    useEffect(() => {
        const aiPlayerBattle = async () => {
            gameSettings.saveClickedHexagon(battleTiles[0][0], battleTiles[0][1], battleTiles[0][2], '');
            let hex = gameSettings.getClickedHexagon();
            setTroopIconAttacker(await selectColorTroop(turn));
            setAttackLand(battleTiles[0]);
            setAttackTroops(gameSettings.getClickedHexagonTroops());

            gameSettings.saveClickedHexagon(battleTiles[1][0], battleTiles[1][1], battleTiles[1][2], '');
            hex = gameSettings.getClickedHexagon();
            if (await gameSettings.getBiomeForCoordinates(battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]).includes('_Pink')) {
                setAttackedPlayer(2);
                setTroopIconOpponent(await selectColorTroop(2));
                await randomlyChoose(gameSettings.getClickedHexagonTroops(), battleTiles[1], 2);
            } else if (await gameSettings.getBiomeForCoordinates(battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]).includes('_Blue')) {
                setAttackedPlayer(1);
                setTroopIconOpponent(await selectColorTroop(1));
                await randomlyChoose(gameSettings.getClickedHexagonTroops(), battleTiles[1], 1);
            } else if (await gameSettings.getBiomeForCoordinates(battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]).includes('_Cyan')) {
                setAttackedPlayer(3);
                setTroopIconOpponent(await selectColorTroop(3));
                await randomlyChoose(gameSettings.getClickedHexagonTroops(), battleTiles[1], 3);
            } else if (await gameSettings.getBiomeForCoordinates(battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]).includes('_Yellow')) {
                setAttackedPlayer(4);
                setTroopIconOpponent(await selectColorTroop(4));
                await randomlyChoose(gameSettings.getClickedHexagonTroops(), battleTiles[1], 4);
            }

            setPhase(3);
        };

        if (battleTiles.length === 0) {
            setPhase(0);
        } else {
            aiPlayerBattle();
        }
    }, [battleTiles]);

    const [scope, animate] = useAnimate();
    const winnerTextRef = useRef(null);

    useEffect(() => {
        setTimeout(async () => { await enterAnimation(); }, 10);
    }, [phase]);

    const enterAnimation = (async (callback) => {
        if (phase === 3) {
            sounds[4].play();
            await animate('#flipTroop', { scaleX: -1 });
            animate("#star", { opacity: [0, 0.8] }, { transition: { duration: 0.25 } });
            animate("#star", { opacity: [0.8, 0] }, { transition: { duration: 0.25 } });
            await animate('#nonFlipTroop', { x: -3 }, { transition: { duration: 0.5 } });
            await animate('#star', { x: 9 });
            animate("#star", { opacity: [0, 0.8] }, { transition: { duration: 0.25 } });
            animate("#star", { opacity: [0.8, 0] }, { transition: { duration: 0.25 } });
            animate('#nonFlipTroop', { x: 3 }, { transition: { duration: 0.5 } });
            await animate('#flipTroop', { x: -3 }, { transition: { duration: 0.5 } });
            await animate('#star', { x: -3 });
            animate("#star", { opacity: [0, 0.8] }, { transition: { duration: 0.25 } });
            animate("#star", { opacity: [0.8, 0] }, { transition: { duration: 0.25 } });
            animate('#flipTroop', { x: 3 }, { transition: { duration: 0.5 } });
            await animate('#nonFlipTroop', { x: -3 }, { transition: { duration: 0.5 } });
            await animate('#star', { x: 5 });
            animate("#star", { opacity: [0, 0.8] }, { transition: { duration: 0.25 } });
            animate("#star", { opacity: [0.8, 0] }, { transition: { duration: 0.25 } });
            animate('#flipTroop', { x: 3 }, { transition: { duration: 0.5 } });
            await animate('#nonFlipTroop', { x: -3 }, { transition: { duration: 0.5 } });

            setTimeout(() => {
                winnerTextRef.current.style.visibility = 'visible';
            }, 10);

            await delay(2000);
            close();
        }
    });

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const customStyles = {
        overlay: {
            backgroundColor: 'transparent',
            pointerEvents: 'none',
        },
        content: {
            padding: '15px',
            transform: 'translate(-50%, -25%)',
            width: 'auto',
            height: 'auto',
            pointerEvents: 'auto',
        }
    };
    const customStyles2 = {
        content: {
            padding: '15px',
            transform: 'translate(-50%, -25%)',
            width: 'auto',
            height: 'auto',
            pointerEvents: 'auto',
        }
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
            return TroopIconPink;
        } else if (color === 3) {
            return TroopIconYellow;
        } else {
            return TroopIconCyan;
        }
    }

    const playersTurn = async () => {
        if (turn === 1) {
            return (player);
        } else if (turn === 2) {
            return (opponent);
        } else if (turn === 3) {
            return (opponent1);
        } else {
            return (opponent2);
        }
    }

    async function attackLandSelected() {
        try {
            const { q, r, s } = gameSettings.getClickedHexagon();
            let currentPlayer = await playersTurn();
            if (currentPlayer.OwnsTileCheck([q, r, s])) {
                const clickedHexagonTroops = gameSettings.getClickedHexagonTroops();
                gameSettings.clearClickedHexagon();
                setAttackLand([q, r, s]);
                setAttackTroops(clickedHexagonTroops);
                changePhase();
                setTroopIconAttacker(selectColorTroop(turn));
            } else {
                throw new Error("Invalid land selection.");
            }
        } catch (error) {
            errorPhase();
            NotificationManager.showSuccessNotification(`You picked the wrong land or didn't pick it at all.`);
        }
    }

    async function opponentLandSelected() {
        try {
            const { q, r, s } = gameSettings.getClickedHexagon();
            let currentPlayer = await playersTurn();
            let adjacent = await gameSettings.areTilesAdjacent(attackLand[0], attackLand[1], attackLand[2], q, r, s);
            if (adjacent) {
                if (opponent.OwnsTileCheck([q, r, s]) && opponent.playerId !== currentPlayer.playerId) {
                    const clickedHexagonTroops = gameSettings.getClickedHexagonTroops();
                    setAttackedPlayer(2);
                    setOpponentLand([q, r, s]);
                    setOpponentTroops(clickedHexagonTroops);
                    setTroopIconOpponent(selectColorTroop(2));
                    await randomlyChoose(clickedHexagonTroops, [q, r, s], 2);
                    OpponentAliveCheck();
                } else if (opponent1.OwnsTileCheck([q, r, s]) && opponent1.playerId !== currentPlayer.playerId) {
                    const clickedHexagonTroops = gameSettings.getClickedHexagonTroops();
                    setAttackedPlayer(3);
                    setOpponentLand([q, r, s]);
                    setOpponentTroops(clickedHexagonTroops);
                    setTroopIconOpponent(selectColorTroop(3));
                    await randomlyChoose(clickedHexagonTroops, [q, r, s], 3);
                    OpponentAliveCheck();
                } else if (opponent2.OwnsTileCheck([q, r, s]) && opponent2.playerId !== currentPlayer.playerId) {
                    const clickedHexagonTroops = gameSettings.getClickedHexagonTroops();
                    setAttackedPlayer(4);
                    setOpponentLand([q, r, s]);
                    setOpponentTroops(clickedHexagonTroops);
                    setTroopIconOpponent(selectColorTroop(4));
                    await randomlyChoose(clickedHexagonTroops, [q, r, s], 4);
                    OpponentAliveCheck();
                } else if (player.OwnsTileCheck([q, r, s]) && player.playerId !== currentPlayer.playerId) {
                    const clickedHexagonTroops = gameSettings.getClickedHexagonTroops();
                    setAttackedPlayer(1);
                    setOpponentLand([q, r, s]);
                    setOpponentTroops(clickedHexagonTroops);
                    setTroopIconOpponent(selectColorTroop(1));
                    await randomlyChoose(clickedHexagonTroops, [q, r, s], 1);
                    OpponentAliveCheck();
                } else {
                    throw new Error("Invalid land selection.");
                }
            } else if (!adjacent) {
                throw new Error("Invalid land selection.");
            }
        } catch (error) {
            errorPhase();
            NotificationManager.showSuccessNotification(`You picked the wrong land or didn't pick it at all.`);
        }
    }

    async function removeLosersTile(land, attackedPlayerId) {
        if (attackedPlayerId === 2) {
            opponent.removeOwnedTile(land);
        } else if (attackedPlayerId === 3) {
            opponent1.removeOwnedTile(land);
        } else if (attackedPlayerId === 1) {
            sounds[8].play();
            player.removeOwnedTile(land);
        } else if (attackedPlayerId === 4) {
            opponent2.removeOwnedTile(land);
        }
    }

    async function randomlyChoose(opponentTroopCount, land, attackedPlayerId) {
        const chanceOptionAttacker = (attackTroops / ((attackTroops + opponentTroopCount) / 100)) / 100;
        const randomValue = Math.random();
        if (randomValue <= chanceOptionAttacker) {
            setWinner(turn);
            if (turn === 1) {
                sounds[7].play();
                player.addOwnedTile(new Tile(land[0], land[1], land[2]), '_Blue');
                removeLosersTile(land, attackedPlayerId);
                NotificationManager.showSuccessNotification(`player 1 now owns ` + land);
            } else if (turn === 2) {
                opponent.addOwnedTile(new Tile(land[0], land[1], land[2]), '_Pink');
                removeLosersTile(land, attackedPlayerId);
                NotificationManager.showSuccessNotification(`player 2 now owns ` + land);
            } else if (turn === 3) {
                opponent1.addOwnedTile(new Tile(land[0], land[1], land[2]), '_Cyan');
                removeLosersTile(land, attackedPlayerId);
                NotificationManager.showSuccessNotification(`player 3 now owns ` + land);
            } else if (turn === 4) {
                opponent2.addOwnedTile(new Tile(land[0], land[1], land[2]), '_Yellow');
                removeLosersTile(land, attackedPlayerId);
                NotificationManager.showSuccessNotification(`player 4 now owns ` + land);
            }
        } else {
            sounds[8].play();
            setWinner(attackedPlayerId);
        }
    }

    useEffect(() => {
        if (phase === 2) {
            changePhase();
        }
    }, [winner]);

    function OpponentAliveCheck() {
        if (attackedPlayer === 2) {
            if (opponent.getOwnedTiles.length === 0) {
                setOpponentDead(true);
                opponent.setLiveStatus = false;
                console.log('dead');
            }
        } else if (attackedPlayer === 3) {
            if (opponent1.getOwnedTiles.length === 0) {
                setOpponentDead(true);
                opponent1.setLiveStatus = false;
                console.log('dead');
            }
        } else if (attackedPlayer === 4) {
            if (opponent2.getOwnedTiles.length === 0) {
                setOpponentDead(true);
                opponent2.setLiveStatus = false;
                console.log('dead');
            }
        } else if (attackedPlayer === 1) {
            if (player.getOwnedTiles.length === 0) {
                setOpponentDead(true);
                player.setLiveStatus = false;
                console.log('dead');
            }
        }
    }

    if (phase === 0) {
        return (
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle" className="storeModal" style={customStyles2}>
                <div className="phase-popup">
                    <h1>Get ready to battle</h1>
                    <h2>Do you want to battle?</h2>
                    <button className='btn' onClick={changePhase}>yes</button>
                    <button className='btn' onClick={close}>no</button>
                    <button className="close-btn-small" onClick={close}>X</button>
                </div>
            </Modal>
        );
    }
    else if (phase === 1) {
        return (
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle" className="storeModal" style={customStyles}>
                <div className="phase-popup">
                    <h1>Get ready to battle</h1>
                    <h2>Select your own land you wish to attack with!</h2>
                    <button className='btn' onClick={attackLandSelected}>Confirm land selection</button>
                    <button className="close-btn-small" onClick={close}>X</button>
                </div>
            </Modal>
        );
    }
    else if (phase === 2) {
        return (
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle" className="storeModal" style={customStyles}>
                <div className="phase-popup">
                    <h1>Get ready to battle</h1>
                    <h2>Select an enemy land to attack!</h2>
                    <button className='btn' onClick={opponentLandSelected}>Confirm land selection</button>
                    <button className="close-btn-small" onClick={close}>X</button>
                </div>
            </Modal>
        );
    }
    else if (phase === 3) {
        return (
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle" className="storeModal" style={customStyles2}>
                <div ref={scope} className="phase-popup">
                    <div id='imageParent' className='imageParent'>
                        <img id='nonFlipTroop' src={TroopIconAttacker} width={90} height={90} className='nonFlipImage' alt="Troop Icon" />
                        <img id='flipTroop' src={TroopIconOpponent} width={90} height={90} className='flipImage' alt="Troop Icon" />
                        <img id='star' src={Star} width={13} height={13} className='star' alt='star' />
                    </div>
                    <h1 id='winnerText' className='winnerText' style={{ visibility: 'hidden' }} ref={winnerTextRef}>Player {winner} wins the land</h1>
                    <button className="close-btn-small" onClick={close}>X</button>
                </div>
            </Modal>
        );
    }
    else if (phase === 4) {
        return (
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle" className="storeModal" style={customStyles2}>
                <div className="phase-popup">
                    <button className="close-btn-small" onClick={close}>X</button>
                    <h1>Warning</h1>
                    <p>You picked the wrong land or didn't pick it at all.</p>
                    <button className='btn' onClick={() => setPhase(1)}>try again</button>
                    <button className='btn' onClick={close}>close</button>
                </div>
            </Modal>
        );
    }
    else {
        return (
            <div>
                <p>error</p>
                <button onClick={close}>close</button>
            </div>
        );
    }
}

export default Battle;
