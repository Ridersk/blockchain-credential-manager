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
      stream: require.resolve("stream-browserify"),
      os: require.resolve("os-browserify/browser"),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      url: require.resolve("url/"),
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      zlib: require.resolve("browserify-zlib"),
      path: require.resolve("path-browserify"),
      fs: require.resolve("browserify-fs")
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
    new webpack.ProvidePlugin({
      process: require.resolve("process/browser"),
      XMLHttpRequest: require.resolve("xhr2"),
      // "window.WebSocket": require.resolve("ws"),
      Buffer: ["buffer", "Buffer"]
    })
  ]
};
