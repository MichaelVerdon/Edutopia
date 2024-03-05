import react, {useState} from 'react';
import './ResourceBar.css';

function ResourceBar({techPoints, foodPoints, woodPoints, metalPoints}){

    const [tech, setTechPoints] = useState(techPoints);
    const [food, setFoodPoints] = useState(foodPoints);
    const [wood, setWoodPoints] = useState(woodPoints);
    const [metal, setMetalPoints] = useState(metalPoints);
    // Tech, Food, Wood, Metal

    return(
        <div className='ResourceBarContainer'>
            <div className='ResourceContainer'></div>
            <div className='ResourceContainer'></div>
            <div className='ResourceContainer'></div>
            <div className='ResourceContainer'></div>
        </div>
    );

}

export default ResourceBar