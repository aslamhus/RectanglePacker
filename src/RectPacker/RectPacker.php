<?php

namespace Aslamhus\RectPacker;

use Exception;

/**
 * # Rectangle Packer v2.0.0
 * by @aslamhus
 *
 * ## Introduction
 *
 * A heuristic for packing rectangles into a rectangle.
 * This class' main function is to solve the following problem:
 * Given a screen area and a fixed number of tiles with a fixed aspect ratio,
 * find the maimal tile size that will fit the screen area.
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
 */
class RectPacker
{
    private array $screenArea;
    private float $screenWidth;
    private float $screenHeight;
    private array $tiles;
    private float $tileAspectRatio;
    private int $gutter;
    private int $columns;
    private bool $completeRectangle;
    private bool $canRemoveTiles;
    private float $maxTileHeight;
    private float $minTileWidth;
    private float $minTileHeight;
    private float $bestGuessTileHeight;
    private float $initialBestGuessTileHeight;
    private array $tries = [];
    private int $tryLimit;
    private float $errorMargin;
    private $performanceStartTime = 0;
    private int $performanceLimit;
    private $onError;
    private $positions;
    private $direction = 1;
    private array $removedTiles = [];
    private bool $debug = false;
    // defaults
    public const DEFAULT_PERFORMANCE_LIMIT = 1000;
    public const DEFAULT_TRY_LIMIT = 1000;
    public const DEFAULT_ERROR_MARGIN = 0.1;

    /**
     * Contructor
     *
     *
     *
     * @param array $options {
     *      @type array $screenArea [width, height]
     *      @type array $tiles
     *      @type float $tileAspectRatio
     *      @type int $gutter
     *      @type int $columns
     *      @type bool $completeRectangle
     *      @type bool $canRemoveTiles
     *      @type int $tryLimit
     *      @type int $performanceLimit
     *      @type float $errorMargin
     *      @type int $minTileHeight
     *      @type int $minTileWidth
     *      @type int $maxTileHeight
     *      @type function $onError
     * }
     */
    public function __construct($options)
    {
        if (empty($options['screenArea'])) {
            throw new Exception('screenArea is required');
        }
        if (empty($options['tiles'])) {
            throw new Exception('tiles is required');
        }
        if (empty($options['tileAspectRatio'])) {
            throw new Exception('tileAspectRatio is required');
        }
        $this->screenArea = $options['screenArea'];
        $this->screenWidth = $options['screenArea'][0];
        $this->screenHeight = $options['screenArea'][1];
        $this->tiles = $options['tiles'];
        $this->tileAspectRatio = $options['tileAspectRatio'];
        $this->gutter = $options['gutter'] ?? 0;
        $this->onError = $options['onError'] ?? null;
        $this->minTileHeight = $options['minTileHeight'] ?? 0;
        $this->minTileWidth = $options['minTileWidth'] ?? 0;
        $this->maxTileHeight = $options['maxTileHeight'] ?? 0;
        $this->columns = $options['columns'] ?? 0;
        $this->completeRectangle = $options['completeRectangle'] ?? false;
        $this->canRemoveTiles = $options['canRemoveTiles'] ?? false;
        $this->tryLimit = $options['tryLimit'] ?? self::DEFAULT_TRY_LIMIT;
        $this->performanceLimit = $options['performanceLimit'] ?? self::DEFAULT_PERFORMANCE_LIMIT;
        $this->bestGuessTileHeight = $this->calcBestGuessTileHeight();
        $this->initialBestGuessTileHeight = $this->bestGuessTileHeight;
        $this->errorMargin = $options['errorMargin'] ?? self::DEFAULT_ERROR_MARGIN;
        $this->debug = $options['debug'] ?? false;
        $this->calcMinTileDimensions($this->minTileWidth, $this->minTileHeight);
    }

