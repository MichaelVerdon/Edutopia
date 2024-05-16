import React, { useState, useEffect, useContext } from 'react';
import { PlayerContext } from './Game';
import PlayerObject from './game/PlayerObject';
import Modal from 'react-modal';
import './Store.css';
import TroopIconBlue from './images/sprites/Troop_Blue.png';
import TroopIconYellow from './images/sprites/Troop_Yellow.png';
import TroopIconPink from './images/sprites/Troop_Pink.png';
import TroopIconCyan from './images/sprites/Troop_Cyan.png';

function GameLoopModal ({text, isOpen, close}) {
    
    const { player, setPlayer } = useContext(PlayerContext);
    const [Troop, setTroop] = useState('');

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

    
    const anotherContentGenerator = () => {
        setTroop(selectColorTroop(player.getColor));
        return(
            <img id='flipTroop' src={Troop}  width={90} height={90} className='flipImage' alt="Troop Icon" />
        );
    }
   
    //the page html
    return(
        
        <div className="questionModal" style={customStyles}>
            <div className="phase-popup" style={{ margin: "20px" }}>
                <h1>{text}</h1>
                {anotherContentGenerator}
            </div>
        </div>
    );
}
export default GameLoopModal;