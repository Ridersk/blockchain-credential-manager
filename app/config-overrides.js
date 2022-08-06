// final version of the file
module.exports = function override(config) {
  console.log("OVERRIDING REACT-SCRIPTS WEBPACK...");
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    stream: require.resolve("stream-browserify")
  });
  config.resolve.fallback = fallback;
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
};
