/* erzeugt von build_app.py - nicht von Hand aendern */
const ABLAGE='scooter-tuner-638611';
const DATEIEN=['./','./index.html','./manifest.webmanifest','./icon.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(ABLAGE).then(c=>c.addAll(DATEIEN)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(n=>Promise.all(
    n.filter(k=>k!==ABLAGE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
/* Erst das Netz, dann die Ablage: so bekommt jeder die neueste Fassung, sobald
   er Netz hat - und ohne Netz laeuft die zuletzt gesehene weiter. Umgekehrt
   waere bequemer, wuerde aber eine veraltete App festschreiben. */
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(a=>{
      if(a&&a.ok)caches.open(ABLAGE).then(c=>c.put(e.request,a.clone()));
      return a;
    }).catch(()=>caches.match(e.request).then(a=>a||caches.match('./index.html')))
  );
});
