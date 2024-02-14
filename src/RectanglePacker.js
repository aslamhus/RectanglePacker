/**
 * # Rectangle Packer v2.1.0
 * by @aslamhus
 *
 *
 *
 *
 * ## Introduction
 *
 *
 * A heuristic for packing rectangles into a rectangle.
 * This class' main function is to solve the following problem:
 * Given a screen area and a fixed number of tiles with a fixed aspect ratio,
 * find the maximal tile size that will fit the screen area.
 * This is a version of the bin packing problem, which is NP-hard.
 *
 * The heuristic works by making an initial best guess for the tile size,
 * then adjusting the tile size based on whether it fits the screen area.
 *
 * The heuristic will continue to adjust the tile size until it
 * fits the screen area or until it reaches a try limit.
 *
 * ## Requirements
 *
 * The heuristic requires the following data to solve the problem:
 * screenArea, tiles, tileAspectRatio.
 *
 * ## Options
 *
 * Other options can control/restrict the heuristic such as:
 * - a gutter between tiles
 * - minimum tile width / height
 * - fixed number of columns
 * - whether the rectangle should be complete (all rows are full)
 * - whether tiles can be removed
 * - try limit (the maximum number of tries before the heuristic gives up)
 * - retry limit (the maximum number of retries before the heuristic gives up)
 *
 * ### columns
 *
 * If the columns option is set, then the best guess tile height will be calculated based on the columns.
 *
 *
 * ### canRemoveTiles
 *
 * If the canRemoveTiles option is set to true, then the heuristic will remove tiles until the solution is possible.
 * This is the least restrictive option, and will almost always find a solution. Like setting the columns option,
 * it defeats the purpose of the heuristic, but it is useful for creating a grid.
 *
 * ### completeRectangle
 *
 * If the completeRectangle option is set to true, then the heuristic will try to make the rectangle complete,
 *  i.e. all rows will be full. Complete rectangle option is not always possible, especially if the number of tiles is prime.
 * If you enable canRemoveTiles, then the heuristic will remove tiles until the rectangle is complete.
 *
 * ### Tries
 *
 * The try limit is the maximum number of tries before the heuristic gives up
 * A try is defined as a single attempt to calculate the tile properties with a correction
 * based on the last error.
 *
 *
 *
 *
 * @typedef {Object} properties
 * @property {number} tileWidth
 * @property {number} tileHeight
 * @property {number} columns
 * @property {number} rows
 * @property {Array} [tries]
 *
 *
 * @typedef {Object} constructor
 * @property {number[]} screenArea [width, height]
 * @property {Array<string>} tiles - array of tiles src
 * @property {number} tileAspectRatio - tile aspect ratio
 * // optional properties
 * @property {number} [gutter] - gutter between tiles
 * @property {function} [onError] - callback for errors
 * @property {boolean} [completeRectangle] - if true, the rectangle will be complete, i.e. all rows will be full
 * @property {boolean} [canRemoveTiles] - if true, then tiles will be removed if the solution is not possible
 * @property {number} [minTileHeight] - minimum tile height
 * @property {number} [minTileWidth] - minimum tile width
 * @property {number} [columns] - number of columns. If set, then the best guess tile height will be calculated based on the columns
 * in some ways, setting columns defeats the purpose of the heuristic, however it is useful to create a grid.
 * @property {number} tryLimit - limit for tries (default 800)
 * @property {number} retryLimit - limit for retries (default 20)
 *
 *
 */
