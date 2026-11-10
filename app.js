/* =====================================================================
   NG's STIRNRATEN APP – die Logik
   =====================================================================
   Aufbau dieser Datei (von oben nach unten):
     1. Einstellungen      Zahlen und Listen, die du gefahrlos ändern kannst
     2. Hilfsfunktionen    kleine Werkzeuge, Speicher, Dialog, Kurzmeldung
     3. Kategorien         fertige und eigene Kategorien, "Dies & Das"
     4. Töne               werden im Handy erzeugt, es gibt keine Tondateien
     5. Bewegung           erkennt das Kippen des Handys
     6. Seiten             Startseite, Teams, Kategorieauswahl, vor dem Zug
     7. Die Runde          Countdown, Begriffe, Zeit, Auswertung
     8. Ergebnis           Liste nach dem Zug und Siegerehrung
     9. Eigene Kategorien  anlegen, bearbeiten, teilen, importieren
    10. Start              wird einmal beim Öffnen der App ausgeführt
   ===================================================================== */
"use strict";

/* =====================================================================
   1. EINSTELLUNGEN
   ===================================================================== */

// Wählbare Rundenzeiten in Sekunden
const ZEITEN = [60, 90, 120];

// So viele Begriffe braucht eine eigene Kategorie, damit man sie spielen kann
const MIN_BEGRIFFE = 5;

const MAX_TEAMS = 8;
const MAX_RUNDEN = 10;

// Wie weit man kippen muss. Die Werte gehen von -1 (Display zeigt zum Boden)
// über 0 (Handy steht senkrecht) bis 1 (Display zeigt zur Decke).
// Reagiert die App zu früh, die Zahlen weiter von 0 wegschieben.
const KIPPEN = {
  richtig: -0.60,   // darunter zählt es als "Richtig"
  weiter: 0.72,     // darüber zählt es als "Überspringen"
  geradeVon: -0.35, // zwischen diesen beiden Werten gilt das Handy
  geradeBis: 0.45   // wieder als gerade und der nächste Begriff ist dran
};

// So lange blitzt der Bildschirm grün oder rot auf (Millisekunden)
const BLITZ_DAUER = 700;

// Farben für Teams und eigene Kategorien
const FARBEN = ["#FF5C5C", "#4D7CFE", "#1FD1A5", "#FFB627", "#B28DFF", "#FF6FB5", "#3CC4F0", "#B6E33A"];

// Symbole, die man für eigene Kategorien wählen kann
const EMOJIS = ["🎉", "💃", "🍸", "✈️", "🏖️", "🎓", "💍", "🏠", "🐶", "🎤", "📸", "💬", "❤️", "😂", "🔥", "🌙"];


/* =====================================================================
   2. HILFSFUNKTIONEN
   ===================================================================== */

const $ = (auswahl) => document.querySelector(auswahl);
const $$ = (auswahl) => Array.from(document.querySelectorAll(auswahl));

// Baut ein HTML-Element. Texte werden immer als reiner Text eingesetzt,
// damit selbst geschriebene oder importierte Begriffe nichts kaputt machen.
function el(tag, eigenschaften = {}, ...kinder) {
  const e = document.createElement(tag);
  for (const [name, wert] of Object.entries(eigenschaften)) {
    if (wert == null || wert === false) continue;
    if (name === "class") e.className = wert;
    else if (name === "text") e.textContent = wert;
    else if (name === "farbe") e.style.setProperty("--farbe", wert);
    else if (name.startsWith("on")) e.addEventListener(name.slice(2), wert);
    else e.setAttribute(name, wert === true ? "" : wert);
  }
  for (const kind of kinder.flat()) if (kind != null) e.append(kind);
  return e;
}

function mische(liste) {
  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [liste[i], liste[j]] = [liste[j], liste[i]];
  }
  return liste;
}

// Speichert Daten dauerhaft auf diesem Handy
const speicher = {
  lesen(name, ersatz) {
    try {
      const roh = localStorage.getItem("sng." + name);
      return roh ? JSON.parse(roh) : ersatz;
    } catch (fehler) {
      return ersatz;
    }
  },
  schreiben(name, wert) {
    try { localStorage.setItem("sng." + name, JSON.stringify(wert)); } catch (fehler) { /* Speicher voll oder gesperrt */ }
  }
};

let einstellungen = Object.assign(
  { zeit: 60, ton: true, steuerung: "kippen", runden: 3, teams: ["Team 1", "Team 2"], tippGesehen: false },
  speicher.lesen("einstellungen", {})
);
if (!ZEITEN.includes(einstellungen.zeit)) einstellungen.zeit = ZEITEN[0];
if (!Array.isArray(einstellungen.teams) || einstellungen.teams.length < 2) einstellungen.teams = ["Team 1", "Team 2"];

function sichereEinstellungen() { speicher.schreiben("einstellungen", einstellungen); }

// Seite wechseln
function zeige(id) {
  $$(".seite").forEach((s) => s.classList.toggle("aktiv", s.id === id));
  window.scrollTo(0, 0);
}

// Kurze Meldung am unteren Rand
let meldungUhr = null;
function meldung(text) {
  const m = $("#meldung");
  m.textContent = text;
  m.hidden = false;
  clearTimeout(meldungUhr);
  meldungUhr = setTimeout(() => { m.hidden = true; }, 3200);
}

// Dialog mit Knöpfen. Liefert zurück, welcher Knopf gedrückt wurde.
// knoepfe: [{ text, wert, art, aktion }]. Ein Knopf mit "aktion" schließt den Dialog nicht.
function dialog({ text, knoepfe, feld }) {
  return new Promise((fertig) => {
    const box = $("#dialog");
    const eingabe = $("#dialogFeld");
    $("#dialogText").textContent = text;
    eingabe.hidden = !feld;
    if (feld) {
      eingabe.value = feld.wert || "";
      eingabe.placeholder = feld.platzhalter || "";
      eingabe.readOnly = !!feld.nurLesen;
    }
    const leiste = $("#dialogKnoepfe");
    leiste.replaceChildren(...knoepfe.map((k) => el("button", {
      class: "knopf breit " + (k.art || "leise"),
      text: k.text,
      onclick: () => {
        if (k.aktion) { k.aktion(eingabe); return; }
        box.hidden = true;
        fertig({ wahl: k.wert, eingabe: eingabe.value });
      }
    })));
    box.hidden = false;
  });
}

