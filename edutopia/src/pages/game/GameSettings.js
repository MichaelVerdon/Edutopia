const GameSettings = {
  getBiomeForCoordinates: (q, r, s) => {
    // Example logic, adjust according to your actual game rules
    if (q < 20 && r < 20 && s >= -4) {
      return "patternForest";
    } else if (q < 8 && r < 5 && s < -4) {
      return "patternMountain";
    } else {
      return "patternPlains"; // Default case
    }
  },

  // ... other game settings ...
};

export default GameSettings;
