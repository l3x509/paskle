/* Collect every English UI/content string the app shows, so it can be translated.
   Usage: node tools/i18n-extract.js [repoRoot] > strings.json   (prints [{id,en}] in a stable order) */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(process.argv[2]||'.');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const js=html.match(/<script>\n([\s\S]*?)<\/script>/)[1];
// Run data files + app script in a sandbox with a fake DOM, stopping before render().
const win={HHA:[]};const ctx={window:win,localStorage:{getItem:()=>null,setItem(){}},document:{getElementById:()=>({setAttribute(){},querySelector:()=>({}),hidden:0}),querySelectorAll:()=>[],addEventListener(){},documentElement:{},body:{classList:{toggle(){}}}},confirm:()=>false,console};
vm.createContext(ctx);
for(const f of ['hha-a','hha-b','hha-c','hha-d','hha-map','cna-a','ma-cna','permit-a'])vm.runInContext(fs.readFileSync(path.join(root,'data',f+'.js'),'utf8'),ctx);
vm.runInContext(js.replace(/\nrender\(\);[\s\S]*$/,'\n')+'\n;globalThis.__X={UI,TR,Q,LS,GUIDES,GL};',ctx);
const {UI,TR,Q,LS,GUIDES,GL}=ctx.__X;
const out=[],seen=new Set();const add=s=>{if(typeof s!=='string')return;s=s.trim();if(!s||seen.has(s))return;seen.add(s);out.push(s)};
Object.values(UI.en).forEach(add);
Object.values(TR).forEach(t=>{add(t.name.en);add(t.fact.en);add(t.goalNote.en);if(t.examNote)add(t.examNote.en);Object.values(t.topics).forEach(o=>add(o.en))});
Q.forEach(x=>{x.en.forEach(add);add(x.k[0])});
GUIDES.forEach(g=>{add(g.title.en);add(g.blueprint.en);g.sections.forEach(s=>{add(s.h.en);s.b.forEach(b=>add(b[2]))});g.terms.forEach(t=>add(t[0]))});
LS.forEach(l=>{add(l.title.en);l.steps.forEach(s=>add(s[1]));add(l.note[1])});
[win.HHA_FAQ,win.PERMIT_FAQ].forEach(F=>(F||[]).forEach(f=>{add(f[1]);add(f[3])}));
Object.values(win.PERMIT_FAQ_GROUPS||{}).forEach(g=>add(g[1]));
GL.forEach(g=>add(g[0]));
console.log(JSON.stringify(out.map((en,i)=>({id:i+1,en})),null,0));
