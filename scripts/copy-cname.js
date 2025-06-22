const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const src = path.join(rootDir, 'CNAME');
const dest = path.join(rootDir, 'build', 'CNAME');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('CNAME copied to build directory.');
} else {
  console.error('CNAME file not found.');
}
