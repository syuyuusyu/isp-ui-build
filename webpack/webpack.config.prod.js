const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const commonConfig = require('./webpack.config.common');
const path = require('path');

const prodConfig = {
    devtool: 'source-map',
    mode: 'production',
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        contentBase: path.resolve(__dirname, '../dist'),
        historyApiFallback: {index: '/public/index.html'},
        publicPath: '/public/',
        overlay: {
            errors: true
        },
        disableHostCheck: true,
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                sourceMap: false // set to true if you want JS source maps
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