async function bestaetige(text, jaText, art = "haupt") {
  const antwort = await dialog({
    text,
    knoepfe: [{ text: jaText, wert: true, art }, { text: "Abbrechen", wert: false }]
  });
  return antwort.wahl === true;
}


/* =====================================================================
   3. KATEGORIEN
   ===================================================================== */

// Eigene Kategorien: [{ id, name, emoji, begriffe: [...], imMix }]
let eigene = speicher.lesen("eigene", []);
if (!Array.isArray(eigene)) eigene = [];

// Merkt sich pro Kategorie, welche Begriffe schon dran waren. So kommt
// jeder Begriff erst wieder, wenn alle anderen einmal gezeigt wurden.
let gesehen = speicher.lesen("gesehen", {});

function alleKategorien() {
  const fertige = KATEGORIEN.map((k) => Object.assign({}, k, { eigen: false }));
  const selbst = eigene.map((k, i) => ({
    id: k.id,
    name: k.name.trim() || "Ohne Namen",
    emoji: k.emoji,
    farbe: FARBEN[(i + 4) % FARBEN.length],
    begriffe: k.begriffe,
    eigen: true,
    imMix: k.imMix !== false
  }));
  // "Dies & Das" mischt alles zusammen, doppelte Begriffe nur einmal
  const gemischt = new Set();
  fertige.forEach((k) => k.begriffe.forEach((b) => gemischt.add(b)));
  selbst.filter((k) => k.imMix).forEach((k) => k.begriffe.forEach((b) => gemischt.add(b)));
  const mix = {
    id: "mix", name: "Dies & Das", emoji: "🎲", farbe: "#FFB627",
    begriffe: Array.from(gemischt), mix: true, hinweis: "Begriffe aus allen Kategorien, bunt gemischt."
  };
  return [mix, ...fertige, ...selbst];
}

function findeKategorie(id) {
  return alleKategorien().find((k) => k.id === id);
}

// Legt für eine Runde einen frisch gemischten Stapel an
function neuerStapel(kat) {
  const schon = new Set(gesehen[kat.id] || []);
  let rest = kat.begriffe.filter((b) => !schon.has(b));
  if (!rest.length) {
    gesehen[kat.id] = [];
    rest = kat.begriffe.slice();
  }
  return mische(rest);
}

// Zieht den nächsten Begriff. Ist der Stapel leer, wird neu gemischt.
function zieheBegriff(runde) {
  const kat = runde.kat;
  if (!runde.stapel.length) {
    gesehen[kat.id] = [];
    runde.stapel = mische(kat.begriffe.slice());
    const oben = runde.stapel.length - 1;
    if (oben > 0 && runde.stapel[oben] === runde.letzter) {
      [runde.stapel[0], runde.stapel[oben]] = [runde.stapel[oben], runde.stapel[0]];
    }
  }
  const begriff = runde.stapel.pop();
  (gesehen[kat.id] = gesehen[kat.id] || []).push(begriff);
  runde.letzter = begriff;
  return begriff;
}


/* =====================================================================
   4. TÖNE
   ===================================================================== */

let audio = null;

// Muss bei einem Fingertipp aufgerufen werden, sonst bleibt das iPhone stumm
function toeneBereit() {
  if (!einstellungen.ton) return;
  try {
    const Klasse = window.AudioContext || window.webkitAudioContext;
    if (!Klasse) return;
    if (!audio) audio = new Klasse();
    if (audio.state !== "running") audio.resume();
    // Lässt die Töne auch im Lautlos-Modus erklingen
    if (navigator.audioSession) navigator.audioSession.type = "playback";
  } catch (fehler) { /* dann eben ohne Ton */ }
}

function piep(frequenz, start, dauer, form = "triangle", laut = 0.3, zielFrequenz = null) {
  if (!einstellungen.ton || !audio) return;
  try {
    if (audio.state !== "running") audio.resume();
    const t = audio.currentTime + start;
    const osz = audio.createOscillator();
    const regler = audio.createGain();
    osz.type = form;
    osz.frequency.setValueAtTime(frequenz, t);
    if (zielFrequenz) osz.frequency.exponentialRampToValueAtTime(zielFrequenz, t + dauer);
    regler.gain.setValueAtTime(0.0001, t);
    regler.gain.exponentialRampToValueAtTime(laut, t + 0.015);
    regler.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    osz.connect(regler).connect(audio.destination);
    osz.start(t);
    osz.stop(t + dauer + 0.05);
  } catch (fehler) { /* kein Ton */ }
}

const klang = {
  richtig() { piep(660, 0, 0.14); piep(990, 0.11, 0.28); },
  weiter() { piep(330, 0, 0.26, "sawtooth", 0.16, 180); },
  zaehlen() { piep(520, 0, 0.12, "sine", 0.3); },
  los() { piep(1040, 0, 0.4, "sine", 0.32); },
  tick() { piep(880, 0, 0.06, "square", 0.1); },
  zeitUm() { piep(620, 0, 0.2, "square", 0.16); piep(465, 0.22, 0.2, "square", 0.16); piep(310, 0.44, 0.6, "square", 0.16); },
  sieg() { [523, 659, 784, 1047].forEach((f, i) => piep(f, i * 0.14, 0.32)); piep(1319, 0.6, 0.6); }
};

// Verhindert, dass das Display während einer Runde ausgeht
let wachSperre = null;
function bleibWach() {
  try {
    if ("wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then((sperre) => { wachSperre = sperre; }).catch(() => {});
    }
  } catch (fehler) { /* nicht unterstützt */ }
}
function darfSchlafen() {
  try { if (wachSperre) wachSperre.release(); } catch (fehler) { /* egal */ }
  wachSperre = null;
}


/* =====================================================================
   5. BEWEGUNG
   ===================================================================== */

const lage = {
  daten: false,  // kommen überhaupt Messwerte an?
  kipp: 0,       // -1 Display zum Boden, 0 senkrecht, 1 Display zur Decke
  quer: 0,       // zeigt, wie herum das Handy quer gehalten wird
  richtung: 90   // um so viel Grad wird die Bühne im Hochformat gedreht
};

