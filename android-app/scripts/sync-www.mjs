// Copy the web app from the repo root into www/ for the Android build. Run with: npm run sync
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const www = path.resolve(here, "..", "www");
rmSync(www, { recursive: true, force: true });
mkdirSync(www);
for (const f of ["index.html", "sw.js", "manifest.webmanifest", "privacy.html", "terms.html", "data/web", "data/i18n-fr.js", "data/i18n-es.js", "icons", "fonts", "brand"]) {
  cpSync(path.join(root, f), path.join(www, f), { recursive: true });
}
// Only the data the app loads goes in (data/web and the translations), not the content source files.
// The app build also loads Capacitor's JavaScript (vendor/capacitor.js), which connects the page to the native
// plugins: the Back button (App), text-to-speech and the status bar. The website never loads it.
mkdirSync(path.join(www, "vendor"));
cpSync(path.resolve(here, "..", "node_modules", "@capacitor", "core", "dist", "capacitor.js"), path.join(www, "vendor", "capacitor.js"));
const page = path.join(www, "index.html");
const html = readFileSync(page, "utf8");
if (!html.includes("</head>")) throw new Error("index.html has no </head>");
writeFileSync(page, html.replace("</head>", '<script src="vendor/capacitor.js"></script>\n</head>'));
console.log("Copied the web app into", www);
