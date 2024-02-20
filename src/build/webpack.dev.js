import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import common from './webpack.common.js';
import { merge } from 'webpack-merge';

export default merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    devMiddleware: {
      publicPath: 'auto',
    },
    static: {
      directory: path.join(__dirname, '../../dist'),
    },
    hot: true,
    host: 'localhost',
    port: 9000,
  },
});
