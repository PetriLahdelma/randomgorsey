const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "../build");
const indexPath = path.join(buildDir, "index.html");

const staticRoutes = ["/about/", "/contact/", "/gallery/", "/discography/", "/listen/"];

if (!fs.existsSync(indexPath)) {
  console.error("index.html not found in build/. Run the build first.");
  process.exit(1);
}

for (const route of staticRoutes) {
  const routeDir = path.join(buildDir, route.replace(/^\/|\/$/g, ""));
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(indexPath, path.join(routeDir, "index.html"));
}

console.log(`Created static route entry points for ${staticRoutes.length} routes.`);
