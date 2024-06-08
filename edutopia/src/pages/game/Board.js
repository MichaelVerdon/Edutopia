import React, { Component, forwardRef, useImperativeHandle } from 'react';
import { HexGrid, Layout, GridGenerator } from 'react-hexgrid';
import InteractiveHexagon from './InteractiveHexagon';
import configs from './configurations';
import gapData from './gapCoordinates.json';
import images from './imageImports';
import './inGameHex.css';
import HexagonModal from './HexagonModal';
import TileInfoModal from './TileInfoModal';
import GameSettings from './GameSettings';
import Tile from './Tile';

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
    const tile = this.props.tiles.find(tile => tile.q === hexData.q && tile.r === hexData.r && tile.s === hexData.s);
    this.setState({ selectedHex: { ...hexData, tile }, showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, selectedHex: null });
  };

  forceCloseModal = () => {
    this.setState({ showModal: false, selectedHex: null });
    this.resetSelection();
  };

  updateTileBiome = (hex, biome) => {
    const updatedHexagons = this.state.hexagons.map(tile => {
        if (tile.q === hex.q && tile.r === hex.r && tile.s === hex.s) {
            tile.setBiome(biome); // Set the new biome using the setBiome method from Tile class
            return tile;
        }
        return tile;
    });
    this.setState({ hexagons: updatedHexagons });
};


  allocateTroops = (hexData) => {
    const tile = this.state.hexagons.find(hex => hex.q === hexData.q && hex.r === hexData.r && hex.s === hexData.s);
    const selectedHex = { ...hexData, tile };
    const { hexagons } = this.state;
    const { ownedTroops, setOwnedTroops, currentPlayer } = this.props;  // Include currentPlayer in the destructuring from props

    if (ownedTroops > 0 && selectedHex && selectedHex.tile && selectedHex.tile.owner === currentPlayer.playerId) {
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
        console.log('No troops available to allocate or tile not owned.');
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
    const { tiles, currentPlayer } = this.props;

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
            {hexagons.map((hex, i) => {
              const tile = tiles ? tiles.find(tile => tile.q === hex.q && tile.r === hex.r && tile.s === hex.s) : null;
              const owner = tile ? tile.owner : null;
              const biome = tile ? tile.biome : null;
              return (
                <InteractiveHexagon
                  key={`hex-${hex.q}-${hex.r}-${hex.s}`}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  onClick={this.handleHexagonClick}
                  troops={hex.getTroops()}
                  owner={owner}
                  biome={hex.biome}
                  currentPlayerId={currentPlayer ? currentPlayer.playerId : null}
                />
              );
            })}
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
            updateTileBiome={this.updateTileBiome} 
          />
        )}
      </div>
    );
  }
}

export default forwardRef((props, ref) => {
  const boardRef = React.useRef();

  useImperativeHandle(ref, () => ({
    allocateTroops: (hex) => {
      if (boardRef.current) {
        boardRef.current.allocateTroops(hex);
      }
    }
  }));

  return <Board ref={boardRef} {...props} />;
});
