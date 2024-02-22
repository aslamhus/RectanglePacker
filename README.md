# Rectangle Packer

`RectanglePacker` is a JavaScript\PHP class designed to efficiently pack rectangles of the same aspect ratio into a defined space, tackling the NP-hard bin packing problem using a heuristic algorithm. For more information on the this problem see the [wiki](https://en.wikipedia.org/wiki/Rectangle_packing). This heuristic solves the second variant listed in the article, _**Packing identical squares in a rectilinear polygon.**_

## Defining the problem

I designed this algorithm in order to maximally **fill** the horizontal and vertical space within different screen areas with a grid of tiles where only the aspect ratio was known and the number of videos was variable. In my use case, the aspect ratio was 4/5.

![a visual description of the problem](/rectangle-packer-problem.jpg)

### CSS Layout Algorithms

I couldn't achieve the desired effect with browser layout algorithms like css `flexbox` or `grid`. Neither could maximally fill containers both horizontally and vertically without either explicitly setting a height/width value for a flex/grid-item or using javascript to correct the layout (though I would love to see someone prove me wrong!). Regardless, I needed an implementation that could work on the server, not the client side.

### Try the algorithm visualizer online

If you'd like to take the algorithm for a spin, you can find a testing application online which visualizes the packer at work: [https://aslamhus.github.io/RectanglePacker/example](https://aslamhus.github.io/RectanglePacker/example)

Play with different screen areas, numbers of tiles, gutter size, tile aspect ratio and more.

## Usage

This class is available in `JavaScript` and `PHP` for client and server implementation.

### JavaScript

Clone the repo and import from the src directory. If requested, I'll make this available as an npm package.

#### Clone the repo

```bash
git clone https://github.com/aslamhus/RectanglePacker.git
```

#### Import and use

```javascript
import RectanglePacker from '../RectanglePacker/src/RectanglePacker.js';

const packer = new RectanglePacker({
  screenArea: [480, 480],
  tiles: [1, 2, 3, 4, 5],
  tileAspectRatio: 4 / 5,
});
const result = packer.pack();
```

### PHP

#### install with composer

```bash
composer require aslamhus/rectpacker
```

### Use

```php
$rectPacker = new Aslamhus\RectPacker\RectPacker([
  'screenArea' => [480,480],
  'tiles' => [1,2,3,4,5],
  'tileAspectRatio' => 4/5
])
$result = $rectPacker->pack();
```

### Result

The heuristic outputs the (x,y) `positions` for each tile of the grid, allowing you to arrange your grid based on the coordinates therein. The result of the heuristic, if successful, will be an object (or in the PHP class an associative array) with the following keys:

```javascript
const {
  tileWidth : 0, // the width of each tile (excluding gutter)
  tileHeight: 0, // the height of each tile (excluding the gutter)
  columns: 0, // the grid columns
  rows: 0, // the grid rows
  realWidth: 0 // the width of the grid (including gutter)
   realHeight: 0, // the height of the grid  (including gutter)
  positions: [], // an array of positions corresponding to the tiles array you gave in the constructor. Each tile has an (x,y) coordinate according to its position in the grid
  tiles: [], // the original tiles array you supplied in the constructor
  tries : [], // an array with data for each iteration of the packer providing granular analysis of the heuristic
} = result;
```

If unsuccessful, `RectanglePacker` will throw an error.

## Options

The `RectanglePacker` algorithm's behaviour can be configured with the following options which can be set when initializing an instance of the `RectanglePacker` or when calling the `setOptions` method to reinitialize the algorithm. Below is a detailed description of each configurable option:

## Required parameters

### `screenArea`

- **Description:** Specifies the dimensions of the screen area where rectangles need to be packed.
- **Type:** Array of two numbers representing width and height.

### `tiles`

- **Description:** An array of strings representing the source of each tile.
- **Type:** Array of strings.

### `tileAspectRatio`

- **Description:** The fixed aspect ratio of the tiles.
- **Type:** Number.

## Constraints (Optional)

### `gutter`

- **Description:** The spacing between tiles.
- **Type:** Number.
- **Default Value:** 0.

### `minTileWidth`

- **Description:** The minimum width of each tile.
- **Type:** Number.
- **Default Value:** 0.

### `minTileHeight`

- **Description:** The minimum height of each tile.
- **Type:** Number.
- **Default Value:** 0.

### `maxTileHeight`

- **Description:** The maximum height of each tile.
- **Type:** Number.
- **Default Value:** 0.

### `columns`

- **Description:** The fixed number of columns. If set, the best guess for tile height will be calculated based on the columns.
- **Type:** Number.
- **Default Value:** 0.

### `allowIncompleteRow`

- **Description:** If set to true, the heuristic will allow an incomplete row when there are less tiles available than specified by the columns constraint. For instance, if you have specified that the tiles should be arranged to fit the screen area with 8 columns, but you only have 3 tiles, `allowIncompleteRow` will arrange the tiles horizontally as if there were enough tiles to obey the columns constraint. Without `allowIncompleteRow` the algorith would throw the `Could not satisfy columns constraint` or `Underflow Screen Width` error/exception.
- **Type:** Boolean.
- **Default Value:** false.

### `completeRectangle`

- **Description:** If set to true, the heuristic will try to make the rectangle complete, i.e., all rows will be full.
- **Type:** Boolean.
- **Default Value:** false.

### `canRemoveTiles`

- **Description:** If set to true, tiles will be removed if the solution is not possible.
- **Type:** Boolean.
- **Default Value:** false.

### `tryLimit`

- **Description:** The maximum number of tries before the heuristic gives up.
- **Type:** Number.
- **Default Value:** 800.

### `errorMargin`

- **Description:** The error margin for tile dimensions.
- **Type:** Number.
- **Default Value:** 0.01.

### `performanceLimit`

- **Description:** The limit for performance in milliseconds.
- **Type:** Number.
- **Default Value:** 1000.

### `debug`

- **Description:** If set to true, debug information will be logged to the console.
- **Type:** Boolean.
- **Default Value:** false.

## Callback Option

### `onError`

- **Description:** Callback function to handle errors. It receives an error message as a parameter.
- **Type:** Function.
- **Default Value:** null.

### Example

```javascript
const options = {
  screenArea: [800, 600],
  tiles: ['tile1.jpg', 'tile2.jpg', 'tile3.jpg'],
  tileAspectRatio: 0.75,
  gutter: 5,
  columns: 0, // 0 means no fixed columns
  allowIncompleteRow: false,
  completeRectangle: false,
  canRemoveTiles: false,
  tryLimit: 800,
  errorMargin: 0.01,
  performanceLimit: 1000,
  debug: false,
  onError: (error) => console.error(error),
};

const packer = new RectanglePacker(options);
const result = packer.pack();
console.log(result);
```

## Efficiency

Though I have not extensively measured the time complexity of the algorithm, most
cases are solved within 1-4 milliseconds and 1 - 10 iterations. As you add more constraints, the time complexity will increase. When I have time (haha!) I would love to measure this more precisely. Feedback/observations are welcome!

## Potential Improvements

### Metaheuristic

Run the heuristic multiple times with different starting best guesses, potentially leveraging web workers for efficiency if necessary. Develop a method to measure the viability of the solutions, with remaining space as the main criterion.

## Unit Testing

`RectanglePacker` repo includes a `json` file with an array of test values, each with expected outputs. You can test both the `PHP` and `JavaScript` implentations of the algorithm with these test values.

### PHPUnit tests

```php
composer run test-rect-packer
```

### JavaScript tests

```bash
npm run test
```

### Note on gutter accuracy \ Browser sub-pixel rounding

In the testing application the gutter may appear off by a pixel or two. This is because the browser rounds pixel values. If the gutter is small and each tile width is rounded up or down (depending on your browser), the gutter at the end of each row will appear truncated. This is a known issue and not a bug in the algorithm. You can examine the tile positions in the result of the packer to confirm that the gutter values are correct. At a later date, I will attempt to account for this pixel rounding issue in the JavaScript implementation of the algorithm.

## License

This Rectangle Packer class is licensed under the [MIT License](LICENSE). Feel free to use and modify it according to your needs.

### Happy Packing!!
