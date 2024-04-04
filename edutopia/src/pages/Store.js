import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { PlayerContext } from './Game';
import PlayerObject from './game/PlayerObject';
import gameSettings from './game/GameSettings';
import './Store.css';
import NotificationManager from '../pages/game/NotificationManager';
Modal.setAppElement('#root'); 


function Store ({storeModal, close}) {

    const [phase, setPhase] = useState(0);
    const [reason, setReason] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const { player, setPlayer } = useContext(PlayerContext);
    const [showPopup, setShowPopup] = useState(false);
    const { selectedHex, setSelectedHex } = useContext(PlayerContext);
    const { shouldTriggerSaveSelection, triggerSaveSelection } = useContext(PlayerContext);
    const sourceOfStore = gameSettings.getSourceOfStore();

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
   
    const JsonData = [
      {
          "id": 1,
          "item": "./images/sprites/Troop_Blue.png",
          "name":"1 Troop",
          "techPoints": 10, 
          "foodPoints": 10,
          "woodPoints": 10,
          "metalPoints": 10,
          "land": false,
          "landNeeded": "",
          "landNew": "GrasslandWithFarm"
      },
      {
        "id": 2,
        "item": "./images/sprites/GrasslandWithFarm_Blue.png",
        "name":"Farm",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true,
        "landNeeded": "Grassland",
        "landNew": "GrasslandWithFarm"
      },
      {
        "id": 3,
        "item": "./images/sprites/RockyWithMine_Blue.png",
        "name":"Mine",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true,
        "landNeeded": "Rocky",
        "landNew": "RockyWithMine"
      },
      {
        "id": 4,
        "item": "./images/sprites/WoodsWithSawmill_Blue.png",
        "name":"Sawmill",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true,
        "landNeeded": "Woods",
        "landNew": "WoodsWithSawmill"
      },
      {
        "id": 5,
        "item": "./images/sprites/VillageWithTrainingGrounds_Blue.png",
        "name":"Training Grounds",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true,
        "landNeeded": "Village",
        "landNew": "VillageWithTrainingGrounds"
      },
      {
        "id": 6,
        "item": "./images/sprites/VillageWithPotionShop_Blue.png",
        "name":"Potion Shop",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true,
        "landNeeded": "Village",
        "landNew": "GVillageWithPotionShop"
      },
      {
        "id": 7,
        "item": "./images/sprites/VillageWithTrainingGroundsAndPotionShop_Blue.png",
        "name":"Potion Shop",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true,
        "landNeeded": ["VillageWithPotionShop", "VillageWithTrainingGrounds"],
        "landNew": "VillageWithTrainingGroundsAndPotionShop"
      }
  ];
  

  function handleRowClick(row) {
    setSelectedItem(row);
    setShowPopup(true);
    //checks if u have enough resources, if not tells u u cant buy
    if(player.getTechPoints < row.techPoints || player.getFoodPoints < row.foodPoints || player.getWoodPoints < row.woodPoints || player.getMetalPoints < row.metalPoints){
      setReason("you don't have enough resources");
      setSelectedItem(null)
      setPhase(1);
    }
    else if (row.land === true){
      
      //checks if u have that sort of land, if not tells u u cant buy
      if(false){
        setReason("you don't have the kind of land needed");
        setPhase(1);
      }else{
      //if yes asks u to pick a land
      setPhase(2);
      //console.log(phase);
    }
    }else{
      //asks u if u r down to buy, if yes gives u your purchase takes away your money
      setPhase(3);
      //console.log(phase);
    }
  } 

  const handleClosePopup = () => {
    setShowPopup(false);
    setPhase(0);
  };

  

  useEffect(() => {
    console.log(phase);
    console.log("Selected Hexagon for Store:", selectedHex);
    if (shouldTriggerSaveSelection) {
      saveSelection();
      triggerSaveSelection(false);
    }
  }, [phase, storeModal, selectedHex, shouldTriggerSaveSelection]);

  const backToMain = () => {
    setPhase(0);
  }

  function purchase(){
    let tempPlayer = new PlayerObject(player.getPlayerID);
    if(selectedItem.id===1){
      tempPlayer.freeTroops = player.freeTroops +1;
    }else{
      tempPlayer.freeTroops = player.freeTroops;
    }
    if(selectedItem.land){
      //TODO: add for different colors
      const { q, r, s } = gameSettings.getClickedHexagon();
      gameSettings.setBiomeForCoordinates(q,r,s,selectedItem.landNew + "_Blue");
      NotificationManager.showSuccessNotification(`Purchase of ${selectedItem.name} successful at coordinates (${q}, ${r}, ${s})`);
    }
    else{
      NotificationManager.showSuccessNotification(`Purchase of ${selectedItem.name} successful`);
    }
    tempPlayer.ownedTiles = player.ownedTiles;
    tempPlayer.liveStatus = player.liveStatus;
    tempPlayer.techPoints = (player.getTechPoints - selectedItem.techPoints);
    tempPlayer.foodPoints = (player.getFoodPoints - selectedItem.foodPoints);
    tempPlayer.woodPoints = (player.getWoodPoints - selectedItem.woodPoints);
    tempPlayer.metalPoints = (player.getMetalPoints - selectedItem.metalPoints); 
    setPlayer(tempPlayer)


    close();
  }

  function saveSelection(){
    const { q, r, s } = gameSettings.getClickedHexagon();
    const clickedHexagonBiome = gameSettings.getBiomeForCoordinates(q, r, s);

    //TODO: add checking for if the player owns the tile not just _Unclaimed

    if (clickedHexagonBiome === selectedItem.landNeeded + "_Unclaimed") {
      if(player.getTechPoints < selectedItem.techPoints || player.getFoodPoints < selectedItem.foodPoints || player.getWoodPoints < selectedItem.woodPoints || player.getMetalPoints < selectedItem.metalPoints){
        setReason("you don't have enough resources");
        setSelectedItem(null)
        setPhase(1);
        gameSettings.saveSourceOfStore(null);
      }else{
        setPhase(3);
        gameSettings.saveSourceOfStore(null);
      }  
    } else {
      setReason("you don't own the correct land for this purchase or you selected an incorrect land");
      setPhase(1);
      gameSettings.saveSourceOfStore(null);
    }
    
  }



  const DisplayData = JsonData.map((info) => (
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
    gameSettings.saveSourceOfStore('HUD');
    return(
        <Modal 
          isOpen={storeModal} 
          onRequestClose={close} 
          contentLabel="Store" 
          className="storeModal"
          >
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
            <h1>Pick a land</h1>
            <button onClick={saveSelection} className="btn">Save selection</button>
            <button className="close-btn-small" onClick={close}>X</button> {/* Top right X close button */}
        </div>
        </Modal>
    );
} else if (phase === 3) {
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