// Das iPhone fragt beim ersten Mal, ob die App die Bewegung lesen darf.
// Die Frage darf nur direkt nach einem Fingertipp gestellt werden.
async function bewegungErlaubt() {
  if (typeof DeviceOrientationEvent === "undefined") return false;
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    try {
      return (await DeviceOrientationEvent.requestPermission()) === "granted";
    } catch (fehler) {
      return false;
    }
  }
  return true;
}

window.addEventListener("deviceorientation", (ereignis) => {
  if (ereignis.beta == null || ereignis.gamma == null) return;
  const beta = ereignis.beta * Math.PI / 180;
  const gamma = ereignis.gamma * Math.PI / 180;
  // Aus den beiden Winkeln wird berechnet, wohin das Display zeigt
  const kipp = Math.cos(beta) * Math.cos(gamma);
  const quer = -Math.cos(beta) * Math.sin(gamma);
  lage.kipp = lage.daten ? lage.kipp * 0.5 + kipp * 0.5 : kipp;
  lage.quer = quer;
  lage.daten = true;
  if (Math.abs(quer) > 0.6 && Math.abs(kipp) < 0.5) {
    const richtung = quer > 0 ? 90 : -90;
    if (richtung !== lage.richtung) { lage.richtung = richtung; richteBuehne(); }
  }
  if (runde) beiBewegung();
});


/* =====================================================================
   6. SEITEN
   ===================================================================== */

// Das laufende Spiel:
// { modus, katId, teams: [{ name, farbe }], runden, zuege: [{ team, runde, eintraege }], zug }
let spiel = null;

function neuesSpiel(modus) {
  const teams = modus === "teams"
    ? einstellungen.teams.map((name, i) => ({ name: name.trim() || "Team " + (i + 1), farbe: FARBEN[i % FARBEN.length] }))
    : [];
  spiel = { modus, katId: null, teams, runden: modus === "teams" ? einstellungen.runden : 1, zuege: [], zug: 0 };
}

function punkteVon(teamNr) {
  return spiel.zuege
    .filter((z) => z.team === teamNr)
    .reduce((summe, z) => summe + z.eintraege.filter((e) => e.status === "erraten").length, 0);
}

/* ---------- Auswahlknöpfe für Zeit, Steuerung und Töne ---------- */

const AUSWAHL = {
  zeit: () => ZEITEN.map((z) => [z, z + " Sek."]),
  steuerung: () => [["kippen", "Kippen"], ["tippen", "Tippen"]],
  ton: () => [[true, "An"], [false, "Aus"]]
};

function zeichneAuswahl() {
  $$("[data-auswahl]").forEach((gruppe) => {
    const art = gruppe.dataset.auswahl;
    gruppe.replaceChildren(...AUSWAHL[art]().map(([wert, text]) => el("button", {
      class: "wahl" + (einstellungen[art] === wert ? " an" : ""),
      text,
      "aria-pressed": String(einstellungen[art] === wert),
      onclick: () => {
        einstellungen[art] = wert;
        sichereEinstellungen();
        if (art === "ton" && wert) { toeneBereit(); klang.richtig(); }
        zeichneAuswahl();
        zeichneErklaerung();
      }
    })));
  });
}

function zeichneErklaerung() {
  $("#bereitErklaerung").textContent = einstellungen.steuerung === "kippen"
    ? "Handy quer an die Stirn halten. Nach unten kippen zählt als richtig, nach oben kippen überspringt den Begriff."
    : "Handy quer an die Stirn halten. Die Tasten für Richtig und Überspringen liegen unten auf dem Display.";
}

/* ---------- Teams einrichten ---------- */

function zeichneTeams() {
  const liste = $("#teamListe");
  liste.replaceChildren(...einstellungen.teams.map((name, i) => el("div", { class: "team-zeile" },
    el("span", { class: "team-punkt", farbe: FARBEN[i % FARBEN.length] }),
    el("input", {
      class: "eingabe", type: "text", maxlength: "20", value: name,
      placeholder: "Team " + (i + 1), "aria-label": "Name von Team " + (i + 1), autocomplete: "off",
      oninput: (e) => { einstellungen.teams[i] = e.target.value; sichereEinstellungen(); }
    }),
    einstellungen.teams.length > 2
      ? el("button", {
          class: "team-weg", text: "Entfernen",
          onclick: () => { einstellungen.teams.splice(i, 1); sichereEinstellungen(); zeichneTeams(); }
        })
      : el("span")
  )));
  $("#btnTeamNeu").hidden = einstellungen.teams.length >= MAX_TEAMS;
  $("#rundenWert").textContent = einstellungen.runden;
  $("#rundenMinus").disabled = einstellungen.runden <= 1;
  $("#rundenPlus").disabled = einstellungen.runden >= MAX_RUNDEN;
}

function aendereRunden(schritt) {
  einstellungen.runden = Math.min(MAX_RUNDEN, Math.max(1, einstellungen.runden + schritt));
  sichereEinstellungen();
  zeichneTeams();
}

/* ---------- Kategorie wählen ---------- */

let kategorienZurueck = "s-start";

function zeigeKategorien(zurueck) {
  if (zurueck) kategorienZurueck = zurueck;
  const kacheln = alleKategorien().map((kat) => {
    const zuWenig = kat.begriffe.length < MIN_BEGRIFFE;
    const fehlen = MIN_BEGRIFFE - kat.begriffe.length;
    const info = zuWenig
      ? "Noch " + fehlen + (fehlen === 1 ? " Begriff nötig" : " Begriffe nötig")
      : kat.begriffe.length + " Begriffe" + (kat.eigen ? ", eigene" : "");
    return el("button", {
      class: "kachel" + (kat.mix ? " mix" : ""), farbe: kat.farbe, disabled: zuWenig,
      onclick: () => { spiel.katId = kat.id; zeigeBereit(); }
    },
      el("span", { class: "kachel-emoji", text: kat.emoji }),
      el("span", { class: "kachel-name" }, kat.name, el("span", { class: "kachel-info", text: info }))
    );
  });
  kacheln.push(el("button", {
    class: "kachel neu",
    onclick: () => oeffneEditor(null, "s-kategorien")
  }, el("span", { class: "kachel-name", text: "Eigene Kategorie anlegen" })));
  $("#kachelListe").replaceChildren(...kacheln);
  zeige("s-kategorien");
}

