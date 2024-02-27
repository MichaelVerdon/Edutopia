// GameSettings.js

const GameSettings = {
  customBiomes: {},

  getBiomeForCoordinates: (q, r, s) => {
    
    if (q < 20 && r < 20 && s >= -4) {
      return "patternWoods";
    } else if (q < 8 && r < 5 && s < -4) {
      return "patternRocky";
    } else {
      return "patternGrassLand"; // Default case
    }
  },

  setBiome: (q, r, s, biome) => {
    const key = `${q},${r},${s}`;
    GameSettings.customBiomes[key] = biome;
  }
};

export default GameSettings;
