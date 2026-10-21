/* Collect every Kreyòl string the app shows, paired with its English and where it appears.
   Usage: node tools/kreyol-extract.js [repoRoot] > kreyol.json   (prints [{ht,en,where:[...]}], one entry per Kreyòl+English pair)
   Used by tools/kreyol_export.py. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(process.argv[2]||'.');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const js=html.match(/<script>\n([\s\S]*?)<\/script>/)[1];
const win={HHA:[]};const ctx={window:win,localStorage:{getItem:()=>null,setItem(){}},document:{getElementById:()=>({setAttribute(){},querySelector:()=>({}),hidden:0}),querySelectorAll:()=>[],addEventListener(){},documentElement:{},body:{classList:{toggle(){}}}},confirm:()=>false,console};
vm.createContext(ctx);
for(const f of ['hha-a','hha-b','hha-c','hha-d','hha-map','cna-a','ma-cna','permit-a'])vm.runInContext(fs.readFileSync(path.join(root,'data',f+'.js'),'utf8'),ctx);
vm.runInContext(js.replace(/\nrender\(\);[\s\S]*$/,'\n')+'\n;globalThis.__X={UI,TR,Q,LS,GUIDES,GL};',ctx);
const {UI,TR,Q,LS,GUIDES,GL}=ctx.__X;
const out=new Map();
const add=(ht,en,where)=>{if(typeof ht!=='string'||!ht.trim()||ht===en)return;const k=ht+'\u0000'+(en||'');
  if(!out.has(k))out.set(k,{ht,en:en||'',where:[]});const o=out.get(k);if(o.where.length<4&&!o.where.includes(where))o.where.push(where)};
const trackName=t=>TR[t]?TR[t].code:t;
Object.keys(UI.ht).forEach(k=>add(UI.ht[k],UI.en[k],'App screens: '+k));
Object.entries(TR).forEach(([t,o])=>{const n=trackName(t);add(o.name.ht,o.name.en,n+' · exam name');add(o.fact.ht,o.fact.en,n+' · exam facts');
  add(o.goalNote.ht,o.goalNote.en,n+' · passing score');if(o.examNote)add(o.examNote.ht,o.examNote.en,n+' · practice exam note');
  Object.entries(o.topics).forEach(([k,v])=>add(v.ht,v.en,n+' · topic name'))});
const part=['question','answer A','answer B','answer C','answer D','explanation'];
Q.forEach(x=>{if(x.from)return;const n=trackName(x.t);x.ht.forEach((s,i)=>add(s,x.en[i],`${n} · ${x.id} · ${part[i]}`));add(x.k[1],x.k[0],`${n} · ${x.id} · key term`)});
GUIDES.forEach(g=>{const n=trackName(g.t)+' · guide chapter '+g.n;add(g.title.ht,g.title.en,n+' · title');add(g.blueprint.ht,g.blueprint.en,n+' · intro');
  g.sections.forEach((s,i)=>{add(s.h.ht,s.h.en,n+' · section '+(i+1)+' heading');s.b.forEach(b=>add(b[1],b[2],n+' · section '+(i+1)+': '+s.h.en))});
  g.terms.forEach(t=>add(t[1],t[0],n+' · key term'))});
LS.forEach(l=>{const n=trackName(l.t)+' · skill card: '+l.title.en;add(l.title.ht,l.title.en,n);l.steps.forEach((s,i)=>add(s[0],s[1],n+' · step '+(i+1)));add(l.note[0],l.note[1],n+' · note')});
GL.forEach(g=>add(g[1],g[0],'Glossary ('+g[2]+')'));
(win.HHA_FAQ||[]).forEach((f,i)=>{add(f[0],f[1],'HHA FAQ '+(i+1)+' · question');add(f[2],f[3],'HHA FAQ '+(i+1)+' · answer')});
(win.PERMIT_FAQ||[]).forEach((f,i)=>{add(f[0],f[1],'Permit FAQ '+(i+1)+' · question');add(f[2],f[3],'Permit FAQ '+(i+1)+' · answer')});
Object.values(win.PERMIT_FAQ_GROUPS||{}).forEach(g=>add(g[0],g[1],'Permit FAQ · section heading'));
console.log(JSON.stringify([...out.values()]));
