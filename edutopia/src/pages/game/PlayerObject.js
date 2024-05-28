import Tile from "./Tile";

class PlayerObject {
  constructor(playerId, tile, playerColor) {
    this.playerId = playerId;
    this.liveStatus = true;
    this.color = playerColor;
    this.techPoints = 10;
    this.foodPoints = 100;
    this.woodPoints = 100;
    this.metalPoints = 100;
    this.ownedTiles = [tile]; // A list of tile objects
    this.freeTroops = 10;

    if (tile) {
      tile.setBiome(`Grassland_${playerColor}`); // Set player's start tile to their grassland color
      tile.setOwner(playerId);
      tile.calculateResourceYield(); // Calculate initial resources
    }
  }

  getPlayerID() {
    return this.playerId;
  }

  get getColor() {
    return this.color;
  }

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

  get getOwnedTroops() {
    return this.freeTroops;
  }

  get getLiveStatus() {
    return this.liveStatus;
  }

  set setTechPoints(setPoints) {
    this.techPoints = setPoints;
  }

  set setFoodPoints(setPoints) {
    this.foodPoints = setPoints;
  }

  set setWoodPoints(setPoints) {
    this.woodPoints = setPoints;
  }

  set setMetalPoints(setPoints) {
    this.metalPoints = setPoints;
  }

  set setFreeTroops(freeTroops) {
    this.freeTroops = freeTroops;
  }

  set setOwnedTiles(setTile) {
    this.ownedTiles = setTile;
  }

  set setLiveStatus(status) {
    this.liveStatus = status;
  }

  set setColor(playerColor) {
    this.color = playerColor;
  }

  addOwnedTile(tile) {
    tile.setOwner(this.playerId);
    tile.calculateResourceYield();
    this.ownedTiles.push(tile);
    console.log(`Player ${this.playerId} claimed a tile at (${tile.q}, ${tile.r}, ${tile.s})`);
    console.log(`Player ${this.playerId} info:`, this);
  }

  removeOwnedTile(tile) {
    this.ownedTiles = this.ownedTiles.filter((t) => t !== tile);
  }

  ownsTile(tile) {
    return this.ownedTiles.some(
      (ownedTile) => ownedTile.q === tile.q && ownedTile.r === tile.r && ownedTile.s === tile.s
    );
  }

  isTileAdjacent(tile) {
    const adjacentOffsets = [
  { q: 1, r: -1, s: 0 },
  { q: 1, r: 0, s: -1 },
  { q: 0, r: 1, s: -1 },
  { q: -1, r: 1, s: 0 },
  { q: -1, r: 0, s: 1 },
  { q: 0, r: -1, s: 1 },
  ];
  return this.ownedTiles.some((ownedTile) =>
  adjacentOffsets.some(
    (offset) =>
      ownedTile.q + offset.q === tile.q &&
      ownedTile.r + offset.r === tile.r &&
      ownedTile.s + offset.s === tile.s
  )
  );
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
// Path: edutopia/src/pages/game/Hexagon.js