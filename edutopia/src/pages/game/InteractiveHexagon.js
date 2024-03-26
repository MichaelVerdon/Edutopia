import React, { useState, useEffect } from 'react';
import { Hexagon, Text } from 'react-hexgrid';
import configs from './configurations';
import gameSettings from './GameSettings';
import './inGameHex.css';

const InteractiveHexagon = ({ q, r, s }) => {
  const [isActive, setIsActive] = useState(false);
  const [fillColor, setFillColor] = useState(gameSettings.getBiomeForCoordinates(q, r, s));

  useEffect(() => {
    const updateBiome = () => {
      setFillColor(gameSettings.customBiomes[`${q},${r},${s}`] || gameSettings.getBiomeForCoordinates(q, r, s));
    };

    gameSettings.subscribeToBiomeChanges(updateBiome);

    return () => {
      gameSettings.unsubscribeFromBiomeChanges(updateBiome);
    };
  }, [q, r, s]);

  const handleClick = () => {
    setIsActive(!isActive);
    console.log('Hexagon clicked');
    console.log(`"q": ${q}, "r": ${r}, "s": ${s}`);
    console.log("Current Hexagon biome:", fillColor);
    gameSettings.setBiomeForCoordinates(q,r,s, "Water");
  };
  
  // Disable onClick event handler for Water hexagons
  const clickable = fillColor !== 'Water';
  // Set cursor style to 'auto' for Water hexagons
  const cursorStyle = clickable ? 'pointer' : 'auto';

  // Define the class name for the hexagon dynamically based on its biome
  const hexagonClass = `inGameHex ${isActive ? 'active' : ''} ${fillColor === 'Water' ? 'water' : ''}`;

  return (
    <Hexagon
      q={q}
      r={r}
      s={s}
      size={configs.hexSize}
      fill={fillColor}
      onClick={clickable ? handleClick : null} // Conditionally assign onClick handler
      className={hexagonClass} // Assign the dynamic class name
      style={{ cursor: cursorStyle }} // Set cursor style based on clickable
    >
      <Text className="hexagon-text">{`${q},${r},${s}`}</Text>
    </Hexagon>
  );
};

export default InteractiveHexagon;
