// GameSettings.js
import gapData from './gapCoordinates.json';
import images from './imageImports';
import hexagonData from './hexagonData.json';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();
const biomes = Object.keys(images);

const gapCoordinates = gapData.gapCoordinates;
const GameSettings = {
  customBiomes: {},

  getBiomeForCoordinates: (q, r, s) => {
    if (gapCoordinates.some(coord => coord.q === q && coord.r === r && coord.s === s)) {
      return "Water";
    } else {

      const scale = 0.1;
      const noiseValue = noise2D(q * scale, r * scale);

      if (noiseValue < -0.5) {
        return "Water";
      } else if (noiseValue < -0.1) {
        return "Grassland_Unclaimed";
      } else if (noiseValue < 0.2) {
        return "Rocky_Unclaimed";
      } else if (noiseValue < 0.5) {
        return "Woods_Unclaimed";
      } else {
        const hexagon = hexagonData.hexagons.find(hex => hex.q === q && hex.r === r && hex.s === s);
      return hexagon ? hexagon.biome : "Grassland_Unclaimed"; //Default to Grassland_Unclaimed if not found
      }

    }
  },
    


  

  setBiome: (q, r, s, biome) => {
    const key = `${q},${r},${s}`;
    GameSettings.customBiomes[key] = biome;
  },

  subscribers: [],

  subscribeToBiomeChanges: (callback) => {
    
    GameSettings.subscribers.push(callback);
  },

  unsubscribeFromBiomeChanges: (callback) => {
    
    GameSettings.subscribers = GameSettings.subscribers.filter(subscriber => subscriber !== callback);
  },

  notifyBiomeChanges: () => {
    
    GameSettings.subscribers.forEach(subscriber => subscriber());
  },

  setBiomeForCoordinates: (q, r, s, biome) => {
    const key = `${q},${r},${s}`;
    GameSettings.customBiomes[key] = biome;
    
    GameSettings.notifyBiomeChanges();
  },

  saveClickedHexagon: (q, r, s) => {
    GameSettings.clickedHexagon = { q, r, s };
  },

};

export default GameSettings;
window.GameSettings = GameSettings;