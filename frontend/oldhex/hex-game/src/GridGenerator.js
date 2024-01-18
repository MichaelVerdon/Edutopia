export const gapCoordinates = new Set([
    '9,15','10,15','8,16','9,16','10,16','8,17','9,17','5,18','6,18','7,18',
    '8,18','9,18','9,18','10,18','11,18','13,18','15,18','16,18','-1,19',
    '4,19','5,19','10,19','11,19','12,19','13,19','14,19','15,19','-2,20','-1,20',
    '0,20','10,20','11,20','12,20','-2,21','11,21','-5,22','-4,22','-3,22','-2,22',
    '-1,22','-6,23','-5,23','-9,24','-8,24','-7,24','-11,25','-10,25','-13,26','-12,26'
  ]);
  
  export const generateCustomGrid = (width, height, gapCoordinates) => {
    let hexagons = [];
    for (let r = 0; r < height; r++) {
      const rOffset = Math.floor(r / 2); 
      for (let q = -rOffset; q < width - rOffset; q++) {
        const coordinateKey = `${q},${r}`;
        if (gapCoordinates.has(coordinateKey)) continue;
        hexagons.push({ q, r, s: -q-r, building: null});
      }
    }
    return hexagons;
  };
  