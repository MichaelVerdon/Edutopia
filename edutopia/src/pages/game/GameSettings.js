import gapData from "./gapCoordinates.json";
import hexagonData from "./hexagonData.json";
import { createNoise2D } from "simplex-noise";
import Grassland_Blue from '../images/sprites/Grassland_Blue.png';
import Grassland_Cyan from '../images/sprites/Grassland_Cyan.png';
import Grassland_Pink from '../images/sprites/Grassland_Pink.png';
import Grassland_Unclaimed from '../images/sprites/Grassland_Unclaimed.png';
import Grassland_Yellow from '../images/sprites/Grassland_Yellow.png';

const noise2D = createNoise2D();

const images = {
  Grassland_Blue,
  Grassland_Cyan,
  Grassland_Pink,
  Grassland_Unclaimed,
  Grassland_Yellow,
};

//const biomes = Object.keys(images);
const gapCoordinates = gapData.gapCoordinates;
const GameSettings = {
  images,
  customBiomes: {},
  clickedHexagon: null,
  sourceOfStore: null,

  getBiomeForCoordinates: (q, r, s) => {
    if (
      gapCoordinates.some(
        (coord) => coord.q === q && coord.r === r && coord.s === s
      )
    ) {
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
        const hexagon = hexagonData.hexagons.find(
          (hex) => hex.q === q && hex.r === r && hex.s === s
        );
        return hexagon ? hexagon.biome : "Grassland_Unclaimed"; // Default to Grassland_Unclaimed if not found
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
    GameSettings.subscribers = GameSettings.subscribers.filter(
      (subscriber) => subscriber !== callback
    );
  },

  notifyBiomeChanges: () => {
    GameSettings.subscribers.forEach((subscriber) => subscriber());
  },

  setBiomeForCoordinates: (q, r, s, biome) => {
    const key = `${q},${r},${s}`;
    GameSettings.customBiomes[key] = biome;
    GameSettings.notifyBiomeChanges();
  },

  saveClickedHexagon: (q, r, s, source) => {
    if (
      GameSettings.clickedHexagon &&
      GameSettings.clickedHexagon.q === q &&
      GameSettings.clickedHexagon.r === r &&
      GameSettings.clickedHexagon.s === s &&
      GameSettings.clickedHexagon.source === source
    ) {
      GameSettings.clickedHexagon = null;
    } else {
      GameSettings.clickedHexagon = { q, r, s };
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
  },

  
};

export const isTileWithinBoard = (q, r, s, boardSize) => {
  // Define the bounds of the board (hexagonal board in this example)
  const minBound = -boardSize;
  const maxBound = boardSize;
  return q >= minBound && q <= maxBound && r >= minBound && r <= maxBound && s >= minBound && s <= maxBound;
};


export default GameSettings;
window.GameSettings = GameSettings;
