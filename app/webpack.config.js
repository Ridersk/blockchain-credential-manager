const path = require("path");
const webpack = require("webpack");

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
    extensions: [".ts", ".js"],
    fallback: {
      stream: require.resolve("stream-browserify")
    }
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
  devtool: "cheap-module-source-map",
  plugins: [
    // fix "process is not defined" error:
    // (do "npm install process" before running the build)
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"]
    })
  ]
};
