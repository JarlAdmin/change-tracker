const path = require('path');

module.exports = function override(config) {
  config.resolve.alias['@'] = path.resolve(__dirname, 'src');
  config.resolve.alias['@/components'] = path.resolve(__dirname, 'src/components');
  
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: require.resolve('./src/mocks/fs.js'),
  };
  
  return config;
};