    /**
     * Reset the packer with the given options
     * @param array $options
     * @see constructor
     */
    public function setOptions($options)
    {
        // reset the packer with the given options
        foreach($options as $key => $value) {
            if(property_exists($this, $key)) {
                $this->{$key} = $value ?? $this->{$key};
            } else {
                throw new Exception("Property $key does not exist");

            }
        }
        $this->calcMinTileDimensions($this->minTileWidth, $this->minTileHeight);
        // reset best guess based on new options
        $this->bestGuessTileHeight = $this->calcBestGuessTileHeight();
        $this->reset();

        return ['tiles' => $this->tiles, 'screenArea' => $this->screenArea, 'tileAspectRatio' => $this->tileAspectRatio];
    }

    /**
     * Set the best guess tile height manually
     * @param float $bestGuessTileHeight
     * @return float bestGuessTileHeight
     */
    public function setBestGuessTileHeight(float $bestGuessTileHeight)
    {
        $this->bestGuessTileHeight = $bestGuessTileHeight;
        return $bestGuessTileHeight;
    }

    /**
     * Calc best guess tile height
     * If columns are set, then calculate the best guess tile height based on the columns.
     *
     * @return float bestGuessTileHeight
     */
    private function calcBestGuessTileHeight()
    {
        $bestGuess = 0;
        if($this->columns > 0) {
            $bestGuess = $this->calcTileDimensionsFromColumns($this->columns)[1];
        } else {
            $bestGuess = $this->calcBestGuessTileHeightByArea();
        }
        if($bestGuess < 1) {
            throw new Exception('bestGuessTileHeight must be greater than 0');
        }
        // check if the initial tile width is too wide for the screen
        $initialTileWidth = $bestGuess * $this->tileAspectRatio + $this->gutter;
        // if it is, then use the screen width to calculate the best guess
        if($initialTileWidth > $this->screenWidth) {
            $bestGuess = floor($this->screenWidth / $this->tileAspectRatio);
        }

        return $bestGuess;
    }

    /**
     * Calc best guess tile height based on area
     *
     *
   * The intial best guess tile height is based on the area of the screen and the number of tiles.
   * Since the heuristic will adjust the best guess downwards, we want to start with a guess that
   * overshoots the actual best guess (hence the multiplication by 2).
   *
     * @return float - best guess tile height
     */
    private function calcBestGuessTileHeightByArea()
    {
        return floor(sqrt(($this->screenWidth * $this->screenHeight) / count($this->tiles))) * 2;
    }

    /**
     * Remove tile
     * @return void
     */
    private function removeTile()
    {
        if(count($this->tiles) === 0) {
            // get penultimate error, since the final error will be that there are no more tiles to remove
            $lastError = $this->tries[count($this->tries) - 2]['error'];
            throw new Exception('No more tiles to remove - ' . $lastError);
        }
        // remove the last tile
        if($this->canRemoveTiles) {
            $this->removedTiles[] = array_pop($this->tiles);
        }
    }

    /**
     * Reverse the direction of the packer heuristic
     */
    private function reverseDirection()
    {
        $this->direction = $this->direction * -1;
    }

    /**
     * Reset the packer
     */
    public function reset()
    {
        // reset performance
        $this->performanceStartTime = microtime(true);
        // reset tries
        $this->tries = [];
        // reset tiles removed
        $this->removedTiles = [];
    }

    /**
     * Validate a solution is possible with the given tiles
     * @return bool - true if a solution is possible
     * @throws Exception if a solution is not possible
     */
    private function validateSolutionIsPossible()
    {
        if($this->canRemoveTiles) {
            return true;
        }
        if($this->completeRectangle) {
            // if the number of tiles is a prime number, then the rectangle will never be complete
            if($this->isPrime(count($this->tiles))) {
                throw new Exception('Solution is not possible for a complete rectangle with a prime number of tiles');
            }

        }
        $screenResolution = $this->screenWidth * $this->screenHeight;
        // calc min tile area
        $minTileArea = $this->minTileWidth * $this->minTileHeight;
        // calc total tile area
        $totalTileArea = $minTileArea * count($this->tiles);
        // if the total minimum tile area is greater than the screen area, then a solution is not possible
        if($totalTileArea > $screenResolution) {
            throw new Exception(
                "Solution is not possible for given screen area ({$this->screenArea[0]} x {$this->screenArea[1]}), tiles (" . count($this->tiles) . ") and minimum tile dimensions ({$this->minTileWidth} x {$this->minTileHeight})"
            );
        }

        return true;
    }

