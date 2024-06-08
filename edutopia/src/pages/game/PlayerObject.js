import GameSettings from './GameSettings';
import Tile from './Tile';

class PlayerObject {
    constructor(playerId, randomTile, playerColor) {
        this.playerId = playerId;
        this.liveStatus = true;
        this.color = playerColor;
        this.techPoints = 10;
        this.foodPoints = 100;
        this.woodPoints = 100;
        this.metalPoints = 100;
        this.ownedTiles = [randomTile]; // Assign a random starting tile
        if (randomTile) {
            randomTile.setBiome(`Grassland_${playerColor}`);
            randomTile.setOwner(playerId);
        } else {
            console.error('randomTile is undefined. Player cannot be initialized correctly.');
        }
        this.freeTroops = 10;
    }

    // Player ID for checks
    get getPlayerID() {
        return this.playerId;
    }

    // Color of the player
    get getColor() {
        return this.color;
    }

    // Resource points
    get getTechPoints() {
        return this.techPoints;
    }

    get getFoodPoints() {
        return this.foodPoints;
    }

    get getWoodPoints() {
        return this.woodPoints;
    }

    get getMetalPoints() {
        return this.metalPoints;
    }

    get getOwnedTiles() {
        return this.ownedTiles;
    }

    get getFreeTroops() {
        return this.freeTroops;
    }

    // Check for eliminating players
    get getLiveStatus() {
        return this.liveStatus;
    }

    // Setters for resource points
    set setTechPoints(points) {
        this.techPoints = points;
    }

    set setFoodPoints(points) {
        this.foodPoints = points;
    }

    set setWoodPoints(points) {
        this.woodPoints = points;
    }

    set setMetalPoints(points) {
        this.metalPoints = points;
    }

    set setFreeTroops(troops) {
        this.freeTroops = troops;
    }

    set setOwnedTiles(tiles) {
        this.ownedTiles = tiles;
    }

    set setLiveStatus(status) {
        this.liveStatus = status;
    }

    set setColor(color) {
        this.color = color;
    }

    // Adding and removing tiles
    async addOwnedTile(ownedTile, newTileColor) {
        if (!this.OwnsTileCheck(ownedTile)) {
            let oldBiome = await GameSettings.getBiomeForCoordinates(
                ownedTile.q,
                ownedTile.r,
                ownedTile.s
            );
            let newBiome = oldBiome.split('_')[0] + `_${newTileColor}`;
            GameSettings.setBiome(ownedTile.q, ownedTile.r, ownedTile.s, newBiome);
            ownedTile.setOwner(this.playerId);
            ownedTile.setBiome(newBiome);
            this.ownedTiles.push(ownedTile);
            GameSettings.notifyBiomeChanges(); // Ensure the board knows about the biome change
        }
    }

    removeOwnedTile(removeTile) {
        this.ownedTiles = this.ownedTiles.filter(tile => 
            tile.q !== removeTile.q || tile.r !== removeTile.r || tile.s !== removeTile.s);
    }

    OwnsTileCheck(tile) {
        return this.ownedTiles.some(t => t.q === tile.q && t.r === tile.r && t.s === tile.s);
    }

    calculateResourcesPerTurn() {
        let techPointsPerTurn = 0;
        let foodPointsPerTurn = 0;
        let woodPointsPerTurn = 0;
        let metalPointsPerTurn = 0;

        for (const tile of this.ownedTiles) {
            techPointsPerTurn += tile.getTechPoints();
            foodPointsPerTurn += tile.getFoodPoints();
            woodPointsPerTurn += tile.getWoodPoints();
            metalPointsPerTurn += tile.getMetalPoints();
        }

        this.techPoints += techPointsPerTurn;
        this.foodPoints += foodPointsPerTurn;
        this.woodPoints += woodPointsPerTurn;
        this.metalPoints += metalPointsPerTurn;
    }

    hasEnoughResources(cost) {
        return (
            this.techPoints >= cost.techPoints &&
            this.foodPoints >= cost.foodPoints &&
            this.woodPoints >= cost.woodPoints &&
            this.metalPoints >= cost.metalPoints
        );
    }

    deductResources(cost) {
        this.techPoints -= cost.techPoints;
        this.foodPoints -= cost.foodPoints;
        this.woodPoints -= cost.woodPoints;
        this.metalPoints -= cost.metalPoints;
    }
}

export default PlayerObject;
