import React from 'react';
import gameSettings from './GameSettings';
import ShopIcon from '../images/sprites/Shop_Icon.png';
import TileInfo from '../images/sprites/Tile_Info.png';
import TroopBlue from '../images/sprites/Troop_Blue.png'; // Import the troop icon

const HexagonModal = ({ isOpen, onClose, onCloseWithoutDeselecting, onOpenTileInfo, hexData, position, openStore, allocateTroops }) => {
  if (!isOpen) return null;

  const StoreFunction = () => {
    if (gameSettings.getSourceOfStore() !== 'HUD') {
      openStore();
    } else {
      return null;
    }
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
  };

  return (
    <div style={modalStyle} className="hexagon-modal">
      <button
        style={{
          position: 'relative',
          top: '-20px',
          right: '90px',
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
          alt='TileInfo'
          style={{
            width: '46px',
            height: '46px',
            background: 'transparent',
          }}
        />
      </button>

      <button
        style={{
          position: 'relative',
          top: '-20px',
          right: '60px',
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
        onClick={StoreFunction}
      >
        <img
          src={ShopIcon}
          alt='Shop'
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      </button>

      <button
        style={{
          position: 'relative',
          top: '-20px',
          right: '30px',
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
          backgroundColor: 'rgba(102, 204, 255, 1)', // Different color for the troop button
          borderRadius: '10px',
        }}
        onClick={allocateTroops} // New function to handle troop allocation
      >
        <img
          src={TroopBlue}
          alt='Troops'
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      </button>

      <button
        style={{
          position: 'relative',
          top: '35px',
          right: '140px',
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
        onClick={onClose}>X
      </button>
    </div>
  );
};

export default HexagonModal;