    /**
     * Validate that the tiles fit the screen
     * This method is called in the heuristic to validate that the tiles fit the screen.
     * If not it throws a specific error which helps the heuristic correct the best guess.
     * @param array $properties
     * @throws PackerException
     */
    private function validateTilesFitScreen(array $properties)
    {
        // get tile properties for the validation
        list($screenWidth, $screenHeight) = $this->screenArea;
        // note that that the tile width/height do not include gutter
        $tileWidth = $properties['tileWidth'];
        $tileHeight = $properties['tileHeight'];
        $columns = $properties['columns'];
        $rows = $properties['rows'];
        // ccalculate row width, column height (including gutter)
        $rowWidth = $tileWidth * $columns + $this->gutter * ($columns + 1);
        $columnHeight = $tileHeight * $rows + $this->gutter * ($rows + 1);
        $discrepancy = (float) 0;
        // screen height overflow
        if ($columnHeight > $screenHeight) {
            $discrepancy = $columnHeight - $screenHeight;
            if (abs($discrepancy) > $this->errorMargin) {
                throw new PackerException('Overflow screen height', [
                    'guess' => $this->bestGuessTileHeight,
                    'predicate' => "columnHeight ({$columnHeight}) > screenHeight ({$screenHeight})",
                    'data' => ['columnHeight' => $columnHeight, 'screenHeight' => $screenHeight],
                    'discrepancy' => [$discrepancy],
                ]);
            }
        }
        // screen width overflow
        if ($rowWidth > $screenWidth) {
            $discrepancy = $rowWidth - $screenWidth;
            if (abs($discrepancy) > $this->errorMargin) {
                throw new PackerException('Overflow screen width', [
                    'guess' => $this->bestGuessTileHeight,
                    'predicate' => "rowWidth ({$rowWidth}) > screenWidth ({$screenWidth})",
                    'data' => ['rowWidth' => $rowWidth, 'screenWidth' => $screenWidth],
                    'discrepancy' => [$discrepancy],
                ]);
            }
        }
        // underflow screen width
        if ($rowWidth < $screenWidth) {
            $discrepancy = $screenWidth - $rowWidth;
            if (abs($discrepancy) > $this->errorMargin) {
                throw new PackerException('Underflow screen width', [
                    'guess' => $this->bestGuessTileHeight,
                    'predicate' => "rowWidth ({$rowWidth}) < (screenWidth - gutter) ({$screenWidth})",
                    'data' => ['rowWidth' => $rowWidth, 'screenWidth' => $screenWidth],
                    'discrepancy' => [$discrepancy],
                ]);
            }
        }
    }

    /**
     * Validate that the rectangle is complete (rows are full)
     * @param array $properties
     * @return bool
     */
    private function validateRectangleIsComplete(array $properties)
    {
        return count($this->tiles) % $properties['columns'] === 0;
    }

    /**
     * Validate tiles obey min and max
     * @param array properties
     * @throws PackerException
     **/
    private function validateTilesObeyMinMax(array $properties)
    {
        $tileWidth = $properties['tileWidth'];
        $tileHeight = $properties['tileHeight'];
        // Below minimum
        if ($tileWidth + $this->gutter < $this->minTileWidth || $tileHeight + $this->gutter < $this->minTileHeight) {
            throw new PackerException('Tile dimensions below minimum', [
                'guess' => $this->bestGuessTileHeight,
                'predicate' => "tileWidth ({$tileWidth}) < minTileWidth ({$this->minTileWidth}) || tileHeight ({$tileHeight}) < minTileHeight ({$this->minTileHeight})",
                'data' => [
                    'tileWidth' => $tileWidth,
                    'tileHeight' => $tileHeight,
                    'minTileWidth' => $this->minTileWidth,
                    'minTileHeight' => $this->minTileHeight,
                ],
                'discrepancy' => [$this->minTileWidth - $tileWidth, $this->minTileHeight - $tileHeight],
            ]);
        }
        // Above maximum
        if ($this->maxTileHeight > 0 && $tileHeight + $this->gutter > $this->maxTileHeight) {
            throw new PackerException('Tile dimensions above maximum', [
                'guess' => $this->bestGuessTileHeight,
                'predicate' => "tileHeight ({$tileHeight}) + gutter ({$this->gutter}) > maxTileHeight ({$this->maxTileHeight})",
                'data' => [
                    'tileWidth' => $tileWidth,
                    'tileHeight' => $tileHeight,
                    'screenWidth' => $this->screenWidth,
                    'screenHeight' => $this->screenHeight,
                ],
                'discrepancy' => [$this->maxTileHeight - ($tileHeight + $this->gutter)],
            ]);
        }
    }

