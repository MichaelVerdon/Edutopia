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
    const { player, setPlayer, opponent, setOpponent, opponent1, setOpponent1, opponent2, setOpponent2, turn, setTurn} = useContext(PlayerContext);
    const [showPopup, setShowPopup] = useState(false);
    const [ selectedHex, setSelectedHex ] = useState(null);
    const { shouldTriggerSaveSelection, triggerSaveSelection } = useContext(PlayerContext);
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
   
    const JsonData = [
      {
          "id": 1,
          "item": "./images/sprites/Troop_Blue.png",
          "name":"1 Troop",
          "techPoints": 5, 
          "foodPoints": 5,
          "woodPoints": 5,
          "metalPoints": 5,
          "land": false,
          "landNeeded": [""],
          "landNew": ""
      },
      {
        "id": 2,
        "item": "./images/sprites/GrasslandWithFarm_Blue.png",
        "name":"Farm",
        "techPoints": 10, 
        "foodPoints": 15,
        "woodPoints": 10,
        "metalPoints": 5,
        "land": true,
        "landNeeded": ["Grassland"],
        "landNew": "GrasslandWithFarm"
      },
      {
        "id": 3,
        "item": "./images/sprites/RockyWithMine_Blue.png",
        "name":"Mine",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 5,
        "metalPoints": 15,
        "land": true,
        "landNeeded": ["Rocky"],
        "landNew": "RockyWithMine"
      },
      {
        "id": 4,
        "item": "./images/sprites/WoodsWithSawmill_Blue.png",
        "name":"Sawmill",
        "techPoints": 10, 
        "foodPoints": 5,
        "woodPoints": 15,
        "metalPoints": 10,
        "land": true,
        "landNeeded": ["Woods"],
        "landNew": "WoodsWithSawmill"
      },
      {
        "id": 5,
        "item": "./images/sprites/Village_Blue.png",
        "name":"Village",
        "techPoints": 15, 
        "foodPoints": 15,
        "woodPoints": 15,
        "metalPoints": 15,
        "land": true,
        "landNeeded": ["GrasslandWithFarm"],
        "landNew": "Village"
      },
      {
        "id": 6,
        "item": "./images/sprites/VillageWithTrainingGrounds_Blue.png",
        "name":"Training Grounds",
        "techPoints": 10, 
        "foodPoints": 15,
        "woodPoints": 15,
        "metalPoints": 10,
        "land": true,
        "landNeeded": ["Village"],
        "landNew": "VillageWithTrainingGrounds"
      },
      {
        "id": 7,
        "item": "./images/sprites/VillageWithPotionShop_Blue.png",
        "name":"Potion Shop",
        "techPoints": 15, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 15,
        "land": true,
        "landNeeded": ["Village"],
        "landNew": "VillageWithPotionShop"
      },
      {
        "id": 8,
        "item": "./images/sprites/VillageWithTrainingGroundsAndPotionShop_Blue.png",
        "name":"Complete village",
        "techPoints": 15, 
        "foodPoints": 15,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true,
        "landNeeded": ["VillageWithPotionShop", "VillageWithTrainingGrounds"],
        "landNew": "VillageWithTrainingGroundsAndPotionShop"
      }
  ];
  

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
    else if (row.land === true){
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

  const handleClosePopup = () => {
    setShowPopup(false);
    setPhase(0);
  };

  const changeSelectedHex = (selectedHex) => {
    setSelectedHex(selectedHex);
    console.log("yup this works too");
  }

  useEffect(() => {
    changeSelectedHex(gameSettings.getClickedHexagon())
    console.log("Selected tile: " + gameSettings.getClickedHexagon())
  })

  useEffect(() => {
    console.log(phase);
    console.log("Selected Hexagon for Store:", gameSettings.getClickedHexagon());
    if (shouldTriggerSaveSelection) {
      saveSelection();
      triggerSaveSelection(false);
    }
  }, [phase, storeModal, selectedHex, shouldTriggerSaveSelection]);

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

  async function purchase(){
    let currentPlayer = await playersTurn();
    let tempPlayer = new PlayerObject(turn);
    if(selectedItem.id===1){
      let troops = await currentPlayer.freeTroops +1;
      tempPlayer.freeTroops = 11;
      
      
    }else if(selectedItem.land){
      const { q, r, s } = gameSettings.getClickedHexagon();
      gameSettings.setBiomeForCoordinates(q,r,s,selectedItem.landNew + await colorTurn());
      NotificationManager.showSuccessNotification(`Purchase of ${selectedItem.name} successful at coordinates (${q}, ${r}, ${s})`);
      tempPlayer.ownedTiles = await currentPlayer.ownedTiles.push([q, r, s]);
      tempPlayer.freeTroops = await currentPlayer.freeTroops;
    }
    else{
      NotificationManager.showSuccessNotification(`Purchase of ${selectedItem.name} unsuccessful`);
      return;
    }
    tempPlayer.playerId = turn;
    tempPlayer.color = await colorTurn();
    tempPlayer.ownedTiles = currentPlayer.ownedTiles;
    tempPlayer.liveStatus = currentPlayer.liveStatus;
    tempPlayer.techPoints = (currentPlayer.getTechPoints - selectedItem.techPoints);
    tempPlayer.foodPoints = (currentPlayer.getFoodPoints - selectedItem.foodPoints);
    tempPlayer.woodPoints = (currentPlayer.getWoodPoints - selectedItem.woodPoints);
    tempPlayer.metalPoints = (currentPlayer.getMetalPoints - selectedItem.metalPoints); 
    
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

    close();
  }

  async function saveSelection(){
    let q = selectedHex.q;
    let r = selectedHex.r;
    let s = selectedHex.s;
    let clickedHexagonBiome = gameSettings.getBiomeForCoordinates(q, r, s);
    console.log(clickedHexagonBiome);

    let ableToPurchase = false;
    for(let i = 0; i<selectedItem.landNeeded.length; i++){
      if(clickedHexagonBiome === selectedItem.landNeeded + "_Unclaimed"){
        ableToPurchase = true;
      }if(clickedHexagonBiome === selectedItem.landNeeded + "_Blue" || clickedHexagonBiome === selectedItem.landNeeded + "_Yellow" || clickedHexagonBiome === selectedItem.landNeeded + "_Cyan" || clickedHexagonBiome === selectedItem.landNeeded + "_Pink"){
        ableToPurchase = true;
      }
    }
    let currentPlayer = await playersTurn();
    if (ableToPurchase){
      if(currentPlayer.getTechPoints < selectedItem.techPoints || currentPlayer.getFoodPoints < selectedItem.foodPoints || currentPlayer.getWoodPoints < selectedItem.woodPoints || currentPlayer.getMetalPoints < selectedItem.metalPoints){
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