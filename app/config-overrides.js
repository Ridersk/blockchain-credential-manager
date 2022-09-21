require("dotenv").config();

const findWebpackPlugin = (plugins, pluginName) =>
  plugins.find((plugin) => plugin.constructor.name === pluginName);

module.exports = function override(config) {
  const plugin = findWebpackPlugin(config.plugins, "DefinePlugin");
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

  plugin.definitions["process.env"] = {
    ...{ CLUSTER_URL: `"${process.env.CLUSTER_URL}"`, LOG_LEVEL: `"${process.env.LOG_LEVEL}"` }
  };

  return config;
};
