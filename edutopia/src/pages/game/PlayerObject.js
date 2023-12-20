import Tile from './Tile';

class PlayerObject{

    constructor(playerId) {
        this.playerId = playerId;
        this.liveStatus = true;
        this._techPoints = 0; // Points
        this._foodPoints = 0;
        this._woodPoints = 0;
        this._metalPoints = 0;
        // A list of tile objects
        this._ownedTiles = [];
    }

    // Return Player ID For checks
    get playerID(){return this.player_id;}

    // Get Methods for resource points
    get techPoints(){return this.techPoints;}
    get foodPoints(){return this.foodPoints;}
    get woodPoints(){return this.woodPoints;}
    get metalPoints(){return this.metalPoints;}

    get ownedTiles(){return this.ownedTiles;}

    // Checks for eliminating players
    get liveStatus(){return this.alive}

    // Set Methods for resource points
    set techPoints(setPoints){this.techPoints = setPoints;}
    set foodPoints(setPoints){this.foodPoints = setPoints;}
    set woodPoints(setPoints){this.woodPoints = setPoints;}
    set metalPoints(setPoints){this.metalPoints = setPoints;}

    set ownedTiles(ownedTiles){this.ownedTiles = ownedTiles;}

    set liveStatus(status){this.alive = status;}

    // Methods for checking resources generated per turn

    // 
}