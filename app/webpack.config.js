const path = require("path");

// Webpack configuration to extension scripts (background.js and content.js)
module.exports = {
  mode: "development",
  entry: {
    contentscript: path.resolve(__dirname, "src/scripts/content_scripts/index.js"),
    background: path.resolve(__dirname, "src/scripts/background.ts")
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  devtool: "cheap-module-source-map"
};
