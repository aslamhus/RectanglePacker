import RectanglePacker from '../src//RectanglePacker.js';

let tiles = createTilesArray(15);

let currentOptions,
  packer,
  shouldShowErrors = false;
const defaultOptions = {
  minTileHeight: 50,
  maxTileHeight: 200,
  completeRectangle: true,
  tileAspectRatio: 4 / 5,
  gutter: 5,
  columns: null,
  canRemoveTiles: false,
};
const options = {
  mobile: {
    ...defaultOptions,
    tiles: createTilesArray(15),
    screenArea: [720, 1280],
  },
  laptop: {
    ...defaultOptions,
    tiles: createTilesArray(18),
    screenArea: [1366, 720],
  },
  other: {
    ...defaultOptions,
    screenArea: [720, 480],
    tiles: createTilesArray(15),
  },
};

function getSavedOptions() {
  const savedOptions = localStorage.getItem('savedOptions');
  if (savedOptions) {
    return JSON.parse(savedOptions);
  }
  return null;
}

window.onload = function () {
  // get last options or use default
  currentOptions = getSavedOptions() || options.other;
  // console.log('currentOptions', currentOptions);
  // create packer
  packer = new RectanglePacker({
    ...currentOptions,
    // onError: reportError
  });
  // render the html structure to render div
  const renderDiv = document.getElementById('render');
  renderHTML(renderDiv);
  // render the rectangle packing
  renderRectanglePacking(currentOptions);
  // add events
  addEvents();
};

function saveOptions() {
  const quotaLimit = 5242880;
  if (currentOptions.tiles.length > quotaLimit) {
    alert('Tiles limit for this demo app reached, please reduce the number of tiles');
    return;
  }
  localStorage.setItem('savedOptions', JSON.stringify(currentOptions));
}

function createScreenArea() {
  const container = document.createElement('div');
  container.id = 'screen-area-container';
  const screen = document.createElement('div');
  screen.id = 'screen-area';
  container.appendChild(screen);
  return container;
}

/**
 * Copy or remove tiles from the tiles array to create a new array based on the number of tiles
 * @param {number} numberOfTiles
 * @returns
 */
function createTilesArray(numberOfTiles) {
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
}

/**
 * Renders the rectangle packer into the screen area
 *
 * @param {*} options
 * @param {number} [tryIndex]
 * @returns
 */
function renderRectanglePacking(options, tryIndex = 0) {
  const { screenArea } = options;
  // empty screen area
  const screenAreaElement = document.querySelector('#screen-area');
  screenAreaElement.innerHTML = '';
  // set the screen area size
  screenAreaElement.style.width = `${screenArea[0]}px`;
  screenAreaElement.style.height = `${screenArea[1]}px`;
  // get tile properties
  let properties;
  if (options.properties) {
    // for analyzing tries
    properties = options.properties;
    // set current options
    currentOptions = { ...options };
  } else {
    properties = resetPacker();
  }
  if (properties?.error) {
    const { error, correction, errorDescription } = properties;
    // console.log('tryProperties', properties);
    setCurrentError(`Try # ${tryIndex} : ${error}`, correction, errorDescription);
    showCurrentError();
  } else {
    hideCurrentError();
  }
  // update tries range if not passed in
  if (!options.properties) {
    const triesRange = document.querySelector('#tries-range');
    triesRange.max = packer.tries.length;
  }
  // create and render tiles
  screenAreaElement.innerHTML = '';
  if (!properties) return;
  screenAreaElement.append(...createTiles(properties));
}

function resetPacker() {
  let properties;
  packer.reset();
  packer.setOptions(currentOptions);
  // get new properties
  try {
    properties = packer.calcTileProperties();
  } catch (error) {
    console.error(error);
    handlePackingFailure(error);
    setCurrentError(error.message);
    showCurrentError();
  }
  // reset the tries range
  const triesRange = document.querySelector('#tries-range');
  triesRange.max = packer.tries.length;
  triesRange.value = packer.tries.length;
  return properties;
}

