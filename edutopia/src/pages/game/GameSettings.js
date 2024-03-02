// GameSettings.js
const biomes = ["patternWoods", "patternRocky", "patternGrassLand"];

const GameSettings = {
  customBiomes: {},

  getBiomeForCoordinates: (q, r, s) => {
    const key = `${q},${r},${s}`;
    if (GameSettings.customBiomes[key]) {
      // If a custom biome is set for the coordinates, return it
      return GameSettings.customBiomes[key];
    } else {
      // Otherwise, use the original logic for determining biome based on coordinates
      if (q < 20 && r < 20 && s >= -4) {
        return "patternWoods";
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

  getNextBiomeInCycle: (q, r, s) => {
    
    const currentIndex = biomes.indexOf(GameSettings.getBiomeForCoordinates(q, r, s));
    const nextIndex = (currentIndex + 1) % biomes.length;
    return biomes[nextIndex];
  }
};

export default GameSettings;