class RectanglePacker {
  /**
   *
   * @param {constructor} constructor
   */
  constructor({
    screenArea,
    tiles,
    tileAspectRatio,
    gutter,
    onError,
    minTileHeight,
    maxTileHeight,
    minTileWidth,
    columns,
    completeRectangle,
    canRemoveTiles,
    tryLimit,
    debug = true,
  }) {
    if (!screenArea) throw new Error('screenArea is required');
    if (!tiles) throw new Error('tiles is required');
    if (!tileAspectRatio) throw new Error('tileAspectRatio is required');

    this.screenArea = screenArea;
    this.screenWidth = screenArea[0];
    this.screenHeight = screenArea[1];
    this.tiles = tiles;
    this.tileAspectRatio = tileAspectRatio;
    this.gutter = gutter ?? 0;
    this.columns = columns ?? 0;
    this.completeRectangle = completeRectangle ?? false;
    this.canRemoveTiles = canRemoveTiles ?? true;
    // calculate min tile dimensions and throw error if a solution is not possible with the given values
    this.minTileWidth = minTileWidth ?? 0;
    this.minTileHeight = minTileHeight ?? 0;
    this.calcMinTileDimensions(minTileWidth, minTileHeight);
    this.maxTileHeight = maxTileHeight;
    this.bestGuessTileHeight = this.calcBestGuessTileHeight();
    this.initialBestGuessTileHeight = this.bestGuessTileHeight + 0;
    this.tries = [];
    this.tryLimit = tryLimit ?? 1000;
    // default try limit is 800
    this.performanceStartTime = 0;
    this.performanceLimit = 1000;
    this.errorMargin = 0;
    this.onError = onError;
    this.direction = 1;
    this.removedTiles = [];
    this.debug = debug;
    // bind
    this.getTileDimensions = this.getTileDimensions.bind(this);
    this.getTileGridColumns = this.getTileGridColumns.bind(this);
    this.getTileProperties = this.getTileProperties.bind(this);
    this.calcTileProperties = this.calcTileProperties.bind(this);
  }

  /**
   * Set options
   *
   * @typedef {Object} Options
   * @property {number} tiles
   * @property {number[]} screenArea
   * @property {number} tileAspectRatio
   * @property {number} gutter
   * @property {number} minTileWidth
   * @property {number} minTileHeight
   * @property {number} columns
   *
   * @param {Options} options
   */
  setOptions(
    options = {
      tiles,
      screenArea,
      tileAspectRatio,
      gutter,
      minTileWidth,
      minTileHeight,
      columns,
      completeRectangle,
    }
  ) {
    const {
      tiles,
      screenArea,
      tileAspectRatio,
      gutter,
      minTileWidth,
      minTileHeight,
      columns,
      completeRectangle,
    } = options;
    this.tiles = tiles;
    this.screenArea = screenArea;
    this.screenWidth = screenArea[0];
    this.screenHeight = screenArea[1];
    this.tileAspectRatio = tileAspectRatio;
    this.gutter = gutter ?? this.gutter;
    this.columns = columns ?? this.columns;
    this.completeRectangle = completeRectangle ?? this.completeRectangle;
    this.calcMinTileDimensions(minTileWidth, minTileHeight);
    // reset best guess based on new options
    this.bestGuessTileHeight = this.calcBestGuessTileHeight();
    this.reset();
    return { tiles, screenArea, tileAspectRatio };
  }

  setBestGuessTileHeight(bestGuessTileHeight) {
    this.bestGuessTileHeight = bestGuessTileHeight;
    return bestGuessTileHeight;
  }

  /**
   * Calc best guess tile height
   *
   * If columns are set, then calculate the best guess tile height based on the columns.
   *
   * @returns {number} bestGuessTileHeight
   */
  calcBestGuessTileHeight() {
    let bestGuess = 0;
    if (this.columns > 0) {
      // if columns are set, then calculate the best guess tile height based on the columns
      bestGuess = this.calcTileDimensionsFromColumns(this.columns)[1];
    } else {
      bestGuess = this.calcBestGuessTileHeightByArea();
    }

    if (bestGuess < 1) {
      throw new Error('Best guess tile height cannot equal 0');
    }
    return bestGuess;
  }

