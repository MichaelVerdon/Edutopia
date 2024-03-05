import react, {useState} from 'react';

function ResourceBar({techPoints, foodPoints, woodPoints, metalPoints}){

    const [tech, setTechPoints] = useState(techPoints);
    const [food, setFoodPoints] = useState(foodPoints);
    const [wood, setWoodPoints] = useState(woodPoints);
    const [metal, setMetalPoints] = useState(metalPoints);
    // Tech, Food, Wood, Metal

    return(
        <div>Testing</div>
    );

}

export default ResourceBar