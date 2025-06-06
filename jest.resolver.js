const path = require('path');

const defaultResolver = (request, options) => {
  return options.defaultResolver(request, options);
};

module.exports = (request, options) => {
  console.log(`Resolving module: ${request}`);
  console.log(`Options:`, options);
  if (request === 'react-router-dom') {
    const resolvedPath = path.join(options.rootDir, 'node_modules', 'react-router-dom', 'dist', 'index.js');
    console.log(`Resolved react-router-dom to: ${resolvedPath}`);
    return resolvedPath;
  }
  return defaultResolver(request, options);
};
