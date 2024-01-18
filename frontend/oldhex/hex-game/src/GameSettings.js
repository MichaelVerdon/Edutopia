const GameSettings = {
  getBiomeForCoordinates: (x, y) => {
    if (x < 8 && y > 7) {
      return "Plains";
    } 
    else if (x < 8 && y <= 7 && x > 4 ){
      
      return "Mountain";
    }
  },
};

export default GameSettings;
