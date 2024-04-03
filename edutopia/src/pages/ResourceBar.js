import react, {useState, useContext, useEffect} from 'react';
import './ResourceBar.css';
import MetalIcon from './images/sprites/Metal.png';
import TechIcon from './images/sprites/Technology.png';
import FoodIcon from './images/sprites/Food.png';
import WoodIcon from './images/sprites/Wood.png';
import TroopIcon from './images/sprites/Troop_Blue.png';
import { PlayerContext } from './Game';

function ResourceBar(){

    const { player, setPlayer } = useContext(PlayerContext);

    const [tech, setTechPoints] = useState(player.getTechPoints);
    const [food, setFoodPoints] = useState(player.getFoodPoints);
    const [wood, setWoodPoints] = useState(player.getWoodPoints);
    const [metal, setMetalPoints] = useState(player.getMetalPoints);
    const [ownedTroops, setOwnedTroops] = useState(player.getOwnedTroops);

    useEffect(()=>{
        setFoodPoints(player.getFoodPoints);
        setWoodPoints(player.getWoodPoints);
        setTechPoints(player.getTechPoints);
        setMetalPoints(player.getMetalPoints);
        setOwnedTroops(player.getOwnedTroops);
    },[player]);
    // Tech, Food, Wood, Metal

    // TO DO: ADD INFO ICON

    return(
        <div className='ResourceBarContainer'>
            <div className='ResourceContainer'>
                <img src={TechIcon} alt="Tech Icon" />
                <div className='ResourceAmountText'>{tech}</div>
                <div className='ResourceInfoIcon'>ℹ️</div>
                <div className='ResourceInfoText'>Tech Points</div>
            </div>

            <div className='ResourceContainer'>
                <img src={FoodIcon} alt="Food Icon" />
                <div className='ResourceAmountText'>{food}</div>
                <div className='ResourceInfoIcon'>ℹ️</div>
                <div className='ResourceInfoText'>Food Points</div>
            </div>

            <div className='ResourceContainer'>
                <img src={WoodIcon} alt="Wood Icon" />
                <div className='ResourceAmountText'>{wood}</div>
                <div className='ResourceInfoIcon'>ℹ️</div>
                <div className='ResourceInfoText'>Wood Points</div>
            </div>

            <div className='ResourceContainer'>
                <img src={MetalIcon} alt="Metal Icon" />
                <div className='ResourceAmountText'>{metal}</div>
                <div className='ResourceInfoIcon'>ℹ️</div>
                <div className='ResourceInfoText'>Metal Points</div>
            </div>

            <div className='ResourceContainer'>
                <img src={TroopIcon} alt="Troop Icon" />
                <div className='ResourceAmountText'>{ownedTroops}</div>
                <div className='ResourceInfoIcon'>ℹ️</div>
                <div className='ResourceInfoText'>Troop Points</div>
            </div>
        </div>
    );

}

export default ResourceBar