# Rectangle Packer v2.0.0

Rectangle Packer is a JavaScript class designed to efficiently pack rectangles into a defined space, tackling the NP-hard bin packing problem using a heuristic algorithm.

## Introduction

This class provides a solution to the problem of packing a fixed number of rectangles with a given aspect ratio into a specified screen area, aiming to find the maximal tile size that fits the space. The algorithm employs a heuristic approach, iteratively adjusting tile sizes until a suitable solution is found or a predefined try limit is reached.

## Purpose

I designed this algorithm in order to solve the problem of filling up different screen areas with a grid of videos where only the aspect ratio and number of videos was known. I couldn't achieve the desired effect with layout algorithms native to browser and even so, I needed an implementation that could work on the server. The algorithm outputs the (x,y) positions for each `tile` of the grid, allowing you to arrange your grid based on the coo-rdinates produced.

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
  tiles: new Array.from({ length: 20 }),
  tileAspectRatio: 0.75,
  gutter: 5,
  completeRectangle: false,
  canRemoveTiles: false,
});

const result = packer.calcTileProperties();
console.log(result);
```

## Test the RectanglePacker online

If you'd like to take the algorithm for a spin, you can find a testing application at [https://aslamhus.github.io/RectanglePacker/example](https://aslamhus.github.io/RectanglePacker/example)

Play with different screen areas, numbers of tiles, gutter size, tile aspect ratio and more.

## License

This Rectangle Packer class is licensed under the [MIT License](LICENSE). Feel free to use and modify it according to your needs.

## Acknowledgments

Special thanks to @aslamhus for the original implementation of the algorithm.
