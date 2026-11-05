import { execFile } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, ".omx", "storybook-check");
const staticDirectory = path.resolve(
  root,
  process.env.RG_STORYBOOK_DIR || ".omx/ci/storybook",
);
const session =
  process.env.RG_STORYBOOK_SESSION || "random-gorsey-storybook-check";
const binary = process.env.PLAYWRIGHT_CLI_BIN || "playwright-cli";
const port = Number(process.env.RG_STORYBOOK_PORT || "6106");
const host = "127.0.0.1";
const base = "http://" + host + ":" + port;
const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const execFileAsync = promisify(execFile);

if (!existsSync(path.join(staticDirectory, "index.html"))) {
  throw new Error(
    "Storybook build not found at " +
      staticDirectory +
      ". Run the static Storybook build first.",
  );
}

await mkdir(output, { recursive: true });

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", base);
    if (url.pathname === "/__axe.js") {
      response.writeHead(200, {
        "content-type": "text/javascript; charset=utf-8",
        "cache-control": "no-store",
      });
      createReadStream(axePath).pipe(response);
      return;
    }

    const requestedPath =
      url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const resolvedPath = path.resolve(
      staticDirectory,
      "." + requestedPath,
    );
    const relativePath = path.relative(staticDirectory, resolvedPath);

    if (
      relativePath.startsWith("..") ||
      path.isAbsolute(relativePath) ||
      !existsSync(resolvedPath) ||
      !statSync(resolvedPath).isFile()
    ) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type":
        mimeTypes[path.extname(resolvedPath).toLowerCase()] ||
        "application/octet-stream",
      "cache-control": "no-store",
    });
    createReadStream(resolvedPath).pipe(response);
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(String(error));
  }
});

async function cli(args) {
  const result = await execFileAsync(binary, ["-s=" + session, ...args], {
    cwd: output,
    encoding: "utf8",
    timeout: 120_000,
    maxBuffer: 10 * 1024 * 1024,
  });
  return result.stdout;
}

try {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, resolve);
  });

  await cli(["open", base]);
  const result = await cli([
    "run-code",
    "--filename=" +
      path.join(root, "scripts", "storybook-a11y-scenarios.js"),
  ]);
  await writeFile(path.join(output, "output.log"), result);

  const match = result.match(/### Result\n([\s\S]*?)\n### Ran/);
  if (!match) throw new Error(result);

  const report = JSON.parse(match[1]);
  await writeFile(
    path.join(output, "result.json"),
    JSON.stringify(report, null, 2) + "\n",
  );

  if (report.consoleErrors.length > 0) {
    throw new Error(
      "Storybook browser console errors:\n" +
        report.consoleErrors.join("\n"),
    );
  }
  if (report.violations.length > 0) {
    throw new Error(
      "Serious Storybook accessibility violations:\n" +
        report.violations
          .map(
            (violation) =>
              violation.story +
              ": " +
              violation.id +
              " (" +
              violation.impact +
              ")",
          )
          .join("\n"),
    );
  }

  console.log(
    report.storyCount +
      " Storybook scenarios passed with " +
      report.assertionCount +
      " assertions and no serious accessibility violations.",
  );
} finally {
  try {
    await cli(["close"]);
  } catch {}
  await new Promise((resolve) => server.close(resolve));
}
