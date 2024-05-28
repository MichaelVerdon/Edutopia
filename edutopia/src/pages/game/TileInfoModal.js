import React from 'react';
import Modal from 'react-modal';
import images from './imageImports';

const TileInfoModal = ({ isOpen, tile, onClose }) => {
  if (!isOpen || !tile) return null;

  const tileImage = images[tile.biome];

  const modalContentStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    maxWidth: '60%',
    height: 'auto',
    maxHeight: '90vh',
    backgroundColor: '#f2de7f',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    border: '2px solid #000000',
    fontWeight: 'bold',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    textAlign: 'center',
  };

  const overlayStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    pointerEvents: 'auto',
  };

  const rowStyle = (index) => ({
    backgroundColor: index % 2 === 0 ? '#ffeb99' : '#fdd835',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    margin: '10px 0',
    width: '100%',
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Tile Information"
      ariaHideApp={false}
      style={{ content: modalContentStyle, overlay: overlayStyle }}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', backgroundColor: '#f44336', border: 'none', color: 'white', padding: '5px 10px', fontSize: '16px', borderRadius: '50%' }}>X</button>
      <h2 style={{ fontSize: '24px' }}>Tile Information</h2>
      <img src={tileImage} alt={tile.biome} style={{ width: '120px', height: '120px', margin: '10px auto' }} />
      <div style={rowStyle(0)}>Biome: {tile.biome}</div>
      <div style={rowStyle(1)}>Owner: {tile.owner || 'Unclaimed'}</div>
      <div style={rowStyle(2)}>Troops: {tile.getTroops()}</div>
      <div style={rowStyle(3)}>Tech: {tile.getTechPoints()}</div>
      <div style={rowStyle(4)}>Food: {tile.getFoodPoints()}</div>
      <div style={rowStyle(5)}>Wood: {tile.getWoodPoints()}</div>
      <div style={rowStyle(6)}>Metal: {tile.getMetalPoints()}</div>
    </Modal>
  );
};

export default TileInfoModal;
