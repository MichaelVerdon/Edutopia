// PopupMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Game.css';
import './PopupMenu.css';

const PopupMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="popup-menu-overlay">
      <div className="popup-menu">
        <button onClick={() => console.log("Save Game")}>Save Game</button>
        <button onClick={() => console.log("Load Game")}>Load Game</button>
        <button onClick={() => navigate('/')}>Quit Game</button>
      </div>
      <div className="popup-menu-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default PopupMenu;