    /**
     * Validate column constraint is satisfied
     * @param array $properties
     * @return void
     * @throws PackerException
     */
    private function validateColumnConstraintIsSatisfied(array $properties)
    {
        if ($this->columns > 0 && $properties && $properties['columns'] !== $this->columns) {
            throw new PackerException('Could not satisfy columns constraint', [
                'guess' => $this->bestGuessTileHeight,
                'predicate' => "properties.columns ({$properties['columns']}) !== this.columns ({$this->columns})",
                'data' => ['properties.columns' => $properties, 'this.columns' => $this->columns],
                'discrepancy' => [$properties['columns'] - $this->columns],
            ]);
        }
    }

    /**
     * Validate try limit
     * @throws PackerException
     */
    private function validateTryLimit()
    {
        if ($this->tryLimit && count($this->tries) == $this->tryLimit) {
            throw new Exception('Try limit reached');
        }
    }

    /**
     * Validate stack overflow
     * @throws PackerException
     */
    private function validateStackOverflow()
    {
        $performanceTime = microtime(true) - $this->performanceStartTime;
        if ($performanceTime > $this->performanceLimit) {
            throw new Exception('Stack overflow');
        }
    }

    /**
     * Calculate tile properties
     * This method is a heuristic that attempts to pack the tiles into the screen area.
     * The main method of the heuristic is getTileProperties, which calculates the tile properties
     * The heuristic will recursively call getTileProperties until the tiles fit the screen area.
     * @return array - tile properties
     */
    public function calcTileProperties()
    {
        // first validate a solution is possible based on the best guess
        $this->validateSolutionIsPossible();
        // initialize variables
        $properties = null;
        $lastException = null;
        $correction = 0;
        $exceptionType = '';
        $exceptionDescription = null;
        $this->performanceStartTime = microtime(true);
        // begin heuristic
        while (!$properties) {

            try {
                // escape hatch for try limit / stack overflow
                $this->validateTryLimit();
                $this->validateStackOverflow();
                // get properties
                $properties = $this->getTileProperties();
                // validate that the tiles fit the screen
                $this->validateTilesFitScreen($properties);
                // throw error if tiles are below or above minimum tile height/width and maximum tile height/width
                $this->validateTilesObeyMinMax($properties);
                // validate the column number is correct (if set)
                $this->validateColumnConstraintIsSatisfied($properties);
            } catch (PackerException|Exception $exception) {
                // handle errors and get correction
                list($correction, $exceptionType) = $this->handleHeuristicError($exception, $lastException, $properties);
                // reset properties
                $properties = null;
                // get exception description
                $exceptionDescription = $exception->getDescription();
                // save the last exception
                $lastException = $exception;
                // update best guess
                $this->bestGuessTileHeight += $correction;
                // print debug info
                if ($this->debug) {
                    echo "----- try #" . count($this->tries) . " {$this->bestGuessTileHeight} \n";
                    echo "error: $exceptionType\n correction: $correction\n";
                }
                // handle best guess tile height equals 0
                if ($this->bestGuessTileHeight < 1) {
                    // if remove tiles is enabled, then remove tiles
                    if ($this->canRemoveTiles) {
                        $this->removeTile();
                        $this->bestGuessTileHeight = $this->calcBestGuessTileHeightByArea();
                    // restart
                    } else {
                        throw new Exception('Tile height cannot equal 0');
                    }
                }
                // fire on error callback
                if ($this->onError) {
                    call_user_func($this->onError, [$exceptionType, $correction, $exceptionDescription]);
                }
            }
            // end try catch
            // push error data to tries array
            $this->logTryData($exceptionType, $correction, $exceptionDescription);

        }
        // end heuristic
        // validate rectangle is complete (rows are full)
        if ($this->completeRectangle) {
            // if the rectangle is not complete, then try again
            if (!$this->validateRectangleIsComplete($properties)) {
                // try again with new guess or remove tiles (if enabled)
                return $this->tryCompletingRectangle();
            }
        }
        list($realWidth, $realHeight) = $this->getRealDimensions($properties);

        return [
            'tileWidth' => $properties['tileWidth'],
            'tileHeight' => $properties['tileHeight'],
            'columns' => $properties['columns'],
            'rows' => $properties['rows'],
            'positions' => $this->positions,
            'tiles' => $this->tiles,
            'tries' => $this->tries,
            'realHeight' => $realHeight,
            'realWidth' => $realWidth,
        ];
    }