/* ---------- Vor dem Zug ---------- */

function zeigeBereit() {
  const kat = findeKategorie(spiel.katId);
  if (!kat) { zeigeKategorien(); return; }
  const teams = spiel.modus === "teams";

  $("#bereitKarte").style.setProperty("--farbe", kat.farbe);
  $("#bereitEmoji").textContent = kat.emoji;
  $("#bereitName").textContent = kat.name;
  $("#bereitHinweis").textContent = kat.hinweis || "";

  $("#bereitTeam").hidden = !teams;
  $("#bereitEinstellungen").hidden = teams;

  if (teams) {
    const teamNr = spiel.zug % spiel.teams.length;
    const rundeNr = Math.floor(spiel.zug / spiel.teams.length) + 1;
    const team = spiel.teams[teamNr];
    $("#bereitTitel").textContent = "Runde " + rundeNr + " von " + spiel.runden;
    $("#dranName").textContent = team.name;
    $("#dranName").style.setProperty("--farbe", team.farbe);
    $("#standListe").replaceChildren(...spiel.teams.map((t, i) => el("div", { class: "stand-zeile" },
      el("span", { class: "team-punkt", farbe: t.farbe }),
      el("span", { text: t.name }),
      el("span", { class: "stand-punkte", text: String(punkteVon(i)) })
    )));
    $("#btnStart").textContent = "Zug starten";
  } else {
    $("#bereitTitel").textContent = "Gleich geht's los";
    $("#btnStart").textContent = "Runde starten";
  }
  zeichneAuswahl();
  zeichneErklaerung();
  zeige("s-bereit");
}

async function bereitZurueck() {
  if (spiel.modus === "teams" && spiel.zuege.length > 0) {
    if (await bestaetige("Das laufende Spiel beenden? Der Punktestand geht verloren.", "Spiel beenden", "gefahr")) zeige("s-start");
    return;
  }
  zeigeKategorien();
}


/* =====================================================================
   7. DIE RUNDE
   ===================================================================== */

// Die laufende Runde. Phasen: platzieren -> countdown -> spiel -> ende
let runde = null;
let startLaeuft = false; // verhindert, dass ein Doppeltipp zwei Runden startet

async function starteZug() {
  const kat = findeKategorie(spiel.katId);
  if (!kat || runde || startLaeuft) return;
  startLaeuft = true;

  // Diese drei Dinge erlaubt das iPhone nur direkt nach einem Fingertipp
  toeneBereit();
  bleibWach();
  let tippen = einstellungen.steuerung === "tippen";
  let hinweis = "";
  if (!tippen) {
    lage.daten = false;
    if (!(await bewegungErlaubt())) {
      tippen = true;
      hinweis = "Bewegung ist nicht erlaubt. Ihr spielt diese Runde mit Tippen.";
    }
  }
  startLaeuft = false;

  runde = {
    kat,
    tippen,
    phase: "platzieren",
    dauer: einstellungen.zeit * 1000,
    endeUm: 0,           // Zeitpunkt, an dem die Zeit abläuft
    restBeiPause: 0,
    stapel: neuerStapel(kat),
    letzter: null,
    aktuell: null,       // der Begriff, der gerade zu sehen ist
    eintraege: [],       // alles, was in dieser Runde gezeigt wurde
    scharf: false,       // true, sobald das Handy wieder gerade ist
    blitz: false,        // true, während der Bildschirm aufblitzt
    pausiert: false,
    geradeSeit: 0,
    letzteSekunde: null,
    uhren: []
  };

  const buehne = $("#buehne");
  buehne.style.setProperty("--farbe", kat.farbe);
  buehne.hidden = false;
  document.body.style.overflow = "hidden";
  $("#buehnePause").hidden = true;
  $("#tippKnoepfe").hidden = !tippen;
  setzePhase("platzieren");
  richteBuehne();
  if (hinweis) meldung(hinweis);

  // Kommen nach kurzer Zeit keine Messwerte an, wird auf Tippen umgestellt
  if (!tippen) {
    const dieseRunde = runde;
    spaeter(1500, () => {
      if (runde !== dieseRunde || lage.daten || runde.tippen) return;
      runde.tippen = true;
      $("#tippKnoepfe").hidden = false;
      if (runde.phase === "platzieren") setzePhase("platzieren");
      meldung("Keine Bewegung erkannt. Ihr spielt diese Runde mit Tippen.");
      passeWortAn();
    });
  }
}

// Wie setTimeout, wird aber beim Ende der Runde automatisch abgeräumt
function spaeter(ms, aktion) {
  const uhr = setTimeout(aktion, ms);
  if (runde) runde.uhren.push(uhr);
  return uhr;
}

function setzePhase(phase) {
  runde.phase = phase;
  const buehne = $("#buehne");
  buehne.classList.remove("phase-platzieren", "phase-countdown", "phase-spiel", "phase-ende", "blitz-ja", "blitz-nein");
  buehne.classList.add("phase-" + phase);
  const unten = $("#buehneUnten");
  if (phase === "platzieren") {
    setzeWort("Handy quer an die Stirn");
    unten.replaceChildren(
      el("span", { text: runde.tippen ? "Tippe auf das Display, wenn du bereit bist. " : "Es geht von selbst los. " }),
      el("button", { class: "pause-knopf", text: "Abbrechen", onclick: (e) => { e.stopPropagation(); brichAb(); } })
    );
  } else if (phase === "spiel") {
    unten.textContent = runde.kat.id === "pantomime" ? runde.kat.hinweis : runde.kat.name;
  } else {
    unten.textContent = "";
  }
}

function setzeWort(text) {
  $("#wort").textContent = text;
  passeWortAn();
}

// Macht den Begriff so groß, wie er gerade noch auf die Bühne passt
function passeWortAn() {
  const box = $("#wortBox");
  const wort = $("#wort");
  if ($("#buehne").hidden || !box.clientWidth) return;
  let klein = 16;
  let gross = Math.max(40, Math.floor(box.clientHeight * 0.72));
  while (gross - klein > 1) {
    const mitte = (klein + gross) >> 1;
    wort.style.fontSize = mitte + "px";
    if (wort.scrollWidth <= box.clientWidth && wort.offsetHeight <= box.clientHeight) klein = mitte;
    else gross = mitte;
  }
  wort.style.fontSize = klein + "px";
}

