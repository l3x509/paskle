// Dump EN guide text + questions per chapter for auditing
global.window={HHA:[]};
const path=require('path'),root=path.resolve(process.argv[2]||'.');
for(const f of ['a','b','c','d','map'])require(path.join(root,'data','hha-'+f+'.js'));
const M=window.HHA_SEC;
for(const c of window.HHA.sort((a,b)=>a.ch-b.ch)){
  console.log(`\n######## CH ${c.ch}: ${c.title[1]}`);
  c.sections.forEach((s,i)=>{
    console.log(`\n== S${i}: ${s.h[1]}`);
    s.b.forEach(b=>console.log(` ${b[0]}| ${b[2]}`));
    c.qs.filter(q=>M[q[0]]===i).forEach(q=>{const e=q[4];console.log(`  Q ${q[0]} [${q[2][0]}] ${e[0]} => ${e[1+q[1]]}`)});
  });
  if(c.skills)console.log(`  skills: ${c.skills.map(s=>s.title[1]).join('; ')}`);
}
