import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { PlayerContext } from './Game';
import PlayerObject from './game/PlayerObject';
import gameSettings from './game/GameSettings';
import './Store.css';
import NotificationManager from '../pages/game/NotificationManager';
import storeData from '../pages/game/storeItemsData.json';
import Tile from './game/Tile';
Modal.setAppElement('#root'); 


function Store ({storeModal, close}) {

    const [phase, setPhase] = useState(0);
    const [reason, setReason] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const { player, setPlayer, opponent, setOpponent, opponent1, setOpponent1, opponent2, setOpponent2, turn, setTurn} = useContext(PlayerContext);
    const [showPopup, setShowPopup] = useState(false);
    const [ selectedHex, setSelectedHex ] = useState(null);
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
      }
    };
    const customStyles2 = {
      content: {
        padding: '15px',
        transform: 'translate(-50%, -25%)',
        width: '100%',
        height: 'auto',
        
      }
    };

  async function handleRowClick(row) {
    setSelectedItem(row);
    setShowPopup(true);
    let currentPlayer = await playersTurn();
    //checks if u have enough resources, if not tells u u cant buy
    if(currentPlayer.getTechPoints < row.techPoints || currentPlayer.getFoodPoints < row.foodPoints || currentPlayer.getWoodPoints < row.woodPoints || currentPlayer.getMetalPoints < row.metalPoints){
      setReason("you don't have enough resources");
      setSelectedItem(null)
      setPhase(1);
    }
    else if (row.land === true || row.land === false){
      //if yes asks u to pick a land
        if (source === 'MiniMenu') {
          setPhase(3);
          console.log('----------------------- Source:', source);
        }
        else {setPhase(2);}
        console.log(source);

      //console.log(phase);
    
    }else{
      //asks u if u r down to buy, if yes gives u your purchase takes away your money
      setPhase(3);
      //console.log(phase);
    }
  }

  const changeSelectedHex = (selectedHex) => {
    setSelectedHex(selectedHex);
    console.log("yup this works too");
  }

  useEffect(() => {
    changeSelectedHex(gameSettings.getClickedHexagon())
    console.log("Selected tile: " + gameSettings.getClickedHexagon())
  })

  const backToMain = () => {
    setPhase(0);
  }

  const playersTurn = async () => {
    if (turn === 1){
      return (player);
    } else if (turn === 2){
      return (opponent);
    }else if (turn === 3){
      return (opponent1);
    }else{
      return (opponent2);
    }
  }

  const colorTurn = async () => {
    if (turn === 1){
      return ('_Blue');
    } else if (turn === 2){
      return ('_Pink');
    }else if (turn === 3){
      return ('_Cyan');
    }else{
      return ('_Yellow');
    }
  }

  function canPurchase(){
    try{
    if(gameSettings.getBiomeForCoordinates(selectedHex) !== "Water"){
      if(checkTileAdjancency() || checkTileOwnership()){
        console.log("Tile is adjacent to owned tile");
        return true;
      }
      else{
        NotificationManager.showSuccessNotification("Please pick a tile adjacent to owned tiles or buy on an owned tile!");
        console.log("Tile is not adjacent to owned tile or owned");
        return false;
      }
    }
  }
    catch{
      NotificationManager.showSuccessNotification("Something went wrong, please try again!");
      console.log("Something went wrong");
      return false;
    }
  }

  function checkTileAdjancency(){
    let selectedTile = [selectedHex.q, selectedHex.r, selectedHex.s];
    let tiles = player.ownedTiles;
    tiles = tiles.map(tile => tile.getCoordVal());
    for(let tile of tiles){
      for (let array of adjancenyMap) {
        let tempTile = [
          tile[0] + array[0],
          tile[1] + array[1],
          tile[2] + array[2]
        ];
        if(
          tempTile [0] === selectedTile[0] &&
          tempTile [1] === selectedTile[1] &&
          tempTile [2] === selectedTile[2]
        ){ //Check matching coordinates to check for tile adjanceny to owned tile.
          return true;
        }
      }
    }
    return false;
  }

  function checkTileOwnership(){
    let selectedTile = [selectedHex.q, selectedHex.r, selectedHex.s];
    let tiles = player.ownedTiles;
    tiles = tiles.map(tile => tile.getCoordVal());
    for(let tile of tiles){
      if(
        tile[0] === selectedTile[0] &&
        tile[1] === selectedTile[1] &&
        tile[2] === selectedTile[2]
      ){
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
    [-1, 0, 1]
  ]

  async function purchase(){
    let currentPlayer = await playersTurn();
    let tempPlayer = new PlayerObject(turn);

    if(await canPurchase()){
      if(!selectedItem.land){
        console.log("troop selected");
        tempPlayer.freeTroops = await currentPlayer.freeTroops + 1;
        NotificationManager.showSuccessNotification(`Purchase of ${selectedItem.name} successful.`);
        console.log("troop bought");
        console.log(tempPlayer.freeTroops + "troops owned");

      } else if(selectedItem.land){
        console.log("land selected");
        const { q, r, s } = selectedHex;
        gameSettings.setBiomeForCoordinates(q,r,s,selectedItem.landNew + await colorTurn());
        NotificationManager.showSuccessNotification(`Purchase of ${selectedItem.name} successful at coordinates (${q}, ${r}, ${s})`);
        tempPlayer.ownedTiles = await currentPlayer.ownedTiles.push([q, r, s]);
        tempPlayer.freeTroops = await currentPlayer.freeTroops;

      } else{
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
    setPlayer(tempPlayer);

    if (turn === 1){
      setPlayer(tempPlayer);
    } else if (turn === 2){
      setOpponent(tempPlayer);
    }else if (turn === 3){
      setOpponent1(tempPlayer);
    }else{
      setOpponent2(tempPlayer);
    }
    gameSettings.clearClickedHexagon();
    gameSettings.saveSourceOfStore(null);
  }

    close();
  }

  const DisplayData = storeData.storeData.map((info) => (
    <tr key={info.id} onClick={() => handleRowClick(info)}>
      <td><img src={require(`${ info.item }`)} width={60} height={60} alt ='troop'/></td>
      <td>{info.name}</td>
      <td>{info.techPoints}</td>
      <td>{info.foodPoints}</td>
      <td>{info.woodPoints}</td>
      <td>{info.metalPoints}</td>
    </tr>
  ));

  if(phase === 0){
    
    return(
        <Modal isOpen={storeModal} onRequestClose={close} contentLabel="Store" className="storeModal">
          <button className="close-btn" onClick={close}>X</button> {/* Top right X close button */}
          <div  className="modalDiv">
            <h1>Store</h1>
            <table class="table table-striped" >
                <thead>
                    <tr>
                    <th>Item</th>
                    <th>Name</th>
                    <th>Tech Price</th>
                    <th>Food Price</th>
                    <th>Wood Price</th>
                    <th>Metal Price</th>
                    </tr>
                </thead>
                <tbody>
                    {DisplayData}
                </tbody>
            </table>
          </div>
        </Modal>
        
    );
  } else if (phase === 1) {
    return (
      <Modal isOpen={storeModal} onRequestClose={close} contentLabel="Store" className="storeModal" style={customStyles2}>
        <div className="phase-popup">
            <h1>You can't buy this because {reason}</h1>
            <button onClick={backToMain} className="btn">Go back</button>
            <button className="close-btn-small" onClick={close}>X</button> {/* Top right X close button */}
        </div>
        </Modal>
    );
} else if (phase === 2) {
  return (
    <Modal isOpen={storeModal} onRequestClose={close} contentLabel="Store" className="storeModal" style={customStyles}>
      <div className="phase-popup">
          <h1>Are you sure you want to purchase this?</h1>
          <button onClick={purchase} className="btn">Yes</button>
          <button className="close-btn-small" onClick={close}>X</button> {/* Top right X close button */}
      </div>
      </Modal>
  );
}

}
export default Store;