// final version of the file
module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify/browser"),
    fs: require.resolve("browserify-fs")
  });
  config.resolve.fallback = fallback;
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
};
