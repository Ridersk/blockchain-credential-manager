const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

// const ws = require("ws");
// const rpcWebsocket = require("rpc-websockets");

// Webpack configuration to extension scripts (background.js and content.js)
module.exports = {
  mode: "development",
  entry: {
    contentscript: path.resolve(__dirname, "src/scripts/content-scripts/index.js"),
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
      // url: require.resolve("url"),
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
      Buffer: ["buffer", "Buffer"],
      XMLHttpRequest: require.resolve("xhr2")
      // window: "global/window",
      // "window.WebSocket": require.resolve("ws")
      // "window.WebSocket": ["rpc-websockets", "Client"]
      // "window.WebSocket": ["websocket-polyfill/lib/WebSocket", "WebSocket"]
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env)
    })
  ]
};
