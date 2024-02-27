// InteractiveHexagon.js

import React, { useState } from 'react';
import { Hexagon, Text } from 'react-hexgrid';
import configs from './configurations';
import gameSettings from './GameSettings';
import './hex.css';

const InteractiveHexagon = ({ q, r, s, tile }) => {
  const [isActive, setIsActive] = useState(false);
  const [fillColor, setFillColor] = useState(gameSettings.getBiomeForCoordinates(q, r, s));

  const handleClick = () => {
    console.log('Hexagon clicked');
    console.log(`"q": ${q}, "r": ${r}, "s": ${s}`);
    console.log(fillColor);
    const newBiome = 'patternGrassLand'; // Change this to the desired new biome
    gameSettings.setBiome(q, r, s, newBiome);
    setFillColor(newBiome); // Update the fill color
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


window.InteractiveHexagon = InteractiveHexagon;
export default InteractiveHexagon;
