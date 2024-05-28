import React, { useState, useContext, useEffect } from 'react';
import './ResourceBar.css';
import MetalIcon from './images/sprites/Metal.png';
import TechIcon from './images/sprites/Technology.png';
import FoodIcon from './images/sprites/Food.png';
import WoodIcon from './images/sprites/Wood.png';
import TroopIcon from './images/sprites/Troop_Blue.png';
import { PlayerContext } from './Game';

function ResourceBar({ techPoints, foodPoints, woodPoints, metalPoints, ownedTroops }) {
    useEffect(() => {
      // Any additional effects when props change can be handled here
    }, [techPoints, foodPoints, woodPoints, metalPoints, ownedTroops]);
    // Tech, Food, Wood, Metal
    return (
        <div className='ResourceBarContainer'>
            <div className='ResourceContainer'>
                <img src={TechIcon} alt="Tech Icon" />
                <div className='ResourceAmountText'>{techPoints}</div>
                <div className='ResourceInfoIcon'>ℹ️</div>
                <div className='ResourceInfoText'>Tech Points</div>
            </div>

            <div className='ResourceContainer'>
                <img src={FoodIcon} alt="Food Icon" />
                <div className='ResourceAmountText'>{foodPoints}</div>
                <div className='ResourceInfoIcon'>ℹ️</div>
                <div className='ResourceInfoText'>Food Points</div>
            </div>

            <div className='ResourceContainer'>
                <img src={WoodIcon} alt="Wood Icon" />
                <div className='ResourceAmountText'>{woodPoints}</div>
                <div className='ResourceInfoIcon'>ℹ️</div>
                <div className='ResourceInfoText'>Wood Points</div>
            </div>

            <div className='ResourceContainer'>
                <img src={MetalIcon} alt="Metal Icon" />
                <div className='ResourceAmountText'>{metalPoints}</div>
                <div className='ResourceInfoIcon'>ℹ️</div>
                <div className='ResourceInfoText'>Metal Points</div>
            </div>

            <div className='ResourceContainer'>
                <img src={TroopIcon} alt="Troop Icon" />
                <div className='ResourceAmountText'>{ownedTroops}</div>
                <div className='ResourceInfoIcon'>ℹ️</div>
                <div className='ResourceInfoText'>Troop Points</div>
            </div>
        </div>
    );
}

export default ResourceBar;
