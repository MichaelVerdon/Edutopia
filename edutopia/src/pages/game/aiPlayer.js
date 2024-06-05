import PlayerObject from "./PlayerObject";
import GameSettings from "./GameSettings";
import Board from "./Board";

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

    async getOwnedTile(){
        // returns random owned tiles
        const ownedTileCount = this.ownedTiles.length
        const randomTileIndex = Math.floor(Math.random() * ownedTileCount);
        let randomTile = await  this.ownedTiles[randomTileIndex];
        return [randomTile];
    }

    async getClaimTile(){
        // able to pick a random tile based off adjacent tiles using this.tiles
        // Then apply logic to give resources
        let adjTiles = await this.checkAdjacentTiles();
        const randomTileIndex = Math.floor(Math.random() * adjTiles.length);
        let randomTile = await adjTiles[randomTileIndex];
        // Will need to bulletproof this later (e.t.c cases where a random tile has no adjacent ones)
        return randomTile;
    }

    async checkAdjacentTiles(){
        let touchingTiles = [];
        for(let i=0; i<this.ownedTiles.length; i++){
            let q = this.ownedTiles[i].q;
            let r = this.ownedTiles[i].r;
            let s = this.ownedTiles[i].s;

            if(await GameSettings.getBiomeForCoordinates(q-1,r+1,s).split("_").pop() !== "Unclaimed" && await GameSettings.getBiomeForCoordinates(q-1,r+1,s).split("_")[0] !== "Water"){
                touchingTiles.push([q-1,r+1,s]);
            }
            if(await GameSettings.getBiomeForCoordinates(q,r+1,s-1).split("_").pop() !== "Unclaimed" && await GameSettings.getBiomeForCoordinates(q,r+1,s-1).split("_")[0] !== "Water"){
                touchingTiles.push([q,r+1,s-1]);
            }
            if(await GameSettings.getBiomeForCoordinates(q-1,r,s+1).split("_").pop() !== "Unclaimed" && await GameSettings.getBiomeForCoordinates(q-1,r,s+1).split("_")[0] !== "Water"){
                touchingTiles.push([q-1,r,s+1]);
            }
            if(await GameSettings.getBiomeForCoordinates(q+1,r,s-1).split("_").pop() !== "Unclaimed" && await GameSettings.getBiomeForCoordinates(q+1,r,s-1).split("_")[0] !== "Water"){
                touchingTiles.push([q+1,r,s-1]);
            }
            if(await GameSettings.getBiomeForCoordinates(q,r-1,s+1).split("_").pop() !== "Unclaimed" && await GameSettings.getBiomeForCoordinates(q,r-1,s+1).split("_")[0] !== "Water"){
                touchingTiles.push([q,r-1,s+1]);
            }
        }
        return touchingTiles;
    }

    async shopping(){
        //BUY TILE
        let TileToUpdate;
        const option = Math.floor(Math.random() * 2);
        //randomly decide if buy new or upgrade
        if (option === 1){
            TileToUpdate = await this.getOwnedTile();
            //decide on item
            let biome = await GameSettings.getBiomeForCoordinates(TileToUpdate.q, TileToUpdate.r, TileToUpdate.s);
            biome = biome.charAt(0);
            let item;
            if(biome === "G"){
                if(await biome.split("_")[0] === "_Grassland"){
                    item = 5;
                }else if(await biome.split("_")[0] === "_GrasslandWithFarm"){
                    item = 8;
                }   
            }else if(biome === "R"){
                item = 6;
            }else if(biome === "W"){
                item = 7;
            }if(biome === "V"){
                if(await biome.split("_")[0] === "_Village"){
                    item = 9;
                }else if(await biome.split("_")[0] === "_VillageWithTrainingGrounds"){
                    item = 11;
                }   
            }
            return([TileToUpdate.q, TileToUpdate.r, TileToUpdate.s], item);
        }else if (option ===0){
            TileToUpdate = await this.getClaimTile();
            let biome = await GameSettings.getBiomeForCoordinates(TileToUpdate[0], TileToUpdate[1], TileToUpdate[2]);
            biome = biome.charAt(0);
            let item;
            if(biome === "G"){
                item = 2;
            }else if(biome === "R"){
                item = 3;
            }else if(biome === "W"){
                item = 4;
            }
            return(TileToUpdate, item);
        }else if (option ===2){
            //buy troop
            return ("", 1)
        }

    }

    async allocateTroopsHex(){
        let allocatableHexs = [];
        let troopsAvailable = this.freeTroops;
        //assign a troop per tile
        for(let i=0; i<this.ownedTiles.length; i++){
            if(await this.ownedTiles[i].troops === 0){
                allocatableHexs.push(this.ownedTiles[i]);
            }
            if (i === troopsAvailable){
                break;
            }
        }
        return allocatableHexs;
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