// Die Bühne ist immer im Querformat. Steht das iPhone im Hochformat
// (Ausrichtungssperre an), wird sie um 90 Grad gedreht.
function richteBuehne() {
  const buehne = $("#buehne");
  if (buehne.hidden) return;
  const breite = window.innerWidth;
  const hoehe = window.innerHeight;
  if (breite >= hoehe) {
    buehne.style.width = breite + "px";
    buehne.style.height = hoehe + "px";
    buehne.style.transform = "translate(-50%, -50%)";
  } else {
    buehne.style.width = hoehe + "px";
    buehne.style.height = breite + "px";
    buehne.style.transform = "translate(-50%, -50%) rotate(" + lage.richtung + "deg)";
  }
  passeWortAn();
}

function starteCountdown() {
  if (!runde || runde.phase !== "platzieren") return;
  setzePhase("countdown");
  let zahl = 3;
  const schritt = () => {
    if (!runde) return;
    if (zahl === 0) { starteSpiel(); return; }
    setzeWort(String(zahl));
    klang.zaehlen();
    zahl--;
    spaeter(900, schritt);
  };
  schritt();
}

function starteSpiel() {
  setzePhase("spiel");
  klang.los();
  runde.endeUm = Date.now() + runde.dauer;
  runde.scharf = false;
  runde.takt = setInterval(takt, 100);
  zeigeNaechsten();
  takt();
}

function zeigeNaechsten() {
  runde.aktuell = zieheBegriff(runde);
  setzeWort(runde.aktuell);
}

// Läuft zehnmal pro Sekunde und aktualisiert die Zeitanzeige
function takt() {
  if (!runde || runde.phase !== "spiel" || runde.pausiert) return;
  const rest = Math.max(0, runde.endeUm - Date.now());
  const sekunden = Math.ceil(rest / 1000);
  $("#zeitFuellung").style.transform = "scaleX(" + (rest / runde.dauer) + ")";
  if (sekunden !== runde.letzteSekunde) {
    runde.letzteSekunde = sekunden;
    $("#zeitAnzeige").textContent = Math.floor(sekunden / 60) + ":" + String(sekunden % 60).padStart(2, "0");
    $("#zeitAnzeige").classList.toggle("knapp", sekunden <= 5);
    if (sekunden <= 5 && sekunden > 0) klang.tick();
  }
  zeigeTreffer();
  if (rest <= 0) zeitUm();
}

function zeigeTreffer() {
  const zahl = runde.eintraege.filter((e) => e.status === "erraten").length;
  $("#trefferAnzeige").textContent = zahl + " erraten";
}

// Wird bei jedem neuen Messwert des Bewegungssensors aufgerufen
function beiBewegung() {
  if (runde.tippen || runde.pausiert) return;
  const gerade = lage.kipp > KIPPEN.geradeVon && lage.kipp < KIPPEN.geradeBis;

  if (runde.phase === "platzieren") {
    // Wird das Handy eine Sekunde lang quer und aufrecht gehalten, geht es los
    if (gerade && Math.abs(lage.quer) > 0.6) {
      if (!runde.geradeSeit) runde.geradeSeit = Date.now();
      else if (Date.now() - runde.geradeSeit > 1000) starteCountdown();
    } else {
      runde.geradeSeit = 0;
    }
    return;
  }

  if (runde.phase !== "spiel" || runde.blitz) return;
  if (!runde.scharf) {
    if (gerade) runde.scharf = true;
    return;
  }
  if (lage.kipp < KIPPEN.richtig) werte("erraten");
  else if (lage.kipp > KIPPEN.weiter) werte("uebersprungen");
}

// Ein Begriff wurde erraten oder übersprungen
function werte(status) {
  if (!runde || runde.phase !== "spiel" || runde.blitz || runde.pausiert || !runde.aktuell) return;
  runde.eintraege.push({ wort: runde.aktuell, status });
  runde.aktuell = null;
  runde.blitz = true;
  runde.scharf = false;
  const richtig = status === "erraten";
  if (richtig) klang.richtig(); else klang.weiter();
  $("#buehne").classList.add(richtig ? "blitz-ja" : "blitz-nein");
  setzeWort(richtig ? "Richtig!" : "Übersprungen");
  zeigeTreffer();
  spaeter(BLITZ_DAUER, () => {
    if (!runde || runde.phase !== "spiel") return;
    runde.blitz = false;
    $("#buehne").classList.remove("blitz-ja", "blitz-nein");
    zeigeNaechsten();
  });
}

function zeitUm() {
  clearInterval(runde.takt);
  // Der Begriff, der beim Ablauf der Zeit zu sehen war, bleibt offen
  if (runde.aktuell) runde.eintraege.push({ wort: runde.aktuell, status: "offen" });
  runde.aktuell = null;
  setzePhase("ende");
  setzeWort("Zeit um!");
  klang.zeitUm();
  spaeter(1700, beendeZug);
}

function raeumeBuehneAb() {
  clearInterval(runde.takt);
  runde.uhren.forEach(clearTimeout);
  runde = null;
  $("#buehne").hidden = true;
  document.body.style.overflow = "";
  darfSchlafen();
  speicher.schreiben("gesehen", gesehen);
}

function beendeZug() {
  const eintraege = runde.eintraege;
  raeumeBuehneAb();
  const zug = {
    team: spiel.modus === "teams" ? spiel.zug % spiel.teams.length : 0,
    runde: spiel.modus === "teams" ? Math.floor(spiel.zug / spiel.teams.length) + 1 : 1,
    eintraege
  };
  spiel.zuege.push(zug);
  zeigeErgebnis(zug);
}

function brichAb() {
  if (!runde) return;
  raeumeBuehneAb();
  zeigeBereit();
}

function pausiere() {
  if (!runde || runde.phase !== "spiel" || runde.pausiert) return;
  runde.pausiert = true;
  runde.restBeiPause = Math.max(0, runde.endeUm - Date.now());
  $("#buehnePause").hidden = false;
}

