const webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require("./webpack.common");
const merge = require("webpack-merge");

const prod = {
  plugins: [
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};

module.exports = merge(common, prod);