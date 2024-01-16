import React, { useState } from 'react';
import { HexGrid, Layout, Text } from 'react-hexgrid';
import InteractiveHexagon from './InteractiveHexagon';
import mapImage from './map.png';

// Set of coordinates for gaps in the hex grid
const gapCoordinates = new Set([
  '9,15', '10,15', '8,16', '9,16', '10,16', '8,17', '9,17', '5,18', '6,18', '7,18',
  '8,18', '9,18', '9,18', '10,18', '11,18', '13,18', '15,18', '16,18', '-1,19',
  '4,19', '5,19', '10,19', '11,19', '12,19', '13,19', '14,19', '15,19', '-2,20', '-1,20',
  '0,20', '10,20', '11,20', '12,20', '-2,21', '11,21', '-5,22', '-4,22', '-3,22', '-2,22',
  '-1,22', '-6,23', '-5,23', '-9,24', '-8,24', '-7,24', '-11,25', '-10,25', '-13,26', '-12,26'
]);

// Generates the grid using the gaps given in 'gapCoordinates'
const generateCustomGrid = () => {
  let hexagons = [];
  const width = 30;  // Width of grid
  const height = 20; // Height of grid
  for (let r = 0; r < height; r++) {
    const rOffset = Math.floor(r / 2);
    for (let q = -rOffset; q < width - rOffset; q++) {
      const coordinateKey = `${q},${r}`;
      if (!gapCoordinates.has(coordinateKey)) {
        hexagons.push({ q, r, s: -q-r });
      }
    }
  }
  return hexagons;
};

const Board = () => {
  const [hexagons, setHexagons] = useState(generateCustomGrid());
  const [resourceCount, setResourceCount] = useState(0); // State for resource count (not currently used)

  // Fixed size for the hex grid and background 
  const boardWidth = 1920; // Fixed board width
  const boardHeight = 1080; // Fixed board height
  const hexSize = { x: 30, y: 30 }; // Fixed hex size
  
  const boardStyle = {
    width: boardWidth,
    height: boardHeight,
    backgroundImage: `url(${mapImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    position: 'relative',
    margin: 'auto', // Center the board in the browser window
  };

  // ViewBox starting position
  const viewBoxX = -100;
  const viewBoxY = -100;
  // Resolution LxH (16:9 aspect ratio)
  const viewBoxWidth = 1920;  
  const viewBoxHeight = 1080;

  return (
    <div style={boardStyle}>
      {/* Optional Display the resource counter */}
      <div style={{ position: 'absolute', top: 30, right: 30, zIndex: 1, color: 'cyan', fontSize: '20px' }}>
        Resources: {resourceCount}
      </div>                                        
      <HexGrid width={boardWidth} height={boardHeight} viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}>
        <Layout
          size={hexSize}
          flat={false}
          spacing={1.05}
          origin={{ x: 0, y: 0 }}
        >
          {hexagons.map((hex, i) => (
            <InteractiveHexagon 
              key={i} 
              q={hex.q}
              r={hex.r} 
              s={hex.s} 
              size={hexSize}
              onClick={() => setResourceCount(prevCount => prevCount + 1)} 
            >
            <Text
                x="0"
                y="0"
                fontSize={hexSize.x * 0.5} 
                textAnchor="middle"
                fill="black"
                style={{ pointerEvents: 'none' }}
              >
                {`${hex.q},${hex.r}`}
              </Text>
            </InteractiveHexagon>
          ))}
          
        </Layout>
      </HexGrid>
    </div>
  );
};

export default Board;
