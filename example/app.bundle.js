(()=>{"use strict";var e={60:(e,t,n)=>{n.d(t,{c:()=>c});var i=n(500),r=n.n(i),s=n(312),o=n.n(s)()(r());o.push([e.id,"* {\n  box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n}\nbody,\nhtml {\n  width: 100%;\n  height: 100%;\n  padding: 0;\n  font-size: 16px;\n  margin: 0;\n\n  font-family: sans-serif;\n}\n#render {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  flex-direction: column-reverse;\n  justify-content: center;\n  align-items: center;\n}\n#screen-area {\n  position: relative;\n  border: 1px solid black;\n  overflow: hidden;\n  flex-grow: 0;\n  flex-shrink: 0;\n  margin: 0.5rem;\n}\n.tile {\n  position: absolute;\n  display: inline-block;\n  margin: 0;\n  padding: 0;\n  background: rgb(157, 157, 157);\n  /* border: 1px solid rgb(31, 31, 31); */\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.tile .tile-number {\n  font-size: 0.8rem;\n  font-weight: bold;\n  color: white;\n}\n.tile.error {\n  background: lightcoral;\n}\n.tile video,\n.tile img {\n  position: absolute;\n}\n.hide-video .tile video,\n.hide-video .tile img {\n  display: none;\n}\n#result-container {\n  margin: 0;\n  /* position: absolute; */\n  bottom: 0;\n  left: 0;\n  padding: 0;\n  font-size: 1rem;\n  background: rgb(232, 231, 231);\n  width: 100%;\n  overflow: scroll;\n  height: auto;\n}\n#result-container ol {\n  padding-left: 1.5rem;\n}\n#result,\n#error-container {\n  padding: 1rem;\n}\n\n#result.success {\n  background: rgb(217, 245, 217);\n  color: rgb(7, 111, 7);\n}\n#result-container.error {\n  background: rgb(245, 217, 217);\n  color: rgb(111, 7, 7);\n}\n#result-container ol li.error {\n  color: rgb(181, 49, 49);\n}\n#result-container ol li.error.current-try {\n  background: rgb(235, 255, 87);\n}\n#result-container p {\n  margin: 0.15rem;\n}\n#result-container button {\n  background: rgba(255, 255, 255, 0.705);\n  color: gray;\n  /* color: inherit; */\n  /* text-align: left; */\n  font-size: 0.9rem;\n  border-color: rgba(0, 0, 0, 0.158);\n  cursor: pointer;\n}\n\nh3 {\n  font-weight: 100;\n  margin: 1rem 0;\n  border-bottom: 1px solid darkgray;\n}\n#guess-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n\n  margin: 20px 0;\n}\n#guess-container input:nth-of-type(1) {\n  margin-right: 0.4rem;\n}\n.checkbox-container {\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  justify-content: flex-start;\n  align-items: center;\n}\n.checkbox-container input {\n  flex-grow: 0;\n  flex-shrink: 1;\n  width: auto;\n}\n.checkbox-container label {\n  /* flex-grow: 1; */\n  flex-shrink: 0;\n  margin: 0;\n  padding: 0;\n  font-size: 1rem;\n  text-align: left;\n  margin-right: 0.5rem;\n}\n#options-container > div {\n  margin: 1rem 0;\n}\n#screen-area-option-container #dimensions-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n}\n#dimensions-container input:nth-of-type(1) {\n  margin-right: 0.4rem;\n}\nlabel {\n  font-weight: 500;\n  color: rgb(73, 73, 73);\n}\ninput,\nbutton {\n  font-size: 1rem;\n  margin: 0.5rem 0;\n  width: 100%;\n}\ninput {\n  flex-grow: 1;\n}\ninput[type='number']:focus,\ninput[type='text']:focus {\n  background-color: white;\n}\ninput[type='number'],\ninput[type='text'] {\n  background-color: rgba(249, 249, 249, 0.73);\n}\nbutton {\n  background-color: rgb(147, 202, 250);\n  cursor: pointer;\n  color: rgb(55, 98, 136);\n  font-weight: bold;\n  padding: 0.5rem 0;\n  border: none;\n  border-bottom: 4px solid rgb(143, 181, 214);\n}\nbutton:active {\n  transform: translateY(1px);\n}\nbutton:hover {\n  background-color: rgb(101, 163, 218);\n  color: white;\n}\n#options-container {\n  /* position: absolute;\n    top: 0;\n    left: 0; */\n  margin: 0;\n  background: rgb(214, 214, 214);\n  padding: 1rem;\n  font-size: 1rem;\n}\n/* Current error */\n#current-error-container {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  margin: 0.1rem;\n  padding: 1rem;\n  background: lightcoral;\n  color: white;\n  font-size: 1rem;\n  min-width: 40%;\n}\n#current-error-container .correction {\n  margin-top: 1rem;\n}\n#current-error-container .correction,\n#current-error .error-description {\n  font-size: 0.8rem;\n  margin-left: 0.5rem;\n  margin-right: 1rem;\n  color: rgba(255, 255, 255, 0.844);\n}\n\n#current-error-container .hidden {\n  display: none;\n}\n#app-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: space-between;\n  width: 100%;\n  height: 100%;\n}\n#sidebar {\n  position: relative;\n  top: 0;\n  right: 0;\n  background: transparent;\n  /* max-width: 300px; */\n  flex-basis: 10%;\n  height: 100%;\n  overflow: scroll;\n  min-width: 320px;\n}\n#sidebar-title-container {\n  padding: 1rem;\n  background: rgb(81, 139, 189);\n}\n#sidebar-title-container h2 {\n  margin: 0;\n  padding: 0;\n  font-size: 1.25rem;\n  color: rgb(255, 255, 255, 0.75);\n}\n#sidebar-title-container p {\n  margin: 0.25rem 0;\n  font-style: italic;\n  font-size: 0.9rem;\n\n  color: rgba(255, 255, 255, 0.642);\n}\n#screen-area-container {\n  position: relative;\n  flex-basis: 90%;\n  overflow: scroll;\n  display: block;\n  justify-content: flex-start;\n  align-items: flex-start;\n}\n.hidden {\n  display: none;\n}\n\n/* Tries range */\n#tries-range-container {\n  background: rgb(251, 251, 196);\n  padding: 1rem;\n  margin: 0;\n}\n#tries-range-container h4 {\n  color: rgb(143, 125, 7);\n  margin: 0;\n}\n#tries-range-container p {\n  margin: 0;\n  margin-top: 0.25rem;\n  padding: 0;\n  font-size: 0.9rem;\n  font-style: italic;\n  color: rgba(143, 125, 7, 0.579);\n}\n/** aspect ratio */\n#aspect-ratio-container {\n  display: flex;\n  width: 100%;\n  justify-content: space-between;\n  align-items: center;\n  margin: 0;\n}\n#aspect-ratio-container label {\n  flex-grow: 1;\n}\n#aspect-ratio-container input {\n  flex-basis: 1.5rem;\n  flex-shrink: 1;\n}\n#aspect-ratio-container input:nth-of-type(1) {\n  margin-right: 0.5rem;\n}\n/* Constraints title button (show/hide constraints) */\n#constraints-container {\n  position: relative;\n}\n#constraints-container.hidden {\n  display: block;\n}\n#constraints-container.hidden #constraints-inputs-container {\n  display: none;\n}\n#constraints-container h3::after {\n  content: '▼';\n  position: absolute;\n  right: 0;\n  top: 0;\n  font-size: 0.8rem;\n  margin-right: 0.25rem;\n  margin-top: 0.25rem;\n  cursor: pointer;\n  transition: transform 0.3s ease;\n  transform-origin: top top;\n  color: rgb(91, 91, 91);\n  transform: rotate(0deg);\n}\n#constraints-container.hidden h3::after {\n  transform: rotate(90deg);\n}\n@media only screen and (orientation: portrait) and (max-width: 768px) {\n  #app-container {\n    flex-direction: column;\n    justify-content: space-between;\n    align-items: center;\n  }\n  #screen-area-container {\n    flex-basis: 50%;\n    width: 100%;\n    margin: 0;\n    /* center the screen area  */\n    display: flex;\n    justify-content: center;\n    overflow: scroll;\n  }\n  #screen-area {\n    margin: 0;\n  }\n  #sidebar {\n    margin: 0.05rem;\n    border: 4px solid rgb(197, 197, 197);\n    width: 100%;\n    flex-basis: 45%;\n    background: rgb(197, 197, 197);\n  }\n\n  #note {\n    display: none;\n  }\n}\n#note {\n  max-width: 700px;\n  padding: 0 1rem;\n  font-style: italic;\n  color: gray;\n}\n",""]);const c=o},312:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",i=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),i&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),i&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,i,r,s){"string"==typeof e&&(e=[[null,e,void 0]]);var o={};if(i)for(var c=0;c<this.length;c++){var l=this[c][0];null!=l&&(o[l]=!0)}for(var a=0;a<e.length;a++){var h=[].concat(e[a]);i&&o[h[0]]||(void 0!==s&&(void 0===h[5]||(h[1]="@layer".concat(h[5].length>0?" ".concat(h[5]):""," {").concat(h[1],"}")),h[5]=s),n&&(h[2]?(h[1]="@media ".concat(h[2]," {").concat(h[1],"}"),h[2]=n):h[2]=n),r&&(h[4]?(h[1]="@supports (".concat(h[4],") {").concat(h[1],"}"),h[4]=r):h[4]="".concat(r)),t.push(h))}},t}},500:e=>{e.exports=function(e){return e[1]}},596:e=>{var t=[];function n(e){for(var n=-1,i=0;i<t.length;i++)if(t[i].identifier===e){n=i;break}return n}function i(e,i){for(var s={},o=[],c=0;c<e.length;c++){var l=e[c],a=i.base?l[0]+i.base:l[0],h=s[a]||0,d="".concat(a," ").concat(h);s[a]=h+1;var u=n(d),m={css:l[1],media:l[2],sourceMap:l[3],supports:l[4],layer:l[5]};if(-1!==u)t[u].references++,t[u].updater(m);else{var p=r(m,i);i.byIndex=c,t.splice(c,0,{identifier:d,updater:p,references:1})}o.push(d)}return o}function r(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,r){var s=i(e=e||[],r=r||{});return function(e){e=e||[];for(var o=0;o<s.length;o++){var c=n(s[o]);t[c].references--}for(var l=i(e,r),a=0;a<s.length;a++){var h=n(s[a]);0===t[h].references&&(t[h].updater(),t.splice(h,1))}s=l}}},176:e=>{var t={};e.exports=function(e,n){var i=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(n)}},808:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},120:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},520:e=>{e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var i="";n.supports&&(i+="@supports (".concat(n.supports,") {")),n.media&&(i+="@media ".concat(n.media," {"));var r=void 0!==n.layer;r&&(i+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),i+=n.css,r&&(i+="}"),n.media&&(i+="}"),n.supports&&(i+="}");var s=n.sourceMap;s&&"undefined"!=typeof btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(s))))," */")),t.styleTagTransform(i,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},936:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}}},t={};function n(i){var r=t[i];if(void 0!==r)return r.exports;var s=t[i]={id:i,exports:{}};return e[i](s,s.exports,n),s.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.nc=void 0,(()=>{class e extends Error{constructor(e,t){super(e),this.name="PackerError",this.description=t}}const t=class{constructor(e){this.setOptions(e),this.getTileDimensions=this.getTileDimensions.bind(this),this.getTileGridColumns=this.getTileGridColumns.bind(this),this.getTileProperties=this.getTileProperties.bind(this),this.calcTileProperties=this.calcTileProperties.bind(this)}setOptions(e){this.validatePackingOptions(e),this.screenArea=e.screenArea,this.screenWidth=e.screenArea[0],this.screenHeight=e.screenArea[1],this.tiles=e.tiles,this.tileAspectRatio=e.tileAspectRatio,this.gutter=e.gutter??0,this.columns=e.columns??0,this.completeRectangle=e.completeRectangle??!1,this.canRemoveTiles=e.canRemoveTiles??!1,this.allowIncompleteRows=e.allowIncompleteRows??!1,this.minTileWidth=e.minTileWidth??0,this.minTileHeight=e.minTileHeight??0,this.maxTileHeight=e.maxTileHeight??0,this.tryLimit=e.tryLimit??800,this.debug=e.debug??!1,this.errorMargin=e.errorMargin??.01,this.performanceLimit=e.performanceLimit??1e3,this.onError=e.onError??null,this.bestGuessTileHeight=this.calcBestGuessTileHeight(),this.init()}init(){this.calcMinTileDimensions(this.minTileWidth,this.minTileHeight),this.bestGuessTileHeight=this.calcBestGuessTileHeight(),this.initialBestGuessTileHeight=this.bestGuessTileHeight,this.direction=1,this.removedTiles=[],this.tries=[],this.performanceStartTime=0,this.performanceStartTime=performance.now(),this.tries=[],this.removedTiles=[]}setBestGuessTileHeight(e){return this.bestGuessTileHeight=e,e}calcBestGuessTileHeight(){let e=0;if(e=this.columns>0?this.calcTileDimensionsFromColumns(this.columns)[1]:this.calcBestGuessTileHeightByArea(),isNaN(e))throw new Error("Best guess tile height cannot equal NaN");if(e<1)throw new Error("Best guess tile height cannot equal 0");return e}calcBestGuessTileHeightByArea(){return 2*Math.floor(Math.sqrt(this.screenWidth*this.screenHeight/this.tiles.length))}removeTile(){if(0===this.tiles.length){const e=this.tries[this.tries.length-2]?.error;throw new Error(`No more tiles to remove - ${e}`)}this.removedTiles.push(this.tiles.pop())}reverseDirection(){this.direction=-1*this.direction}validatePackingOptions(e){const{screenArea:t,tiles:n,tileAspectRatio:i,allowIncompleteRows:r,completeRectangle:s,columns:o}=e;if(!t)throw new Error("screenArea is required");if(!n||!Array.isArray(n))throw new Error("tiles is required and must be an array with length greater than zero");if(!i)throw new Error("tileAspectRatio is required");if(!0===r&&!0===s)throw new Error("allowIncompleteRows and completeRectangle cannot both be true");if(!0===r&&0===o)throw new Error("allowIncompleteRows requires columns to be set")}validateSolutionIsPossible(){if(this.canRemoveTiles)return!0;if(this.columns>0&&this.tiles.length<this.columns&&!this.allowIncompleteRows)throw new Error("Solution not possible for columns constraint and number of tiles");if(this.completeRectangle&&this.isPrime(this.tiles.length)&&!this.allowIncompleteRows)throw new Error("Solution is not possible for a complete rectangle with a prime number of tiles");const e=this.screenArea[0]*this.screenArea[1];if((this.minTileHeight*this.minTileWidth+this.gutter*this.gutter)*this.tiles.length>e)throw new Error(`Solution is not possible for given screen area (${this.screenArea[0]} x ${this.screenArea[1]}), tiles (${this.tiles.length}) and minimum tile dimensions (${this.minTileWidth} x ${this.minTileHeight})`);return!0}validateTilesFitScreen(t){const[n,i]=this.screenArea,{tileWidth:r,tileHeight:s,columns:o,rows:c}=t;let l=(r+this.gutter)*o+this.gutter;this.allowIncompleteRows&&1===c&&(l=(r+this.gutter)*this.tiles.length+this.gutter);const a=(s+this.gutter)*c+this.gutter;let h=0;if(a>i&&(h=a-i,Math.abs(h)>this.errorMargin))throw new e("Overflow screen height",{guess:this.bestGuessTileHeight,predicate:`columnHeight (${a}) > screenHeight (${i})`,data:{columnHeight:a,screenHeight:i},discrepancy:[h]});if(l>n&&(h=l-n,Math.abs(h)>this.errorMargin))throw new e("Overflow screen width",{guess:this.bestGuessTileHeight,predicate:`rowWidth (${l}) > screenWidth (${n})`,data:{rowWidth:l,screenWidth:n},discrepancy:[h]});const d=!0===this.allowIncompleteRows&&1===c;if(l<n&&!d&&(h=n-l,Math.abs(h)>this.errorMargin))throw new e("Underflow screen width",{guess:this.bestGuessTileHeight,predicate:`rowWidth (${l}) < (screenWidth - gutter) (${n})`,data:{rowWidth:l,screenWidth:n},discrepancy:[h]})}validateRectangleIsComplete(e){const{tileWidth:t,tileHeight:n,columns:i,rows:r}=e;return this.tiles.length%i==0}validateTilesObeyMinMax(t){const{tileWidth:n,tileHeight:i,columns:r,rows:s}=t;if(i<this.minTileHeight)throw new e("Tile dimensions below minimum",{guess:this.bestGuessTileHeight,predicate:`tileHeight (${i}) < minTileHeight (${this.minTileHeight})`,data:{tileWidth:n,tileHeight:i,minTileWidth:this.minTileWidth,minTileHeight:this.minTileHeight},discrepancy:[this.minTileHeight-i]});if(this.maxTileHeight>0&&i>this.maxTileHeight)throw new e("Tile dimensions above maximum",{guess:this.bestGuessTileHeight,predicate:`tileHeight (${i}) > maxTileHeight (${this.maxTileHeight})`,data:{tileWidth:n,tileHeight:i,screenWidth:this.screenWidth,screenHeight:this.screenHeight},discrepancy:[this.maxTileHeight-i]})}validateColumnConstraintIsSatisfied(t){const n=!0===this.allowIncompleteRows&&this.tiles.length<t.columns;if(this.columns>0&&t&&t.columns!==this.columns&&!n)throw new e("Could not satisfy columns constraint",{guess:this.bestGuessTileHeight,predicate:`properties.columns (${t.columns}) !== this.columns (${this.columns})`,data:{"properties.columns":t,"this.columns":this.columns},discrepancy:[t.columns-this.columns]})}validateTryLimit(){if(this.tryLimit&&this.tries.length==this.tryLimit)throw this.debug&&console.error("try limit reached",this.tries.length),new Error("Try limit reached")}validateStackOverflow(){if(performance.now()-this.performanceStartTime>this.performanceLimit)throw new Error("Stack overflow")}calcTileProperties(){this.validateSolutionIsPossible();let e=null,t=null,n=0,i="",r=null;for(this.performanceStartTime=performance.now();!e;){try{this.validateTryLimit(),this.validateStackOverflow(),e=this.getTileProperties(),this.validateTilesFitScreen(e),this.validateTilesObeyMinMax(e),this.validateColumnConstraintIsSatisfied(e)}catch(s){if([n,i]=this.handleHeuristicError(s,t,e),e=null,r=s.description,t=s,this.bestGuessTileHeight=this.bestGuessTileHeight+n,this.debug&&console.log(`----- try #${this.tries.length}`,this.bestGuessTileHeight),this.debug&&console.log("error",i,n),this.bestGuessTileHeight<1){if(!this.canRemoveTiles)throw new Error("Tile height cannot equal 0");this.removeTile(),this.bestGuessTileHeight=this.calcBestGuessTileHeightByArea()}this.onError&&this.onError(`${i} (${n})`)}this.logTryData(i,n,r)}if(this.completeRectangle&&!this.validateRectangleIsComplete(e))return this.tryCompletingRectangle();const[s,o]=this.getRealDimensions(e);return this.logTryData(null,0,null),{...e,positions:this.positions,tiles:this.tiles,tries:this.tries,realHeight:o,realWidth:s}}handleHeuristicError(t,n,i){let r=0,s=t.message,o=i?.columns??0;switch(t.message){case"Could not satisfy columns constraint":if(this.canRemoveTiles)return o=this.columns,this.removeTile(),this.bestGuessTileHeight=this.calcBestGuessTileHeightByArea(),[0,s];throw new e(s,t.description);case"Overflow screen height":o=i.columns+1,this.reverseDirection();break;case"Overflow screen width":o=i.columns-1;break;case"Underflow screen width":if(null==n?.message){o=i.columns;break}o=i.columns+1;break;case"Underflow screen height":break;case"Tile dimensions below minimum":return this.canRemoveTiles?(this.removeTile(),this.bestGuessTileHeight=this.minTileHeight,[0,s]):(this.bestGuessTileHeight=this.minTileHeight,[0,s]);case"Tile dimensions above maximum":return this.canRemoveTiles?(this.removeTile(),this.bestGuessTileHeight=this.maxTileHeight,[0,s]):(this.bestGuessTileHeight=this.maxTileHeight,[0,s]);default:throw new Error(t.message)}return r=this.calcCorrectionForNewColumnValue(i,o),[r,s]}calcCorrectionForNewColumnValue(e,t){const[,n]=this.calcTileDimensionsFromColumns(t);return n-this.bestGuessTileHeight}tryCompletingRectangle(){return this.tries=[],this.canRemoveTiles?(this.removeTile(),this.bestGuessTileHeight=this.initialBestGuessTileHeight=this.calcBestGuessTileHeight(),this.calcTileProperties()):(this.bestGuessTileHeight=this.initialBestGuessTileHeight=this.initialBestGuessTileHeight/2,this.calcTileProperties())}logTryData(e,t,n){const i=this.tries.length-1;this.tries[i].tries=this.tries,this.tries[i].bestGuessTileHeight=this.bestGuessTileHeight,this.tries[i].error=e,this.tries[i].correction=t,this.tries[i].positions=this.positions,this.tries[i].screenArea=this.screenArea,this.tries[i].tiles=this.tiles,this.tries[i].errorDescription=n,this.tries[i].performanceTime=performance.now()-this.performanceStartTime}getRealDimensions(e){const{tileWidth:t,tileHeight:n,columns:i,rows:r}=e;return[i*(t+this.gutter)+this.gutter,r*(n+this.gutter)+this.gutter]}calcTileDimensionsFromColumns(e){const t=(this.screenWidth-this.gutter)/e-this.gutter;return[t,t/this.tileAspectRatio]}calcMinTileDimensions(e,t){return e||t||(e=1),e?(this.minTileWidth=e,this.minTileHeight=this.minTileWidth/this.tileAspectRatio):(this.minTileHeight=t,this.minTileWidth=this.minTileHeight*this.tileAspectRatio),[this.minTileWidth,this.minTileHeight]}calcTilePositions(e){const{tileWidth:t,tileHeight:n,columns:i,rows:r}=e,s=[];for(let e=0;e<this.tiles.length;e++)s.push(this.calcTilePosition(i,t,n,e));return s}calcTilePosition(e,t,n,i){const r=i%e,s=Math.floor(i/e),o=this.gutter;let c=r*(t+o),l=Math.floor(i/e)*(n+this.gutter);return c+=o,l+=o,[c,l,s,r]}getTileProperties(){const[e,t]=this.getTileDimensions();let n=this.getTileGridColumns(e),i=Math.ceil(this.tiles.length/n);return this.tries.push({tileWidth:e,tileHeight:t,columns:n,rows:i}),this.positions=this.calcTilePositions({tileWidth:e,tileHeight:t,columns:n,rows:i}),{tileWidth:e,tileHeight:t,columns:n,rows:i}}getTileGridColumns(e){const t=Math.round((this.screenWidth-this.gutter)/(e+this.gutter));if(this.tiles.length<t-1&&!this.allowIncompleteRows)throw new Error("Tile width and number of tiles cannot fill the container width");return t}getTileDimensions(){return[this.bestGuessTileHeight*this.tileAspectRatio,this.bestGuessTileHeight]}getTilesRemoved(){return this.removedTiles}getWereTilesRemoved(){return this.removedTiles.length>0}isPrime(e){if(this.tiles.length<2)return!1;for(let t=2;t<=Math.sqrt(e);t++)if(e%t==0)return!1;return!0}},i={screenArea:[720,480],minTileHeight:0,maxTileHeight:0,completeRectangle:!1,tileAspectRatio:.8,gutter:5,columns:null,canRemoveTiles:!1,showConstraints:!1,tiles:Array.from({length:10})},r=e=>Array.from({length:e});var s=n(596),o=n.n(s),c=n(520),l=n.n(c),a=n(176),h=n.n(a),d=n(120),u=n.n(d),m=n(808),p=n.n(m),g=n(936),f=n.n(g),b=n(60),T={};T.styleTagTransform=f(),T.setAttributes=u(),T.insert=h().bind(null,"head"),T.domAPI=l(),T.insertStyleElement=p(),o()(b.c,T),b.c&&b.c.locals&&b.c.locals,r(15);let v,w,y=!1;const x={mobile:{...i,tiles:r(15),screenArea:[window.innerWidth-50,window.innerHeight/2]},laptop:{...i,tiles:r(18),screenArea:[1366,720]},other:{...i,screenArea:[720,480],tiles:r(15)}};function H(){v.tiles.length>5242880?alert("Tiles limit for this demo app reached, please reduce the number of tiles"):localStorage.setItem("savedOptions",JSON.stringify(v))}function E(e,n=0){if(!e)return;w||(w=new t({...e}));const{screenArea:r}=e,s=document.querySelector("#screen-area");let o;if(s.innerHTML="",s.style.width=`${r[0]}px`,s.style.height=`${r[1]}px`,e.properties?(o=e.properties,v={...e}):o=function(){if(!w)return;let e;w.setOptions(v);try{e=w.calcTileProperties()}catch(e){console.error(e),L(e),R(e.message),C()}const t=document.querySelector("#tries-range");return t.max=w?.tries.length,t.value=w?.tries.length,e}(),o?.error){const{error:e,correction:t,errorDescription:i}=o;R(`Try # ${n} : ${e}`,t,i),C()}else document.querySelector("#current-error-container").classList.add("hidden");if(e.properties||(document.querySelector("#tries-range").max=w?.tries.length),s.innerHTML="",!o)return;const c=function(e){if(!e)return;const t=[],{tileWidth:n,tileHeight:r,columns:s,rows:o,tiles:c,positions:l,realHeight:a,realWidth:h}=e;if(l){for(let e=0;e<l.length;e++){const i=document.createElement("div");if(i.classList.add("tile"),i.style.width=`${k(n)}px`,i.style.height=`${k(r)}px`,c[e]){const t=document.createElement("img");t.src=c[e],t.style.width="100%",t.style.height="100%",t.style.objectFit="cover",i.appendChild(t)}const[s,o]=l[e];i.style.left=`${k(s)}px`,i.style.top=`${k(o)}px`;const a=document.createElement("div");a.classList.add("tile-number"),a.innerText=e+1,i.appendChild(a),s+n>w.screenWidth&&i.classList.add("error"),o+r>w.screenHeight&&i.classList.add("error"),t.push(i)}if(e?.tries){const t=document.querySelector("#tries-range").value,c=e.tries[t-1]?.performanceTime,l=!e.error;!function(e,t,n,i,r,s,o,c,l,a,h,d,u=!1){!function(e,t=0){e&&(document.querySelector("#error-container ol").innerHTML="",e.slice(0,t).forEach(((e,n)=>{if(e.error){const i=n===t-1;!function(e,t=!1,n=!0){const i=document.querySelector("#error-container ol"),r=document.createElement(n?"li":"div");r.classList.add("error"),t&&r.classList.add("current-try"),r.innerText=e,i.appendChild(r)}(e.error,i)}})))}(h,d);const m=document.querySelector("#result-container #result");let p="Current iteration";m.classList.remove("success"),u&&(p="Success!",m.classList.add("success")),m.innerHTML=`<h4>${p}</h4> `,v.canRemoveTiles&&(m.innerHTML+=`<p >Tiles removed: ${w.getTilesRemoved()?.length??0}</p>`);const g=function(e,t,n,i,r,s,o,c,l,a){const h=document.createElement("div");return h.id="details",h.classList.add("hidden"),h.innerHTML=`<h3>Tile details</h3>\n  <p>Tile aspect ratio: ${t}</p>\n  <p>Tile width: ${n?.toFixed(2)}px</p>\n  <p>Tile height: ${i?.toFixed(2)}px</p>\n  <p>Tiles removed: ${w?.getTilesRemoved()?.length??0}</p>\n\n  <h3>Grid details</h3>\n  <p>Screen area: ${o[0]}x${o[1]}</p>\n  <p>Columns: ${r}</p>\n  <p>Rows: ${s}</p>\n  <p>Grid dimensions: ${l?.toFixed(2)} x ${c?.toFixed(2)}</p>\n\n  <h3>Performance</h3>\n  <p>Performance time: ${a?.toFixed(2)}ms</p>\n  <p>Tries: ${w?.tries?.length??0}</p>\n  <p>First best guess tile height: ${w?.initialBestGuessTileHeight?.toFixed(2)}</p>\n  \n  `,h}(0,t,n,i,r,s,o,c,l,a);document.querySelector("#error-container").classList.add("hidden");const f=document.createElement("button");let b="Show details and errors +";f.innerText=b,f.onclick=function(){g.classList.toggle("hidden"),document.querySelector("#error-container").classList.toggle("hidden"),g.classList.contains("hidden")?(f.innerText=b,y=!1):y=!0},m.append(f,g),y&&f.click()}(0,i.tileAspectRatio,n,r,s,o,w.screenArea,a,h,c,e.tries,t,l)}return t}}(o);c&&s.append(...c)}function k(e){return Math.floor(e)}function R(e,t=null,n=null){const i=document.querySelector("#current-error");if(i.innerHTML=`${e}`,t&&(i.innerHTML+=`<div class='correction'>Correction: ${t}</div>`),n){const{guess:e,predicate:t,data:r,discrepancy:s}=n;i.innerHTML+=`<div class='error-description'>\n\n    <p>Guess: ${e}</p>\n    <p>Predicate: ${t}</p>\n    <p>Discrepancy: ${s?.map((e=>e.toFixed(2))).toString()}</p>\n    </p>`}}function C(){document.querySelector("#current-error-container").classList.remove("hidden")}function L(e){console.error("Failed to pack",e);const t=document.querySelector("#result-container #result");t.classList.remove("success"),t.innerHTML="",t.innerHTML=`\n  <h4>Failed to pack</h4>\n  <p>${e.message}</p>\n  `,t.parentElement.classList.add("error")}window.onload=function(){v=function(){const e=localStorage.getItem("savedOptions");return e?JSON.parse(e):null}()||x.other,window.innerWidth<768&&(v=x.mobile),console.log("currentOptions",v),function(e){const t=function(){const e=document.createElement("div");return e.id="app-container",e}(),n=function(){const e=document.createElement("div");e.id="sidebar";const t=document.createElement("div");t.id="sidebar-title-container";const n=document.createElement("h2");n.innerText="Rectangle Packer v2.0.0";const i=document.createElement("p");return i.innerText="by @aslamhus",t.append(n,i),e.append(t),e}();n.appendChild(function(){const e=document.createElement("div");e.id="options-container";const t=document.createElement("div");t.id="screen-area-option-container";const n=document.createElement("label");n.innerText="Screen area";const s=document.createElement("div");s.id="dimensions-container";const o=document.createElement("input");o.id="screen-area-width-input",o.type="number",o.value=v.screenArea[0];const c=document.createElement("input");c.id="screen-area-height-input",c.type="number",c.value=v.screenArea[1],s.append(o,c),t.append(n,s);const l=document.createElement("div");l.id="hide-video-container",l.classList.add("checkbox-container");const a=document.createElement("label");a.innerText="Hide video";const h=document.createElement("input");h.id="hide-video-input",h.type="checkbox",h.onchange=function(e){document.body.classList.toggle("hide-video")},l.append(a,h);const d=document.createElement("div"),u=document.createElement("label");u.innerText="Number of tiles";const m=document.createElement("input");m.id="tiles-input",m.type="number",m.value=v.tiles.length,d.append(u,m);const p=document.createElement("div"),g=document.createElement("label");g.innerText="Gutter";const f=document.createElement("input");f.id="gutter-input",f.type="number",f.value=v.gutter,p.append(g,f);const b=document.createElement("div");b.id="aspect-ratio-container";const T=document.createElement("label");T.innerText="Tile aspect ratio";const w=document.createElement("input");w.id="aspect-ratio-width-input",w.type="number",w.value=4;const y=document.createElement("input");y.id="aspect-ratio-height-input",y.type="number",y.value=5,b.append(T,w,y);const x=document.createElement("div");x.id="constraints-container";const k=document.createElement("h3");k.innerText="Constraints",!1===v.showConstraints&&x.classList.add("hidden"),k.onclick=function(){x.classList.toggle("hidden"),v={...v,showConstraints:!v.showConstraints},H()};const R=document.createElement("div");R.id="constraints-inputs-container";const C=document.createElement("div"),L=document.createElement("label");L.innerText="Min tile height";const A=document.createElement("input");A.id="min-tile-height-input",A.type="number",A.step=.01,A.value=v.minTileHeight,C.append(L,A);const S=document.createElement("div"),$=document.createElement("label");$.innerText="Max tile height";const G=document.createElement("input");G.id="max-tile-height-input",G.type="number",G.step=.01,G.value=v.maxTileHeight,S.append($,G);const M=document.createElement("div"),W=document.createElement("label");W.innerText="Columns";const I=document.createElement("input");I.id="columns-input",I.type="number",I.value=v.columns??"0",M.append(W,I);const P=document.createElement("div");P.classList.add("checkbox-container");const q=document.createElement("label");q.innerText="Complete rectangle";const F=document.createElement("input");F.id="complete-rectangle-input",F.type="checkbox",F.checked=v.completeRectangle,P.append(q,F);const O=document.createElement("div");O.classList.add("checkbox-container");const B=document.createElement("label");B.innerText="Can remove tiles";const D=document.createElement("input");D.id="can-remove-tiles-input",D.type="checkbox",D.checked=v.canRemoveTiles,O.append(B,D);const z=document.createElement("div");z.classList.add("checkbox-container");const j=document.createElement("label");j.innerText="Allow first row to be incomplete";const N=document.createElement("input");N.id="allow-incomplete-rows-input",N.type="checkbox",N.checked=v.allowIncompleteRows,z.append(j,N),R.append(C,S,M,P,O,z),x.append(k,R);const U=document.createElement("button");return U.id="submit-button",U.innerText="Update",U.onclick=function(){const e=document.querySelector("#guess-input");e&&(e.value=0),v={...i,tiles:r(m.value),screenArea:[parseInt(o.value),parseInt(c.value)],gutter:parseInt(f.value),minTileHeight:parseFloat(A.value),maxTileHeight:parseFloat(G.value),columns:parseInt(I.value),completeRectangle:F.checked,canRemoveTiles:D.checked,allowIncompleteRows:N.checked,tileAspectRatio:w.value/y.value},H(),E(v)},e.append(t,d,p,b,x,U),e}()),n.appendChild(function(){const e=document.createElement("div");e.id="tries-range-container";const t=document.createElement("h4");t.innerText="Tries Slider";const n=document.createElement("p");n.innerText="Slide to view individual iterations";const i=document.createElement("input");return i.id="tries-range",i.type="range",i.min=0,i.max=w?.tries.length,i.value=w?.tries.length,i.oninput=function(e){const t=e.target.value-1,n=w?.tries[t];n&&E({...v,properties:n},t+1)},e.append(t,n,i),e}()),n.appendChild(function(){const e=document.createElement("div");e.id="result-container";const t=document.createElement("div");t.id="result",e.appendChild(t);const n=document.createElement("div");n.id="error-container",n.classList.add("hidden");const i=document.createElement("h3");i.innerText="Errors",n.append(i);const r=document.createElement("ol");return n.appendChild(r),e.appendChild(n),e}());const s=function(){const e=document.createElement("div");e.id="screen-area-container";const t=document.createElement("p");t.id="note",t.innerHTML="<b>Note:</b> sub-pixel browser rendering may cause the far right gutter to be truncated. <br/>This is a known issue, not a bug in the algorithm.";const n=document.createElement("div");return n.id="screen-area",e.append(n,t),e}();s.appendChild(function(){const e=document.createElement("div");e.id="current-error-container",e.classList.add("hidden");const t=document.createElement("div");return t.id="current-error",e.appendChild(t),e}()),t.appendChild(s),t.appendChild(n),e.appendChild(t)}(document.getElementById("render"));try{w=new t({...v})}catch(e){L(e)}E(v),window.addEventListener("keydown",(function(e){if("ArrowRight"===e.key||"ArrowLeft"===e.key){const t=document.querySelector("#tries-range");"ArrowRight"===e.key&&(t.value=parseInt(t.value)+1),"ArrowLeft"===e.key&&(t.value=parseInt(t.value)-1);const n=new Event("input");t.dispatchEvent(n)}"Enter"===e.key&&document.querySelector("#submit-button").click()}))}})()})();