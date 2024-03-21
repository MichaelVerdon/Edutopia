// GameSettings.js
import gapData from './gapCoordinates.json';
import images from './imageImports';
import hexagonData from './hexagonData.json';


const biomes = Object.keys(images);

const gapCoordinates = gapData.gapCoordinates;
const GameSettings = {
  customBiomes: {},

  getBiomeForCoordinates: (q, r, s) => {
    if (gapCoordinates.some(coord => coord.q === q && coord.r === r && coord.s === s)) {
      return "Water";
    } else {
      const hexagon = hexagonData.hexagons.find(hex => hex.q === q && hex.r === r && hex.s === s);
      return hexagon ? hexagon.biome : "Grassland_Unclaimed"; // Default to Grassland_Unclaimed if not found
    }
    
  },
    


  

  setBiome: (q, r, s, biome) => {
    const key = `${q},${r},${s}`;
    GameSettings.customBiomes[key] = biome;
  },

  subscribers: [],

  subscribeToBiomeChanges: (callback) => {
    // Subscribe to changes in the biome
    GameSettings.subscribers.push(callback);
  },

  unsubscribeFromBiomeChanges: (callback) => {
    // Unsubscribe from changes in the biome
    GameSettings.subscribers = GameSettings.subscribers.filter(subscriber => subscriber !== callback);
  },

  notifyBiomeChanges: () => {
    // Notify all subscribers of biome changes
    GameSettings.subscribers.forEach(subscriber => subscriber());
  },

  setBiomeForCoordinates: (q, r, s, biome) => {
    const key = `${q},${r},${s}`;
    GameSettings.customBiomes[key] = biome;
    // Notify subscribers of biome changes
    GameSettings.notifyBiomeChanges();
  },

};

export default GameSettings;
window.GameSettings = GameSettings;