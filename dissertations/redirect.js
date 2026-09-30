(async function check(){
try {
 const response=await fetch('./status.json?t='+Date.now(),{cache:'no-store'});
 if(!response.ok) throw new Error('not ready');
 const state=await response.json();
 if(state.status==='ready' && typeof state.url==='string') {
  const u=new URL(state.url);
  if(u.protocol==='https:' && ['github.com','raw.githubusercontent.com','zhouyixiaoxiao.com','zhouyi-xiaoxiao.github.io'].includes(u.hostname)) {
   const link=document.getElementById('document-link');link.href=u.href;link.hidden=false;
   document.getElementById('status').textContent='The revised dissertation is ready. Opening it now…';
   location.replace(u.href);return;
  }
 }
} catch (_) {}
setTimeout(check,60000);
})();