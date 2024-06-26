import React, {useState, useEffect, useContext, useImperativeHandle, forwardRef  } from 'react';
import Modal from 'react-modal';
import { PlayerContext } from './Game';
import PlayerObject from './game/PlayerObject';
import gameSettings from './game/GameSettings';
import './Store.css';
import NotificationManager from '../pages/game/NotificationManager';
import storeData from '../pages/game/storeItemsData.json';
import sounds from './game/sounds/soundImports.js';
import Tile from './game/Tile';
import aiPlayer from './game/aiPlayer.js';

Modal.setAppElement('#root');


const Store = forwardRef(({ storeModal, close }, ref) => {
  const [phase, setPhase] = useState(0);
  const [reason, setReason] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { player, setPlayer, opponent, setOpponent, opponent1, setOpponent1, opponent2, setOpponent2, turn, setTurn } = useContext(PlayerContext);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedHex, setSelectedHex] = useState(null);
  const source = gameSettings.getSourceOfStore();

  const customStyles = {
    overlay: {
      backgroundColor: 'transparent',
      pointerEvents: 'none',
    },
    content: {
      padding: '15px',
      transform: 'translate(-50%, -25%)',
      width: 'auto',
      height: 'auto',
      pointerEvents: 'auto',
    },
  };

  const customStyles2 = {
    content: {
      padding: '15px',
      transform: 'translate(-50%, -25%)',
      width: '100%',
      height: 'auto',
    },
  };

  async function handleRowClick(row) {
    setSelectedItem(row);
    setShowPopup(true);
    let currentPlayer = await playersTurn();
    if (hasResources(currentPlayer, row)) {
      setReason("You do not have enough resources to purchase this!");
      setSelectedItem(null);
      setPhase(1);
    } else {
      setPhase(3);
    }
  }

  function hasResources(currentPlayer, row){
    if(currentPlayer.getTechPoints < row.techPoints 
      || currentPlayer.getFoodPoints < row.foodPoints 
      || currentPlayer.getWoodPoints < row.woodPoints 
      || currentPlayer.getMetalPoints < row.metalPoints){
        return true;
      } 
      else{
        return false;
      }
  }

  const changeSelectedHex = (selectedHex) => {
    setSelectedHex(selectedHex);
  };

  useEffect(() => {
    changeSelectedHex(gameSettings.getClickedHexagon());
  }, []);

  useEffect(() => {
    if (turn != 1 && selectedItem !== null && selectedHex !== null){
      purchase();
    }
  }, [selectedItem]);

  const backToMain = () => {
    setPhase(0);
  };

  const playersTurn = async () => {
    switch (turn) {
      case 1: return player;
      case 2: return opponent;
      case 3: return opponent1;
      case 4: return opponent2;
      default: return null;
    }
  };

  const colorTurn = async () => {
    switch (turn) {
      case 1: return '_Blue';
      case 2: return '_Pink';
      case 3: return '_Cyan';
      case 4: return '_Yellow';
      default: return '';
    }
  };

  async function canPurchase() {
    try {
      if ((checkTileAdjancency() || checkTileOwnership()) && await checkCorrectLand()) {
        return true;
      } else {
        NotificationManager.showSuccessNotification("Please pick a tile adjacent to owned tiles or buy on an owned tile!");
        return false;
      }
    } catch {
      //NotificationManager.showSuccessNotification("Something went wrong, please try again!");
      return false;
    }
  }

  async function checkCorrectLand(){
    const { q, r, s } = selectedHex;
    let clickedHexagonBiome = await gameSettings.getBiomeForCoordinates(q, r, s);
      for(let i = 0; i<selectedItem.landNeeded.length; i++){
        console.log(selectedItem.landNeeded + colorTurn());
        if(clickedHexagonBiome === selectedItem.landNeeded + "_Unclaimed" || clickedHexagonBiome === selectedItem.landNeeded + await colorTurn()){
          return true;
        }
      }
      return false;
  }

  async function checkTileAdjancency() {
    let selectedTile = [selectedHex.q, selectedHex.r, selectedHex.s];
    let tiles;
    switch (turn) {
      case 1: tiles = await player.ownedTiles;
      case 2: tiles = await opponent.ownedTiles;
      case 3: tiles = await opponent1.ownedTiles;
      case 4: tiles = await opponent2.ownedTiles;
      default: return null;
    }
    tiles = tiles.map(tile => tile.getCoordVal());
    for (let tile of tiles) {
      for (let array of adjancenyMap) {
        let tempTile = [
          tile[0] + array[0],
          tile[1] + array[1],
          tile[2] + array[2],
        ];
        if (
          tempTile[0] === selectedTile[0] &&
          tempTile[1] === selectedTile[1] &&
          tempTile[2] === selectedTile[2]
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function checkTileOwnership() {
    let selectedTile = [selectedHex.q, selectedHex.r, selectedHex.s];
    let tiles = player.ownedTiles;
    tiles = tiles.map(tile => tile.getCoordVal());
    for (let tile of tiles) {
      if (
        tile[0] === selectedTile[0] &&
        tile[1] === selectedTile[1] &&
        tile[2] === selectedTile[2]
      ) {
        return true;
      }
    }
    return false;
  }

  const adjancenyMap = [
    [0, 0, 0],
    [0, -1, 1],
    [1, -1, 0],
    [1, 0, -1],
    [0, 1, -1],
    [-1, 1, 0],
    [-1, 0, 1],
  ];

  async function purchase() {
    let currentPlayer = await playersTurn();
    let tempPlayer;
    if(turn === 1){
       tempPlayer = new PlayerObject(turn);
    } else{
      tempPlayer = new aiPlayer(turn)
    }
    console.log(selectedItem);
    if (!selectedItem.land) {
      tempPlayer.freeTroops = await currentPlayer.freeTroops + 1;
      sounds[1].play();
      NotificationManager.showSuccessNotification(`Purchase of ${selectedItem.name} successful.`);
    }

    if (await canPurchase()) {
      if (selectedItem.land) {
        const { q, r, s } = selectedHex;
        gameSettings.setBiomeForCoordinates(q, r, s, selectedItem.landNew + await colorTurn());
        sounds[1].play();
        NotificationManager.showSuccessNotification(`Purchase of ${selectedItem.name} successful at coordinates (${q}, ${r}, ${s})`);
        currentPlayer.removeOwnedTile([q,r,s]);
        tempPlayer.ownedTiles = await currentPlayer.ownedTiles.push(new Tile(q, r, s));
        tempPlayer.freeTroops = await currentPlayer.freeTroops;
      } else {
        NotificationManager.showSuccessNotification(`Purchase of ${selectedItem.name} unsuccessful`);
      }

      tempPlayer.playerId = turn;
      tempPlayer.color = await colorTurn();
      tempPlayer.ownedTiles = currentPlayer.ownedTiles;
      tempPlayer.liveStatus = currentPlayer.liveStatus;
      tempPlayer.techPoints = (currentPlayer.getTechPoints - selectedItem.techPoints);
      tempPlayer.foodPoints = (currentPlayer.getFoodPoints - selectedItem.foodPoints);
      tempPlayer.woodPoints = (currentPlayer.getWoodPoints - selectedItem.woodPoints);
      tempPlayer.metalPoints = (currentPlayer.getMetalPoints - selectedItem.metalPoints);

      switch (turn) {
        case 1:
          setPlayer(tempPlayer);
          break;
        case 2:
          setOpponent(tempPlayer);
          break;
        case 3:
          setOpponent1(tempPlayer);
          break;
        case 4:
          setOpponent2(tempPlayer);
          break;
        default:
          break;
      }

      gameSettings.clearClickedHexagon();
      gameSettings.saveSourceOfStore(null);
    }

    close();
  }

  const DisplayData = storeData.storeData.map((info) => (
    <tr key={info.id} onClick={() => handleRowClick(info)}>
      <td><img src={require(`${info.item}`)} width={60} height={60} alt='troop' /></td>
      <td>{info.name}</td>
      <td>{info.techPoints}</td>
      <td>{info.foodPoints}</td>
      <td>{info.woodPoints}</td>
      <td>{info.metalPoints}</td>
    </tr>
  ));

  async function getItemById(id) {
    // Find the item with the matching ID
    const item = storeData.storeData.find(item => item.id === id);
    console.log('Found Item:', item);
    // If the item is found, return it, otherwise return null
    return item || null;
  }

   // Expose the aiPurchase method to be callable from outside
   useImperativeHandle(ref, () => ({
    async aiPurchase(tile, item) {
      setSelectedHex(tile);
      let i = await getItemById(item);
      console.log(i);
      setSelectedItem(i);
      //await purchase();
    }
  }));

  if (phase === 0) {
    return (
      <Modal isOpen={storeModal} onRequestClose={close} contentLabel="Store" className="storeModal">
        <button className="close-btn" onClick={close}>X</button>
        <div className="modal">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Name</th>
                <th>Tech Points</th>
                <th>Food Points</th>
                <th>Wood Points</th>
                <th>Metal Points</th>
              </tr>
            </thead>
            <tbody>
              {DisplayData}
            </tbody>
          </table>
        </div>
      </Modal>
    );
  } else if (phase === 3) {
    return (
      <Modal isOpen={storeModal} onRequestClose={close} contentLabel="Store" className="storeModal" style={customStyles2}>
        <button className="close-btn" onClick={close}>X</button>
        <div className="modal">
          <div>
            <p>Confirm purchase of {selectedItem.name} for {selectedItem.techPoints} Tech Points, {selectedItem.foodPoints} Food Points, {selectedItem.woodPoints} Wood Points, {selectedItem.metalPoints} Metal Points?</p>
            <button onClick={purchase}>Yes</button>
            <button onClick={backToMain}>No</button>
          </div>
        </div>
      </Modal>
    );
  } else {
    return (
      <Modal isOpen={storeModal} onRequestClose={close} contentLabel="Store" className="storeModal" style={customStyles2}>
        <button className="close-btn" onClick={close}>X</button>
        <div className="modal">
          <div>
            <p>{reason}</p>
            <button onClick={backToMain}>Back</button>
          </div>
        </div>
      </Modal>
    );
  }
});
export default Store;
