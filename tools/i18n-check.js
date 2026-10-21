/* Translation coverage check for French and Spanish.
   Usage: node tools/i18n-check.js [repoRoot]
   Lists English strings shown in the app that have no translation (they display in English),
   and translations whose English key is no longer used (stale; usually the English was edited).
   Exits 1 if anything is missing. */
const path=require('path'),{execFileSync}=require('child_process');
const root=path.resolve(process.argv[2]||'.');
const strings=JSON.parse(execFileSync('node',[path.join(root,'tools','i18n-extract.js'),root],{maxBuffer:1<<26}).toString()).map(x=>x.en);
global.window={};
let bad=0;
for(const l of ['fr','es']){
  require(path.join(root,'data','i18n-'+l+'.js'));
  const d=window.I18N[l],used=new Set(strings);
  const miss=strings.filter(s=>!d[s]),stale=Object.keys(d).filter(k=>!used.has(k));
  console.log(`${l}: ${strings.length-miss.length}/${strings.length} translated, ${miss.length} missing, ${stale.length} stale`);
  miss.slice(0,30).forEach(s=>console.log('  missing: '+s));
  stale.slice(0,30).forEach(s=>console.log('  stale:   '+s));
  bad+=miss.length;
}
process.exit(bad?1:0);
