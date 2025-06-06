const defaultResolver = require('jest-resolve/build/defaultResolver').default;

module.exports = (request, options) => {
  const resolved = defaultResolver(request, options);
  if (request.includes('react-router-dom')) {
    console.log(`[Jest Resolver] Request: ${request} -> ${resolved}`);
  }
  return resolved;
};