const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

const commonConfig = {
  /*入口*/
  entry: {
    app: [
      'babel-polyfill',
      path.join(__dirname, '../src/index.js')
    ],
    antd: ['antd'],
    react: ['react', 'react-router-dom', 'react-dom'],
    mobx: ['mobx', 'mobx-react']
    //vendor: ['react', 'react-router-dom', 'react-dom', 'mobx', 'mobx-react', 'antd']
  },
  /*输出到dist文件夹，输出文件名字为bundle.js*/
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/public/'
  },
  module: {
    rules: [{
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader?cacheDirectory=true'],
      include: path.join(__dirname, '../src')
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 8192 //小于等于8K的图片会被转成base64编码，直接插入HTML中，减少HTTP请求。
        }
      }]
    },]
  },
  // 追踪到错误和警告在源代码中的原始位置
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: "系统综合集成",
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/templates/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.HashedModuleIdsPlugin()
  ]
};

module.exports = commonConfig;
