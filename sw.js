/* erzeugt von build_app.py - nicht von Hand aendern */
const ABLAGE='scooter-tuner-651034';
const SEITE='./index.html';
const DATEIEN=['./',SEITE,'./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
const FRIST=4000;                 /* so lange wird auf das Netz gewartet */
const GETEILT='scooter-tuner-geteilt';   /* Ablage nur fuer eine geteilte Datei */

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(ABLAGE).then(c=>c.addAll(DATEIEN)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(n=>Promise.all(
    n.filter(k=>k!==ABLAGE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

/* Erst das Netz, dann die Ablage - aber nicht ewig warten.
   Vorher wurde JEDE Anfrage unbegrenzt ans Netz gestellt; bei schlechtem Funk
   stand die App deshalb, obwohl sie vollstaendig abgelegt war. Jetzt gilt:
   - die Seite selbst: Netz mit Frist, danach die Ablage (die Fassung, die
     zuletzt gesehen wurde). Eine veraltete Fassung schreibt das nicht fest -
     sobald der Browser den neuen Service Worker holt, meldet die App
     "Neue Fassung da" (schale.js).
   - alles andere (Symbole, Manifest): erst die Ablage, im Hintergrund
     auffrischen. Diese Dateien gehoeren zu genau dieser Fassung.
   Fremde Herkunft wird gar nicht angefasst. */
function mitFrist(p,ms){
  return new Promise((gut,schlecht)=>{
    const t=setTimeout(()=>schlecht(new Error('Frist')),ms);
    p.then(a=>{clearTimeout(t);gut(a);},f=>{clearTimeout(t);schlecht(f);});
  });
}
async function seiteHolen(anfrage){
  const ablage=await caches.open(ABLAGE);
  const netz=fetch(anfrage).then(a=>{ if(a&&a.ok)ablage.put(anfrage,a.clone()); return a; });
  const da=await ablage.match(anfrage)||await ablage.match(SEITE);
  if(!da)return netz;                        /* nichts abgelegt: dann eben warten */
  try{ return await mitFrist(netz,FRIST); }
  catch(e){ netz.catch(()=>{}); return da; } /* Frist um oder kein Netz */
}
async function beigabeHolen(anfrage){
  const ablage=await caches.open(ABLAGE);
  const da=await ablage.match(anfrage);
  if(da){ fetch(anfrage).then(a=>{ if(a&&a.ok)ablage.put(anfrage,a.clone()); }).catch(()=>{}); return da; }
  try{ const a=await fetch(anfrage); if(a&&a.ok)ablage.put(anfrage,a.clone()); return a; }
  catch(e){ return (await ablage.match(SEITE))||Response.error(); }
}
/* Eine aus einer anderen App GETEILTE Datei kommt als POST herein (so steht
   es im Manifest unter share_target). Sie wird hier abgefangen, in eine
   eigene Ablage gelegt und die App danach normal geoeffnet - schale.js holt
   sie dort ab. Ohne das hier landete die Sendung im Netz und waere weg. */
async function share_ziel(anfrage){
  try{
    const daten=await anfrage.formData();
    const datei=daten.get('datei');
    if(datei&&datei.size){
      const c=await caches.open(GETEILT);
      await c.put('./_geteilt',new Response(datei,{headers:{
        'x-name':encodeURIComponent(datei.name||'geteilt.zip'),
        'Content-Type':datei.type||'application/octet-stream'}}));
    }
  }catch(e){}
  return Response.redirect('./?geteilt=1',303);
}
self.addEventListener('fetch',e=>{
  let u; try{ u=new URL(e.request.url); }catch(x){ return; }
  if(u.origin!==self.location.origin)return;
  if(e.request.method==='POST'&&u.searchParams.has('geteilt')){
    e.respondWith(share_ziel(e.request)); return;
  }
  if(e.request.method!=='GET')return;
  e.respondWith(e.request.mode==='navigate'?seiteHolen(e.request):beigabeHolen(e.request));
});
