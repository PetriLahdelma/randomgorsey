const path = require('path');

module.exports = function override(config) {
  config.module.rules.push({
    test: /\.mdx$/,
    include: path.resolve(__dirname, 'src/posts'),
    use: [
      {
        loader: 'babel-loader',
      },
      {
        loader: '@mdx-js/loader',
        options: {
          providerImportSource: '@mdx-js/react',
        },
      },
    ],
  });

  config.resolve.extensions.push('.mdx');

  return config;
};
