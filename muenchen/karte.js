// karte.js — die Startseite. Liest DATEN aus orte.js und baut Infobox, Karte,
// Legende und den Quellenreiter daraus. Nichts davon steht doppelt im HTML: eine
// zweite Fassung eines Ortsnamens driftet ab, und dann stimmt eine von beiden
// nicht mehr.

(function () {
  "use strict";

  // Orte tragen ein SYMBOL, Bahnen eine FARBE. Das ist die Trennung, an der man
  // die beiden Familien auf einen Blick auseinanderhaelt: ein Ort ist eine helle
  // Tafel mit dunklem Zeichen, ein Bahnhalt eine farbige Marke mit dem
  // Kuerzel seines Verkehrsmittels. Vorher trugen beide Farbflaechen - die
  // Filmstudios und die Tram 25 hatten sogar dieselbe, weil das eine zum
  // anderen fuehrt, und genau das war nicht mehr auseinanderzuhalten.
  var SYMBOL = {
    // Bett: die Unterkunft ist der Bezugspunkt der Reise, nicht eine
    // Sehenswuerdigkeit - sie bekommt darum ein eigenes Zeichen und die
    // groessere Kiste, so wie der Ankunftspunkt.
    unterkunft: '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/>'
              + '<path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/>'
              + '<path d="M12 4v6"/><path d="M2 18h20"/>',
    ankunft: '<rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14"/>'
           + '<path d="M8 19l-2 3M16 19l2 3"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/>',
    zentrum: '<path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M10 21v-5h4v5"/>',
    wahrzeichen: '<path d="M3 21h18"/><path d="M6 21V9a2 2 0 0 1 4 0v12"/>'
               + '<path d="M14 21V9a2 2 0 0 1 4 0v12"/><path d="M10 21v-6h4v6"/>',
    film: '<path d="M3 10h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>'
        + '<path d="m3 10 1.5-5 4 1L7 11M9 6l4 1-1.5 4M14 7.2l4 1-1.5 3.8"/>',
    // Saeule mit Kapitell - steht fuer Tore, Denkmaeler und historische Bauten
    // gleichermassen; ein Kirchturm haette bei Isartor und Bavaria nicht gepasst.
    museum: '<path d="M2 21h20"/><path d="M4 21V9M9 21V9M15 21V9M20 21V9"/>'
          + '<path d="m12 2 9 5H3z"/>',
    // Umgebungskarte: Gabel+Messer, Tasse, Korb.
    essen: '<path d="M7 2v9a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2"/><path d="M9 2v20"/>'
         + '<path d="M17 2c-1.5 1-2.5 3-2.5 5.5S15.5 12 17 13v9"/>',
    cafe: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/>'
        + '<path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M4 22h13"/>'
        + '<path d="M7 2v2M11 2v2"/>',
    einkauf: '<path d="M3 7h18l-1.5 12a2 2 0 0 1-2 2H6.5a2 2 0 0 1-2-2z"/>'
           + '<path d="M8 7a4 4 0 0 1 8 0"/>',
    // Innenstadtkarte: Masskrug und Burger. Sie stehen NEBEN der Gabel (essen)
    // der Umgebungskarte, statt sie zu ersetzen - ein Wirtshaus mit Schnitzel-
    // karte und ein Fensterverkauf mit zwei Burgern sind zwei verschiedene
    // Antworten, und die Farbe traegt hier nicht die Unterscheidung: Orte tragen
    // ein Zeichen. Henkel und Schaum bzw. Deckel, Belag und Boden reichen dafuer
    // bei 30 px; mehr Striche werden auf der Kachel zu einem Fleck.
    wirtshaus: '<path d="M5 10h9v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/>'
             + '<path d="M14 12h2.5a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H14"/>'
             + '<path d="M4 10c0-1.7 1.3-3 3-3 .7 0 1.3.2 1.8.6A2.9 2.9 0 0 1 12 6c1.7 0 3 1.4 3 3z"/>',
    burger: '<path d="M3 11c0-3.3 4-6 9-6s9 2.7 9 6z"/>'
          + '<path d="M3.5 14.5h17"/>'
          + '<path d="M21 18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/>',
    park: '<path d="M12 21v-5"/>'
        + '<path d="M12 16a5 5 0 0 0 5-5 4 4 0 0 0-1-2.6A4 4 0 0 0 12 3a4 4 0 0 0-4 5.4A4 4 0 0 0 7 11a5 5 0 0 0 5 5z"/>'
  };

  var ARTEN = {
    unterkunft:  { label: "Unterkunft" },
    ankunft:     { label: "Ankunft" },
    zentrum:     { label: "Zentrum" },
    wahrzeichen: { label: "Wahrzeichen" },
    museum:      { label: "Museen" },
    film:        { label: "Filmstudios" },
    park:        { label: "Park" }
  };

  // Kuerzel und Klasse je Verkehrsmittel. Die Form unterscheidet zusaetzlich zur
  // Farbe (WCAG 1.4.1): S rund, U eckig, Tram auf der Spitze.
  var VERKEHR = {
    sbahn: { kuerzel: "S", label: "S-Bahn / DB" },
    ubahn: { kuerzel: "U", label: "U-Bahn" },
    linie: { kuerzel: "T", label: "Tram" }
  };

  // Die drei Kuechen des Innenstadt-Reiters. Sie tragen alle art "essen" und
  // unterscheiden sich ueber `kueche` - eine Art, drei Zeichen, KEINE neue
  // Markenfarbe (siehe stil.css).
  //
  // DREI, nicht zwei: Fruehstueck und Abendessen waren verlangt, die sechs
  // Burgerlaeden aus muenchen-essen.json trugen kein `kueche`-Feld. Der Wert war
  // aber nicht offen, sondern nur nicht eingetragen - der _lies_mich von
  // muenchen-wirtshaeuser.json nennt "'wirtshaus' bzw. 'burger'", der von
  // muenchen-fruehstueck.json "drei Schalter". Seit dem 09.09.2026 steht er in
  // der Quelldatei, und bau-oeffentlich.mjs bricht ab, wenn wieder einer fehlt:
  // ein Ort ohne Kueche laege auf keiner Filterebene, und die Karte saehe
  // trotzdem vollstaendig aus.
  //
  // Ein Wirtshaus mit Schnitzelkarte und einen Fensterverkauf mit zwei Burgern in
  // eine Kategorie zu legen, waere die falsche Sparsamkeit: das sind
  // verschiedene Antworten auf verschiedene Fragen, und offen sind beide, wenn
  // man Hunger hat.
  var GASTRO = [
    { id: "fruehstueck", label: "Frühstück",  symbol: "cafe" },
    { id: "wirtshaus",   label: "Abendessen", symbol: "wirtshaus" },
    { id: "burger",      label: "Burger",     symbol: "burger" }
  ];

  var ortSymbol = function (art, gross) {
    return '<i class="ort-pin ' + art + (gross ? " gross" : "") + '">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
      + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      + (SYMBOL[art] || "") + "</svg></i>";
  };

  var deutsch = function (iso) { return iso.split("-").reverse().join("."); };
  // Leaflet braucht einen echten Farbwert, kein var(). Aus dem Stylesheet holen
  // statt den Hex-Wert hier zu wiederholen: zwei Fassungen einer Farbe driften
  // auseinander, und dann stimmt die Legende nicht mehr mit der Karte ueberein.
  // Linien als Marken in der Sprechblase. Drei Faelle, und sie duerfen NICHT
  // zusammenfallen: null = nicht abgerufen (unbekannt), leer = in OSM keine
  // Route eingetragen, gefuellt = Befund. Ein "keine" ueber einem gescheiterten
  // Abruf ist eine Behauptung, die niemand mehr nachprueft.
  // Amtliche Linienfarbe aus OSM, wenn es eine gibt - sonst die Farbe des
  // Verkehrsmittels. schrift und kontrast kommen mit aus den Daten: sie sind
  // dort gerechnet, nicht hier gewaehlt.
  var FARBEN = (DATEN.bahn && DATEN.bahn.linienfarben) || {};
  var linienMarke = function (l, klein) {
    var f = FARBEN[l.replace(/^(Tram|Bus) /, "")];
    var stil = f
      ? "background:" + f.farbe + ";color:" + f.schrift
      : "";
    var art = /^U[0-9]/.test(l) ? "u" : /^S[0-9]/.test(l) ? "s"
            : /^Tram/.test(l) ? "t" : /^Bus/.test(l) ? "b" : "r";
    return '<span class="linie linie--' + art + (klein ? " linie--klein" : "") + '"'
      + (stil ? ' style="' + stil + '"' : "") + ">" + l + "</span>";
  };

  // Jeder Punkt bekommt seinen Google-Maps-Link. Zwei Formen, und die
  // Reihenfolge ist kein Zufall:
  //
  //   1. Die amtliche URL der Places-API, wo es eine gibt (nur bei den Lokalen
  //      der Umgebungskarte). Sie zeigt auf DEN Eintrag - mit Bewertungen,
  //      Oeffnungszeiten und Fotos.
  //   2. Sonst die Koordinate. Nicht der NAME: "Marienplatz" gibt es in
  //      Deutschland dutzendfach, die Koordinate genau einmal. Ein Link, der
  //      irgendwo landet, ist schlimmer als keiner.
  //
  // target=_blank mit rel=noopener: die Karte soll offen bleiben, und das
  // fremde Fenster bekommt keinen Zugriff auf dieses.
  var mapsLink = function (o, text) {
    var url = o.maps
      || "https://www.google.com/maps/search/?api=1&query="
         + encodeURIComponent(o.lat + "," + o.lon);
    return '<p class="maps-link"><a href="' + url + '" target="_blank" rel="noopener noreferrer">'
      + (text || "In Google Maps öffnen") + " ↗</a></p>";
  };

  var linienBlock = function (h) {
    if (h.linien === null || h.linien === undefined) {
      return '<p class="popup-fein popup-unbekannt">Linien: unbekannt — nicht abgerufen</p>';
    }
    if (!h.linien.length) {
      return '<p class="popup-fein">In OpenStreetMap ist an diesem Halt keine Linie eingetragen.</p>';
    }
    var marken = h.linien.map(function (l) { return linienMarke(l, false); }).join("");
    var fern = h.fern
      ? '<p class="popup-fein">dazu ' + h.fern + " Fernverkehrslinie" + (h.fern === 1 ? "" : "n") + "</p>"
      : "";
    return '<p class="linien">' + marken + "</p>" + fern;
  };

  var token = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };
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
  // Die Fusszeile erscheint NUR, solange etwas offen ist. "Alle Felder stehen
  // fest" ist keine Information, sondern eine Selbstauskunft der Seite - sie
  // sagt dem Leser nichts ueber die Reise. Was vollstaendig ist, sieht man an
  // der Tabelle darueber.
  var fuss = document.getElementById("infobox-fuss");
  if (offen === 0) fuss.remove();
  else fuss.textContent = offen + " von " + DATEN.reisedaten.length
    + " Feldern stehen noch aus — xx heißt unbekannt, nicht geschätzt.";

  // --- Karte ---------------------------------------------------------------
  // scrollWheelZoom ist AN. Es war bis zum 09.09.2026 aus und wurde erst durch
  // einen Klick in die Karte scharf geschaltet - gedacht, damit die Seite auf
  // dem Handy scrollbar bleibt. Zwei Fehler darin:
  //
  //   1. Auf dem Handy gibt es kein Mausrad. Dort zoomt man mit zwei Fingern,
  //      und das ist touchZoom, eine andere Sache - die Sperre hat auf dem
  //      Geraet, fuer das sie gedacht war, nie etwas bewirkt.
  //   2. Am Rechner war die Karte damit tot, bis man sie anklickte. Das sah aus
  //      wie eine Seite, die noch laedt - und wurde auch so gemeldet.
  //
  // Die Seite bleibt trotzdem scrollbar: ueber der Karte stehen Titel und
  // Infobox, darunter Filterleiste und Quellen.
  var karte = L.map("karte")
    .setView([DATEN.ziel.mitte.lat, DATEN.ziel.mitte.lon], DATEN.ziel.zoom);

  var strasse = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(karte);

  var luftbild = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Luftbild: Esri, Maxar, Earthstar Geographics"
  });

  // Ein Orientierungspunkt kann derselbe OSM-Knoten sein wie ein Halt - der
  // Hauptbahnhof ist beides. Ohne diese Verknuepfung zeigte die goldene Marke
  // keine Linien, waehrend der S-Bahn-Punkt zwei Pixel daneben sie auflistete.
  var haltNachOsm = {};
  if (DATEN.bahn) {
    (DATEN.bahn.halte || []).forEach(function (h) { haltNachOsm[h.osm] = h; });
    (DATEN.bahn.linien || []).forEach(function (l) {
      l.halte.forEach(function (h) {
        if (!haltNachOsm[h.osm]) haltNachOsm[h.osm] = h;
      });
    });
  }

  // --- Orientierungspunkte -------------------------------------------------
  // Die Marke selbst ist ein Quadrat auf der exakten Koordinate; der Name haengt
  // als Leaflet-Tooltip daneben. Grund: Hauptbahnhof, Marienplatz und
  // Frauenkirche liegen keine zwei Kilometer auseinander, ihre beschrifteten
  // Kaesten aber 40 bis 56 px breit - bei Stadtzoom lagen sie uebereinander und
  // keiner der drei war lesbar. Ein Kasten zu verschieben, damit er passt, waere
  // die falsche Loesung: dann zeigt die Marke nicht mehr dorthin, wo der Ort ist.
  var ZOOM_NAMEN = 13;

  // Je Art eine eigene Ebene, damit sich jede Kategorie einzeln abschalten
  // laesst. Alle sind beim Aufschlagen an - wer die Karte oeffnet, soll sehen,
  // was es gibt, und nicht erst zusammenklicken muessen.
  var ortEbenen = {};
  var punkte = [];

  DATEN.orte.forEach(function (o) {
    if (!ortEbenen[o.art]) ortEbenen[o.art] = L.layerGroup().addTo(karte);
    var gross = o.art === "ankunft" || o.art === "unterkunft";
    var kante = gross ? 40 : 34;
    L.marker([o.lat, o.lon], {
      icon: L.divIcon({
        className: "",
        html: ortSymbol(o.art, gross),
        iconSize: [kante, kante],
        iconAnchor: [kante / 2, kante / 2]
      }),
      title: o.name,
      riseOnHover: true
    })
      .addTo(ortEbenen[o.art])
      .bindTooltip(o.kurz, { permanent: true, direction: "right", offset: [kante / 2 - 2, 0],
                             className: "marke-name" })
      .bindPopup(
        "<h3>" + o.name + "</h3><p>" + o.notiz + "</p>" +
        (haltNachOsm[o.osm] ? linienBlock(haltNachOsm[o.osm]) : "") +
        (o.web ? '<p class="popup-fein"><a href="' + o.web + '" target="_blank" rel="noopener noreferrer">'
          + o.web.replace(/^https?:\/\//, "") + "</a></p>" : "") +
        mapsLink(o) +
        '<p class="popup-fein">OSM ' + o.osm + "</p>"
      );
    punkte.push([o.lat, o.lon]);
  });

  // Namen erst ab Stadtteil-Zoom. Darunter tragen Symbol und Legende die
  // Bedeutung - sechs ueberlappende Textkaesten waeren nur Rauschen.
  // Geschaltet wird ueber eine Klasse am Kartenbehaelter, NICHT ueber
  // openTooltip/closeTooltip. Leaflet oeffnet einen dauerhaften Tooltip bei
  // jedem add- und move-Ereignis von sich aus wieder - gemessen: nach dem
  // Schliessen standen alle 124 Schilder sofort wieder da, auf jeder Zoomstufe.
  // Eine Klasse laesst sich nicht hinterruecks zuruecksetzen.
  function namenSchalten() {
    karte.getContainer().classList.toggle("zeigt-namen", karte.getZoom() >= ZOOM_NAMEN);
  }
  // Linienschilder eine Zoomstufe spaeter als die Ortsnamen: an einem Knoten
  // haengen bis zu sieben davon, und bei Stadtzoom liegen sie uebereinander.
  function schilderSchalten() {
    karte.getContainer().classList.toggle("zeigt-schilder", karte.getZoom() >= ZOOM_LINIEN);
  }

  karte.on("zoomend", function () { namenSchalten(); schilderSchalten(); });

  // --- Haltestellen: kleine Punkte, keine Beschriftung ---------------------
  // 143 beschriftete Kaesten wuerden die Karte zudecken und die sechs
  // Orientierungspunkte unauffindbar machen. Der Name steht in der Sprechblase
  // und im title-Attribut, also auch fuer den Screenreader.
  var ebenen = { "Karte": strasse, "Luftbild": luftbild };

  // Die Kategorien liegen in EINER Liste, aus der sowohl die Filterleiste als
  // auch ihre Marken entstehen. Zwei getrennte Aufzaehlungen waeren zwei
  // Fassungen derselben Sache, und eine davon ist irgendwann veraltet.
  var kategorien = [];
  Object.keys(ARTEN).forEach(function (art) {
    if (ortEbenen[art]) {
      kategorien.push({ id: art, label: ARTEN[art].label, marke: ortSymbol(art, false),
                        ebene: ortEbenen[art] });
    }
  });

  // Die Linienschilder haengen als Tooltip an der Marke - dieselbe Mechanik wie
  // die Ortsnamen. Sie erscheinen erst ab Zoom 14, eine Stufe spaeter als die
  // Ortsnamen: an einem Knoten haengen bis zu sieben Schilder, und bei
  // Stadtzoom liegt das uebereinander statt nebeneinander.
  var ZOOM_LINIEN = 14;
  var haltMarken = [];

  var schild = function (h) {
    if (!h.linien || !h.linien.length) return null;
    return '<span class="halt-linien">'
      + h.linien.map(function (l) { return linienMarke(l, true); }).join("")
      + (h.fern ? '<span class="linie linie--fern">+' + h.fern + "</span>" : "")
      + "</span>";
  };

  if (DATEN.bahn) {
    var gruppen = { sbahn: L.layerGroup(), ubahn: L.layerGroup() };
    DATEN.bahn.halte.forEach(function (h) {
      var marke = L.marker([h.lat, h.lon], {
        icon: L.divIcon({
          className: "",
          html: '<i class="halt-pin ' + h.art + '">' + VERKEHR[h.art].kuerzel + "</i>",
          // Muss zur Kantenlaenge in stil.css passen: Leaflet setzt den Anker
          // auf DIESE Kiste, waehrend das <i> darin seine eigene Groesse hat -
          // stehen sie auseinander, sitzt die Marke neben ihrer Koordinate.
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        }),
        title: h.linien && h.linien.length ? h.name + " — " + h.linien.join(", ") : h.name,
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
          linienBlock(h) +
          mapsLink(h) +
          '<p class="popup-fein">OSM ' + h.osm + "</p>");

      var sch = schild(h);
      if (sch) {
        marke.bindTooltip(sch, { permanent: true, direction: "right", offset: [14, 0],
                                 className: "halt-schild", interactive: false });
        haltMarken.push(marke);
      }
    });

    gruppen.sbahn.addTo(karte);
    gruppen.ubahn.addTo(karte);
    kategorien.push({ id: "sbahn", label: VERKEHR.sbahn.label, zahl: DATEN.bahn.anzahl.sbahn,
                      marke: '<i class="halt-pin sbahn">S</i>', ebene: gruppen.sbahn });
    kategorien.push({ id: "ubahn", label: VERKEHR.ubahn.label, zahl: DATEN.bahn.anzahl.ubahn,
                      marke: '<i class="halt-pin ubahn">U</i>', ebene: gruppen.ubahn });
  }

  // --- Netze: die Linienverlaeufe -------------------------------------------
  // Sie liegen unter den Marken, nicht darueber: Leaflet zeichnet Linien in den
  // overlayPane und Marken in den markerPane, der darueber liegt - ohne
  // Zutun die richtige Reihenfolge. Duenn und leicht durchscheinend, weil sie
  // Orientierung sind und nicht der Inhalt: an einem Knoten liegen bis zu
  // sechs Linien uebereinander, und deckende Striche werden dort zu einem Klotz.
  if (DATEN.bahn && DATEN.bahn.netze) {
    DATEN.bahn.netze.forEach(function (netz) {
      var g = L.layerGroup();
      var farbe = token(netz.farbe);
      // EINE Polylinie je Linie, nicht eine je Abschnitt. Leaflet nimmt ein
      // Feld von Abschnitten und zeichnet daraus einen einzigen SVG-Pfad mit
      // mehreren Teilstuecken.
      //
      // Gemessen am 09.09.2026: je Abschnitt eine Polylinie ergab 1503 Pfade in
      // der Karte. Der Browser legt sie einzeln an und rechnet sie bei JEDEM
      // Zoom und Schwenk neu - die Karte liess sich sekundenlang nicht
      // bedienen. Zusammengefasst sind es 36.
      netz.linien.forEach(function (linie) {
        L.polyline(linie.verlauf, {
          color: farbe, weight: 2.5, opacity: 0.6, interactive: false
        }).addTo(g);
      });
      g.addTo(karte);
      kategorien.push({ id: netz.id, label: netz.label, zahl: netz.linien.length,
                        marke: '<span class="netz-strich" style="background:' + farbe + '"></span>',
                        ebene: g });
    });
  }

  // --- Linien: der Verlauf plus die eigenen Halte -------------------------
  // Warum ueberhaupt eine Linie und nicht nur Punkte: die Filmstadt liegt in
  // Gruenwald, also AUSSERHALB der Stadtgrenze, nach der die Haltestellen oben
  // abgefragt sind - sie hing unverbunden auf der Karte, waehrend die Seite so
  // aussah, als zeige sie den Nahverkehr vollstaendig. Die Tram 25 ist die
  // Verbindung, und sie gehoert sichtbar dorthin.
  if (DATEN.bahn && DATEN.bahn.linien) {
    DATEN.bahn.linien.forEach(function (linie) {
      var g = L.layerGroup();

      // Die Abschnitte bleiben getrennte Teilstuecke EINER Polylinie. Zu einer
      // durchgehenden Linie zusammengenaeht wuerde ein falsch sortierter
      // Abschnitt eine kerzengerade Linie quer durch die Stadt ziehen - und die
      // saehe aus wie eine echte Strecke.
      L.polyline(linie.verlauf, {
        // Dicker als das Netz darunter: die Linie ist hier nicht Orientierung,
        // sondern die eine Verbindung, um die es geht.
        color: token("--m-tram"), weight: 4.5, opacity: 1, interactive: false
      }).addTo(g);

      linie.halte.forEach(function (h) {
        var m = L.marker([h.lat, h.lon], {
          icon: L.divIcon({
            className: "",
            html: '<i class="halt-pin tram"><b>' + VERKEHR.linie.kuerzel + "</b></i>",
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          }),
          title: h.linien && h.linien.length ? h.name + " — " + h.linien.join(", ") : h.name,
          keyboard: false
        });
        m
          .addTo(g)
          .bindPopup("<h3>" + h.name + "</h3><p>Tram " + linie.ref + " · " +
            linie.von + " → " + linie.nach + "</p>" +
            linienBlock(h) +
            mapsLink(h) +
            '<p class="popup-fein">OSM ' + h.osm + "</p>");
        var sch = schild(h);
        if (sch) {
          m.bindTooltip(sch, { permanent: true, direction: "right", offset: [12, 0],
                               className: "halt-schild", interactive: false });
          haltMarken.push(m);
        }
      });

      g.addTo(karte);
      kategorien.push({ id: "tram" + linie.ref, label: "Tram " + linie.ref + " → Filmstadt",
                        zahl: linie.halte.length,
                        marke: '<i class="halt-pin tram"><b>T</b></i>', ebene: g });
    });
  }

  // Nur noch die Grundkarte im Leaflet-Menue. Die Kategorien liegen in der
  // Filterleiste unter der Karte: Leaflets Ebenenmenue klappt zu einem kleinen
  // Symbol zusammen, und was man nicht sieht, benutzt man nicht - auf dem Handy
  // erst recht.
  L.control.layers(ebenen, null, { position: "topright" }).addTo(karte);

  // Der Ausschnitt kommt aus den Orientierungspunkten, nicht aus einem festen
  // Zoom: sobald einer dazukommt, der weiter aussen liegt, waere ein fester Zoom
  // falsch und niemand merkt es, weil die Karte trotzdem aussieht wie eine Karte.
  // Die Haltestellen bleiben absichtlich draussen — sie enden an der Stadtgrenze
  // und wuerden den Ausschnitt nur aufblaehen.
  if (punkte.length) karte.fitBounds(L.latLngBounds(punkte).pad(0.12));
  namenSchalten();
  schilderSchalten();

  // --- Filterleiste ---------------------------------------------------------
  // Sie ist zugleich Legende: jeder Eintrag zeigt die Marke, die er auf der
  // Karte bedeutet, und schaltet sie an oder aus. Alles ist beim Aufschlagen
  // an - wer die Karte oeffnet, soll sehen, was es gibt.
  //
  // Der Aus-Zustand haengt nicht allein an der Farbe (WCAG 1.4.1): aria-pressed
  // fuer die Vorlesehilfe, dazu ein durchgestrichener Text und ein blasses
  // Zeichen.
  var ul = document.getElementById("legende");

  kategorien.forEach(function (k) {
    var li = document.createElement("li");
    var b = document.createElement("button");
    b.type = "button";
    b.className = "filter";
    b.setAttribute("aria-pressed", "true");
    // aria-hidden am Zeichen: es wiederholt nur, was der Text daneben sagt.
    // Ohne das liest die Vorlesehilfe "S S-Bahn / DB" - gemessen, nicht vermutet.
    b.innerHTML = '<span class="legende-marke" aria-hidden="true">' + k.marke + "</span>"
      + '<span class="filter-text">' + k.label
      + (k.zahl ? ' <span class="filter-zahl">' + k.zahl + "</span>" : "") + "</span>";
    b.addEventListener("click", function () {
      var an = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", an ? "false" : "true");
      if (an) karte.removeLayer(k.ebene); else k.ebene.addTo(karte);
    });
    li.appendChild(b);
    ul.appendChild(li);
  });

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
      was: "Ankunftspunkt, Unterkunft, Zentrum, Parks und die Bavaria Filmstadt. Jeder Punkt "
         + "trägt seine OSM-Kennung in der Sprechblase, also die Stelle, an der sich der Wert "
         + "nachschlagen lässt."
    }
  ];
  if (DATEN.wahrzeichen_quelle) {
    var wzz = DATEN.orte.filter(function (o) { return o.art === "wahrzeichen" || o.art === "museum"; });
    quellen.push({
      titel: "Wahrzeichen und Museen",
      menge: wzz.filter(function (o) { return o.art === "wahrzeichen"; }).length + " Wahrzeichen · "
           + wzz.filter(function (o) { return o.art === "museum"; }).length + " Museen",
      quelle: DATEN.wahrzeichen_quelle.name,
      abgerufen: DATEN.wahrzeichen_quelle.abgerufen,
      rang: DATEN.wahrzeichen_quelle.rang,
      lizenz: DATEN.wahrzeichen_quelle.lizenz,
      was: "Die AUSWAHL ist kuratiert, nicht abgefragt: eine Abfrage auf Sehenswürdigkeiten "
         + "liefert in München hunderte Treffer, von der Staatsoper bis zum Gedenkstein im "
         + "Hinterhof. Was auf eine Reisekarte gehört, ist eine Entscheidung. Geholt wird nur "
         + "die Koordinate — und der angezeigte Name kommt aus der Antwort, nicht aus der "
         + "Suche: so fällt auf, wenn etwas anderes gefunden wurde als gemeint war."
    });
  }
  // Je Bestand eine eigene Karte, nicht eine Sammelkarte "Gastro": die drei
  // haben verschiedene Quellen, verschiedene Raenge und verschiedene Luecken.
  // Zusammengeschrieben waere der schlechteste Rang der Sammlung unsichtbar -
  // und genau der entscheidet, wie sehr man einer Zahl glauben darf.
  if (DATEN.gastro) {
    // Die Zahlen in diesen Texten werden GERECHNET, nicht geschrieben. Zwei
    // Fassungen einer Zahl driften auseinander, und die falsche merkt niemand:
    // on-site/breakfast.md nannte am 09.09.2026 "elf von zwoelf" Koordinaten
    // nicht auf dem Betrieb, waehrend die Datei danebenan vier auf dem Betrieb
    // fuehrte. Was hier steht, kommt aus den Daten, die auch die Karte zeichnet.
    var gz = function (id, pruef) {
      return DATEN.gastro.orte.filter(function (o) { return o.kueche === id && pruef(o); }).length;
    };
    var ohneBetrieb = function (o) { return o.koordinate && o.koordinate !== "betrieb"; };
    var keineZeit = function (o) { return !o.oeffnungszeiten || o.oeffnungszeiten === "unknown"; };
    var wortzahl = ["null", "eine", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht",
                    "neun", "zehn", "elf", "zwölf"];
    var wort = function (n) { return wortzahl[n] || String(n); };

    var GASTRO_QUELLTEXT = {
      wirtshaus: function (n, qq) {
        return "Die AUSWAHL ist recherchiert, nicht abgefragt. "
          + (qq.anzahl ? qq.anzahl.karte_geprueft + " der " + n + " Speisekarten sind einzeln "
            + "geöffnet worden; wo das nicht gelang, steht es in der Sprechblase. " : "")
          + "„Geflügel“ hat FÜNF Stufen, nicht zwei: schnitzel · hauptgericht · salat · keins · "
          + "ungeprüft. Ein Haus mit „salat“ erfüllt die Bedingung formal und serviert einen "
          + "Salatteller — wer ein Hendl wollte, steht dort falsch. Die Stufen zusammenzuwerfen "
          + "wäre genau die gefüllte Lücke, die wie ein Ergebnis aussieht und nie wieder geprüft "
          + "wird. Bei " + gz("wirtshaus", function (o) { return o.speisekarte && o.speisekarte.warnung; })
          + " Häusern stammen die Einzelpreise nicht vom Haus selbst; das steht je Haus dabei.";
      },
      fruehstueck: function (n) {
        return "Kuratiert im Abrufskript, nicht abgefragt — mit einem zweiten, benannten Maßstab "
          + "statt eines Gefühls. Die Noten sind <em>secondary</em>: sie kommen über Wanderlog "
          + "bzw. RestaurantGuru, die Googles Wert weitergeben, nicht aus der Places-API — es "
          + "fehlt die place_id. Bei " + wort(gz("fruehstueck", ohneBetrieb)) + " der " + n
          + " Orte trifft die Koordinate nicht den Betrieb, sondern das Haus, einen Markt oder "
          + "sogar einen anderen Laden unter derselben Adresse; welcher Fall vorliegt, sagt jede "
          + "Sprechblase einzeln. Kein Preis ist von einer Karte vor Ort abgelesen.";
      },
      burger: function (n) {
        return "Smash-Burger-Läden aus der Münchner Food-Presse, je Eintrag mit Beleg. "
          + "Nur " + wort(n - gz("burger", ohneBetrieb)) + " davon ist in OpenStreetMap als "
          + "Betrieb verzeichnet, die anderen " + wort(gz("burger", ohneBetrieb)) + " sind "
          + "Adresspunkte — bei einem führt OSM unter derselben Adresse einen anderen Betrieb. "
          + wort(gz("burger", keineZeit)).replace(/^./, function (c) { return c.toUpperCase(); })
          + " der " + wort(n) + " Öffnungszeiten sind <strong>unbekannt</strong> und werden auch "
          + "so gezeigt, nicht geschätzt. Bei einem Haus widersprechen sich zwei Preisquellen aus "
          + "derselben Zeit; keine gilt als gesichert.";
      }
    };
    GASTRO.forEach(function (k) {
      var qq = DATEN.gastro.quellen[k.id];
      var n = DATEN.gastro.anzahl[k.id] || 0;
      if (!qq || !n) return;
      quellen.push({
        titel: k.label + (k.id === "wirtshaus" ? " (Wirtshäuser)" : ""),
        menge: n + " Orte",
        quelle: qq.name,
        abgerufen: qq.abgerufen,
        rang: qq.rang,
        lizenz: qq.lizenz,
        was: GASTRO_QUELLTEXT[k.id](n, qq)
      });
    });
  }
  if (DATEN.bahn) {
    quellen.push({
      titel: "Bahnhaltestellen",
      menge: DATEN.bahn.anzahl.gesamt + " Halte · " + DATEN.bahn.anzahl.sbahn
           + " S-Bahn/DB · " + DATEN.bahn.anzahl.ubahn + " U-Bahn",
      quelle: DATEN.bahn.quelle.name,
      abgerufen: DATEN.bahn.quelle.abgerufen,
      rang: DATEN.bahn.quelle.rang,
      lizenz: DATEN.bahn.quelle.lizenz,
      was: DATEN.bahn.quelle.abfrage + ". "
         + (DATEN.bahn.linien && DATEN.bahn.linien.length
             ? "Dazu " + DATEN.bahn.linien.map(function (l) {
                 return "Tram " + l.ref + " (" + l.halte.length + " Halte, " + l.zweck.replace(/\.$/, "") + ")";
               }).join(" und ") + ". "
             : "")
         + "Je Halt sind die Linien eingetragen, die dort laut OpenStreetMap halten; "
         + "Fernverkehr wird gezählt statt aufgelistet, weil er am Hauptbahnhof 53 Einträge "
         + "lang ist und nichts darüber sagt, wie man sich in der Stadt bewegt. "
         + (DATEN.bahn.anzahl.halte_linien_unbekannt
             ? DATEN.bahn.anzahl.halte_linien_unbekannt + " Halte tragen „unbekannt“ — "
               + "dort kam der Abruf nicht durch. "
             : "")
         + "ZWEI LÜCKEN, benannt statt verschwiegen: die Haltestellen enden an der "
         + "Stadtgrenze und enthalten keine Tram- und Bushaltestellen — was außerhalb liegt, "
         + "steht nur über eine ausdrücklich aufgenommene Linie auf der Karte. Und Buslinien "
         + "hängen in OpenStreetMap überwiegend an eigenen Haltestellen statt am Bahnhof, "
         + "erscheinen an einem Bahnhalt also nur, wo sie dort ausdrücklich eingetragen sind."
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

  // --- Hotel und Anreise ----------------------------------------------------
  // Beide bewusst knapp: sie werden separat ausgearbeitet. Was hier NICHT steht,
  // fehlt aus einem Grund - seit dem 09.09.2026 ist das nicht mehr "alles, was
  // nach Reise aussieht", sondern nur noch, was NICHT oeffentlich einsehbar ist:
  // Auftragsnummer, Sitzplatz, Name, Zahlungsdaten. Zuege und Zeiten stehen auf
  // jeder Abfahrtstafel und duerfen hier stehen.
  var tafel = function (id, zeilen, fuss) {
    var el = document.getElementById(id);
    if (!el) return;
    var dl = zeilen.filter(function (z) { return z[1]; }).map(function (z) {
      return "<dt>" + z[0] + "</dt><dd>" + z[1] + "</dd>";
    }).join("");
    el.innerHTML = '<div class="tafel"><dl>' + dl + "</dl>"
      + '<p class="tafel-fuss">' + fuss + "</p></div>";
  };

  var ho = DATEN.hotel || {};
  tafel("hotel-tafel", [
    ["Haus", ho.name],
    ["Adresse", ho.adresse],
    ["Stadtteil", ho.stadtteil],
    ["Telefon", ho.telefon ? '<a href="tel:' + ho.telefon.replace(/\s/g, "") + '">' + ho.telefon + "</a>" : ""],
    ["Zimmer", ho.zimmer],
    ["Check-in", ho.checkin],
    ["Check-out", ho.checkout]
  ], (ho.quelle || "") + " · Preis, Auftragsnummer und Stornofristen stehen nicht auf dieser Seite.");

  var an = DATEN.bahn_reise || {};
  var stand = function (s) {
    return s === "gebucht"
      ? '<span class="zustand zustand--fest">gebucht</span>'
      : '<span class="zustand zustand--offen">offen</span>';
  };
  var fahrt = function (f) {
    if (!f) return "";
    return stand(f.status) + " · " + f.tag + '<p class="tafel-fein">' + f.text + "</p>";
  };
  tafel("bahn-tafel", [
    ["Verkehrsmittel", an.art],
    ["Strecke", an.von && an.nach ? an.von + " ↔ " + an.nach : ""],
    ["Hinfahrt", fahrt(an.hinfahrt)],
    ["Rückfahrt", fahrt(an.rueckfahrt)]
  ], (an.quelle || "") + " · Auftragsnummer, Sitzplatz und Name stehen nicht auf dieser Seite. "
   + "Dieser Punkt wird noch ausgearbeitet.");

  // --- Umgebungskarte auf dem Hotel-Reiter ----------------------------------
  // Eine ZWEITE Karte, bewusst mit eigener Legende und eigenem Massstab: die
  // Stadtkarte beantwortet "wo liegt was in Muenchen", diese beantwortet "was
  // erreiche ich vom Hotel zu Fuss". Dieselben Marken in beiden waeren
  // sparsamer, aber die Fragen sind verschieden.
  //
  // Die Farben sind aus der vorhandenen Palette geliehen statt neu erfunden -
  // eine eigene Legende macht die Wiederverwendung eindeutig, und neun neue
  // Hues waeren im Farbkreis ohnehin nicht mehr unterzubringen.
  var UMG_ARTEN = {
    essen:   { label: "Essen",      farbe: "--m-zentrum" },
    cafe:    { label: "Café",       farbe: "--m-ankunft" },
    einkauf: { label: "Einkaufen",  farbe: "--m-museum" }
  };
  var HALT_KUERZEL = { sbahn: "S", ubahn: "U", tram: "T", bus: "B" };

  var karteHotel = null;
  (function () {
    var u = DATEN.umgebung;
    if (!u || !document.getElementById("karte-hotel")) return;

    karteHotel = L.map("karte-hotel", { scrollWheelZoom: true })
      .setView([u.bezug.lat, u.bezug.lon], 15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(karteHotel);

    // KEIN Umkreis-Kreis mehr. Er stand hier, solange der Filter eine Luftlinie
    // war - und war dann ehrlich. Jetzt filtert die gemessene GEHZEIT, und ein
    // Kreis wuerde behaupten, alles darin sei in 15 Minuten erreichbar. Das ist
    // falsch: hinter der Isar liegt ein Punkt bei 700 m Luftlinie ueber der
    // Grenze, an derselben Strasse einer bei 1100 m darunter. Eine Form, die
    // etwas anderes zeigt als das, wonach gefiltert wurde, ist irrefuehrend.

    L.marker([u.bezug.lat, u.bezug.lon], {
      icon: L.divIcon({ className: "", html: ortSymbol("unterkunft", true),
                        iconSize: [40, 40], iconAnchor: [20, 20] }),
      title: u.bezug.name, riseOnHover: true
    }).addTo(karteHotel).bindPopup("<h3>" + u.bezug.name + "</h3>"
      + "<p>Der Bezugspunkt dieser Karte.</p>" + mapsLink(u.bezug));

    // Gehzeit statt Luftlinie: sie ist gemessen, sie ist die Vorgabe, und sie
    // ist das, was jemand wissen will. Die Luftlinie steht nur noch daneben,
    // wo sie den Unterschied zeigt - 210 m Luft sind hier 354 m Weg.
    var gehText = function (o) {
      if (o.gehzeit_s == null) return o.meter + " m Luftlinie · Gehzeit unbekannt";
      return Math.round(o.gehzeit_s / 60) + " min zu Fuß · " + o.gehweg_m + " m Weg";
    };

    var gruppen = {};
    Object.keys(UMG_ARTEN).forEach(function (a) { gruppen[a] = L.layerGroup().addTo(karteHotel); });
    // Je Verkehrsmittel eine EIGENE Ebene, nicht eine Sammelebene "Halte":
    // wer zu Fuss zur Tram will, soll die Busse nicht mit ausschalten muessen.
    var halteEbenen = {};
    var ART_LABEL = { sbahn: "S-Bahn / DB", ubahn: "U-Bahn", tram: "Tram", bus: "Bus" };

    u.lokale.forEach(function (l) {
      L.marker([l.lat, l.lon], {
        icon: L.divIcon({ className: "", html: ortSymbol(l.gruppe, false),
                          iconSize: [30, 30], iconAnchor: [15, 15] }),
        title: l.name + " — " + l.bewertung + "★, " + gehText(l),
        keyboard: false
      })
        .addTo(gruppen[l.gruppe])
        .bindPopup("<h3>" + l.name + "</h3>"
          + "<p>" + l.art + " · " + gehText(l) + "</p>"
          + '<p class="bewertung"><strong>' + l.bewertung + " ★</strong> aus "
          + l.stimmen.toLocaleString("de-DE") + " Bewertungen</p>"
          + (l.adresse ? '<p class="popup-fein">' + l.adresse + "</p>" : "")
          + (l.web ? '<p class="popup-fein"><a href="' + l.web + '" target="_blank" rel="noopener noreferrer">Website</a></p>' : "")
          + mapsLink(l));
    });

    u.halte.forEach(function (h) {
      if (!halteEbenen[h.art]) halteEbenen[h.art] = L.layerGroup().addTo(karteHotel);
      var m = L.marker([h.lat, h.lon], {
        icon: L.divIcon({ className: "",
          html: '<i class="halt-pin ' + h.art + '">' + (HALT_KUERZEL[h.art] || "?") + "</i>",
          iconSize: [26, 26], iconAnchor: [13, 13] }),
        title: h.name + " — " + gehText(h)
             + (h.linien && h.linien.length ? " — " + h.linien.join(", ") : ""),
        keyboard: false
      })
        .addTo(halteEbenen[h.art])
        .bindPopup("<h3>" + h.name + "</h3><p>"
          + (ART_LABEL[h.art] || h.art) + " · " + gehText(h) + "</p>"
          + linienBlock(h)
          + mapsLink(h)
          + '<p class="popup-fein">OSM ' + h.osm + "</p>");

      // Dieselben Linienschilder wie auf der Startseite - hier OHNE Zoomstufe:
      // diese Karte startet bei Zoom 15 und zeigt einen Kilometer. Da liegt
      // nichts uebereinander, was bei Stadtzoom uebereinanderlaege.
      var sch = schild(h);
      if (sch) {
        m.bindTooltip(sch, { permanent: true, direction: "right", offset: [14, 0],
                             className: "halt-schild halt-schild--immer", interactive: false });
      }
    });

    // Eigene Filterleiste, gleiche Bauform wie die der Stadtkarte.
    var ulU = document.getElementById("legende-hotel");
    var eintragU = function (markeHtml, text, zahl, ebene) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button"; b.className = "filter"; b.setAttribute("aria-pressed", "true");
      b.innerHTML = '<span class="legende-marke" aria-hidden="true">' + markeHtml + "</span>"
        + '<span class="filter-text">' + text
        + (zahl ? ' <span class="filter-zahl">' + zahl + "</span>" : "") + "</span>";
      b.addEventListener("click", function () {
        var an = b.getAttribute("aria-pressed") === "true";
        b.setAttribute("aria-pressed", an ? "false" : "true");
        if (an) karteHotel.removeLayer(ebene); else ebene.addTo(karteHotel);
      });
      li.appendChild(b); ulU.appendChild(li);
    };
    Object.keys(UMG_ARTEN).forEach(function (a) {
      var n = u.lokale.filter(function (l) { return l.gruppe === a; }).length;
      if (n) eintragU(ortSymbol(a, false), UMG_ARTEN[a].label, n, gruppen[a]);
    });
    // Ein Eintrag je Verkehrsmittel, in der Reihenfolge, in der man sucht.
    ["sbahn", "ubahn", "tram", "bus"].forEach(function (a) {
      if (!halteEbenen[a]) return;
      var n = u.halte.filter(function (h) { return h.art === a; }).length;
      eintragU('<i class="halt-pin ' + a + '">' + HALT_KUERZEL[a] + "</i>",
               ART_LABEL[a], n, halteEbenen[a]);
    });

    // Was der Filter WEGGELASSEN hat, gehoert unter die Karte - eine gefilterte
    // Liste ohne diese Zahl sieht aus wie eine vollstaendige.
    var v = u.verworfen || {};
    var raus = (v.zu_schwach || 0) + (v.zu_wenige_stimmen || 0) + (v.ohne_bewertung || 0);
    document.getElementById("umgebung-fuss").innerHTML =
      "<strong>" + u.umkreis.entspricht + ".</strong> Die Gehzeit ist je Punkt einzeln gerechnet, "
      + "nicht aus der Luftlinie geschätzt — " + (u.umkreis.ueber_der_grenze.lokale
        + u.umkreis.ueber_der_grenze.halte) + " Treffer lagen darüber und sind nicht auf der Karte. "
      + "Gezeigt werden Lokale ab <strong>"
      + String(u.schwellen.bewertung).replace(".", ",") + " ★</strong> bei mindestens "
      + u.schwellen.stimmen + " Bewertungen; " + raus + " fielen darunter durch. "
      + (u.gekappt && u.gekappt.length
          ? "Bei " + u.gekappt.join(", ") + " liefert die Abfrage höchstens 20 Treffer je Kategorie: "
            + "gezeigt sind die bekanntesten, nicht alle. "
          : "")
      + "Quellen: " + u.quellen.lokale.name + " (Lokale und Bewertungen), "
      + (u.quellen.gehzeit ? u.quellen.gehzeit.name + " (Gehzeit), " : "")
      + u.quellen.halte.name + " (Haltestellen) — abgerufen "
      + deutsch(u.quellen.lokale.abgerufen) + ".";
  })();

  // --- Innenstadt: die dritte Karte, mit Suche und Filter -------------------
  // Sie beantwortet eine andere Frage als die beiden anderen: die Stadtkarte
  // sagt "wo liegt was in Muenchen", die Umgebungskarte "was erreiche ich vom
  // Hotel zu Fuss", diese "wo esse ich was". Darum ein eigener Ausschnitt, eine
  // eigene Legende - und als einzige der drei ein SUCHFELD: 40 Marken auf drei
  // Kilometern sind mehr, als man durch Hinsehen durchsucht.
  //
  // Welche Kategorien es gibt und warum es drei sind, steht oben bei GASTRO -
  // einmal, nicht hier ein zweites Mal.

  // Die Suche faltet Umlaute in BEIDE Richtungen: wer "fruehstueck" tippt, meint
  // "Frühstück", und wer "fruhstuck" tippt, auch. Je Ort ein Heuhaufen pro
  // Faltung ist billiger und durchschaubarer als eine Regel, die beides zugleich
  // koennen soll.
  var falte = function (s, lang) {
    return String(s).toLowerCase()
      .replace(/ä/g, lang ? "ae" : "a").replace(/ö/g, lang ? "oe" : "o")
      .replace(/ü/g, lang ? "ue" : "u").replace(/ß/g, "ss")
      .replace(/[áàâ]/g, "a").replace(/[éèê]/g, "e").replace(/[íìî]/g, "i")
      .replace(/[óòô]/g, "o").replace(/[úùû]/g, "u");
  };

  var karteInnen = null;
  (function () {
    var g = DATEN.gastro;
    if (!g || !g.orte.length || !document.getElementById("karte-innenstadt")) return;

    var LABEL = {}, ZEICHEN = {};
    GASTRO.forEach(function (k) { LABEL[k.id] = k.label; ZEICHEN[k.id] = k.symbol; });

    // Der Marienplatz ist der Bezug des Ausschnitts, aber KEINE Marke: die Karte
    // traegt genau die 40 Gastro-Punkte, damit der Zaehler "n von m" und das Bild
    // dasselbe sagen. Ein 41. Punkt in derselben Farbe wie die Wirtshaeuser
    // (--m-zentrum) waere zusaetzlich eine Verwechslung.
    var bezug = DATEN.orte.filter(function (o) { return o.art === "zentrum"; })[0]
             || { name: DATEN.ziel.name, lat: DATEN.ziel.mitte.lat, lon: DATEN.ziel.mitte.lon };
    var START_ZOOM = 14;

    // Naeherung fuer Stadtmasse, nicht fuer Navigation - und sie ist als
    // LUFTLINIE ausgewiesen, nicht als Weg. Die Umgebungskarte zeigt, wie weit
    // die beiden auseinanderliegen: 210 m Luft sind dort 354 m Weg.
    var meter = function (a, b, c, d) {
      var R = 6371000, t = Math.PI / 180;
      var x = (d - b) * t * Math.cos((a + c) / 2 * t), y = (c - a) * t;
      return Math.round(R * Math.sqrt(x * x + y * y));
    };

    karteInnen = L.map("karte-innenstadt", { scrollWheelZoom: true })
      .setView([bezug.lat, bezug.lon], START_ZOOM);
    // Nur die Strassenkarte, kein Luftbild: ein Luftbild hilft beim Wiedererkennen
    // eines Gebaeudes, nicht beim Finden eines Wirtshauses - und ein Umschalter,
    // der nichts beantwortet, ist ein Bedienelement zu viel.
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(karteInnen);

    // gefluegel.stufe hat FUENF Zustaende, nicht zwei. Ein Haus mit 'salat'
    // erfuellt die Bedingung formal und serviert einen Salatteller - wer ein
    // Hendl wollte, steht dort falsch. Die Stufen werden darum ausgeschrieben
    // und nie zu ja/nein zusammengefasst.
    var GEFLUEGEL = {
      schnitzel:    "Geflügelschnitzel auf der Karte",
      hauptgericht: "Geflügel als Hauptgericht",
      salat:        "Geflügel nur als Salat — kein Hendl",
      keins:        "kein Geflügel",
      ungeprueft:   "Geflügel ungeprüft"
    };
    var VEGETARISCH = {
      hauptgericht: "vegetarisches Hauptgericht",
      "nur-salat":  "vegetarisch nur als Salat",
      keins:        "nichts Vegetarisches",
      ungeprueft:   "ungeprüft"
    };
    var KOORDINATE = {
      betrieb: "Der Punkt sitzt auf dem Betrieb selbst.",
      adresse: "Der Punkt trifft das Haus, nicht den Laden darin.",
      markt: "Der Punkt ist die Mitte des Marktes, nicht der Stand.",
      "fremder-treffer": "Unter derselben Adresse steht in OpenStreetMap ein anderer Betrieb — "
        + "die Marke sitzt am richtigen Gebäude, aber auf dem Nachbarn."
    };

    // 22 Wirtshaeuser mit je sieben Zeilen waeren 154 Zeilen Oeffnungszeiten in
    // der Liste. Gleiche Zeiten an aufeinanderfolgenden Tagen werden darum
    // zusammengefasst - gerechnet aus den Daten, nicht von Hand gekuerzt. Passt
    // eine Zeile nicht ins Muster, bleibt die Liste unveraendert stehen: eine
    // Kuerzung, die raet, waere schlimmer als eine lange Zeile.
    var TAG_KURZ = { Montag: "Mo", Dienstag: "Di", Mittwoch: "Mi", Donnerstag: "Do",
                     Freitag: "Fr", Samstag: "Sa", Sonntag: "So" };
    var zeitenKurz = function (arr) {
      var teile = arr.map(function (z) {
        var m = /^([^:]+):\s*(.*)$/.exec(z);
        return m && TAG_KURZ[m[1]] ? { tag: TAG_KURZ[m[1]], zeit: m[2].replace(/\s*Uhr\s*$/, "") } : null;
      });
      if (teile.some(function (t) { return !t; })) return arr.join(" · ");
      var out = [], lauf = null;
      teile.forEach(function (t) {
        if (lauf && lauf.zeit === t.zeit) { lauf.bis = t.tag; return; }
        lauf = { von: t.tag, bis: null, zeit: t.zeit };
        out.push(lauf);
      });
      return out.map(function (b) {
        return (b.bis ? b.von + "–" + b.bis : b.von) + " " + b.zeit;
      }).join(" · ");
    };

    // "unknown" ist kein fehlender Wert, sondern eine Aussage - und wird als
    // solche gezeigt. Weglassen liesse die Zeile aussehen, als sei sie geprueft.
    var zeitenText = function (o, kurz) {
      var z = o.oeffnungszeiten;
      if (!z) return "unbekannt — nicht erhoben";
      if (Array.isArray(z)) return kurz ? zeitenKurz(z) : z.join("<br>");
      return z === "unknown" ? "unbekannt — nicht erhoben" : z;
    };

    var note = function (o) {
      if (!o.google || !o.google.note) return "";
      return String(o.google.note).replace(".", ",") + " ★";
    };
    // mapsLink() erwartet das Feld `maps`; die Wirtshaeuser tragen es unter
    // google.maps, weil es aus der Places-API kommt. Die amtliche URL zeigt auf
    // DEN Eintrag, die Koordinate nur auf die Stelle - darum hat sie Vorrang.
    var mapsZiel = function (o) {
      return { lat: o.lat, lon: o.lon, maps: (o.google && o.google.maps) || o.maps };
    };

    var sprechblase = function (o) {
      var z = ["<h3>" + o.name + "</h3>",
               "<p>" + LABEL[o.kueche] + " · " + o.stadtteil + "</p>"];
      if (o.google && o.google.note) {
        z.push('<p class="bewertung"><strong>' + note(o) + "</strong> aus "
          + o.google.stimmen.toLocaleString("de-DE") + " Bewertungen"
          + (o.google.rang === "secondary" ? " — weitergegebener Wert, nicht aus der Places-API" : "")
          + "</p>");
      }
      z.push("<p>" + o.notiz + "</p>");

      if (o.gefluegel) {
        z.push('<p class="popup-fein"><strong>' + GEFLUEGEL[o.gefluegel.stufe] + "</strong>"
          + (o.gefluegel.gericht ? " — " + o.gefluegel.gericht : "")
          + (o.gefluegel.preis ? " (" + o.gefluegel.preis + " €)" : "") + "</p>");
      }
      if (o.vegetarisch) {
        z.push('<p class="popup-fein">' + VEGETARISCH[o.vegetarisch.stufe]
          + (o.vegetarisch.beispiel ? " — " + o.vegetarisch.beispiel : "") + "</p>");
      }
      if (o.fruehstueck_bis) {
        z.push('<p class="popup-fein">Frühstück bis <strong>' + o.fruehstueck_bis + "</strong></p>");
      }
      if (o.preise) {
        z.push('<p class="popup-fein">' + (o.preise === "unknown" ? "Preise unbekannt — nicht erhoben"
          : o.preise + (o.preise_stand ? " (Stand " + deutsch(o.preise_stand) + ")" : "")) + "</p>");
      }
      z.push('<p class="popup-fein">' + zeitenText(o, false)
        + (o.oeffnungszeiten_stand ? "<br>Stand " + deutsch(o.oeffnungszeiten_stand) : "") + "</p>");
      if (o.adresse) z.push('<p class="popup-fein">' + o.adresse + "</p>");

      // Jede Einschraenkung steht in der Sprechblase, nicht nur in den Daten.
      // Ein Wert ohne seine Einschraenkung behauptet mehr, als er weiss.
      [o.speisekarte && o.speisekarte.warnung, o.warnung, o.preise_hinweis,
       o.koordinate_hinweis || (o.koordinate && o.koordinate !== "betrieb" ? KOORDINATE[o.koordinate] : ""),
       o.stadtteil_hinweis
      ].forEach(function (w) {
        if (w) z.push('<p class="popup-unbekannt">' + w + "</p>");
      });

      var ziel = o.web || o.beleg;
      if (ziel) {
        z.push('<p class="popup-fein"><a href="' + ziel + '" target="_blank" rel="noopener noreferrer">'
          + (o.web ? "Website" : "Beleg") + "</a></p>");
      }
      z.push(mapsLink(mapsZiel(o)));
      if (o.osm) z.push('<p class="popup-fein">OSM ' + o.osm + "</p>");
      return z.join("");
    };

    // Kuechen in der Reihenfolge des Tages, darin die bessere Note zuerst. Wo
    // keine Note vorliegt, steht der Ort hinten - und NICHT mit einer geratenen
    // Null, die wie eine Messung aussaehe.
    var reihe = GASTRO.map(function (k) { return k.id; });
    var sortiert = g.orte.slice().sort(function (a, b) {
      var d = reihe.indexOf(a.kueche) - reihe.indexOf(b.kueche);
      if (d) return d;
      var na = (a.google && a.google.note) || 0, nb = (b.google && b.google.note) || 0;
      if (na !== nb) return nb - na;
      return a.name.localeCompare(b.name, "de");
    });

    var ebene = L.layerGroup().addTo(karteInnen);
    var listeEl = document.getElementById("gastro-liste");
    var eintraege = [];

    sortiert.forEach(function (o) {
      var m = L.marker([o.lat, o.lon], {
        icon: L.divIcon({
          className: "",
          html: ortSymbol(ZEICHEN[o.kueche], false),
          // 34 px MUSS die Kantenlaenge von .ort-pin in stil.css sein: Leaflet
          // ankert an SEINER Kiste, waehrend das <i> darin seine eigene Groesse
          // hat - stehen die beiden auseinander, sitzt die Marke daneben.
          iconSize: [34, 34], iconAnchor: [17, 17]
        }),
        title: o.name + " — " + LABEL[o.kueche] + ", " + o.stadtteil
             + (note(o) ? ", " + note(o) : ""),
        // keyboard:false - 40 Marken waeren 40 Tab-Stopps vor dem naechsten
        // Bedienelement. Erreichbar sind die Orte ueber die Liste darunter, und
        // die ist der bessere Weg: sie zeigt den Inhalt statt nur die Stelle.
        keyboard: false,
        riseOnHover: true
      }).bindPopup(sprechblase(o));

      var art = document.createElement("article");
      art.className = "gastro-karte";
      var fakten = [
        ["Küche", LABEL[o.kueche]],
        ["Stadtteil", o.stadtteil],
        ["Offen", zeitenText(o, true)],
        ["Adresse", o.adresse || "unbekannt"],
        ["Luftlinie", meter(bezug.lat, bezug.lon, o.lat, o.lon) >= 1000
          ? (meter(bezug.lat, bezug.lon, o.lat, o.lon) / 1000).toFixed(1).replace(".", ",")
            + " km zum " + bezug.name
          : meter(bezug.lat, bezug.lon, o.lat, o.lon) + " m zum " + bezug.name]
      ];
      if (o.fruehstueck_bis) fakten.splice(3, 0, ["Frühstück bis", o.fruehstueck_bis]);
      if (o.gefluegel) fakten.splice(3, 0, ["Geflügel", GEFLUEGEL[o.gefluegel.stufe]]);
      if (o.preise && o.preise !== "unknown") fakten.splice(3, 0, ["Preise", o.preise]);

      art.innerHTML =
        '<div class="gastro-kopf">'
          + '<span aria-hidden="true">' + ortSymbol(ZEICHEN[o.kueche], false) + "</span>"
          + '<h4><button type="button" class="ort-zeigen">' + o.name + "</button></h4>"
          + (note(o) ? '<span class="gastro-note">' + note(o) + "</span>" : "")
        + "</div>"
        + '<dl class="gastro-fakten">'
          + fakten.map(function (f) { return "<dt>" + f[0] + "</dt><dd>" + f[1] + "</dd>"; }).join("")
        + "</dl>"
        + '<p class="gastro-notiz">' + o.notiz + "</p>"
        + [o.speisekarte && o.speisekarte.warnung, o.warnung, o.preise_hinweis]
            .filter(Boolean)
            .map(function (w) { return '<p class="gastro-warnung">' + w + "</p>"; }).join("");

      // Der Name schwenkt die Karte auf den Ort und oeffnet seine Sprechblase.
      // Ohne das waeren Liste und Karte zwei Darstellungen, die nichts
      // voneinander wissen - und die Liste der einzige Weg zu einem Ort, den man
      // auf der Karte nicht findet.
      art.querySelector(".ort-zeigen").addEventListener("click", function () {
        karteInnen.setView([o.lat, o.lon], Math.max(karteInnen.getZoom(), 16));
        m.openPopup();
        document.getElementById("karte-innenstadt").scrollIntoView({ block: "center" });
      });

      listeEl.appendChild(art);
      var heu = [o.name, o.kurz, LABEL[o.kueche], o.kueche, o.stadtteil].join(" ");
      eintraege.push({ o: o, m: m, el: art, heu1: falte(heu, false), heu2: falte(heu, true) });
    });

    // --- Suche und Filter greifen ZUSAMMEN ----------------------------------
    // Der Filter sagt, welche Kuechen gelten; die Suche schraenkt darin ein.
    // Nacheinander statt zusammen waere die haeufigere, falsche Bauform: dann
    // hebt jeder Tastendruck den Filter auf.
    var an = {};
    GASTRO.forEach(function (k) { an[k.id] = true; });

    var feld = document.getElementById("gastro-suche");
    var zahlEl = document.getElementById("gastro-zahl");
    var leerEl = document.getElementById("gastro-leer");

    function neuZeichnen(springen) {
      var begriff = feld.value.trim();
      // Mehrere Woerter sind eine UND-Bedingung: "au wirtshaus" meint beides,
      // nicht irgendeins davon.
      var worte = falte(begriff, false).split(/\s+/).filter(Boolean);
      var sichtbar = [];
      eintraege.forEach(function (e) {
        var passt = an[e.o.kueche] && worte.every(function (w) {
          return e.heu1.indexOf(w) >= 0 || e.heu2.indexOf(w) >= 0;
        });
        if (passt) {
          if (!ebene.hasLayer(e.m)) ebene.addLayer(e.m);
          sichtbar.push(e);
        } else if (ebene.hasLayer(e.m)) {
          ebene.removeLayer(e.m);
        }
        e.el.hidden = !passt;
      });

      zahlEl.textContent = sichtbar.length + " von " + eintraege.length + " Orten";
      leerEl.hidden = sichtbar.length > 0;
      if (!sichtbar.length) {
        var ausGeschaltet = GASTRO.filter(function (k) { return !an[k.id]; })
          .map(function (k) { return k.label; });
        leerEl.textContent = begriff
          ? "Kein Ort passt zu „" + begriff + "“"
            + (ausGeschaltet.length ? " in den angehakten Kategorien" : "")
            + ". Gesucht wird in Name, Küche und Stadtteil."
          : "Alle Kategorien sind ausgeschaltet — kein Ort auf der Karte.";
      }

      // Der Ausschnitt folgt der SUCHE, nicht dem Filter. Grund: sieben der 40
      // Haeuser liegen mehr als drei Kilometer vom Marienplatz. Wer "Aubing"
      // sucht, saehe sonst "1 von 40" und eine leere Innenstadt - genau die
      // Falle, gegen die der Zaehler gebaut ist. Ein Filter dagegen behaelt den
      // Ausschnitt: die Karte soll nicht springen, weil man eine Kategorie
      // ausblendet.
      if (!springen) return;
      if (begriff && sichtbar.length) {
        karteInnen.fitBounds(L.latLngBounds(sichtbar.map(function (e) {
          return [e.o.lat, e.o.lon];
        })).pad(0.25), { maxZoom: 16 });
      } else if (!begriff) {
        karteInnen.setView([bezug.lat, bezug.lon], START_ZOOM);
      }
    }

    // Zaehler und Liste sofort, der Ausschnitt nach der Tippause: eine Karte,
    // die bei jedem Buchstaben springt, ist nicht zu lesen.
    var wartend = null;
    feld.addEventListener("input", function () {
      neuZeichnen(false);
      clearTimeout(wartend);
      wartend = setTimeout(function () { neuZeichnen(true); }, 320);
    });

    // Die Legende IST der Filter - gleiche Bauform wie auf den beiden anderen
    // Reitern, damit ein Knopf hier nicht etwas anderes tut als dort.
    var ulI = document.getElementById("legende-innenstadt");
    GASTRO.forEach(function (k) {
      var n = eintraege.filter(function (e) { return e.o.kueche === k.id; }).length;
      if (!n) return;
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filter";
      b.setAttribute("aria-pressed", "true");
      b.innerHTML = '<span class="legende-marke" aria-hidden="true">'
          + ortSymbol(k.symbol, false) + "</span>"
        + '<span class="filter-text">' + k.label
          + ' <span class="filter-zahl">' + n + "</span></span>";
      b.addEventListener("click", function () {
        var jetzt = b.getAttribute("aria-pressed") === "true";
        b.setAttribute("aria-pressed", jetzt ? "false" : "true");
        an[k.id] = !jetzt;
        neuZeichnen(false);
      });
      li.appendChild(b);
      ulI.appendChild(li);
    });

    neuZeichnen(false);

    // --- Die Tafel ueber der Karte ------------------------------------------
    var weit = g.orte.filter(function (o) {
      return meter(bezug.lat, bezug.lon, o.lat, o.lon) > 3000;
    });
    var weitest = g.orte.reduce(function (a, o) {
      return meter(bezug.lat, bezug.lon, o.lat, o.lon)
           > meter(bezug.lat, bezug.lon, a.lat, a.lon) ? o : a;
    }, g.orte[0]);
    tafel("innenstadt-tafel", [
      ["Was hier liegt", g.anzahl.gesamt + " Orte — "
        + GASTRO.map(function (k) { return (g.anzahl[k.id] || 0) + " " + k.label; }).join(", ")],
      ["Ausschnitt", "Innenstadt um den " + bezug.name + ", Zoom " + START_ZOOM],
      ["Außerhalb", weit.length + " davon liegen weiter als 3 km vom " + bezug.name
        + " und beim Aufschlagen außerhalb des Bildes — der weiteste "
        + (meter(bezug.lat, bezug.lon, weitest.lat, weitest.lon) / 1000).toFixed(1).replace(".", ",")
        + " km (" + weitest.name + "). Die Suche schwenkt zu ihnen."]
    ], "Die Auswahl ist recherchiert, nicht abgefragt: was auf eine Reisekarte gehört, ist eine "
     + "Entscheidung. Frühstück und Wirtshäuser stehen als Liste in ihren Abrufskripten.");

    // --- Was unter der Karte genannt werden MUSS -----------------------------
    // Jede Quelle mit Rang und Datum, und jede Luecke ausdruecklich: eine
    // gefilterte, kuratierte Liste ohne diese Zahlen sieht aus wie eine
    // vollstaendige.
    var ohneZeit = g.orte.filter(function (o) {
      return !o.oeffnungszeiten || o.oeffnungszeiten === "unknown";
    }).length;
    var mitWarnung = g.orte.filter(function (o) {
      return (o.speisekarte && o.speisekarte.warnung) || o.warnung || o.preise_hinweis;
    }).length;
    var nurAdresse = g.orte.filter(function (o) {
      return o.koordinate && o.koordinate !== "betrieb";
    }).length;
    var q = g.quellen;
    document.getElementById("gastro-fuss").innerHTML =
      "<strong>Drei Bestände, drei Ränge — je Ort steht die Quelle in der Sprechblase.</strong> "
      + GASTRO.map(function (k) {
          var qq = q[k.id];
          if (!qq) return "";
          return k.label + ": " + (g.anzahl[k.id] || 0) + " Orte, " + qq.rang
               + ", abgerufen " + deutsch(qq.abgerufen);
        }).filter(Boolean).join(" · ") + ". "
      + "Die Wirtshäuser sind das einzige der drei mit Bewertungen aus der Places-API; "
      + "die Frühstücksnoten sind weitergegebene Google-Werte ohne place_id und darum "
      + "<em>secondary</em>. "
      + (q.wirtshaus && q.wirtshaus.anzahl
          ? "Von " + (g.anzahl.wirtshaus || 0) + " Speisekarten sind "
            + q.wirtshaus.anzahl.karte_geprueft + " einzeln geöffnet worden. "
            + "„Geflügel“ hat fünf Stufen, nicht zwei: bei "
            + q.wirtshaus.anzahl.gefluegel_nur_salat + " Häusern kommt es nur als Salat auf den "
            + "Tisch — wer ein Hendl will, steht dort falsch. "
          : "")
      + mitWarnung + " der " + g.anzahl.gesamt + " Orte tragen eine ausdrückliche Einschränkung "
      + "zu Preis, Karte oder Öffnungszeit; sie steht in der Sprechblase und in der Liste. "
      + ohneZeit + " Öffnungszeiten sind <strong>unbekannt</strong> und werden auch so gezeigt — "
      + "nicht geschätzt. Bei " + nurAdresse + " Orten sitzt die Marke <strong>nicht auf dem "
      + "Betrieb</strong>, sondern auf dem Haus, einem Marktplatz oder sogar einem anderen Laden "
      + "unter derselben Adresse; welcher Fall vorliegt, sagt jede Sprechblase einzeln. "
      + "Nicht gemessen: <strong>niemand war vor Ort</strong>, und die Entfernung in der Liste ist "
      + "Luftlinie, keine Gehzeit.";
  })();

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
    // Leaflet vermisst seinen Behaelter beim Anlegen. Eine Karte, die in einem
    // ausgeblendeten Abschnitt entstand, bleibt grau, bis invalidateSize() sie
    // neu vermisst - das gilt fuer ALLE DREI Karten. Wer eine vierte dazustellt
    // und diese Zeile vergisst, bekommt eine graue Flaeche, die aussieht wie eine
    // Karte, die noch laedt.
    if (id === "karte") karte.invalidateSize();
    if (id === "hotel" && karteHotel) karteHotel.invalidateSize();
    if (id === "innenstadt" && karteInnen) karteInnen.invalidateSize();
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
