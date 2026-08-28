// flug.js — die Logik der Flugseite.
//
// Daten kommen aus flugdaten.js (erzeugt von bau-flug.mjs), NICHT aus daten.js:
// die Flugseite ist die einzige, auf der Reisedatum und Abflughafen stehen
// duerfen, und getrennte Dateien halten das Datenschutz-Tor fuer alle anderen
// Seiten scharf.
//
// Gerechnet wird hier nichts. Dauer, Zeitverschiebung und Entfernung stehen
// fertig in den Daten - eine zweite Rechenstelle im Browser waere die zweite
// Stelle, an der eine Zeitzone falsch werden kann.

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

  // Die Frage an dieser Stelle ist "welche Uhr zeigt das an", und die Antwort
  // ist die Zone, nicht der Ort: ein Flughafen liegt regelmaessig in der
  // Nachbargemeinde seiner Stadt, und deren Name hilft hier niemandem.
  // Ausgeschrieben als title, weil MESZ und OESZ sich um zwei Buchstaben
  // unterscheiden und genau die den Unterschied tragen.
  const zonenzeile = (p) => p.zone_kurz
    ? "Ortszeit · <abbr title='" + esc(p.zone_lang || "") + "'>"
      + esc(p.zone_kurz) + "</abbr>"
    : "Ortszeit am Flughafen";

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
    + "und Route. <strong>Keine Buchungsdaten</strong> — was hier steht, steht so "
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

  const terminalText = (f) => (f.ab.terminal === "unbekannt" && f.an.terminal === "unbekannt")
    ? "unbekannt"
    : esc(f.ab.iata) + " " + esc(f.ab.terminal) + " · " + esc(f.an.iata) + " " + esc(f.an.terminal);

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
      + "<div class='flinie'><i class='flugzeug" + (zurueck ? " zurueck" : "") + "'>"
      + fliegerSvg + "</i></div>"
      + "<span class='skm'>" + f.entfernung_km + " km Luftlinie</span>"
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
      + "</section>";
  }).join("");

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

  const grosskreis = (a, b, n) => {
    const g = (x) => (x * Math.PI) / 180, gr = (x) => (x * 180) / Math.PI;
    const la1 = g(a.lat), lo1 = g(a.lon), la2 = g(b.lat), lo2 = g(b.lon);
    const d = 2 * Math.asin(Math.sqrt(
      Math.sin((la2 - la1) / 2) ** 2
      + Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2));
    if (d < 1e-9) return [[a.lat, a.lon], [b.lat, b.lon]];
    const punkte = [];
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const P = Math.sin((1 - f) * d) / Math.sin(d), Q = Math.sin(f * d) / Math.sin(d);
      const x = P * Math.cos(la1) * Math.cos(lo1) + Q * Math.cos(la2) * Math.cos(lo2);
      const y = P * Math.cos(la1) * Math.sin(lo1) + Q * Math.cos(la2) * Math.sin(lo2);
      const z = P * Math.sin(la1) + Q * Math.sin(la2);
      punkte.push([gr(Math.atan2(z, Math.sqrt(x * x + y * y))), gr(Math.atan2(y, x))]);
    }
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

  /* ---------- Was fehlt ----------
     Die Luecken stehen sichtbar auf der Seite, nicht in einem Ausklapper. Eine
     verschwiegene Luecke liest sich wie ein vollstaendiger Fahrplan. */
  const offen = [];
  for (const f of FLUEGE) {
    if (f.an.zeit === "unbekannt") offen.push(f.flugnummer + ": Ankunftszeit");
    if (f.flugzeug === "unbekannt") offen.push(f.flugnummer + ": Flugzeugtyp");
    if (f.ab.terminal === "unbekannt") offen.push(f.flugnummer + ": Terminal");
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
    + "</dl>").join("");

  $("quellen").innerHTML = "<details class='hinweisklapp quellenliste'>"
    + "<summary>Quellen und Stand<span class='kpfeil' aria-hidden='true'></span></summary>"
    + "<div class='inhalt'>" + quellen + "</div></details>";

  $("fuss").innerHTML =
    "<p>Kartenmaterial: &copy; OpenStreetMap-Mitwirkende (ODbL) · Luftbild: Esri, Maxar, "
    + "Earthstar Geographics.</p>"
    + "<p>Flughafenkoordinaten und -namen: OpenStreetMap über Overpass, abgerufen "
    + esc(F.kartenstand || "unbekannt") + ". Flugangaben: siehe Quellen und Stand, "
    + "Stand " + esc(F.stand || "unbekannt") + ".</p>"
    + "<p>Diese Seite führt keine Buchungs- oder Personendaten.</p>";
})();
