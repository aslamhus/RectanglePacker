import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../../example'),
  },
  entry: {
    // path: path.resolve(__dirname, '../example/index.js'),
    app: path.resolve(__dirname, '../example/index.js'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../example/index.html'),
      chunks: ['app'],
    }),
  ],
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
