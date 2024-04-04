import React from 'react';
import gameSettings from './GameSettings';
import ShopIcon from '../images/sprites/ShopIcon.png';

const HexagonModal = ({ isOpen, onClose, onCloseWithoutDeselecting, hexData, position, openStore}) => {
  if (!isOpen) return null;
  

  

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
      
      <button style={{
          position: 'relative',
          top: '-20px',
          right: '90px',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          border: '1px solid',
          cursor: 'pointer',
          fontWeight: 'bolder'
        }} onClick={() => console.log('Tile Info')}>1</button>



      <button style={{
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
        onClick={() => {openStore();
          onCloseWithoutDeselecting();
          gameSettings.saveClickedHexagon(hexData.q, hexData.r, hexData.s, 'HM');
          console.log('Shop');
          console.log(gameSettings.getClickedHexagon())}
        }>
          <img
           src = {ShopIcon}
           alt = 'Shop'
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
          backgroundColor: 'red',
          border:'1px solid darkred',
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
