import React, { Component } from "react";
import { HexGrid, Layout, GridGenerator } from "react-hexgrid";
import InteractiveHexagon from "./InteractiveHexagon";
import configs from "./configurations";
import gapData from "./gapCoordinates.json";
import images from "./imageImports";
import gameSettings from "./GameSettings";
import "./inGameHex.css";
import HexagonModal from "./HexagonModal";

class Board extends Component {
  constructor(props) {
    super(props);
    const config = configs["rectangle"];
    const generator = GridGenerator.getGenerator(config.map);
    const hexCoordinates = generator.apply(this, config.mapProps);
    const gapCoordinates = gapData.gapCoordinates;
    const gapSet = new Set(
      gapCoordinates.map((coord) => `${coord.q},${coord.r},${coord.s}`)
    );
    const hexagons = hexCoordinates.filter(
      (hexCoord) => !gapSet.has(`${hexCoord.q},${hexCoord.r},${hexCoord.s}`)
    );
    this.state = {
      hexagons,
      config,
      viewBox: `${config.viewBox.x} ${config.viewBox.y} ${config.viewBox.width} ${config.viewBox.height}`,
      selectedHex: null,
      showModal: false,
    };
  }

  handleHexagonClick = (hexData) => {
    if (gameSettings.getSourceOfStore() !== "HUD") {
      if (hexData.active) {
        this.setState({ selectedHex: hexData, showModal: true });
      } else {
        this.setState({ showModal: false });
      }
    } else {
      gameSettings.saveSourceOfStore(null);
    }
  };

  handleCloseModal = () => {
    gameSettings.clearClickedHexagon();
    this.setState({ showModal: false, selectedHex: null });

    this.props.toggleStoreModal();
  };

  forceCloseModal = () => {
    this.setState({ showModal: false, selectedHex: null });
    gameSettings.clearClickedHexagon();
  };

  handleCloseWithoutDeselecting = () => {
    this.setState({ showModal: false });
    gameSettings.saveSourceOfStore(null);
  };

  selectHexagon = (hexData) => {
    this.setState({ selectedHex: hexData });
  };

  componentDidMount() {
    document.addEventListener("click", this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOutsideClick, false);
  }

  handleOutsideClick = (e) => {
    if (
      this.state.selectedHex &&
      !e.target.closest(".hexagon-modal, .hexagon")
    ) {
      this.clearSelectedHexagon();
    }
  };

  clearSelectedHexagon = () => {
    this.setState({ selectedHex: null });
  };

  render() {
    const { hexagons, config, viewBox, selectedHex, showModal } = this.state;

    const { currentPlayer, tiles, showClaimTilePopup, handleClaimTile } =
      this.props;
    console.log("🚀 ~ Board ~ render ~ currentPlayer:", currentPlayer);

    const size = { x: config.layout.width, y: config.layout.height };

    const ownedHexagons = hexagons.filter((hex) =>
      currentPlayer.ownedTiles.find(
        (tile) => tile.q === hex.q && tile.r === hex.r && tile.s === hex.s
      )
    );
    console.log("🚀 ~ Board ~ render ~ ownedHexagons:", ownedHexagons);

    return (
      <div className="board">
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
                <image
                  href={images[key]}
                  width="6"
                  height="6"
                  preserveAspectRatio="xMidYMid slice"
                />
                <rect
                  width="100%"
                  height="100%"
                  fill="rgba(0, 0, 0, 0)"
                  className="rect-overlay"
                />
              </pattern>
            ))}
          </defs>
          <Layout
            size={size}
            flat={config.layout.flat}
            spacing={config.layout.spacing}
            origin={config.origin}
          >
            {hexagons.map((hex, i) => {
              const owner = tiles.find(
                (tile) =>
                  tile.q === hex.q && tile.r === hex.r && tile.s === hex.s
              )?.owner;
              return (
                <InteractiveHexagon
                  key={`hex-${hex.q}-${hex.r}-${hex.s}`}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  onClick={this.handleHexagonClick}
                  owner={owner}
                  currentPlayerId={currentPlayer.playerId}
                  ownedHexagons={ownedHexagons}
                />
              );
            })}
          </Layout>
        </HexGrid>

        {showModal && selectedHex && (
          <HexagonModal
            isOpen={this.state.showModal}
            onClose={this.forceCloseModal}
            onCloseWithoutDeselecting={this.handleCloseWithoutDeselecting}
            hexData={this.state.selectedHex}
            position={
              this.state.selectedHex
                ? this.state.selectedHex.position
                : { q: 0, r: 0 }
            }
            openStore={this.props.toggleStoreModal}
            currentPlayer={this.props.currentPlayer}
            showClaimTilePopup={showClaimTilePopup}
            handleClaimTile={handleClaimTile}
          />
        )}
      </div>
    );
  }
}

export default Board;