    /**
     * Handle heuristic error
     * This method is called when the heuristic encounters an error.
     * It will handle the error and return a correction/exceptionType for the best guess tile height
     * based on the error and the last error.
     * @param PackerException $e
     * @param PackerException|null $lastError
     * @param array $properties
     * @return array [ correction, exceptionType ]
     */
    private function handleHeuristicError($e, $lastException, $properties)
    {
        $correction = 0;
        $exceptionType = $e->getMessage();
        $newColumns = isset($properties['columns']) ? $properties['columns'] : 0;
        switch ($e->getMessage()) {
            case 'Could not satisfy columns constraint':
                if ($this->canRemoveTiles) {
                    // lock the columns to the target columns
                    $newColumns = $this->columns;
                    // remove tile
                    $this->removeTile();
                    // recalculate best guess based on new total tile area
                    $this->bestGuessTileHeight = $this->calcBestGuessTileHeightByArea();
                    return [0, $exceptionType];
                }
                throw new PackerError($exceptionType, $e->getDescription());

            case 'Overflow screen height':
                // add columns to decrease the tile height
                $newColumns = $properties['columns'] + 1;
                $this->reverseDirection();
                break;

            case 'Overflow screen width':
                // add columns to decrease the tile height
                $newColumns = $properties['columns'] - 1;
                break;

            case 'Underflow screen width':
                // if
                if ($lastException === null || $lastException === null) {
                    // if last error is undefined, we may be off by a few pixels
                    // try recalculating the tile properties with the same columns
                    // the initial best guess is based on area, and not columns,
                    // therefore, we may be off by a few pixels
                    $newColumns = $properties['columns'];
                    break;
                }

                // reduce columns to increase the tile height
                $newColumns = $properties['columns'] + 1;
                break;

            case 'Underflow screen height':
                // no new columns
                break;

            case 'Tile dimensions below minimum':
                if ($this->canRemoveTiles) {
                    // remove tile and set the best guess to the min tile height
                    $this->removeTile();
                    $this->bestGuessTileHeight = $this->minTileHeight;
                    return [0, $exceptionType];
                }
                throw new PackerError($exceptionType, $e->getDescription());

            case 'Tile dimensions above maximum':
                if ($this->canRemoveTiles) {
                    // remove tile and set the best guess to the max tile height
                    $this->removeTile();
                    $this->bestGuessTileHeight = $this->maxTileHeight;
                    return [0, $exceptionType];
                }
                throw new PackerError($exceptionType, $e->getDescription());

            default:
                throw new Exception($e->getMessage());
        }

        // calculate correction
        $correction = $this->calcCorrectionForNewColumnValue($properties, $newColumns);

        return [$correction, $exceptionType];
    }

