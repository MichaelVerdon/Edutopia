// GameSettings.js
import gapData from './gapCoordinates.json';

const biomes = ["patternWoods", "patternRocky", "patternGrassLand", "patternPotShop"];

const gapCoordinates = gapData.gapCoordinates;
const GameSettings = {
  customBiomes: {}, // Initialize customBiomes as an empty object

  getBiomeForCoordinates: (q, r, s) => {
    const key = `${q},${r},${s}`;
    // Check if the coordinates match any gap coordinates
    if (gapCoordinates.some(coord => coord.q === q && coord.r === r && coord.s === s)) {
      // Return a specific biome for gap coordinates
      return "patternWater"; // You can change this to the biome you want for gap coordinates
    } else {
      // Otherwise, use the original logic for determining biome based on coordinates
      if (q < 20 && r < 20 && s >= -4) {
        return "patternPotShop";
      } else if (q < 8 && r < 5 && s < -4) {
        return "patternRocky";
      } else {
        return "patternGrassLand"; // Default case
      }
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

  selectTileAndChangeBiome: (q, r, s, biome) => {
    // Trigger the onSelect function of the InteractiveHexagon component
    window.dispatchEvent(new CustomEvent('selectTile', { detail: { q, r, s } }));
  
    // Change the biome of the selected tile
    GameSettings.setBiomeForCoordinates(q, r, s, biome);
    console.log(`Biome changed to ${biome} for tile (${q}, ${r}, ${s})`);
    console.log(`Current biome for tile (${q}, ${r}, ${s}): ${GameSettings.getBiomeForCoordinates(q, r, s)}`);
  }
};

export default GameSettings;
window.GameSettings = GameSettings;