function renderHTML(renderDiv) {
  const appContainer = createAppContainer();
  // create sidebar
  const sideBar = createSidebar();
  sideBar.appendChild(createOptionsContainer());
  sideBar.appendChild(createTriesRange());
  sideBar.appendChild(createResultContainer());

  // create screen area
  const screenArea = createScreenArea();
  // create error container and append to screen area
  screenArea.appendChild(createCurrentErrorContainer());
  // append to app container

  appContainer.appendChild(screenArea);
  appContainer.appendChild(sideBar);
  // append to render div
  renderDiv.appendChild(appContainer);
}
function createTriesRange() {
  const container = document.createElement('div');
  container.id = 'tries-range-container';
  // create title for range
  const title = document.createElement('h4');
  title.innerText = 'Tries Slider';
  // create description
  const description = document.createElement('p');
  description.innerText = 'Slide to view individual iterations';
  // create range
  const triesRange = document.createElement('input');
  triesRange.id = 'tries-range';
  triesRange.type = 'range';
  triesRange.min = 0;
  triesRange.max = packer.tries.length;
  triesRange.value = packer.tries.length;
  triesRange.oninput = function (event) {
    const tryIndex = event.target.value - 1;
    const tryProperties = packer.tries[tryIndex];

    if (!tryProperties) return;

    renderRectanglePacking({ ...currentOptions, properties: tryProperties }, tryIndex + 1);
    // create tiles based on   range index and tries array value
  };
  // append
  container.append(title, description, triesRange);
  return container;
}

/**
 * Create Tiles based on the properties
 * @param {*} properties
 * @returns  Array of tile elements
 */
function createTiles(properties) {
  if (!properties) return;
  // destructure properties
  const tileElements = [];
  const { tileWidth, tileHeight, columns, rows, tiles, positions } = properties;
  // console.log('display tiles', tiles.length);
  // display the result
  // console.log('positions', tileWidth, positions);
  if (!positions) return;
  // iterate through the number of tiles
  for (let i = 0; i < positions.length; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.style.width = `${tileWidth}px`;
    tile.style.height = `${tileHeight}px`;
    // add tile video if it exists
    if (tiles[i]) {
      const img = document.createElement('img');
      img.src = tiles[i];
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      // const video = document.createElement('video');
      // video.src = tiles[i];
      // video.autoplay = false;
      // video.loop = false;
      // video.muted = true;
      // video.style.width = '100%';
      // video.style.height = '100%';
      // video.style.objectFit = 'cover';

      tile.appendChild(img);
    }
    // position the tile
    const [x, y] = positions[i];
    tile.style.left = `${x}px`;
    tile.style.top = `${y}px`;
    // add tile number
    const tileNumber = document.createElement('div');
    tileNumber.classList.add('tile-number');
    tileNumber.innerText = i + 1;
    tile.appendChild(tileNumber);
    // check for errors
    if (x + tileWidth > packer.screenWidth) {
      // reportError(`• Tile ${i + 1} is positioned outside the screen area`, false, false);
      tile.classList.add('error');
    }
    if (y + tileHeight > packer.screenHeight) {
      // reportError(`• Tile ${i + 1} is positioned outside the screen area`, false, false);
      tile.classList.add('error');
    }
    tileElements.push(tile);
  }
  if (properties?.tries) {
    // report the result

    const triesRange = document.querySelector('#tries-range');
    const currentTryIndex = triesRange.value;
    const performanceTime = properties.tries[currentTryIndex - 1]?.performanceTime;
    const success = properties.error ? false : true;
    reportResult(
      tiles,
      defaultOptions.tileAspectRatio,
      tileWidth,
      tileHeight,
      columns,
      rows,
      packer.screenArea,
      performanceTime,
      properties.tries,
      currentTryIndex,
      success
    );
  }
  return tileElements;
}

function createCurrentErrorContainer() {
  const container = document.createElement('div');
  container.id = 'current-error-container';
  container.classList.add('hidden');
  const currentError = document.createElement('div');
  currentError.id = 'current-error';
  container.appendChild(currentError);
  return container;
}

function setCurrentError(error, correction = null, description = null) {
  const currentError = document.querySelector('#current-error');
  currentError.innerHTML = `${error}`;
  if (correction) {
    currentError.innerHTML += `<div class='correction'>Correction: ${correction}</div>`;
  }
  if (description) {
    const { guess, predicate, data, discrepancy } = description;
    // console.log('discrepancy', discrepancy);
    currentError.innerHTML += `<div class='error-description'>

    <p>Guess: ${guess}</p>
    <p>Predicate: ${predicate}</p>
    <p>Discrepancy: ${discrepancy?.map((value) => value.toFixed(2)).toString()}</p>
    </p>`;
  }

  // <p>Data: ${JSON.stringify(data)}</p>
}

function hideCurrentError() {
  const currentErrorContainer = document.querySelector('#current-error-container');
  currentErrorContainer.classList.add('hidden');
}

function showCurrentError() {
  const currentErrorContainer = document.querySelector('#current-error-container');
  currentErrorContainer.classList.remove('hidden');
}

