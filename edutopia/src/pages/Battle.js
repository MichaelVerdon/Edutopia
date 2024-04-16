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

Modal.setAppElement('#root'); 


function Battle ({close, isOpen}) {
    const [phase, setPhase] = useState(0);//phase of pop up that is returned
    const {player, setPlayer, opponent, setOpponent } = useContext(PlayerContext);
    const [winner, setWinner] = useState(0);
    const [attackLand, setAttackLand] = useState(null);
    const [attackTroops, setAttackTroops] = useState(0);
    const [opponentDead, setOpponentDead] = useState(false);
    //const [opponentLand, setOpponentLand] = useState(null);
    //const [opponentTroops, setOpponentTroops] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [TroopIconAttacker, setTroopIconAttacker] = useState('');
    const [TroopIconOpponent, setTroopIconOpponent] = useState('');

    
    const [scope, animate] = useAnimate();
    const winnerTextRef = useRef(null);

    useEffect(() => { //imageParent, nonFlipTroop, flipTroop, star, winnerText
        
        setTimeout(async() => {await enterAnimation();}, 10);
        
        
    },[phase]);

    const enterAnimation = (async(callback)=>{
        if(phase == 3){
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
        }
    })

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
        setPhase(phase + 1)
      };

    const errorPhase = () => {
        setPhase(4)
    };

    function selectColorTroop(color){
        if (color === '_Blue'){
            return TroopIconBlue;
        } else if(color === '_Yellow'){
            return TroopIconYellow;
        } else if (color === '_Pink'){
            return TroopIconPink;
        }else{
            return TroopIconCyan;
        }
    }

    //land selecting
    function attackLandSelected(){
        try{
        const { q, r, s }  = gameSettings.getClickedHexagon();
            if(player.OwnsTileCheck([q,r,s])){
                const clickedHexagonTroops = gameSettings.getClickedHexagonTroops();
                gameSettings.clearClickedHexagon();
                setAttackLand([q,r,s]);
                setAttackTroops(clickedHexagonTroops);
                changePhase();
                setTroopIconAttacker(selectColorTroop(player.getColor));
            }else {
                throw new Error("Invalid land selection.");
            }
        }catch(error){
            errorPhase(); //TODO: figure out why this is not being displayed
            NotificationManager.showSuccessNotification(`You picked the wrong land or didn't pick it at all.`);
        }
      }

    function opponentLandSelected(){
        try{
            const { q, r, s }  = gameSettings.getClickedHexagon();
                if(opponent.OwnsTileCheck([q,r,s])){
                const clickedHexagonTroops = gameSettings.getClickedHexagonTroops();
                //setOpponentLand([q,r,s]);
                //setOpponentTroops(clickedHexagonTroops);
                setTroopIconOpponent(selectColorTroop(opponent.getColor)); //TODO change when real opponents implemented
                randomlyChoose(clickedHexagonTroops, [q,r,s]);
                changePhase();
                OpponentAliveCheck();
            }else {
                throw new Error("Invalid land selection.");
            }
        }catch(error){
            errorPhase();  //TODO: figure out why this is not being displayed
            NotificationManager.showSuccessNotification(`You picked the wrong land or didn't pick it at all.`);
        }
    }

    //comparing nums of troops selected
    function randomlyChoose(opponentTroopCount, land) {
        const chanceOptionAttacker = (attackTroops/((attackTroops+opponentTroopCount)/100))/100;
        // Generate a random number between 0 and 1
        const randomValue = Math.random();
        // If the random number is less than the chance of option1, choose option1
        if (randomValue <= chanceOptionAttacker) {
            setWinner(1);
            player.addOwnedTiles = land; //TODO: later replace with game handler functions later
            opponent.setOwnedTiles = []; //TODO: later replace with game handler functions later
            NotificationManager.showSuccessNotification(`Player 1 now owns ${player.getOwnedTiles.length} tiles (player 2 owns ${opponent.getOwnedTiles.length})`);
        } else {
            // Otherwise, choose option2
            setWinner(2);
            
        }
    }

    //check if after the player wins the opponent still has tiles left
    function OpponentAliveCheck(){
        //TODO: connect it so some dead player fce when game handler finished
        if(opponent.getOwnedTiles.length === 0){
            setOpponentDead(true);
            opponent.setAliveStatus = false;
            console.log('dead');
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
                    <h2>Select a land to attack with</h2>
                    <button className='btn' onClick={attackLandSelected}>land selected</button>
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
                <h2>Select a land to attack</h2>
                <button className='btn' onClick={opponentLandSelected}>land selected</button>
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