  /**
   * Calc best guess tile height based on area
   *
   * The intial best guess tile height is based on the area of the screen and the number of tiles.
   * Since the heuristic will adjust the best guess downwards, we want to start with a guess that
   * overshoots the actual best guess (hence the multiplication by 2).
   *
   *
   * @returns {number} - best guess tile height
   */
  calcBestGuessTileHeightByArea() {
    return Math.floor(Math.sqrt((this.screenWidth * this.screenHeight) / this.tiles.length)) * 2;
  }

  /**
   * Remove tile
   *
   * @returns void
   */
  removeTile() {
    if (this.tiles.length === 0) {
      // get penultimate error, since the final error will be that there are no more tiles to remove
      const lastError = this.tries[this.tries.length - 2]?.error;
      throw new Error(`No more tiles to remove - ${lastError}`);
    }
    this.removedTiles.push(this.tiles.pop());
    return;
  }

  /**
   * Reverse direction for the corrections
   */
  reverseDirection() {
    this.direction = this.direction * -1;
  }

  /**
   * Reset
   *
   * reset the packer to its initial state
   */
  reset() {
    // reset performance
    this.performanceStartTime = performance.now();
    // reset tries
    this.tries = [];
    // reset tiles removed
    this.removedTiles = [];
  }

  /**
   * Validate solution is possible
   *
   * Example:
   *
   * Screenarea is 360 x 800
   * Number of tiles is 312
   * aspect ratio is 3/4
   * Min tile height is 1
   * Gutter is 5, so min tile height is 11
   * tile width is 8.25
   * Min tile area is 90
   * Tile area * number of tiles is 28080
   *
   * @returns {boolean} true if solution is possible
   * @throws {Error} if solution is not possible
   */
  validateSolutionIsPossible() {
    if (this.canRemoveTiles) {
      return true;
    }

    if (this.completeRectangle) {
      // if the number of tiles is a prime number, then the rectangle will never be complete
      if (this.isPrime(this.tiles.length)) {
        throw new Error(
          'Solution is not possible for a complete rectangle with a prime number of tiles'
        );
      }
    }
    const resolution = this.screenArea[0] * this.screenArea[1];
    let minTileArea = this.minTileHeight * this.minTileWidth + this.gutter * this.gutter;
    let totalTileArea = minTileArea * this.tiles.length;

    if (totalTileArea > resolution) {
      throw new Error(
        `Solution is not possible for given screen area (${this.screenArea[0]} x ${this.screenArea[1]}), tiles (${this.tiles.length}) and minimum tile dimensions (${this.minTileWidth} x ${this.minTileHeight})`
      );
    }

    return true;
  }

  /**
   * Validate tiles fit screen
   *
   * This method is called in the heuristic to validate that the tiles fit the screen.
   * If not it throws a specific error which helps the heuristic correct the best guess.
   *
   * @param {*} properties
   */
  validateTilesFitScreen(properties) {
    const [screenWidth, screenHeight] = this.screenArea;
    // note: these properties do not include gutter
    const { tileWidth, tileHeight, columns, rows } = properties;
    // calculate row width, column height (including gutter)
    const rowWidth = (tileWidth + this.gutter) * columns + this.gutter;
    const columnHeight = (tileHeight + this.gutter) * rows + this.gutter;
    let discrepancy = 0;
    // screen height overflow
    if (columnHeight > screenHeight) {
      discrepancy = columnHeight - screenHeight;
      if (Math.abs(discrepancy) > this.errorMargin) {
        throw new PackerError('Overflow screen height', {
          guess: this.bestGuessTileHeight,
          predicate: `columnHeight (${columnHeight}) > screenHeight (${screenHeight})`,
          data: { columnHeight, screenHeight },
          discrepancy: [discrepancy],
        });
      }
    }
    // screen width overflow
    if (rowWidth > screenWidth) {
      discrepancy = rowWidth - screenWidth;
      if (Math.abs(discrepancy) > this.errorMargin) {
        throw new PackerError('Overflow screen width', {
          guess: this.bestGuessTileHeight,
          predicate: `rowWidth (${rowWidth}) > screenWidth (${screenWidth})`,
          data: { rowWidth, screenWidth },
          discrepancy: [discrepancy],
        });
      }
    }
    // underflow screen width
    if (rowWidth < screenWidth) {
      discrepancy = screenWidth - rowWidth;
      if (Math.abs(discrepancy) > this.errorMargin) {
        throw new PackerError('Underflow screen width', {
          guess: this.bestGuessTileHeight,
          predicate: `rowWidth (${rowWidth}) < (screenWidth - gutter) (${screenWidth})`,
          data: { rowWidth, screenWidth },
          discrepancy: [discrepancy],
        });
      }
    }
  }

