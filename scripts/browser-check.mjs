import { createRequire } from "node:module";
import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const browser=process.env.RG_BROWSER || "chromium";
const output=path.join(root,".omx","browser-check",browser);
await mkdir(output,{recursive:true});
const base=process.env.RG_BASE_URL || "http://127.0.0.1:4173";
const session=process.env.RG_BROWSER_SESSION || "random-gorsey-check";
const binary=process.env.PLAYWRIGHT_CLI_BIN || "playwright-cli";
let server;
if(!process.env.RG_BASE_URL) {
  server=spawn(process.execPath,[path.join(root,"node_modules/next/dist/bin/next"),"start","--port","4173"],{cwd:root,stdio:"ignore"});
}
function cli(args) {
  const result=spawnSync(binary,["-s="+session,...args],{cwd:output,encoding:"utf8",timeout:120000});
  if(result.error || result.status!==0) throw result.error || new Error(result.stderr || result.stdout);
  return result.stdout;
}
try {
  let ready=false;
  for(let attempt=0;attempt<100;attempt++) {
    try { const response=await fetch(base); if(response.ok){ready=true;break;} } catch {}
    await delay(250);
  }
  if(!ready) throw new Error("Production server did not become ready at "+base);
  cli(["open","about:blank",...(process.env.RG_BROWSER?["--browser="+process.env.RG_BROWSER]:[])]);
  const require=createRequire(import.meta.url);
  const axePath=require.resolve("axe-core/axe.min.js");
  const source=(await readFile(path.join(root,"scripts/browser-scenarios.js"),"utf8")).replace(JSON.stringify("__AXE_PATH__"),JSON.stringify(axePath)).replace(JSON.stringify("__RG_BASE_URL__"),JSON.stringify(base));
  const scenario=path.join(output,browser+"-scenarios.js");
  await writeFile(scenario,source);
  const result=cli(["run-code","--filename="+scenario]);
  await writeFile(path.join(output,browser+"-output.log"),result);
  const match=result.match(/### Result\n([\s\S]*?)\n### Ran/);
  if(!match) throw new Error(result);
  const report=JSON.parse(match[1]);
  await writeFile(path.join(output,browser+"-result.json"),JSON.stringify(report,null,2)+"\n");
  console.log(browser+": "+report.passed+" browser assertions passed");
} finally {
  try { cli(["close"]); } catch {}
  server?.kill("SIGTERM");
}
