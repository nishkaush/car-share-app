const path = require("path");
const merge = require("webpack-merge");

const webpack = require("webpack");
const common = require("./webpack.common");

const dev = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "..", "myPublic"),
    hot: true,
    historyApiFallback: true,
    stats: "errors-only"
  },
  devtool: "cheap-module-eval-source-map"
};

module.exports = merge(common, dev);
