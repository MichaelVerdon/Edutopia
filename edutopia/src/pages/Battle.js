import React, { useState, useEffect } from 'react';
import Question from './Question'; 
import Game from './Game';
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

function Battle ({player, questionJson, close, isOpen}) {
    const [phase, setPhase] = useState(0);//phase of pop up that is returned
    const [battleTroopsAmount, setBattleTroopsAmount] = useState(0);
    const [winner, setWinner] = useState(0);

    //const of fake choices of player 2, num of troops and question answer and time
    const [player2Troops, setPlayer2Troops] = useState(5);
    const answer = 3;
    const leftoverTime = 15;

    //question modal
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal);
    };

    if(modal) {
        document.body.classList.add('questionModal')
    } else {
        document.body.classList.remove('questionModal')
    }

    //increases phase by 1
    const changePhase = () => {
        setPhase(phase + 1)
      };

    //decides if question phase needed

    //land selecting

    //saving the number of troops plus change phase
    const setTroopsForBattle = async() => {
        const inputElement = await document.getElementById("troopsForBattle");
        const troopsValue = await parseInt(inputElement.value, 10); 
        await setBattleTroopsAmount(troopsValue);
        //console.log(battleTroopsAmount);
        //battle();
    }

    useEffect(() => {
        if(battleTroopsAmount != 0){
            if(battleTroopsAmount===player2Troops){
                setPhase(3);
                toggleModal();
            }else if(battleTroopsAmount < parseInt(player2Troops)){ //if one is higher ->that player wins the hexagon, none of his troops die, the losers troops all dead
                player.troopAmount = (player.troopAmount - battleTroopsAmount);
                setWinner(2);
                setPhase(4);
            }else{
                setPlayer2Troops(0); //TODO: change when second player is added to the code
                setWinner(1);
                setPhase(4)
            }
            
        }
      }, [battleTroopsAmount]);

    //comparing nums of troops selected
    const battle = () => {
        console.log(battleTroopsAmount);
        if(battleTroopsAmount===player2Troops){
            setPhase(3);
            toggleModal();
        }else if(battleTroopsAmount < parseInt(player2Troops)){ //if one is higher ->that player wins the hexagon, none of his troops die, the losers troops all dead
            player.troopAmount = (player.troopAmount - battleTroopsAmount);
            setWinner(2);
            setPhase(4);
        }else{
            setPlayer2Troops(0); //TODO: change when second player is added to the code
            setWinner(1);
            setPhase(4)
        }
    }

    //comparing question answers
    const decideWinner = (timePlayer1)=>{
        if(questionJson[answer] === questionJson[7]){
            if(parseInt(timePlayer1)>parseInt(leftoverTime)){
                setWinner(1);
                setPhase(4);
            }else{
                setWinner(2);
                setPhase(4);
            }
        }else{
            setWinner(1);
            setPhase(4);
        }
    }

    const stepper = (btn)=>{

    }
    
    //winning changes to variables, TODO: add changes to player 2 values when he exits
    useEffect(() => {
        if(phase===4 && winner===0){
            setWinner(2);
            
        }
      }, [phase]);
   
    if(phase === 0){ //asking if u want to fight
        return(
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle" className='battleModal'>
                <div className='basicDiv'>
                <h1>Get ready to battle</h1>
                <h2>Do you want to battle?</h2>
                <button className='btn' onClick={changePhase}>yes</button>
                <button className='btn' onClick={close}>no</button>
                </div>
            </Modal>
        );
    }
    else if(phase === 1){ //select land to fight over, TODO need catalins part for this
        return(
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle"  className='battleModal'>
                <div className='basicDiv'>
                <h1>Get ready to battle</h1>
                <h2>Select a land to start the battle on</h2>
                <button className='btn' onClick={changePhase}>land</button>
                <button className='btn' onClick={close}>close</button>
                </div>
            </Modal>
        );
    }
    else if(phase === 2){ //select troops, TODO add saving the number of battle troops
        return(
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle"  className='battleModal'>
                <div className='basicDiv'>
                    <h1>Get ready to battle</h1>
                    <h2>Select the number of troops</h2>
                    <p>Number of troops that can be used: {player.troopAmount}</p>
                    <label htmlFor="troopsForBattle">How many troops you want to send to battle: </label>
                        <input type="number" id="troopsForBattle" name="troopsForBattle" min="0" max={parseInt(player.troopAmount)}></input>
                    <button className='btn' type="button" onClick={setTroopsForBattle}>Input</button> 
                    <button className='btn' onClick={close}>close</button>
                </div>
            </Modal>
        );
    } 
    else if(phase === 3){ //question, TODO add solution for when the number of troops isnt equal
        return(
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle"  className='battleModal'>
                <div className='basicDiv'>
                <button onClick={changePhase}>no need for question</button>
                {modal && (
                    <div id="questionModal" class="modal">
                    <div className="overlay">
                        <Question questionJson={questionJson} close={toggleModal} scoreAdd={decideWinner}></Question>
                        </div>
                    </div>
                )}
                <button className='btn' onClick={close}>close</button>
                </div>
            </Modal>
        );
    }
    else if(phase === 4){ //winner announced, TODO add code that will log this win, but also might need catalins part, player id is also not a var yet
        return(
            <Modal isOpen={isOpen} onRequestClose={close} contentLabel="Battle" className='battleModal'>
                <div className='basicDiv'>
                <h1>Player {winner} wins the land</h1>
                <button className='btn' onClick={close}>close</button>
                </div>
            </Modal>
        );
    }
    else{ //empty
        return(
            <div>
                <p>error</p>
                <button onClick={close}>close</button>
            </div>
        );
    }
}
export default Battle;