const GameSettings = {
    getBiomeForCoordinates: (q, r) => {
      // Example logic, adjust according to your actual game rules
      if (q < 8 && r > 7) {
        return "Plains";
      } else if (q < 8 && r <= 7 && q > 4) {
        return "Mountain";
      } else {
        return "DefaultBiome"; // Default case
      }
    },
  
    // ... other game settings ...
  };
  
  export default GameSettings;
  