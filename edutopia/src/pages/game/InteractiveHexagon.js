import React, { useState, useEffect } from 'react';
import { Hexagon, Text } from 'react-hexgrid';
import configs from './configurations';
import gameSettings from './GameSettings';
import './inGameHex.css';

const InteractiveHexagon = ({ q, r, s, onClick }) => {
  const [fillColor, setFillColor] = useState(gameSettings.getBiomeForCoordinates(q, r, s));
  const [isSelected, setIsSelected] = useState(false);

  const checkSelected = () => {
    const selected = gameSettings.getClickedHexagon();
    setIsSelected(selected && selected.q === q && selected.r === r && selected.s === s);
  };

  useEffect(() => {
    const updateBiome = () => {
      setFillColor(gameSettings.customBiomes[`${q},${r},${s}`] || gameSettings.getBiomeForCoordinates(q, r, s));
    };

  
    gameSettings.subscribeToBiomeChanges(updateBiome);
    gameSettings.subscribeToBiomeChanges(checkSelected);


    return () => {
      gameSettings.unsubscribeFromBiomeChanges(updateBiome);
      gameSettings.unsubscribeFromBiomeChanges(checkSelected);
    };
  }, [q, r, s]);

  const handleClick = (e) => {
    const currentlySelected = gameSettings.getClickedHexagon();
    const isThisHexagonSelected = currentlySelected && currentlySelected.q === q && currentlySelected.r === r && currentlySelected.s === s;
    console.log('Hexagon clicked');
    console.log(`"q": ${q}, "r": ${r}, "s": ${s}`);
    console.log("Current Hexagon biome:", fillColor);
    const source = 'IT';

    if (isThisHexagonSelected && source === 'IT') {
      gameSettings.clearClickedHexagon();
      setIsSelected(false);
      onClick({ q, r, s, active: false, position: { x: e.clientX, y: e.clientY } });
    } else {
      gameSettings.saveClickedHexagon(q, r, s, source);
      setIsSelected(true);
      onClick({ q, r, s, active: true, position: { x: e.clientX, y: e.clientY } });
      console.log(gameSettings.getClickedHexagon());
    }
  };

  const clickable = fillColor !== 'Water';
  const cursorStyle = clickable ? 'pointer' : 'auto';
  const hexagonClass = `inGameHex ${isSelected ? 'active' : ''} ${fillColor === 'Water' ? 'water' : ''}`;

  return (
    <Hexagon
      q={q}
      r={r}
      s={s}
      size={configs.hexSize}
      fill={fillColor}
      onClick={clickable ? handleClick : null}
      className={hexagonClass}
      style={{ cursor: cursorStyle }}
    >
      <Text className="hexagon-text">{`${q},${r},${s}`}</Text>
    </Hexagon>
  );
};

export default InteractiveHexagon;
