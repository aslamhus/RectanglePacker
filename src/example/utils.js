export const defaultOptions = {
  screenArea: [720, 480],
  minTileHeight: 0,
  maxTileHeight: 0,
  completeRectangle: false,
  tileAspectRatio: 4 / 5,
  gutter: 5,
  columns: null,
  canRemoveTiles: false,
  showConstraints: false,
  tiles: Array.from({ length: 10 }),
};

/**
 * Create tiles array
 *
 * Copy or remove tiles from the tiles array to create a new array based on the number of tiles
 * @param {number} numberOfTiles
 * @returns
 */
export const createTilesArray = (numberOfTiles) => {
  return Array.from({ length: numberOfTiles });
  if (tiles.length < numberOfTiles) {
    // create more tiles
    // console.log('create tiles of length', tiles.length, numberOfTiles);
    while (tiles.length < numberOfTiles) {
      tiles.push(tiles[Math.floor(Math.random() * tiles.length)]);
    }
    return tiles;
  }

  return tiles.slice(0, numberOfTiles);
};

/**
 * Compare expected packing result
 *
 * Values are compared with a precision of 2 decimal places
 *
 * @param {*} result - the result of the packing calculation
 * @param {*} expected - the expected values
 * @param {*} assert - chai assert
 *
 * @throws {Error} - if the result does not match the expected values
 */
export const compareExpectedPackingResult = (result, expected, assert) => {
  // check all expected values against the result
  Object.entries(expected).forEach((entry, index) => {
    const [key, expected] = entry;
    let value = result[key];
    // convert array to length
    if (key === 'tiles') {
      value = value.length;
    }
    // convert to fixed 2 decimal places
    if (['tileHeight', 'tileWidth', 'realHeight', 'realWidth'].includes(key)) {
      value = value.toFixed(2);
    }
    assert.equal(value, expected, `Expected ${key} to be ${expected}, but got ${value}`);
  });
};
