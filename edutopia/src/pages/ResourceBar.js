import react, {useState} from 'react';
import './ResourceBar.css';
import MetalIcon from './images/sprites/Metal.png';
import TechIcon from './images/sprites/Technology.png';
import FoodIcon from './images/sprites/Food.png';
import WoodIcon from './images/sprites/Wood.png';

function ResourceBar({techPoints = 0, foodPoints = 0, woodPoints = 0, metalPoints = 0}){

    const [tech, setTechPoints] = useState(techPoints);
    const [food, setFoodPoints] = useState(foodPoints);
    const [wood, setWoodPoints] = useState(woodPoints);
    const [metal, setMetalPoints] = useState(metalPoints);
    // Tech, Food, Wood, Metal

    // TO DO: ADD INFO ICON

    return(
        <div className='ResourceBarContainer'>
            <div className='ResourceContainer'>
                <img src={TechIcon} alt="Tech Icon" />
                <div>{tech}</div>
            </div>

            <div className='ResourceContainer'>
                <img src={FoodIcon} alt="Food Icon" />
                <div>{food}</div>
            </div>

            <div className='ResourceContainer'>
                <img src={WoodIcon} alt="Wood Icon" />
                <div>{wood}</div>
            </div>

            <div className='ResourceContainer'>
                <img src={MetalIcon} alt="Metal Icon" />
                <div>{metal}</div>
            </div>
        </div>
    );

}

export default ResourceBar