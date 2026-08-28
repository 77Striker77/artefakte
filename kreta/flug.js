// flug.js — die Logik der Flugseite.
//
// Daten kommen aus flugdaten.js (erzeugt von bau-flug.mjs), NICHT aus daten.js:
// die Flugseite ist die einzige, auf der Reisedatum und Abflughafen stehen
// duerfen, und getrennte Dateien halten das Datenschutz-Tor fuer alle anderen
// Seiten scharf.
//
// Zeitzonen werden hier NICHT gerechnet. Dauer, Verschiebung, Entfernung und
// die absoluten Zeitpunkte (ab.utc, an.utc) stehen fertig in den Daten - eine
// zweite Rechenstelle im Browser waere die zweite Stelle, an der eine Zone
// falsch werden kann. Hier wird mit diesen Zeitpunkten nur noch VERGLICHEN,
// und das geht unabhaengig davon, in welcher Zone der Betrachter sitzt.
//
// Der laufende Flieger zeigt die PLANMAESSIGE Position, nicht die echte. Es ist
// keine Flugverfolgung, und das steht auch so auf der Seite - eine Anzeige, die
// aussieht wie ein Radar, aber einen Fahrplan abspielt, ist schlimmer als gar
// keine.

(function () {
  "use strict";
  const F = window.FLUG || {};
  const $ = (id) => document.getElementById(id);
  const esc = window.esc;

  const FLUEGE = F.fluege || [];
  const HAFEN = F.flughaefen || {};

  /* Ohne Fluege zeigt die Seite ausdruecklich, dass noch keiner erfasst ist.
     Eine leere Seite sieht aus wie ein Fehler; dieser Satz sieht aus wie eine
     Aufgabe - und genau das ist er. */
  if (!FLUEGE.length) {
    $("tUnterzeile").textContent = "Für diese Reise ist noch kein Flug erfasst.";
    $("flugtafeln").innerHTML = "<div class='nochleer'><p><strong>Noch kein Flug "
      + "hinterlegt.</strong> Sobald Airline und Flugnummer in "
      + "<code>bau/flug.json</code> stehen, zeigt diese Seite Zeiten, Dauer und "
      + "die Route.</p></div>";
    return;
  }

  /* ---------- Formate ---------- */
  const datumLang = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("de-DE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const datumKurz = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("de-DE", {
    weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });

  const dauerText = (min) => min === "unbekannt" ? "unbekannt"
    : Math.floor(min / 60) + " h " + String(min % 60).padStart(2, "0") + " min";

  /* Eine Zeitspanne in der groebsten Einheit, die noch etwas sagt: Tage und
     Stunden, sonst Stunden und Minuten, sonst Minuten. "in 2 Tagen 4 Std" ist
     eine Auskunft, "in 3132 Minuten" ist eine Zahl. */
  const spanne = (ms) => {
    const min = Math.max(0, Math.round(ms / 60000));
    const t = Math.floor(min / 1440), st = Math.floor((min % 1440) / 60), m = min % 60;
    if (t) return t + (t === 1 ? " Tag " : " Tage ") + st + " Std";
    if (st) return st + " Std " + m + " Min";
    return m + " Min";
  };

  // Uhrzeit eines absoluten Zeitpunkts in der Zone des jeweiligen Flughafens.
  const uhr = (utc, zone) => new Date(utc).toLocaleTimeString("de-DE", {
    hour: "2-digit", minute: "2-digit", timeZone: zone });
  const tagUndUhr = (utc, zone) => new Date(utc).toLocaleString("de-DE", {
    weekday: "short", day: "2-digit", month: "2-digit",
    hour: "2-digit", minute: "2-digit", timeZone: zone });

  // Die Frage an dieser Stelle ist "welche Uhr zeigt das an", und die Antwort
  // ist die Zone, nicht der Ort: ein Flughafen liegt regelmaessig in der
  // Nachbargemeinde seiner Stadt, und deren Name hilft hier niemandem.
  // Ausgeschrieben als title, weil MESZ und OESZ sich um zwei Buchstaben
  // unterscheiden und genau die den Unterschied tragen.
  const zonenzeile = (p) => p.zone_kurz
    ? "Ortszeit · <abbr title='" + esc(p.zone_lang || "") + "'>"
      + esc(p.zone_kurz) + "</abbr>"
    : "Ortszeit am Flughafen";

  /* ---------- Wo steht der Flug gerade ----------
     Verglichen werden absolute Zeitpunkte. Wer stattdessen Ortszeiten
     vergleicht, bekommt auf Kreta ein um eine Stunde verschobenes Ergebnis -
     also ausgerechnet dort, wo die Seite gebraucht wird. */
  const zustand = (f, jetzt) => {
    if (!f.ab.utc || !f.an.utc) return { phase: "offen", anteil: 0 };
    const ab = Date.parse(f.ab.utc), an = Date.parse(f.an.utc);
    if (jetzt < ab) return { phase: "vor", anteil: 0, rest: ab - jetzt };
    if (jetzt >= an) return { phase: "nach", anteil: 1, rest: jetzt - an };
    return { phase: "luft", anteil: (jetzt - ab) / (an - ab), rest: an - jetzt };
  };

  const statusText = (f, z) => {
    if (z.phase === "offen") return "Zeiten unbekannt";
    // Nicht "Start in 8 Tage 20 Std": nach "in" stuende der Dativ, und dann
    // braeuchte spanne() zwei Formen. Umformuliert passt eine.
    if (z.phase === "vor") return "Noch " + spanne(z.rest) + " bis zum Start";
    if (z.phase === "luft") return "In der Luft · noch " + spanne(z.rest)
      + " · " + Math.round(z.anteil * 100) + " %";
    return "Gelandet · " + uhr(f.an.utc, f.an.zone) + " Ortszeit";
  };

  /* ---------- Pixel-Flugzeug ----------
     Dieselbe Schreibweise wie die Ortssymbole: ein 9x9-Raster, daraus ein
     Sprite. shape-rendering="crispEdges" ist Pflicht, sonst zeichnet der
     Browser die Pixelkanten weich. */
  const FLIEGER = [
    ".........",
    "...X.....",
    "X..XX....",
    "X..XXX...",
    "XXXXXXXXX",
    "X..XXX...",
    "X..XX....",
    "...X.....",
    ".........",
  ];
  (function sprite() {
    let rects = "";
    FLIEGER.forEach((zeile, y) => {
      let x = 0;
      while (x < zeile.length) {
        if (zeile[x] !== "X") { x++; continue; }
        let b = 0;
        while (zeile[x + b] === "X") b++;
        rects += '<rect x="' + x + '" y="' + y + '" width="' + b + '" height="1"/>';
        x += b;
      }
    });
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
    svg.innerHTML = '<symbol id="sym-flieger" viewBox="0 0 9 9">' + rects + "</symbol>";
    document.body.prepend(svg);
  })();
  const fliegerSvg = '<svg shape-rendering="crispEdges" aria-hidden="true">'
    + '<use href="#sym-flieger"/></svg>';

  /* ---------- Kopf ---------- */
  const A = FLUEGE[0];
  $("tEyebrow").textContent = "Anreise · " + A.airline;
  $("tUnterzeile").innerHTML = "Hin- und Rückflug mit Airline, Flugnummer, Zeiten "
    + "und Route. Der Flieger auf der Linie zeigt, wo der Flug <strong>planmäßig</strong> "
    + "gerade steht. <strong>Keine Buchungsdaten</strong> — was hier steht, steht so "
    + "auch auf jeder Abflugtafel.";

  /* ---------- Die Flugtafeln ---------- */
  const halt = (f, seite) => {
    const p = f[seite];
    const zeitOffen = p.zeit === "unbekannt";
    return "<div class='flughalt " + seite + "'>"
      + "<span class='hcode'>" + esc(p.iata) + "</span>"
      + (zeitOffen
        ? "<span class='hzeit offen'>Zeit unbekannt</span>"
        : "<span class='hzeit'>" + esc(p.zeit) + "</span>")
      + "<span class='hname'>" + esc(HAFEN[p.iata] ? HAFEN[p.iata].name : p.iata) + "</span>"
      + "<span class='hzone'>" + zonenzeile(p)
      + (seite === "an" && p.datum !== f.datum ? " · " + esc(datumKurz(p.datum)) : "")
      + "</span></div>";
  };

  const fakt = (t, w) => "<div class='fakt'><dt>" + esc(t) + "</dt><dd>" + w + "</dd></div>";

  /* Gezeigt wird nur, wo es tatsaechlich ein Terminal gibt. Heraklion hat
     genau eines und fuehrt darum gar keine Angabe - "HER unbekannt" waere
     keine Luecke, sondern eine erfundene Frage. */
  const terminalText = (f) => {
    const teile = [];
    if (f.ab.terminal !== "unbekannt") teile.push(esc(f.ab.iata) + " " + esc(f.ab.terminal));
    if (f.an.terminal !== "unbekannt") teile.push(esc(f.an.iata) + " " + esc(f.an.terminal));
    return teile.length ? teile.join(" · ") : "unbekannt";
  };

  /* Der Check-in-Link fuehrt auf das Anmeldeformular der Airline. Die
     Buchungsdaten gibt der Reisende dort ein - sie stehen weder in den Daten
     dieses Repos noch auf dieser Seite, und dabei bleibt es. */
  const checkinZeile = (f) => {
    if (!f.checkin) return "";
    const st = (F.dienste || {}).status_url;
    return "<div class='checkin'>"
      + "<a class='knopf' href='" + esc(f.checkin.url) + "' target='_blank' rel='noopener'>"
      + "Online-Check-in →</a>"
      /* Der zweite Knopf beantwortet die Frage, die diese Seite bewusst offen
         laesst: ob der Flug heute puenktlich ist. Er fuehrt zur Airline, weil
         die Seite selbst keine Flugdaten abfragt - und weil die Airline die
         Quelle ist und nicht ein Dritter, der sie weiterreicht. */
      + (st ? "<a class='knopf' href='" + esc(st) + "' target='_blank' rel='noopener'>"
        + "Flugstatus →</a>" : "")
      /* Der dritte Knopf beantwortet die Frage, die nach den ersten beiden
         kommt: was tut man, wenn im Portal der Airline etwas fehlt oder nicht
         stimmt. Kein Pfeil - er fuehrt nicht weg, sondern oeffnet ein Fenster
         auf dieser Seite. */
      + (F.kontakt ? "<button type='button' class='knopf' data-kontakt-auf>"
        + "Wo nachfragen?</button>" : "")
      + "<span class='cstatus' data-checkin></span>"
      + "</div>";
  };

  $("flugtafeln").innerHTML = FLUEGE.map((f, i) => {
    const zurueck = i > 0;
    const verschiebung = f.verschiebung_h === 0 ? "keine"
      : (f.verschiebung_h > 0 ? "+" : "") + f.verschiebung_h + " h";
    return "<section class='flugtafel'>"
      + "<header class='flugkopf'>"
      + "<span class='flugnr'>" + esc(f.flugnummer) + "</span>"
      + "<h2>" + esc(f.rolle) + "</h2>"
      + "<span class='flugdatum'>" + esc(datumLang(f.datum)) + "</span>"
      + "</header>"
      + "<div class='flugband'>"
      + halt(f, "ab")
      + "<div class='flugstrecke'>"
      + "<span class='sdauer'>" + esc(dauerText(f.dauer_min)) + "</span>"
      + "<div class='flinie' data-linie role='progressbar' aria-valuemin='0' "
      + "aria-valuemax='100' aria-valuenow='0' aria-label='Flugfortschritt "
      + esc(f.flugnummer) + "'>"
      + "<span class='fspur' aria-hidden='true'></span>"
      + "<i class='flugzeug" + (zurueck ? " zurueck" : "") + "' aria-hidden='true'>"
      + fliegerSvg + "</i></div>"
      + "<span class='skm'>" + f.entfernung_km + " km Luftlinie</span>"
      + "<span class='sstatus' data-status></span>"
      + "</div>"
      + halt(f, "an")
      + "</div>"
      + "<dl class='faktenraster'>"
      + fakt("Airline", esc(f.airline) + " (" + esc(f.airline_iata) + ")")
      + fakt("Flugzeug", esc(f.flugzeug))
      + fakt("Terminal", terminalText(f))
      + fakt("Zeitverschiebung", esc(verschiebung)
        + " <small>(" + esc(f.ab.iata) + " → " + esc(f.an.iata) + ")</small>")
      + "</dl>"
      + checkinZeile(f)
      + "</section>";
  }).join("");

  /* ---------- Wo nachfragen ----------
     Genau EIN Dialog fuer beide Flugtafeln, auch wenn zwei Knoepfe ihn
     oeffnen: zwei Dialoge waeren zwei Stellen, an denen dieselbe Liste
     gepflegt wird, und die zweite ist die, die veraltet.

     Die Reihenfolge der Wege kommt so aus flug.json und wird hier NICHT
     sortiert - dass der Reiseveranstalter vor der Airline steht, ist die
     Aussage der Liste und keine Zufallsfolge. */
  const K = F.kontakt;
  if (K) {
    const weg = (w) => "<li class='kweg'>"
      + "<span class='kzeile'>"
      + "<span class='krang" + (w.rang === "Zuerst" ? " zuerst" : "") + "'>"
      + esc(w.rang) + "</span>"
      + "<span class='kname'>" + esc(w.name) + "</span></span>"
      + (w.url
        ? "<a class='kwert' href='" + esc(w.url) + "'"
          // tel: und mailto: uebergibt das Betriebssystem - ein target='_blank'
          // liesse dabei einen leeren Reiter stehen.
          + (/^https?:/.test(w.url) ? " target='_blank' rel='noopener'" : "") + ">"
          + esc(w.wert) + "</a>"
        : "<span class='kwert'>" + esc(w.wert) + "</span>")
      + "<span class='kwann'>" + esc(w.wann) + "</span>"
      + "</li>";

    const dlg = document.createElement("dialog");
    dlg.className = "kontaktbox";
    dlg.setAttribute("aria-labelledby", "kontakttitel");
    dlg.innerHTML = "<div class='kontaktkopf'>"
      + "<h2 id='kontakttitel'>" + esc(K.titel) + "</h2>"
      + "<form method='dialog'><button class='knopf kzu' aria-label='Schließen'>"
      + "✕</button></form></div>"
      + "<div class='kontaktinhalt'>"
      + (K.hinweis || []).map((h) => "<p class='khinweis'>" + esc(h) + "</p>").join("")
      + "<ol class='kwege'>" + (K.wege || []).map(weg).join("") + "</ol>"
      + "<p class='kquelle'>" + esc(K.quelle || "unbekannt") + ", abgerufen "
      + esc(K.abgerufen || "unbekannt") + ". " + esc(K.einschraenkung || "")
      + (K.hinweis_quellen || []).map((q) => "<br>" + esc(q.angabe) + ": "
        + esc(q.quelle) + " (abgerufen " + esc(q.abgerufen) + ").").join("")
      + "</p></div>";
    document.body.appendChild(dlg);

    for (const b of document.querySelectorAll("[data-kontakt-auf]")) {
      b.addEventListener("click", () => dlg.showModal());
    }
    // Klick auf den Grund schliesst. <dialog> bringt das nicht mit: ::backdrop
    // ist kein Klickziel, der Klick landet auf dem dialog-Element selbst.
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }

  const linien = [...document.querySelectorAll("[data-linie]")];
  const stati = [...document.querySelectorAll("[data-status]")];
  const checkins = [...document.querySelectorAll("[data-checkin]")];

  /* ---------- Die Route ----------
     Gezeichnet wird der Grosskreis, nicht der geflogene Weg: reale Routen
     folgen Luftstrassen und weichen Sperrgebieten aus. Eine gerade Linie in
     Mercator waere ausserdem NICHT der kuerzeste Weg - sie saehe nur so aus. */
  const AB = HAFEN[A.ab.iata], AN = HAFEN[A.an.iata];
  $("routentext").innerHTML = esc(AB.name) + " nach " + esc(AN.name)
    + " — " + A.entfernung_km + " km Luftlinie. Gezeichnet ist der Großkreis, "
    + "also die kürzeste Verbindung über die Erdkugel; geflogen wird entlang der "
    + "Luftstraßen, die davon abweichen.";

  const karte = L.map("karte", { scrollWheelZoom: true });
  const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende',
  }).addTo(karte);
  const satellit = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19, attribution: "Luftbild: Esri, Maxar, Earthstar Geographics" });
  L.control.layers({ "Karte": osm, "Satellit": satellit }, null, { position: "topright" }).addTo(karte);
  L.control.scale({ imperial: false, position: "bottomleft" }).addTo(karte);

  /* Ein Punkt auf dem Grosskreis bei Anteil t (0..1). Dieselbe Interpolation
     wie fuer die Linie - der Flieger sitzt damit exakt auf ihr und nicht
     daneben, was bei zwei getrennten Rechnungen frueher oder spaeter passiert. */
  const punktAuf = (a, b, t) => {
    const g = (x) => (x * Math.PI) / 180, gr = (x) => (x * 180) / Math.PI;
    const la1 = g(a.lat), lo1 = g(a.lon), la2 = g(b.lat), lo2 = g(b.lon);
    const d = 2 * Math.asin(Math.sqrt(
      Math.sin((la2 - la1) / 2) ** 2
      + Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2));
    if (d < 1e-9) return [a.lat, a.lon];
    const P = Math.sin((1 - t) * d) / Math.sin(d), Q = Math.sin(t * d) / Math.sin(d);
    const x = P * Math.cos(la1) * Math.cos(lo1) + Q * Math.cos(la2) * Math.cos(lo2);
    const y = P * Math.cos(la1) * Math.sin(lo1) + Q * Math.cos(la2) * Math.sin(lo2);
    const z = P * Math.sin(la1) + Q * Math.sin(la2);
    return [gr(Math.atan2(z, Math.sqrt(x * x + y * y))), gr(Math.atan2(y, x))];
  };

  const grosskreis = (a, b, n) => {
    const punkte = [];
    for (let i = 0; i <= n; i++) punkte.push(punktAuf(a, b, i / n));
    return punkte;
  };

  const linie = L.polyline(grosskreis(AB, AN, 64), { className: "routenlinie" }).addTo(karte);

  for (const h of [AB, AN]) {
    L.marker([h.lat, h.lon], {
      icon: L.divIcon({ className: "", html: '<i class="flughafenpin">' + esc(h.iata) + "</i>",
        iconSize: [44, 26], iconAnchor: [22, 13], popupAnchor: [0, -13] }),
      title: h.name,
      alt: "Flughafen " + h.name,
    }).addTo(karte).bindPopup(
      "<span class='pop-art'>Flughafen</span>"
      + "<span class='pop-name'>" + esc(h.name) + "</span>"
      + "<span class='pop-zeile'>IATA " + esc(h.iata) + " · ICAO " + esc(h.icao) + "</span>");
  }
  karte.fitBounds(linie.getBounds(), { padding: [50, 50] });

  $("kartequelle").textContent = "Karte: OpenStreetMap-Mitwirkende · Luftbild: Esri";
  $("kartedetail").textContent = "Flughäfen: OpenStreetMap, " + (F.kartenstand || "unbekannt");

  /* ---------- Der Flieger auf der Karte ----------
     Er erscheint nur, solange ein Flug laeuft. Ein Flugzeugsymbol, das
     stundenlang auf dem Rollfeld steht, sieht aus wie eine Live-Anzeige, die
     haengt. Gedreht wird im BILDSCHIRMraum: die geografische Peilung stimmt auf
     einer Mercator-Karte nicht mit der Richtung ueberein, in die die gezeichnete
     Linie tatsaechlich zeigt. */
  let fliegerMarker = null;
  const fliegerIcon = (winkel) => L.divIcon({
    className: "",
    html: "<i class='kartenflieger' style='transform:rotate(" + winkel.toFixed(1) + "deg)'>"
      + fliegerSvg + "</i>",
    iconSize: [30, 30], iconAnchor: [15, 15],
  });

  const zeigeFlieger = (f, z) => {
    if (z.phase !== "luft") {
      if (fliegerMarker) { karte.removeLayer(fliegerMarker); fliegerMarker = null; }
      return;
    }
    const a = HAFEN[f.ab.iata], b = HAFEN[f.an.iata];
    const hier = punktAuf(a, b, z.anteil);
    const gleich = punktAuf(a, b, Math.min(1, z.anteil + 0.01));
    const p1 = karte.latLngToLayerPoint(hier), p2 = karte.latLngToLayerPoint(gleich);
    const winkel = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

    if (!fliegerMarker) {
      fliegerMarker = L.marker(hier, {
        icon: fliegerIcon(winkel),
        title: f.flugnummer + " — planmäßige Position",
        alt: f.flugnummer + ", planmäßige Position",
        zIndexOffset: 500,
      }).addTo(karte);
    } else {
      fliegerMarker.setLatLng(hier);
      fliegerMarker.setIcon(fliegerIcon(winkel));
    }
  };

  /* ---------- Der Takt ----------
     Alle 30 Sekunden. Bei gut drei Stunden Flugzeit wandert der Flieger damit in
     Schritten von unter einem Pixel - haeufiger waere Rechnerei ohne sichtbaren
     Unterschied, seltener liefe die Anzeige der Uhr hinterher. */
  const takt = () => {
    const jetzt = Date.now();

    FLUEGE.forEach((f, i) => {
      const z = zustand(f, jetzt);
      const l = linien[i];
      if (l) {
        l.style.setProperty("--f", z.anteil.toFixed(4));
        l.setAttribute("aria-valuenow", Math.round(z.anteil * 100));
        l.setAttribute("aria-valuetext", statusText(f, z));
      }
      const s = stati[i];
      if (s) {
        s.textContent = statusText(f, z);
        s.className = "sstatus" + (z.phase === "luft" ? " laeuft"
          : z.phase === "nach" ? " vorbei" : "");
      }
      const c = checkins[i];
      if (c && f.checkin) {
        const cab = Date.parse(f.checkin.ab), cbis = Date.parse(f.checkin.bis);
        if (jetzt < cab) {
          c.textContent = "öffnet " + tagUndUhr(f.checkin.ab, f.ab.zone)
            + " " + (f.ab.zone_kurz || "Ortszeit");
          c.className = "cstatus";
        } else if (jetzt <= cbis) {
          c.textContent = "offen — noch " + spanne(cbis - jetzt);
          c.className = "cstatus offen";
        } else {
          c.textContent = "Online-Check-in geschlossen";
          c.className = "cstatus";
        }
      }
    });

    /* Der Flug, der die Karte gerade betrifft: der erste, der noch nicht
       gelandet ist. Sind beide vorbei, bleibt die Strecke stehen - die Karte
       ist dann Rueckblick, nicht Anzeige. */
    const aktuell = FLUEGE.find((f) => f.an.utc && Date.parse(f.an.utc) > jetzt);
    if (!aktuell) {
      zeigeFlieger(FLUEGE[0], { phase: "nach" });
      $("kartestatus").textContent = "Beide Flüge liegen zurück.";
      return;
    }
    const z = zustand(aktuell, jetzt);
    zeigeFlieger(aktuell, z);
    $("kartestatus").innerHTML = z.phase === "luft"
      ? "<strong>" + esc(aktuell.flugnummer) + " ist unterwegs.</strong> Der Flieger steht "
        + "auf seiner <strong>planmäßigen</strong> Position — das ist keine "
        + "Flugverfolgung, eine Verspätung ist hier nicht zu sehen."
      : "<strong>" + esc(aktuell.flugnummer) + "</strong> startet "
        + esc(tagUndUhr(aktuell.ab.utc, aktuell.ab.zone)) + " Ortszeit "
        + esc(aktuell.ab.iata) + " — noch " + esc(spanne(z.rest))
        + ". Dann fliegt der Flieger auf dieser Linie mit.";
  };

  takt();
  setInterval(takt, 30000);
  // Beim Zoomen aendert sich die Bildschirmrichtung der Linie und mit ihr der
  // Winkel des Fliegers. Ohne das steht er nach einem Zoom quer zur Route.
  karte.on("zoomend", takt);

  /* ---------- Was fehlt ----------
     Die Luecken stehen sichtbar auf der Seite, nicht in einem Ausklapper. Eine
     verschwiegene Luecke liest sich wie ein vollstaendiger Fahrplan. */
  const offen = [];
  for (const f of FLUEGE) {
    if (f.an.zeit === "unbekannt") offen.push(f.flugnummer + ": Ankunftszeit");
    if (f.flugzeug === "unbekannt") offen.push(f.flugnummer + ": Flugzeugtyp");
    // Erst wenn BEIDE Seiten nichts hergeben, ist das eine Luecke.
    if (f.ab.terminal === "unbekannt" && f.an.terminal === "unbekannt")
      offen.push(f.flugnummer + ": Terminal");
  }
  if (offen.length) {
    $("luecken").innerHTML = "<div class='nochleer'>"
      + "<p><strong>Noch nicht belegt:</strong> " + esc(offen.join(" · ")) + ".</p>"
      // Die Begruendung steht in flug.json als Zeilenliste, damit die Datei
      // lesbar bleibt - auf der Seite ist sie EIN Absatz. Je Zeile ein <p>
      // zerlegt den Satz in Schnipsel, die wie eine Aufzaehlung aussehen.
      + ((F.luecken || []).length
        ? "<p>" + esc(F.luecken.filter((z) => z.trim()).join(" ")) + "</p>" : "")
      + "</div>";
  }

  /* ---------- Quellen ----------
     Jede Angabe traegt ihre Herkunft. Als Ausklapper, damit die Pflichtangabe
     auf der Seite steht, ohne lauter zu rufen als der Fahrplan selbst. */
  const quellen = FLUEGE.map((f) =>
    "<p><strong>" + esc(f.flugnummer) + "</strong></p>"
    + "<dl class='faktenraster'>"
    + (f.quellen || []).map((q) => fakt(q.angabe,
      esc(q.quelle) + " <small>(abgerufen " + esc(q.abgerufen) + ")</small>")).join("")
    + (f.checkin ? fakt("Check-in-Fenster",
      esc(f.checkin.quelle) + " <small>(abgerufen " + esc(f.checkin.abgerufen) + ")</small>"
      + "<br><small>" + esc(f.checkin.einschraenkung || "") + "</small>") : "")
    + "</dl>").join("");

  $("quellen").innerHTML = "<details class='hinweisklapp quellenliste'>"
    + "<summary>Quellen und Stand<span class='kpfeil' aria-hidden='true'></span></summary>"
    + "<div class='inhalt'>" + quellen
    + "<p>Der Flieger auf Linie und Karte rechnet ausschließlich mit diesen geplanten "
    + "Zeiten. Er fragt keine Flugdaten ab und weiß nichts von Verspätung, Umleitung "
    + "oder Ausfall — dafür ist der Knopf <em>Flugstatus</em> da, der zur Airline führt.</p>"
    + "</div></details>";

  $("fuss").innerHTML =
    "<p>Kartenmaterial: &copy; OpenStreetMap-Mitwirkende (ODbL) · Luftbild: Esri, Maxar, "
    + "Earthstar Geographics.</p>"
    + "<p>Flughafenkoordinaten und -namen: OpenStreetMap über Overpass, abgerufen "
    + esc(F.kartenstand || "unbekannt") + ". Flugangaben: siehe Quellen und Stand, "
    + "Stand " + esc(F.stand || "unbekannt") + ".</p>"
    + "<p>Diese Seite führt keine Buchungs- oder Personendaten.</p>";
})();
