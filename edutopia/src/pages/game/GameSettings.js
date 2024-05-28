import gapData from './gapCoordinates.json';
import images from './imageImports';
import hexagonData from './hexagonData.json';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();
const biomes = Object.keys(images);


const gapCoordinates = gapData.gapCoordinates;
const GameSettings = {
  customBiomes: {},
  clickedHexagon: null,
  sourceOfStore: null,

  getBiomeForCoordinates: (q, r, s) => {
    // Check for a custom biome first
    const customBiomeKey = `${q},${r},${s}`;
    if (GameSettings.customBiomes.hasOwnProperty(customBiomeKey)) {
      return GameSettings.customBiomes[customBiomeKey];
    }
  
    // Check for water tiles in gapCoordinates
    if (gapCoordinates.some(coord => coord.q === q && coord.r === r && coord.s === s)) {
      return "Water";
    }
  
    // Calculate biome based on noise
    const scale = 0.1;
    const noiseValue = noise2D(q * scale, r * scale);
  
    let biome;
    if (noiseValue < -0.1) {
      biome = "Grassland_Unclaimed";
    } else if (noiseValue < 0.2) {
      biome = "Rocky_Unclaimed";
    } else if (noiseValue < 0.5) {
      biome = "Woods_Unclaimed";
    } else {
      // Lookup in hexagon data, default to Grassland_Unclaimed if not found
      const hexagon = hexagonData.hexagons.find(hex => hex.q === q && hex.r === r && hex.s === s);
      biome = hexagon ? hexagon.biome : "Grassland_Unclaimed";
    }
  
    // Update the custom biomes object to ensure the biome change is persistent
    GameSettings.customBiomes[customBiomeKey] = biome;
    return biome;
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

  saveClickedHexagon: (q, r, s, source) => {
    if (GameSettings.clickedHexagon && GameSettings.clickedHexagon.q === q && GameSettings.clickedHexagon.r === r && GameSettings.clickedHexagon.s === s &&GameSettings.clickedHexagon.source === source) {
      GameSettings.clickedHexagon = null; 
    } else {
      GameSettings.clickedHexagon = { q, r, s};
    }
  
    GameSettings.notifyBiomeChanges(); 
  },

  getClickedHexagon: () => {
    return GameSettings.clickedHexagon;
  },

  clearClickedHexagon: () => {
    GameSettings.clickedHexagon = null;
    GameSettings.notifyBiomeChanges(); 
  },

  saveSourceOfStore(source) {
    GameSettings.sourceOfStore = source;
  },
  
  getSourceOfStore() {
    return GameSettings.sourceOfStore;
  },

  clearSourceOfStore() {
    GameSettings.sourceOfStore = null;
  },

  getClickedHexagonTroops() {
    return 10;
  },

  areTilesAdjacent: (q1, r1, s1, q2, r2, s2) => {
    const deltaQ = q2 - q1;
    const deltaR = r2 - r1;
    const deltaS = s2 - s1;

    // Tiles are adjacent if they are one step away in any of the hexagon directions
    
    const adjacent = 
      (Math.abs(deltaQ) === 1 && deltaR === 0 && deltaS === -1) ||
      (Math.abs(deltaR) === 1 && deltaQ === 0 && deltaS === -1) ||
      (Math.abs(deltaS) === 1 && deltaQ === -1 && deltaR === 0) ||
      (Math.abs(deltaQ) === 1 && deltaR === -1 && deltaS === 0) ||
      (Math.abs(deltaR) === 1 && deltaQ === -1 && deltaS === 0) ||
      (Math.abs(deltaS) === 1 && deltaQ === 0 && deltaR === -1);
    
    return adjacent;
  }
};

export default GameSettings;
window.GameSettings = GameSettings;