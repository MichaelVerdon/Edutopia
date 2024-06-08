import GameSettings from './GameSettings';
import biomeStats from './biomeStats';

class Tile {
  constructor(q, r, s, owner = null) {
    this.q = q;
    this.r = r;
    this.s = s;
    this.owner = owner;
    this.biome = owner ? this.getBiomeBasedOnOwner(owner) : GameSettings.getBiomeForCoordinates(q, r, s);
    this.resources = {
      techPoints: 0,
      foodPoints: 0,
      woodPoints: 0,
      metalPoints: 0,
    };
    this.biome = GameSettings.getBiomeForCoordinates(q, r, s);
    this.troops = 0;
    this.resources = { ...biomeStats[this.biome.replace(/\_.*/, '')] };
  }

  // Method to update the biome and resources based on purchase
  updateTile(biome, resources, troops) {
    if (biome) this.biome = biome;
    this.resources.techPoints += resources.techPoints || 0;
    this.resources.foodPoints += resources.foodPoints || 0;
    this.resources.woodPoints += resources.woodPoints || 0;
    this.resources.metalPoints += resources.metalPoints || 0;
    this.troops += troops || 0;
  }

  // Add to setOwner method to update the biome based on the player color
  setOwner(owner) {
    this.owner = owner;
    if (!this.biome.includes('_')) {
      // Only set biome if it has not been explicitly set
      this.biome = this.getBiomeBasedOnOwner(owner);
    }
  }

  // Method to check if the tile is owned by any player
  isOwned() {
    return this.owner !== null;
  }

  addTroops(number) {
    this.troops += number;
  }

  // Method to set the biome of the tile
  setBiome(biome) {
    this.biome = biome;
  }

  // Methods to set resource points
  setFoodPoints(amount) {
    this.resources.foodPoints = amount;
  }

  setWoodPoints(amount) {
    this.resources.woodPoints = amount;
  }

  setMetalPoints(amount) {
    this.resources.metalPoints = amount;
  }

  setTroops(amount) {
    this.troops = amount;
  }

  // Getter methods for resource points
  getTechPoints() {
    return this.resources.techPoints;
  }

  getFoodPoints() {
    return this.resources.foodPoints;
  }

  getWoodPoints() {
    return this.resources.woodPoints;
  }

  getMetalPoints() {
    return this.resources.metalPoints;
  }

  getTroops() {
    return this.troops;
  }

  getBiomeBasedOnOwner(owner) {
    switch (owner) {
      case 1:
        return "Grassland_Blue";
      case 2:
        return "Grassland_Pink";
      case 3:
        return "Grassland_Cyan";
      case 4:
        return "Grassland_Yellow";
      default:
        return "Grassland_Unclaimed";
    }
  }

  getTileInfo() {
    const coords = `Coordinates: (x: ${this.q}, y: ${this.r}, z: ${this.s})`;
    const biomeInfo = this.biome ? `Biome: ${this.biome}` : "Biome: None";

    // Create the resources text string from the resources object
    const resourcesText = Object.entries(this.resources)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    // Now resourcesText can be used in the template literal
    const resourcesInfo = `Resources: ${resourcesText}`;
    const troopsInfo = `Troops: ${this.troops}`;

    return `${coords}, ${biomeInfo}, ${resourcesInfo}, ${troopsInfo}`;
  }

  getCoords() {
    return `x: ${this.q}, y: ${this.r}, z: ${this.s}`;
  }

  getCoordVal() {
    return [this.q, this.r, this.s];
  }
}

export default Tile;
