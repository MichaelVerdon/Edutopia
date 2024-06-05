// PopupMenu.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Game.css';
import './PopupMenu.css';

const PopupMenu = ({ isOpen, onClose, saveGame, loadGame }) => { // Added saveGame prop
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="popup-menu-overlay">
      <div className="popup-menu">
        <button onClick={saveGame}>Save Game</button>
        <button onClick={loadGame}>Load Game</button>
        <button onClick={() => navigate('/')}>Quit Game</button>
      </div>
      <div className="popup-menu-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default PopupMenu;
