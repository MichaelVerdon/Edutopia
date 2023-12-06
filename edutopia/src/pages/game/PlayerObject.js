class PlayerObject{

    // Points
    techPoints = 0;
    foodPoints = 0;
    woodPoints = 0;
    metalPoints = 0;

    // Tuple co-ordinates for tiles owned by a player which can be edited
    ownedTiles = [];

    constructor(player_id){
        this.player_id = player_id;
    }

    // Return Player ID For checks
    get playerID(){return this.player_id;}

    // Get Methods for resource points
    get techPoints(){return this.techPoints;}
    get foodPoints(){return this.foodPoints;}
    get woodPoints(){return this.woodPoints;}
    get metalPoints(){return this.metalPoints;}

    get ownedTiles(){return this.ownedTiles;}

    // Set Methods for resource points
    set techPoints(setPoints){this.techPoints = setPoints;}
    set foodPoints(setPoints){this.foodPoints = setPoints;}
    set woodPoints(setPoints){this.woodPoints = setPoints;}
    set metalPoints(setPoints){this.metalPoints = setPoints;}

    set ownedTiles(ownedTiles){this.ownedTiles = ownedTiles;}

    // Methods for checking resources generated per turn

    // 
}