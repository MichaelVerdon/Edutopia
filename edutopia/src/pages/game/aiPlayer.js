import PlayerObject from "./PlayerObject";
import GameSettings from "./GameSettings";

// Inherit from PlayerObject Class so they can have all functionalities of player class.
// You will be able to treat this as a PlayerObject class and use same funcs and vars.
class aiPlayer extends PlayerObject{

    constructor(playerId, randomTile, playerColor) {
        super(playerId, randomTile, playerColor);
        this.difficulty = this.setDifficulty();
    }

    // Difficulty is set between 1 and 4 which will be used as a multiplier for
    // probability or answering correctly. e.t.c difficulty of 2 means 2 * 0.25 = 0.5 probability of answering correctly
    setDifficulty(){
        return Math.floor(Math.random() * 4) + 1;
    }

    answerQuestion(){
        const probability = this.difficulty * 0.25; // Probability of getting answer right
        const randomValue = Math.random(); // Generate a random number between 0 and 1
        // Check if the probability is greater which means the answer is correct
        if (randomValue <= probability) {
            this.techPoints = this.techPoints + 5; // Add five tech points for a successful answer.
        }
    }

    getClaimTile(){
        // Will eventually be able to pick a random tile based off adjacent tiles using this.tiles
        // Then apply logic to give resources
        const ownedTileCount = this.ownedTiles.length
        const randomTileIndex = Math.floor(Math.random() * ownedTileCount);
        let randomTile = this.ownedTiles[randomTileIndex];
        // Will need to bulletproof this later (e.t.c cases where a random tile has no adjacent ones)
        return randomTile;
    }

    checkAdjacentTiles(tile){
        let vacantTiles = [];
    }

    shopping(){
        //THIS IS JUST OPTIONAL IDEA
        //if you can buy a troop and still have enough resources left to buy a tile

        //buying a tile
        //check unclaimed tiles around your tiles

        //randomly select one tile

        //buy the tile

    }

    async battleOthers(){
        //check if any of the ai players tiles are touching another players tile
        // get the list: [[tileOwned, tileTouching],[...]]
        let touchingTiles = [];
        for(let i=0; i<this.ownedTiles.length; i++){
            let q = this.ownedTiles[i].q;
            let r = this.ownedTiles[i].r;
            let s = this.ownedTiles[i].s;

            if(await GameSettings.getBiomeForCoordinates(q-1,r+1,s).split("_").pop() !== "Unclaimed"){
                touchingTiles.push([[q,r,s], [q-1,r+1,s]]);
            }else if(await GameSettings.getBiomeForCoordinates(q,r+1,s-1).split("_").pop() !== "Unclaimed"){
                touchingTiles.push([[q,r,s], [q,r+1,s-1]]);
            }else if(await GameSettings.getBiomeForCoordinates(q-1,r,s+1).split("_").pop() !== "Unclaimed"){
                touchingTiles.push([[q,r,s], [q-1,r,s+1]]);
            }else if(await GameSettings.getBiomeForCoordinates(q+1,r,s-1).split("_").pop() !== "Unclaimed"){
                touchingTiles.push([[q,r,s], [q+1,r,s-1]]);
            }else if(await GameSettings.getBiomeForCoordinates(q,r-1,s+1).split("_").pop() !== "Unclaimed"){
                touchingTiles.push([[q,r,s], [q,r-1,s+1]]);
            }
        }

        //randomly select one of the tile combinations
        let randomTilesIndex = Math.floor(Math.random() * touchingTiles.length);

        //the attacking and the attacked tile returned
        return touchingTiles[randomTilesIndex];
    }
}

export default aiPlayer;