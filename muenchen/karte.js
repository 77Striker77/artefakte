// karte.js — die Startseite. Liest DATEN aus orte.js und baut Text, Karte und
// Legende daraus. Nichts davon steht doppelt im HTML: eine zweite Fassung eines
// Ortsnamens driftet ab, und dann stimmt eine von beiden nicht mehr.

(function () {
  "use strict";

  var ARTEN = {
    ankunft:     { label: "Ankunft",       farbe: "var(--p-ankunft)" },
    zentrum:     { label: "Zentrum",       farbe: "var(--p-zentrum)" },
    wahrzeichen: { label: "Wahrzeichen",   farbe: "var(--p-wahrzeichen)" },
    park:        { label: "Park",          farbe: "var(--p-park)" }
  };

  var t = DATEN.texte;
  document.getElementById("marke").textContent = t.marke;
  document.getElementById("eyebrow").textContent = t.eyebrow;
  document.getElementById("titel").innerHTML =
    t.titel + "<em>" + t.titel_betont + "</em>";
  document.getElementById("unterzeile").textContent = t.unterzeile;

  var q = DATEN.quelle;
  document.getElementById("quelle-orte").innerHTML =
    "Koordinaten der Orientierungspunkte: " + q.name +
    ", abgerufen am " + q.abgerufen.split("-").reverse().join(".") +
    " (Rang <em>" + q.rang + "</em>, Lizenz " + q.lizenz + "). " +
    "Jeder Punkt trägt seine OSM-Kennung in der Sprechblase.";

  // --- Karte ---------------------------------------------------------------
  var karte = L.map("karte", { scrollWheelZoom: false })
    .setView([DATEN.ziel.mitte.lat, DATEN.ziel.mitte.lon], DATEN.ziel.zoom);

  // scrollWheelZoom aus, damit die Seite auf dem Handy scrollbar bleibt; per
  // Klick in die Karte wird es angeschaltet, sonst laesst sie sich am Rechner
  // nicht bedienen.
  karte.on("click", function () { karte.scrollWheelZoom.enable(); });

  var strasse = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(karte);

  var luftbild = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Luftbild: Esri, Maxar, Earthstar Geographics"
  });

  L.control.layers({ "Karte": strasse, "Luftbild": luftbild },
                   null, { position: "topright" }).addTo(karte);

  // --- Marken --------------------------------------------------------------
  var punkte = [];
  DATEN.orte.forEach(function (o) {
    var hoch = o.art === "ankunft" ? 30 : 26;
    var breite = Math.max(32, o.kurz.length * 8 + 16);
    var icon = L.divIcon({
      className: "",
      html: '<i class="marke-pin ' + o.art + '">' + o.kurz + "</i>",
      iconSize: [breite, hoch],
      iconAnchor: [breite / 2, hoch / 2]
    });
    L.marker([o.lat, o.lon], { icon: icon, title: o.name })
      .addTo(karte)
      .bindPopup(
        "<h3>" + o.name + "</h3>" +
        "<p>" + o.notiz + "</p>" +
        '<p style="margin-top:6px;font-size:12px">OSM ' + o.osm + "</p>"
      );
    punkte.push([o.lat, o.lon]);
  });

  // Der Ausschnitt kommt aus den Punkten, nicht aus einem festen Zoom: sobald
  // ein Ort dazukommt, der weiter aussen liegt, waere ein fester Zoom falsch
  // und niemand merkt es, weil die Karte trotzdem aussieht wie eine Karte.
  if (punkte.length) {
    karte.fitBounds(L.latLngBounds(punkte).pad(0.18));
  }

  // --- Legende -------------------------------------------------------------
  var gezeigt = {};
  DATEN.orte.forEach(function (o) { gezeigt[o.art] = true; });

  var ul = document.getElementById("legende");
  Object.keys(ARTEN).forEach(function (art) {
    if (!gezeigt[art]) return;
    var li = document.createElement("li");
    var sw = document.createElement("span");
    sw.className = "swatch";
    sw.style.background = ARTEN[art].farbe;
    li.appendChild(sw);
    li.appendChild(document.createTextNode(ARTEN[art].label));
    ul.appendChild(li);
  });
})();