function spieleWeiter() {
  if (!runde || !runde.pausiert) return;
  runde.pausiert = false;
  runde.scharf = false;
  runde.endeUm = Date.now() + runde.restBeiPause;
  $("#buehnePause").hidden = true;
  toeneBereit();
  bleibWach();
}


/* =====================================================================
   8. ERGEBNIS UND SIEGEREHRUNG
   ===================================================================== */

const STATUS_TEXT = { erraten: "Erraten", uebersprungen: "Übersprungen", offen: "Zeit um" };

function zeigeErgebnis(zug) {
  const teams = spiel.modus === "teams";
  $("#ergebnisTitel").textContent = teams ? spiel.teams[zug.team].name : "Ergebnis";

  const zeichne = () => {
    const erraten = zug.eintraege.filter((e) => e.status === "erraten").length;
    $("#punkteZahl").textContent = erraten;
    $("#punkteText").textContent = erraten === 1 ? "Begriff erraten" : "Begriffe erraten";
    $("#ergebnisTipp").hidden = zug.eintraege.length === 0;
    $("#verlaufListe").replaceChildren(...zug.eintraege.map((e, i) => el("li", { class: "status-" + e.status },
      el("button", {
        "aria-label": e.wort + ", " + STATUS_TEXT[e.status] + ". Tippen zum Ändern.",
        onclick: () => {
          e.status = e.status === "erraten" ? "uebersprungen" : "erraten";
          zeichne();
        }
      },
        el("span", { class: "verlauf-nr", text: (i + 1) + "." }),
        el("span", { class: "verlauf-wort", text: e.wort }),
        el("span", { class: "verlauf-status", text: STATUS_TEXT[e.status] })
      )
    )));
  };
  zeichne();

  const knoepfe = [];
  if (teams) {
    const letzter = spiel.zug + 1 >= spiel.teams.length * spiel.runden;
    knoepfe.push(el("button", {
      class: "knopf haupt breit", text: letzter ? "Zur Siegerehrung" : "Weiter",
      onclick: () => {
        if (letzter) { zeigeFinale(); return; }
        spiel.zug++;
        zeigeBereit();
      }
    }));
  } else {
    knoepfe.push(
      el("button", { class: "knopf haupt breit", text: "Nochmal spielen", onclick: zeigeBereit }),
      el("button", { class: "knopf leise breit", text: "Andere Kategorie", onclick: () => zeigeKategorien() }),
      el("button", { class: "knopf leise breit", text: "Zur Startseite", onclick: () => zeige("s-start") })
    );
  }
  $("#ergebnisKnoepfe").replaceChildren(...knoepfe);
  zeige("s-ergebnis");
}

function zeigeFinale() {
  const tabelle = spiel.teams
    .map((t, i) => ({ name: t.name, farbe: t.farbe, punkte: punkteVon(i) }))
    .sort((a, b) => b.punkte - a.punkte);
  const bestwert = tabelle[0].punkte;
  const sieger = tabelle.filter((t) => t.punkte === bestwert);

  $("#siegerText").textContent = sieger.length === 1
    ? sieger[0].name + " gewinnt!"
    : "Gleichstand zwischen " + sieger.map((t) => t.name).join(" und ");

  let platz = 0;
  let vorher = null;
  $("#rangListe").replaceChildren(...tabelle.map((t, i) => {
    if (t.punkte !== vorher) { platz = i + 1; vorher = t.punkte; }
    return el("li", { class: "rang" + (t.punkte === bestwert ? " erster" : ""), farbe: t.farbe },
      el("span", { class: "rang-platz", text: platz + "." }),
      el("span", { class: "rang-name", text: t.name }),
      el("span", { class: "rang-punkte", text: String(t.punkte) })
    );
  }));
  klang.sieg();
  zeige("s-finale");
}


/* =====================================================================
   9. EIGENE KATEGORIEN
   ===================================================================== */

function sichereEigene() { speicher.schreiben("eigene", eigene); }

function zeigeEigene() {
  const liste = $("#eigeneListe");
  if (!eigene.length) {
    liste.replaceChildren(el("p", {
      class: "leer",
      text: "Noch keine eigene Kategorie. Lege eine an und fülle sie mit euren Wörtern und Insidern."
    }));
  } else {
    const alle = alleKategorien().filter((k) => k.eigen);
    liste.replaceChildren(...alle.map((kat) => el("button", {
      class: "eigen-zeile", onclick: () => oeffneEditor(kat.id, "s-eigene")
    },
      el("span", { class: "eigen-emoji", farbe: kat.farbe, text: kat.emoji }),
      el("span", { class: "eigen-name" }, kat.name,
        el("span", { class: "eigen-info", text: kat.begriffe.length === 1 ? "1 Begriff" : kat.begriffe.length + " Begriffe" })),
      el("span", { class: "eigen-pfeil", text: "Bearbeiten" })
    )));
  }
  zeige("s-eigene");
}

/* ---------- Bearbeiten ---------- */

let entwurf = null;         // die Kategorie, die gerade bearbeitet wird
let editorZurueck = "s-eigene";

function oeffneEditor(id, zurueck) {
  editorZurueck = zurueck;
  entwurf = id ? eigene.find((k) => k.id === id) : {
    id: "e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: "", emoji: EMOJIS[0], begriffe: [], imMix: true
  };
  $("#katName").value = entwurf.name;
  $("#katImMix").checked = entwurf.imMix !== false;
  $("#neuerBegriff").value = "";
  zeichneEditor();
  zeige("s-editor");
}

// Speichert bei jeder Änderung. Eine ganz leere Kategorie wird nicht angelegt.
function sichereEntwurf() {
  const leer = !entwurf.name.trim() && !entwurf.begriffe.length;
  const stelle = eigene.indexOf(entwurf);
  if (leer) { if (stelle >= 0) eigene.splice(stelle, 1); }
  else if (stelle < 0) eigene.push(entwurf);
  sichereEigene();
}

