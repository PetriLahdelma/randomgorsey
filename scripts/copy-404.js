// This script copies build/index.html to build/404.html after build for SPA routing on GitHub Pages
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const indexPath = path.join(buildDir, 'index.html');
const notFoundPath = path.join(buildDir, '404.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('404.html created for SPA routing.');
} else {
  console.error('index.html not found in build/. Run the build first.');
}
