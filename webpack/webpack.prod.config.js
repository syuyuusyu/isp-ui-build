const merge = require('webpack-merge');

//const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const commonConfig = require('./webpack.common.config.js');

const prodConfig = {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist/*.*'])
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        antd: {
          chunks: "initial",
          test: "antd",
          name: "antd",
          enforce: true
        },
        mobx: {
          chunks: "initial",
          test: "mobx",
          name: "mobx",
          enforce: true
        },
        react: {
          chunks: "initial",
          test: "react",
          name: "react",
          enforce: true
        }
      }
    }
  }
};

module.exports = merge(commonConfig, prodConfig);