function zeichneEditor() {
  $("#emojiWahl").replaceChildren(...EMOJIS.map((emoji) => el("button", {
    class: "emoji-knopf" + (entwurf.emoji === emoji ? " an" : ""), text: emoji,
    "aria-pressed": String(entwurf.emoji === emoji),
    onclick: () => { entwurf.emoji = emoji; sichereEntwurf(); zeichneEditor(); }
  })));

  const anzahl = entwurf.begriffe.length;
  $("#begriffAnzahl").textContent = "(" + anzahl + ")";
  const fehlen = MIN_BEGRIFFE - anzahl;
  $("#begriffHinweis").textContent = fehlen > 0
    ? "Noch " + fehlen + (fehlen === 1 ? " Begriff" : " Begriffe") + ", dann könnt ihr die Kategorie spielen."
    : "";

  // Die neuesten Begriffe stehen oben
  $("#begriffListe").replaceChildren(...entwurf.begriffe.map((begriff, i) => el("li", {},
    el("span", { text: begriff }),
    el("button", {
      class: "begriff-weg", text: "×", "aria-label": begriff + " entfernen",
      onclick: () => { entwurf.begriffe.splice(i, 1); sichereEntwurf(); zeichneEditor(); }
    })
  )).reverse());
}

// Räumt eine Liste von Begriffen auf: Leerzeichen weg, keine Doppelten
function saeubereBegriffe(liste, vorhandene = []) {
  const bekannt = new Set(vorhandene.map((b) => b.toLowerCase()));
  const sauber = [];
  for (const roh of liste) {
    if (typeof roh !== "string") continue;
    const begriff = roh.replace(/\s+/g, " ").trim().slice(0, 60);
    if (!begriff || bekannt.has(begriff.toLowerCase())) continue;
    bekannt.add(begriff.toLowerCase());
    sauber.push(begriff);
  }
  return sauber;
}

function fuegeBegriffeHinzu(text) {
  // Mehrere Begriffe auf einmal gehen mit Zeilenumbruch oder Semikolon
  const neue = saeubereBegriffe(text.split(/[\n;]/), entwurf.begriffe);
  if (!neue.length) {
    if (text.trim()) meldung("Diesen Begriff gibt es in der Kategorie schon.");
    return;
  }
  entwurf.begriffe.push(...neue.slice(0, 500 - entwurf.begriffe.length));
  sichereEntwurf();
  zeichneEditor();
}

function schliesseEditor() {
  sichereEntwurf();
  if (editorZurueck === "s-kategorien") zeigeKategorien();
  else zeigeEigene();
}

/* ---------- Teilen und Importieren ---------- */

// Die Kategorie wird in einen Textblock verpackt, den man verschicken kann.
// Er ist absichtlich nicht lesbar, damit niemand die Begriffe vorher sieht.
function verpacke(kat) {
  const json = JSON.stringify({ n: kat.name, e: kat.emoji, w: kat.begriffe });
  const bytes = new TextEncoder().encode(json);
  let binaer = "";
  bytes.forEach((b) => { binaer += String.fromCharCode(b); });
  return "SNG1:" + btoa(binaer) + ":ENDE";
}

function entpacke(text) {
  const treffer = /SNG1:\s*([A-Za-z0-9+\/=\s]+):\s*ENDE/.exec(text || "");
  if (!treffer) {
    return { fehler: /SNG1:/.test(text || "")
      ? "Der Text ist unvollständig. Kopiere die ganze Nachricht bis zum Wort ENDE."
      : "In diesem Text steckt keine Kategorie. Kopiere die ganze Nachricht, die du bekommen hast." };
  }
  try {
    const binaer = atob(treffer[1].replace(/\s+/g, ""));
    const bytes = Uint8Array.from(binaer, (zeichen) => zeichen.charCodeAt(0));
    const daten = JSON.parse(new TextDecoder().decode(bytes));
    const begriffe = saeubereBegriffe(Array.isArray(daten.w) ? daten.w : []).slice(0, 500);
    if (!begriffe.length) return { fehler: "Die Kategorie enthält keine Begriffe." };
    const name = (typeof daten.n === "string" ? daten.n : "").replace(/\s+/g, " ").trim().slice(0, 30) || "Importiert";
    const emoji = EMOJIS.includes(daten.e) ? daten.e : EMOJIS[0];
    return { name, emoji, begriffe };
  } catch (fehler) {
    return { fehler: "Der Text ist beschädigt. Lass dir die Kategorie noch einmal schicken." };
  }
}

async function teileKategorie() {
  sichereEntwurf();
  if (!entwurf.begriffe.length) { meldung("Füge erst Begriffe hinzu."); return; }
  const name = entwurf.name.trim() || "Ohne Namen";
  const anzahl = entwurf.begriffe.length;
  const text = "NG's Stirnraten App: Kategorie „" + name + "“ (" + anzahl + (anzahl === 1 ? " Begriff" : " Begriffe") + ")\n\n"
    + "So holst du sie in deine App: diese ganze Nachricht kopieren, in der App „Eigene Kategorien“ öffnen "
    + "und auf „Kategorie importieren“ tippen.\n\n"
    + verpacke({ name, emoji: entwurf.emoji, begriffe: entwurf.begriffe });

  if (navigator.share) {
    try { await navigator.share({ text }); return; }
    catch (fehler) { if (fehler && fehler.name === "AbortError") return; }
  }
  try {
    await navigator.clipboard.writeText(text);
    meldung("Text kopiert. Füge ihn in eine Nachricht ein.");
  } catch (fehler) {
    dialog({
      text: "Kopiere diesen Text und schicke ihn weiter:",
      feld: { wert: text, nurLesen: true },
      knoepfe: [{ text: "Schließen", wert: null, art: "haupt" }]
    });
  }
}

async function importiereKategorie() {
  const antwort = await dialog({
    text: "Füge hier die Nachricht mit der Kategorie ein.",
    feld: { platzhalter: "Ganze Nachricht einfügen" },
    knoepfe: [
      { text: "Importieren", wert: "ok", art: "haupt" },
      {
        text: "Aus Zwischenablage einfügen",
        aktion: async (feld) => {
          try { feld.value = await navigator.clipboard.readText(); }
          catch (fehler) { meldung("Halte das Textfeld gedrückt und wähle „Einfügen“."); }
        }
      },
      { text: "Abbrechen", wert: null }
    ]
  });
  if (antwort.wahl !== "ok") return;

  const kat = entpacke(antwort.eingabe);
  if (kat.fehler) { meldung(kat.fehler); return; }

  // Gibt es den Namen schon, bekommt die neue Kategorie eine Nummer
  const namen = new Set(eigene.map((k) => k.name.trim().toLowerCase()));
  let name = kat.name;
  for (let nr = 2; namen.has(name.toLowerCase()); nr++) name = kat.name + " " + nr;

  eigene.push({
    id: "e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name, emoji: kat.emoji, begriffe: kat.begriffe, imMix: true
  });
  sichereEigene();
  zeigeEigene();
  meldung("„" + name + "“ mit " + kat.begriffe.length + (kat.begriffe.length === 1 ? " Begriff" : " Begriffen") + " importiert.");
}