    /**
     * Calculate correction for new column value
     * find the tile height required to fit the screen based on the new columns
     * @param array $properties
     * @param int $newColumns - new columns
     * @return int $correction
     */
    private function calcCorrectionForNewColumnValue($properties, $newColumns)
    {
        [, $newTileHeight] = $this->calcTileDimensionsFromColumns($newColumns);

        return $newTileHeight - $this->bestGuessTileHeight;
    }



    /**
     * Try completing the rectangle
     * If the rectangle is not complete, then try again with a different best guess
     * or remove tiles (if enabled)
     * @return array
     */
    private function tryCompletingRectangle()
    {
        $this->tries = [];

        // if remove tiles is enabled, then remove tiles and try again with same best guess
        if ($this->canRemoveTiles) {
            $this->removeTile();
            $this->bestGuessTileHeight = $this->initialBestGuessTileHeight = $this->calcBestGuessTileHeight();
            return $this->calcTileProperties();
        }

        // try again with a different starting best guess
        $this->bestGuessTileHeight = $this->initialBestGuessTileHeight = $this->initialBestGuessTileHeight / 2;

        return $this->calcTileProperties();
    }

    /**
     * Log try data for each try
     * This data can then be used to debug the heuristic
     * @param mixed $exceptionType
     * @param mixed $correction
     * @param string $exceptionDescription
     * @return void
     */
    private function logTryData($exceptionType, $correction, $exceptionDescription)
    {
        $lastIndex = count($this->tries) - 1;
        $this->tries[$lastIndex]['tries'] = $this->tries;
        $this->tries[$lastIndex]['bestGuessTileHeight'] = $this->bestGuessTileHeight;
        $this->tries[$lastIndex]['error'] = $exceptionType;
        $this->tries[$lastIndex]['correction'] = $correction;
        $this->tries[$lastIndex]['positions'] = $this->positions;
        $this->tries[$lastIndex]['screenArea'] = $this->screenArea;
        $this->tries[$lastIndex]['tiles'] = $this->tiles;
        $this->tries[$lastIndex]['exceptionDescription'] = $exceptionDescription;
        $this->tries[$lastIndex]['performanceTime'] = microtime(true) - $this->performanceStartTime;
    }

    private function getRealDimensions($properties)
    {
        $tileWidth = $properties['tileWidth'];
        $tileHeight = $properties['tileHeight'];
        $columns = $properties['columns'];
        $rows = $properties['rows'];
        $realWidth = $columns * ($tileWidth + $this->gutter) + $this->gutter;
        $realHeight = $rows * ($tileHeight + $this->gutter) + $this->gutter;
        return [$realWidth, $realHeight];
    }

    /**
     * Calculate tile dimensions from columns
     * (includes gutter)
     * @param int $columns
     * @return array - [tileWidth, tileHeight]
     */
    private function calcTileDimensionsFromColumns($columns)
    {
        $newTileWidth = ($this->screenWidth - $this->gutter) / $columns - $this->gutter;
        $newTileHeight = $newTileWidth / $this->tileAspectRatio;
        return [$newTileWidth, $newTileHeight];
    }

    /**
     * Calculate min tile dimensions
     * Requires at least one dimension to be set.
     * The other calculated dimension will be based on the aspect ratio
     *
     * @param int $w - minTileWidth
     * @param int $h - minTileHeight
     * @return array - [minTileWidth, minTileHeight] - includes gutter
     */
    private function calcMinTileDimensions($w, $h)
    {
        if (!$w && !$h) {
            // if neither $w nor $h are set, then set $w to 1
            $w = 1;
        }
        if (!$w) {
            // minTileWidth is not set
            $this->minTileHeight = $h + $this->gutter;
            $this->minTileWidth = $this->minTileHeight * $this->tileAspectRatio;
        } else {
            // minTileHeight is not set
            $this->minTileWidth = $w + $this->gutter;
            $this->minTileHeight = $this->minTileWidth / $this->tileAspectRatio;
        }
        return [$this->minTileWidth, $this->minTileHeight];
    }

