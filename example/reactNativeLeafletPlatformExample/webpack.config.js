
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode:  'development',
  entry: './index.web.js',

  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.js'],
    alias: {
      'react-native$': 'react-native-web',
    },
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/leaflet.html',
    }),
  ],

  devServer: {
    port: 3000,
  },
};