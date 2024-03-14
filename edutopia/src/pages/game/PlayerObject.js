import Tile from './Tile';

class PlayerObject{

    constructor(playerId) {
        this.playerId = playerId;
        this.liveStatus = true;
        this.techPoints = 100; // Points
        this.foodPoints = 100;
        this.woodPoints = 100;
        this.metalPoints = 100;
        // A list of tile objects
        this.ownedTiles = [];
        this.freeTroops = 10;
    }

    // Return Player ID For checks
    get getPlayerID(){return this.player_id;}

    // Get Methods for resource points
    get getTechPoints(){return this.techPoints;}
    get getFoodPoints(){return this.foodPoints;}
    get getWoodPoints(){return this.woodPoints;}
    get getMetalPoints(){return this.metalPoints;}

    get getOwnedTiles(){return this.ownedTiles;}
    get getOwnedTroops(){return this.freeTroops;}

    // Checks for eliminating players
    get getLiveStatus(){return this.alive}

    // Set Methods for resource points
    set setTechPoints(setPoints){this.techPoints = setPoints;}
    set setFoodPoints(setPoints){this.foodPoints = setPoints;}
    set setWoodPoints(setPoints){this.woodPoints = setPoints;}
    set setMetalPoints(setPoints){this.metalPoints = setPoints;}

    set setOwnedTiles(ownedTiles){this.ownedTiles = ownedTiles;}
    set setFreeTroops(freeTroops){this.freeTroops = freeTroops;}

    set setLiveStatus(status){this.alive = status;}

    // Method to calculate resources generated per turn based on owned tiles
    calculateResourcesPerTurn() {
        let techPointsPerTurn = 0;
        let foodPointsPerTurn = 0;
        let woodPointsPerTurn = 0;
        let metalPointsPerTurn = 0;

        // Iterate over owned tiles and calculate resources per turn
        for (const tile of this.ownedTiles) {
            techPointsPerTurn += tile.getTechPoints();
            foodPointsPerTurn += tile.getFoodPoints();
            woodPointsPerTurn += tile.getWoodPoints();
            metalPointsPerTurn += tile.getMetalPoints();
        }

        // Update player resources
        this.techPoints += techPointsPerTurn;
        this.foodPoints += foodPointsPerTurn;
        this.woodPoints += woodPointsPerTurn;
        this.metalPoints += metalPointsPerTurn;
    }
}

export default PlayerObject;