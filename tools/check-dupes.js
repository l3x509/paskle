/* Duplicate check for HHA, CNA and permit guide questions (data/hha-*.js, data/cna-a.js, data/permit-a.js).
   Usage: node tools/check-dupes.js [repoRoot] [--threshold 0.45]
   Flags pairs of questions that likely test the same fact:
     Signals: word overlap (Jaccard, simple stemming) of the English question, or question + answer
   Score = overlap + 0.2 if same key term + 0.1 if same section; flagged when score >= threshold.
   Exits with code 1 if any pair is flagged, so it can run in CI.
   A flagged pair is not automatically wrong: two questions may test one fact from
   different angles (rule vs. situation). Review each pair, then either rewrite one,
   remove one, or add both IDs to ALLOW below. */
const path = require('path');
const args = process.argv.slice(2);
const root = path.resolve(args.find(a => !a.startsWith('--')) || '.');
const ti = args.indexOf('--threshold');
const THRESHOLD = ti >= 0 ? parseFloat(args[ti + 1]) : 0.45;

// Pairs reviewed and kept on purpose (different angle on the same fact). Format: 'idA|idB' sorted.
const ALLOW = new Set([
  'h302|h307',  // both about respiration: why count with fingers on wrist vs. what one breath is
  'h1204|hha4', // leftovers: days in fridge vs. how fast to refrigerate
  'h901|h906',  // bed bath: eye washing vs. when to change water
  'h1304|h1307', // skin: smooth sheets vs. cleaning after incontinence
  'h901|h909',  // bed bath: eye washing vs. which area last
  'h906|h909',  // bed bath: when to change water vs. which area last
  'h1007|h1011', // gait belt: how snug vs. not over a tube
  'h1012|hha11', // cane: moves with weak leg vs. which hand holds it
  'h812|hha6',  // definitions: physical abuse vs. neglect
  'h1402|n206', // 12 in-service hours: HHA rule (484.80) vs nurse aide rule (483.95); h1402 is HHA-only, never in the CNA bank
  'h1403|n207', // 24-month lapse: HHA rule vs nurse aide rule; h1403 is HHA-only
  'n309|n310',  // sundowning: what it is vs. what helps
  'n204|n217',  // abuse: resident tells you (report even if confused) vs you witness it (keep her safe, then report)
  // permit: same section, different facts
  'pm611|pm613', 'pm611|pm617', 'pm613|pm617', // three different signs
  'p10|p2',       // phone: under 18 vs 18 and older
  'pm413|pm414',  // JOL suspensions: texting vs drag racing
  'p9|pm604',     // flashing red vs flashing yellow
  'pm601|pm602', 'pm601|pm603', // right on red vs left on red vs steady yellow
  'pm730|pm731',  // parking: hydrant 10 ft vs intersection 20 ft
  'pm313|pm314',  // school bus: must stop vs the one exception
  'pm507|pm514',  // under-21 OUI: refusal vs failed test
  'pm605|pm607',  // left turn: flashing yellow arrow vs green circle
  'pm210|pm211',  // following distance: motorcycle vs large truck
  'pm222|pm804',  // skid: which way to steer vs what your feet do
]);
// Word overlap cannot see meaning: two questions can test one fact in different words.
// Review new questions by hand against their section's existing ones (see content/hha/HHA-AUDIT.md).

global.window = { HHA: [], CNA: [], PERMIT: [] };
for (const f of ['hha-a', 'hha-b', 'hha-c', 'hha-d', 'hha-map', 'cna-a', 'permit-a']) require(path.join(root, 'data', f + '.js'));
const SEC = Object.assign({}, window.HHA_SEC || {}, window.CNA_SEC || {}, window.PERMIT_SEC || {});

const STOP = new Set(('a an the of to in on at for and or is are be do you your what which who how when where why ' +
  'should it its this that with they their them client clients s does can may must not no if as by from').split(' '));
const stem = w => w.replace(/(ing|ed|es|s)$/, '');
const words = s => new Set(String(s).toLowerCase().replace(/[^a-z0-9%° ]+/g, ' ').split(/\s+/)
  .filter(w => w.length > 1 && !STOP.has(w)).map(stem));
const jaccard = (a, b) => { let i = 0; for (const w of a) if (b.has(w)) i++; return i / (a.size + b.size - i || 1); };

const Q = [];
const chapters = window.HHA.map(c => ({ c, ch: String(c.ch) })).concat(window.CNA.map(c => ({ c, ch: 'CNA' + c.ch })), (window.PERMIT || []).map(c => ({ c, ch: 'P' + c.ch })));
for (const { c, ch } of chapters) for (const q of c.qs) {
  const en = q[4];
  Q.push({ id: q[0], ch, sec: SEC[q[0]], term: String(q[2][0]).toLowerCase().trim(),
    text: en[0], ans: en[1 + q[1]], w: words(en[0] + ' ' + en[1 + q[1]]), wq: words(en[0]), wa: words(en[1 + q[1]]) });
}

const flags = [];
for (let i = 0; i < Q.length; i++) for (let j = i + 1; j < Q.length; j++) {
  const a = Q[i], b = Q[j], key = [a.id, b.id].sort().join('|');
  if (ALLOW.has(key)) continue;
  if ((a.ch[0] === 'P') !== (b.ch[0] === 'P')) continue; // permit vs. health tracks: never the same fact
  // Score: best of whole/question-only/answer-only word overlap, plus bonuses for shared term and section.
  // Answer-only overlap is left out: generic answers ("Report it to the nurse") would flag everything.
  const base = Math.max(jaccard(a.w, b.w), jaccard(a.wq, b.wq));
  const sameTerm = a.term === b.term, sameSec = a.ch === b.ch && a.sec === b.sec;
  const sim = base + (sameTerm ? 0.2 : 0) + (sameSec ? 0.1 : 0);
  if (sim < THRESHOLD) continue;
  const why = ['score ' + sim.toFixed(2), 'overlap ' + base.toFixed(2)];
  if (sameTerm) why.push('same term');
  if (sameSec) why.push('same section');
  flags.push({ a, b, why, sim });
}

flags.sort((x, y) => y.sim - x.sim);
for (const f of flags) {
  console.log(`\n${f.a.id} (ch${f.a.ch}/s${f.a.sec}) ~ ${f.b.id} (ch${f.b.ch}/s${f.b.sec})  [${f.why.join('; ')}]`);
  console.log(`  ${f.a.id}: ${f.a.text} => ${f.a.ans}`);
  console.log(`  ${f.b.id}: ${f.b.text} => ${f.b.ans}`);
}
console.log(`\n${Q.length} questions checked, ${flags.length} pair(s) flagged (threshold ${THRESHOLD}).`);
process.exit(flags.length ? 1 : 0);