function createAppContainer() {
  const appContainer = document.createElement('div');
  appContainer.id = 'app-container';
  return appContainer;
}

function createSidebar() {
  const sideBar = document.createElement('div');
  sideBar.id = 'sidebar';
  // title container
  const titleContainer = document.createElement('div');
  titleContainer.id = 'sidebar-title-container';

  // title
  const sideBarTitle = document.createElement('h2');
  sideBarTitle.innerText = 'Rectangle Packer v2.0.0';
  // description
  const sideBarDescription = document.createElement('p');
  sideBarDescription.innerText = 'by @aslamhus';
  // append to title container
  titleContainer.append(sideBarTitle, sideBarDescription);
  sideBar.append(titleContainer);
  return sideBar;
}

function createGuessContainer() {
  const guessContainer = document.createElement('div');
  guessContainer.id = 'guess-container';
  // create guess input
  const guessInput = document.createElement('input');
  guessInput.id = 'guess-input';
  guessInput.type = 'number';
  guessInput.value = 0;

  // create guess button
  const guessButton = document.createElement('button');
  guessButton.id = 'guess-button';
  guessButton.innerText = 'Guess';
  guessButton.onclick = function () {
    performanceStartTime = performance.now();
    packer.reset();
    renderRectanglePacking(currentOptions);
  };
  // append
  guessContainer.appendChild(guessInput);
  guessContainer.appendChild(guessButton);
  return guessContainer;
}

