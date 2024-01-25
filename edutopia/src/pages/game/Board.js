import React, { Component } from 'react';
import { HexGrid, Layout, GridGenerator } from 'react-hexgrid';
import InteractiveHexagon from './InteractiveHexagon';
import Tile from './Tile';
import configs from './configurations';
import gapData from './gapCoordinates.json';
import plains from '../images/sprites/Grassland_Blue.png';
import mountain from '../images/sprites/Rocky_Blue.png';
import forest from '../images/sprites/Woods_Blue.png';
import './hex.css';


class Board extends Component {
  constructor(props) {
    super(props);
    const config = configs['rectangle'];
    const generator = GridGenerator.getGenerator(config.map);
    const hexCoordinates = generator.apply(this, config.mapProps);
    const gapCoordinates = gapData.gapCoordinates;
    const gapSet = new Set(gapCoordinates.map(coord => `${coord.q},${coord.r},${coord.s}`));
    const hexagons = hexCoordinates.filter(hexCoord => !gapSet.has(`${hexCoord.q},${hexCoord.r},${hexCoord.s}`))
                                   .map(hexCoord => new Tile(hexCoord.q, hexCoord.r, hexCoord.s));
    this.state = { hexagons, config, viewBox: `${config.viewBox.x} ${config.viewBox.y} ${config.viewBox.width} ${config.viewBox.height}` };
  }

  render() {
    const { hexagons, config, viewBox } = this.state;
    const size = { x: config.layout.width, y: config.layout.height };

    return (
      <div className='board'>
        <HexGrid width={config.width} height={config.height} viewBox={viewBox}>
          <defs>
            <pattern id="patternForest" patternUnits="objectBoundingBox"  width="1" height="1" viewBox="0 0 6 6" patternTransform="scale(1.16)">
              <image href={plains} width="6" height="6" transform="rotate(30, 3, 3)" preserveAspectRatio="xMidYMid slice"/>
            </pattern>
            <pattern id="patternMountain" patternUnits="objectBoundingBox" width="1" height="1" viewBox="0 0 6 6" patternTransform="scale(1.16)">
              <image href={mountain} width="6" height="6" transform="rotate(30, 3, 3)" preserveAspectRatio="xMidYMid slice"/>
            </pattern>
            <pattern id="patternPlains" patternUnits="objectBoundingBox" width="1" height="1" viewBox="0 0 6 6" patternTransform="scale(1.16)">
              <image href={forest} width="6" height="6" transform="rotate(30, 3, 3)" preserveAspectRatio="xMidYMid slice"/>
            </pattern>
          </defs>
          <Layout size={size} flat={config.layout.flat} spacing={config.layout.spacing} origin={config.origin}>
            {hexagons.map((hex, i) => (
              <InteractiveHexagon
                key={`${hex.q},${hex.r},${hex.s}`}
                q={hex.q}
                r={hex.r}
                s={hex.s}
                size={size}
                fill={this.determineFillColor(hex.biome)}
                tile={hex} 
              />
            ))}
          </Layout>
        </HexGrid>
      </div>
    );
  }

  determineFillColor(biome) {
    switch (biome) {
      case "Plains":
        return "url(#patternPlains)";
      case "Mountain":
        return "url(#patternMountain)";
      default:
        return "none";
    }
  }
}

export default Board;
