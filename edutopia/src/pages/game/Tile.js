import GameSettings from './GameSettings';

class Tile {
  constructor(q, r, s) {
    this.q = q;
    this.r = r;
    this.s = s;
    this.owner = null;
    this.resources = {
      techPoints: 0,
      foodPoints: 0,
      woodPoints: 0,
      metalPoints: 0,
    };
    this.biome = "Grassland_Unclaimed";
    this.troops = 0;
  }

  isOwned() {
    return this.owner !== null;
  }

  setOwner(player) {
    this.owner = player;
  }

  setBiome(biome) {
    this.biome = biome;
  }

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

  getTileInfo() {
    const coords = `Coordinates: (x: ${this.q}, y: ${this.r}, z: ${this.s})`;
    const biomeInfo = this.biome ? `Biome: ${this.biome}` : "Biome: None";

    const resourcesText = Object.entries(this.resources)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const resourcesInfo = `Resources: ${resourcesText}`;
    const troopsInfo = `Troops: ${this.troops}`;

    return `${coords}, ${biomeInfo}, ${resourcesInfo}, ${troopsInfo}`;
  }

  getImage() {
    return GameSettings.images[this.biome];
  }

  calculateResourceYield() {
    switch (this.biome) {
      case "Grassland_Unclaimed":
      case "Grassland_Blue":
      case "Grassland_Cyan":
      case "Grassland_Pink":
      case "Grassland_Yellow":
        this.setFoodPoints(2);
        this.setWoodPoints(1);
        break;
      case "Woods_Unclaimed":
        this.setWoodPoints(3);
        break;
      case "Rocky_Unclaimed":
        this.setMetalPoints(2);
        break;
      case "Water":
        this.setFoodPoints(1);
        break;
      default:
        this.setFoodPoints(1);
        this.setWoodPoints(1);
    }
  }
}

export default Tile;
