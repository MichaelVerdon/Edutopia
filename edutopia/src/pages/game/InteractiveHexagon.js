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
    // Update fillColor when biome changes
    setFillColor(gameSettings.getBiomeForCoordinates(q, r, s));
  }, [q, r, s, gameSettings.customBiomes]);

  const updateHexagonBiome = (newBiome) => {
    gameSettings.setBiome(q, r, s, newBiome); // Update biome in GameSettings
    setFillColor(newBiome); // Update the fill color
  };

  const handleClick = () => {
    console.log('Hexagon clicked');
    console.log(`"q": ${q}, "r": ${r}, "s": ${s}`);
    console.log(fillColor);
    // Example: Change biome to 'patternGrassLand' when clicked
    updateHexagonBiome('patternGrassLand');
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
