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

  // --- Innenstadt -----------------------------------------------------------
  // Die Karte ist hier der Inhalt, nicht die Illustration: sie steht ganz oben,
  // ohne Infobox und ohne Kennzahlentafel davor. Beides stand am 09.09.2026
  // darueber und schob sie unter die Falzkante.
  //
  // EIN Untermenue schaltet Karte UND Liste zugleich. Vorher lagen 40 gleich
  // gebaute Prosakarten untereinander - 19 000 px Scrollhoehe auf dem Handy, und
  // was ein Katalog sein sollte, war eine Textwand. Ein Katalog braucht Dichte,
  // keine Absaetze: eine Zeile je Ort, die Prosa erst auf Abruf.
  //
  // Die Bahnhalte haengen NICHT am Untermenue. Sie sind Orientierung, kein
  // Thema - wer nach einem Wirtshaus sucht, will die U-Bahn daneben sehen und
  // nicht statt dessen.
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
    LABEL.wahrzeichen = "Wahrzeichen"; LABEL.museum = "Museum";
    ZEICHEN.wahrzeichen = "wahrzeichen"; ZEICHEN.museum = "museum";

    // Der Marienplatz ist der Bezug des Ausschnitts, aber keine eigene Marke -
    // die Karte traegt genau die Orte, die auch in der Liste stehen.
    var bezug = DATEN.orte.filter(function (o) { return o.art === "zentrum"; })[0]
             || { name: DATEN.ziel.name, lat: DATEN.ziel.mitte.lat, lon: DATEN.ziel.mitte.lon };
    var START_ZOOM = 14;

    // Naeherung fuer Stadtmasse. Ausgewiesen als LUFTLINIE, nicht als Weg: die
    // Umgebungskarte zeigt, wie weit die beiden auseinanderliegen - 210 m Luft
    // sind dort 354 m Weg.
    var meter = function (a, b, c, d) {
      var R = 6371000, t = Math.PI / 180;
      var x = (d - b) * t * Math.cos((a + c) / 2 * t), y = (c - a) * t;
      return Math.round(R * Math.sqrt(x * x + y * y));
    };
    var weite = function (m) {
      return m >= 1000 ? (m / 1000).toFixed(1).replace(".", ",") + " km" : m + " m";
    };

    // ===== Öffnungszeiten: aus Text gerechnet, nicht abgeschrieben ===========
    // Die laengste Zeile je Ort ist die Oeffnungszeit - genau die, die als
    // Fliesstext den Katalog zur Wand macht und als Streifen in 54 px passt.
    //
    // Gerechnet wird nur, was eindeutig dasteht. Was nicht aufgeht, bleibt
    // UNBEKANNT und wird als dritter Zustand gezeigt - nicht als "zu", denn das
    // waere eine Aussage, die niemand geprueft hat. Die Quellzeile steht im
    // aufgeklappten Teil immer daneben: der Streifen ist eine Zusammenfassung,
    // kein Ersatz.
    var TAG_KURZ = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    var TAG_NR = { mo: 0, di: 1, mi: 2, do: 3, fr: 4, sa: 5, so: 6,
      montag: 0, dienstag: 1, mittwoch: 2, donnerstag: 3, freitag: 4, samstag: 5, sonntag: 6 };

    var minuten = function (h, m) { return (+h) * 60 + (m ? +m : 0); };
    // Eine Spanne, die vor ihrem Anfang endet, laeuft ueber Mitternacht:
    // 17:00-01:00 sind acht Stunden, nicht minus sechzehn.
    var spannen = function (text) {
      if (/geschlossen|ruhetag|closed/i.test(text)) return [];
      var re = /(\d{1,2})(?::(\d{2}))?\s*[–\-]\s*(\d{1,2})(?::(\d{2}))?/g, m, out = [];
      while ((m = re.exec(text))) {
        var von = minuten(m[1], m[2]), bis = minuten(m[3], m[4]);
        if (bis <= von) bis += 1440;
        out.push([von, bis]);
      }
      return out.length ? out : null;
    };

    var ausArray = function (arr) {
      var w = [null, null, null, null, null, null, null];
      arr.forEach(function (z) {
        var m = /^\s*([A-Za-zäöüÄÖÜ]+)\s*:\s*(.+?)\s*$/.exec(z);
        if (!m) return;
        var i = TAG_NR[m[1].toLowerCase()];
        if (i === undefined) return;
        w[i] = spannen(m[2]);
      });
      return w;
    };

    // "Mo, Di, Fr 8–17, Sa 9–17; Mi, Do, So geschlossen" ist die schwierigste
    // Form: das Komma trennt hier Tage UND Abschnitte. Geloest wird das nicht
    // durch eine schlauere Regel, sondern durch Sammeln - Tagesangaben ohne
    // Zeit werden aufgehoben, bis eine Zeit kommt, und gelten dann mit.
    var ausText = function (s) {
      var w = [null, null, null, null, null, null, null];
      if (!s || s === "unknown") return w;
      var halde = [];
      s.replace(/\([^)]*\)/g, " ").split(/[;,]/).forEach(function (roh) {
        var st = roh.trim();
        if (!st) return;
        var zu = /geschlossen|ruhetag/i.exec(st);
        var zahl = st.search(/\d/);
        var grenze = zu ? zu.index : (zahl >= 0 ? zahl : -1);
        var tagteil = (grenze >= 0 ? st.slice(0, grenze) : st).trim();
        var tage = [];
        // "und" trennt hier Tage - ausser wenn danach eine Ziffer steht, dann
        // verbindet es zwei Zeitspannen ("11:30–15:00 und 18:00–21:30").
        tagteil.split(/\s+(?:und|u\.)\s+(?!\d)/i).forEach(function (teil) {
          var t = teil.trim().replace(/[.:]$/, "");
          if (!t) return;
          if (/^(täglich|taeglich|tgl\.?|alle tage)$/i.test(t)) {
            tage = [0, 1, 2, 3, 4, 5, 6];
            return;
          }
          var r = /^([A-Za-zäöü]+)\s*[–\-]\s*([A-Za-zäöü]+)$/.exec(t);
          if (r) {
            var a = TAG_NR[r[1].toLowerCase()], b = TAG_NR[r[2].toLowerCase()];
            if (a === undefined || b === undefined) return;
            for (var i = a; ; i = (i + 1) % 7) { tage.push(i); if (i === b) break; }
            return;
          }
          var n = TAG_NR[t.toLowerCase()];
          if (n !== undefined) tage.push(n);
        });
        if (grenze < 0) { halde = halde.concat(tage); return; }   // nur Tage: aufheben
        var wert = zu ? [] : spannen(st.slice(grenze));
        halde.concat(tage).forEach(function (i) { w[i] = wert; });
        halde = [];
      });
      return w;
    };

    var woche = function (o) {
      return Array.isArray(o.oeffnungszeiten) ? ausArray(o.oeffnungszeiten)
           : ausText(o.oeffnungszeiten);
    };

    // Der Streifen: sieben Spalten, oben Mitternacht, unten Mitternacht. Drei
    // Zustaende, und sie unterscheiden sich in der FORM, nicht nur in der Farbe
    // (WCAG 1.4.1): gefuellter Block = offen, Schraegstrich = zu, Punktreihe =
    // unbekannt.
    var streifen = function (w, titel) {
      var teile = w.map(function (sp, i) {
        var x = i * 8;
        var bahn = '<rect class="wo-bahn" x="' + x + '" y="0" width="6" height="22"/>';
        if (sp === null) {
          return bahn + '<circle class="wo-punkt" cx="' + (x + 3) + '" cy="6" r="1"/>'
            + '<circle class="wo-punkt" cx="' + (x + 3) + '" cy="11" r="1"/>'
            + '<circle class="wo-punkt" cx="' + (x + 3) + '" cy="16" r="1"/>';
        }
        if (!sp.length) {
          return bahn + '<path class="wo-strich" d="M' + x + ' 22L' + (x + 6) + ' 0"/>';
        }
        return bahn + sp.map(function (s) {
          var y0 = 22 * Math.min(s[0], 1440) / 1440;
          var y1 = 22 * Math.min(s[1], 1440) / 1440;
          return '<rect class="wo-offen" x="' + x + '" y="' + y0.toFixed(1)
            + '" width="6" height="' + Math.max(2, y1 - y0).toFixed(1) + '"/>';
        }).join("");
      }).join("");
      return '<svg class="woche" viewBox="0 0 54 22" width="54" height="22" role="img"'
        + ' aria-label="' + titel + '">' + teile + "</svg>";
    };

    // Der Streifen zeigt WELCHE Tage; die Zeile darunter sagt WANN. Gleiche
    // Zeiten an Nachbartagen werden zusammengefasst - 22 Wirtshaeuser mit je
    // sieben Zeilen waeren 154 Zeilen Oeffnungszeit im Katalog.
    // Mitternacht als SCHLUSSZEIT heisst 24, nicht 0: "17–0" liest sich wie ein
    // Tippfehler, "17–24" wie eine Uhrzeit. Nach Mitternacht zaehlt wieder
    // normal weiter - 01:00 des Folgetags bleibt "1".
    var uhr = function (m, schluss) {
      if (schluss && m >= 1440 && m % 1440 === 0) return "24";
      var h = Math.floor((m % 1440) / 60), r = m % 60;
      return h + (r ? ":" + String(r).padStart(2, "0") : "");
    };
    var zeitenKurz = function (w) {
      var schluessel = w.map(function (sp) {
        return sp === null ? "?" : !sp.length ? "zu"
          : sp.map(function (s) { return uhr(s[0]) + "–" + uhr(s[1], true); }).join(" + ");
      });
      var out = [], lauf = null;
      schluessel.forEach(function (k, i) {
        if (lauf && lauf.k === k) { lauf.bis = i; return; }
        lauf = { k: k, von: i, bis: null };
        out.push(lauf);
      });
      return out.map(function (b) {
        var tage = b.bis === null ? TAG_KURZ[b.von] : TAG_KURZ[b.von] + "–" + TAG_KURZ[b.bis];
        return b.k === "?" ? tage + " unbekannt" : b.k === "zu" ? tage + " zu" : tage + " " + b.k;
      }).join(" · ");
    };

    // ===== Note: Punkt auf einer BENANNTEN Achse ============================
    // Die Achse laeuft von 4,0 bis 5,0 und nicht ab null. Das ist ein
    // Ausschnitt, und er wird ausgeschrieben statt versteckt: alle 34 Noten
    // liegen zwischen 4,1 und 4,9 - eine Achse ab null zeigte 34 gleich lange
    // Balken und damit nichts.
    var NOTE_VON = 4, NOTE_BIS = 5;
    var noteSkala = function (note) {
      var t = Math.max(0, Math.min(1, (note - NOTE_VON) / (NOTE_BIS - NOTE_VON)));
      return '<svg class="note-skala" viewBox="0 0 44 12" width="44" height="12" aria-hidden="true">'
        + '<path class="ns-achse" d="M2 8h40"/>'
        + '<path class="ns-tick" d="M2 5v6M22 6v4M42 5v6"/>'
        + '<circle class="ns-punkt" cx="' + (2 + 40 * t).toFixed(1) + '" cy="8" r="3.2"/>'
        + "</svg>";
    };

    // ===== Geflügel: vier Stufen plus "ungeprueft" ==========================
    // Sie duerfen NICHT zu ja/nein zusammenfallen: ein Haus mit 'salat' serviert
    // einen Salatteller, kein Hendl. Die Skala zeigt die Stufe, das Wort
    // daneben nennt sie - die Grafik ersetzt die Aussage nicht, sie verkuerzt
    // den Weg zu ihr.
    var GEFLUEGEL = {
      schnitzel:    { stufe: 4, text: "Geflügelschnitzel auf der Karte" },
      hauptgericht: { stufe: 3, text: "Geflügel als Hauptgericht" },
      salat:        { stufe: 2, text: "Geflügel nur als Salat — kein Hendl" },
      keins:        { stufe: 1, text: "kein Geflügel" },
      ungeprueft:   { stufe: 0, text: "Geflügel ungeprüft" }
    };
    var VEGETARISCH = {
      hauptgericht: "vegetarisches Hauptgericht", "nur-salat": "vegetarisch nur als Salat",
      keins: "nichts Vegetarisches", ungeprueft: "ungeprüft"
    };
    var stufenSkala = function (stufe, von) {
      var k = "";
      for (var i = 1; i <= von; i++) {
        k += '<rect class="st-feld' + (i <= stufe ? " st-voll" : "") + '" x="'
          + ((i - 1) * 8) + '" y="0" width="6" height="10"/>';
      }
      return '<svg class="stufen" viewBox="0 0 ' + (von * 8 - 2) + ' 10" width="'
        + (von * 8 - 2) + '" height="10" aria-hidden="true">' + k + "</svg>";
    };

    var KOORDINATE = {
      betrieb: "Der Punkt sitzt auf dem Betrieb selbst.",
      adresse: "Der Punkt trifft das Haus, nicht den Laden darin.",
      markt: "Der Punkt ist die Mitte des Marktes, nicht der Stand.",
      "fremder-treffer": "Unter derselben Adresse steht in OpenStreetMap ein anderer Betrieb — "
        + "die Marke sitzt am richtigen Gebäude, aber auf dem Nachbarn."
    };

    // ===== Der Bestand: Gastro plus Sehenswertes ============================
    // Sehenswertes kommt aus DATEN.orte, wo auch die Stadtkarte es hernimmt -
    // eine zweite Fassung derselben Punkte driftet ab.
    var sehenswert = DATEN.orte.filter(function (o) {
      return (o.art === "wahrzeichen" || o.art === "museum")
        && meter(bezug.lat, bezug.lon, o.lat, o.lon) <= 2600;
    });

    var alle = g.orte.map(function (o) { return { o: o, gruppe: o.kueche }; })
      .concat(sehenswert.map(function (o) { return { o: o, gruppe: o.art }; }));
    alle.forEach(function (e) {
      e.m = meter(bezug.lat, bezug.lon, e.o.lat, e.o.lon);
      e.note = (e.o.google && e.o.google.note) || 0;
      e.w = e.o.oeffnungszeiten ? woche(e.o) : null;
    });

    var REITER = [
      { id: "alle",        label: "Alles",       gruppen: GASTRO.map(function (k) { return k.id; }).concat(["wahrzeichen", "museum"]) },
      { id: "fruehstueck", label: "Frühstück",   gruppen: ["fruehstueck"] },
      { id: "wirtshaus",   label: "Abendessen",  gruppen: ["wirtshaus"] },
      { id: "burger",      label: "Burger",      gruppen: ["burger"] },
      { id: "sehenswert",  label: "Sehenswertes", gruppen: ["wahrzeichen", "museum"] }
    ];
    var reiterAktiv = "alle";

    // ===== Karte ============================================================
    karteInnen = L.map("karte-innenstadt", { scrollWheelZoom: true })
      .setView([bezug.lat, bezug.lon], START_ZOOM);
    // Nur die Strassenkarte: ein Luftbild hilft beim Wiedererkennen eines
    // Gebaeudes, nicht beim Finden eines Wirtshauses.
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(karteInnen);

    var ebene = L.layerGroup().addTo(karteInnen);

    var mapsZiel = function (o) {
      return { lat: o.lat, lon: o.lon, maps: (o.google && o.google.maps) || o.maps };
    };
    var zeile = function (klasse, inhalt) { return '<p class="' + klasse + '">' + inhalt + "</p>"; };

    var sprechblase = function (e) {
      var o = e.o, z = ["<h3>" + o.name + "</h3>",
        "<p>" + LABEL[e.gruppe] + " · " + (o.stadtteil || weite(e.m) + " zum " + bezug.name) + "</p>"];
      if (e.note) {
        z.push('<p class="bewertung"><strong>' + String(e.note).replace(".", ",") + " ★</strong> aus "
          + o.google.stimmen.toLocaleString("de-DE") + " Bewertungen"
          + (o.google.rang === "secondary" ? " — weitergegeben, nicht aus der Places-API" : "") + "</p>");
      }
      z.push("<p>" + o.notiz + "</p>");
      if (o.gefluegel) z.push(zeile("popup-fein", "<strong>" + GEFLUEGEL[o.gefluegel.stufe].text
        + "</strong>" + (o.gefluegel.gericht ? " — " + o.gefluegel.gericht : "")
        + (o.gefluegel.preis ? " (" + o.gefluegel.preis + " €)" : "")));
      if (e.w) z.push(zeile("popup-fein", zeitenKurz(e.w)));
      if (o.adresse) z.push(zeile("popup-fein", o.adresse));
      [o.speisekarte && o.speisekarte.warnung, o.warnung, o.preise_hinweis,
       o.koordinate_hinweis || (o.koordinate && o.koordinate !== "betrieb" ? KOORDINATE[o.koordinate] : ""),
       o.stadtteil_hinweis].forEach(function (wn) {
        if (wn) z.push(zeile("popup-unbekannt", wn));
      });
      var ziel = o.web || o.beleg;
      if (ziel) z.push('<p class="popup-fein"><a href="' + ziel + '" target="_blank" '
        + 'rel="noopener noreferrer">' + (o.web ? "Website" : "Beleg") + "</a></p>");
      z.push(mapsLink(mapsZiel(o)));
      if (o.osm) z.push(zeile("popup-fein", "OSM " + o.osm));
      return z.join("");
    };

    alle.forEach(function (e) {
      e.marke = L.marker([e.o.lat, e.o.lon], {
        icon: L.divIcon({
          className: "", html: ortSymbol(ZEICHEN[e.gruppe], false),
          // 34 px MUSS der Kantenlaenge von .ort-pin in stil.css entsprechen -
          // Leaflet ankert an SEINER Kiste, sonst sitzt die Marke daneben.
          iconSize: [34, 34], iconAnchor: [17, 17]
        }),
        title: e.o.name + " — " + LABEL[e.gruppe]
             + (e.o.stadtteil ? ", " + e.o.stadtteil : "")
             + (e.note ? ", " + String(e.note).replace(".", ",") + " ★" : ""),
        // keyboard:false - 59 Marken waeren 59 Tab-Stopps vor dem naechsten
        // Bedienelement. Der Weg ueber die Tastatur fuehrt durch die Liste, und
        // die ist der bessere: sie zeigt den Inhalt statt nur die Stelle.
        keyboard: false, riseOnHover: true
      }).bindPopup(sprechblase(e));
    });

    // Bahnhalte: eigene Ebene, eigener Schalter, NICHT am Untermenue. Beim
    // Aufschlagen aus - 34 Halte auf demselben Ausschnitt decken die Lokale zu,
    // und die sind hier das Thema. Der Schalter nennt seine Zahl, damit die
    // Ebene nicht unsichtbar bleibt, weil man sie nicht vermutet.
    // Je Verkehrsmittel eine EIGENE Ebene, nicht eine Sammelebene "Halte" -
    // dieselbe Regel wie auf der Umgebungskarte: wer die S-Bahn sucht, soll die
    // U-Bahn nicht mit einschalten muessen.
    var halteEbenen = { sbahn: L.layerGroup(), ubahn: L.layerGroup() };
    var halteZahl = { sbahn: 0, ubahn: 0 };
    if (DATEN.bahn && DATEN.bahn.halte) {
      DATEN.bahn.halte.forEach(function (h) {
        if (meter(bezug.lat, bezug.lon, h.lat, h.lon) > 2600) return;
        if (!halteEbenen[h.art]) return;
        halteZahl[h.art]++;
        L.marker([h.lat, h.lon], {
          icon: L.divIcon({ className: "",
            html: '<i class="halt-pin ' + h.art + '">' + VERKEHR[h.art].kuerzel + "</i>",
            iconSize: [26, 26], iconAnchor: [13, 13] }),
          title: h.name + (h.linien && h.linien.length ? " — " + h.linien.join(", ") : ""),
          keyboard: false
        }).addTo(halteEbenen[h.art]).bindPopup("<h3>" + h.name + "</h3><p>"
          + (h.art === "ubahn" ? "U-Bahn-Station" : "S-Bahn / DB-Halt") + "</p>"
          + linienBlock(h) + mapsLink(h) + zeile("popup-fein", "OSM " + h.osm));
      });
    }

    // ===== Die Liste: ein Katalog, keine Kartenstapel =======================
    // Eine Zeile je Ort in EINER Tafel, getrennt durch Haarlinien statt durch 40
    // eigene Rahmen. Die Prosa liegt in <details> - das bringt Tastatur und
    // Vorlesehilfe von selbst mit, und der Pruefstand klappt es zum Messen auf.
    var listeEl = document.getElementById("gastro-liste");
    var tafelEl = document.createElement("div");
    tafelEl.className = "katalog";
    listeEl.appendChild(tafelEl);

    var faktenZeile = function (n, v) {
      return v ? "<dt>" + n + "</dt><dd>" + v + "</dd>" : "";
    };

    alle.forEach(function (e) {
      var o = e.o;
      var d = document.createElement("details");
      d.className = "ort";
      // Die Kategoriefarbe lag bisher NUR im Pin. Als Kante an der Zeile
      // gruppiert sie den nach Kueche sortierten Katalog sichtbar, ohne eine
      // Zwischenueberschrift zu kosten - und sie bleibt dabei das, was die
      // Bildsprache erlaubt: eine Kante, keine Flaeche.
      d.dataset.gruppe = e.gruppe;

      var streifenTitel = e.w ? "Öffnungszeiten: " + zeitenKurz(e.w) : "Öffnungszeiten unbekannt";
      var kopf = '<span class="ort-marke" aria-hidden="true">' + ortSymbol(ZEICHEN[e.gruppe], false) + "</span>"
        + '<span class="ort-name">' + o.name + "</span>"
        + '<span class="ort-meta">' + (o.stadtteil ? o.stadtteil + " · " : "") + weite(e.m) + "</span>"
        // Der Platzhalter bleibt, auch wo es keine Oeffnungszeit gibt: sonst
        // rutscht die ganze Zeile um ein Feld nach links und die Noten der
        // Nachbarzeilen fluchten nicht mehr.
        + '<span class="ort-woche">' + (e.w ? streifen(e.w, streifenTitel) : "") + "</span>"
        + (e.note
            ? '<span class="ort-note">' + noteSkala(e.note)
              + '<b>' + String(e.note).replace(".", ",") + "</b></span>"
            : '<span class="ort-note ort-note--ohne">ohne Note</span>');

      var fakten = faktenZeile("Offen", e.w ? zeitenKurz(e.w) : "unbekannt — nicht erhoben")
        + faktenZeile("Adresse", o.adresse)
        + (o.fruehstueck_bis ? faktenZeile("Frühstück bis", o.fruehstueck_bis) : "")
        + (o.preise && o.preise !== "unknown" ? faktenZeile("Preise", o.preise) : "")
        + (o.gefluegel
            ? "<dt>Geflügel</dt><dd>" + stufenSkala(GEFLUEGEL[o.gefluegel.stufe].stufe, 4)
              + " " + GEFLUEGEL[o.gefluegel.stufe].text
              + (o.gefluegel.gericht ? " — " + o.gefluegel.gericht : "")
              + (o.gefluegel.preis ? " (" + o.gefluegel.preis + " €)" : "") + "</dd>"
            : "")
        + (o.vegetarisch ? faktenZeile("Vegetarisch", VEGETARISCH[o.vegetarisch.stufe]
            + (o.vegetarisch.beispiel ? " — " + o.vegetarisch.beispiel : "")) : "")
        + (e.note ? faktenZeile("Bewertung", String(e.note).replace(".", ",") + " ★ aus "
            + o.google.stimmen.toLocaleString("de-DE") + " Stimmen"
            + (o.google.rang === "secondary" ? " (weitergegeben, nicht aus der Places-API)" : "")) : "");

      var warnungen = [o.speisekarte && o.speisekarte.warnung, o.warnung, o.preise_hinweis,
        o.koordinate_hinweis || (o.koordinate && o.koordinate !== "betrieb" ? KOORDINATE[o.koordinate] : ""),
        o.stadtteil_hinweis].filter(Boolean);

      var ziel = o.web || o.beleg;
      d.innerHTML = "<summary>" + kopf + "</summary>"
        + '<div class="ort-tief">'
          + '<p class="ort-notiz">' + o.notiz + "</p>"
          + (fakten ? '<dl class="ort-fakten">' + fakten + "</dl>" : "")
          + warnungen.map(function (wn) { return '<p class="ort-warnung">' + wn + "</p>"; }).join("")
          + '<p class="ort-wege">'
            + '<button type="button" class="ort-zeigen">Auf der Karte zeigen</button>'
            + (ziel ? ' <a href="' + ziel + '" target="_blank" rel="noopener noreferrer">'
                + (o.web ? "Website" : "Beleg") + " ↗</a>" : "")
            + ' <a href="' + ((o.google && o.google.maps) || "https://www.google.com/maps/search/?api=1&query="
                + encodeURIComponent(o.lat + "," + o.lon))
              + '" target="_blank" rel="noopener noreferrer">Google Maps ↗</a>'
          + "</p>"
        + "</div>";

      d.querySelector(".ort-zeigen").addEventListener("click", function () {
        karteInnen.setView([o.lat, o.lon], Math.max(karteInnen.getZoom(), 16));
        e.marke.openPopup();
        document.getElementById("karte-innenstadt").scrollIntoView({ block: "center" });
      });

      tafelEl.appendChild(d);
      e.el = d;
      var heu = [o.name, o.kurz, LABEL[e.gruppe], e.gruppe, o.stadtteil].filter(Boolean).join(" ");
      e.heu1 = falte(heu, false);
      e.heu2 = falte(heu, true);
    });

    // ===== FLIP: die Zeilen wandern, statt zu springen ======================
    // Uebernommen aus artefakt-bausteine/vorlagen/umordnen-flip.html. Erst ALLE
    // messen, dann das DOM aendern, dann zurueckschieben und zurueckfuehren -
    // eine Messung je Element nach der Aenderung waere ein Layout je Element.
    // Nur transform wird animiert, also laeuft die Bewegung auf dem Compositor.
    var ruhig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var flip = function (elemente, aendern) {
      if (ruhig) return aendern();
      var vorher = new Map();
      elemente.forEach(function (el) {
        el.style.transform = "";
        vorher.set(el, el.getBoundingClientRect());
      });
      aendern();
      var bewegte = [];
      elemente.forEach(function (el) {
        var alt = vorher.get(el), neu = el.getBoundingClientRect();
        if (!neu.width && !neu.height) return;          // ausgehaengt: kein "nachher"
        var dx = alt.left - neu.left, dy = alt.top - neu.top;
        if (!dx && !dy) return;
        el.style.transform = "translate(" + dx + "px," + dy + "px)";
        bewegte.push([el, dx, dy]);
      });
      void document.body.offsetWidth;                   // Startzustand erzwingen
      bewegte.forEach(function (b) {
        var el = b[0];
        el.style.willChange = "transform";
        var a = el.animate(
          [{ transform: "translate(" + b[1] + "px," + b[2] + "px)" }, { transform: "translate(0,0)" }],
          { duration: 450, easing: "cubic-bezier(.22,1,.36,1)", fill: "none" });
        el.style.transform = "";
        a.finished.then(function () { el.style.willChange = ""; }).catch(function () {});
      });
    };

    // ===== Suche und Untermenü greifen zusammen ============================
    var feld = document.getElementById("gastro-suche");
    var zahlEl = document.getElementById("gastro-zahl");
    var leerEl = document.getElementById("gastro-leer");

    function neuZeichnen(springen) {
      var begriff = feld.value.trim();
      var worte = falte(begriff, false).split(/\s+/).filter(Boolean);
      var reiter = REITER.filter(function (r) { return r.id === reiterAktiv; })[0];
      var sichtbar = [];

      flip(alle.map(function (e) { return e.el; }), function () {
        alle.forEach(function (e) {
          var passt = reiter.gruppen.indexOf(e.gruppe) >= 0 && worte.every(function (wo) {
            return e.heu1.indexOf(wo) >= 0 || e.heu2.indexOf(wo) >= 0;
          });
          if (passt) {
            if (!ebene.hasLayer(e.marke)) ebene.addLayer(e.marke);
            sichtbar.push(e);
          } else if (ebene.hasLayer(e.marke)) {
            ebene.removeLayer(e.marke);
          }
          e.el.hidden = !passt;
        });
      });

      zahlEl.textContent = sichtbar.length + " von " + alle.length + " Orten";
      leerEl.hidden = sichtbar.length > 0;
      if (!sichtbar.length) {
        leerEl.textContent = begriff
          ? "Kein Ort passt zu „" + begriff + "“ unter " + reiter.label
            + ". Gesucht wird in Name, Küche und Stadtteil."
          : "Unter " + reiter.label + " liegt hier nichts.";
      }

      // Der Ausschnitt folgt der SUCHE, nicht dem Untermenue: sieben Haeuser
      // liegen weiter als 3 km vom Marienplatz, der weiteste 11,5 km. Wer
      // "Aubing" sucht, saehe sonst "1 von 59" und eine leere Innenstadt.
      if (!springen) return;
      if (begriff && sichtbar.length) {
        karteInnen.fitBounds(L.latLngBounds(sichtbar.map(function (e) {
          return [e.o.lat, e.o.lon];
        })).pad(0.25), { maxZoom: 16 });
      } else if (!begriff) {
        karteInnen.setView([bezug.lat, bezug.lon], START_ZOOM);
      }
    }

    var wartend = null;
    feld.addEventListener("input", function () {
      neuZeichnen(false);
      clearTimeout(wartend);
      wartend = setTimeout(function () { neuZeichnen(true); }, 320);
    });

    // ===== Untermenü ========================================================
    // Ein Satz Knoepfe mit aria-pressed, nicht role="tablist": eine echte
    // Registerkarte verpflichtet zu Pfeiltasten mit EINEM Tabstopp und zu
    // tabpanel-Rollen. Hier schaltet die Auswahl zwei Dinge zugleich - Karte und
    // Liste -, das ist ein Filter und keine Registerkarte.
    var navEl = document.getElementById("innenstadt-reiter");
    var knoepfeI = [];
    REITER.forEach(function (r) {
      var n = alle.filter(function (e) { return r.gruppen.indexOf(e.gruppe) >= 0; }).length;
      if (!n) return;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "unterknopf";
      b.dataset.id = r.id;
      b.setAttribute("aria-pressed", r.id === reiterAktiv ? "true" : "false");
      b.innerHTML = (r.id === "alle" ? "" : '<span class="unter-marke" aria-hidden="true">'
          + ortSymbol(ZEICHEN[r.gruppen[0]], false) + "</span>")
        + r.label + ' <span class="unter-zahl">' + n + "</span>";
      b.addEventListener("click", function () {
        reiterAktiv = r.id;
        knoepfeI.forEach(function (x) {
          x.setAttribute("aria-pressed", x.dataset.id === r.id ? "true" : "false");
        });
        neuZeichnen(false);
      });
      knoepfeI.push(b);
      navEl.appendChild(b);
    });

    // ===== Kartenebenen, die nicht am Untermenü hängen ======================
    var ulI = document.getElementById("legende-innenstadt");
    var legendeEintrag = function (markeHtml, text, zahl, an, schalten) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filter";
      b.setAttribute("aria-pressed", an ? "true" : "false");
      b.innerHTML = '<span class="legende-marke" aria-hidden="true">' + markeHtml + "</span>"
        + '<span class="filter-text">' + text
        + (zahl ? ' <span class="filter-zahl">' + zahl + "</span>" : "") + "</span>";
      b.addEventListener("click", function () {
        var jetzt = b.getAttribute("aria-pressed") === "true";
        b.setAttribute("aria-pressed", jetzt ? "false" : "true");
        schalten(!jetzt);
      });
      li.appendChild(b);
      ulI.appendChild(li);
      return b;
    };
    // "Bahnhalte" heisst der Knopf, nicht "Bahnhalte einblenden": der Aus-Zustand
    // streicht den Text durch, und "einblenden" durchgestrichen liest sich wie
    // "geht nicht" statt wie "ist aus".
    ["sbahn", "ubahn"].forEach(function (art) {
      if (!halteZahl[art]) return;
      legendeEintrag('<i class="halt-pin ' + art + '">' + VERKEHR[art].kuerzel + "</i>",
        VERKEHR[art].label, halteZahl[art], false, function (an) {
          if (an) halteEbenen[art].addTo(karteInnen); else karteInnen.removeLayer(halteEbenen[art]);
        });
    });
    // Die Legende erklaert den Wochenstreifen. Ohne diese Zeile ist er Zierrat:
    // drei Zustaende, die niemand zuordnen kann, sind schlimmer als kein Bild.
    var erk = document.createElement("li");
    erk.className = "legende-erklaerung";
    erk.innerHTML = '<span class="legende-marke" aria-hidden="true">'
      + streifen([[[480, 1020]], [[480, 1020]], null, [], [[480, 1020]], [[540, 1020]], []], "") + "</span>"
      + '<span class="filter-text">Wochenstreifen Mo–So: <b>Block</b> offen, '
      + "<b>Strich</b> zu, <b>Punkte</b> unbekannt — oben Mitternacht, unten Mitternacht</span>";
    ulI.appendChild(erk);

    neuZeichnen(false);

    // ===== Was unter der Karte und unter der Liste stehen MUSS ==============
    var weit = g.orte.filter(function (o) { return meter(bezug.lat, bezug.lon, o.lat, o.lon) > 3000; });
    document.getElementById("karte-fuss").innerHTML =
      "<strong>Ausschnitt: Innenstadt um den " + bezug.name + ".</strong> "
      + weit.length + " der " + g.anzahl.gesamt + " Lokale liegen weiter als 3 km entfernt und "
      + "beim Aufschlagen außerhalb des Bildes — die Suche schwenkt zu ihnen. "
      + (halteZahl.sbahn + halteZahl.ubahn
          ? "Die " + (halteZahl.sbahn + halteZahl.ubahn) + " Bahnhalte sind ausgeschaltet, weil sie "
            + "den Ausschnitt zudecken; ein Klick auf die Legende holt sie dazu. " : "")
      + "Entfernungen sind Luftlinie, keine Gehzeit.";

    var gz = function (id, pruef) {
      return g.orte.filter(function (o) { return o.kueche === id && pruef(o); }).length;
    };
    var ohneZeit = g.orte.filter(function (o) {
      return !o.oeffnungszeiten || o.oeffnungszeiten === "unknown";
    }).length;
    var mitWarnung = g.orte.filter(function (o) {
      return (o.speisekarte && o.speisekarte.warnung) || o.warnung || o.preise_hinweis;
    }).length;
    var nichtBetrieb = g.orte.filter(function (o) {
      return o.koordinate && o.koordinate !== "betrieb";
    }).length;
    var q = g.quellen;

    // Die Kennzahlen als Zeile, der Volltext auf Abruf: die Luecken MUESSEN
    // genannt werden, aber ein Absatz von zwoelf Zeilen unter der Liste wird
    // nicht gelesen und ist damit dieselbe Textwand in klein.
    document.getElementById("gastro-fuss").innerHTML =
      '<span class="fuss-zahlen">'
        + GASTRO.map(function (k) {
            var qq = q[k.id];
            return '<b>' + (g.anzahl[k.id] || 0) + "</b> " + k.label
              + (qq ? ' <i>' + qq.rang + "</i>" : "");
          }).join("")
        + '<b>' + ohneZeit + "</b> Öffnungszeiten unbekannt"
        + '<b>' + mitWarnung + "</b> mit Einschränkung"
        + '<b>' + nichtBetrieb + "</b> Marke nicht auf dem Betrieb"
      + "</span>"
      + "<details class=\"fuss-mehr\"><summary>Woher die Angaben kommen, und was fehlt</summary>"
      + "<p>Drei Bestände, drei Ränge, alle abgerufen am "
        + deutsch(q.wirtshaus ? q.wirtshaus.abgerufen : q.burger.abgerufen) + ". "
      + "Die <strong>Wirtshäuser</strong> sind das einzige der drei mit Bewertungen aus der "
      + "Places-API"
      + (q.wirtshaus && q.wirtshaus.anzahl
          ? "; " + q.wirtshaus.anzahl.karte_geprueft + " der " + (g.anzahl.wirtshaus || 0)
            + " Speisekarten sind einzeln geöffnet worden" : "")
      + ". Die <strong>Frühstücksnoten</strong> sind weitergegebene Google-Werte ohne place_id "
      + "und darum <em>secondary</em>. Bei <strong>" + nichtBetrieb + "</strong> Orten sitzt die "
      + "Marke nicht auf dem Betrieb, sondern auf dem Haus, einem Marktplatz oder einem anderen "
      + "Laden unter derselben Adresse; welcher Fall vorliegt, sagt jede Sprechblase einzeln.</p>"
      + "<p>„Geflügel“ hat <strong>fünf</strong> Stufen, nicht zwei: bei "
      + gz("wirtshaus", function (o) { return o.gefluegel && o.gefluegel.stufe === "salat"; })
      + " Häusern kommt es nur als Salat auf den Tisch — wer ein Hendl will, steht dort falsch. "
      + "<strong>" + ohneZeit + "</strong> Öffnungszeiten sind unbekannt und werden auch so "
      + "gezeigt, nicht geschätzt.</p>"
      + "<p><strong>Der Wochenstreifen ist gerechnet, nicht abgeschrieben</strong> — aus der "
      + "Öffnungszeit des Bestands. Was sich nicht eindeutig auflösen ließ, steht als "
      + "<em>unbekannt</em> und nicht als „zu“. Die Quellzeile steht im aufgeklappten Teil "
      + "daneben. Die Notenachse ist ein <strong>Ausschnitt von 4,0 bis 5,0</strong>: alle Noten "
      + "liegen zwischen 4,1 und 4,9, eine Achse ab null zeigte 34 gleich lange Balken.</p>"
      + "<p><strong>Nicht gemessen:</strong> niemand war vor Ort, kein Preis stammt von einer "
      + "Karte am Tisch, und die Entfernung ist Luftlinie, keine Gehzeit.</p>"
      + "</details>";
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
    // Die Infobox steht ueber ALLEN Ansichten - ausser wo ein Reiter sie
    // ausdruecklich abbestellt. 'Innenstadt' tut das: der Reiter handelt von der
    // Stadt, nicht von der Buchung, und die Box schob dort die Karte unter die
    // Falzkante. Der Schalter steht in reise.json, nicht hier: der naechste
    // Reiter stellt dieselbe Frage, und ein Sonderfall im Skript beantwortet
    // sie nur einmal.
    var eintrag = DATEN.menue.filter(function (m) { return m.id === id; })[0];
    var box = document.querySelector(".infobox");
    if (box) box.hidden = eintrag && eintrag.reisedaten === false;
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
