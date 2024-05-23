//This component is responsible for definiting the characteristics of the hexagonal tiles

//q r and s are equivalent to x y and z coordinates
import GameSettings from './GameSettings';
import biomeStats from './biomeStats'; 

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
      this.biome = GameSettings.getBiomeForCoordinates(q, r, s);
      this.troops = 0;

      this.resources = {...biomeStats[this.biome]};
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
  
    // Method to check if the tile is owned by any player
    isOwned() {
        return this.owner !== null;
      }
    
    // Method to set the owner of the tile
    setOwner(player) {
      this.owner = player;
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

      getCoords(){
        return `x: ${this.q}, y: ${this.r}, z: ${this.s}`;
      }
  }

export default Tile;