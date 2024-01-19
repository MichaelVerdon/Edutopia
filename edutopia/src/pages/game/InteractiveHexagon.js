//This component is responsible for rendering the hexagonal tiles and the interactivity.

import React, { useState } from 'react';
import { Hexagon, Text } from 'react-hexgrid';
import configs from './configurations'
import './hex.css';
import tile from './Tile';

const InteractiveHexagon = ({ tile }) => {
    const [isActive, setIsActive] = useState(false);
  
    const handleClick = () => {
      console.log('Hexagon clicked');
      console.log(tile.getTileInfo());
      console.log("----------------------------------------------------");
      console.log(`"q": ${tile.q}, "r": ${tile.r}, "s": ${tile.s}`);
      setIsActive(!isActive); // Toggle the active state
      console.log("Is active: ", !isActive);
    };
    return (
      <Hexagon 
        q={tile.q} 
        r={tile.r} 
        s={tile.s} 
        size={configs.hexSize} 
        fill={isActive ? 'red' : "none"} // Toggle between red and biome-specific pattern
        onClick={handleClick}
        className={`hexagon-group ${isActive ? 'active' : ''}`} // Apply a class conditionally
      >
        <Text className="hexagon-text">{`${tile.q},${tile.r},${tile.s}`}</Text>
        {/* Additional SVG elements as needed */}
      </Hexagon>
    );
  };
  
  export default InteractiveHexagon;
  
