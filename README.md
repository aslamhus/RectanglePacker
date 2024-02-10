# Rectangle Packer v2.0.0

Rectangle Packer is a JavaScript\PHP class designed to efficiently pack rectangles of the same aspect ratio into a defined space, tackling the NP-hard bin packing problem using a heuristic algorithm. For more information on the Rectangle Packing problem see this [wikipedia articles](https://en.wikipedia.org/wiki/Rectangle_packing). This heuristic solves the second variant listed in the wikipedia article, "Packing identical squares in a rectilinear polygon".

## Purpose

I designed this algorithm in order to solve the problem of filling up different screen areas with a grid of videos where only the aspect ratio and number of videos was known. I couldn't achieve the desired effect with layout algorithms native to browser and even so, I needed an implementation that could work on the server. The algorithm outputs the (x,y) positions for each `tile` of the grid, allowing you to arrange your grid based on the coordinates produced.

### Usage

This class is available in `JavaScript` and `PHP` for client and server implementation. Find both classes in the src directory.

## Requirements

To utilize the heuristic algorithm, the following data is required:

- `screenArea`: The dimensions of the screen area (width, height).
- `tiles`: An array of tile sources.
- `tileAspectRatio`: The aspect ratio of the tiles.

## Options

The heuristic can be further controlled and restricted by various options:

- `gutter`: The spacing between tiles.
- `minTileWidth` and `minTileHeight`: Minimum dimensions for tiles.
- `columns`: A fixed number of columns to guide the tile size.
- `completeRectangle`: If true, the algorithm aims to make the rectangle complete by filling all rows.
- `canRemoveTiles`: If true, the algorithm can remove tiles if a solution is not possible.
- `tryLimit`: The maximum number of tries before the algorithm gives up.
- `retryLimit`: The maximum number of retries before the algorithm gives up.

### Example

```javascript
const packer = new RectanglePacker({
  screenArea: [800, 600],
  tiles: Array.from({ length: 20 }),
  tileAspectRatio: 0.75,
  gutter: 5,
  completeRectangle: false,
  canRemoveTiles: false,
});

const result = packer.calcTileProperties();
console.log(result);
```

### Result

The result of the heuristic, if successful will be an object (or in the PHP class an associtaive array) with the following keys:

```javascript
const {
  tileWidth : 0, // the width of each tile (excluding gutter)
  tileHeight: 0, // the height of each tile (excluding the gutter)
  columns: 0, // the grid columns
  rows: 0, // the grid rows
  realHeight: 0, // the height of the grid of all the tiles (including gutter)
  realWidth: 0 // the width of the grid ...
  positions: [], // an array of positions corresponding to the tiles array you gave in the constructor. Each tile has an (x,y) coordinate according to its position in the grid
  tiles: [], // the original tiles array you gave in the constructor
  tries : [], // an array with data for each iteration of the packer providing granular analysis of the heuristic
} = result;
```

If unsuccessful, `calcTileProperties` will throw an error.

## Time Complexity

Though I have not extensively measured the time complexity of the algorithm, most
cases are solved within 1-4 milliseconds within 1 - 5 iterations. As you add more constraints, the time complexity will increase. When I have time I would love to measure this more precisely. Feedback/observations are welcome!

## Potential Improvements

### Simulated Annealing algorithm

Implement a simulated annealing approach - run the heuristic multiple times with different starting best guesses. Then create a method to measure the viability of the solutions, finally choosing the best. Currently, the heuristic iterates downwards from a large best guess, reducing the number of columns represented by the best guess tile height until a solution is found. This means that the optimal solution is sometimes missed.

## Test the RectanglePacker online

If you'd like to take the algorithm for a spin, you can find a testing application at [https://aslamhus.github.io/RectanglePacker/example](https://aslamhus.github.io/RectanglePacker/example)

Play with different screen areas, numbers of tiles, gutter size, tile aspect ratio and more.

\_\_\*Note on Gutter: the gutter may appear off by a pixel or two occasionally because the browser will round pixel values.

## License

This Rectangle Packer class is licensed under the [MIT License](LICENSE). Feel free to use and modify it according to your needs.
