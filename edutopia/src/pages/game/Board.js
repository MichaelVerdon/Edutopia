import React, { Component } from 'react';
import { HexGrid, Layout, GridGenerator } from 'react-hexgrid';
import InteractiveHexagon from './InteractiveHexagon';
import configs from './configurations';
import gapData from './gapCoordinates.json';
import images from './imageImports';
import gameSettings from './GameSettings';
import './inGameHex.css';
import HexagonModal from './HexagonModal';
import Tile from './Tile';
import TileInfoModal from './TileInfoModal';

class Board extends Component {
  constructor(props) {
    super(props);
    const config = configs['rectangle'];
    const generator = GridGenerator.getGenerator(config.map);
    const hexCoordinates = generator.apply(this, config.mapProps);
    const gapCoordinates = gapData.gapCoordinates;
    const gapSet = new Set(gapCoordinates.map(coord => `${coord.q},${coord.r},${coord.s}`));
    const hexagons = hexCoordinates.filter(hexCoord => !gapSet.has(`${hexCoord.q},${hexCoord.r},${hexCoord.s}`)).map(hex => new Tile(hex.q, hex.r, hex.s));

    this.state = {
      hexagons,
      config,
      viewBox: `${config.viewBox.x} ${config.viewBox.y} ${config.viewBox.width} ${config.viewBox.height}`,
      selectedHex: null,
      showModal: false,
      tileInfoModalOpen: false,
      selectedTile: null,
    };
  }

  openTileInfo = () => {
    if (this.state.selectedHex) {
      const hexData = this.state.selectedHex;
      this.setState({
        selectedTile: hexData.tile,
        tileInfoModalOpen: true,
      });
    }
  };

  resetSelection = () => {
    this.setState({ selectedHex: null, showModal: false, tileInfoModalOpen: false });
  };

  closeTileInfo = () => {
    this.setState({
      tileInfoModalOpen: false,
      selectedTile: null,
    });
  };

  handleHexagonClick = (hexData) => {
    const tile = this.state.hexagons.find(hex => hex.q === hexData.q && hex.r === hexData.r && hex.s === hexData.s);
    this.setState({ selectedHex: { ...hexData, tile }, showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, selectedHex: null });
  };

  forceCloseModal = () => {
    this.setState({ showModal: false, selectedHex: null });
    this.resetSelection();
  };

  allocateTroops = () => {
    const { selectedHex, hexagons } = this.state;
    const { ownedTroops, setOwnedTroops } = this.props;

    if (ownedTroops > 0 && selectedHex && selectedHex.tile) {
      selectedHex.tile.addTroops(1);
      const updatedHexagons = hexagons.map(hex => {
        if (hex.q === selectedHex.q && hex.r === selectedHex.r && hex.s === selectedHex.s) {
          return selectedHex.tile;
        }
        return hex;
      });
      setOwnedTroops(ownedTroops - 1);
      this.setState(
        {
          hexagons: updatedHexagons,
        },
        () => {
          console.log(`Allocated 1 troop to tile at coordinates (${selectedHex.q}, ${selectedHex.r}, ${selectedHex.s}).`);
        }
      );
    } else {
      console.log('No troops available to allocate.');
    }
  };

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  handleOutsideClick = (e) => {
    if (this.state.selectedHex && !e.target.closest('.hexagon-modal, .hexagon')) {
      this.clearSelectedHexagon();
    }
  };

  clearSelectedHexagon = () => {
    this.setState({ selectedHex: null });
  };

  render() {
    const { hexagons, config, viewBox, selectedHex, showModal, tileInfoModalOpen, selectedTile } = this.state;
    const size = { x: config.layout.width, y: config.layout.height };

    return (
      <div className='board'>
        <HexGrid width={config.width} height={config.height} viewBox={viewBox}>
          <defs>
            {Object.keys(images).map((key) => (
              <pattern
                key={key}
                id={key}
                patternUnits="objectBoundingBox"
                width="1"
                height="1"
                viewBox="0 0 6 6"
                patternTransform="scale(1.16)"
              >
                <image href={images[key]} width="6" height="6" preserveAspectRatio="xMidYMid slice" />
                <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" className="rect-overlay" />
              </pattern>
            ))}
          </defs>
          <Layout size={size} flat={config.layout.flat} spacing={config.layout.spacing} origin={config.origin}>
            {hexagons.map((hex, i) => (
              <InteractiveHexagon
                key={`hex-${hex.q}-${hex.r}-${hex.s}`}
                q={hex.q}
                r={hex.r}
                s={hex.s}
                onClick={this.handleHexagonClick}
                troops={hex.getTroops()}
              />
            ))}
          </Layout>
        </HexGrid>
        {tileInfoModalOpen && selectedTile && (
          <TileInfoModal isOpen={tileInfoModalOpen} onClose={this.closeTileInfo} tile={selectedTile} />
        )}

        {showModal && selectedHex && (
          <HexagonModal
            isOpen={showModal}
            onClose={this.forceCloseModal}
            onCloseWithoutDeselecting={this.handleCloseWithoutDeselecting}
            onOpenTileInfo={this.openTileInfo}
            hexData={selectedHex}
            position={selectedHex.position}
            openStore={this.props.toggleStoreModal}
            allocateTroops={this.allocateTroops}
          />
        )}
      </div>
    );
  }
}

export default Board;
