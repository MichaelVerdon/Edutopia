// InteractiveHexagon.js

import React, { useState, useEffect } from 'react';
import { Hexagon, Text } from 'react-hexgrid';
import configs from './configurations';
import gameSettings from './GameSettings';
import './hex.css';

const InteractiveHexagon = ({ q, r, s }) => {
  const [isActive, setIsActive] = useState(false);
  const [fillColor, setFillColor] = useState(gameSettings.getBiomeForCoordinates(q, r, s));

  useEffect(() => {
    // Updates fillColor when biome changes
    setFillColor(gameSettings.getBiomeForCoordinates(q, r, s));
  }, [q, r, s, gameSettings.customBiomes]);

  const handleClick = () => {
    // Get the next biome in the cycle from GameSettings
    const nextBiome = gameSettings.getNextBiomeInCycle(q, r, s);
    
    // Log the current and new biomes
    console.log('Hexagon clicked');
    console.log(`"q": ${q}, "r": ${r}, "s": ${s}`);
    console.log("Old biome:", fillColor);
    console.log("New biome:", nextBiome);

    // Update the biome
    gameSettings.setBiome(q, r, s, nextBiome);
    setFillColor(nextBiome);
  };

  return (
    <Hexagon
      q={q}
      r={r}
      s={s}
      size={configs.hexSize}
      fill={fillColor}
      onClick={handleClick}
      className={`hexagon-group ${isActive ? 'active' : ''}`}
    >
      <Text className="hexagon-text">{`${q},${r},${s}`}</Text>
    </Hexagon>
  );
};

export default InteractiveHexagon;
