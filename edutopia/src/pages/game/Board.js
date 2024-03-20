// Board.js

import React, { Component } from 'react';
import { HexGrid, Layout, GridGenerator } from 'react-hexgrid';
import InteractiveHexagon from './InteractiveHexagon';
import configs from './configurations';
import gapData from './gapCoordinates.json';
import grassLand from '../images/sprites/Grassland_Unclaimed.png';
import rocky from '../images/sprites/Rocky_Unclaimed.png';
import woods from '../images/sprites/Woods_Unclaimed.png';
import potionShop from '../images/sprites/VillageWithPotionShop_Yellow.png';
import water from '../images/sprites/water.png';
import './inGameHex.css'; // Import the new CSS file

class Board extends Component {
  constructor(props) {
    super(props);
    const config = configs['rectangle'];
    const generator = GridGenerator.getGenerator(config.map);
    const hexCoordinates = generator.apply(this, config.mapProps);
    const gapCoordinates = gapData.gapCoordinates;
    const gapSet = new Set(gapCoordinates.map(coord => `${coord.q},${coord.r},${coord.s}`));
    const hexagons = hexCoordinates.filter(hexCoord => (`${hexCoord.q},${hexCoord.r},${hexCoord.s}`));
    this.state = { hexagons, config, viewBox: `${config.viewBox.x} ${config.viewBox.y} ${config.viewBox.width} ${config.viewBox.height}` };
  }

  render() {
    const { hexagons, config, viewBox } = this.state;
    const size = { x: config.layout.width, y: config.layout.height };

    return (
      <div className='board'>
        <HexGrid width={config.width} height={config.height} viewBox={viewBox}>
          <defs>
            {/* Define patterns for each biome */}
            <pattern id="patternGrassLand" patternUnits="objectBoundingBox"  width="1" height="1" viewBox="0 0 6 6" patternTransform="scale(1.16)">
              <image href={grassLand} width="6" height="6" transform="rotate(30, 3, 3)" preserveAspectRatio="xMidYMid slice"/>
            </pattern>
            <pattern id="patternRocky" patternUnits="objectBoundingBox" width="1" height="1" viewBox="0 0 6 6" patternTransform="scale(1.16)">
              <image href={rocky} width="6" height="6" transform="rotate(30, 3, 3)" preserveAspectRatio="xMidYMid slice"/>
            </pattern>
            <pattern id="patternWoods" patternUnits="objectBoundingBox" width="1" height="1" viewBox="0 0 6 6" patternTransform="scale(1.16)">
              <image href={woods} width="6" height="6" transform="rotate(30, 3, 3)" preserveAspectRatio="xMidYMid slice"/>
            </pattern>
            <pattern id="patternPotShop" patternUnits="objectBoundingBox" width="1" height="1" viewBox="0 0 6 6" patternTransform="scale(1.16)">
              <image href={potionShop} width="6" height="6"  preserveAspectRatio="xMidYMid slice"/>
            </pattern>
            <pattern id="patternWater" patternUnits="objectBoundingBox" width="1" height="1" viewBox="0 0 6 6" patternTransform="scale(1.16)">
              <image href={water} width="6" height="6"  preserveAspectRatio="xMidYMid slice"/>
            </pattern>
          </defs>
          <Layout size={size} flat={config.layout.flat} spacing={config.layout.spacing} origin={config.origin}>
            {hexagons.map((hex, i) => (
              <InteractiveHexagon
                key={`hex-${hex.q}-${hex.r}-${hex.s}`}
                q={hex.q}
                r={hex.r}
                s={hex.s}
              />
            ))}
          </Layout>
        </HexGrid>
      </div>
    );
  }
}

export default Board;