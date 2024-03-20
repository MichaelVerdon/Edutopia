import React, { useState, useEffect } from 'react';
import { Hexagon, Text } from 'react-hexgrid';
import configs from './configurations';
import gameSettings from './GameSettings';
import './inGameHex.css'; // Import the new CSS file

const InteractiveHexagon = ({ q, r, s }) => {
  const [isActive, setIsActive] = useState(false);
  const [fillColor, setFillColor] = useState(gameSettings.getBiomeForCoordinates(q, r, s));

  useEffect(() => {
    const updateBiome = () => {
      // Update fillColor when the biome changes
      setFillColor(gameSettings.customBiomes[`${q},${r},${s}`] || gameSettings.getBiomeForCoordinates(q, r, s));
    };

    // Subscribe to changes in the biome
    gameSettings.subscribeToBiomeChanges(updateBiome);

    // Unsubscribe from changes when the component unmounts
    return () => {
      gameSettings.unsubscribeFromBiomeChanges(updateBiome);
    };
  }, [q, r, s]);

  const handleClick = () => {
    setIsActive(!isActive);
    console.log('Hexagon clicked');
    console.log(`"q": ${q}, "r": ${r}, "s": ${s}`);
    console.log("Current Hexagon biome:", fillColor);
  };

  return (
    <Hexagon
      q={q}
      r={r}
      s={s}
      size={configs.hexSize}
      fill={fillColor}
      onClick={handleClick}
      className={`inGameHex ${isActive ? 'active' : ''}`}
    >
      <Text className="hexagon-text">{`${q},${r},${s}`}</Text>
    </Hexagon>
  );
};

export default InteractiveHexagon;
