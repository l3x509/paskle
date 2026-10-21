// Copy the web app from the repo root into www/ for the Android build. Run with: npm run sync
import { cpSync, rmSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const www = path.resolve(here, "..", "www");
rmSync(www, { recursive: true, force: true });
mkdirSync(www);
for (const f of ["index.html", "sw.js", "manifest.webmanifest", "privacy.html", "data", "icons", "fonts"]) {
  cpSync(path.join(root, f), path.join(www, f), { recursive: true });
}
console.log("Copied the web app into", www);