  /**
   * Validate the rectangle is complete (rows are full)
   * @param {*} properties
   * @returns {boolean}
   */
  validateRectangleIsComplete(properties) {
    const { tileWidth, tileHeight, columns, rows } = properties;
    // if the number of tiles is not a multiple of the number of columns, then the rectangle is not complete
    return this.tiles.length % columns === 0;
  }

  /**
   * Validate tiles obey min and max
   *
   * @param {*} properties
   */
  validateTilesObeyMinMax(properties) {
    const { tileWidth, tileHeight, columns, rows } = properties;
    // Below minimum
    if (
      tileWidth + this.gutter < this.minTileWidth ||
      tileHeight + this.gutter < this.minTileHeight
    ) {
      throw new PackerError('Tile dimensions below minimum', {
        guess: this.bestGuessTileHeight,
        predicate: `tileWidth (${tileWidth}) < minTileWidth (${this.minTileWidth}) || tileHeight (${tileHeight}) < minTileHeight (${this.minTileHeight})`,
        data: {
          tileWidth,
          tileHeight,
          minTileWidth: this.minTileWidth,
          minTileHeight: this.minTileHeight,
        },
        discrepancy: [this.minTileWidth - tileWidth, this.minTileHeight - tileHeight],
      });
    }
    // Above maximum
    if (this.maxTileHeight > 0 && tileHeight + this.gutter > this.maxTileHeight) {
      throw new PackerError('Tile dimensions above maximum', {
        guess: this.bestGuessTileHeight,
        predicate: `tileHeight (${tileHeight}) + gutter (${this.gutter}) > maxTileHeight (${this.maxTileHeight})`,
        data: {
          tileWidth,
          tileHeight,
          screenWidth: this.screenWidth,
          screenHeight: this.screenHeight,
        },
        discrepancy: [this.maxTileHeight - (tileHeight + this.gutter)],
      });
    }
  }

  validateColumnConstraintIsSatisfied(properties) {
    if (this.columns > 0 && properties && properties.columns !== this.columns) {
      throw new PackerError('Could not satisfy columns constraint', {
        guess: this.bestGuessTileHeight,
        predicate: `properties.columns (${properties.columns}) !== this.columns (${this.columns})`,
        data: { 'properties.columns': properties, 'this.columns': this.columns },
        discrepancy: [properties.columns - this.columns],
      });
    }
  }

  validateTryLimit() {
    if (this.tryLimit && this.tries.length == this.tryLimit) {
      this.debug && console.error('try limit reached', this.tries.length);
      throw new Error('Try limit reached');
    }
  }

  validateStackOverflow() {
    const performanceTime = performance.now() - this.performanceStartTime;
    if (performanceTime > this.performanceLimit) {
      throw new Error('Stack overflow');
    }
  }