function createOptionsContainer() {
  const optionsContainer = document.createElement('div');
  optionsContainer.id = 'options-container';
  // create screen area width and height input
  const screenAreaContainer = document.createElement('div');
  screenAreaContainer.id = 'screen-area-option-container';
  const label = document.createElement('label');
  label.innerText = 'Screen area';
  const dimensionsContainer = document.createElement('div');
  dimensionsContainer.id = 'dimensions-container';

  const screenAreaWidthInput = document.createElement('input');
  screenAreaWidthInput.id = 'screen-area-width-input';
  screenAreaWidthInput.type = 'number';
  screenAreaWidthInput.value = currentOptions.screenArea[0];
  const screenAreaHeightInput = document.createElement('input');
  screenAreaHeightInput.id = 'screen-area-height-input';
  screenAreaHeightInput.type = 'number';
  screenAreaHeightInput.value = currentOptions.screenArea[1];
  // append to dimensions container
  dimensionsContainer.append(screenAreaWidthInput, screenAreaHeightInput);
  screenAreaContainer.append(label, dimensionsContainer);
  // create toggle hide video input
  const hideVideoContainer = document.createElement('div');
  hideVideoContainer.id = 'hide-video-container';
  hideVideoContainer.classList.add('checkbox-container');
  const hideVideoLabel = document.createElement('label');
  hideVideoLabel.innerText = 'Hide video';
  const hideVideoInput = document.createElement('input');
  hideVideoInput.id = 'hide-video-input';
  hideVideoInput.type = 'checkbox';
  hideVideoInput.onchange = function (event) {
    document.body.classList.toggle('hide-video');
  };
  hideVideoContainer.append(hideVideoLabel, hideVideoInput);

  // create tiles input
  const tilesContainer = document.createElement('div');
  const tilesLabel = document.createElement('label');
  tilesLabel.innerText = 'Number of tiles';
  const tilesInput = document.createElement('input');
  tilesInput.id = 'tiles-input';
  tilesInput.type = 'number';
  tilesInput.value = currentOptions.tiles.length;
  tilesContainer.append(tilesLabel, tilesInput);
  // create gutter input
  const gutterContainer = document.createElement('div');
  const gutterLabel = document.createElement('label');
  gutterLabel.innerText = 'Gutter';
  const gutterInput = document.createElement('input');
  gutterInput.id = 'gutter-input';
  gutterInput.type = 'number';
  gutterInput.value = currentOptions.gutter;
  gutterContainer.append(gutterLabel, gutterInput);
  // create min tile height input
  const minTileHeightContainer = document.createElement('div');
  const minTileHeightLabel = document.createElement('label');
  minTileHeightLabel.innerText = 'Min tile height';
  const minTileHeightInput = document.createElement('input');
  minTileHeightInput.id = 'min-tile-height-input';
  minTileHeightInput.type = 'number';
  minTileHeightInput.value = currentOptions.minTileHeight;
  minTileHeightContainer.append(minTileHeightLabel, minTileHeightInput);
  // create max tile height input
  const maxTileHeightContainer = document.createElement('div');
  const maxTileHeightLabel = document.createElement('label');
  maxTileHeightLabel.innerText = 'Max tile height';
  const maxTileHeightInput = document.createElement('input');
  maxTileHeightInput.id = 'max-tile-height-input';
  maxTileHeightInput.type = 'number';
  maxTileHeightInput.value = currentOptions.maxTileHeight;
  maxTileHeightContainer.append(maxTileHeightLabel, maxTileHeightInput);
  // create columns input
  const columnsContainer = document.createElement('div');
  const columnsLabel = document.createElement('label');
  columnsLabel.innerText = 'Columns';
  const columnsInput = document.createElement('input');
  columnsInput.id = 'columns-input';
  columnsInput.type = 'number';
  columnsInput.value = currentOptions.columns ?? '0';
  columnsContainer.append(columnsLabel, columnsInput);
  // create complete rectangle input
  const completeRectangleContainer = document.createElement('div');
  completeRectangleContainer.classList.add('checkbox-container');
  const completeRectangleLabel = document.createElement('label');
  completeRectangleLabel.innerText = 'Complete rectangle';
  const completeRectangleInput = document.createElement('input');
  completeRectangleInput.id = 'complete-rectangle-input';
  completeRectangleInput.type = 'checkbox';
  completeRectangleInput.checked = currentOptions.completeRectangle;
  completeRectangleContainer.append(completeRectangleLabel, completeRectangleInput);
  // can remove tiles input
  const canRemoveTilesContainer = document.createElement('div');
  canRemoveTilesContainer.classList.add('checkbox-container');
  const canRemoveTilesLabel = document.createElement('label');
  canRemoveTilesLabel.innerText = 'Can remove tiles';
  const canRemoveTilesInput = document.createElement('input');
  canRemoveTilesInput.id = 'can-remove-tiles-input';
  canRemoveTilesInput.type = 'checkbox';
  canRemoveTilesInput.checked = currentOptions.canRemoveTiles;
  canRemoveTilesContainer.append(canRemoveTilesLabel, canRemoveTilesInput);

  // create submit button
  const submitButton = document.createElement('button');
  submitButton.id = 'submit-button';
  submitButton.innerText = 'Update';
  submitButton.onclick = function () {
    // reset guess input
    const guessInput = document.querySelector('#guess-input');
    if (guessInput) guessInput.value = 0;
    // clear best guess
    currentOptions = {
      ...defaultOptions,
      tiles: createTilesArray(tilesInput.value),
      screenArea: [parseInt(screenAreaWidthInput.value), parseInt(screenAreaHeightInput.value)],
      gutter: parseInt(gutterInput.value),
      minTileHeight: parseInt(minTileHeightInput.value),
      maxTileHeight: parseInt(maxTileHeightInput.value),
      columns: parseInt(columnsInput.value),
      completeRectangle: completeRectangleInput.checked,
      canRemoveTiles: canRemoveTilesInput.checked,
    };
    // save options to local storage
    saveOptions();
    // set current options
    renderRectanglePacking(currentOptions);
  };
  // append
  optionsContainer.append(
    screenAreaContainer,
    tilesContainer,
    gutterContainer,
    minTileHeightContainer,
    maxTileHeightContainer,
    columnsContainer,
    completeRectangleContainer,
    canRemoveTilesContainer,
    hideVideoContainer,

    submitButton
    // hide guess container for now until we really need it
    // createGuessContainer()
  );
  return optionsContainer;
}

function createResultContainer() {
  const resultContainer = document.createElement('div');
  resultContainer.id = 'result-container';
  // create result
  const result = document.createElement('div');
  result.id = 'result';
  resultContainer.appendChild(result);
  // create error container
  const errorContainer = document.createElement('div');
  errorContainer.id = 'error-container';
  errorContainer.classList.add('hidden');
  // create error title
  const errorTitle = document.createElement('h3');
  errorTitle.innerText = 'Errors';
  // append to error container
  errorContainer.append(errorTitle);
  // create ordered list
  const orderedList = document.createElement('ol');
  errorContainer.appendChild(orderedList);
  // append to result container
  resultContainer.appendChild(errorContainer);
  return resultContainer;
}

function handlePackingFailure(error) {
  console.error('Failed to pack', error);
  // clear the result
  const resultContainer = document.querySelector('#result-container #result');
  resultContainer.classList.remove('success');
  resultContainer.innerHTML = '';
  //  add error
  resultContainer.innerHTML = `
  <h4>Failed to pack</h4>
  <p>${error.message}</p>
  `;
  // add error class to parent
  resultContainer.parentElement.classList.add('error');
}

