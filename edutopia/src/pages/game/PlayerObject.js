import Tile from './Tile';

export default class PlayerObject{

    constructor(playerId) {
        this.playerId = playerId;
        this.liveStatus = true;
        this._techPoints = 0; // Points
        this._foodPoints = 0;
        this._woodPoints = 0;
        this._metalPoints = 0;
        this._troopAmount = 10;
        // A list of tile objects
        this._ownedTiles = [];
    }

    // Return Player ID For checks
    get playerID(){return this.player_id;}

    // Get Methods for resource points
    get techPoints(){return this._techPoints;}
    get foodPoints(){return this._foodPoints;}
    get woodPoints(){return this._woodPoints;}
    get metalPoints(){return this._metalPoints;}
    get troopAmount(){return this._troopAmount;}

    get ownedTiles(){return this._ownedTiles;}

    // Checks for eliminating players
    get liveStatus(){return this.alive}

    // Set Methods for resource points
    set techPoints(setPoints){this._techPoints = setPoints;}
    set foodPoints(setPoints){this._foodPoints = setPoints;}
    set woodPoints(setPoints){this._woodPoints = setPoints;}
    set metalPoints(setPoints){this._metalPoints = setPoints;}
    set troopAmount(setAmount){this._troopAmount = setAmount;}

    set ownedTiles(ownedTiles){this._ownedTiles = ownedTiles;}

    set liveStatus(status){this.alive = status;}

    // Methods for checking resources generated per turn

} 
