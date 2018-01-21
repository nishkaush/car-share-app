const path = require("path");

module.exports = {
  entry: path.join(__dirname, "..", "src/main.js"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "..", "myPublic")
  },
  module: {
    rules: [
      { test: /\.vue?/, use: "vue-loader", exclude: /node_modules/ },
      { test: /\.js?/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.css?/, use: ["style-loader", "css-loader"] }
    ]
  }
};
