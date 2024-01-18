import GameSettings from './GameSettings'; 
import plains from './plains.png';
import mountain from './mountain.png';

export class Tile {
  constructor(x, y) {
    this.coordinates = { x, y};
    this.biome = GameSettings.getBiomeForCoordinates(x, y);
    this.owner = null;
    this.resources = {
        techPoints: 0,
        foodPoints: 0,
        woodPoints: 0,
        metalPoints: 0,
      };
  }

  getBackgroundImageForBiome() {
    switch (this.biome) {
      case "Plains":
        return plains;
      case "Mountain":
        return mountain; 
      default:
        return "none"; // Default case
    }
  }
    

  
    // Method to check if the tile is owned by any player
    isOwned() {
      return this.owner !== null;
    }
  
    // Method to set the owner of the tile
    setOwner(player) {
      this.owner = player;
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

    getTileInfo() {
        const coords = `Coordinates: (${this.coordinates.x}, ${this.coordinates.y} `;
        const biomeInfo = this.biome ? `Biome: ${this.biome}` : "Biome: None";
        return `${coords}, ${biomeInfo}`;
      }
      
  }
  