/* =====================================================================
   10. START
   ===================================================================== */

function verbindeKnoepfe() {
  // Startseite
  $("#btnKlassisch").addEventListener("click", () => { neuesSpiel("klassisch"); zeigeKategorien("s-start"); });
  $("#btnTeams").addEventListener("click", () => { zeichneTeams(); zeichneAuswahl(); zeige("s-teams"); });
  $("#btnEigene").addEventListener("click", zeigeEigene);
  $("#btnHilfe").addEventListener("click", () => { zeichneAuswahl(); zeige("s-hilfe"); });
  $$(".zurueck[data-zu]").forEach((knopf) => knopf.addEventListener("click", () => zeige(knopf.dataset.zu)));

  // Teams
  $("#btnTeamNeu").addEventListener("click", () => {
    if (einstellungen.teams.length >= MAX_TEAMS) return;
    einstellungen.teams.push("Team " + (einstellungen.teams.length + 1));
    sichereEinstellungen();
    zeichneTeams();
  });
  $("#rundenMinus").addEventListener("click", () => aendereRunden(-1));
  $("#rundenPlus").addEventListener("click", () => aendereRunden(1));
  $("#btnTeamsWeiter").addEventListener("click", () => { neuesSpiel("teams"); zeigeKategorien("s-teams"); });

  // Kategorien und Zug
  $("#katZurueck").addEventListener("click", () => zeige(kategorienZurueck));
  $("#bereitZurueck").addEventListener("click", bereitZurueck);
  $("#btnStart").addEventListener("click", starteZug);

  // Bühne
  $("#buehne").addEventListener("click", () => { if (runde && runde.phase === "platzieren") starteCountdown(); });
  $("#btnPause").addEventListener("click", (e) => { e.stopPropagation(); pausiere(); });
  $("#btnWeiter").addEventListener("click", (e) => { e.stopPropagation(); spieleWeiter(); });
  $("#btnAbbruch").addEventListener("click", (e) => { e.stopPropagation(); brichAb(); });
  $("#btnTippJa").addEventListener("click", (e) => { e.stopPropagation(); werte("erraten"); });
  $("#btnTippNein").addEventListener("click", (e) => { e.stopPropagation(); werte("uebersprungen"); });

  // Siegerehrung
  $("#btnRevanche").addEventListener("click", () => { neuesSpiel("teams"); zeigeKategorien("s-teams"); });
  $("#btnFinaleStart").addEventListener("click", () => zeige("s-start"));

  // Eigene Kategorien
  $("#btnKatNeu").addEventListener("click", () => oeffneEditor(null, "s-eigene"));
  $("#btnImport").addEventListener("click", importiereKategorie);
  $("#editorZurueck").addEventListener("click", schliesseEditor);
  $("#katName").addEventListener("input", (e) => { entwurf.name = e.target.value; sichereEntwurf(); });
  $("#katImMix").addEventListener("change", (e) => { entwurf.imMix = e.target.checked; sichereEntwurf(); });
  $("#begriffForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const feld = $("#neuerBegriff");
    fuegeBegriffeHinzu(feld.value);
    feld.value = "";
    feld.focus();
  });
  $("#neuerBegriff").addEventListener("paste", (e) => {
    const text = (e.clipboardData || window.clipboardData).getData("text");
    if (/[\n;]/.test(text)) { e.preventDefault(); fuegeBegriffeHinzu(text); }
  });
  $("#btnTeilen").addEventListener("click", teileKategorie);
  $("#btnKatLoeschen").addEventListener("click", async () => {
    const name = entwurf.name.trim() || "diese Kategorie";
    if (!(await bestaetige("„" + name + "“ mit allen Begriffen löschen?", "Löschen", "gefahr"))) return;
    const stelle = eigene.indexOf(entwurf);
    if (stelle >= 0) eigene.splice(stelle, 1);
    entwurf = { name: "", begriffe: [] };
    sichereEigene();
    if (editorZurueck === "s-kategorien") zeigeKategorien(); else zeigeEigene();
  });
}

// Auf der Startseite wechselt der Begriff auf der Karte
function starteBeispielKarte() {
  const kurze = KATEGORIEN.flatMap((k) => k.begriffe).filter((b) => b.length <= 13);
  const karte = $("#beispielWort");
  const wechsle = () => { karte.textContent = kurze[Math.floor(Math.random() * kurze.length)]; };
  wechsle();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  setInterval(() => { if ($("#s-start").classList.contains("aktiv") && !document.hidden) wechsle(); }, 2600);
}

// Hinweis zum Speichern auf dem Home-Bildschirm (nur in Safari auf dem iPhone)
function zeigeInstallTipp() {
  const alsApp = window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
  const iPhone = /iPhone|iPad|iPod/.test(navigator.userAgent);
  if (alsApp || !iPhone || einstellungen.tippGesehen) return;
  $("#installTipp").hidden = false;
  $("#installTippZu").addEventListener("click", () => {
    $("#installTipp").hidden = true;
    einstellungen.tippGesehen = true;
    sichereEinstellungen();
  });
}

window.addEventListener("resize", richteBuehne);
window.addEventListener("orientationchange", () => setTimeout(richteBuehne, 250));

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pausiere();
    speicher.schreiben("gesehen", gesehen);
  } else if (runde) {
    bleibWach();
  }
});

verbindeKnoepfe();
zeichneAuswahl();
starteBeispielKarte();
zeigeInstallTipp();

// Der Service Worker (sw.js) sorgt dafür, dass die App auch ohne Internet läuft
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}
