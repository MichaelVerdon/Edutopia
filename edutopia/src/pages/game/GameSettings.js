// GameSettings.js

const GameSettings = {
  customBiomes: {},

  getBiomeForCoordinates: (q, r, s) => {
    // Example logic, adjust according to your actual game rules
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
    // Add logic here to trigger re-render of affected hexagon(s)
    // You may need to use some state management solution or forceUpdate to re-render components
  }
};

export default GameSettings;
