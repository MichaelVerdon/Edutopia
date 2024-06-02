import gapData from './gapCoordinates.json';
import images from './imageImports';
import hexagonData from './hexagonData.json';
import { createNoise2D } from 'simplex-noise';
import Tile from './Tile';
import sounds from './sounds/soundImports';
const noise2D = createNoise2D();
const biomes = Object.keys(images);

const gapCoordinates = gapData.gapCoordinates;
const LOCAL_STORAGE_KEY = "gameCustomBiomes";

const GameSettings = {
  customBiomes: {},
  clickedHexagon: null,
  sourceOfStore: null,

  // Load custom biomes from local storage
  loadCustomBiomes: () => {
    const savedBiomes = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedBiomes) {
      GameSettings.customBiomes = JSON.parse(savedBiomes);
    }
  },

  // Save custom biomes to local storage
  saveCustomBiomes: () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(GameSettings.customBiomes));
  },

  getBiomeForCoordinates: (q, r, s) => {
    const customBiomeKey = `${q},${r},${s}`;
    if (GameSettings.customBiomes.hasOwnProperty(customBiomeKey)) {
      return GameSettings.customBiomes[customBiomeKey];
    }
    if (gapCoordinates.some(coord => coord.q === q && coord.r === r && coord.s === s)) {
      return "Water";
    }
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
      const hexagon = hexagonData.hexagons.find(hex => hex.q === q && hex.r === r && hex.s === s);
      biome = hexagon ? hexagon.biome : "Grassland_Unclaimed";
    }
    GameSettings.customBiomes[customBiomeKey] = biome;
    GameSettings.saveCustomBiomes(); // Save to local storage whenever a new biome is generated
    return biome;
  },

  setBiome: (q, r, s, biome) => {
    const key = `${q},${r},${s}`;
    GameSettings.customBiomes[key] = biome;
    GameSettings.saveCustomBiomes(); // Save to local storage whenever a biome is set
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
    GameSettings.saveCustomBiomes(); // Save to local storage whenever a biome is set
  },

  saveClickedHexagon: (q, r, s, source) => {
    if (GameSettings.clickedHexagon && GameSettings.clickedHexagon.q === q && GameSettings.clickedHexagon.r === r && GameSettings.clickedHexagon.s === s && GameSettings.clickedHexagon.source === source) {
      GameSettings.clickedHexagon = null;
    } else {
      GameSettings.clickedHexagon = { q, r, s };
    }
    GameSettings.notifyBiomeChanges();
  },

  getClickedHexagon: () => {
    sounds[3].play();
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

    return (
      (Math.abs(deltaQ) === 1 && deltaR === 0 && deltaS === -1) ||
      (Math.abs(deltaR) === 1 && deltaQ === 0 && deltaS === -1) ||
      (Math.abs(deltaS) === 1 && deltaQ === -1 && deltaR === 0) ||
      (Math.abs(deltaQ) === 1 && deltaR === -1 && deltaS === 0) ||
      (Math.abs(deltaR) === 1 && deltaQ === -1 && deltaS === 0) ||
      (Math.abs(deltaS) === 1 && deltaQ === 0 && deltaR === -1)
    );
  },

  allocateTroops: (hexData) => {
    const tile = new Tile(hexData.q, hexData.r, hexData.s);
    tile.addTroops(1);
    this.setState({ selectedHex: { ...hexData, tile } });
    console.log(`Allocated 1 troop to tile at coordinates (${hexData.q}, ${hexData.r}, ${hexData.s}).`);
  }
};

export default GameSettings;
window.GameSettings = GameSettings;

// Load custom biomes when the script is loaded
//GameSettings.loadCustomBiomes();
