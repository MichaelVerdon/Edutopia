import React, { Component } from 'react';
import { HexGrid, Layout, GridGenerator } from 'react-hexgrid';
import InteractiveHexagon from './InteractiveHexagon';
import Tile from './Tile';
import configs from './configurations';
import gapData from './gapCoordinates.json'; // Import the entire JSON file

class Board extends Component {
  constructor(props) {
    super(props);
    const config = configs['rectangle'];
    const generator = GridGenerator.getGenerator(config.map);
    const hexCoordinates = generator.apply(this, config.mapProps);

    // Extract the gapCoordinates array from the imported data
    const gapCoordinates = gapData.gapCoordinates;

    // Create a set for quick lookup of gap coordinates
    const gapSet = new Set(
      gapCoordinates.map(coord => `${coord.q},${coord.r},${coord.s}`)
    );

    // Filter out the hexagons that are in the gap set
    const hexagons = hexCoordinates
      .filter(hexCoord => !gapSet.has(`${hexCoord.q},${hexCoord.r},${hexCoord.s}`))
      .map(hexCoord => new Tile(hexCoord.q, hexCoord.r, hexCoord.s));

    this.state = {
      hexagons,
      config,
      viewBox: `${config.viewBox.x} ${config.viewBox.y} ${config.viewBox.width} ${config.viewBox.height}`,
    };
  }

  render() {
    const { hexagons, config, viewBox } = this.state;
    const size = { x: config.layout.width, y: config.layout.height };

    // Container style for scrolling
    const containerStyle = {
      width: '100%',
      overflow: 'auto',
      maxHeight: '100vh',
    };

    return (
      <div style={containerStyle}>
        <HexGrid width={config.width} height={config.height} viewBox={viewBox}>
            
          <Layout size={size} flat={config.layout.flat} spacing={config.layout.spacing} origin={config.origin}>
            {hexagons.map((hex, i) => (
              <InteractiveHexagon
                key={`${hex.q},${hex.r},${hex.s}`}
                q={hex.q}
                r={hex.r}
                s={hex.s}
                size={size}
                tile={hex} // Pass the Tile instance to InteractiveHexagon
              />
            ))}
          </Layout>
        </HexGrid>
      </div>
    );
  }
}

export default Board;
