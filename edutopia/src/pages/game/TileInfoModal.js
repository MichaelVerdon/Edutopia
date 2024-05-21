import React from 'react';
import Modal from 'react-modal';
import images from './imageImports';
import GameSettings from './GameSettings';

const TileInfoModal = ({ isOpen, tile, onClose }) => {
  if (!isOpen || !tile) return null;

  

  
  const tileImage = images[tile.biome];

  return (
    <Modal
      isOpen={isOpen}
      
      contentLabel="Tile Information"
      ariaHideApp={false}
      style={{
        content: {
          position: 'absolute',
          top: '40%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid #ccc',
          background: '#fff',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '4px',
          outline: 'none',
          padding: '20px',
          width: '400px'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        }
      }}
    >
      <h2>Tile Information</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
        <img src={tileImage} alt={tile.biome} style={{ width: '100px', height: '100px' }} />
        <div>
          <p>Biome: {tile.biome}</p>
          <p>Owner: {tile.owner || 'Unclaimed'}</p>
        </div>
      </div>
      <div>
        <p>Troops: {tile.getTroops()}</p>
        <p>Resources:</p>
        <p>Tech: {tile.getTechPoints()}</p>
        <p>Food: {tile.getFoodPoints()}</p>
        <p>Wood: {tile.getWoodPoints()}</p>
        <p>Metal: {tile.getMetalPoints()}</p>
      </div>
      <button onClick={onClose} style={{ cursor: 'pointer' }}>Close</button>
    </Modal>
  );
};

export default TileInfoModal;
