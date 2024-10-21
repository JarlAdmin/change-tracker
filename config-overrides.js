module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: require.resolve('./src/mocks/fs.js'),
  };
  return config;
};