function reportErrors(tries, currentTryIndex = 0) {
  if (!tries) return;
  // clear error container
  const errorContainer = document.querySelector('#error-container ol');
  errorContainer.innerHTML = '';
  // iterate through the tries and report errors
  tries.slice(0, currentTryIndex).forEach((tryObject, index) => {
    if (tryObject.error) {
      const isCurrentTry = index === currentTryIndex - 1;
      reportError(tryObject.error, isCurrentTry);
    }
  });
}

function reportError(errorMessage, isCurrentTry = false, isNewListItem = true) {
  // console.log('error', errorMessage);
  const errorList = document.querySelector('#error-container ol');
  const errorElement = document.createElement(isNewListItem ? 'li' : 'div');
  errorElement.classList.add('error');
  if (isCurrentTry) {
    errorElement.classList.add('current-try');
  }
  errorElement.innerText = errorMessage;
  errorList.appendChild(errorElement);
  // errorCount++;
}

function reportResult(
  tiles,
  tileAspectRatio,
  tileWidth,
  tileHeight,
  columns,
  rows,
  screenArea,
  performanceTime,
  tries,
  currentTryIndex,
  success = false
) {
  // console.log('report result', tries);
  // report errors
  reportErrors(tries, currentTryIndex);
  const results = document.querySelector('#result-container #result');
  // report all the values
  let title = 'Current iteration';

  results.classList.remove('success');
  if (success) {
    title = 'Success!';
    results.classList.add('success');
  }
  results.innerHTML = `<h4>${title}</h4> `;

  if (currentOptions.canRemoveTiles) {
    results.innerHTML += `<p >Tiles removed: ${packer.getTilesRemoved()?.length ?? 0}</p>`;
  }

  // create details (report all values)
  const details = createDetailsReport(
    tiles,
    tileAspectRatio,
    tileWidth,
    tileHeight,
    columns,
    rows,
    screenArea,
    performanceTime
  );
  // hide errors
  const errors = document.querySelector('#error-container');
  errors.classList.add('hidden');
  // show result button
  const showResultButton = document.createElement('button');
  let showResultButtonText = 'Show details and errors +';
  showResultButton.innerText = showResultButtonText;
  // show / hide details and errors
  showResultButton.onclick = function () {
    // toggle hidden classes
    details.classList.toggle('hidden');
    const errors = document.querySelector('#error-container');
    errors.classList.toggle('hidden');
    // toggle button text
    if (details.classList.contains('hidden')) {
      showResultButton.innerText = showResultButtonText;
      shouldShowErrors = false;
    } else {
      ('Hide -');
      shouldShowErrors = true;
    }
  };
  // append to result container
  results.append(showResultButton, details);
  // show result container
  if (shouldShowErrors) {
    showResultButton.click();
  }
}

function createDetailsReport(
  tiles,
  tileAspectRatio,
  tileWidth,
  tileHeight,
  columns,
  rows,
  screenArea,
  performanceTime
) {
  const details = document.createElement('div');
  details.id = 'details';
  details.classList.add('hidden');
  details.innerHTML = `<h3>Tile details</h3>
  <p>Tile aspect ratio: ${tileAspectRatio}</p>
  <p>Tile width: ${tileWidth?.toFixed(2)}px</p>
  <p>Tile height: ${tileHeight?.toFixed(2)}px</p>
  <p>Tiles removed: ${packer.getTilesRemoved()?.length ?? 0}</p>

  <h3>Grid details</h3>
  <p>Screen area: ${screenArea[0]}x${screenArea[1]}</p>
  <p>Columns: ${columns}</p>
  <p>Rows: ${rows}</p>

  <h3>Performance</h3>
  <p>Performance time: ${performanceTime.toFixed(2)}ms</p>
  <p>Tries: ${packer?.tries?.length ?? 0}</p>
  <p>First best guess tile height: ${packer?.initialBestGuessTileHeight.toFixed(2)}</p>
  
  `;

  return details;
}

function addEvents() {
  window.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      // go to the next or previous try
      const triesRange = document.querySelector('#tries-range');
      if (event.key === 'ArrowRight') {
        triesRange.value = parseInt(triesRange.value) + 1;
      }
      if (event.key === 'ArrowLeft') {
        triesRange.value = parseInt(triesRange.value) - 1;
      }
      // dispatch input event
      const inputEvent = new Event('input');
      triesRange.dispatchEvent(inputEvent);
    }
  });
}