  /**
   * Calculate tile properties
   *
   * @returns {properties} properties
   */
  calcTileProperties() {
    // first validate solution is possible
    this.validateSolutionIsPossible();
    // init variables
    let properties = null,
      lastError = null,
      correction = 0,
      errorType = '',
      errorDescription = null;
    this.performanceStartTime = performance.now();
    // begin heuristic
    while (!properties) {
      try {
        // escape hatch for try limit / stack overflow
        this.validateTryLimit();
        this.validateStackOverflow();
        // get properties
        properties = this.getTileProperties();
        // throw error if tiles overflow/underflow screen
        this.validateTilesFitScreen(properties);
        // throw error if tiles are below or above minimum tile height/width and maximum tile height/width
        this.validateTilesObeyMinMax(properties);
        // validate the column number is correct (if set)
        this.validateColumnConstraintIsSatisfied(properties);
      } catch (error) {
        // handle errors and get correction
        [correction, errorType] = this.handleHeuristicError(error, lastError, properties);

        // reset properties
        properties = null;
        // get error description
        errorDescription = error.description;
        // save last error
        lastError = error;
        // update best guess
        this.bestGuessTileHeight = this.bestGuessTileHeight + correction;
        // console log debug info on try
        this.debug && console.log(`----- try #${this.tries.length}`, this.bestGuessTileHeight);
        this.debug && console.log('error', errorType, correction);
        // handle best guess tile height equals 0
        if (this.bestGuessTileHeight < 1) {
          // if remove tiles is enabled, then remove tiles
          if (this.canRemoveTiles) {
            this.removeTile();
            // recalculate best guess based on new total tile area
            this.bestGuessTileHeight = this.calcBestGuessTileHeightByArea();
          } else {
            throw new Error('Tile height cannot equal 0');
          }
        }

        // fire onError callback
        if (this.onError) this.onError(`${errorType} (${correction})`);
      }
      // end try catch
      // push error data to tries last index
      this.logTryData(errorType, correction, errorDescription);
    }
    // end heuristic
    // validate rectangle is complete (rows are full)
    if (this.completeRectangle) {
      // if the rectangle is not complete, then try again
      if (!this.validateRectangleIsComplete(properties)) {
        // try again with new guess or remove tiles (if enabled)
        return this.tryCompletingRectangle();
      }
    }
    // after successful calculation, calculate tile positions
    const [realWidth, realHeight] = this.getRealDimensions(properties);
    // log the successful try
    this.logTryData(null, 0, null);

    return {
      ...properties,
      positions: this.positions,
      tiles: this.tiles,
      tries: this.tries,
      realHeight,
      realWidth,
    };
  }

  /**
   * Handle heuristic error
   *
   * This method is called when the heuristic encounters an error.
   * It will handle the error and return a correction/errorType for the best guess tile height
   * based on the error and the last error.
   *
   *
   *
   * @param {*} error
   * @param {*} lastError
   * @param {*} properties
   *
   * @returns {array} [ correction, errorType ]
   */
  handleHeuristicError(error, lastError, properties) {
    let correction = 0,
      errorType = error.message,
      newColumns = properties?.columns ?? 0;
    switch (error.message) {
      case 'Could not satisfy columns constraint':
        if (this.canRemoveTiles) {
          // lock the columns to the target columns
          newColumns = this.columns;
          // remove tile
          this.removeTile();
          // recalculate best guess based on new total tile area
          this.bestGuessTileHeight = this.calcBestGuessTileHeightByArea();
          return [0, errorType];
        }
        throw new PackerError(errorType, error.description);

      case 'Overflow screen height':
        // add columns to decrease the tile height
        newColumns = properties.columns + 1;
        this.reverseDirection();
        break;

      case 'Overflow screen width':
        // add columns to decrease the tile height
        newColumns = properties.columns - 1;
        break;

      case 'Underflow screen width':
        // if
        if (lastError?.message === undefined || lastError?.message === null) {
          // if last error is undefined, we may be off by a few pixels
          // try recalculating the tile properties with the same columns
          // the initial best guess is based on area, and not columns,
          // therefore, we may be off by a few pixels
          newColumns = properties.columns;
          break;
        }

        // reduce columns to increase the tile height
        newColumns = properties.columns + 1;
        break;

      case 'Underflow screen height':
        // no new columns
        break;

      case 'Tile dimensions below minimum':
        if (this.canRemoveTiles) {
          // remove tile and set the best guess to the min tile height
          this.removeTile();
          this.bestGuessTileHeight = this.minTileHeight;
          return [0, errorType];
        }
        throw new PackerError(errorType, error.description);

      case 'Tile dimensions above maximum':
        if (this.canRemoveTiles) {
          // remove tile and set the best guess to the max tile height
          this.removeTile();
          this.bestGuessTileHeight = this.maxTileHeight;
          return [0, errorType];
        }
        throw new PackerError(errorType, error.description);

      default:
        throw new Error(error.message);
    }
    // calculate correction
    correction = this.calcCorrectionForNewColumnValue(properties, newColumns);

    return [correction, errorType];
  }

