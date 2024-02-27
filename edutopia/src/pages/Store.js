import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root'); 

function Store ({storeModal, close, player, setPlayer}) {

    const [phase, setPhase] = useState(0);
    const [reason, setReason] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
   
    const JsonData = [
      {
          "id": 1,
          "item": "./images/sprites/Troop_Blue.png",
          "name":"1 Troop",
          "techPoints": 10, 
          "foodPoints": 10,
          "woodPoints": 10,
          "metalPoints": 10,
          "land": false
      },
      {
        "id": 2,
        "item": "./images/sprites/GrasslandAndFarm_Blue.png",
        "name":"Farm",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true
      },
      {
        "id": 3,
        "item": "./images/sprites/RockyWithMine_Blue.png",
        "name":"Mine",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true
      },
      {
        "id": 4,
        "item": "./images/sprites/WoodsWithSawmill_Blue.png",
        "name":"Sawmill",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true
      },
      {
        "id": 5,
        "item": "./images/sprites/VillageWithTrainingGrounds_Blue.png",
        "name":"Training Grounds",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true
      },
      {
        "id": 6,
        "item": "./images/sprites/VillageWithPotionShop_Blue.png",
        "name":"Potion Shop",
        "techPoints": 10, 
        "foodPoints": 10,
        "woodPoints": 10,
        "metalPoints": 10,
        "land": true
      }
  ];
  

  function handleRowClick(row) {
    setSelectedItem(row)
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
      console.log(phase);}
    }else{
      //asks u if u r down to buy, if yes gives u your purchase takes away your money
      setPhase(3);
      console.log(phase);
    }
  } 

  useEffect(() => {
    console.log(phase);
  }, [phase]);

  const backToMain = () => {
    setPhase(0);
  }

  function purchase(){
    if(selectedItem.id===1){
      //give him trooper
    } //add giving tiles

    player.techPoints = (player.getTechPoints - selectedItem.techPoints);
    player.foodPoints = (player.getFoodPoints - selectedItem.foodPoints);
    player.woodPoints = (player.getWoodPoints - selectedItem.woodPoints);
    player.metalPoints = (player.getMetalPoints - selectedItem.metalPoints); 
    setPlayer(player)
    close();
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
            <button onClick={close} className="btn">Close</button>
          </div>
        </Modal>
    );
  }else if(phase ===1){
    return(
      <Modal isOpen={storeModal} onRequestClose={close} contentLabel="Store" className="storeModal">
      <div className="modalDiv">
        <h1>You can't buy this because {reason}</h1>
        <button onClick={backToMain} className="btn">Go back</button>
        <button onClick={close} className="btn">Close</button>
      </div>
      </Modal>
    );

  }else if(phase ===2){
    return(
      
        <div className="modalDiv">
          <h1>Pick a land</h1>
          <button onClick={close} className="btn">Close</button>
        </div>
      
    );

  }else if(phase ===3){
    return(
      <Modal isOpen={storeModal} onRequestClose={close} contentLabel="Store" className="storeModal">
        <div className="modalDiv">
          <h1>Are you sure you want to purchase this?</h1>
          <button onClick={purchase} className="btn">Yes</button> 
          <button onClick={close} className="btn">No</button>
        </div>
      </Modal>
    );
  }else{
    return(
      <Modal isOpen={storeModal} onRequestClose={close} contentLabel="Store" className="storeModal">
        <div className="modalDiv">
            <p>error</p>
            <button className="btn" onClick={close}>close</button>
        </div>
      </Modal>
    );
  }
}
export default Store;