    /**
     * Calculate tile positions
     * @param array $properties - [tileWidth, tileHeight, columns, rows]
     * @return array - tilePositions - [x, y, rowIndex, colIndex]
     */
    private function calcTilePositions($properties)
    {
        $tileWidth = $properties['tileWidth'];
        $tileHeight = $properties['tileHeight'];
        $columns = $properties['columns'];
        $rows = $properties['rows'];
        $tilePositions = [];
        for ($i = 0; $i < count($this->tiles); $i++) {
            $tilePositions[] = $this->calcTilePosition($columns, $tileWidth, $tileHeight, $i);
        }
        return $tilePositions;
    }

    /**
     * Calculate tile position
     * (used in calcTilePositions method)
     * @param int $columns
     * @param int $tileWidth
     * @param int $tileHeight
     * @param int $i
     * @return array - [x, y, rowIndex, colIndex]
     */
    private function calcTilePosition($columns, $tileWidth, $tileHeight, $i)
    {
        $colIndex = $i % $columns;
        $rowIndex = floor($i / $columns);
        $gutter = $this->gutter;

        $x = $colIndex * ($tileWidth + $gutter);
        $y = floor($i / $columns) * ($tileHeight + $this->gutter);
        // add initial gutter to x,y
        $x += $gutter;
        $y += $gutter;
        return [$x, $y, $rowIndex, $colIndex];
    }

    /**
     * Get tile properties
     * For each try, the tile properties are calculated,
     * i.e. the tile width, tile height, columns, rows, and tile positions
     * @return array tile properties
     */
    private function getTileProperties()
    {
        [$tileWidth_noGutter, $tileHeight_noGutter] = $this->getTileDimensions();
        // calc columns and rows
        $columns = $this->getTileGridColumns($tileWidth_noGutter);
        $rows = ceil(count($this->tiles) / $columns);
        // save the try data
        $this->tries[] = [
            'tileWidth' => $tileWidth_noGutter,
            'tileHeight' => $tileHeight_noGutter,
            'columns' => $columns,
            'rows' => $rows,
        ];
        // save the tile positions for the try
        $this->positions = $this->calcTilePositions([
            'tileWidth' => $tileWidth_noGutter,
            'tileHeight' => $tileHeight_noGutter,
            'columns' => $columns,
            'rows' => $rows,
        ]);

        return [
            'tileWidth' => $tileWidth_noGutter,
            'tileHeight' => $tileHeight_noGutter,
            'columns' => $columns,
            'rows' => $rows,
        ];
    }

    /**
     * Get tile grid columns
     *
     * this should take into account the gutter
     *
     * @param int $tileWidth
     * @return int columns
     */
    private function getTileGridColumns($tileWidth)
    {
        $columnsPerRow = round(($this->screenWidth - $this->gutter) / ($tileWidth + $this->gutter));
        if (count($this->tiles) < $columnsPerRow - 1) {
            throw new Exception('Tile width and number of tiles cannot fill the container width');
        }
        return $columnsPerRow;
    }

    /**
   * Get tile dimensions
   * @return Array<float> - [width, height]
   */
    private function getTileDimensions()
    {
        $width = $this->bestGuessTileHeight * $this->tileAspectRatio;
        $height = $this->bestGuessTileHeight;
        if($width <= 0) {
            throw new Exception('width must be greater than 0');
        }
        if($height <= 0) {
            throw new Exception('height must be greater than 0');
        }
        return [$width, $height];
    }

    /**
     * Get the removed tiles
     * @return array Removed tiles
     */
    public function getTilesRemoved()
    {
        return $this->removedTiles;
    }

    /**
     * Check if tiles were removed
     * @return bool True if tiles were removed, false otherwise
     */
    public function getWereTilesRemoved()
    {
        return count($this->removedTiles) > 0;
    }

    private function isPrime(int $n)
    {
        if($n <= 1) {
            return false;
        }
        for($i = 2; $i < $n; $i++) {
            if($n % $i === 0) {
                return false;
            }
        }
        return true;
    }
}

class PackerException extends Exception
{
    private $description;
    public function __construct($message, $description)
    {
        parent::__construct($message);
        $this->description = $description;
    }
    public function getDescription()
    {
        return $this->description;
    }
}
