// karte.js — die Startseite. Liest DATEN aus orte.js und baut Infobox, Karte,
// Legende und den Quellenreiter daraus. Nichts davon steht doppelt im HTML: eine
// zweite Fassung eines Ortsnamens driftet ab, und dann stimmt eine von beiden
// nicht mehr.

(function () {
  "use strict";

  var ARTEN = {
    ankunft:     { label: "Ankunft",     farbe: "var(--p-ankunft)" },
    zentrum:     { label: "Zentrum",     farbe: "var(--p-zentrum)" },
    wahrzeichen: { label: "Wahrzeichen", farbe: "var(--p-wahrzeichen)" },
    film:        { label: "Filmstudios", farbe: "var(--p-film)" },
    park:        { label: "Park",        farbe: "var(--p-park)" }
  };

  var deutsch = function (iso) { return iso.split("-").reverse().join("."); };
  var setzeText = function (id, text) { document.getElementById(id).textContent = text; };

  // --- Kopf und Titel ------------------------------------------------------
  var t = DATEN.texte;
  setzeText("marke", t.marke);
  setzeText("eyebrow", t.eyebrow);
  document.getElementById("titel").innerHTML = t.titel + "<em>" + t.titel_betont + "</em>";

  // --- Infobox -------------------------------------------------------------
  // "xx" ist kein Platzhaltertext, sondern eine Aussage: der Wert ist unbekannt.
  // Er wird darum als solcher ausgezeichnet und nicht wie ein Ergebnis gesetzt.
  var dl = document.getElementById("reisedaten");
  var offen = 0;
  DATEN.reisedaten.forEach(function (z) {
    var unbekannt = z.wert === "xx";
    if (unbekannt) offen++;
    var dt = document.createElement("dt");
    dt.textContent = z.feld;
    var dd = document.createElement("dd");
    dd.textContent = z.wert;
    if (unbekannt) {
      dd.className = "offen";
      dd.title = "noch nicht bekannt";
    }
    dl.appendChild(dt);
    dl.appendChild(dd);
  });
  setzeText("infobox-fuss", offen === 0
    ? "Alle Felder stehen fest."
    : offen + " von " + DATEN.reisedaten.length + " Feldern stehen noch aus — "
      + "xx heißt unbekannt, nicht geschätzt.");

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

  // --- Orientierungspunkte -------------------------------------------------
  // Die Marke selbst ist ein Quadrat auf der exakten Koordinate; der Name haengt
  // als Leaflet-Tooltip daneben. Grund: Hauptbahnhof, Marienplatz und
  // Frauenkirche liegen keine zwei Kilometer auseinander, ihre beschrifteten
  // Kaesten aber 40 bis 56 px breit - bei Stadtzoom lagen sie uebereinander und
  // keiner der drei war lesbar. Ein Kasten zu verschieben, damit er passt, waere
  // die falsche Loesung: dann zeigt die Marke nicht mehr dorthin, wo der Ort ist.
  var ZOOM_NAMEN = 13;
  var orientierung = L.layerGroup().addTo(karte);
  var punkte = [];
  DATEN.orte.forEach(function (o) {
    var gross = o.art === "ankunft";
    var kante = gross ? 26 : 22;
    L.marker([o.lat, o.lon], {
      icon: L.divIcon({
        className: "",
        html: '<i class="marke-pin ' + o.art + (gross ? " gross" : "") + '"></i>',
        iconSize: [kante, kante],
        iconAnchor: [kante / 2, kante / 2]
      }),
      title: o.name,
      riseOnHover: true
    })
      .addTo(orientierung)
      .bindTooltip(o.kurz, { permanent: true, direction: "right", offset: [kante / 2 - 2, 0],
                             className: "marke-name" })
      .bindPopup(
        "<h3>" + o.name + "</h3><p>" + o.notiz + "</p>" +
        (o.web ? '<p class="popup-fein"><a href="' + o.web + '">' + o.web.replace(/^https?:\/\//, "") + "</a></p>" : "") +
        '<p class="popup-fein">OSM ' + o.osm + "</p>"
      );
    punkte.push([o.lat, o.lon]);
  });

  // Namen erst ab Stadtteil-Zoom. Darunter tragen Farbe und Legende die
  // Bedeutung - sieben unterscheidbare Farben sind gemessen, sieben ueberlappende
  // Textkaesten waeren nur Rauschen.
  function namenSchalten() {
    var an = karte.getZoom() >= ZOOM_NAMEN;
    orientierung.eachLayer(function (m) {
      if (an) m.openTooltip(); else m.closeTooltip();
    });
  }
  karte.on("zoomend", namenSchalten);

  // --- Haltestellen: kleine Punkte, keine Beschriftung ---------------------
  // 143 beschriftete Kaesten wuerden die Karte zudecken und die sechs
  // Orientierungspunkte unauffindbar machen. Der Name steht in der Sprechblase
  // und im title-Attribut, also auch fuer den Screenreader.
  var ebenen = { "Karte": strasse, "Luftbild": luftbild };
  var schalter = { "Orientierung": orientierung };

  if (DATEN.bahn) {
    var gruppen = { sbahn: L.layerGroup(), ubahn: L.layerGroup() };
    DATEN.bahn.halte.forEach(function (h) {
      L.marker([h.lat, h.lon], {
        icon: L.divIcon({
          className: "",
          html: '<i class="halt-pin ' + h.art + '"></i>',
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        }),
        title: h.name,
        // keyboard:false, sonst liegen 143 Haltepunkte in der Tabreihenfolge:
        // gemessen 164 Tab-Stopps statt 21, und wer mit der Tastatur an der
        // Karte vorbei will, drueckt 143-mal Tab. Die sechs
        // Orientierungspunkte bleiben erreichbar - sie sind der Inhalt, die
        // Halte sind der Hintergrund, und der Name steht im title-Attribut.
        keyboard: false
      })
        .addTo(gruppen[h.art])
        .bindPopup("<h3>" + h.name + "</h3>" +
          "<p>" + (h.art === "ubahn" ? "U-Bahn-Station" : "S-Bahn / DB-Halt") + "</p>" +
          '<p class="popup-fein">OSM ' + h.osm + "</p>");
    });
    gruppen.sbahn.addTo(karte);
    gruppen.ubahn.addTo(karte);
    schalter["S-Bahn / DB (" + DATEN.bahn.anzahl.sbahn + ")"] = gruppen.sbahn;
    schalter["U-Bahn (" + DATEN.bahn.anzahl.ubahn + ")"] = gruppen.ubahn;
  }

  L.control.layers(ebenen, schalter, { position: "topright" }).addTo(karte);

  // Der Ausschnitt kommt aus den Orientierungspunkten, nicht aus einem festen
  // Zoom: sobald einer dazukommt, der weiter aussen liegt, waere ein fester Zoom
  // falsch und niemand merkt es, weil die Karte trotzdem aussieht wie eine Karte.
  // Die Haltestellen bleiben absichtlich draussen — sie enden an der Stadtgrenze
  // und wuerden den Ausschnitt nur aufblaehen.
  if (punkte.length) karte.fitBounds(L.latLngBounds(punkte).pad(0.12));
  namenSchalten();

  // --- Legende -------------------------------------------------------------
  var ul = document.getElementById("legende");
  var eintrag = function (farbe, text, rund) {
    var li = document.createElement("li");
    var sw = document.createElement("span");
    sw.className = rund ? "swatch rund" : "swatch";
    sw.style.background = farbe;
    li.appendChild(sw);
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);
  };
  var gezeigt = {};
  DATEN.orte.forEach(function (o) { gezeigt[o.art] = true; });
  Object.keys(ARTEN).forEach(function (art) {
    if (gezeigt[art]) eintrag(ARTEN[art].farbe, ARTEN[art].label, false);
  });
  if (DATEN.bahn) {
    eintrag("var(--p-sbahn)", "S-Bahn / DB", true);
    eintrag("var(--p-ubahn)", "U-Bahn", true);
  }

  // --- Quellenreiter -------------------------------------------------------
  // Jede Quelle als eigene Karte mit Rang-Marke, Abrufdatum und dem, was sie
  // tatsaechlich geliefert hat. Eine Fussnotenzeile haette dieselbe Information,
  // aber niemand liest nach, wie alt eine Zahl ist, wenn es Kleingedrucktes ist.
  var quellen = [
    {
      titel: "Orientierungspunkte",
      menge: DATEN.orte.length + " Punkte",
      quelle: DATEN.quelle.name,
      abgerufen: DATEN.quelle.abgerufen,
      rang: DATEN.quelle.rang,
      lizenz: DATEN.quelle.lizenz,
      was: "Koordinaten von Hauptbahnhof, Marienplatz, Frauenkirche, Bavaria Filmstadt, "
         + "Englischem Garten und Olympiapark. Jeder Punkt trägt seine OSM-Kennung in der Sprechblase, "
         + "also die Stelle, an der sich der Wert nachschlagen lässt."
    }
  ];
  if (DATEN.bahn) {
    quellen.push({
      titel: "Bahnhaltestellen",
      menge: DATEN.bahn.anzahl.gesamt + " Halte · " + DATEN.bahn.anzahl.sbahn
           + " S-Bahn/DB · " + DATEN.bahn.anzahl.ubahn + " U-Bahn",
      quelle: DATEN.bahn.quelle.name,
      abgerufen: DATEN.bahn.quelle.abgerufen,
      rang: DATEN.bahn.quelle.rang,
      lizenz: DATEN.bahn.quelle.lizenz,
      was: DATEN.bahn.quelle.abfrage + ". Tram- und Bushaltestellen sind nicht enthalten."
    });
  }
  quellen.push({
    titel: "Kartenkacheln",
    menge: "2 Ebenen",
    quelle: "OpenStreetMap (Karte) und Esri World Imagery (Luftbild)",
    abgerufen: null,
    rang: "primary",
    lizenz: "ODbL / Esri-Nutzungsbedingungen",
    was: "Werden beim Betrachten live geladen, sind also immer der aktuelle Stand des jeweiligen "
       + "Anbieters. Die Kartenbibliothek Leaflet 1.9.4 liegt dagegen lokal unter vendor/, damit die "
       + "Seite keinen dritten Host über den Besuch informiert."
  });

  // Der Container heisst NICHT "quellen": der Menue-Hash ist #quellen, und ein
  // Element mit derselben id laesst den Browser dorthin springen - die Seite
  // oeffnete sich dann mitten im Inhalt, mit dem Kopf ausserhalb des Bildes.
  var kasten = document.getElementById("quellen-liste");
  quellen.forEach(function (q) {
    var d = document.createElement("article");
    d.className = "quelle";
    d.innerHTML =
      '<div class="quelle-kopf">' +
        "<h3>" + q.titel + "</h3>" +
        '<span class="rang rang-' + q.rang + '">' + q.rang + "</span>" +
      "</div>" +
      '<p class="quelle-menge">' + q.menge + "</p>" +
      "<dl class=\"quelle-fakten\">" +
        "<dt>Quelle</dt><dd>" + q.quelle + "</dd>" +
        "<dt>Abgerufen</dt><dd>" + (q.abgerufen ? deutsch(q.abgerufen) : "laufend") + "</dd>" +
        "<dt>Lizenz</dt><dd>" + q.lizenz + "</dd>" +
      "</dl>" +
      "<p class=\"quelle-was\">" + q.was + "</p>";
    kasten.appendChild(d);
  });

  var hinweis = document.createElement("p");
  hinweis.className = "quelle-hinweis";
  hinweis.innerHTML = "<strong>Was hier nicht steht.</strong> Diese Seite trägt bewusst keine "
    + "Reisedaten, keine Unterkunft und keine Buchungsangaben — die Felder in der Infobox stehen "
    + "auf <em>xx</em>, solange sie unbekannt sind, und werden nicht geschätzt. Alles, was "
    + "hier steht, gilt für München und nicht für einen bestimmten Aufenthalt.";
  kasten.appendChild(hinweis);

  // --- Menueleiste ---------------------------------------------------------
  // Aufgebaut aus DATEN.menue, nicht aus dem HTML. Ein Eintrag mit `seite` wird
  // ein Link auf eine eigene Datei, einer mit `ansicht` schaltet einen
  // Abschnitt dieser Seite um - so kostet ein neuer Menuepunkt spaeter einen
  // Eintrag in reise.json und keine Aenderung an jeder bestehenden Seite.
  //
  // Leaflet vermisst seinen Behaelter beim Anlegen. Wird die Karte in einem
  // ausgeblendeten Abschnitt angelegt oder waehrenddessen die Fenstergroesse
  // geaendert, bleibt sie grau, bis invalidateSize() sie neu vermisst.
  var nav = document.getElementById("menue");
  var knoepfe = [];

  function zeige(id) {
    DATEN.menue.forEach(function (m) {
      if (!m.ansicht) return;
      document.getElementById(m.ansicht).hidden = m.id !== id;
    });
    knoepfe.forEach(function (b) {
      var an = b.dataset.id === id;
      if (an) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
      // Der Dauerzustand haengt NICHT allein an der Farbe (WCAG 1.4.1): die
      // aktive Tafel wechselt den Grund UND traegt einen Balken an der
      // Unterkante. data-aktiv steht am <li>, damit der Balken ohne :has()
      // auskommt.
      b.parentNode.dataset.aktiv = an ? "true" : "false";
    });
    if (id === "karte") karte.invalidateSize();
    // Der Hash macht einen Menuepunkt verlinkbar und ueberlebt ein Neuladen.
    // Das Praefix ist Pflicht, nicht Zierde: ein blankes "#karte" traf die id
    // des Kartenbehaelters, worauf der Browser dorthin sprang und die Seite mit
    // dem Kopf ausserhalb des Bildes aufging. Dasselbe war vorher bei "#quellen"
    // passiert. Ein Praefix schliesst die ganze Fehlerklasse aus, statt sie
    // Ansicht fuer Ansicht nachzuraeumen.
    if (history.replaceState) history.replaceState(null, "", "#ansicht-" + id);
  }

  // Markup nach dem Muster glow-menu aus der Bausteinbibliothek: jeder Eintrag
  // hat eine Vorder- und eine Rueckseite, die beim Ueberfahren um die Unterkante
  // kippen. Die Rueckseite traegt aria-hidden, sonst liest die Vorlesehilfe
  // jeden Punkt doppelt. Kein role="menubar" - diese Rolle verpflichtet zu
  // Pfeiltasten-Navigation mit EINEM Tabstopp, und eine Seitennavigation ist
  // keine Menueleiste im ARIA-Sinn. <nav> plus Liste ist richtig.
  var liste = document.createElement("ul");
  liste.className = "menue-liste";

  DATEN.menue.forEach(function (m) {
    var li = document.createElement("li");
    li.className = "menue-eintrag";

    var el = document.createElement(m.seite ? "a" : "button");
    if (m.seite) {
      el.href = m.seite;
    } else {
      el.type = "button";
      el.dataset.id = m.id;
      el.addEventListener("click", function () { zeige(m.id); });
      knoepfe.push(el);
    }
    el.id = "menue-" + m.id;
    el.className = "menue-knopf";
    el.innerHTML =
      '<span class="menue-flaeche">' +
        '<span class="menue-seite menue-seite--vorn"></span>' +
        '<span class="menue-seite menue-seite--hinten" aria-hidden="true"></span>' +
      "</span>" +
      '<span class="menue-marke" aria-hidden="true"></span>';
    el.querySelector(".menue-seite--vorn").textContent = m.label;
    el.querySelector(".menue-seite--hinten").textContent = m.label;

    li.appendChild(el);
    liste.appendChild(li);
  });
  nav.appendChild(liste);

  var start = location.hash.replace(/^#ansicht-/, "");
  zeige(DATEN.menue.some(function (m) { return m.id === start && m.ansicht; })
    ? start : DATEN.menue[0].id);
})();
