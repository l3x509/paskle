/* Write the files the app loads, from the content files in data/.
   Usage: node tools/split_web.js [repoRoot]
   For each exam, data/web/<exam>.js holds the guides, terms, FAQ and the free questions,
   and data/web/<exam>-more.js holds the other questions. The app loads the first file right away
   and the "-more" file only when the person has access to everything (today: always, since
   Premium is switched off). Which questions are free is decided by the app itself (index.html),
   so this tool runs the app's own setup code to find out.
   Run it after any change to data/hha-*.js, data/cna-a.js, data/ma-cna.js or data/permit-a.js
   (build_cna.py, build_permit.py and kreyol_import.py run it for you). */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(process.argv[2] || '.');
const D = f => path.join(root, 'data', f);
const SRC = ['hha-a', 'hha-b', 'hha-c', 'hha-d', 'hha-map', 'cna-a', 'ma-cna', 'permit-a'];

// 1. Load the content files on their own, to copy their data.
const raw = { addEventListener() {} };
const rctx = { window: raw }; vm.createContext(rctx);
for (const f of SRC) vm.runInContext(fs.readFileSync(D(f + '.js'), 'utf8'), rctx);

// 2. Run the app's setup with the same files, to learn which questions are free and how many each exam has.
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = html.match(/<script>\n([\s\S]*?)<\/script>/)[1];
const win = { HHA: [], addEventListener() {} };
const ctx = { window: win, history: { pushState() {}, replaceState() {}, back() {} }, localStorage: { getItem: () => null, setItem() {} },
  document: { getElementById: () => ({ setAttribute() {}, querySelector: () => ({}), hidden: 0 }), querySelectorAll: () => [], addEventListener() {}, documentElement: {}, body: { classList: { toggle() {} } } },
  confirm: () => false, console };
vm.createContext(ctx);
for (const f of SRC) vm.runInContext(fs.readFileSync(D(f + '.js'), 'utf8'), ctx);
vm.runInContext(js.replace(/\nrender\(\);[\s\S]*$/, '\n') + '\n;globalThis.__X={Q,TR};', ctx);
const { Q, TR } = ctx.__X;
const free = new Set(Q.filter(x => x.free).map(x => x.id));

// Question counts per exam and topic, so the app can show totals before every question has loaded.
const QN = {};
for (const x of Q) { if (TR[x.t] && TR[x.t].soon) continue; const n = QN[x.t] = QN[x.t] || { _: 0 }; n._++; n[x.tp] = (n[x.tp] || 0) + 1; }

const J = o => JSON.stringify(o);
const split = chapters => {
  const out = [], more = {};
  for (const c of chapters.slice().sort((a, b) => a.ch - b.ch)) {
    const keep = c.qs.filter(x => free.has(x[0])), rest = c.qs.filter(x => !free.has(x[0]));
    out.push(Object.assign({}, c, { qs: keep, check: c.qs.slice(0, 5).map(x => x[0]) }));
    if (rest.length) more[c.ch] = rest;
  }
  return { out, more };
};
const hdr = '/* Made by tools/split_web.js from the files in data/. Do not edit: edit the content files and run the tool again. */\n';
fs.mkdirSync(D('web'), { recursive: true });
const write = (f, s) => fs.writeFileSync(D('web/' + f), hdr + s + '\n');
const qn = t => `window.QN=window.QN||{};window.QN.${t}=${J(QN[t] || { _: 0 })};`;

const H = split(raw.HHA), C = split(raw.CNA), P = split(raw.PERMIT);
write('hha.js', `window.HHA=${J(H.out)};\nwindow.HHA_SEC=${J(raw.HHA_SEC || {})};\nwindow.HHA_FAQ=${J(raw.HHA_FAQ || [])};\n${qn('hha')}`);
write('hha-more.js', `window.MORE=window.MORE||{};window.MORE.hha=${J(H.more)};`);
write('cna.js', `window.CNA=${J(C.out)};\nwindow.CNA_SEC=${J(raw.CNA_SEC || {})};\nwindow.MA_CNA=${J(raw.MA_CNA)};\n${qn('cna')}`);
write('cna-more.js', `window.MORE=window.MORE||{};window.MORE.cna=${J(C.more)};`);
write('permit.js', `window.PERMIT=${J(P.out)};\nwindow.PERMIT_SEC=${J(raw.PERMIT_SEC || {})};\nwindow.PERMIT_FAQ=${J(raw.PERMIT_FAQ || [])};\nwindow.PERMIT_FAQ_GROUPS=${J(raw.PERMIT_FAQ_GROUPS || {})};\n${qn('permit')}`);
write('permit-more.js', `window.MORE=window.MORE||{};window.MORE.permit=${J(P.more)};`);

const cnt = o => Object.values(o).reduce((n, a) => n + a.length, 0);
console.log(`free questions in the first files: hha ${cnt(H.out.map(c => c.qs))}, cna ${cnt(C.out.map(c => c.qs))}, permit ${cnt(P.out.map(c => c.qs))}`);
console.log(`questions in the -more files: hha ${cnt(H.more)}, cna ${cnt(C.more)}, permit ${cnt(P.more)}`);
console.log('totals', J(Object.fromEntries(Object.entries(QN).map(([t, n]) => [t, n._]))));
