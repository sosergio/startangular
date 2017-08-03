var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'dist');
var mainPath = path.resolve(__dirname, 'src', 'index.js');
const {
  DedupePlugin,
  UglifyJsPlugin
} = require('webpack').optimize;
let webpack = require('webpack');

var config = {
  node: {
    __dirname: true,
  },
  // We change to normal source mapping
  devtool: 'eval',
  target:"node",
  entry: mainPath,
  output: {
    path: buildPath,
    filename: 'index.js'
  },
  plugins: [
    //Eliminate duplicate packages
    new DedupePlugin(),
    //Minify js
    new UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
          presets: ['es2015']
        },
     // exclude: [nodeModulesPath]
    }]
  }
};

module.exports = config;