  /**
   * Calculate correction for new column value
   * find the tile height required to fit the screen based on the new columns
   * @param {*} properties
   * @param {number} newColumns - new columns
   *
   * @returns {number} correction
   */
  calcCorrectionForNewColumnValue(properties, newColumns) {
    const [, newTileHeight] = this.calcTileDimensionsFromColumns(newColumns);

    return newTileHeight - this.bestGuessTileHeight;
  }

  /**
   * Try completing the rectangle
   *
   * If the rectangle is not complete, then try again with a different best guess
   * or remove tiles (if enabled)
   *
   * @param {*} properties
   * @returns
   */
  tryCompletingRectangle() {
    this.tries = [];
    // if remove tiles is enabled, then remove tiles and try again with same best guess
    if (this.canRemoveTiles) {
      this.removeTile();
      this.bestGuessTileHeight = this.initialBestGuessTileHeight = this.calcBestGuessTileHeight();
      return this.calcTileProperties();
    }
    // try again with a different starting best guess
    this.bestGuessTileHeight = this.initialBestGuessTileHeight =
      this.initialBestGuessTileHeight / 2;

    return this.calcTileProperties();
  }

  /**
   * Push try data for each try
   *
   * This data can then be used to debug the heuristic
   *
   * @param {*} errorType
   * @param {*} correction
   * @param {*} errorDescription
   */
  logTryData(errorType, correction, errorDescription) {
    const lastIndex = this.tries.length - 1;
    this.tries[lastIndex].tries = this.tries;
    this.tries[lastIndex].bestGuessTileHeight = this.bestGuessTileHeight;
    this.tries[lastIndex].error = errorType;
    this.tries[lastIndex].correction = correction;
    this.tries[lastIndex].positions = this.positions;
    this.tries[lastIndex].screenArea = this.screenArea;
    this.tries[lastIndex].tiles = this.tiles;
    this.tries[lastIndex].errorDescription = errorDescription;
    this.tries[lastIndex].performanceTime = performance.now() - this.performanceStartTime;
  }

  getRealDimensions(properties) {
    const { tileWidth, tileHeight, columns, rows } = properties;
    const realWidth = columns * (tileWidth + this.gutter) + this.gutter;
    const realHeight = rows * (tileHeight + this.gutter) + this.gutter;
    return [realWidth, realHeight];
  }

  /**
   * Calculate tile dimensions from columns
   * (includes gutter)
   *
   * @param {number} columns
   * @returns {number[]} - [tileWidth, tileHeight]
   */
  calcTileDimensionsFromColumns(columns) {
    const newTileWidth = (this.screenWidth - this.gutter) / columns - this.gutter;
    const newTileHeight = newTileWidth / this.tileAspectRatio;
    return [newTileWidth, newTileHeight];
  }

