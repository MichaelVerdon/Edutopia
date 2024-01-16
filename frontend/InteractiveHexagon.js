import React, { useState } from 'react';
import { Hexagon } from 'react-hexgrid';

const InteractiveHexagon = ({ onClick, ...props }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleHexClick = () => {
    setIsClicked(!isClicked);
    console.log(`Hexagon coordinates: (${props.q}, ${props.r})`);
    if (onClick) {
      onClick();
    }
  };

  const fillColor = isClicked ? "rgba(255, 0, 0, .8)" : "rgba(0, 200, 0, .8)";

  return (
    <Hexagon
      {...props}
      style={{ fill: fillColor, stroke: "black", strokeWidth: "1" }}
      onClick={handleHexClick}
    />
  );
};

export default InteractiveHexagon;
