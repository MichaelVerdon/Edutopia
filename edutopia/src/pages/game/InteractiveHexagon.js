// InteractiveHexagon.js
import React, { useState } from 'react';
import { Hexagon, Text } from 'react-hexgrid';
import configs from './configurations';
import gameSettings from './GameSettings';
import './hex.css';




const InteractiveHexagon = ({ q, r, s, tile }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    console.log('Hexagon clicked');
    console.log(`"q": ${q}, "r": ${r}, "s": ${s}`);
    setIsActive(!isActive);
    console.log(fillColor);
  };

  const fillColor = gameSettings.getBiomeForCoordinates(q, r, s);

  return (
    <Hexagon
      q={q}
      r={r}
      s={s}
      size={configs.hexSize}
      fill={isActive ? 'red' : fillColor}
      onClick={handleClick}
      className={`hexagon-group ${isActive ? 'active' : ''}`}
    >
      <Text className="hexagon-text">{`${q},${r},${s}`}</Text>
    </Hexagon>
  );

};

export default InteractiveHexagon;
