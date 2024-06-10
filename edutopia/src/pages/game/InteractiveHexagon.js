import React, { useState, useEffect } from 'react';
import { Hexagon, Text } from 'react-hexgrid';
import configs from './configurations';
import gameSettings from './GameSettings';
import './inGameHex.css';
import TroopIcon from '../images/sprites/Troop_Blue.png';

const InteractiveHexagon = ({ q, r, s, biome, onClick, troops, owner, currentPlayerId }) => {
  const [fillColor, setFillColor] = useState(gameSettings.getBiomeForCoordinates(q, r, s));
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const updateBiome = () => {
      const customBiome = gameSettings.customBiomes[`${q},${r},${s}`];
      const defaultBiome = gameSettings.getBiomeForCoordinates(q, r, s);
      const newColor = customBiome || defaultBiome;
      setFillColor(newColor);
    };

    const checkSelected = () => {
      const selected = gameSettings.getClickedHexagon();
      setIsSelected(selected && selected.q === q && selected.r === r && selected.s === s);
    };

    gameSettings.subscribeToBiomeChanges(updateBiome);
    gameSettings.subscribeToBiomeChanges(checkSelected);

    return () => {
      gameSettings.unsubscribeFromBiomeChanges(updateBiome);
      gameSettings.unsubscribeFromBiomeChanges(checkSelected);
    };
  }, [q, r, s]);

  const handleClick = (e) => {
    if (clickable) {
      const currentlySelected = gameSettings.getClickedHexagon();
      const isThisHexagonSelected = currentlySelected && currentlySelected.q === q && currentlySelected.r === r && currentlySelected.s === s;

      if (isThisHexagonSelected) {
        gameSettings.clearClickedHexagon();
        setIsSelected(false);
        onClick({
          q,
          r,
          s,
          active: false,
          position: { x: e.clientX, y: e.clientY },
          owner,
        });
      } else {
        gameSettings.saveClickedHexagon(q, r, s, "IT");
        setIsSelected(true);
        onClick({
          q,
          r,
          s,
          active: true,
          position: { x: e.clientX, y: e.clientY },
          owner,
        });
      }
    }
  };

  const clickable = owner === currentPlayerId || owner === null; // Allow clicking if the tile is owned by the current player or is unclaimed
  const cursorStyle = clickable ? 'pointer' : 'auto';
  const hexagonClass = `inGameHex ${isSelected ? 'active' : ''} ${fillColor === 'Water' ? 'water' : ''}`;

  const getFillColor = () => {
    switch(owner) {
      case 1:
        return "Grassland_Blue";
      case 2:
        return "Grassland_Pink";
      case 3:
        return "Grassland_Cyan";
      case 4:
        return "Grassland_Yellow";
      default:
        return fillColor;
    }
  };

  return (
    <Hexagon
      q={q}
      r={r}
      s={s}
      size={configs.hexSize}
      fill={getFillColor()}
      onClick={handleClick}
      className={hexagonClass}
      style={{ cursor: cursorStyle }}
    >
      <Text className="hexagon-text">{`${q},${r},${s}`}</Text>
      {troops > 0 && (
        <g transform="translate(-1, 1)">
          <image
            href={TroopIcon}
            height="3"
            width="3"
          />
          <Text x="0" y="1.5" className="troop-count" style={{ fontSize: '2px' }}>{troops}</Text>
        </g>
      )}
    </Hexagon>
  );
};

export default InteractiveHexagon;
