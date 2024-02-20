import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import common from './webpack.common.js';
import { merge } from 'webpack-merge';

export default merge(common, {
  mode: 'production',
});
