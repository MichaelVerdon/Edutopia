import Tile from './Tile';

class PlayerObject{

    constructor(playerId, randomTile, playerColor) {
        this.playerId = playerId;
        this.liveStatus = true;
        this.color = playerColor;
        this.techPoints = 100; // Points
        this.foodPoints = 100;
        this.woodPoints = 100;
        this.metalPoints = 100;
        // A list of tile objects
        this.ownedTiles = []; // We need to assign a random starting tile
        this.freeTroops = 10;
    }

    // Return Player ID For checks
    get getPlayerID(){return this.player_id;}

    // Get color of the player
    get getColor(){return this.color;}

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
    set setTechPoints(setPoints) { this.techPoints = setPoints; }
    set setFoodPoints(setPoints) { this.foodPoints = setPoints; }
    set setWoodPoints(setPoints) { this.woodPoints = setPoints; }
    set setMetalPoints(setPoints) { this.metalPoints = setPoints; }
    set setFreeTroops(freeTroops) { this.freeTroops = freeTroops; }
    set setOwnedTiles(setTile) { this.ownedTiles = setTile; }

    set addOwnedTiles(ownedTile){
        let notInArr = true;
        for(let i = 0; i<this.ownedTiles.length; i++){
            if (this.ownedTiles[i]===ownedTile){
                notInArr = false;
                break;
            }
        }
        if(notInArr){this.ownedTiles.push(ownedTile);}}

    set removeOwnedTiles(removeTile){
        for(let i = 0; i<this.ownedTiles.length; i++){
            if (this.ownedTiles[i]===removeTile){
                this.ownedTiles.splice(i,1);
                break;
            }
        }
    }

    OwnsTileCheck(tile){
        for(let i = 0; i<this.ownedTiles.length; i++){
            console.log(this.ownedTiles[i][0]);
            console.log(tile[0]);
            if (this.ownedTiles[i][0]===tile[0] && this.ownedTiles[i][1]===tile[1] && this.ownedTiles[i][2]===tile[2]){
                return(true);
            }
        }
        return(false);
    }

    set setLiveStatus(status){this.alive = status;}
    set setColor(playerColor){this.color = playerColor;}

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
    
    // Method to buy upgrades for tiles in here (for now)

    //

    // Check if player has enough resources
    hasEnoughResources(cost) {
        return (
            this.techPoints >= cost.techPoints &&
            this.foodPoints >= cost.foodPoints &&
            this.woodPoints >= cost.woodPoints &&
            this.metalPoints >= cost.metalPoints
        );
    }

    // Deduct resource cost 
    deductResources(cost) {
        this.techPoints -= cost.techPoints;
        this.foodPoints -= cost.foodPoints;
        this.woodPoints -= cost.woodPoints;
        this.metalPoints -= cost.metalPoints;
    }

}

export default PlayerObject;