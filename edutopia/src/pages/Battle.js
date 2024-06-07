import React, { useState, useEffect, useContext, useRef } from 'react';
import Question from './Question'; 
import PlayerObject from './game/PlayerObject';
import gameSettings from './game/GameSettings';
import Modal from 'react-modal';
import './Store.css';
import { PlayerContext } from './Game';
import NotificationManager from '../pages/game/NotificationManager';
import { useAnimate } from "framer-motion"
import TroopIconBlue from './images/sprites/Troop_Blue.png';
import TroopIconYellow from './images/sprites/Troop_Yellow.png';
import TroopIconPink from './images/sprites/Troop_Pink.png';
import TroopIconCyan from './images/sprites/Troop_Cyan.png';
import Star from './images/sprites/star.png';
import sounds from './game/sounds/soundImports.js';

Modal.setAppElement('#root'); 


function Battle ({close, isOpen}) {
    const [phase, setPhase] = useState(0);
    const {player, setPlayer, opponent, setOpponent, opponent1, setOpponent1, opponent2, setOpponent2, turn, setTurn, battleTiles} = useContext(PlayerContext);
    const [winner, setWinner] = useState(0);
    const [attackedPlayer, setAttackedPlayer] = useState(0);
    const [attackLand, setAttackLand] = useState(null);
    const [attackTroops, setAttackTroops] = useState(0);
    const [opponentDead, setOpponentDead] = useState(false);
    const [opponentLand, setOpponentLand] = useState(null);
    const [opponentTroops, setOpponentTroops] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [TroopIconAttacker, setTroopIconAttacker] = useState('');
    const [TroopIconOpponent, setTroopIconOpponent] = useState('');
    
    /* const shutDown = (() => {
        setPhase(0);
        setWinner(0);
        setAttackedPlayer(null);
        setAttackLand(null);
        setAttackTroops(0);
        setOpponentDead(false);
        setOpponentLand(null);
        setOpponentTroops(0);
        setTroopIconAttacker('');
        setTroopIconOpponent('');
        close();
    }) */

    useEffect(() => {
        const aiPlayerBattle = async () => {
            gameSettings.saveClickedHexagon(battleTiles[0][0], battleTiles[0][1], battleTiles[0][2], '');
            let hex = gameSettings.getClickedHexagon();
            setTroopIconAttacker(await selectColorTroop(turn));
            setAttackLand(battleTiles[0]);
            setAttackTroops(await troopNum(turn, [battleTiles[0][0], battleTiles[0][1], battleTiles[0][2]])); 
            
            gameSettings.saveClickedHexagon(battleTiles[1][0], battleTiles[1][1], battleTiles[1][2], '');
            hex = gameSettings.getClickedHexagon();
            if(await gameSettings.getBiomeForCoordinates(battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]).includes('_Pink')){
                setAttackedPlayer(2); 
                setTroopIconOpponent(await selectColorTroop(2));
                await randomlyChoose(await troopNum(2, [battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]]), battleTiles[1], 2);
            }else if(await gameSettings.getBiomeForCoordinates(battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]).includes('_Blue')){
                setAttackedPlayer(1); 
                setTroopIconOpponent(await selectColorTroop(1));
                await randomlyChoose(await troopNum(1, [battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]]), battleTiles[1], 1);
            }else if (await gameSettings.getBiomeForCoordinates(battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]).includes('_Cyan')){
                setAttackedPlayer(3);
                setTroopIconOpponent(await selectColorTroop(3)); 
                await randomlyChoose(await troopNum(3, [battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]]), battleTiles[1], 3);
            }else if(await gameSettings.getBiomeForCoordinates(battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]).includes('_Yellow')){
                setAttackedPlayer(4); 
                setTroopIconOpponent(await selectColorTroop(4));
                await randomlyChoose(await troopNum(4, [battleTiles[1][0], battleTiles[1][1], battleTiles[1][2]]), battleTiles[1], 4);

            }
            
            setPhase(3);
        }
        try{
          if (battleTiles.length !== 0 && turn !== 1) {
            aiPlayerBattle();
          }
        }catch(exceptionVar){
            close();
        }
    }, [battleTiles]);
    
    const [scope, animate] = useAnimate();
    const winnerTextRef = useRef(null);

    useEffect(() => { //imageParent, nonFlipTroop, flipTroop, star, winnerText
        
        setTimeout(async() => {await enterAnimation();}, 10);
        
        
    },[phase]);

    const enterAnimation = (async(callback)=>{
        if(phase === 3){
            sounds[4].play();
            //slash 1
            await animate('#flipTroop', {scaleX: -1});
            animate("#star",{opacity: [0,0.8]},{transition: {duration:0.25}} );
            animate("#star",{opacity: [0.8,0]},{transition: {duration:0.25} });
            await animate('#nonFlipTroop',{x:-3}, {transition: {duration:0.5}});
            //slash 2
            await animate('#star',{x: 9});
            animate("#star",{opacity: [0,0.8]},{transition: {duration:0.25}} );
            animate("#star",{opacity: [0.8,0]},{transition: {duration:0.25}} );
            animate('#nonFlipTroop',{x:3}, {transition: {duration:0.5}});
            await animate('#flipTroop',{x:-3}, {transition: {duration:0.5}});
            //slash 3
            await animate('#star',{x: -3});
            animate("#star",{opacity: [0,0.8]},{transition: {duration:0.25}} );
            animate("#star",{opacity: [0.8,0]},{transition: {duration:0.25}} );
            animate('#flipTroop',{x:3}, {transition: {duration:0.5}});
            await animate('#nonFlipTroop',{x:-3}, {transition: {duration:0.5}});
            //slash 4
            await animate('#star',{x: 5});
            animate("#star",{opacity: [0,0.8]},{transition: {duration:0.25}} );
            animate("#star",{opacity: [0.8,0]},{transition: {duration:0.25}} );
            animate('#flipTroop',{x:3}, {transition: {duration:0.5}});
            await animate('#nonFlipTroop',{x:-3}, {transition: {duration:0.5}});
            
            //text
            setTimeout(() => {
                winnerTextRef.current.style.visibility = 'visible';
              }, 10);

              await delay(2000);
              close();
        }
    })

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
      
    //increases phase by 1
    const changePhase = () => {
        setPhase(phase + 1);
      };

    const errorPhase = () => {
        setPhase(4);
    };

    function selectColorTroop(color){
        if (color === 1){
            return TroopIconBlue;
        } else if(color === 2){
            return TroopIconPink;
        } else if (color === 3){
            return TroopIconCyan;
        }else{
            return TroopIconYellow;
        }
    }

    const playersTurn = async () => {
        if (turn === 1){
          return (player);
        } else if (turn === 2){
          return (opponent);
        }else if (turn === 3){
          return (opponent1);
        }else{
          return (opponent2);
        }
      }
    async function troopNum(curPl, land){
        try{
          let currentPlayer;
          if (curPl === 1){
            currentPlayer = player;
          } else if (curPl === 2){
            currentPlayer = opponent;
          }else if (curPl === 3){
            currentPlayer = opponent1;
          }else{
            currentPlayer = opponent2;
          }
          for(let i=0; i<=currentPlayer.ownedTiles.length; i++){
            if(await currentPlayer.ownedTiles[i].q === land[0] && await currentPlayer.ownedTiles[i].r === land[1] && await currentPlayer.ownedTiles[i].s === land[2]){
                return await currentPlayer.ownedTiles[i].troops;
            }
          }
          return 0;
        }catch(x){
           return 0;
        }
    }
    //land selecting
    async function attackLandSelected(){
        try{
            const { q, r, s }  = gameSettings.getClickedHexagon();
            let currentPlayer = await playersTurn();
            if(currentPlayer.OwnsTileCheck([q,r,s])){
                gameSettings.clearClickedHexagon();
                setAttackLand([q,r,s]);
                setAttackTroops(await troopNum(turn, [q,r,s]));
                changePhase();
                setTroopIconAttacker(selectColorTroop(turn));
            }else {
                throw new Error("Invalid land selection.");
            }
        }catch(error){
            errorPhase(); //TODO: figure out why this is not being displayed
            NotificationManager.showSuccessNotification(`You picked the wrong land or didn't pick it at all.`);
        }
      }

    async function opponentLandSelected(){
        try{
            const { q, r, s }  = gameSettings.getClickedHexagon();
            let currentPlayer = await playersTurn();
            let adjacent = await gameSettings.areTilesAdjacent(attackLand[0], attackLand[1], attackLand[2], q, r, s);
            if (adjacent){
                console.log("Tiles Adjacent");
                if(opponent.OwnsTileCheck([q,r,s]) && opponent.playerId !== currentPlayer.playerId){
                    const clickedHexagonTroops = await troopNum(2, [q,r,s]);
                    setAttackedPlayer(2);
                    setOpponentLand([q,r,s]);
                    setOpponentTroops(clickedHexagonTroops);
                    setTroopIconOpponent(selectColorTroop(2)); 
                    await randomlyChoose(clickedHexagonTroops, [q,r,s], 2);
                }else if(opponent1.OwnsTileCheck([q,r,s]) && opponent1.playerId !== currentPlayer.playerId){
                    const clickedHexagonTroops = await troopNum(3, [q,r,s]);
                    setAttackedPlayer(3);
                    setOpponentLand([q,r,s]);
                    setOpponentTroops(clickedHexagonTroops);
                    setTroopIconOpponent(selectColorTroop(3));
                    await randomlyChoose(clickedHexagonTroops, [q,r,s], 3);
                }else if(opponent2.OwnsTileCheck([q,r,s]) && opponent2.playerId !== currentPlayer.playerId){
                    const clickedHexagonTroops = await troopNum(4, [q,r,s]);
                    setAttackedPlayer(4);
                    setOpponentLand([q,r,s]);
                    setOpponentTroops(clickedHexagonTroops);
                    setTroopIconOpponent(selectColorTroop(4));
                    await randomlyChoose(clickedHexagonTroops, [q,r,s], 4);
                }else if(player.OwnsTileCheck([q,r,s]) && player.playerId !== currentPlayer.playerId){
                    const clickedHexagonTroops = await troopNum(1, [q,r,s]);
                    setAttackedPlayer(1);
                    setOpponentLand([q,r,s]);
                    setOpponentTroops(clickedHexagonTroops);
                    setTroopIconOpponent(selectColorTroop(1));
                    await randomlyChoose(clickedHexagonTroops, [q,r,s], 1);
                }else {
                    throw new Error("Invalid land selection.");
                }
            }else if (!adjacent){
                throw new Error("Invalid land selection.");
            }
        }catch(error){
            errorPhase();  //TODO: figure out why this is not being displayed
            NotificationManager.showSuccessNotification(`You picked the wrong land or didn't pick it at all.`);
        }
    }

    async function removeLosersTile(land, attackedPlayerId) {
        if (attackedPlayerId === 2){
            opponent.removeOwnedTile(land);
        }else if (attackedPlayerId === 3){
            opponent1.removeOwnedTile(land);
        }else if (attackedPlayerId === 1){
            sounds[7].play();
            player.removeOwnedTile(land); 
        }else if (attackedPlayerId===4){
            opponent2.removeOwnedTile(land); 
        }
    }

    //comparing nums of troops selected
    async function randomlyChoose(opponentTroopCount, land, attackedPlayerId) {
        const chanceOptionAttacker = (attackTroops/((attackTroops+opponentTroopCount)/100))/100;
        // Generate a random number between 0 and 1
        const randomValue = Math.random();
        // If the random number is less than the chance of option1, choose option1
        if (randomValue <= chanceOptionAttacker) {
            setWinner(turn);
            if (turn === 1){
                sounds[7].play();
                await player.addOwnedTile(land, '_Blue'); 
                await removeLosersTile(land, attackedPlayerId);
                NotificationManager.showSuccessNotification(`player 1 now owns ` + land);
            }else if (turn === 2){
                await opponent.addOwnedTile(land, '_Pink'); 
                await removeLosersTile(land, attackedPlayerId);
                NotificationManager.showSuccessNotification(`player 2 now owns ` + land);
            }else if (turn === 3){
                await opponent1.addOwnedTile(land, '_Cyan'); 
                await removeLosersTile(land, attackedPlayerId);
                NotificationManager.showSuccessNotification(`player 3 now owns ` + land);
            }else if (turn === 4){
                await opponent2.addOwnedTile(land, '_Yellow'); 
                await removeLosersTile(land, attackedPlayerId);
                NotificationManager.showSuccessNotification(`player 4 now owns ` + land);
            }
            OpponentAliveCheck(attackedPlayerId)
        } else {
            // Otherwise, choose option2
            sounds[8].play();
            setWinner(attackedPlayerId); //TODO
            
        }
        //changePhase();
    }

    useEffect(() => {
        if (phase===2) {
          // Perform your effect when variable changes from true to false
          // This block will run only when variable changes from true to false
          changePhase();
        }
      }, [winner]); 

    //check if after the player wins the opponent still has tiles left
    async function OpponentAliveCheck(attacked){
        //TODO: connect it so some dead player fce when game handler finished

        if (attacked === 2){
            if(await opponent.getOwnedTiles.length <= 1){
                setOpponentDead(true);
                opponent.liveStatus = false;
                console.log('dead');
            }
        }else if (attacked === 3){
            if(await opponent1.getOwnedTiles.length <= 1){
                setOpponentDead(true);
                opponent1.liveStatus = false;
                console.log('dead');
            }
        }else if (attacked === 4){
            if(await opponent2.getOwnedTiles.length <= 1){
                setOpponentDead(true);
                opponent2.liveStatus = false;
                console.log('dead');
            }
        }else if (attacked === 1){
            if(await player.getOwnedTiles.length <= 1){
                setOpponentDead(true);
                player.liveStatus = false;
                console.log('dead');
            }
        }
    }
   
    if(phase === 0){ //asking if u want to fight
        return(
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle" className="storeModal" style={customStyles2}>
                <div className="phase-popup">
                   
                    <h1>Get ready to battle</h1>
                    <h2>Do you want to battle?</h2>
                    <button className='btn' onClick={changePhase}>yes</button>
                    <button className='btn' onClick={close}>no</button>
                    <button className="close-btn-small" onClick={close}>X</button> {/* Top right X close button */}
                </div>
            </Modal>
        );
    }
    else if(phase === 1){ //select land to fight over
        return(
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle"  className="storeModal" style={customStyles}>
                <div className="phase-popup">
                    <h1>Get ready to battle</h1>
                    <h2>Select your own land you wish to attack with!</h2>
                    <button className='btn' onClick={attackLandSelected}>Confirm land selection</button>
                    <button className="close-btn-small" onClick={close}>X</button> {/* Top right X close button */}
                </div>
            </Modal>
        );
    }
    else if(phase === 2){ //select land to fight over
        return(
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle"  className="storeModal" style={customStyles}>
                <div className="phase-popup">
                <h1>Get ready to battle</h1>
                <h2>Select an enemy land to attack!</h2>
                <button className='btn' onClick={opponentLandSelected}>Confirm land selection</button>
                <button className="close-btn-small" onClick={close}>X</button> {/* Top right X close button */}
                </div>
            </Modal>
        );
    }
   
    else if(phase === 3){ //display winner
        return(
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle" className="storeModal" style={customStyles2}>
                <div ref={scope} className="phase-popup">
                    <div id='imageParent' className='imageParent'>
                        <img id='nonFlipTroop' src={TroopIconAttacker}  width={90} height={90} className='nonFlipImage' alt="Troop Icon" />
                        <img id='flipTroop' src={TroopIconOpponent}  width={90} height={90} className='flipImage' alt="Troop Icon" />
                        <img id='star' src={Star} width={13} height={13} className='star' alt ='star' />
                    </div>
                    <h1 id='winnerText' className='winnerText' style={{visibility:'hidden'}} ref={winnerTextRef}>Player {winner} wins the land</h1>
                    <button className="close-btn-small" onClick={close}>X</button> {/* Top right X close button */}
                </div>
            </Modal>
        );
    }
    else if(phase === 4){ //warning
        return(
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle"  className="storeModal" style={customStyles2}>
                <div className="phase-popup">
                    <button className="close-btn-small" onClick={close}>X</button> {/* Top right X close button */}
                    <h1>Warning</h1>
                    <p>You picked the wrong land or didn't pick it at all.</p>
                    <button className='btn' onClick={setPhase(1)}>try again</button>
                    <button className='btn' onClick={close}>close</button>
                </div>
            </Modal>
        );
    }
    else{ //empty
        return(
            <div>
                <p>error</p>
                <button onClick={close}>close</button>
            </div>
        );
    }
}
export default Battle;