class Tile {
    constructor(x, y, z) {
      this.coordinates = { x, y, z };
      this.owner = null; // Player object or null if unowned
      this.biome = null; // Biome type (e.g., forest, desert)
      this.resources = {
        techPoints: 0,
        foodPoints: 0,
        woodPoints: 0,
        metalPoints: 0,
      };
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
  }
  
