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
    // (Der Fall selbst ist seit der Umstellung auf die Places API erledigt -
    // die Lehre daraus nicht.)
    var gz = function (id, pruef) {
      return DATEN.gastro.orte.filter(function (o) { return o.kueche === id && pruef(o); }).length;
    };
    var keineZeit = function (o) { return !Array.isArray(o.oeffnungszeiten); };
    var abweichendeProbe = function (o) { return o.namensprobe === "abweichend"; };
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
        return "Die AUSWAHL ist kuratiert und steht im Abrufskript — mit einem zweiten, "
          + "benannten Maßstab statt eines Gefühls. Koordinate, Adresse, Note und "
          + "Öffnungszeiten kommen seit dem 09.09.2026 aus der Places API und damit vom Betrieb "
          + "selbst; vorher lagen sie auf einer Adresssuche, die bei sieben der " + n
          + " Orte nur das Haus traf und einmal einen anderen Laden darin. "
          + "Was <strong>nicht</strong> von dort kommt: kein Preis ist von einer Karte vor Ort "
          + "abgelesen, und " + wort(gz("fruehstueck", keineZeit)) + " Öffnungszeit"
          + (gz("fruehstueck", keineZeit) === 1 ? " liegt" : "en liegen")
          + " gar nicht vor und steht als <em>unbekannt</em>.";
      },
      burger: function (n) {
        return "Smash-Burger-Läden aus der Münchner Food-Presse, je Eintrag mit Beleg. "
          + "Die Namensprobe beim Umstellen auf die Places API hat hier zwei Fehler gefunden, "
          + "die vorher unbemerkt in den Daten standen: „SMASH – Burger &amp; Bar“ heißt "
          + "„SMASH OR PASS – BURGER &amp; BAR“, und King Loui war mit einer Adresse verzeichnet, "
          + "unter der heute ein Nudelrestaurant sitzt — das Lokal liegt am Harras. "
          + "Die Bewertungen sind neu: vorher hatte keiner der " + wort(n) + " eine. "
          + "Bei einem Haus widersprechen sich zwei Preisquellen aus derselben Zeit; keine gilt "
          + "als gesichert.";
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

  // --- Hotel: eine Tafel statt zweier Kaesten -------------------------------
  // Bis zum 09.09.2026 standen hier zwei Boxen uebereinander, die dasselbe
  // erzaehlten: die Infobox mit "Unterkunft: Motel One ..." und darunter die
  // Hoteltafel mit "Haus: Motel One ...". Schlimmer als die Doppelung war die
  // Trennung - das Anreisedatum stand einen Kasten entfernt von der
  // Check-in-Zeit, zu der es gehoert, und wer wissen wollte, ab wann er ins
  // Zimmer kommt, musste zwei Kaesten zusammenrechnen.
  //
  // Jetzt eine Tafel, und sie ist nach der FRAGE gebaut, nicht nach der
  // Datenherkunft: oben das Haus mit Anschrift und Telefon, in der Mitte die
  // drei Zahlen des Aufenthalts (Anreise mit Check-in, Naechte, Abreise mit
  // Check-out), unten was zum Zimmer gehoert. Die Infobox ist auf diesem
  // Reiter abbestellt - der Schalter dafuer steht in reise.json.
  //
  // Was NICHT hier steht, fehlt aus einem Grund: gesperrt ist, was nicht
  // oeffentlich einsehbar ist - Auftragsnummer, Preis, Stornofristen, Name.
  // Adresse, Telefon und Zimmerart stehen auf jeder Hotelseite.
  var ho = DATEN.hotel || {};

  // Die Reisedaten kommen ueber ihre id, nicht ueber die Beschriftung: 'feld'
  // ist die Aufschrift der Infobox, und wer sie umbenennt, will Beschriftung
  // aendern - nicht hier eine Zeile verschwinden lassen.
  var reisewert = function (id) {
    var z = (DATEN.reisedaten || []).filter(function (x) { return x.id === id; })[0];
    if (!z) return null;
    // "xx" ist eine Aussage - unbekannt -, kein fehlender Wert. Es wird als
    // solche gesetzt und nicht stillschweigend weggelassen.
    return { wert: z.wert, offen: z.wert === "xx" };
  };

  (function () {
    var el = document.getElementById("hotel-tafel");
    if (!el) return;

    var feldH = function (kopf, wert, fein) {
      if (!wert) return "";
      return '<div class="platz-feld"><span class="platz-kopf">' + kopf + "</span>"
        + '<b class="platz-wert' + (wert.offen ? " platz-wert--offen" : "") + '">'
        + wert.wert + "</b>"
        + (fein ? '<span class="weg-feld-fein">' + fein + "</span>" : "") + "</div>";
    };

    var zeileH = function (kopf, wert) {
      return wert ? "<dt>" + kopf + "</dt><dd>" + wert + "</dd>" : "";
    };

    var anschrift = [ho.adresse, ho.stadtteil].filter(Boolean).join(" · ");
    var kenn = zeileH("Zimmer", ho.zimmer)
      + zeileH("Reisende", (reisewert("reisende") || {}).wert);

    el.innerHTML = '<div class="fahrt">'
      + '<div class="fahrt-kopf">'
      +   "<div>"
      +     '<p class="fahrt-richtung">' + (ho.name || "Unterkunft unbekannt") + "</p>"
      +     (anschrift ? '<p class="fahrt-tag">' + anschrift + "</p>" : "")
      +   "</div>"
      +   (ho.telefon
            ? '<a class="hotel-tel" href="tel:' + ho.telefon.replace(/\s/g, "") + '">'
              + ho.telefon + "</a>"
            : "")
      + "</div>"
      + '<div class="platz-felder platz-felder--um">'
      +   feldH("Anreise", reisewert("hinfahrt"), ho.checkin ? "Check-in " + ho.checkin : "")
      +   feldH("Nächte", reisewert("naechte"), "")
      +   feldH("Abreise", reisewert("rueckfahrt"), ho.checkout ? "Check-out " + ho.checkout : "")
      + "</div>"
      + (kenn ? '<dl class="kenn hotel-kenn">' + kenn + "</dl>" : "")
      + '<p class="tafel-fuss">' + (ho.quelle || "")
      + " · Preis, Auftragsnummer und Stornofristen stehen nicht auf dieser Seite.</p>"
      + "</div>";
  }());

  // --- Bahn-Reiter ----------------------------------------------------------
  // Ein Unterknopf je Fahrt statt einer durchlaufenden Tafel: Hin- und
  // Rueckfahrt beantworten verschiedene Fragen und werden an verschiedenen
  // Tagen gebraucht. Untereinander gestellt las man am Reisetag an der
  // gesuchten Haelfte vorbei.
  //
  // Die Knoepfe kommen aus reise.json, nicht aus dem HTML - eine dritte Fahrt
  // soll ein Datensatz sein und keine Skriptaenderung. Dieselbe Begruendung
  // wie beim Hauptmenue.
  var bahnDaten = DATEN.bahn_reise || {};
  var bahnFahrten = bahnDaten.fahrten || [];
  var bahnAlt = bahnDaten.alternativen || null;

  var bahnMarke = function (status, text) {
    var klasse = status === "gebucht" ? "zustand--fest"
               : status === "ausgefallen" ? "zustand--weg"
               : "zustand--offen";
    return '<span class="zustand ' + klasse + '">' + (text || status) + "</span>";
  };

  // Das Streckenband. Eine Fahrt IST eine Folge, und eine Folge liest man als
  // Linie - eine Tabelle beantwortet "wann bin ich wo" erst, nachdem man alle
  // Zeilen gelesen hat. Zwischenhalte stehen leiser: sie sind Orientierung,
  // kein Ziel. Ohne diese Abstufung wiegt der Ausstieg so viel wie Guenzburg.
  var bahnBand = function (halte) {
    if (!halte || !halte.length) return "";
    return '<ol class="band">' + halte.map(function (h, i) {
      var art = h.unbekannt ? "band-halt--luecke"
              : h.zwischen ? "band-halt--zwischen"
              : i === 0 ? "band-halt--start" : "band-halt--ziel";
      var zeit = h.unbekannt ? ""
        : h.an && h.ab ? h.an + '<span class="band-bis">–</span>' + h.ab
        : h.ab || h.an || "";
      return '<li class="band-halt ' + art + '">'
        + '<span class="band-zeit">' + zeit + "</span>"
        + '<span class="band-punkt" aria-hidden="true"></span>'
        + '<span class="band-ort">' + h.ort + "</span>"
        + '<span class="band-gleis">' + (h.gleis ? "Gl. " + h.gleis : "") + "</span>"
        + "</li>";
    }).join("") + "</ol>";
  };

  // Die Reservierung als Schild, nicht als Zeile in einer Liste: Wagen und
  // Platz sind das Einzige auf diesem Reiter, das man im Zug im Stehen mit
  // einem Blick treffen muss. Grosse Ziffern sind hier Funktion, nicht Zierde.
  var bahnPlatz = function (r) {
    if (!r) return "";
    var feld = function (kopf, wert) {
      return wert ? '<div class="platz-feld"><span class="platz-kopf">' + kopf + "</span>"
        + '<b class="platz-wert">' + wert + "</b></div>" : "";
    };
    var fuss = [r.bereich, r.plaetze, r.hinweis].filter(Boolean).join(" · ");
    return '<div class="platz">'
      + '<div class="platz-felder">' + feld("Wagen", r.wagen) + feld("Plätze", r.platz) + "</div>"
      + (fuss ? '<p class="platz-fuss">' + fuss + "</p>" : "")
      + "</div>";
  };

  var bahnTicket = function (t) {
    if (!t) return "";
    var z = [["Tarif", t.art], ["Gilt für", t.personen], ["Preis", t.preis],
             ["Gültig", t.gueltig], ["Zugbindung", t.bindung]];
    return '<dl class="kenn">' + z.filter(function (p) { return p[1]; }).map(function (p) {
      return "<dt>" + p[0] + "</dt><dd>" + p[1] + "</dd>";
    }).join("") + "</dl>";
  };

  var bahnFahrtHtml = function (f) {
    return '<div class="fahrt">'
      + '<div class="fahrt-kopf">'
      +   '<div><p class="fahrt-richtung">' + f.richtung + "</p>"
      +   '<p class="fahrt-tag">' + f.tag + (f.zug ? " · " + f.zug : "")
      +     (f.dauer ? " · " + f.dauer : "") + "</p></div>"
      +   bahnMarke(f.status, f.status_text)
      + "</div>"
      + (f.meldung ? '<p class="fahrt-meldung fahrt-meldung--' + f.status + '">'
          + f.meldung + "</p>" : "")
      + bahnBand(f.halte)
      + '<div class="fahrt-kacheln">'
      +   (f.ticket ? '<section class="kachel"><h3 class="kachel-titel">Ticket</h3>'
          + bahnTicket(f.ticket) + "</section>" : "")
      +   (f.reservierung ? '<section class="kachel"><h3 class="kachel-titel">Reservierung</h3>'
          + bahnPlatz(f.reservierung) + "</section>" : "")
      + "</div></div>";
  };

  // Umsteigezeit als Balken gegen eine feste 60-Minuten-Skala. Eine blosse Zahl
  // ("22 min") laesst sich nicht vergleichen, ohne sie zu lesen; nebeneinander
  // liegende Balken schon. Die Schwelle ist die Vorgabe fuer diese Reise:
  // unter 20 Minuten wird nicht umgestiegen.
  var bahnUmstieg = function (u) {
    var breite = Math.max(4, Math.min(u.minuten, 60) / 60 * 100);
    return '<li class="ums' + (u.minuten < 20 ? " ums--knapp" : "") + '">'
      + '<span class="ums-ort">' + u.ort + "</span>"
      + '<span class="ums-balken" aria-hidden="true"><i style="width:'
      +   breite.toFixed(0) + '%"></i></span>'
      + '<span class="ums-zahl">' + u.minuten + " min</span></li>";
  };

  var bahnAltHtml = function (v, i) {
    var abschnitte = (v.abschnitte || []).map(function (a) {
      return '<li class="abs"><b class="abs-zug">' + a.zug + "</b>"
        + '<span class="abs-weg">' + a.von + " " + a.ab + " → " + a.nach + " " + a.an + "</span>"
        + '<span class="abs-gleis">' + (a.gleis ? "Gl. " + a.gleis : "") + "</span></li>";
    }).join("");
    var umstiege = (v.umstieg || []).map(bahnUmstieg).join("");
    return '<details class="alt"' + (i === 0 ? " open" : "") + ">"
      + '<summary class="alt-kopf">'
      +   '<span class="alt-zeit"><b>' + v.ab + "</b><i>→</i><b>" + v.an + "</b></span>"
      // Die erwartete Ankunft steht NEBEN der planmaessigen, nicht statt ihr.
      // Sie ist eine Rechnung aus dem Puenktlichkeitsmittel des Hauptzugs und
      // damit weicher als der Fahrplan - ersetzte sie ihn, saehe eine Schaetzung
      // aus wie eine Abfahrtstafel.
      +   (v.erwartet ? '<span class="alt-real">real ~' + v.erwartet + "</span>" : "")
      +   '<span class="alt-dauer">' + v.dauer + "</span>"
      +   '<span class="alt-ums">' + (v.umstiege === 0 ? "direkt"
          : v.umstiege + (v.umstiege === 1 ? " Umstieg" : " Umstiege")) + "</span>"
      // Die Flagge ist standardmaessig NEUTRAL. Traegt sie immer die Warnfarbe,
      // sieht "beste Reserve" aus wie ein Problem - und die Farbe sagt dann
      // nichts mehr, weil sie ueberall steht.
      +   (v.hinweis ? '<span class="alt-flagge'
          + (v.hinweis_warn ? " alt-flagge--warn" : "") + '">' + v.hinweis + "</span>" : "")
      + "</summary>"
      + '<div class="alt-inhalt">'
      +   (abschnitte ? '<ol class="abschnitte">' + abschnitte + "</ol>" : "")
      +   (umstiege ? '<h4 class="alt-untertitel">Umsteigezeit</h4><ul class="umse">'
          + umstiege + "</ul>" : "")
      +   (v.robust ? '<p class="alt-robust">' + v.robust + "</p>" : "")
      + "</div></details>";
  };

  var bahnAltAnsicht = function () {
    // Kein erfundener Fuellstand: solange die Abfrage nicht gelaufen ist, sagt
    // der Reiter das. Ein Platzhalter, der wie eine Auswahl aussieht, wird
    // nicht mehr geprueft - genau davor warnt die Projektregel.
    if (!bahnAlt || !(bahnAlt.liste || []).length) {
      return '<p class="alt-leer">Noch nicht abgefragt. Die Alternativen kommen aus einer '
        + "Fahrplanabfrage und stehen hier, sobald sie gelaufen ist.</p>";
    }
    return '<div class="fahrt">'
      // Die Lage zuerst, vor den Regeln und der Liste. Wer nur die sechs
      // Verbindungen sieht, haelt den Ausfall fuer ein Zugproblem - er ist ein
      // Streckenproblem, und das aendert, worauf man am Reisetag achtet.
      + (bahnAlt.lage ? '<p class="fahrt-meldung fahrt-meldung--ausgefallen">'
          + bahnAlt.lage + "</p>" : "")
      + (bahnAlt.regeln ? '<ul class="regeln">' + bahnAlt.regeln.map(function (r) {
          return "<li>" + r + "</li>"; }).join("") + "</ul>" : "")
      + bahnAlt.liste.map(bahnAltHtml).join("")
      + (bahnAlt.ausgeschieden ? '<p class="alt-raus"><b>Geprüft und ausgeschieden.</b> '
          + bahnAlt.ausgeschieden + "</p>" : "")
      + (bahnAlt.stand ? '<p class="alt-stand">' + bahnAlt.stand + "</p>" : "")
      + "</div>";
  };

  (function () {
    var navB = document.getElementById("bahn-reiter");
    var zielB = document.getElementById("bahn-tafel");
    if (!navB || !zielB || !bahnFahrten.length) return;

    // 'Alternativen' erscheint nur, wenn eine Fahrt sie braucht. Ein Knopf, der
    // bei heiler Buchung leer ins Nichts fuehrt, kostet Vertrauen in die
    // anderen.
    var braucht = bahnFahrten.some(function (f) { return f.status === "ausgefallen"; });
    var eintraege = bahnFahrten.map(function (f) {
      return { id: f.id, label: f.label, warn: f.status === "ausgefallen", bau: function () {
        return bahnFahrtHtml(f); } };
    });
    if (braucht) {
      eintraege.push({ id: "alt", label: "Alternativen", bau: bahnAltAnsicht });
    }

    // Aufgeschlagen wird die Fahrt, die etwas von einem WILL - die ausgefallene.
    // Sonst die erste. Ein Reiter, der mit dem heilen Teil beginnt, versteckt
    // das Problem hinter einem Klick.
    var offen = (bahnFahrten.filter(function (f) { return f.status === "ausgefallen"; })[0]
      || bahnFahrten[0]).id;
    var knoepfeB = [];
    var zeige = function (id) {
      offen = id;
      knoepfeB.forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.id === id ? "true" : "false");
      });
      var e = eintraege.filter(function (x) { return x.id === id; })[0];
      // .grund-fuss, nicht .tafel-fuss: der Fuss steht HIER auf dem dunklen
      // Grund und nicht auf der hellen Tafel. Mit .tafel-fuss mass
      // pruef-farben.mjs 2,16:1 - dieselbe Verwechslung, die stil.css schon
      // einmal dokumentiert hat.
      zielB.innerHTML = (e ? e.bau() : "")
        + '<p class="grund-fuss">' + (bahnDaten.quelle || "")
        + " · Auftragsnummer und Name stehen nicht auf dieser Seite.</p>";
    };
    eintraege.forEach(function (e) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "unterknopf" + (e.warn ? " unterknopf--warn" : "");
      b.dataset.id = e.id;
      b.setAttribute("aria-pressed", e.id === offen ? "true" : "false");
      b.textContent = e.label;
      b.addEventListener("click", function () { zeige(e.id); });
      knoepfeB.push(b);
      navB.appendChild(b);
    });
    zeige(offen);
  }());

  // --- Weg vom Hauptbahnhof zum Hotel ---------------------------------------
  // Die erste Frage des Ankunftstags: man steht am Hbf und will wissen, was man
  // nimmt. Ein Unterknopf je Verkehrsmittel statt einer Liste - schnell,
  // oberirdisch und ohne Ticket sind drei verschiedene Wuensche, und wer mit
  // zwei Koffern dasteht, hat einen anderen als der, der Zeit hat.
  //
  // KEINE Uhrzeiten im Band, anders als beim Bahn-Reiter. Die Zeiten stammen
  // aus einer Stichprobe und saehen aus wie eine gebuchte Fahrt; gebraucht wird
  // ein Rezept, das den ganzen Tag gilt. Wie oft etwas faehrt, steht daneben
  // als gemessener Takt.
  //
  // Band und Karte sprechen dieselbe Sprache: der Balken links im Band traegt
  // dieselbe Farbe und dieselbe Strichart wie die Linie auf der Karte. Zwei
  // Darstellungen desselben Wegs, die verschieden aussehen, liest man als zwei
  // Wege.
  var karteWeg = null;
  // Der Ausschnitt wird NICHT beim Zeichnen gesetzt, sondern erst, wenn der
  // Reiter offen ist. Leaflet vermisst seinen Behaelter beim Anlegen; in einem
  // [hidden]-Abschnitt ist der 0 px breit, und fitBounds rechnet daraus die
  // groesstmoegliche Zoomstufe. Die Karte stand danach auf Zoom 19 mitten im
  // Nichts - und pruef-farben.mjs meldete den ausgegrauten Plusknopf mit 1,75:1,
  // eine Meldung, die auf die Farbe zeigt und die Ursache verschweigt.
  var karteWegAnpassen = null;
  (function () {
    var w = DATEN.hotelweg;
    var navW = document.getElementById("weg-reiter");
    var zielW = document.getElementById("weg-tafel");
    var behaelter = document.getElementById("karte-weg");
    if (!w || !w.varianten || !w.varianten.length || !navW || !zielW || !behaelter) return;

    // Die Farben sind geliehen, nicht neu erfunden - dieselben, die die
    // Verkehrsmittel auf den anderen beiden Karten schon tragen.
    var MITTEL = {
      fuss:  { label: "zu Fuss", farbe: "--tinte-leise", kuerzel: null },
      sbahn: { label: "S-Bahn",  farbe: "--m-sbahn",     kuerzel: "S" },
      ubahn: { label: "U-Bahn",  farbe: "--m-ubahn",     kuerzel: "U" },
      tram:  { label: "Tram",    farbe: "--m-tram",      kuerzel: "T" },
      bus:   { label: "Bus",     farbe: "--m-ankunft",   kuerzel: "B" }
    };
    var mittel = function (art) { return MITTEL[art] || MITTEL.fuss; };
    // Das Verkehrsmittel, nach dem die Variante heisst: der erste Abschnitt,
    // der kein Fussweg ist. Beim reinen Fussweg bleibt es dabei.
    var hauptmittel = function (v) {
      var f = v.abschnitte.filter(function (a) { return a.art !== "fuss"; })[0];
      return f ? f.art : "fuss";
    };

    // --- Karte -------------------------------------------------------------
    // Eigene Karte, nicht die Umgebungskarte mit einer Ebene mehr: die
    // Umgebungskarte zeigt einen Kilometer und beantwortet "was ist nebenan",
    // dieser Weg ist dreieinhalb lang. In einem Ausschnitt, der beides fasst,
    // waere keine der beiden Fragen mehr gut beantwortet.
    karteWeg = L.map("karte-weg", { scrollWheelZoom: true })
      .setView([w.nach.lat, w.nach.lon], 14);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(karteWeg);
    // Die Namen der Ein- und Ausstiege stehen dauerhaft an der Marke: auf einer
    // Karte mit vier Marken ist nichts zu verdecken, und der Name IST hier die
    // Auskunft - eine Marke, die man erst anklicken muss, verschweigt sie.
    behaelter.classList.add("zeigt-namen");
    var wegEbene = L.layerGroup().addTo(karteWeg);

    var zeichne = function (v) {
      wegEbene.clearLayers();
      var punkte = [[w.von.lat, w.von.lon], [w.nach.lat, w.nach.lon]];

      v.abschnitte.forEach(function (a) {
        if (!a.geo || !a.geo.length) return;
        punkte = punkte.concat(a.geo);
        var fuss = a.art === "fuss";
        // Weisse Fassung unter der Linie. Ohne sie haengt der Kontrast am
        // Kartenausschnitt: dieselbe Farbe traegt ueber einem Park und geht
        // ueber einer Hauptstrasse unter. Ein Wert, der vom Ausschnitt abhaengt,
        // ist nicht pruefbar.
        L.polyline(a.geo, { color: token("--saum"), weight: fuss ? 9 : 12,
                            opacity: 0.95, lineCap: "round", lineJoin: "round",
                            interactive: false }).addTo(wegEbene);
        L.polyline(a.geo, { color: token(mittel(a.art).farbe), weight: fuss ? 5 : 7,
                            dashArray: fuss ? "1 10" : null,
                            lineCap: "round", lineJoin: "round" })
          .addTo(wegEbene)
          .bindPopup("<h3>" + (fuss ? "Fußweg" : (a.linie || mittel(a.art).label)) + "</h3>"
            + "<p>" + a.minuten + " min"
            + (fuss && a.meter ? " · " + a.meter + " m" : "")
            + (a.zwischenhalte && a.zwischenhalte.length
                ? " · " + (a.zwischenhalte.length + 1) + " Halte" : "")
            + "</p>"
            + '<p class="popup-fein">' + (a.von || w.von.name) + " → "
            + (a.nach || w.nach.name) + "</p>");
      });

      // Ein- und Ausstieg als Halt-Marke. Die Zwischenhalte bekommen KEINE:
      // ihre Koordinaten stehen nicht in den Daten, und eine auf die Linie
      // geschaetzte Marke waere erfunden - sie saehe genauso aus wie eine
      // gemessene. Ihre Namen stehen im Band.
      v.abschnitte.forEach(function (a) {
        if (a.art === "fuss" || !a.geo || !a.geo.length) return;
        [[a.geo[0], a.von], [a.geo[a.geo.length - 1], a.nach]].forEach(function (p) {
          if (!p[1]) return;
          L.marker(p[0], {
            icon: L.divIcon({ className: "",
              html: '<i class="halt-pin ' + a.art + '">' + mittel(a.art).kuerzel + "</i>",
              iconSize: [26, 26], iconAnchor: [13, 13] }),
            title: p[1], keyboard: false
          }).addTo(wegEbene)
            // direction "auto" statt "right": Leaflet legt das Schild auf die
            // Seite, auf der Platz ist. Fest rechts ragte "Rosenheimer Platz"
            // auf einem 390er Schirm ueber die Kartenkante - der Halt war zu
            // sehen, sein Name nicht.
            .bindTooltip(p[1], { permanent: true, direction: "auto", offset: [14, 0],
                                 className: "marke-name", interactive: false });
        });
      });

      L.marker([w.von.lat, w.von.lon], {
        icon: L.divIcon({ className: "", html: ortSymbol("ankunft", false),
                          iconSize: [34, 34], iconAnchor: [17, 17] }),
        title: w.von.name, riseOnHover: true
      }).addTo(wegEbene).bindPopup("<h3>" + w.von.name + "</h3>"
        + "<p>Hier kommt der Zug an — der Start dieses Wegs.</p>" + mapsLink(w.von));

      L.marker([w.nach.lat, w.nach.lon], {
        icon: L.divIcon({ className: "", html: ortSymbol("unterkunft", true),
                          iconSize: [40, 40], iconAnchor: [20, 20] }),
        title: w.nach.name, riseOnHover: true
      }).addTo(wegEbene).bindPopup("<h3>" + w.nach.name + "</h3>"
        + "<p>Das Ziel dieses Wegs.</p>" + mapsLink(w.nach));

      wegBereich = L.latLngBounds(punkte);
      karteWegAnpassen();
    };

    var wegBereich = null;
    karteWegAnpassen = function () {
      // Ein Behaelter ohne Breite ist nicht vermessen, sondern verdeckt. Ein
      // Ausschnitt, der daraus gerechnet wird, ist erfunden.
      if (!wegBereich || behaelter.clientWidth < 40) return;
      karteWeg.fitBounds(wegBereich, { padding: [32, 32] });
    };

    // --- Band ---------------------------------------------------------------
    // Jede Zeile ist EIN Abschnitt und traegt den Halt, an dem er beginnt.
    // Getrennte Zeilen fuer Halte und Fahrten haetten in der Spur an jedem Halt
    // eine Naht hinterlassen, und eine unterbrochene Linie liest man als
    // unterbrochenen Weg.
    var zeile = function (klasse, kopf, inhalt) {
      return '<li class="' + klasse + '">'
        + '<span class="weg-spur" aria-hidden="true"></span>'
        + '<span class="weg-haupt"><b class="weg-ort">' + kopf + "</b>"
        + (inhalt || "") + "</span></li>";
    };

    var bandHtml = function (v) {
      var zeilen = v.abschnitte.map(function (a, i) {
        var start = i === 0 ? w.von.name : (a.von || "—");
        if (a.art === "fuss") {
          return zeile("weg-teil weg-teil--fuss", start,
            '<span class="weg-tat"><b>' + a.minuten + " min</b> zu Fuß"
            + (a.meter ? " · " + a.meter + " m" : "") + "</span>");
        }
        // Alle gemessenen Linien, nicht nur die der Beispielfahrt: an diesem
        // Bahnsteig faehrt jede von ihnen dorthin, und wer auf "S5" wartet,
        // laesst drei Zuege durch, die genauso passen.
        var marken = (v.linien && v.linien.length ? v.linien : [a.linie])
          .filter(Boolean).map(function (l) { return linienMarke(l, false); }).join("");
        var halte = a.zwischenhalte || [];
        return zeile("weg-teil weg-teil--" + a.art, start,
          '<span class="weg-marken">' + marken + "</span>"
          + '<span class="weg-tat"><b>' + a.minuten + " min</b> · "
          + (halte.length + 1) + " Halte</span>"
          + (halte.length ? '<span class="weg-fein">über ' + halte.join(" · ") + "</span>" : ""));
      });
      zeilen.push(zeile("weg-ziel", w.nach.name, ""));
      return '<ol class="weg">' + zeilen.join("") + "</ol>";
    };

    var feld = function (kopf, wert, fein) {
      return '<div class="platz-feld"><span class="platz-kopf">' + kopf + "</span>"
        + '<b class="platz-wert">' + wert + "</b>"
        + (fein ? '<span class="weg-feld-fein">' + fein + "</span>" : "") + "</div>";
    };

    var tafelHtml = function (v) {
      var takt = v.takt
        ? feld("Takt", "alle " + (v.takt.min === v.takt.max
            ? v.takt.min : v.takt.min + "–" + v.takt.max) + " min",
            v.takt.abfahrten + " Fahrten zwischen " + v.takt.fenster)
        : feld("Takt", "jederzeit", "kein Fahrplan nötig");
      return '<div class="fahrt">'
        + '<div class="platz-felder platz-felder--um">'
        + feld("Dauer", v.minuten + " min",
               // "ohne Umstieg" ueber einem reinen Fussweg beantwortet eine
               // Frage, die dort niemand stellt.
               hauptmittel(v) === "fuss" ? "durchgehend"
                 : v.umstiege === 0 ? "ohne Umstieg"
                 : v.umstiege + " Umstieg" + (v.umstiege > 1 ? "e" : ""))
        + feld("davon zu Fuß", v.fuss_minuten + " min", v.fuss_meter + " m")
        + takt
        + "</div>"
        + bandHtml(v)
        + (v.richtungen && v.richtungen.length
            ? '<p class="tafel-fein"><strong>Am Bahnsteig:</strong> Richtung '
              + v.richtungen.join(", ") + ".</p>"
            : "")
        + '<p class="tafel-fuss">' + v.zweck + "</p>"
        + "</div>";
    };

    // --- Unterknoepfe -------------------------------------------------------
    // Die Marke im Knopf ist ein Strich in der Farbe des Verkehrsmittels und in
    // derselben Strichart wie auf der Karte. Damit ist der Knopf zugleich die
    // Legende der Karte - eine zweite Legende darunter waere dieselbe Auskunft
    // ein zweites Mal.
    var offenW = (w.varianten.filter(function (v) { return v.empfohlen; })[0]
      || w.varianten[0]).id;
    var knoepfeW = [];
    var zeigeW = function (id) {
      offenW = id;
      knoepfeW.forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.id === id ? "true" : "false");
      });
      var v = w.varianten.filter(function (x) { return x.id === id; })[0];
      if (!v) return;
      zielW.innerHTML = tafelHtml(v);
      zeichne(v);
    };

    w.varianten.forEach(function (v) {
      var art = hauptmittel(v);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "unterknopf";
      b.dataset.id = v.id;
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = '<span class="unter-marke" aria-hidden="true">'
        + '<span class="netz-strich weg-strich weg-strich--' + art + '"></span></span>'
        + "<span>" + v.label + "</span>"
        + '<span class="unter-zahl">' + v.minuten + " min"
        + (v.empfohlen ? " · schnellste" : "") + "</span>";
      b.addEventListener("click", function () { zeigeW(v.id); });
      knoepfeW.push(b);
      navW.appendChild(b);
    });

    var stich = new Date(w.stichzeit);
    document.getElementById("weg-fuss").innerHTML =
      "<strong>Gemessen, nicht geschätzt.</strong> Je Variante eine eigene Abfrage mit "
      + "festgelegtem Verkehrsmittel; Dauer, Halte und der gezeichnete Verlauf stammen aus "
      + "derselben Antwort — die Linie auf der Karte ist der Weg, den der Router gerechnet "
      + "hat, keine nachgezogene Skizze. Stichzeit "
      + stich.toLocaleString("de-DE", { timeZone: "Europe/Berlin", weekday: "short",
          day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
      + " Uhr. <strong>Was fehlt:</strong> Fahrpreise — die Abfrage kennt keine Tarife; und die "
      + "vollständige Linienliste — gezeigt sind die Linien, die im gemessenen Fenster "
      + "tatsächlich angeboten wurden, nicht zwingend alle, die diese Strecke fahren. "
      + "Für einen Tag in der Zukunft liegt nur der Plan vor, keine Echtzeit. Quelle: "
      + w.quelle.name + ", abgerufen " + deutsch(w.quelle.abgerufen) + ".";

    zeigeW(offenW);
  }());

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
  var karteInnen = null;
  (function () {
    var g = DATEN.gastro;
    if (!g || !g.orte.length || !document.getElementById("karte-innenstadt")) return;

    var LABEL = {}, ZEICHEN = {};
    GASTRO.forEach(function (k) { LABEL[k.id] = k.label; ZEICHEN[k.id] = k.symbol; });
    // Dieselben Bezeichnungen wie in ARTEN auf der Stadtkarte - "Museum" neben
    // einer 4 liest sich wie ein Fehler.
    LABEL.wahrzeichen = ARTEN.wahrzeichen.label; LABEL.museum = ARTEN.museum.label;
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

    // Alles, was KEIN Sieben-Tage-Feld ist, gilt als unbekannt. Hier stand bis
    // zum 09.09.2026 ein Freitext-Zerleger, der Formen wie
    // "Mo, Di, Fr 8–17, Sa 9–17; Mi, Do, So geschlossen" auseinandernahm - das
    // Komma trennte dort Tage UND Abschnitte. Er lief richtig, war aber nur
    // noetig, weil die Zeiten von Hand abgeschrieben waren.
    //
    // Seit alle drei Bestaende ihre Zeiten aus der Places API beziehen, liefern
    // sie dasselbe Sieben-Zeilen-Feld, und der Zerleger hatte keinen einzigen
    // Fall mehr. Er ist darum weg: der sicherste Parser ist der, den man nicht
    // braucht. Kaeme wieder ein Freitext, stuende die Woche auf unbekannt -
    // sichtbar, nicht stillschweigend falsch.
    var woche = function (o) {
      return Array.isArray(o.oeffnungszeiten) ? ausArray(o.oeffnungszeiten)
           : [null, null, null, null, null, null, null];
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

    // KEINE Koordinaten-Entschuldigungen mehr. Bis zum 09.09.2026 stand an
    // dreizehn Orten ein Satz wie "Der Punkt trifft das Haus, nicht den Laden
    // darin" - weil die Koordinaten aus Nominatim kamen, einer ADRESSSUCHE.
    // Seither loesen hol-fruehstueck.mjs und hol-burger.mjs ueber die Google
    // Places API auf, die BETRIEBE sucht. Die Warnung ist weg, weil ihr Grund
    // weg ist; das ist der Unterschied zwischen eine Luecke benennen und eine
    // Luecke schliessen.
    //
    // Was BLEIBT, ist die Namensprobe: gefunden_als kommt aus der Antwort,
    // nicht aus der Frage. Steht dort "abweichend", wurde etwas anderes
    // gefunden als gemeint war, und das gehoert auf die Seite. Beim Umstellen
    // hat sie einen echten Fehler gefunden - King Loui stand in der Recherche
    // in der Kazmairstrasse, wo heute ein Nudelrestaurant sitzt.
    var namensWarnung = function (o) {
      return o.namensprobe === "abweichend"
        ? "Gesucht wurde „" + o.name + "“, gefunden hat Google „" + o.gefunden_als
          + "“ — ob es derselbe Betrieb ist, ist nicht geprüft."
        : "";
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
       namensWarnung(o), o.adress_hinweis, o.stadtteil_hinweis].forEach(function (wn) {
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
    // Die Zeilen liegen in einem eigenen Behaelter INNERHALB der Tafel. Grund:
    // beim Kategoriewechsel wird der Inhalt ueberblendet, und die Kopfzeile mit
    // den Sortierknoepfen soll dabei stehen bleiben - eine Deckkraft auf der
    // ganzen Tafel nimmt sie mit.
    var zeilenEl = document.createElement("div");
    zeilenEl.className = "katalog-zeilen";
    tafelEl.appendChild(zeilenEl);
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
        namensWarnung(o), o.adress_hinweis].filter(Boolean);

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

      zeilenEl.appendChild(d);
      e.el = d;
    });

@@UMSCHALTEN@@

    // ===== Sortieren statt Suchen ==========================================
    // Hier stand bis zum 09.09.2026 ein Suchfeld. Es ist raus: bei 59 Zeilen,
    // die man ganz sieht, beantwortet Sortieren die Frage besser als Tippen -
    // "welches ist das naechste", "welches hat die beste Note", "was ist in der
    // Au" sind Ordnungen, keine Suchbegriffe. Wer einen Namen kennt, findet ihn
    // im Browser mit Strg+F, und zwar in derselben Liste.
    //
    // JEDE Spalte der Zeile ist ein Schluessel, und jeder Schluessel hat eine
    // Richtung, die als Pfeil danebensteht. Eine Sortierung, die man nicht
    // sieht, ist keine - genau das war der Zustand vorher: der Katalog war nach
    // Kueche und Note geordnet, und nichts sagte es.
    var SORTIER = [
      { id: "kategorie", label: "Kategorie", ab: false,
        wert: function (e) { return reihenfolge.indexOf(e.gruppe); },
        zweit: function (e) { return -(e.note || 0); } },
      { id: "note", label: "Note", ab: true,
        // Ohne Note ans Ende, in BEIDE Richtungen: ein fehlender Wert ist kein
        // schlechter Wert. Eine geratene Null saehe aus wie eine Messung.
        wert: function (e) { return e.note || null; },
        zweit: function (e) { return e.o.name; } },
      { id: "entfernung", label: "Entfernung", ab: false,
        wert: function (e) { return e.m; },
        zweit: function (e) { return e.o.name; } },
      { id: "stadtteil", label: "Stadtteil", ab: false,
        wert: function (e) { return e.o.stadtteil || null; },
        zweit: function (e) { return e.o.name; } },
      { id: "offen", label: "Tage offen", ab: true,
        wert: function (e) {
          if (!e.w) return null;
          var n = e.w.filter(function (sp) { return sp && sp.length; }).length;
          return e.w.every(function (sp) { return sp === null; }) ? null : n;
        },
        zweit: function (e) { return e.o.name; } },
      { id: "name", label: "Name", ab: false,
        wert: function (e) { return e.o.name; }, zweit: function () { return 0; } }
    ];
    var reihenfolge = REITER[0].gruppen;
    var sortAktiv = "kategorie";
    var sortAb = false;

    var vergleiche = function (a, b, s) {
      var wa = s.wert(a), wb = s.wert(b);
      // null heisst UNBEKANNT und steht immer hinten, egal wie herum sortiert
      // wird - sonst wandert "keine Note" bei aufsteigender Sortierung nach
      // vorn und sieht aus wie der schlechteste Wert.
      if (wa === null && wb === null) return 0;
      if (wa === null) return 1;
      if (wb === null) return -1;
      var d = typeof wa === "string" ? wa.localeCompare(wb, "de") : wa - wb;
      if (d) return sortAb ? -d : d;
      var za = s.zweit(a), zb = s.zweit(b);
      return typeof za === "string" ? za.localeCompare(zb, "de") : za - zb;
    };

    var leerEl = document.getElementById("gastro-leer");
    var sortKnoepfe = [];

    // Die KARTE haengt an der Legende, die LISTE am Untermenue - zwei Zustaende,
    // zwei Steuerungen. Vorher schaltete das Untermenue beides, und die Legende
    // war halb Beschriftung, halb Schalter: ein Klick auf "Frühstück" tat dort
    // nichts, ein Klick auf "U-Bahn" schon. Das ist kein Bedienelement, das ist
    // ein Ratespiel.
    var kartenAn = {};
    REITER[0].gruppen.forEach(function (g) { kartenAn[g] = true; });

    function karteNeu() {
      alle.forEach(function (e) {
        if (kartenAn[e.gruppe]) {
          if (!ebene.hasLayer(e.marke)) ebene.addLayer(e.marke);
        } else if (ebene.hasLayer(e.marke)) {
          ebene.removeLayer(e.marke);
        }
      });
    }

    function neuZeichnen() {
      var reiter = REITER.filter(function (r) { return r.id === reiterAktiv; })[0];
      var s = SORTIER.filter(function (x) { return x.id === sortAktiv; })[0];
      var sichtbar = [];
      var soll = new Map();
      alle.forEach(function (e) {
        var passt = reiter.gruppen.indexOf(e.gruppe) >= 0;
        soll.set(e.el, passt);
        if (passt) sichtbar.push(e);
      });

      umschalten(soll, function () {
        // Sortiert wird der ganze Bestand, nicht nur das Sichtbare: sonst
        // springen die ausgeblendeten Zeilen beim naechsten Reiterwechsel an
        // eine andere Stelle als erwartet.
        alle.slice().sort(function (a, b) { return vergleiche(a, b, s); })
          .forEach(function (e) { zeilenEl.appendChild(e.el); });
      });

      sortKnoepfe.forEach(function (b) {
        var an = b.dataset.id === sortAktiv;
        b.setAttribute("aria-pressed", an ? "true" : "false");
        b.querySelector(".sort-pfeil").textContent = an ? (sortAb ? "▼" : "▲") : "";
      });

      leerEl.hidden = sichtbar.length > 0;
      if (!sichtbar.length) leerEl.textContent = "Unter " + reiter.label + " liegt hier nichts.";
    }

    // Die Leiste sitzt IM Katalog als seine Kopfzeile. Ausgerichtet auf die
    // Spalten wird sie NICHT: die Zeile bricht unter 680 px auf drei Zeilen um,
    // und eine Kopfzeile, die dort ueber der falschen Spalte steht, ist
    // schlimmer als gar keine.
    var kopfEl = document.createElement("div");
    kopfEl.className = "katalog-kopf";
    kopfEl.innerHTML = '<span class="katalog-kopf-label">Sortieren nach</span>';
    SORTIER.forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sortknopf";
      b.dataset.id = s.id;
      b.setAttribute("aria-pressed", s.id === sortAktiv ? "true" : "false");
      b.innerHTML = s.label + ' <span class="sort-pfeil" aria-hidden="true"></span>';
      b.addEventListener("click", function () {
        // Zweiter Klick auf dieselbe Spalte dreht die Richtung um. Ein Wechsel
        // auf eine andere startet mit der Richtung, die dort sinnvoll ist:
        // Noten von oben, Entfernungen von nah.
        if (sortAktiv === s.id) sortAb = !sortAb;
        else { sortAktiv = s.id; sortAb = s.ab; }
        neuZeichnen();
      });
      sortKnoepfe.push(b);
      kopfEl.appendChild(b);
    });
    tafelEl.insertBefore(kopfEl, tafelEl.firstChild);   // Kopfzeile vor die Zeilen

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
        neuZeichnen();
      });
      knoepfeI.push(b);
      navEl.appendChild(b);
    });

    // ===== Die Kartenlegende: sieben Zeichen, sieben Schalter ==============
    // JEDER Eintrag schaltet seine Ebene. Vorher waren fuenf davon nur
    // Beschriftung und zwei Schalter - ein Klick auf "Frühstück" tat nichts,
    // einer auf "U-Bahn" schon. Gleiche Form, verschiedenes Verhalten: das ist
    // kein Bedienelement, sondern ein Ratespiel.
    //
    // Was NICHT hierher gehoert, steht jetzt bei der Tabelle: Wochenstreifen,
    // Notenachse und Stufenskala kommen auf der Karte gar nicht vor, und
    // schalten laesst sich nach ihnen erst recht nichts.
    var ulI = document.getElementById("legende-innenstadt");

    var schalter = function (markeHtml, text, zahl, um) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "filter";
      b.setAttribute("aria-pressed", "true");
      b.innerHTML = '<span class="legende-marke" aria-hidden="true">' + markeHtml + "</span>"
        + '<span class="filter-text">' + text
        + (zahl ? ' <span class="filter-zahl">' + zahl + "</span>" : "") + "</span>";
      b.addEventListener("click", function () {
        var jetzt = b.getAttribute("aria-pressed") === "true";
        b.setAttribute("aria-pressed", jetzt ? "false" : "true");
        um(!jetzt);
      });
      li.appendChild(b);
      ulI.appendChild(li);
    };

    // Die Ortsebenen haengen jetzt HIER und nicht mehr am Untermenue: das waehlt
    // aus, was in der LISTE steht. Zwei Zustaende, zwei Steuerungen, und jede
    // sagt in ihrer Ueberschrift, was sie tut.
    GASTRO.concat([{ id: "wahrzeichen", symbol: "wahrzeichen", label: LABEL.wahrzeichen },
                   { id: "museum", symbol: "museum", label: LABEL.museum }])
      .forEach(function (k) {
        var n = alle.filter(function (e) { return e.gruppe === k.id; }).length;
        if (!n) return;
        schalter(ortSymbol(k.symbol, false), k.label, n, function (an) {
          kartenAn[k.id] = an;
          karteNeu();
        });
      });

    // BEIM AUFSCHLAGEN AN. Sie waren bis zum 09.09.2026 aus, mit der Begruendung
    // "37 Marken decken den Ausschnitt zu" - und das war genau der Fehler, den
    // diese Seite an anderer Stelle schon einmal gemacht und aufgeschrieben hat:
    // was man nicht sieht, benutzt man nicht.
    //
    // "S-Bahn / DB" heisst der Knopf, nicht "einblenden": der Aus-Zustand
    // streicht den Text durch, und "einblenden" durchgestrichen liest sich wie
    // "geht nicht" statt wie "ist aus".
    ["sbahn", "ubahn"].forEach(function (art) {
      if (!halteZahl[art]) return;
      halteEbenen[art].addTo(karteInnen);
      schalter('<i class="halt-pin ' + art + '">' + VERKEHR[art].kuerzel + "</i>",
        VERKEHR[art].label, halteZahl[art], function (an) {
          if (an) halteEbenen[art].addTo(karteInnen);
          else karteInnen.removeLayer(halteEbenen[art]);
        });
    });

    // ===== Der Schlüssel zur Tabelle =======================================
    // Er steht BEI der Tabelle, nicht in der Kartenlegende: diese vier Zeichen
    // kommen auf der Karte nicht vor. Reine Beschriftung, kein Schalter - und
    // ohne Rahmen, damit das auch so aussieht. Ein Rahmen verspricht eine
    // Bedienung, die es hier nicht gibt.
    var ulS = document.getElementById("listen-schluessel");
    var lesen = function (markeHtml, text) {
      var li = document.createElement("li");
      li.className = "schluessel-zeichen";
      li.innerHTML = '<span class="legende-marke" aria-hidden="true">' + markeHtml + "</span>"
        + '<span class="filter-text">' + text + "</span>";
      ulS.appendChild(li);
    };
    lesen(streifen([[[480, 1020]], [[480, 1020]], null, [], [[480, 1020]], [[540, 1020]], []], ""),
      "<b>Wochenstreifen</b> Mo–So, oben und unten Mitternacht: Block = offen, "
        + "Strich = zu, Punkte = unbekannt");
    lesen(noteSkala(4.6),
      "<b>Note</b> auf einer Achse von 4,0 bis 5,0 — ein Ausschnitt, weil alle Noten darin liegen");
    lesen(stufenSkala(2, 4),
      "<b>Geflügel</b> in vier Stufen: Schnitzel · Hauptgericht · nur Salat · keins");
    lesen('<span class="legende-kante"></span>',
      "<b>Farbige Kante</b> links an der Zeile: dieselbe Farbe wie das Zeichen der Kategorie");

    karteNeu();
    neuZeichnen();

    // ===== Was unter der Karte und unter der Liste stehen MUSS ==============
    var weit = g.orte.filter(function (o) { return meter(bezug.lat, bezug.lon, o.lat, o.lon) > 3000; });
    // Hier stand ein Vorspann: "Ausschnitt: Innenstadt um den Marienplatz."
    // Er ist raus - dass man die Innenstadt sieht, sieht man. Was BLEIBT, sind
    // die drei Dinge, die man NICHT sieht: was ausserhalb liegt, was im Bestand
    // fehlt, und dass die Entfernung Luftlinie ist.
    document.getElementById("karte-fuss").innerHTML =
      "<strong>" + weit.length + " der " + g.anzahl.gesamt + " Lokale liegen weiter als 3 km "
      + "entfernt</strong> und damit außerhalb des Bildes — nach <em>Entfernung</em> sortiert "
      + "stehen sie am Ende der Liste, ein Klick auf ihren Namen schwenkt die Karte hin. "
      + (halteZahl.sbahn + halteZahl.ubahn
          ? "Ein Klick auf einen Bahnhalt zeigt, welche Linien dort fahren — <strong>nur S- und "
            + "U-Bahn</strong>, Tram- und Bushaltestellen stehen in diesem Bestand nicht. " : "")
      + "Entfernungen sind Luftlinie, keine Gehzeit.";

    var gz = function (id, pruef) {
      return g.orte.filter(function (o) { return o.kueche === id && pruef(o); }).length;
    };
    var ohneZeit = g.orte.filter(function (o) { return !Array.isArray(o.oeffnungszeiten); }).length;
    // Gerechnet, nicht geschrieben: die Spanne der Noten aendert sich mit jedem
    // Abruf, und eine Zahl im Text altert unsichtbar.
    var noten = g.orte.map(function (o) { return o.google && o.google.note; }).filter(Boolean);
    var mitWarnung = g.orte.filter(function (o) {
      return (o.speisekarte && o.speisekarte.warnung) || o.warnung || o.preise_hinweis;
    }).length;
    // Die Namensprobe ist die verbliebene Unsicherheit bei den Koordinaten -
    // und sie steht auf der Seite, auch wenn sie gerade auf null steht. Eine
    // Zahl, die nur erscheint, wenn sie ungleich null ist, sieht am Tag danach
    // aus wie eine, die es nie gab.
    var abweichend = g.orte.filter(function (o) { return o.namensprobe === "abweichend"; }).length;
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
        + '<b>' + abweichend + "</b> Namensprobe abweichend"
      + "</span>"
      + "<details class=\"fuss-mehr\"><summary>Woher die Angaben kommen, und was fehlt</summary>"
      + "<p>Alle drei Bestände stehen auf <em>primary</em> und sind am "
        + deutsch(q.wirtshaus ? q.wirtshaus.abgerufen : q.burger.abgerufen) + " abgerufen: "
      + "Koordinate, Adresse, Bewertung und Öffnungszeiten kommen aus der <strong>Google "
      + "Places API</strong>. Bis zum selben Tag lagen Frühstück und Burger auf einer "
      + "Adresssuche — dreizehn Marken saßen dadurch auf dem Gebäude statt auf dem Laden, und "
      + "jede trug dafür eine Entschuldigung an der Stelle, an der eine Koordinate stehen "
      + "sollte.</p>"
      + "<p><strong>Der angezeigte Name kommt aus der Antwort, nicht aus der Frage.</strong> "
      + "Diese Probe hat beim Umstellen zwei Fehler gefunden: „SMASH – Burger &amp; Bar“ heißt "
      + "in Wirklichkeit „SMASH OR PASS – BURGER &amp; BAR“, und King Loui stand mit einer "
      + "Adresse in der Liste, unter der heute ein Nudelrestaurant sitzt — das Lokal selbst "
      + "liegt am Harras. Zurzeit weichen <strong>" + abweichend + "</strong> Namen ab; wo eine "
      + "abweicht, steht es beim Ort.</p>"
      + (q.wirtshaus && q.wirtshaus.anzahl
          ? "<p>Bei den <strong>Wirtshäusern</strong> sind zusätzlich "
            + q.wirtshaus.anzahl.karte_geprueft + " der " + (g.anzahl.wirtshaus || 0)
            + " Speisekarten einzeln geöffnet worden — die Einzelpreise stammen von dort, nicht "
            + "aus der API.</p>"
          : "")
      + "<p>„Geflügel“ hat <strong>fünf</strong> Stufen, nicht zwei: bei "
      + gz("wirtshaus", function (o) { return o.gefluegel && o.gefluegel.stufe === "salat"; })
      + " Häusern kommt es nur als Salat auf den Tisch — wer ein Hendl will, steht dort falsch. "
      + "<strong>" + ohneZeit + "</strong> Öffnungszeiten sind unbekannt und werden auch so "
      + "gezeigt, nicht geschätzt.</p>"
      + "<p><strong>Der Wochenstreifen ist gezeichnet, nicht abgeschrieben</strong> — aus den "
      + "sieben Tageszeilen des Bestands. Wo keine stehen, bleibt der Streifen <em>unbekannt</em> "
      + "und wird nicht als „zu“ gezeichnet; die Zeilen selbst stehen im aufgeklappten Teil "
      + "daneben. Die Notenachse ist ein <strong>Ausschnitt von 4,0 bis 5,0</strong>: alle "
      + noten.length + " Noten liegen zwischen "
      + String(Math.min.apply(null, noten)).replace(".", ",") + " und "
      + String(Math.max.apply(null, noten)).replace(".", ",")
      + ", eine Achse ab null zeigte " + noten.length + " gleich lange Balken.</p>"
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
    if (id === "hotel" && karteWeg) {
      karteWeg.invalidateSize();
      // Erst jetzt hat der Behaelter eine Breite - siehe karteWegAnpassen.
      if (karteWegAnpassen) karteWegAnpassen();
    }
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
