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
    //TEST: gameSettings.setBiomeForCoordinates(5, 2, -7, "patternWater")
/*
    // Change the biome based on the selected item and the buildingBiomeMapping
    if (selectedItem && selectedItem.id in buildingBiomeMapping) {
      const newBiome = buildingBiomeMapping[selectedItem.id];
      gameSettings.setBiomeForCoordinates(q, r, s, newBiome);
    } else {
      // Handle default biome change if no specific mapping is found
      gameSettings.setBiomeForCoordinates(q, r, s, "defaultBiome");
    } 
*/
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
