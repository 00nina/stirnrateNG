/* =====================================================================
   SERVICE WORKER
   Sorgt dafür, dass die App auch ohne Internet startet. Mit Internet
   holt er immer die neueste Fassung, ohne Internet nimmt er die
   gespeicherte. An dieser Datei musst du normalerweise nichts ändern.
   Ausnahme: Kommt eine neue Datei zur App dazu, trage sie unten in
   die Liste DATEIEN ein.
   ===================================================================== */

const SPEICHER = "stirnraten-v1";

const DATEIEN = [
  "./",
  "index.html",
  "style.css",
  "begriffe.js",
  "app.js",
  "schrift.woff2",
  "manifest.webmanifest",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png"
];

// Beim ersten Öffnen alle Dateien auf dem Handy ablegen
self.addEventListener("install", (ereignis) => {
  ereignis.waitUntil(
    caches.open(SPEICHER).then((speicher) => speicher.addAll(DATEIEN)).then(() => self.skipWaiting())
  );
});

// Alte Ablagen früherer Fassungen aufräumen
self.addEventListener("activate", (ereignis) => {
  ereignis.waitUntil(
    caches.keys()
      .then((namen) => Promise.all(namen.filter((n) => n !== SPEICHER).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Erst im Internet nachsehen (höchstens 3 Sekunden), sonst die Ablage nehmen
self.addEventListener("fetch", (ereignis) => {
  const anfrage = ereignis.request;
  if (anfrage.method !== "GET" || new URL(anfrage.url).origin !== self.location.origin) return;

  ereignis.respondWith((async () => {
    const speicher = await caches.open(SPEICHER);
    const abgelegt = await speicher.match(anfrage, { ignoreSearch: true });
    try {
      const steuerung = new AbortController();
      const uhr = setTimeout(() => steuerung.abort(), abgelegt ? 3000 : 15000);
      const frisch = await fetch(anfrage, { cache: "no-cache", signal: steuerung.signal });
      clearTimeout(uhr);
      if (frisch.ok) speicher.put(anfrage, frisch.clone());
      return frisch;
    } catch (fehler) {
      if (abgelegt) return abgelegt;
      throw fehler;
    }
  })());
});
