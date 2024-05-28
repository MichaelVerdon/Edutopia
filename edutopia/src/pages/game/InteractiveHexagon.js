import React, { useState, useEffect } from "react";
import { Hexagon, Text } from "react-hexgrid";
import configs from "./configurations";
import gameSettings from "./GameSettings";
import "./inGameHex.css";

const InteractiveHexagon = ({
  q,
  r,
  s,
  onClick,
  owner,
  currentPlayerId,
  ownedHexagons,
}) => {
  const initialBiome = gameSettings.getBiomeForCoordinates(q, r, s);
  const playerColors = {
    1: "Grassland_Blue",
    2: "Grassland_Pink",
    3: "Grassland_Cyan",
    4: "Grassland_Yellow",
  };

  const isOwned = ownedHexagons.some(
    (hex) => hex.q === q && hex.r === r && hex.s === s
  );

  const [fillColor, setFillColor] = useState(
    isOwned ? playerColors[owner] : initialBiome
  ); 
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    const updateBiome = () => {
      const customBiome = gameSettings.customBiomes[`${q},${r},${s}`];
      const defaultBiome = gameSettings.getBiomeForCoordinates(q, r, s);
      const newColor = isOwned ? playerColors[owner] : customBiome || defaultBiome;
      setFillColor(newColor);
    };

    const checkSelected = () => {
      const selected = gameSettings.getClickedHexagon();
      setIsSelected(
        selected && selected.q === q && selected.r === r && selected.s === s
      );
    };

    gameSettings.subscribeToBiomeChanges(updateBiome);
    gameSettings.subscribeToBiomeChanges(checkSelected);

    return () => {
      gameSettings.unsubscribeFromBiomeChanges(updateBiome);
      gameSettings.unsubscribeFromBiomeChanges(checkSelected);
    };
  }, [q, r, s, isOwned, owner, playerColors]);

  const handleClick = (e) => {
    const currentlySelected = gameSettings.getClickedHexagon();
    const isThisHexagonSelected =
      currentlySelected &&
      currentlySelected.q === q &&
      currentlySelected.r === r &&
      currentlySelected.s === s;

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
  };

  const clickable = fillColor !== "Water";
  const cursorStyle = clickable ? "pointer" : "auto";
  const hexagonClass = `inGameHex ${isSelected ? "active" : ""} ${
    fillColor === "Water" ? "water" : ""
  } ${isOwned ? "owned" : ""}`;

  return (
    <Hexagon
      q={q}
      r={r}
      s={s}
      size={configs.hexSize}
      fill={fillColor}
      onClick={clickable ? handleClick : null}
      className={hexagonClass}
      style={{ cursor: cursorStyle, position: "relative" }}
    >
      <Text className="hexagon-text">{`${q},${r},${s}`}</Text>
      <div className={`hexagon-owner owner-${owner}`}>
        {owner === currentPlayerId ? "Your Tile" : `P${owner}`}
      </div>
    </Hexagon>
  );
};

export default InteractiveHexagon;
