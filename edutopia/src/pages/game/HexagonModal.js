import React from 'react';
import gameSettings from './GameSettings';
import ShopIcon from '../images/sprites/Shop_Icon.png';
import TileInfo from '../images/sprites/Tile_Info.png';
import TroopBlue from '../images/sprites/Troop_Blue.png';

const HexagonModal = ({ isOpen, onClose, onCloseWithoutDeselecting, onOpenTileInfo, position, openStore, allocateTroops, hexData }) => {
  if (!isOpen) return null;

  const handleAllocateTroops = () => {
    allocateTroops(hexData);
  };

  const modalStyle = {
    position: 'fixed',
    top: `${position.y}px`,
    left: `${position.x}px`,
    transform: 'translate(10%, -100%)',
    backgroundColor: 'rgba(155, 155, 155, 0)',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    pointerEvents: 'none'
  };

  return (
    <div style={modalStyle} className="hexagon-modal">
      <button
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          top: '-70px',
          right: '50px',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          border: '2px solid rgba(0, 0, 0, 0)',
          cursor: 'pointer',
          fontWeight: 'bolder',
          backgroundColor: 'rgba(255, 204, 0, 0)',
          borderRadius: '10px',
        }}
        onClick={onOpenTileInfo}
      >
        <img
          src={TileInfo}
          alt="TileInfo"
          style={{
            width: '46px',
            height: '46px',
            background: 'transparent',
          }}
        />
      </button>

      <button
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          top: '-20px',
          right: '130px',
          width: '50px',
          height: '50px',
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          border: '2px solid rgba(0, 0, 0, 0.7)',
          cursor: 'pointer',
          fontWeight: 'bolder',
          backgroundColor: 'rgba(255, 204, 102, 1)',
          borderRadius: '10px',
        }}
        onClick={openStore}
      >
        <img
          src={ShopIcon}
          alt="Shop"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      </button>

      <button
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          top: '-20px',
          right: '120px',
          width: '50px',
          height: '50px',
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          border: '2px solid rgba(0, 0, 0, 0.7)',
          cursor: 'pointer',
          fontWeight: 'bolder',
          backgroundColor: 'rgba(255, 204, 102, 1)',
          borderRadius: '10px',
        }}
        onClick={handleAllocateTroops}
      >
        <img
          src={TroopBlue}
          alt="Troops"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      </button>

      <button
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          top: '35px',
          right: '195px',
          width: '30px',
          height: '30px',
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          border: 'none',
          backgroundColor: 'darkred',
          border: '1px solid darkred',
          cursor: 'pointer',
          color: 'white',
          fontWeight: 'bold'
        }}
        onClick={onClose}
      >
        X
      </button>
    </div>
  );
};

export default HexagonModal;