  /**
   * Calculate min tile dimensions
   *
   * Requires at least one dimension to be set.
   * The other calculated dimension will be based on the aspect ratio
   *
   * @param {number} w - minTileWidth
   * @param {number} h - minTileHeight
   * @returns {number[]} [minTileWidth, minTileHeight] - includes gutter
   */
  calcMinTileDimensions(w, h) {
    if (!w && !h) {
      // if neither w nor h are set, then set w to 1
      w = 1;
    }
    if (!w) {
      // minTileWidth is not set
      this.minTileHeight = h + this.gutter;
      this.minTileWidth = this.minTileHeight * this.tileAspectRatio;
    } else {
      // minTileHeight is not set
      this.minTileWidth = w + this.gutter;
      this.minTileHeight = this.minTileWidth / this.tileAspectRatio;
    }
    return [this.minTileWidth, this.minTileHeight];
  }

  /**
   * Calculate tile positions
   *
   * @param {*} properties
   * @returns {Array} tilePositions - [x, y, rowIndex, colIndex]
   */
  calcTilePositions(properties) {
    const { tileWidth, tileHeight, columns, rows } = properties;
    const tilePositions = [];
    for (let i = 0; i < this.tiles.length; i++) {
      tilePositions.push(this.calcTilePosition(columns, tileWidth, tileHeight, i));
    }
    return tilePositions;
  }

  /**
   * Calculate tile position
   *
   * (used in calcTilePositions method)
   *
   * @param {*} columns
   * @param {*} tileWidth
   * @param {*} tileHeight
   * @param {*} i
   * @returns {Array} [x, y, rowIndex, colIndex]
   */
  calcTilePosition(columns, tileWidth, tileHeight, i) {
    const colIndex = i % columns;
    const rowIndex = Math.floor(i / columns);
    const gutter = this.gutter;

    let x = colIndex * (tileWidth + gutter);
    let y = Math.floor(i / columns) * (tileHeight + this.gutter);
    // add initial gutter to x,y
    x += gutter;
    y += gutter;
    return [x, y, rowIndex, colIndex];
  }

  /**
   * Get the tile properties
   *
   * Note: the tile properties do not include the gutter
   *
   * @returns {properties} properties { tileWidth, tileHeight, columns, rows}
   */
  getTileProperties() {
    const [tileWidth_noGutter, tileHeight_noGutter] = this.getTileDimensions();
    // calculate columns and rows
    let columns = this.getTileGridColumns(tileWidth_noGutter);
    let rows = Math.ceil(this.tiles.length / columns);
    // push to tries array
    this.tries.push({
      tileWidth: tileWidth_noGutter,
      tileHeight: tileHeight_noGutter,
      columns,
      rows,
    });

    // calculate tile positions
    this.positions = this.calcTilePositions({
      tileWidth: tileWidth_noGutter,
      tileHeight: tileHeight_noGutter,
      columns,
      rows,
    });
    // round the tile width and height based on the error margin

    return { tileWidth: tileWidth_noGutter, tileHeight: tileHeight_noGutter, columns, rows };
  }

  /**
   * Get tile grid columns
   *
   * this should take into account the gutter
   *
   * @param {Number} tileWidth
   * @returns {Number} columns
   */
  getTileGridColumns(tileWidth) {
    const columnsPerRow = Math.round((this.screenWidth - this.gutter) / (tileWidth + this.gutter));
    if (this.tiles.length < columnsPerRow - 1) {
      throw new Error('Tile width and number of tiles cannot fill the container width');
    }
    return columnsPerRow;
  }

  /**
   * Get tile dimensions
   *
   * @returns {Number[]} [width, height]
   */
  getTileDimensions() {
    const width = this.bestGuessTileHeight * this.tileAspectRatio;
    const height = this.bestGuessTileHeight;
    return [width, height];
  }

  getTilesRemoved() {
    return this.removedTiles;
  }

  getWereTilesRemoved() {
    return this.removedTiles.length > 0;
  }

  isPrime(n) {
    if (this.tiles.length < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }
}

class PackerError extends Error {
  constructor(message, description) {
    super(message);
    this.name = 'PackerError';
    this.description = description;
  }
}

export default RectanglePacker;
