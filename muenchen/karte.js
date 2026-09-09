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
    // Smash-Laeden tragen DASSELBE Zeichen wie die Burgerlokale, nur in einer
    // anderen Farbe: es ist dieselbe Sache in zwei Auspraegungen, kein zweites
    // Ding. Ein eigenes Zeichen wuerde behaupten, es waere eines.
    //
    // Fast Food dagegen bekommt ein EIGENES: eine Pommestuete. Das ist keine
    // Auspraegung von Burger, sondern eine andere Sache - dean&david und
    // NORDSEE verkaufen keine Burger, und McDonald's ist kein Lokal, das man
    // wegen seiner Kueche aufsucht. Die schraege Tuete mit den Stangen darin
    // liest sich bei 30 px, ohne mit Tasse, Krug oder Burger zu kollidieren.
    fastfood: '<path d="M6 9h12l-1.4 11.2a1 1 0 0 1-1 .8H8.4a1 1 0 0 1-1-.8z"/>'
            + '<path d="M9 9V4.5M12 9V3M15 9V4.5"/>'
            + '<path d="M5.6 12.4h12.8"/>',
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
  //
  // VIER Gruppen, nicht drei: die Burger zerfallen seit dem 09.09.2026 in
  // Smash-Laeden und Burgerlokale. Das ist keine vierte Kueche, sondern eine
  // Unterscheidung INNERHALB der Burger - deshalb tragen beide dasselbe
  // Zeichen und nur eine andere Farbe. Woher die Einordnung kommt und wie sie
  // belegt ist, steht je Ort im Feld `smash`.
  var GASTRO = [
    { id: "fruehstueck", label: "Frühstück",     symbol: "cafe" },
    { id: "wirtshaus",   label: "Abendessen",    symbol: "wirtshaus" },
    { id: "smash",       label: "Smash-Läden",   symbol: "smash" },
    { id: "burger",      label: "Burgerlokale",  symbol: "burger" },
    { id: "fastfood",    label: "Fast-Food-Ketten", symbol: "fastfood" }
  ];

  // Das Smash-Zeichen IST das Burger-Zeichen. Eine Kopie waere eine zweite
  // Fassung derselben Form, und die driftet beim naechsten Nachbessern.
  SYMBOL.smash = SYMBOL.burger;

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
      + (text || "In Google Maps öffnen") + " ↗</a></p>"
      + routenLinks(o);
  };

  // --- Die zwei Routen, die man von einem Punkt aus wirklich will -------------
  // Der Link oben zeigt den ORT. Diese beiden zeigen den WEG dorthin - einmal
  // von da, wo man gerade steht, einmal von der Unterkunft aus. Sie haengen an
  // mapsLink() und nicht an elf Sprechblasen einzeln: so kann keine vergessen
  // werden, und eine zwoelfte bekommt sie von selbst.
  //
  // "ab Standort" laesst origin WEG. Das ist kein vergessener Parameter: ohne
  // origin nimmt Google Maps den Standort des Geraets - und zwar den echten,
  // nicht den, den diese Seite zuletzt gesehen hat. Der Link funktioniert damit
  // auch, wenn hier nie auf 'Mein Standort' gedrueckt wurde.
  //
  // Das Ziel ist die KOORDINATE, nicht der Name. "Marienplatz" gibt es
  // dutzendfach, "McDonald's" in Muenchen dreissigfach - ein Name als Ziel
  // fuehrt zur falschen Filiale, und zwar ohne dass es jemand merkt. Dieselbe
  // Begruendung wie eine Zeile weiter oben.
  // Der zuletzt gemessene eigene Standort. Gesetzt von standortKnopf(), gelesen
  // von den Routenknoepfen - das ist die einzige Stelle, an der die beiden
  // etwas voneinander wissen muessen.
  var letzterOrt = null;

  var haus = null;
  var hausSuchen = function () {
    if (haus === null) {
      haus = (DATEN.orte || []).filter(function (o) { return o.art === "unterkunft"; })[0] || false;
    }
    return haus;
  };

  // Luftlinie in Metern - fuer die Wahl des Verkehrsmittels reicht sie.
  var luftlinie = function (a, b) {
    var dy = (b.lat - a.lat) * 111320;
    var dx = (b.lon - a.lon) * 111320 * Math.cos(a.lat * Math.PI / 180);
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  };

  // Womit Maps aufmachen soll. OHNE travelmode faengt Google beim Auto an, und
  // diese Reise hat kein Auto - der Vorgabewert waere also fuer jeden Punkt
  // falsch. Gewaehlt wird darum nach der Entfernung von der Unterkunft, und die
  // Schwelle ist NICHT neu erfunden: 1100 m ist derselbe Wert, mit dem die
  // Umgebungskarte "in Gehweite" absteckt. Zwei Schwellen fuer dieselbe Frage
  // driften auseinander.
  //
  // Es ist ein AUFSCHLAG, keine Behauptung: in Maps ist das Verkehrsmittel ein
  // Fingertipp weiter. Fuer "ab Standort" gilt dieselbe Wahl, obwohl niemand
  // weiss, wo der Standort liegt - eine bessere Grundlage gibt es hier nicht,
  // und das ist der ehrlichere Umgang damit, als eine zu erfinden.
  var GEHWEITE_M = 1100;

  var mittelFuer = function (von, ziel) {
    return von && luftlinie(von, ziel) > GEHWEITE_M ? "transit" : "walking";
  };
  var dirUrl = function (start, ziel, mittel) {
    return "https://www.google.com/maps/dir/?api=1"
      + (start ? "&origin=" + encodeURIComponent(start) : "")
      + "&destination=" + encodeURIComponent(ziel.lat + "," + ziel.lon)
      + "&travelmode=" + mittel;
  };

  var routenLinks = function (o) {
    if (o.lat == null || o.lon == null) return "";
    var h = hausSuchen();
    var knopf = function (url, text, daten) {
      return '<a class="route-knopf" href="' + url + '"' + (daten || "")
        + ' target="_blank" rel="noopener noreferrer">' + text + "</a>";
    };
    // Das Ziel steht am Knopf, damit der Klick das Verkehrsmittel neu waehlen
    // kann - siehe unten.
    var ab = ' data-ab="standort" data-lat="' + o.lat + '" data-lon="' + o.lon + '"';
    // Am Haus selbst waere "ab Hotel" eine Route zu sich selbst. Der Knopf
    // faellt dort weg, statt eine leere Auskunft zu geben.
    var amHaus = h && luftlinie(h, o) < 25;
    return '<p class="route-links"><span class="route-wort">Route</span>'
      + knopf(dirUrl(null, o, mittelFuer(h, o)), "ab Standort", ab)
      + (amHaus ? "" : knopf(dirUrl(h.lat + "," + h.lon, o, mittelFuer(h, o)), "ab Hotel"))
      + "</p>";
  };

  // Das Verkehrsmittel des Standort-Knopfs wird ERST BEIM KLICK festgelegt, wenn
  // bis dahin ein eigener Standort gemessen wurde.
  //
  // Warum der Umweg: die Sprechblase entsteht beim Bau der Karte, und da weiss
  // niemand, wo der Betrachter steht. Der Aufschlag kam darum aus der Entfernung
  // zur UNTERKUNFT - und das ist genau dann falsch, wenn es darauf ankommt: wer
  // am Marienplatz steht und ein Wirtshaus 200 m weiter antippt, bekam den
  // Fahrplan statt des Fusswegs, weil das Hotel 2,3 km entfernt liegt.
  //
  // Ohne gemessenen Standort bleibt es beim Aufschlag ueber die Unterkunft. Das
  // ist keine gute Grundlage, aber die einzige vorhandene - und in Maps ist das
  // Verkehrsmittel ein Fingertipp weiter.
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest('.route-knopf[data-ab="standort"]');
    if (!a || !letzterOrt) return;
    var ziel = { lat: +a.dataset.lat, lon: +a.dataset.lon };
    a.href = dirUrl(null, ziel, mittelFuer(letzterOrt, ziel));
  }, true);

  // --- Mein Standort, auf jeder Karte dieselbe Bauart ------------------------
  // EIN Knopf je Karte, und er tut genau zwei Dinge: die Ortung starten und zur
  // eigenen Position springen. Was er ausdruecklich NICHT tut, ist der Karte
  // hinterherzuziehen.
  //
  // locate({ watch: true, setView: false }) ist der ganze Unterschied. Mit
  // setView:true zentriert Leaflet bei JEDER Positionsmeldung neu - beim Gehen
  // alle paar Sekunden. Wer dann die Karte verschiebt, um zu sehen, was vor ihm
  // liegt, wird nach zwei Sekunden zurueckgerissen. Verfolgt wird die Position
  // trotzdem, damit die Marke stimmt und der naechste Knopfdruck den AKTUELLEN
  // Ort trifft und nicht den von vorhin.
  //
  // Das Zeichen traegt KEINE Markenfarbe, sondern die Tinte. Der eigene
  // Standort ist keine Ortskategorie neben Wirtshaus und Museum - er ist der
  // Betrachter. Eine der elf Marken zu leihen hiesse, ihn als zwoelfte
  // Kategorie zu behaupten; ausserdem ist der Farbkreis voll (siehe stil.css).
  //
  // Geolocation braucht HTTPS. Auf GitHub Pages gegeben, als lokale Datei per
  // file:// meist nicht - darum kann kein Pruefskript hier etwas messen, und
  // die Pruefstaende weisen den Knopf als ungeprueft aus.
  var standortKnopf = function (karte) {
    var marke = null, kreis = null, letzte = null, sucht = false;

    var steuer = L.control({ position: "bottomleft" });
    steuer.onAdd = function () {
      var kasten = L.DomUtil.create("div", "standort-steuer");
      kasten.innerHTML =
          '<button type="button" class="standort-knopf">'
        + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
        +   'stroke-linecap="round" aria-hidden="true">'
        + '<circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="8.5"/>'
        + '<path d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2"/></svg>'
        + "<span>Mein Standort</span></button>"
        + '<p class="standort-wort" hidden></p>';
      // Ohne das frisst die Karte den Klick und schiebt sich stattdessen.
      L.DomEvent.disableClickPropagation(kasten);
      L.DomEvent.disableScrollPropagation(kasten);
      return kasten;
    };
    steuer.addTo(karte);

    var kasten = steuer.getContainer();
    var knopf = kasten.querySelector(".standort-knopf");
    var wort = kasten.querySelector(".standort-wort");
    var sagen = function (text, schlecht) {
      wort.hidden = !text;
      wort.textContent = text || "";
      wort.className = "standort-wort" + (schlecht ? " standort-wort--schlecht" : "");
    };

    // Beim Springen die Zoomstufe des Nutzers nicht ueberschreiben, wenn er
    // schon naeher dran ist: hineinzoomen ja, hinauszoomen nein.
    var hin = function () {
      if (letzte) karte.setView(letzte, Math.max(karte.getZoom(), 16));
    };

    knopf.addEventListener("click", function () {
      if (letzte) { hin(); return; }
      if (!navigator.geolocation) {
        sagen("Dieser Browser gibt keinen Standort heraus.", true);
        return;
      }
      if (sucht) return;
      sucht = true;
      knopf.querySelector("span").textContent = "Sucht …";
      sagen("Die Position wird nur im Browser verarbeitet.");
      karte.locate({ watch: true, setView: false, enableHighAccuracy: true, timeout: 20000 });
    });

    karte.on("locationfound", function (e) {
      var erste = !letzte;
      letzte = e.latlng;
      // Auch fuer die Routenknoepfe in den Sprechblasen - sie waehlen damit das
      // Verkehrsmittel nach der ECHTEN Entfernung statt nach der zur Unterkunft.
      letzterOrt = { lat: e.latlng.lat, lon: e.latlng.lng };
      sucht = false;
      knopf.querySelector("span").textContent = "Mein Standort";
      if (marke) { karte.removeLayer(marke); karte.removeLayer(kreis); }
      // Der Genauigkeitskreis ist kein Schmuck: bei ±800 m im Zug bedeutet die
      // Marke etwas anderes als bei ±8 m auf der Strasse, und ohne den Kreis
      // sieht beides gleich aus.
      kreis = L.circle(e.latlng, { radius: e.accuracy, className: "standort-kreis",
                                   interactive: false }).addTo(karte);
      marke = L.marker(e.latlng, {
        icon: L.divIcon({ className: "", html: '<i class="ort-pin ich"></i>',
                          iconSize: [26, 26], iconAnchor: [13, 13] }),
        zIndexOffset: 900, keyboard: false
      }).addTo(karte).bindPopup("Hier bist du gerade — auf ±"
        + Math.round(e.accuracy) + " m genau.");
      sagen("Auf ±" + Math.round(e.accuracy) + " m genau. Die Karte folgt dir nicht — "
        + "der Knopf springt zurück.");
      // Genau EINMAL springen: beim ersten Fund. Danach entscheidet der Knopf.
      if (erste) hin();
    });

    karte.on("locationerror", function (e) {
      sucht = false;
      knopf.querySelector("span").textContent = "Mein Standort";
      sagen("Standort nicht verfügbar: " + e.message
        + " — im Browser die Ortungsfreigabe prüfen.", true);
    });
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

  // Der eine Bewegungsschalter der Seite. --bewegung steht auf 0, sobald das
  // Betriebssystem reduzierte Bewegung meldet - dieselbe Variable, die schon
  // die Menueleiste steuert. Skriptgetriebene Bewegung fragt sie ab, statt
  // matchMedia ein zweites Mal zu befragen: zwei Quellen fuer dieselbe
  // Entscheidung driften auseinander.
  var bewegt = function () {
    return parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue("--bewegung")) > 0;
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

  standortKnopf(karte);

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
      burger: function (n, qq) {
        var presse = gz("burger", function (o) { return o.auswahl !== "abfrage"; });
        var abfrage = n - presse;
        return "<strong>Zwei Herkünfte, und das steht bei jedem Ort dran.</strong> "
          + wort(presse).replace(/^./, function (c) { return c.toUpperCase(); })
          + " Smash-Burger-Läden stammen aus der Münchner Food-Presse — kuratiert, je Eintrag mit "
          + "Beleg und einer Beschreibung, die jemand gelesen hat. Die anderen " + wort(abfrage)
          + " kamen am 09.09.2026 über eine <em>Umkreisabfrage</em> dazu (1,5 km um den "
          + "Marienplatz, Schwelle 4,5 ★ bei mindestens 500 Stimmen). Sie tragen <strong>keine "
          + "Beschreibung und keinen Beleg</strong>: bekannt ist nur, was die Places-API liefert. "
          + "Der Anlass war eine Lücke — von den ersten " + wort(presse) + " lag keiner näher als "
          + "2,4 km am Marienplatz, und eine Karte, die „Burger“ verspricht und in der Innenstadt "
          + "nichts zeigt, behauptet, dass es dort keine gibt. "
          + "<strong>Eine Ausnahme:</strong> Five Guys liegt mit 4,0 unter der Schwelle und ist "
          + "trotzdem dabei, auf ausdrückliche Ansage — eine bekannte Kette am Stachus beantwortet "
          + "eine andere Frage als der bestbewertete Laden. "
          + "Die Namensprobe hat beim Umstellen auf die Places-API zwei Fehler gefunden, die vorher "
          + "unbemerkt in den Daten standen: „SMASH – Burger &amp; Bar“ heißt „SMASH OR PASS – "
          + "BURGER &amp; BAR“, und King Loui war mit einer Adresse verzeichnet, unter der heute "
          + "ein Nudelrestaurant sitzt — das Lokal liegt am Harras.";
      },
      fastfood: function (n, qq) {
        var je = (qq.anzahl && qq.anzahl.je_kette) || {};
        return "<strong>Umgekehrt gebaut als die anderen drei:</strong> dort steht eine Liste von "
          + "<em>Häusern</em> im Abrufskript, hier eine Liste von <em>Ketten</em>. Welche Filiale wo "
          + "steht, ist eine Abfrage — welche Kette als Fast Food gilt, ist eine Entscheidung, und "
          + "die steht im Skript. Gefunden wurden " + n + " Filialen von "
          + Object.keys(je).length + " Ketten im Umkreis von "
          + ((qq.umkreis_m || 1500) / 1000).toFixed(1).replace(".", ",") + " km um den "
          + (qq.bezug || "Marienplatz") + ": "
          + Object.entries(je).map(function (e) { return e[0] + " " + e[1]; }).join(" · ") + ". "
          + "<strong>Nicht aufgenommen</strong> sind Restaurantketten mit Bedienung — Hans im "
          + "Glück, L’Osteria und Vapiano liegen im selben Ausschnitt und sind Ketten, aber kein "
          + "Fast Food; sie würden die Kategorie zu „Kette“ verwässern. "
          + "Diese Orte sind <strong>abgefragt, nicht recherchiert</strong>: keine Beschreibung, "
          + "kein Beleg, bekannt ist nur, was die API liefert."
          + ((qq.gekappt && qq.gekappt.length)
              ? " Die Typ-Abfragen liefern höchstens 20 Treffer je Anfrage und waren bei "
                + qq.gekappt.length + " von 3 ausgeschöpft — gezeigt sind die bekanntesten "
                + "Filialen, nicht mit Sicherheit alle."
              : "");
      }
    };
    GASTRO.forEach(function (k) {
      var qq = DATEN.gastro.quellen[k.id];
      var n = DATEN.gastro.anzahl[k.id] || 0;
      // Ohne Text kein Kaertchen. Diese Zeile fehlte beim Nachtragen von Fast
      // Food und hat die ganze Seite angehalten: eine Kategorie ohne
      // Quellentext ist ein Aufruf auf undefined, und danach laeuft nichts mehr.
      if (!qq || !n || !GASTRO_QUELLTEXT[k.id]) return;
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

  // Das Kuerzel im Halt-Zeichen. Steht hier oben, weil zwei Bloecke es brauchen:
  // die Anbindungszeilen der Hoteltafel und die Marken der Hotelkarte weiter
  // unten. Als var im unteren Block war es beim Bau der Tafel noch undefined -
  // gehoben wird die Deklaration, nicht die Zuweisung.
  var HALT_KUERZEL = { sbahn: "S", ubahn: "U", tram: "T", bus: "B" };

  // "Womit kommt man hier weg" - je Verkehrsmittel die naechstgelegene
  // Haltestelle mit ihren Linien. Steht als Funktion und nicht zweimal als
  // Block: der Hotel- und der Bavaria-Reiter stellen dieselbe Frage an zwei
  // Orten, und zwei Fassungen davon driften.
  //
  // Erst stand auf dem Hotel-Reiter die Gehzeit zu fuenf Ankern der Stadt -
  // Marienplatz, Ostbahnhof, Viktualienmarkt. Auf Ansage des Nutzers raus:
  // gefragt ist nicht, wie lange man zum Marienplatz LAEUFT, sondern womit man
  // wegkommt. Die Antwort steht schon in den Umgebungsdaten und braucht keinen
  // zweiten Abruf.
  //
  // Eine Haltestelle OHNE eingetragene Linien faellt weg. Sie stuende sonst als
  // leere Zeile da und saehe aus wie eine Haltestelle, an der nichts faehrt -
  // der Bushalt am Rosenheimer Platz ist genau dieser Fall: in OSM ist dort
  // keine Linie erfasst, gefahren wird trotzdem. An der Filmstadt sind es zwei
  // Bushalte, aus demselben Grund.
  function anbindungHtml (umg) {
    if (!umg || !umg.halte) return "";
    var naechste = {};
    umg.halte.forEach(function (h) {
      if (!h.linien || !h.linien.length || h.gehzeit_s == null) return;
      if (!naechste[h.art] || h.gehzeit_s < naechste[h.art].gehzeit_s) naechste[h.art] = h;
    });
    var zeilen = ["sbahn", "ubahn", "tram", "bus"].filter(function (a) {
      return naechste[a];
    }).map(function (a, i) {
      var h = naechste[a];
      return '<li class="anb-zeile" style="--i:' + i + '">'
        + '<span class="anb-marke" aria-hidden="true"><i class="halt-pin ' + a + '">'
        + (HALT_KUERZEL[a] || "?") + "</i></span>"
        + '<span class="anb-ort">' + h.name
        + '<span class="anb-weg">' + Math.round(h.gehzeit_s / 60) + " min zu Fuß</span></span>"
        + '<span class="anb-linien">'
        + h.linien.map(function (l) { return linienMarke(l, true); }).join("")
        + "</span></li>";
    });
    if (!zeilen.length) return "";
    return '<h4 class="lage-titel">Anbindung</h4>'
      + '<ul class="anbindung">' + zeilen.join("") + "</ul>";
  }

  // --- Hotel: eine Tafel statt zweier Kaesten -------------------------------
  // Bis zum 09.09.2026 standen hier zwei Boxen uebereinander, die dasselbe
  // erzaehlten: die Infobox mit "Unterkunft: Motel One ..." und darunter die
  // Hoteltafel mit "Haus: Motel One ...". Schlimmer als die Doppelung war die
  // Trennung - das Anreisedatum stand einen Kasten entfernt von der
  // Check-in-Zeit, zu der es gehoert.
  //
  // Jetzt eine Tafel, und sie ist nach der FRAGE gebaut, nicht nach der
  // Datenherkunft: oben das Haus mit Anschrift, Bewertung und den drei Zielen,
  // die man antippt (Telefon, Website, Karte), in der Mitte die drei Zahlen des
  // Aufenthalts, darunter was zum Zimmer und zum Haus gehoert, zuletzt die Lage
  // in gemessenen Gehminuten.
  //
  // Zwei Herkuenfte, bewusst getrennt gehalten und hier zusammengefuehrt:
  //   DATEN.hotel          von Hand aus Buchung und Hotelseite (reise.json)
  //   DATEN.hotel_eintrag  abgefragt (Places, hol-eintrag.mjs)
  // Wer beides in eine Datei schriebe, verlaere die Handarbeit beim naechsten
  // Lauf - und wuesste hinterher nicht mehr, welcher Wert woher kam.
  //
  // Was NICHT hier steht, fehlt aus einem Grund: gesperrt ist, was nicht
  // oeffentlich einsehbar ist - Auftragsnummer, Preis, Stornofristen, Name.
  var ho = DATEN.hotel || {};
  var he = DATEN.hotel_eintrag || null;

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

    // Ein unbekannter Wert wird als solcher gesetzt, nicht weggelassen: eine
    // Liste ohne die Zeile sieht vollstaendig aus, und niemand fragt je nach.
    var zeileH = function (kopf, wert, hinweis) {
      if (!wert) return "";
      var offen = wert === "xx";
      return "<dt>" + kopf + "</dt><dd"
        + (offen ? ' class="kenn-offen" title="noch nicht bekannt"' : "") + ">"
        + wert + (hinweis ? ' <span class="kenn-fein">' + hinweis + "</span>" : "")
        + "</dd>";
    };

    var anschrift = [ho.adresse, ho.stadtteil].filter(Boolean).join(" · ");
    if (ho.sterne) anschrift += " · " + ho.sterne + " Sterne";

    // Die drei Ziele im Kopf sind ZIELE, keine Zeilen: unterwegs tippt man sie
    // an, statt sie zu lesen. Website und Karte sind Pflicht - ohne sie ist die
    // Tafel eine Abschrift, aus der man die Adresse selbst weitersuchen muss.
    var ziel = function (url, text, extern) {
      if (!url) return "";
      return '<a class="hotel-tel" href="' + url + '"'
        + (extern ? ' target="_blank" rel="noopener noreferrer"' : "") + ">"
        + text + (extern ? " ↗" : "") + "</a>";
    };
    var ziele = ziel(ho.telefon ? "tel:" + ho.telefon.replace(/\s/g, "") : null, ho.telefon)
      + ziel(he && he.eintrag.website, "Website", true)
      + ziel(he && he.eintrag.maps
               ? he.eintrag.maps
               : "https://www.google.com/maps/search/?api=1&query="
                 + encodeURIComponent((DATEN.umgebung ? DATEN.umgebung.bezug.lat + "," + DATEN.umgebung.bezug.lon : "")),
             "Google Maps", true);

    // Die Bewertung steht als Marke im Kopf, nicht als Zeile: sie ist das
    // Einzige hier, das eine Einordnung ist und kein Fakt ueber die Buchung.
    var note = he && he.eintrag.bewertung != null
      ? '<span class="hotel-note"><b>' + String(he.eintrag.bewertung).replace(".", ",")
        + " ★</b> " + (he.eintrag.stimmen != null
            ? he.eintrag.stimmen.toLocaleString("de-DE") + " Bewertungen" : "") + "</span>"
      : "";

    var ausstattung = (ho.ausstattung || []).map(function (a) {
      return zeileH(a.was, a.wert, a.hinweis);
    }).join("");

    // Check-in und Check-out stehen ZWEIMAL auf der Tafel, und das ist Absicht:
    // klein unter dem jeweiligen Datum, weil sie dort hingehoeren - Anreisetag
    // und Einlasszeit sind eine Angabe -, und hier als eigene Zeile, weil man
    // sie am Reisetag sucht und nicht liest. Die Kleinschrift unter dem Datum
    // wurde uebersehen; eine Angabe, die man nur findet, wenn man schon weiss,
    // wo sie steht, ist keine.
    var kenn = zeileH("Zimmer", ho.zimmer)
      + zeileH("Check-in", ho.checkin)
      + zeileH("Check-out", ho.checkout)
      + zeileH("Verpflegung", ho.verpflegung)
      + zeileH("Reisende", (reisewert("reisende") || {}).wert)
      + ausstattung
      + zeileH("Gebucht", [ho.vermittelt, ho.bestaetigt].filter(Boolean).join(" · "));

    // Womit man vom Haus wegkommt - die Begruendung steht bei anbindungHtml.
    var anbindung = anbindungHtml(DATEN.umgebung);

    var quellen = [ho.quelle,
                   ho.ausstattung_quelle,
                   he ? he.quellen.eintrag.name + " (Bewertung), abgerufen "
                        + deutsch(he.quellen.eintrag.abgerufen) : null,
                   DATEN.umgebung && DATEN.umgebung.quellen
                     ? DATEN.umgebung.quellen.halte.name + " (Haltestellen und Linien)"
                     : null]
      .filter(Boolean).join(" · ");

    el.innerHTML = '<div class="fahrt">'
      + '<div class="fahrt-kopf">'
      +   "<div>"
      +     '<p class="fahrt-richtung">' + (ho.name || "Unterkunft unbekannt") + "</p>"
      +     (anschrift ? '<p class="fahrt-tag">' + anschrift + "</p>" : "")
      +   "</div>"
      +   note
      + "</div>"
      + (ziele ? '<div class="hotel-ziele">' + ziele + "</div>" : "")
      + '<div class="platz-felder platz-felder--um">'
      +   feldH("Anreise", reisewert("hinfahrt"), ho.checkin ? "Check-in " + ho.checkin : "")
      +   feldH("Nächte", reisewert("naechte"), "")
      +   feldH("Abreise", reisewert("rueckfahrt"), ho.checkout ? "Check-out " + ho.checkout : "")
      + "</div>"
      + (kenn ? '<dl class="kenn hotel-kenn">' + kenn + "</dl>" : "")
      + anbindung
      // Die Quellen stehen HINTER einem Aufklapper, nicht als Absatz darunter.
      // Sie muessen da sein - jede Angabe traegt ihre Herkunft, das ist die
      // Projektregel -, aber sie sind nichts, was man beim Aufschlagen liest.
      // Als Block war es eine Textwand unter der Tafel; zugeklappt ist es eine
      // Zeile, die man aufmacht, wenn man fragt "woher wisst ihr das".
      + '<details class="quell-klapp"><summary>Woher diese Angaben kommen</summary>'
      + "<p>" + quellen
      + " · Preis, Auftragsnummer und Stornofristen stehen nicht auf dieser Seite.</p>"
      + "</details>"
      + "</div>";
  }());

  // --- Bavaria: der Termin, nicht das Gelaende -----------------------------
  // Der Reiter hiess beim ersten Wurf "Bavaria Filmstadt" und trug Eintritts-
  // preise, Oeffnungszeiten und die Kulissen der Besucherfuehrung. Falsch, und
  // zwar vollstaendig: gefahren wird nicht zur Fuehrung, sondern zur
  // Fernsehaufzeichnung "Joko und Klaas gegen ProSieben" - das steht in der
  // Bestaetigungsmail in _inbox/, die beim Bau niemand gelesen hatte. Ein
  // Reiter, der aus dem ORTSNAMEN gebaut wird statt aus dem ANLASS, sieht
  // vollstaendig aus und beantwortet die falsche Frage.
  //
  // Jetzt nach dem Tagesablauf gebaut, nicht nach der Datenherkunft: oben was
  // wann ist, darunter was mitmuss, dann die Regeln des Hauses, zuletzt die
  // Anbindung. Alles aus EINER Quelle - der Mail -, und was dort nicht steht,
  // steht auch hier nicht.
  //
  // Was NICHT hier steht, fehlt aus einem Grund: eTicket-Kennung, Bestellnummer
  // und der Name des Hauptbuchers sind personenbezogen. Das Datenschutz-Tor in
  // deploy-pages.sh prueft darauf und bricht ab.
  (function () {
    var el = document.getElementById("bavaria-tafel");
    var e = DATEN.event;
    if (!el || !e) return;
    var be = DATEN.bavaria_eintrag;
    var bw = DATEN.bavaria_weg;

    var feldE = function (f) {
      return '<div class="platz-feld"><span class="platz-kopf">' + f.kopf + "</span>"
        + '<b class="platz-wert">' + f.wert + "</b>"
        + (f.fein ? '<span class="weg-feld-fein">' + f.fein + "</span>" : "") + "</div>";
    };

    var zeileE = function (kopf, wert, hinweis) {
      if (!wert) return "";
      return "<dt>" + kopf + "</dt><dd>" + wert
        + (hinweis ? ' <span class="kenn-fein">' + hinweis + "</span>" : "") + "</dd>";
    };

    // Nur der Maps-Eintrag, nicht Bewertung und Oeffnungszeiten: eine
    // Sternebewertung des Freizeitparks sagt nichts ueber eine Aufzeichnung,
    // und die Oeffnungszeiten der Filmstadt sind nicht die des Studios. Was
    // man abends in Gruenwald braucht, ist der Punkt auf der Karte.
    var maps = be && be.eintrag.maps;
    var ziele = (e.telefon
        ? '<a class="hotel-tel" href="tel:' + e.telefon.replace(/s/g, "") + '">' + e.telefon + "</a>"
        : "")
      + (maps ? '<a class="hotel-tel" href="' + maps + '" target="_blank" rel="noopener noreferrer">'
                + "Google Maps ↗</a>" : "");

    var anschrift = [e.ort, e.adresse].filter(Boolean).join(" · ");

    // Die Checkliste ist eine Liste und keine Kennzeile: sie wird ABGEHAKT,
    // nicht gelesen. Der Satz darunter steht dabei und nicht im Aufklapper -
    // "der Hauptbucher holt fuer alle ab" entscheidet, wer wann losfaehrt.
    var mit = (e.mitbringen || []).map(function (m) {
      return '<li class="mitbring">' + m + "</li>";
    }).join("");

    var kenn = (e.kenn || []).map(function (k) {
      return zeileE(k.was, k.wert, k.hinweis);
    }).join("");

    var quellen = [e.quelle,
                   bw ? bw.quelle.name + " (Hin- und Rückweg), abgerufen "
                        + deutsch(bw.quelle.abgerufen) : null,
                   DATEN.bavaria_umgebung && DATEN.bavaria_umgebung.quellen
                     ? DATEN.bavaria_umgebung.quellen.halte.name + " (Haltestellen und Linien)"
                     : null].filter(Boolean).join(" · ");

    el.innerHTML = '<div class="fahrt">'
      + '<div class="fahrt-kopf">'
      +   "<div>"
      +     '<p class="fahrt-richtung">' + e.titel + "</p>"
      +     '<p class="fahrt-tag">' + [e.art, anschrift].filter(Boolean).join(" · ") + "</p>"
      +   "</div>"
      +   (e.tag ? '<span class="hotel-note"><b>' + e.tag + "</b></span>" : "")
      + "</div>"
      + (ziele ? '<div class="hotel-ziele">' + ziele + "</div>" : "")
      + '<div class="platz-felder platz-felder--um">'
      +   (e.ablauf || []).map(feldE).join("")
      + "</div>"
      + (mit ? '<h4 class="lage-titel">Das muss mit</h4><ul class="mitbringen">' + mit + "</ul>" : "")
      + (e.mitbringen_hinweis ? '<p class="tafel-fein">' + e.mitbringen_hinweis + "</p>" : "")
      + (kenn ? '<dl class="kenn hotel-kenn">' + kenn + "</dl>" : "")
      + anbindungHtml(DATEN.bavaria_umgebung)
      // Der Satz steht als Warnung und nicht im Aufklapper: er entscheidet,
      // wann man diese Seite liest - naemlich vorher, weil das Handy waehrend
      // der Show in der Garderobe liegt.
      + (e.hinweis ? '<p class="tafel-warnung">' + e.hinweis + "</p>" : "")
      + '<details class="quell-klapp"><summary>Woher diese Angaben kommen</summary>'
      + "<p>" + quellen
      + " · Ticketkennung, Bestellnummer und Name stehen nicht auf dieser Seite.</p>"
      + "</details>"
      + "</div>";
  }());


  // --- Bahn-Reiter ---------------------------------------------------------
  // Ein Unterknopf je Fahrt, mehr nicht. 'Alternativen' war bis zum 09.09.2026
  // ein dritter, gleichrangiger Knopf - falsch: eine Ersatzverbindung ist keine
  // eigene Sache, sondern gehoert zu der Fahrt, die sie ersetzt. Als eigener
  // Punkt musste man erst raten, welche der beiden gemeint ist.
  //
  // Die Knoepfe kommen aus reise.json, nicht aus dem HTML - eine dritte Fahrt
  // soll ein Datensatz sein und keine Skriptaenderung.
  var bahnDaten = DATEN.bahn_reise || {};
  var bahnFahrten = bahnDaten.fahrten || [];

  var bahnMarke = function (status, text) {
    var klasse = status === "gebucht" ? "zustand--fest"
               : status === "ausgefallen" ? "zustand--weg"
               : "zustand--offen";
    return '<span class="zustand ' + klasse + '">' + (text || status) + "</span>";
  };

  var bahnHalt = function (h, art) {
    var zeit = h.an && h.ab ? h.an + '<span class="band-bis">–</span>' + h.ab
             : h.ab || h.an || "";
    return '<li class="band-halt ' + art + '">'
      + '<span class="band-zeit">' + zeit + "</span>"
      + '<span class="band-punkt" aria-hidden="true"></span>'
      + '<span class="band-ort">' + h.ort + "</span>"
      + '<span class="band-gleis">' + (h.gleis ? "Gl. " + h.gleis : "") + "</span>"
      + "</li>";
  };

  // Das Streckenband. Eine Fahrt IST eine Folge, und eine Folge liest man als
  // Linie - eine Tabelle beantwortet "wann bin ich wo" erst, nachdem man alle
  // Zeilen gelesen hat.
  //
  // Start und Ziel stehen immer da, die Zwischenhalte liegen dahinter in einem
  // <details>. Aufgeklappt braucht eine sechsteilige Fahrt so viel Hoehe wie
  // die halbe Tafel, und die beiden Zeiten, die man wirklich sucht, ruecken
  // auseinander. Zugeklappt sagt die Zeile trotzdem, WIE VIELE es sind - eine
  // Faltung, die ihren Inhalt verschweigt, wird nicht geoeffnet.
  var bahnBand = function (halte, zug) {
    if (!halte || !halte.length) return "";
    var mitte = halte.slice(1, -1);
    return '<ol class="band">'
      + bahnHalt(halte[0], "band-halt--start")
      + '<li class="band-halt band-halt--gruppe">'
      +   '<span class="band-zeit"></span>'
      +   '<span class="band-punkt" aria-hidden="true"></span>'
      +   '<div class="band-mitte">' + (zug ? bahnSchild(zug) : "")
      +   (mitte.length
          ? '<details class="halte-mehr"><summary>' + mitte.length
            + " Zwischenhalte</summary>"
            + '<ol class="band band--tief">'
            + mitte.map(function (h) { return bahnHalt(h, "band-halt--zwischen"); }).join("")
            + "</ol></details>"
          : "")
      +   "</div>"
      + "</li>"
      + bahnHalt(halte[halte.length - 1], "band-halt--ziel")
      + "</ol>";
  };

  // Die Reservierung als Schild, nicht als Zeile in einer Liste: Wagen und
  // Platz sind das Einzige auf diesem Reiter, das man im Zug im Stehen mit
  // einem Blick treffen muss. Grosse Ziffern sind hier Funktion, nicht Zierde.
  // Die Reservierung als Wagen gezeichnet, nicht als zwei Kaesten mit Zahlen.
  //
  // Wichtig ist, was der Wagen NICHT behauptet: er steht fuer sich, nicht an
  // einer Stelle in einer Zugreihe. Wo der reservierte Wagen tatsaechlich
  // am Bahnsteig haelt, ist am Bautag dieser Seite nicht zu wissen - die Wagenreihung von
  // bahn.de gibt es gemessen erst rund 18 Stunden vor Abfahrt (geprueft
  // 09.09.2026: ICE 506 bei +17,9 h liefert, ICE 588 bei +18,2 h antwortet
  // 404). Eine gezeichnete Reihe mit dem Wagen an Position x waere erfunden,
  // und man stellt sich danach an den falschen Bahnsteigabschnitt.
  //
  // Darum: ein Wagen als Rahmen fuer die Zahlen, die wirklich in der Buchung
  // stehen - und der Hinweis, wann die Position zu erfahren ist. Das ist die
  // Angabe, die am Reisetag hilft.
  var bahnPlatz = function (r) {
    if (!r) return "";
    var sitze = (r.platz || "").split(",").map(function (s) { return s.trim(); })
      .filter(Boolean);
    var fuss = [r.bereich, r.plaetze, r.hinweis].filter(Boolean).join(" · ");
    return '<div class="platz">'
      + '<div class="wagen">'
      +   '<svg class="wagen-riss" viewBox="0 0 200 62" role="img" aria-hidden="true">'
      // Kasten, Fensterband, zwei Tueren, zwei Drehgestelle. Reine Kontur in
      // currentColor - so traegt sie den Rollensatz der Tafel und braucht
      // keine eigene gemessene Farbe.
      +     '<rect x="4" y="6" width="192" height="40" rx="3" fill="none" '
      +       'stroke="currentColor" stroke-width="3"/>'
      +     '<path d="M18 16h40v13H18z M142 16h40v13h-40z" '
      +       'fill="none" stroke="currentColor" stroke-width="2"/>'
      +     '<rect x="64" y="11" width="72" height="24" fill="none" '
      +       'stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>'
      +     '<path d="M10 10v32 M190 10v32" stroke="currentColor" stroke-width="2"/>'
      +     '<path d="M40 52h28 M132 52h28" stroke="currentColor" stroke-width="4" '
      +       'stroke-linecap="round"/>'
      +   "</svg>"
      +   '<div class="wagen-nr"><span class="platz-kopf">Wagen</span>'
      +     '<b class="platz-wert">' + (r.wagen || "?") + "</b></div>"
      + "</div>"
      + (sitze.length
        ? '<div class="sitze"><span class="platz-kopf">Plätze</span>'
          + '<div class="sitz-reihe">' + sitze.map(function (s) {
              return '<span class="sitz"><svg viewBox="0 0 20 20" aria-hidden="true">'
                + '<rect x="4.6" y="2.6" width="10.8" height="6.4" rx="1.6" '
                + 'fill="currentColor"/>'
                + '<rect x="2.8" y="10" width="14.4" height="5" rx="1.6" '
                + 'fill="currentColor"/>'
                + '<path d="M5 15.4v2.4 M15 15.4v2.4" stroke="currentColor" '
                + 'stroke-width="2.2" stroke-linecap="round"/></svg><b>' + s + "</b></span>";
            }).join("") + "</div></div>"
        : "")
      + (fuss ? '<p class="platz-fuss">' + fuss + "</p>" : "")
      + bahnHilfe("Wo dieser Wagen am Bahnsteig hält, steht erst rund 18 Stunden "
          + "vor Abfahrt fest — dann in der DB-App oder am Wagenstandanzeiger.",
          "Wagenreihung")
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

  // --- Die Alternativen als Zeitband ----------------------------------------
  // Bis zum 09.09.2026 stand hier je Verbindung eine Kopfzeile aus Uhrzeiten
  // und darunter ein Absatz Prosa. Das beantwortete "wann" und sonst nichts:
  // welche Zuege, wo umgestiegen wird, wie lang welcher Teil dauert und wie die
  // Verbindungen zueinander liegen, stand alles im Fliesstext oder gar nicht.
  //
  // Jetzt liegen alle Verbindungen einer Fahrt auf EINER Skala - der Methode
  // aus diagramm-grundlagen (Design_AI): eine Skala, an der jede Marke haengt.
  // Dadurch beantwortet ein Blick vier Fragen zugleich: wann faehrt was, wie
  // lang ist es unterwegs, wo sitzt der Umstieg und wie viel Luft er hat.
  // Die Zugart traegt die Farbe. Sie wird aus der Zugnummer gelesen und nicht
  // als eigenes Feld gefuehrt: die Nummer steht ohnehin da, und ein zweites
  // Feld daneben ist eine zweite Wahrheit, die auseinanderlaeuft.
  //
  // Alle drei Paare gemessen (kontrast.mjs, 09.09.2026): Fern --flaeche auf
  // --umriss 18,33:1, Regional und S-Bahn weiss auf ihrer Flaeche 7,68:1 bzw.
  // 6,13:1. Gruen fuer die S-Bahn ist keine Erfindung, sondern die Farbe, die
  // auf jedem Bahnsteig dafuer steht.
  // --- Der Wert, der sich aendert -------------------------------------------
  // Die Antwort auf "die Seite wirkt tot" ist nicht mehr Bewegung. Eine
  // Staffelung laeuft einmal beim Laden und sagt nichts; sie ist Bewegung, kein
  // Leben. Was fehlte: die Seite wusste nicht, wie spaet es ist.
  //
  // Muster aus Design_AIs wert-und-geste: ein Wert kennt seine Folgen nicht -
  // wer folgen will, meldet sich an, und bei() gibt die ABMELDUNG zurueck.
  // Takt 30 s: fein genug fuer eine Minutenanzeige, grob genug, um im
  // Hintergrund nichts zu kosten.
  var jetztWert = (function () {
    var horcher = [], letzte = null;
    var melden = function () {
      var d = new Date();
      var m = d.getHours() * 60 + d.getMinutes();
      var tag = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2)
        + "-" + ("0" + d.getDate()).slice(-2);
      if (letzte && letzte.minute === m && letzte.tag === tag) return;
      letzte = { minute: m, tag: tag };
      horcher.forEach(function (f) { f(letzte); });
    };
    setInterval(melden, 30000);
    return {
      bei: function (f) {
        horcher.push(f);
        if (letzte) f(letzte);
        return function () {                       // die Abmeldung
          var i = horcher.indexOf(f);
          if (i >= 0) horcher.splice(i, 1);
        };
      },
      anstossen: melden
    };
  }());

  // Die Statuszeile. Sie beantwortet die eine Frage, mit der man diesen Reiter
  // am Reisetag aufschlaegt - "was faehrt als naechstes" - und die es bisher
  // nirgends beantwortet gab. Vor dem Reisetag zaehlt sie hin, danach schweigt
  // sie. Auf dem GRUND, nicht auf der Tafel: darum --auf-grund (16,00:1).
  var bahnStatus = function (f) {
    if (!f || !f.datum) return "";
    var heute = new Date();
    var hTag = heute.getFullYear() + "-" + ("0" + (heute.getMonth() + 1)).slice(-2)
      + "-" + ("0" + heute.getDate()).slice(-2);
    var jetzt = heute.getHours() * 60 + heute.getMinutes();

    // Vor dem Reisetag steht hier NICHTS. Zwei Anlaeufe standen schon da -
    // ein Countdown ("noch ein Tag") und ein Hinweis auf den offenen Punkt
    // ("noch keine Ersatzfahrt gewaehlt"). Beide sagten dem Leser, was er
    // weiss: er hat das Datum zwei Zeilen darueber gelesen, und er sitzt genau
    // deshalb vor dieser Liste. Eine Zeile, die nur da ist, damit dort eine
    // Zeile ist, ist schlechter als keine.
    //
    // Am Reisetag sagt sie etwas, das nirgends sonst steht: was als Naechstes
    // faehrt und in wie vielen Minuten. Dann - und nur dann - steht sie da.
    if (hTag !== f.datum) return "";

    // Am Reisetag: die naechste Abfahrt, die noch zu erreichen ist.
    var kandidaten = [];
    if (f.status !== "ausgefallen" && f.halte && f.halte.length) {
      kandidaten.push({ ab: f.halte[0].ab, was: f.zug, ort: f.halte[0].ort });
    }
    ((f.alternativen || {}).liste || []).forEach(function (v) {
      kandidaten.push({ ab: v.ab, was: (v.abschnitte[0] || {}).zug,
                        ort: (v.abschnitte[0] || {}).von });
    });
    var naechste = null;
    kandidaten.forEach(function (k) {
      var m = bahnMin(k.ab);
      if (m === null || m < jetzt) return;
      if (!naechste || m < bahnMin(naechste.ab)) naechste = k;
    });
    if (!naechste) return "Für heute fährt hier nichts mehr.";
    var hin = bahnMin(naechste.ab) - jetzt;
    var dauer = hin < 60 ? "in " + hin + " min"
      : "in " + Math.floor(hin / 60) + " h " + ("0" + (hin % 60)).slice(-2);
    return "Als Nächstes: <b>" + naechste.ab + " ab " + naechste.ort
      + "</b> mit " + naechste.was + ", " + dauer + ".";
  };

  // Was vorbei ist, tritt zurueck. Dadurch schrumpft die Tafel im Tagesverlauf
  // von vierzehn brauchbaren Verbindungen auf sechs auf zwei - die Seite tut
  // etwas, ohne dass jemand sie anfasst. Nur am Reisetag: an jedem anderen Tag
  // waere jede Verbindung "vorbei" und die Tafel durchgehend blass.
  var bahnVergangen = function (wurzel, f) {
    if (!wurzel || !f || !f.datum) return;
    jetztWert.bei(function (t) {
      var amTag = t.tag === f.datum;
      Array.prototype.forEach.call(wurzel.querySelectorAll(".verb"), function (el) {
        var ab = bahnMin(el.dataset.ab || "");
        el.classList.toggle("verb--vorbei", amTag && ab !== null && ab < t.minute);
      });
      // Der Ring wandert auf die naechste Abfahrt. Ohne Reisetag traegt ihn
      // keine: eine "naechste Verbindung" gibt es an einem anderen Tag nicht,
      // und der Ring soll nicht irgendwo leuchten, damit er leuchtet.
      var naechste = null;
      Array.prototype.forEach.call(wurzel.querySelectorAll(".verb"), function (el) {
        var ab = bahnMin(el.dataset.ab || "");
        if (!amTag || ab === null || ab < t.minute) return;
        if (!naechste || ab < bahnMin(naechste.dataset.ab)) naechste = el;
      });
      Array.prototype.forEach.call(wurzel.querySelectorAll(".verb"), function (el) {
        el.classList.toggle("verb--tipp", el === naechste);
      });

      var linie = wurzel.querySelector(".jetzt-linie");
      if (linie) {
        var von = +linie.dataset.von, bis = +linie.dataset.bis;
        var drin = amTag && t.minute >= von && t.minute <= bis;
        linie.hidden = !drin;
        if (drin) {
          linie.style.left = ((t.minute - von) / (bis - von) * 100).toFixed(2) + "%";
        }
      }
    });
    jetztWert.anstossen();
  };

  // Ein Info-Knopf mit nativem Popover. Bewusst nicht selbst gebaut: die
  // Popover-API schliesst bei Escape und bei einem Klick daneben, gibt den
  // Fokus zurueck und legt das Panel in die oberste Ebene - lauter Dinge, die
  // eine handgebaute Loesung erst nach mehreren Runden richtig macht.
  //
  // Die laufende Nummer macht die id eindeutig. Zwei Popover mit derselben id
  // oeffnen beide dasselbe Panel, und der zweite Knopf tut scheinbar nichts.
  var popZaehler = 0;
  var bahnHilfe = function (text, titel) {
    if (!text) return "";
    var id = "pop-" + (++popZaehler);
    return '<button type="button" class="info-knopf" popovertarget="' + id + '"'
      + ' aria-label="' + (titel || "Hinweis") + '">i</button>'
      + '<div popover id="' + id + '" class="pop">'
      + (titel ? '<h4 class="pop-titel">' + titel + "</h4>" : "")
      + "<p>" + text + "</p></div>";
  };

  // --- Fallblattanzeige ------------------------------------------------------
  // Ziffern ROLLEN auf ihren Zielwert zu - sie springen nicht. Der Unterschied
  // ist kein Geschmack: die erste Fassung wuerfelte mit Math.random() und zeigte
  // dabei gemessen "51:81", "19:44", "11:93", "16:96" - Uhrzeiten, die es nicht
  // gibt, fuer bis zu 1,6 Sekunden. Auf einer Seite, deren Zweck Abfahrtszeiten
  // sind, ist das kein Effekt, sondern eine Falschangabe.
  //
  // Sequenziell hochgezaehlt ist jeder Zwischenstand eine Ziffer UNTERWEGS zur
  // richtigen, so wie es eine echte Fallblattanzeige tut. Aus dem entschluessel-
  // ten Text der bewegungs-werkbank bleibt der tragende Befund: ZWEI Takte. Mit
  // nur einem wechselt jedes Bild, das flimmert und ist unlesbar.
  var fallblatt = function (el) {
    var ziel = el.textContent;
    if (!/\d/.test(ziel) || el.dataset.rollt) return;
    el.dataset.rollt = "1";

    // Je Stelle: wie viele Schritte rollt sie noch? Vorne wenig, hinten mehr,
    // damit die Anzeige von links nach rechts einrastet.
    var rest = [];
    for (var k = 0; k < ziel.length; k++) {
      rest[k] = /\d/.test(ziel.charAt(k)) ? 3 + k * 2 : 0;
    }
    var letzterSchritt = 0, letzterWechsel = 0;
    var TAKT_STEHEN = 70, TAKT_ROLLEN = 45;

    var lauf = function (jetzt) {
      if (!letzterSchritt) { letzterSchritt = letzterWechsel = jetzt; }
      var offen = false, i;
      if (jetzt - letzterSchritt >= TAKT_STEHEN) {
        letzterSchritt = jetzt;
        for (i = 0; i < rest.length; i++) { if (rest[i] > 0) { rest[i]--; break; } }
      }
      if (jetzt - letzterWechsel >= TAKT_ROLLEN) {
        letzterWechsel = jetzt;
        for (i = 0; i < rest.length; i++) { if (rest[i] > 0) rest[i]--; }
      }
      var s = "";
      for (i = 0; i < ziel.length; i++) {
        if (rest[i] > 0) {
          offen = true;
          // rueckwaerts von der Zielziffer weg, damit sie darauf ZULAEUFT
          s += String((+ziel.charAt(i) - rest[i] % 10 + 10) % 10);
        } else {
          s += ziel.charAt(i);
        }
      }
      el.textContent = s;
      if (offen) {
        requestAnimationFrame(lauf);
      } else {
        el.textContent = ziel;
        delete el.dataset.rollt;
      }
    };
    requestAnimationFrame(lauf);
  };

  // Gerollt wird NUR beim ersten Aufbau einer Fahrt, nicht bei jedem
  // Reiterwechsel und nicht beim Aufklappen. Der Wechsel ist die haeufigste
  // Geste auf diesem Reiter; ein Effekt, der dabei jedes Mal laeuft, ist beim
  // dritten Mal Wartezeit. Und gerollt wird nur, was sich aendern KANN - die
  // gebuchte Abfahrt 14:18 steht seit dem Kauf fest.
  var schonGerollt = {};
  var fallblattAlle = function (wurzel, schluessel) {
    if (!wurzel || schonGerollt[schluessel]) return;
    var wert = getComputedStyle(document.documentElement)
      .getPropertyValue("--bewegung").trim();
    if (wert === "0") return;                       // prefers-reduced-motion
    schonGerollt[schluessel] = true;
    var felder = wurzel.querySelectorAll(".verb-zeit b");
    Array.prototype.forEach.call(felder, function (el, k) {
      setTimeout(function () { fallblatt(el); }, Math.min(k, 12) * 35);
    });
  };

  var bahnZugArt = function (zug) {
    if (/^S\s*\d/.test(zug)) return "sbahn";
    if (/^(RE|RB|IRE)\b/.test(zug)) return "regio";
    return "fern";
  };

  // Ein Zugschild, nach dem Muster der Linienschilder auf der Karte: kraeftige
  // Flaeche, Umriss-Ring, und ein fetter Grotesk statt der Pixelschrift. Die
  // Begruendung steht dort schon (stil.css, .linie--klein): Silkscreen hat
  // keine Unterlaengen und zerfaellt unter 10 px - bei 9 px meldete
  // pruef-breite.mjs 327 Stellen unter der Schwelle.
  //
  // Die Klammer hinter der Nummer ("RE 1 (19011)") faellt weg: die Fahrtnummer
  // ist fuer die Puenktlichkeitsabfrage da, nicht fuer den Bahnsteig.
  var bahnSchild = function (zug, klein) {
    return '<span class="zug-schild zug-schild--' + bahnZugArt(zug)
      + (klein ? " zug-schild--klein" : "") + '">'
      + zug.replace(/\s*\(.*\)/, "") + "</span>";
  };

  var bahnMin = function (hhmm) {
    var t = /^(\d{1,2}):(\d{2})$/.exec(hhmm || "");
    return t ? +t[1] * 60 + +t[2] : null;
  };
  var bahnUhr = function (m) {
    return (m / 60 | 0) % 24 + ":" + ("0" + (m % 60)).slice(-2);
  };

  // Die Skala umfasst alle Verbindungen der Fahrt und rastet auf volle Stunden.
  // Je Verbindung eine eigene Skala waere bequemer zu rechnen und wertlos: dann
  // sieht jede Verbindung gleich lang aus, und genau der Vergleich ist der
  // Zweck der Ansicht.
  var bahnSkala = function (liste) {
    var von = Infinity, bis = -Infinity;
    liste.forEach(function (v) {
      var a = bahnMin(v.ab), e = bahnMin(v.an);
      if (a === null || e === null) return;
      if (e < a) e += 1440;                       // ueber Mitternacht
      von = Math.min(von, a); bis = Math.max(bis, e);
    });
    if (von === Infinity) return null;
    return { von: Math.floor(von / 60) * 60, bis: Math.ceil(bis / 60) * 60 };
  };

  var bahnSpur = function (v, skala) {
    var teile = [], vorher = null;
    var breite = skala.bis - skala.von;
    var pct = function (m) { return ((m - skala.von) / breite * 100).toFixed(2) + "%"; };

    (v.abschnitte || []).forEach(function (a) {
      var ab = bahnMin(a.ab), an = bahnMin(a.an);
      if (ab === null || an === null) return;
      if (an < ab) an += 1440;
      if (ab < skala.von) { ab += 1440; an += 1440; }
      if (vorher !== null && ab > vorher) {
        var wart = ab - vorher;
        // Zwei Stufen, wie beim Zug. Die erste Fassung schnitt bei 7 % ab -
        // gerechnet auf eine Skala von acht Stunden. Seit sie bis Mitternacht
        // reicht, sind 720 Minuten das Ganze, und damit liegt ein 47-Minuten-
        // Umstieg bei 6,5 %: von vierzehn Verbindungen zeigte genau eine ihre
        // Wartezeit. Die Einheit faellt zuerst, die Zahl zuletzt.
        var umsAnteil = (ab - vorher) / breite * 100;
        // "47" braucht 26 px = 3,7 %, "47 min" braucht 50 px = 7,5 %. Die
        // 3,7 sind knapp gewaehlt, damit der kuerzeste zulaessige Umstieg
        // seine Zahl behaelt: 27 min sind auf dieser Skala 3,75 %, und
        // ausgerechnet der knappe Umstieg darf nicht der stumme sein.
        var umsText = umsAnteil >= 7.5 ? '<b class="mit-einheit">' + wart + "</b>"
          : umsAnteil >= 3.7 ? "<b>" + wart + "</b>" : "";
        teile.push('<span class="spur-teil spur-teil--ums'
          + (wart < 20 ? " spur-teil--knapp" : "") + '" style="left:' + pct(vorher)
          + ";width:" + umsAnteil.toFixed(2) + '%">' + umsText + "</span>");
      }
      // Die Minutenzahl faellt weg, wo der Abschnitt sie nicht traegt: unter
      // 15 % der Skalenbreite stiess sie an den Nachbarn und wurde mitten im
      // Wort abgeschnitten ("S 3 47 mi"). Das Zugschild bleibt immer - es ist
      // die Angabe, ohne die der Balken nichts sagt; die Dauer steht ohnehin
      // in der Tabelle darunter.
      // Drei Stufen statt zwei. Unter 5 % traegt der Balken nicht einmal das
      // Schild - es wurde mitten in der Zugnummer abgeschnitten ("IC"), und
      // ein angeschnittenes Schild ist schlechter als gar keines: es sieht aus
      // wie eine Angabe. Welcher Zug es ist, steht in den Etappen darunter.
      // Die Schwellen sind GERECHNET, nicht geschaetzt. Die Spur ist bei 92ch
      // rund 708 px breit; ein Schild "ICE 517" braucht darin 52 px Text plus
      // 14 px Innenmass plus 14 px Nase = 80 px, also 11 %. Mit Minutenzahl
      // sind es 136 px = 19 %. Vorher standen hier 5 und 15, und bei 5 % wurde
      // "RE 1" mitten im Wort abgeschnitten.
      //
      // Kurze Zubringer tragen damit kein Schild mehr. Das ist der bessere
      // Tausch: die Farbe nennt die Zugart weiterhin, die Nummer steht in den
      // Etappen darunter - ein angeschnittenes Schild nennt nichts und sieht
      // trotzdem nach Angabe aus.
      var anteil = (an - ab) / breite * 100;
      var text = anteil < 11 ? ""
        : bahnSchild(a.zug, true)
          + (anteil >= 19 ? '<i>' + (an - ab) + " min</i>" : "");
      teile.push('<span class="spur-teil spur-teil--zug spur-teil--'
        + bahnZugArt(a.zug) + '" style="left:' + pct(ab)
        + ";width:" + anteil.toFixed(2) + '%">' + text + "</span>");
      vorher = an;
    });

    // Die Stundenmarken sind das, was die Balken vergleichbar macht - ohne sie
    // ist es ein Balken irgendwo, nicht ein Balken um 12:51.
    var marken = "";
    for (var m = skala.von; m <= skala.bis; m += 60) {
      marken += '<span class="spur-marke" style="left:' + pct(m) + '"></span>';
    }
    return '<div class="spur">' + marken + teile.join("") + "</div>";
  };

  var bahnAchse = function (skala, marke) {
    var breite = skala.bis - skala.von, s = "";
    for (var m = skala.von; m <= skala.bis; m += 60) {
      s += '<span class="achse-tick" style="left:'
        + ((m - skala.von) / breite * 100).toFixed(2) + '%">' + bahnUhr(m) + "</span>";
    }
    // Die Marke kommt aus den DATEN, nicht aus dem Skript: welche Uhrzeit auf
    // dieser Achse zaehlt, haengt an der Reise - hier der Check-in im Hotel.
    // Die Rueckfahrt fuehrt keine, dort faehrt man weg statt an.
    var mk = "";
    if (marke && marke.zeit) {
      var mm = bahnMin(marke.zeit);
      if (mm !== null && mm >= skala.von && mm <= skala.bis) {
        mk = '<span class="achse-marke" style="left:'
          + ((mm - skala.von) / breite * 100).toFixed(2) + '%"'
          + (marke.grund ? ' title="' + marke.grund + '"' : "")
          + '><b>' + marke.text + " " + marke.zeit + "</b></span>";
      }
    }
    // Ohne aria-hidden, sobald eine Marke da ist: die Stundenzahlen wiederholen
    // nur, was in den Zeilen steht, die Marke sagt etwas Eigenes.
    return '<div class="achse"' + (mk ? "" : ' aria-hidden="true"') + ">"
      + s + mk + "</div>";
  };

  // Die Auslastung als dreistufiges Zeichen. Sie steht am ABSCHNITT, weil die
  // Prognose am Einstiegsbahnhof haengt und nicht am Zug: derselbe ICE 517 ist
  // ab Mannheim in der 2. Klasse hoch ausgelastet und ab Stuttgart gering.
  //
  // Drei Balken, gefuellt bis zur Stufe - die Farbe ist nie der einzige
  // Traeger (WCAG 1.4.1), die Anzahl gefuellter Balken sagt dasselbe. Wo die
  // Quelle nichts fuehrt, steht nichts: eine graue Null saehe aus wie "leer".
  var AUSLAST = { gering: 1, mittel: 2, hoch: 3, "sehr hoch": 3 };
  var bahnAuslastung = function (a) {
    var s = (a || {}).klasse2;
    var stufe = AUSLAST[s];
    if (!stufe) return "";
    var balken = "";
    for (var k = 1; k <= 3; k++) {
      balken += '<i class="last-balken' + (k <= stufe ? " last-balken--an" : "") + '"></i>';
    }
    return '<span class="last last--' + stufe + '" title="2. Klasse: ' + s
      + ' ausgelastet (Prognose)"><span class="last-zeichen" aria-hidden="true">'
      + balken + '</span><b>' + s + "</b></span>";
  };

  var bahnAltHtml = function (v, skala, i) {
    var umsOrte = (v.umstieg || []).map(function (u) { return u.ort; }).join(", ");
    var gl = function (g) {
      return g && g !== "unbekannt" ? '<span class="gleis">Gl. ' + g + "</span>"
        : '<span class="gleis gleis--offen">Gleis offen</span>';
    };

    // Etappen statt einer Tabellenzeile je Abschnitt. Die Tabelle konnte die
    // Zwischenhalte nicht aufnehmen, ohne dass jede Verbindung 15 Zeilen lang
    // wurde - und der S 3 nach Mannheim haelt dreizehnmal. Als Faltung je
    // Etappe steht die Frage "wo faehrt der lang" da, ohne sie zu beantworten,
    // bis jemand fragt.
    var etappen = (v.abschnitte || []).map(function (a) {
      var h = a.halte;
      var tief = "";
      if (h && h.length) {
        tief = '<details class="halte-mehr"><summary>' + h.length
          + (h.length === 1 ? " Zwischenhalt" : " Zwischenhalte") + "</summary>"
          + '<ol class="band band--tief">'
          + h.map(function (x) { return bahnHalt(x, "band-halt--zwischen"); }).join("")
          + "</ol></details>";
      } else if (h) {
        // Leer und unbekannt sind zwei verschiedene Antworten. Ein Abschnitt
        // ohne Halt sagt das; einer, dessen Lauf nicht abrufbar war, bekommt
        // gar nichts - sonst behauptete die Seite eine Durchfahrt, die niemand
        // geprueft hat.
        tief = '<p class="etappe-durch">ohne Zwischenhalt</p>';
      }
      return '<li class="etappe">'
        + '<div class="etappe-kopf">' + bahnSchild(a.zug) + bahnAuslastung(a.auslastung)
        +   '<span class="etappe-weg">'
        +     '<span class="etappe-halt"><b>' + a.ab + "</b>" + a.von + gl(a.gleis_ab)
        +     "</span>"
        +     '<i class="etappe-pfeil" aria-hidden="true">→</i>'
        +     '<span class="etappe-halt"><b>' + a.an + "</b>" + a.nach + gl(a.gleis_an)
        +     "</span>"
        +   "</span>"
        + "</div>" + tief
        + "</li>";
    }).join("");

    // --i traegt die Staffelung. Sie steht als Variable im Markup und nicht
    // als n-ter Regelsatz im CSS: vierzehn Regeln fuer vierzehn Zeilen waeren
    // beim fuenfzehnten Eintrag falsch.
    return '<details class="verb" data-ab="' + v.ab
      + '" style="--i:' + (i || 0) + '">'
      + '<span class="bb-ring" aria-hidden="true"></span>'
      + '<span class="bb-glut" aria-hidden="true"></span>'
      + '<summary class="verb-kopf"><span class="verb-zeile">'
      +   '<span class="verb-zeit"><b>' + v.ab + "</b><i>→</i><b>" + v.an + "</b></span>"
      +   '<span class="verb-dauer">' + v.dauer + "</span>"
      +   '<span class="verb-weg">' + (v.umstiege === 0 ? "ohne Umstieg"
          : "umsteigen in " + umsOrte) + "</span>"
      // Die erwartete Ankunft steht NEBEN der planmaessigen, nie statt ihr: sie
      // ist aus dem Puenktlichkeitsmittel gerechnet und damit weicher als der
      // Fahrplan. Ersetzte sie ihn, saehe eine Schaetzung aus wie eine Tafel.
      +   (v.erwartet ? '<span class="verb-real">real ~' + v.erwartet + "</span>" : "")
      +   (v.hinweis ? '<span class="alt-flagge'
          + (v.hinweis_warn ? " alt-flagge--warn" : "") + '">' + v.hinweis + "</span>" : "")
      +   bahnAuslastung((v.abschnitte[v.abschnitte.length - 1] || {}).auslastung)
      +   bahnHilfe(v.robust, v.ab + " → " + v.an)
      +   "</span>"
      // Die Spur steht IM summary, nicht im aufklappbaren Teil. Dort lag sie bis
      // zum 09.09.2026 - und damit war sie genau bei einer Verbindung sichtbar,
      // waehrend die gemeinsame Skala nur Sinn hat, wenn man die Balken
      // NEBENEINANDER sieht. Ein <summary> darf Flow-Content tragen.
      +   bahnSpur(v, skala)
      + "</summary>"
      + '<div class="verb-tief">'
      +   '<ol class="etappen">' + etappen + "</ol>"
      + "</div></details>";
  };

  // Die Alternativen haengen an IHRER Fahrt. Ohne Ersatzverbindungen faellt der
  // Abschnitt ganz weg - eine leere Ueberschrift behauptet, es gaebe dort etwas
  // zu holen.
  var bahnAltBlock = function (alt, tag) {
    if (!alt || !(alt.liste || []).length) return "";
    var skala = bahnSkala(alt.liste);
    return '<section class="alt-block">'
      + '<div class="alt-kopfzeile">'
      +   '<h3 class="alt-titel">' + (alt.titel || "Alternativen") + "</h3>"
      // Das Datum stand bis zum 09.09.2026 nur oben an der Fahrt. Wer zu den
      // Alternativen scrollte, sah sechs Uhrzeiten ohne Tag - und die Frage
      // "ist das ueberhaupt mein Reisetag?" blieb offen.
      +   (tag ? '<span class="alt-tag">' + tag + "</span>" : "")
      +   bahnHilfe(alt.lage, "Warum jede Fahrt umsteigt")
      + "</div>"
      + ((alt.regeln || alt.stand) ? '<details class="wie"><summary>Wie gesucht wurde'
          + "</summary><div class=\"wie-inhalt\">"
          + (alt.regeln ? "<ul>" + alt.regeln.map(function (r) {
              return "<li>" + r + "</li>"; }).join("") + "</ul>" : "")
          + (alt.stand ? "<p>" + alt.stand + "</p>" : "")
          + (alt.auslastung_stand ? "<p>" + alt.auslastung_stand + "</p>" : "")
          + "</div></details>" : "")
      + (skala ? '<div class="skala">'
          + '<span class="jetzt-linie" data-von="' + skala.von
          + '" data-bis="' + skala.bis + '" hidden><b>jetzt</b></span>'
          + bahnAchse(skala, alt.marke)
          + alt.liste.map(function (v, i) { return bahnAltHtml(v, skala, i); }).join("")
          + "</div>" : "")
      + "</section>";
  };

  var bahnFahrtHtml = function (f) {
    return '<div class="fahrt">'
      + '<div class="fahrt-kopf">'
      +   '<div><p class="fahrt-richtung">' + f.richtung + "</p>"
      +   '<p class="fahrt-tag">' + f.tag + (f.zug ? " · " + f.zug : "")
      +     (f.dauer ? " · " + f.dauer : "") + "</p></div>"
      +   '<span class="kopf-rechts">' + bahnMarke(f.status, f.status_text)
      +     bahnHilfe(f.meldung, f.richtung + ", " + f.tag) + "</span>"
      + "</div>"
      + bahnBand(f.halte, f.zug)
      + '<div class="fahrt-kacheln">'
      +   (f.ticket ? '<section class="kachel"><h3 class="kachel-titel">Ticket</h3>'
          + bahnTicket(f.ticket) + "</section>" : "")
      +   (f.reservierung ? '<section class="kachel"><h3 class="kachel-titel">Reservierung</h3>'
          + bahnPlatz(f.reservierung) + "</section>" : "")
      + "</div>"
      + bahnAltBlock(f.alternativen, f.tag)
      + "</div>";
  };

  (function () {
    var navB = document.getElementById("bahn-reiter");
    var zielB = document.getElementById("bahn-tafel");
    if (!navB || !zielB || !bahnFahrten.length) return;

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
      var f = bahnFahrten.filter(function (x) { return x.id === id; })[0];
      // .grund-fuss, nicht .tafel-fuss: der Fuss steht HIER auf dem dunklen
      // Grund und nicht auf der hellen Tafel. Mit .tafel-fuss mass
      // pruef-farben.mjs 2,16:1 - dieselbe Verwechslung, die stil.css schon
      // einmal dokumentiert hat.
      var status = bahnStatus(f);
      zielB.innerHTML = (status ? '<p class="jetzt-satz">' + status + "</p>" : "")
        + (f ? bahnFahrtHtml(f) : "")
        + '<p class="grund-fuss">' + (bahnDaten.quelle || "")
        + " · Auftragsnummer und Name stehen nicht auf dieser Seite.</p>";
      fallblattAlle(zielB, id);
      bahnVergangen(zielB, f);
    };
    bahnFahrten.forEach(function (f) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "unterknopf" + (f.status === "ausgefallen" ? " unterknopf--warn" : "");
      b.dataset.id = f.id;
      b.setAttribute("aria-pressed", f.id === offen ? "true" : "false");
      b.textContent = f.label;
      b.addEventListener("click", function () { zeige(f.id); });
      knoepfeB.push(b);
      navB.appendChild(b);
    });
    zeige(offen);
  }());

  // --- Bahn-Reiter Ende ------------------------------------------------------
  // Dieser Marker ist kein Schmuck: bau-vorschau.py schneidet den Block hier
  // heraus und suchte dafuer die Zeichenfolge "}());". Seit der jetzt-Wert
  // selbst eine IIFE ist, gibt es die im Block zweimal - der Schnitt landete
  // mitten im Code, die Vorschau zeigte nur noch die Ueberschrift. Ein Marker
  // kommt genau einmal vor.

  // --- Die Hotelkarte: Umgebung UND Anfahrt ---------------------------------
  // EINE Karte, nicht zwei. Am 09.09.2026 standen hier kurzzeitig zwei
  // untereinander - eine fuer den Weg vom Hauptbahnhof, eine fuer die Umgebung.
  // Beide zeigten dieselbe Stadt, dieselben Marken, dieselbe Unterkunft in der
  // Mitte. Zwei Karten uebereinander liest man als zwei Orte, und man vergleicht
  // sie, statt sie zu benutzen.
  //
  // Was die beiden trennte, war nur der AUSSCHNITT - einen Kilometer gegen
  // dreieinhalb. Ein Ausschnitt ist aber kein Grund fuer eine zweite Karte,
  // sondern ein Zustand derselben. Das Untermenue schaltet ihn:
  //
  //   Umgebung    -> Zoom auf die Unterkunft, kein Weg gezeichnet
  //   S-Bahn/Tram/zu Fuss -> Weg gezeichnet, Ausschnitt auf den ganzen Weg
  //
  // Die Filterleiste unter der Karte gilt in beiden Zustaenden: sie schaltet
  // Kartenebenen, das Untermenue schaltet den Ausschnitt. Zwei Steuerungen,
  // jede fuer genau eine Sache - dieselbe Trennung wie auf dem Innenstadt-Reiter.
  //
  // Die Farben sind aus der vorhandenen Palette geliehen statt neu erfunden -
  // eine eigene Legende macht die Wiederverwendung eindeutig, und neun neue
  // Hues waeren im Farbkreis ohnehin nicht mehr unterzubringen.
  // Die Ebenen der Umgebungskarte. Die ersten fuenf sind GENAU die Kuechen des
  // Innenstadt-Reiters - aus derselben Tabelle gebaut und nicht neben ihr
  // abgeschrieben, damit Beschriftung und Zeichen der beiden Karten nicht
  // auseinanderlaufen koennen. Bis zum 09.09.2026 hiess SMASH IT! Haidhausen
  // hier "Essen" und dort "Smash-Laden"; dieselbe Seite gab demselben Ort zwei
  // Namen.
  //
  // 'umkreis' ist der Rest: was nur die Umkreisabfrage kennt. Es traegt Gabel
  // und Messer - EIN Zeichen fuer beide Abfragen (Restaurant und Café), weil die
  // Tasse hier schon das kuratierte Fruehstueck bedeutet. Welche Kategorie
  // Google gemeldet hat, steht in der Sprechblase.
  var UMG_ARTEN = {};
  GASTRO.forEach(function (k) { UMG_ARTEN[k.id] = { label: k.label, symbol: k.symbol }; });
  UMG_ARTEN.umkreis = { label: "Lokale im Umkreis", symbol: "essen" };
  UMG_ARTEN.einkauf = { label: "Einkaufen",         symbol: "einkauf" };
  var umgSymbol = function (gruppe) {
    return (UMG_ARTEN[gruppe] || {}).symbol || gruppe;
  };
  var ART_LABEL = { sbahn: "S-Bahn / DB", ubahn: "U-Bahn", tram: "Tram", bus: "Bus" };

  // --- Betriebslagen: was der Fahrplan nicht erklaert -----------------------
  // Der Feed sagt, DASS ein Abschnitt Ersatzverkehr ist (Agentur "SEV ..."),
  // aber nicht bis wann, warum und wo der Ersatzhalt steht. Das steht von Hand
  // in reise.json und wird hier ueber den Liniennamen angehaengt.
  //
  // Zweimal gezeigt, an beiden Stellen, an denen man darauf stoesst:
  //   in der Sprechblase der Linie auf der Karte - dort klickt man hin, wenn
  //   man wissen will, was das fuer eine Linie ist;
  //   hinter einem Aufklapper unter dem Streckenband - dort liest man den Weg.
  // Der WARNSATZ bleibt in beiden Faellen sichtbar; nur die Einzelheiten
  // klappen weg. Eine Bedingung hinter einem Klick ist keine Bedingung mehr.
  var STOERUNGEN = {};
  (DATEN.stoerungen || []).forEach(function (st) { STOERUNGEN[st.linie] = st; });

  var stoerungZu = function (a) {
    return a && a.linie ? (STOERUNGEN[a.linie] || null) : null;
  };

  // Die Einzelheiten. Als Absatzfolge, damit sie in eine Leaflet-Sprechblase
  // genauso passt wie unter das Band.
  var stoerungFakten = function (st) {
    return '<p class="stoer-zeile"><b>' + st.zeitraum + "</b> · " + st.grund + "</p>"
      + "<p>" + st.was + "</p>"
      + (st.halte ? '<p class="stoer-halte"><b>Der Ersatzbus hält:</b> ' + st.halte + "</p>" : "")
      + (st.hinweise || []).map(function (h) { return '<p class="stoer-warn">' + h + "</p>"; }).join("")
      + '<p class="popup-fein">' + st.quelle
      + (st.url ? ' — <a href="' + st.url + '" target="_blank" rel="noopener noreferrer">'
                  + "MVG ↗</a>" : "") + "</p>";
  };

  // Jede so gebaute Karte meldet sich hier an, damit zeige() sie neu vermessen
  // kann. Ohne Registrierung braeuchte jeder neue Reiter eine eigene Zeile in
  // zeige() - und wer sie vergisst, bekommt eine graue Flaeche, die aussieht wie
  // eine Karte, die noch laedt.
  var WEG_KARTEN = {};

  function wegKarte (cfg) {
    var u = cfg.umgebung;
    var behaelter = document.getElementById(cfg.karte);
    if (!u || !behaelter) return;
    var w = cfg.weg;

    // Der Ausschnitt wird NICHT beim Zeichnen gesetzt, sondern erst, wenn der
    // Reiter offen ist. Leaflet vermisst seinen Behaelter beim Anlegen; in einem
    // [hidden]-Abschnitt ist der 0 px breit, und fitBounds rechnet daraus die
    // groesstmoegliche Zoomstufe. Die Karte stand danach auf Zoom 19 mitten im
    // Nichts - und pruef-farben.mjs meldete den ausgegrauten Plusknopf mit 1,75:1,
    // eine Meldung, die auf die Farbe zeigt und die Ursache verschweigt.
    var karteHotelAnpassen = null;

    var karteHotel = L.map(cfg.karte, { scrollWheelZoom: true })
      .setView([u.bezug.lat, u.bezug.lon], 15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(karteHotel);
    // Auf BEIDEN so gebauten Reitern - Hotel und Bavaria -, weil sie dieselbe
    // Funktion sind. Wer hier einen Knopf anhaengt, haengt ihn zweimal an.
    standortKnopf(karteHotel);

    // KEIN Umkreis-Kreis. Er stand hier, solange der Filter eine Luftlinie war -
    // und war dann ehrlich. Jetzt filtert die gemessene GEHZEIT, und ein Kreis
    // wuerde behaupten, alles darin sei in 15 Minuten erreichbar. Das ist
    // falsch: hinter der Isar liegt ein Punkt bei 700 m Luftlinie ueber der
    // Grenze, an derselben Strasse einer bei 1100 m darunter.

    L.marker([u.bezug.lat, u.bezug.lon], {
      icon: L.divIcon({ className: "", html: ortSymbol(cfg.ziel_art, true),
                        iconSize: [40, 40], iconAnchor: [20, 20] }),
      title: u.bezug.name, riseOnHover: true
    }).addTo(karteHotel).bindPopup("<h3>" + u.bezug.name + "</h3>"
      + "<p>Der Bezugspunkt dieser Karte.</p>" + mapsLink(u.bezug));

    // Gehzeit statt Luftlinie: sie ist gemessen, sie ist die Vorgabe, und sie
    // ist das, was jemand wissen will.
    var gehText = function (o) {
      if (o.gehzeit_s == null) return o.meter + " m Luftlinie · Gehzeit unbekannt";
      return Math.round(o.gehzeit_s / 60) + " min zu Fuß · " + o.gehweg_m + " m Weg";
    };

    var gruppen = {};
    Object.keys(UMG_ARTEN).forEach(function (a) { gruppen[a] = L.layerGroup().addTo(karteHotel); });
    // Je Verkehrsmittel eine EIGENE Ebene, nicht eine Sammelebene "Halte":
    // wer zu Fuss zur Tram will, soll die Busse nicht mit ausschalten muessen.
    var halteEbenen = {};

    u.lokale.forEach(function (l) {
      if (!gruppen[l.gruppe]) return;
      var note = l.bewertung == null ? null
        : '<p class="bewertung"><strong>' + l.bewertung + " ★</strong> aus "
          + (l.stimmen || 0).toLocaleString("de-DE") + " Bewertungen</p>";
      L.marker([l.lat, l.lon], {
        icon: L.divIcon({ className: "", html: ortSymbol(umgSymbol(l.gruppe), false),
                          iconSize: [30, 30], iconAnchor: [15, 15] }),
        title: l.name + (l.bewertung == null ? "" : " — " + l.bewertung + "★") + ", " + gehText(l),
        keyboard: false
      })
        .addTo(gruppen[l.gruppe])
        .bindPopup("<h3>" + l.name + "</h3>"
          + "<p>" + l.art + " · " + gehText(l) + "</p>"
          + (note || "")
          // Die Prosa des kuratierten Eintrags. Sie ist der Grund, warum dieser
          // Ort auf der Liste steht - und der Unterschied zu einem Treffer, den
          // nur die Beliebtheitssortierung nach oben gespuelt hat.
          + (l.kuratiert && l.kuratiert.notiz
              ? "<p>" + l.kuratiert.notiz + "</p>" : "")
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

      // Dieselben Linienschilder wie auf der Startseite - und wie dort ZOOMABHAENGIG.
      // Sie standen hier bis zum 09.09.2026 dauerhaft, mit der Begruendung, diese
      // Karte zeige nur einen Kilometer. Seit sie auch den ganzen Weg vom
      // Hauptbahnhof zeigt, stimmt das nicht mehr: im Wegausschnitt lagen an der
      // Unterkunft fuenfzehn Schilder uebereinander und verdeckten genau die
      // Gegend, um die es geht.
      var sch = schild(h);
      if (sch) {
        m.bindTooltip(sch, { permanent: true, direction: "right", offset: [14, 0],
                             className: "halt-schild", interactive: false });
      }
    });

    // --- Essen an der Strecke, als eigene Ebene ------------------------------
    // Diese Marken messen ihre Gehzeit NICHT vom Bezugspunkt der Karte, sondern
    // von IHREM Halt. Das ist der ganze Zweck: rund um die Studios ist nichts,
    // aber die Tram faehrt an Wirtshaeusern vorbei, und dort steigt man aus.
    // Eine gemeinsame Ebene mit den Umgebungslokalen wuerde zwei verschiedene
    // Gehzeiten unter demselben Zeichen zeigen.
    var essenEbene = null;
    if (cfg.essen && cfg.essen.orte && cfg.essen.orte.length) {
      essenEbene = L.layerGroup().addTo(karteHotel);
      cfg.essen.orte.forEach(function (o) {
        var weg = o.gehzeit_s == null
          ? "Gehzeit unbekannt"
          : Math.round(o.gehzeit_s / 60) + " min zu Fuß";
        L.marker([o.lat, o.lon], {
          icon: L.divIcon({ className: "", html: ortSymbol("wirtshaus", false),
                            iconSize: [30, 30], iconAnchor: [15, 15] }),
          title: o.kurz + " — ab " + o.halt.name + " " + weg,
          keyboard: false
        })
          .addTo(essenEbene)
          .bindPopup("<h3>" + o.kurz + "</h3>"
            + "<p>Ab Halt <strong>" + o.halt.name + "</strong> · " + weg
            + (o.gehweg_m != null ? " · " + o.gehweg_m + " m" : "") + "</p>"
            + (o.bewertung != null
                ? '<p class="bewertung"><strong>' + String(o.bewertung).replace(".", ",")
                  + " ★</strong>" + (o.stimmen != null
                      ? " aus " + o.stimmen.toLocaleString("de-DE") + " Bewertungen" : "") + "</p>"
                : "")
            // Der FREITAG steht da, nicht die ganze Woche: der Reiter handelt
            // von einem Abend. Fehlt die Zeile, steht das auch so da - "keine
            // Angabe" ist etwas anderes als "geschlossen".
            + '<p class="popup-fein">' + (o.freitag || "Öffnungszeiten nicht hinterlegt") + "</p>"
            + (o.notiz ? '<p class="popup-fein">' + o.notiz + "</p>" : "")
            + mapsLink(o));
      });
    }

    // --- Der Weg vom Hauptbahnhof, als Ebene derselben Karte ----------------
    // Die Farben sind dieselben, die die Verkehrsmittel schon tragen.
    var MITTEL = {
      fuss:  { label: "zu Fuß", farbe: "--tinte-leise", kuerzel: null },
      sbahn: { label: "S-Bahn", farbe: "--m-sbahn",    kuerzel: "S" },
      ubahn: { label: "U-Bahn", farbe: "--m-ubahn",    kuerzel: "U" },
      tram:  { label: "Tram",   farbe: "--m-tram",     kuerzel: "T" },
      bus:   { label: "Bus",    farbe: "--m-ankunft",  kuerzel: "B" }
    };
    var mittel = function (art) { return MITTEL[art] || MITTEL.fuss; };

    // Die Farbe des Wegs: die AMTLICHE Linienfarbe, wenn genau eine Linie diese
    // Strecke bedient - sonst die Farbe des Verkehrsmittels.
    //
    // Die Unterscheidung ist keine Kosmetik. Auf der Stammstrecke fahren S2, S3,
    // S5 und S8 dieselben vier Halte; eine davon herauszugreifen und ihr Gruen,
    // Lila, Blau oder Gelb ueber den ganzen Weg zu legen, hiesse: nimm DIESE.
    // Falsch - man nimmt die naechste. Dort steht darum das S-Bahn-Gruen, das
    // fuer alle vier gilt. Die Tram 17 faehrt allein, und ihr Braun ist genau
    // die Farbe, die im Netzplan und am Fahrzeug steht.
    var wegFarbe = function (v, art) {
      var l = (v.linien || []).filter(Boolean);
      if (l.length === 1) {
        var f = FARBEN[l[0].replace(/^(Tram|Bus) /, "")];
        if (f) return f.farbe;
      }
      return token(mittel(art).farbe);
    };
    // Das Verkehrsmittel, nach dem die Variante heisst: der erste Abschnitt,
    // der kein Fussweg ist. Beim reinen Fussweg bleibt es dabei.
    var hauptmittel = function (v) {
      var f = v.abschnitte.filter(function (a) { return a.art !== "fuss"; })[0];
      return f ? f.art : "fuss";
    };

    var wegEbene = L.layerGroup().addTo(karteHotel);
    var wegBereich = null;

    // Eine Variante kann eine RICHTUNG sein, nicht nur ein Verkehrsmittel: der
    // Bavaria-Reiter fuehrt Hin- und Rueckweg, und beim Rueckweg ist der
    // Bezugspunkt der Karte der START. Welcher der beiden Endpunkte die eigene
    // Marke bekommt, wird darum ausgerechnet - es ist der, der nicht der
    // Bezugspunkt ist. Ihn fest als "von" zu nehmen setzte beim Rueckweg die
    // Ankunftsmarke auf die Unterkunft und die Unterkunftsmarke ans Studio.
    var istBezug = function (p) {
      return Math.abs(p.lat - u.bezug.lat) < 0.001 && Math.abs(p.lon - u.bezug.lon) < 0.001;
    };
    var gegenpunkt = function (v) { return istBezug(v.von) ? v.nach : v.von; };

    // Die Namen der Ein- und Ausstiege des Wegs stehen dauerhaft an ihrer Marke:
    // auf dieser Karte tragen nur sie diese Klasse, es ist also nichts zu
    // verdecken - und der Name IST hier die Auskunft. Eine Marke, die man erst
    // anklicken muss, verschweigt sie.
    behaelter.classList.add("zeigt-namen");

    // Ab Zoom 15 - dem Umgebungsausschnitt - tragen die Halte ihre Linien.
    // Eine Stufe darunter faellt das uebereinander.
    var schilderHotel = function () {
      behaelter.classList.toggle("zeigt-schilder", karteHotel.getZoom() >= 15);
    };
    karteHotel.on("zoomend", schilderHotel);
    schilderHotel();

    karteHotelAnpassen = function () {
      // Ein Behaelter ohne Breite ist nicht vermessen, sondern verdeckt. Ein
      // Ausschnitt, der daraus gerechnet wird, ist erfunden.
      if (behaelter.clientWidth < 40) return;
      if (wegBereich) karteHotel.fitBounds(wegBereich, { padding: [32, 32] });
      else karteHotel.setView([u.bezug.lat, u.bezug.lon], 15);
    };

    var zeichne = function (v) {
      wegEbene.clearLayers();
      var gezeichnet = [];
      if (!v) { wegBereich = null; karteHotelAnpassen(); return; }

      var gegen = gegenpunkt(v);
      var punkte = [[gegen.lat, gegen.lon], [u.bezug.lat, u.bezug.lon]];
      v.abschnitte.forEach(function (a) {
        if (!a.geo || !a.geo.length) return;
        punkte = punkte.concat(a.geo);
        var fuss = a.art === "fuss";
        // DUNKLE Fassung unter der Linie, nicht mehr die weisse: seit die Linie
        // ihre amtliche Farbe traegt, ist die Farbe nicht mehr gewaehlt, sondern
        // vorgegeben - und eine helle amtliche Farbe (S8 ist Gelb) verschwaende
        // auf hellen Kacheln in einem weissen Saum. Ein dunkler Saum traegt
        // jede Linienfarbe, hell wie dunkel, auf jedem Untergrund.
        L.polyline(a.geo, { color: token("--umriss"), weight: fuss ? 9 : 12,
                            opacity: 0.9, lineCap: "round", lineJoin: "round",
                            interactive: false }).addTo(wegEbene);
        var kern = L.polyline(a.geo, { color: fuss ? token("--saum") : wegFarbe(v, a.art),
                            weight: fuss ? 5 : 7,
                            dashArray: fuss ? "1 10" : null,
                            lineCap: "round", lineJoin: "round" })
          .addTo(wegEbene)
          .bindPopup("<h3>" + (fuss ? "Fußweg" : (a.linie || mittel(a.art).label)) + "</h3>"
            + "<p>" + a.minuten + " min"
            + (fuss && a.meter ? " · " + a.meter + " m" : "")
            + (a.zwischenhalte && a.zwischenhalte.length
                ? " · " + (a.zwischenhalte.length + 1) + " Halte" : "")
            + "</p>"
            + '<p class="popup-fein">' + (a.von || v.von.name) + " → "
            + (a.nach || v.nach.name) + "</p>"
            // Wer auf eine Linie klickt, will wissen, was das fuer eine ist.
            // Bei einem Ersatzbus ist das die wichtigste Auskunft ueberhaupt.
            + (stoerungZu(a)
                ? '<div class="stoer-blase"><h4>' + stoerungZu(a).titel + "</h4>"
                  + stoerungFakten(stoerungZu(a)) + "</div>"
                : ""));

        // Der Weg zeichnet sich in Fahrtrichtung. Nicht Zierde: er sagt, wo er
        // ANFAENGT und wohin er laeuft - eine fertig daliegende Linie sagt das
        // nicht, dafuer muss man die Marken lesen.
        //
        // Zwei Verfahren, weil die Abschnitte verschieden gebaut sind: die
        // gefahrenen Stuecke ueber strokeDashoffset (der Strich, der waechst),
        // die Fusswege ueber die Deckkraft - deren dashArray IST schon die
        // Punktreihe, ein zweites Strichmuster darueber loeschte sie.
        gezeichnet.push({ kern: kern, fuss: fuss });
      });

      if (bewegt()) {
        var beginn = 0;
        gezeichnet.forEach(function (g) {
          var pfad = g.kern._path;
          if (!pfad) return;
          // 700 ms je gefahrenem Abschnitt, 380 je Fussweg: der Fussweg ist der
          // kuerzere Teil und darf nicht laenger brauchen als die Fahrt.
          var dauer = g.fuss ? 380 : 700;
          if (g.fuss) {
            pfad.animate([{ opacity: 0 }, { opacity: 1 }],
              { duration: dauer, delay: beginn, easing: "cubic-bezier(.4,0,.2,1)",
                fill: "backwards" });
          } else {
            var lang = pfad.getTotalLength();
            pfad.animate(
              [{ strokeDasharray: lang + " " + lang, strokeDashoffset: lang },
               { strokeDasharray: lang + " " + lang, strokeDashoffset: 0 }],
              { duration: dauer, delay: beginn, easing: "cubic-bezier(.4,0,.2,1)",
                fill: "backwards" });
          }
          beginn += dauer - 120;   // leichte Ueberlappung, sonst stockt es
        });
      }

      // Ein- und Ausstieg als Halt-Marke. Die Zwischenhalte bekommen KEINE:
      // ihre Koordinaten stehen nicht in den Daten, und eine auf die Linie
      // geschaetzte Marke saehe genauso aus wie eine gemessene.
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
            // direction "auto": Leaflet legt das Schild auf die Seite, auf der
            // Platz ist. Fest rechts ragte "Rosenheimer Platz" auf einem 390er
            // Schirm ueber die Kartenkante - der Halt war zu sehen, sein Name
            // nicht.
            .bindTooltip(p[1], { permanent: true, direction: "auto", offset: [14, 0],
                                 className: "marke-name", interactive: false });
        });
      });

      L.marker([gegen.lat, gegen.lon], {
        icon: L.divIcon({ className: "", html: ortSymbol(cfg.start_art, false),
                          iconSize: [34, 34], iconAnchor: [17, 17] }),
        title: gegen.name, riseOnHover: true
      }).addTo(wegEbene).bindPopup("<h3>" + gegen.name + "</h3>"
        + "<p>" + cfg.gegen_text + "</p>" + mapsLink(gegen));

      wegBereich = L.latLngBounds(punkte);
      karteHotelAnpassen();
    };

    // --- Das Band ------------------------------------------------------------
    // Jede Zeile ist EIN Abschnitt und traegt den Halt, an dem er beginnt.
    // Getrennte Zeilen fuer Halte und Fahrten haetten in der Spur an jedem Halt
    // eine Naht hinterlassen, und eine unterbrochene Linie liest man als
    // unterbrochenen Weg.
    //
    // KEINE Uhrzeiten, anders als beim Bahn-Reiter: dort steht eine gebuchte
    // Fahrt, hier ein Rezept fuer jeden Tag. Eine Uhrzeit daneben liest sich
    // als Termin. Wie oft etwas faehrt, steht als gemessener Takt daneben.
    // --i ist der Platz in der Folge: das Stylesheet rechnet daraus die
    // Verzoegerung der Staffelung. Als blosse Zahl im Markup und nicht als
    // fertige Millisekunde - so steht die Dauer an EINER Stelle, und
    // --bewegung nimmt sie bei reduzierter Bewegung auf null herunter.
    var zeile = function (klasse, kopf, inhalt, farbe, i) {
      return '<li class="' + klasse + '" style="--i:' + (i || 0)
        + (farbe ? ";--spur:" + farbe : "") + '">'
        + ""
        + '<span class="weg-spur" aria-hidden="true"></span>'
        + '<span class="weg-haupt"><b class="weg-ort">' + kopf + "</b>"
        + (inhalt || "") + "</span></li>";
    };

    var bandHtml = function (v) {
      var farbe = wegFarbe(v, hauptmittel(v));
      var zeilen = v.abschnitte.map(function (a, i) {
        var start = i === 0 ? v.von.name : (a.von || "—");
        if (a.art === "fuss") {
          return zeile("weg-teil weg-teil--fuss", start,
            '<span class="weg-tat"><b>' + a.minuten + " min</b> zu Fuß"
            + (a.meter ? " · " + a.meter + " m" : "") + "</span>", null, i);
        }
        // Alle gemessenen Linien DIESES Abschnitts, nicht nur die der
        // Beispielfahrt: an diesem Bahnsteig faehrt jede von ihnen dorthin, und
        // wer auf "S5" wartet, laesst drei Zuege durch, die genauso passen.
        //
        // Je Abschnitt und nicht je Variante - bei einem Umstieg faehrt am
        // ersten Bahnsteig etwas anderes als am zweiten. hol-weg.mjs schreibt
        // die Liste seit dem 09.09.2026 an den Abschnitt; die zweite Zeile ist
        // der Rueckfall fuer Daten von davor, und sie greift NUR ohne Umstieg,
        // wo Variante und Abschnitt dasselbe bedeuten. Ein Rueckfall auf die
        // Variantenliste mit Umstieg waere genau die falsche Behauptung.
        var eigene = a.linien && a.linien.length ? a.linien
          : (v.umstiege === 0 && v.linien && v.linien.length ? v.linien : [a.linie]);
        var marken = eigene
          .filter(Boolean).map(function (l) { return linienMarke(l, false); }).join("");
        var halte = a.zwischenhalte || [];
        // Die Spur traegt die Farbe als Inline-Wert, weil sie aus den Daten
        // kommt und nicht aus einer Klasse kommen kann: eine Klasse je
        // Liniennummer waere ein Stylesheet, das bei jeder Fahrplanaenderung
        // nachgezogen werden muss.
        return zeile("weg-teil weg-teil--" + a.art, start,
          '<span class="weg-marken">' + marken + "</span>"
          + '<span class="weg-tat"><b>' + a.minuten + " min</b> · "
          + (halte.length + 1) + " Halte</span>"
          + (halte.length ? '<span class="weg-fein">über ' + halte.join(" · ") + "</span>" : ""),
          farbe, i);
      });
      zeilen.push(zeile("weg-ziel", v.nach.name, "", null, v.abschnitte.length));
      return '<ol class="weg">' + zeilen.join("") + "</ol>";
    };

    var feld = function (kopf, wert, fein) {
      return '<div class="platz-feld"><span class="platz-kopf">' + kopf + "</span>"
        + '<b class="platz-wert">' + wert + "</b>"
        + (fein ? '<span class="weg-feld-fein">' + fein + "</span>" : "") + "</div>";
    };

    // --- Takt ueber den Tag --------------------------------------------------
    // Die Kennzahl "alle 4-6 min" beantwortet, wie oft es tagsueber faehrt. Die
    // zweite Frage des Ankunftstags beantwortet sie nicht: faehrt das noch, wenn
    // der Zug zwei Stunden spaeter kommt - und komme ich abends zurueck.
    //
    // Der erste Wurf war ein Balkenstreifen mit einer Achse aus Uhrzeiten und
    // sonst nichts. Man konnte RATEN, was die Hoehe bedeutet. Jetzt steht es
    // dabei, dreifach abgesichert:
    //   1. die Skala links nennt die Einheit und den Hoechstwert
    //   2. unter dem Streifen liegt je Tagesabschnitt ein Feld mit dem
    //      gemessenen Takt in Minuten - die Zahl, in der man denkt
    //   3. der Satz darunter nennt die Nachtluecke
    // Der Streifen zeigt damit die FORM des Tages, die Felder die Zahlen. Ein
    // Diagramm, dessen Aussage man erraten muss, ist Zierde.
    var STUNDEN_ORDNUNG = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                           20, 21, 22, 23, 0, 1, 2, 3];
    var zweiStellig = function (n) { return (n < 10 ? "0" : "") + n; };
    var taktText = function (b) {
      if (!b || !b.fahrten) return "keine Fahrt";
      if (b.min == null) return b.fahrten + (b.fahrten === 1 ? " Fahrt" : " Fahrten");
      return "alle " + (b.min === b.max ? b.min : b.min + "–" + b.max) + " min";
    };

    var taktStreifen = function (v) {
      if (!v.stunden || !v.betrieb) return "";
      var hoch = Math.max.apply(null, v.stunden);
      if (!hoch) return "";

      var balken = STUNDEN_ORDNUNG.map(function (h) {
        var n = v.stunden[h];
        return '<li class="takt-stunde' + (n ? "" : " takt-stunde--leer") + '"'
          + ' style="--i:' + STUNDEN_ORDNUNG.indexOf(h) + '"'
          + ' title="' + zweiStellig(h) + " Uhr — "
          + (n ? n + (n === 1 ? " Fahrt" : " Fahrten") : "keine Fahrt") + '">'
          + '<i style="height:' + Math.round((n / hoch) * 100) + '%"></i></li>';
      }).join("");

      // Je Tagesabschnitt ein Feld, so breit wie seine Stunden im Streifen. Die
      // Beschriftung sitzt damit UNTER dem Stueck, das sie beschreibt - eine
      // Legende daneben muesste man erst zuordnen.
      var felder = (v.baender || []).map(function (b) {
        var spanne = (b.bis - b.von + 24) % 24;
        return '<li style="grid-column:span ' + spanne + '"'
          + (b.fahrten ? "" : ' class="takt-band--leer"') + ">"
          + '<b class="takt-band-name">' + b.label + "</b>"
          + '<span class="takt-band-zeit">' + zweiStellig(b.von) + "–"
          + zweiStellig(b.bis) + " Uhr</span>"
          + '<span class="takt-band-takt">' + taktText(b) + "</span></li>";
      }).join("");

      // Die Nachtluecke wird GERECHNET, nicht behauptet: aus der letzten und der
      // ersten Fahrt. Unter einer Stunde ist sie keine Luecke, sondern der
      // Wechsel des Betriebstags - dann steht das auch so da.
      var min = function (hhmm) {
        return Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
      };
      var pause = (min(v.betrieb.erste) + 1440 - min(v.betrieb.letzte)) % 1440;
      var satz = pause < 60
        ? "Fährt rund um die Uhr — zwischen der letzten und der ersten Fahrt liegen "
          + pause + " Minuten."
        : "Zwischen <b>" + v.betrieb.letzte + "</b> und <b>" + v.betrieb.erste
          + "</b> fährt nichts — " + Math.floor(pause / 60) + " h "
          + zweiStellig(pause % 60) + " Pause.";

      return '<div class="takt">'
        + '<div class="takt-kopf">'
        +   '<span class="platz-kopf">Takt über den Tag</span>'
        +   '<span class="takt-betrieb">erste <b>' + v.betrieb.erste
        +   "</b> · letzte <b>" + v.betrieb.letzte + "</b></span>"
        + "</div>"
        + '<div class="takt-plot">'
        +   '<div class="takt-skala"><span>' + hoch + "</span><span>0</span></div>"
        +   '<div><ol class="takt-streifen">' + balken + "</ol>"
        +   '<ol class="takt-baender">' + felder + "</ol></div>"
        + "</div>"
        + '<p class="takt-einheit">Balkenhöhe: Fahrten je Stunde, '
        + "Höchstwert <b>" + hoch + "</b>.</p>"
        + '<p class="takt-luecke">' + satz + "</p>"
        + "</div>";
    };

    var tafelHtml = function (v) {
      var takt = v.takt
        ? feld("Takt", "alle " + (v.takt.min === v.takt.max
            ? v.takt.min : v.takt.min + "–" + v.takt.max) + " min", v.takt.fenster)
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
        // SCHIENENERSATZVERKEHR gehoert benannt, nicht nur als Liniennummer
        // gezeigt. "SEV 25" sieht im Band aus wie jede andere Marke - wer das
        // nicht kennt, sucht am Bahnsteig nach einer Tram, die an dem Tag nicht
        // faehrt. Der Satz steht unter dem Band, weil er den Weg betrifft und
        // nicht die Kennzahlen darueber.
        + (function () {
            var ersatz = v.abschnitte.filter(function (a) { return a.sev; });
            if (!ersatz.length) return "";
            var st = stoerungZu(ersatz[0]);
            return '<p class="tafel-warnung"><strong>Achtung Ersatzverkehr:</strong> '
              + ersatz.map(function (a) {
                  return (a.linie || "Ersatzverkehr") + " ab " + (a.von || "—");
                }).join(", ")
              + " ist ein <em>Bus</em>, keine Tram — die Linie ist auf diesem "
              + "Abschnitt ersetzt.</p>"
              // Zeitraum, Haltestellenfolge und der verlegte Halt sind das,
              // was man NACHSCHLAEGT, nicht das, was man beim Aufschlagen
              // liest. Sie liegen darum hinter derselben Aufklapp-Zeile wie die
              // Quellen anderswo auf der Seite.
              + (st
                  ? '<details class="quell-klapp stoerung"><summary>'
                    + st.titel + " — Zeitraum, Halte und Quelle</summary>"
                    + stoerungFakten(st) + "</details>"
                  : "");
          }())
        + (v.richtungen && v.richtungen.length
            ? '<p class="tafel-fein"><strong>Am Bahnsteig:</strong> Richtung '
              + v.richtungen.join(", ") + ".</p>"
            : "")
        + taktStreifen(v)
        + "</div>";
    };

    // --- Untermenue: welcher Ausschnitt --------------------------------------
    // Die Marke im Knopf ist ein Strich in der Farbe des Verkehrsmittels und in
    // derselben Strichart wie auf der Karte. Damit ist der Knopf zugleich die
    // Legende des Wegs - eine zweite Legende darunter waere dieselbe Auskunft
    // ein zweites Mal, und die zweite driftet.
    var navW = document.getElementById(cfg.reiter);
    var zielW = document.getElementById(cfg.tafel);
    var varianten = (w && w.varianten) || [];
    // ZWEI Ebenen, wo es Gruppen gibt. Der Hotel-Reiter kennt keine: dort ist
    // jede Variante ein Verkehrsmittel, und drei Knoepfe reichen. Der
    // Bavaria-Reiter hat zwei RICHTUNGEN mit je mehreren Optionen - flach
    // waeren das fuenf Knoepfe, zwei davon gleich beschriftet ("Schnellste"),
    // und man saehe nicht mehr, welcher wohin gehoert.
    //
    //   Reihe 1 (dieses Untermenue)  Umgebung · Hinweg · Rueckweg
    //   Reihe 2 (in der Tafel)       die Optionen der offenen Richtung
    // NICHT "gruppen" - so heissen weiter oben in dieser Funktion schon die
    // Kartenebenen der Umgebungslokale. Ein zweites var mit demselben Namen
    // ueberschreibt sie im selben Funktionsbereich, und die Filterleiste
    // greift danach auf null zu.
    var wegGruppen = (w && w.gruppen) || null;
    var eintraege = [{ id: "umgebung", label: "Umgebung", variante: null }];
    if (wegGruppen) {
      wegGruppen.forEach(function (g) {
        var erste = varianten.filter(function (v) { return v.gruppe === g.id; })[0];
        if (erste) eintraege.push({ id: g.id, label: g.label, variante: erste, gruppe: g.id });
      });
    } else {
      varianten.forEach(function (v) {
        eintraege.push({ id: v.id, label: v.label, variante: v });
      });
    }

    // Die zweite Reihe. Jeder Knopf nennt, was seine Regel gekostet hat -
    // Dauer, Umstiege und die GEMESSENE Umsteigezeit. Ohne diese drei Zahlen
    // waere "Schnellste" gegen "Ohne Umstieg" eine Geschmacksfrage; mit ihnen
    // ist es eine Entscheidung.
    // EINE Zahl je Knopf - die, fuer die er steht. Ein Zwischenstand haengte
    // alle vier aneinander ("50 min \u00b7 1\u00d7 um \u00b7 3 min Reserve \u00b7 29 min zu Fu\u00df").
    // Das ist keine Wahl mehr, sondern eine Zeile, die man erst lesen muss. Wer
    // die uebrigen Werte will, findet sie in der Tafel direkt darunter - dort
    // stehen Dauer, Fussweg und Takt ohnehin gross und beschriftet.
    var KENNZAHL = {
      schnell: function (v) { return v.minuten + " min"; },
      umstiegsarm: function (v) {
        return v.umstiege ? v.umstiege + "\u00d7 umsteigen" : "ohne Umstieg";
      },
      fussarm: function (v) {
        return v.fuss_minuten != null ? v.fuss_minuten + " min zu Fu\u00df" : "";
      },
      puffer: function (v) {
        var p = (v.puffer || []).filter(function (x) { return x != null; });
        // Nicht "ohne Umstieg" - das steht schon auf dem Nachbarknopf und
        // saehe hier aus wie dieselbe Auskunft zweimal. Die Regel hat gesucht
        // und nichts zu sichern gefunden, weil es nichts zu sichern gibt.
        return p.length ? p.join("/") + " min Reserve" : "kein Umstieg nötig";
      }
    };
    var optionText = function (v) {
      // Ohne Auswahlregel bleibt es bei der Dauer: der Hotel-Reiter
      // unterscheidet seine Knoepfe im Verkehrsmittel, nicht im Massstab.
      if (!v.auswahl) return v.minuten + " min";
      var f = KENNZAHL[v.auswahl];
      return f ? f(v) : v.minuten + " min";
    };
    var optionenHtml = function (liste, aktiv) {
      if (liste.length < 2) return "";
      return '<nav class="untermenue untermenue--optionen" aria-label="Welche Verbindung">'
        + liste.map(function (v) {
            return '<button type="button" class="unterknopf unterknopf--klein" data-vid="'
              + v.id + '" aria-pressed="' + (v.id === aktiv.id ? "true" : "false") + '">'
              + "<span>" + v.label + "</span>"
              + '<span class="unter-zahl">' + optionText(v) + "</span></button>";
          }).join("")
        + "</nav>";
    };

    var knoepfeW = [];
    var zeigeW = function (id, vid) {
      knoepfeW.forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.id === id ? "true" : "false");
      });
      var e = eintraege.filter(function (x) { return x.id === id; })[0];
      if (!e) return;
      if (!e.variante) { zielW.innerHTML = ""; zeichne(null); return; }

      var v = e.variante;
      var inGruppe = e.gruppe
        ? varianten.filter(function (x) { return x.gruppe === e.gruppe; })
        : [];
      if (inGruppe.length) {
        var gewaehlt = inGruppe.filter(function (x) { return x.id === vid; })[0];
        v = gewaehlt || inGruppe[0];
        zielW.innerHTML = optionenHtml(inGruppe, v) + tafelHtml(v);
        // Die Knoepfe der zweiten Reihe entstehen mit der Tafel neu und werden
        // darum hier verdrahtet, nicht einmal beim Aufbau.
        Array.prototype.forEach.call(
          zielW.querySelectorAll(".untermenue--optionen .unterknopf"), function (b) {
            b.addEventListener("click", function () { zeigeW(id, b.dataset.vid); });
          });
      } else {
        zielW.innerHTML = tafelHtml(v);
      }
      zeichne(v);
    };

    if (navW && zielW) {
      eintraege.forEach(function (e) {
        var art = e.variante ? hauptmittel(e.variante) : null;
        var b = document.createElement("button");
        b.type = "button";
        b.className = "unterknopf";
        b.dataset.id = e.id;
        b.setAttribute("aria-pressed", "false");
        // Der Strich im Knopf traegt dieselbe Farbe wie die Linie auf der Karte
        // und die Spur im Band. Damit ist der Knopf die Legende der Karte.
        b.innerHTML = (art
            ? '<span class="unter-marke" aria-hidden="true">'
              + '<span class="netz-strich weg-strich weg-strich--'
              + (art === "fuss" ? "fuss" : "voll") + '" style="--spur:'
              + wegFarbe(e.variante, art) + '"></span></span>'
            : '<span class="unter-marke" aria-hidden="true">'
              + ortSymbol(cfg.ziel_art, false) + "</span>")
          + "<span>" + e.label + "</span>"
          + (e.variante ? '<span class="unter-zahl">' + e.variante.minuten + " min</span>" : "");
        b.addEventListener("click", function () { zeigeW(e.id); });
        knoepfeW.push(b);
        navW.appendChild(b);
      });
      zeigeW("umgebung");
    }

    // --- Filterleiste, gleiche Bauform wie die der Stadtkarte -----------------
    var ulU = document.getElementById(cfg.legende);
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
      if (n) eintragU(ortSymbol(umgSymbol(a), false), UMG_ARTEN[a].label, n, gruppen[a]);
    });
    if (essenEbene) {
      eintragU(ortSymbol("wirtshaus", false), "Essen an der Strecke",
               cfg.essen.orte.length, essenEbene);
    }
    // Ein Eintrag je Verkehrsmittel, in der Reihenfolge, in der man sucht.
    ["sbahn", "ubahn", "tram", "bus"].forEach(function (a) {
      if (!halteEbenen[a]) return;
      var n = u.halte.filter(function (h) { return h.art === a; }).length;
      eintragU('<i class="halt-pin ' + a + '">' + HALT_KUERZEL[a] + "</i>",
               ART_LABEL[a], n, halteEbenen[a]);
    });

    // Eine Zeile, und sie nennt nur die Quellen. Was die Auswahl bestimmt hat -
    // Schwellen, Kappungen, wie die Gehzeit gerechnet wurde - stand hier bis zum
    // 09.09.2026 als Absatz und ist auf Ansage des Nutzers heraus: das ist
    // Bauwissen und gehoert in cockpit/README.md, nicht unter eine Karte, die
    // jemand gerade benutzt.
    var quellen = [u.quellen.lokale, u.quellen.gehzeit, u.quellen.halte,
                   w ? w.quelle : null].filter(Boolean);
    var namen = [];
    quellen.forEach(function (q) { if (namen.indexOf(q.name) < 0) namen.push(q.name); });

    // Eine Karte ohne Lokale ist eine AUSSAGE - aber nur, wenn dabeisteht, dass
    // gesucht wurde. Ohne diesen Satz sieht "hier ist nichts" genauso aus wie
    // "hier wurde nicht nachgesehen", und die Filterleiste zeigt dann einfach
    // drei Schalter weniger. An der Filmstadt ist das der Normalfall: die
    // Abfrage fand drei Betriebe, keiner hielt Bewertung und Gehzeit stand.
    var verw = u.verworfen || {};
    var grenze = (u.umkreis && u.umkreis.ueber_der_grenze
                    ? u.umkreis.ueber_der_grenze.lokale : 0) || 0;
    var geprueft = (u.lokale ? u.lokale.length : 0) + grenze
      + (verw.zu_schwach || 0) + (verw.zu_wenige_stimmen || 0) + (verw.ohne_bewertung || 0);
    var leer = (!u.lokale || !u.lokale.length)
      ? "Kein Lokal in Gehweite: die Abfrage fand " + geprueft + " Betriebe im Umkreis von "
        + u.umkreis.such_meter + " m Luftlinie, keiner davon hielt Bewertung und "
        + "Gehzeit stand. "
        // Der Nachsatz ist keine Beschoenigung, sondern die Antwort auf die
        // Frage, die der leere Umkreis offen laesst: gegessen wird nicht hier,
        // sondern eine Station frueher.
        + (cfg.essen && cfg.essen.orte && cfg.essen.orte.length
            ? "Gegessen wird auf dem Rückweg: " + cfg.essen.orte.length
              + " Wirtshäuser liegen an Halten der Tram 25, je "
              + cfg.essen.orte.map(function (o) {
                  return Math.round(o.gehzeit_s / 60) + " min";
                }).join(" und ") + " zu Fuß ab ihrem Halt. "
            : "")
      : "";

    document.getElementById(cfg.fuss).textContent = leer
      + "Quellen: " + namen.join(" · ") + " — abgerufen "
      + deutsch(u.quellen.lokale.abgerufen) + ".";

    WEG_KARTEN[cfg.id] = { karte: karteHotel, anpassen: karteHotelAnpassen };
  }

  // Zweimal dieselbe Bauart, zwei Orte. Der Hotel-Reiter beantwortet "wo liegt
  // die Unterkunft und wie komme ich vom Bahnhof hin", der Bavaria-Reiter "wo
  // liegt die Filmstadt und wie komme ich vom Hotel hin". Dieselbe Frage, ein
  // anderer Bezugspunkt - und darum dieselbe Funktion und keine zweite Fassung.
  //
  // Der Startpunkt des Wegs ist das, was auf dem jeweiligen Reiter schon
  // feststeht: fuer das Hotel der Bahnhof, fuer die Filmstadt das Hotel.
  wegKarte({
    id: "hotel",
    umgebung: DATEN.umgebung,
    weg: DATEN.hotelweg,
    karte: "karte-hotel",
    reiter: "weg-reiter",
    tafel: "weg-tafel",
    legende: "legende-hotel",
    fuss: "umgebung-fuss",
    ziel_art: "unterkunft",
    start_art: "ankunft",
    gegen_text: "Hier kommt der Zug an — der Start dieses Wegs."
  });

  wegKarte({
    id: "bavaria",
    umgebung: DATEN.bavaria_umgebung,
    weg: DATEN.bavaria_weg,
    karte: "karte-bavaria",
    reiter: "bavaria-reiter",
    tafel: "bavaria-weg-tafel",
    legende: "legende-bavaria",
    fuss: "bavaria-fuss",
    essen: DATEN.bavaria_essen,
    ziel_art: "film",
    start_art: "unterkunft",
    gegen_text: "Die Unterkunft — Start des Hinwegs und Ziel des Rückwegs."
  });


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

    // Die GRUPPE ist nicht die Kueche: bei den Burgern trennt sie zusaetzlich
    // nach `smash.art`. Nur "laden" - ein Haus, das ein Smash-Laden IST - wird
    // eigens gefaerbt. "gericht" (Smash ist ein Gericht unter vielen), "keins"
    // und "unklar" bleiben Burgerlokale; sie zu Smash zu zaehlen waere genau
    // die Rundung, die eine Luecke wie ein Ergebnis aussehen laesst.
    var gruppeVon = function (o) {
      return o.kueche === "burger" && o.smash && o.smash.art === "laden" ? "smash" : o.kueche;
    };
    var alle = g.orte.map(function (o) { return { o: o, gruppe: gruppeVon(o) }; })
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
      // EIN Knopf fuer beide Burger-Gruppen. Das Untermenue waehlt, was in der
      // Liste steht, und "Burger" ist die Frage, die jemand stellt - die
      // Unterscheidung Smash-Laden/Burgerlokal beantwortet die Karte ueber die
      // Farbe und die Liste ueber ihre Zeile. Ein sechster Knopf haette die
      // Leiste auf schmalen Geraeten in eine vierte Zeile gedrueckt.
      { id: "burger",      label: "Burger",      gruppen: ["smash", "burger"] },
      { id: "fastfood",    label: "Fast Food",   gruppen: ["fastfood"] },
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
    standortKnopf(karteInnen);

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
      // Ohne Recherche keine Beschreibung, aber auch kein Schweigen: die sechs
      // Innenstadt-Burger kamen ueber eine Umkreisabfrage dazu, nicht aus der
      // Presse. Ein leerer Absatz saehe aus wie ein Ladefehler, ein erfundener
      // Satz waere schlimmer.
      if (o.notiz) z.push("<p>" + o.notiz + "</p>");
      else if (o.auswahl === "abfrage") {
        z.push('<p class="popup-unbekannt">Über eine Umkreisabfrage gefunden — zu Karte und Küche '
          + "liegt keine eigene Recherche vor.</p>");
      }
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
    // ===== Die Unterkunft ===================================================
    // Sie steht auf dieser Karte, seit man von ihr aus loslaeuft: die Entfernung
    // in der Liste ist zum Marienplatz gerechnet, aber gelaufen wird vom Haus.
    // Ohne die Marke muss man raten, wo das ist.
    //
    // KEINE Zeile in der Liste - die Liste beantwortet "wo esse ich was", und
    // das Hotel ist keine Antwort darauf. Es ist Orientierung, so wie die
    // Bahnhalte, und liegt darum auf einer eigenen Ebene mit eigenem Schalter.
    // Die groessere Kiste (40 px) trennt es vom Beiwerk, so wie auf der
    // Umgebungskarte.
    var hausEbene = L.layerGroup();
    var haus = DATEN.orte.filter(function (o) { return o.art === "unterkunft"; })[0];
    if (haus) {
      L.marker([haus.lat, haus.lon], {
        icon: L.divIcon({ className: "", html: ortSymbol("unterkunft", true),
                          iconSize: [40, 40], iconAnchor: [20, 20] }),
        title: haus.name + " — die Unterkunft",
        keyboard: false, riseOnHover: true
      }).addTo(hausEbene).bindPopup("<h3>" + haus.name + "</h3>"
        + "<p>Die Unterkunft. Die Entfernungen in der Liste sind zum "
        + bezug.name + " gerechnet, nicht hierher.</p>"
        + (haus.notiz ? "<p>" + haus.notiz + "</p>" : "")
        + mapsLink(haus)
        + (haus.osm ? '<p class="popup-fein">OSM ' + haus.osm + "</p>" : ""));
      hausEbene.addTo(karteInnen);
    }

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

      var streifenTitel = e.w ? "Öffnungszeiten: " + zeitenKurz(e.w) : "Öffnungszeiten unbekannt";
      var kopf = '<span class="ort-marke" aria-hidden="true">' + ortSymbol(ZEICHEN[e.gruppe], false) + "</span>"
        + '<span class="ort-name">' + o.name + "</span>"
        // Stadtteil, wo er bekannt ist - sonst die Strasse. Bei den Ketten gibt
        // es keinen Stadtteil, und sechs Zeilen "dean&david" ohne Strasse sind
        // sechsmal dasselbe.
        + '<span class="ort-meta">' + ((o.stadtteil || o.strasse) ? (o.stadtteil || o.strasse) + " · " : "")
          + weite(e.m) + "</span>"
        // Der Platzhalter bleibt, auch wo es keine Oeffnungszeit gibt: sonst
        // rutscht die ganze Zeile um ein Feld nach links und die Noten der
        // Nachbarzeilen fluchten nicht mehr.
        + '<span class="ort-woche">' + (e.w ? streifen(e.w, streifenTitel) : "") + "</span>"
        + (e.note
            ? '<span class="ort-note">' + noteSkala(e.note)
              + '<b>' + String(e.note).replace(".", ",") + "</b></span>"
            : '<span class="ort-note ort-note--ohne">ohne Note</span>');

      // Die Farbe auf der Karte sagt NUR "Smash-Laden oder nicht". Warum, mit
      // welchem Beleg und in welchem Rang - das gehoert in die Zeile, sonst ist
      // die Farbe eine Behauptung ohne Quelle.
      var SMASH_TEXT = { laden: "Smash-Burger-Laden", gericht: "Burgerlokal, Smash als Gericht",
                         keins: "kein Smash auf der Karte", unklar: "unklar" };
      var fakten = faktenZeile("Offen", e.w ? zeitenKurz(e.w) : "unbekannt — nicht erhoben")
        + (o.smash ? faktenZeile("Smash", SMASH_TEXT[o.smash.art]
            + (o.smash.rang ? ' <span class="rang rang-' + o.smash.rang + '">' + o.smash.rang + "</span>" : "")
            + '<span class="ort-beleg">' + o.smash.quelle
            + (o.smash.beleg ? ' <a href="' + o.smash.beleg + '" target="_blank" '
                + 'rel="noopener noreferrer">Beleg ↗</a>' : "") + "</span>") : "")
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
          // Eine fehlende Beschreibung wird nur DORT erklaert, wo es einen Grund
          // gibt - bei den ueber die Umkreisabfrage dazugekommenen Burgern.
          // Wahrzeichen und Museen tragen von Haus aus keine; ihnen denselben
          // Satz anzuhaengen waere schlicht falsch, und genau das ist hier
          // einmal passiert.
          + (o.notiz ? '<p class="ort-notiz">' + o.notiz + "</p>"
              : o.auswahl === "abfrage"
                ? '<p class="ort-notiz ort-notiz--ohne">Über eine Umkreisabfrage gefunden — '
                  + "zu Karte und Küche liegt keine eigene Recherche vor."
                  + (o.auswahl_hinweis ? " " + o.auswahl_hinweis : "") + "</p>"
                : "")
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

    // ===== Zwei Vorgänge, zwei Bewegungen ==================================
    // UMSORTIEREN und KATEGORIEWECHSEL sehen gleich aus - ein Klick, die Liste
    // ist anders -, sind aber grundverschieden, und deshalb bewegen sie sich
    // verschieden:
    //
    //   UMSORTIEREN    dieselben Zeilen in anderer Reihenfolge. Sie WANDERN,
    //                  und genau dafuer ist FLIP da: messen, aendern, optisch
    //                  zurueckschieben, zurueckfuehren. Nur transform, also auf
    //                  dem Compositor.
    //
    //   KATEGORIEWECHSEL  andere Zeilen. Da wandert nichts, da wird
    //                  ausgetauscht - also wird UEBERBLENDET, und die Tafel
    //                  waechst oder schrumpft dabei mit.
    //
    // Zwei Anlaeufe waren vorher falsch, beide gemessen:
    //   1. Nur FLIP. Bei disjunkten Kategorien hat fast keine Zeile ein
    //      "vorher" und ein "nachher" - 12 verschwanden schlagartig, 22
    //      erschienen schlagartig, zwei glitten sinnlos umher.
    //   2. Zeilen beim Abgang auf position:absolute legen (so macht es
    //      wert-und-geste.html fuer EINZELNE Posten). Bei 53 gehenden Zeilen
    //      fiel die Tafel schlagartig von 3000 auf 330 px zusammen, waehrend
    //      die Gehenden noch an ihrer alten Stelle standen - sie ragten weit
    //      ueber die Tafel hinaus, und alles darunter sprang nach oben.
    //      Das Muster taugt fuer ein paar Posten, nicht fuer einen Austausch.
    //
    // Die Hoehe wird mitanimiert. Das ist eine Layout-Eigenschaft und damit
    // teuer - aber es ist EIN Kasten, nicht 59, und es ist der Unterschied
    // zwischen "die Liste wechselt" und "die Seite springt".
    var ruhig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var DAUER = { aus: 130, ein: 190, hoehe: 260, flip: 420 };
    var wechselLauf = 0;
    var offeneAbgaenge = [];

    // soll: Map<Element, boolean> - was NACHHER sichtbar ist.
    // ordnen: baut die Reihenfolge im DOM um.
    var umschalten = function (soll, ordnen) {
      // Ein zweiter Klick darf den ersten nicht verdoppeln: was laeuft, wird
      // sofort abgeschlossen. Sonst liegen zwei Animationen auf demselben
      // Kasten und die zweite raeumt einen Zustand auf, den die erste braucht.
      offeneAbgaenge.forEach(function (f) { f(); });
      offeneAbgaenge = [];
      wechselLauf++;

      var wechsel = alle.some(function (e) { return e.el.hidden === !!soll.get(e.el); });

      if (ruhig || !document.getElementById("feld-innenstadt").offsetParent) {
        // Kein Bewegungsbedarf: entweder abbestellt, oder der Reiter ist gar
        // nicht sichtbar - dann waere jede Messung null und die Animation
        // liefe gegen eine Wand.
        alle.forEach(function (e) { e.el.hidden = !soll.get(e.el); });
        return ordnen();
      }

      // --- Fall 1: nur umsortiert -------------------------------------------
      if (!wechsel) {
        var vorher = new Map();
        alle.forEach(function (e) {
          e.el.style.transform = "";
          vorher.set(e.el, e.el.getBoundingClientRect());
        });
        ordnen();
        var bewegte = [];
        alle.forEach(function (e) {
          if (e.el.hidden) return;
          var alt = vorher.get(e.el), neu = e.el.getBoundingClientRect();
          var dx = alt.left - neu.left, dy = alt.top - neu.top;
          if (!dx && !dy) return;
          e.el.style.transform = "translate(" + dx + "px," + dy + "px)";
          bewegte.push([e.el, dx, dy]);
        });
        void document.body.offsetWidth;                 // Startzustand erzwingen
        bewegte.forEach(function (b) {
          var el = b[0];
          el.style.willChange = "transform";
          var a = el.animate(
            [{ transform: "translate(" + b[1] + "px," + b[2] + "px)" }, { transform: "translate(0,0)" }],
            { duration: DAUER.flip, easing: "cubic-bezier(.22,1,.36,1)", fill: "none" });
          el.style.transform = "";
          a.finished.then(function () { el.style.willChange = ""; }).catch(function () {});
        });
        return;
      }

      // --- Fall 2: anderer Inhalt -------------------------------------------
      var lauf = wechselLauf;
      var h0 = tafelEl.getBoundingClientRect().height;
      // overflow nur WAEHREND der Bewegung: dauerhaft wuerde es den Fokusring
      // der obersten und untersten Zeile abschneiden.
      tafelEl.style.overflow = "hidden";
      tafelEl.style.height = h0 + "px";

      var aufraeumen = function () {
        tafelEl.style.overflow = tafelEl.style.height = "";
        zeilenEl.style.opacity = zeilenEl.style.willChange = "";
      };
      var laufende = [];
      var abbrechen = function () {
        laufende.forEach(function (a) { try { a.cancel(); } catch (x) {} });
        alle.forEach(function (e) { e.el.hidden = !soll.get(e.el); });
        ordnen();
        aufraeumen();
      };
      offeneAbgaenge.push(abbrechen);

      zeilenEl.style.willChange = "opacity";
      var aus = zeilenEl.animate([{ opacity: 1 }, { opacity: 0 }],
        { duration: DAUER.aus, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" });
      laufende.push(aus);

      aus.finished.then(function () {
        if (lauf !== wechselLauf) return;
        // Der Austausch passiert UNSICHTBAR. Die Hoehe springt dabei nicht:
        // sie steht noch auf h0 und wird gleich gefuehrt.
        alle.forEach(function (e) { e.el.hidden = !soll.get(e.el); });
        ordnen();
        tafelEl.style.height = "";
        var h1 = tafelEl.getBoundingClientRect().height;

        // DIE HOEHE WIRD NUR GEFUEHRT, WENN MAN IHR FOLGEN KANN. Gemessen am
        // 09.09.2026: von "Alles" auf "Burger" schrumpft die Tafel um 2648 px.
        // Ueber 260 ms sind das 717 px je Bild - das ist kein Uebergang mehr,
        // sondern ein Ruck, und alles unter der Liste rutscht mit.
        //
        // Die Grenze ist eine Bildschirmhoehe: was weiter springt, als man
        // sieht, kann man ohnehin nicht verfolgen. Darueber wird die Hoehe
        // hart gesetzt - waehrend die Zeilen auf Deckkraft 0 stehen, also
        // unsichtbar. Ein sauberer Schnitt schlaegt eine Bewegung, die zu
        // schnell ist, um eine zu sein.
        var fuehrbar = Math.abs(h1 - h0) <= window.innerHeight;
        var ein = zeilenEl.animate([{ opacity: 0 }, { opacity: 1 }],
          { duration: DAUER.ein, delay: fuehrbar ? 40 : 0,
            easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
        laufende.push(ein);
        var enden = [ein.finished];

        if (fuehrbar) {
          tafelEl.style.height = h0 + "px";
          void tafelEl.offsetWidth;
          var hoch = tafelEl.animate([{ height: h0 + "px" }, { height: h1 + "px" }],
            { duration: DAUER.hoehe, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
          laufende.push(hoch);
          enden.push(hoch.finished);
        } else {
          tafelEl.style.height = tafelEl.style.overflow = "";
        }

        Promise.all(enden).then(function () {
          if (lauf !== wechselLauf) return;
          var i = offeneAbgaenge.indexOf(abbrechen);
          if (i >= 0) offeneAbgaenge.splice(i, 1);
          laufende.forEach(function (a) { try { a.cancel(); } catch (x) {} });
          aufraeumen();
        }).catch(function () {});
      }).catch(function () {});
    };

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
        // Derselbe Wert wie in der Zeile: Stadtteil, sonst Strasse. Sortierte
        // die Spalte nach etwas anderem als sie zeigt, waere das Ergebnis
        // richtig und trotzdem unverstaendlich.
        wert: function (e) { return e.o.stadtteil || e.o.strasse || null; },
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
    // Die Unterkunft steht VOR den Bahnhalten in der Legende: sie ist der eine
    // Punkt, den man zuerst sucht, und es gibt sie genau einmal.
    if (haus) {
      schalter(ortSymbol("unterkunft", false), "Unterkunft", 0, function (an) {
        if (an) hausEbene.addTo(karteInnen); else karteInnen.removeLayer(hausEbene);
      });
    }
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
    // HIER STANDEN ZWEI EINTRAEGE ZU VIEL, entfernt am 09.09.2026:
    //
    //   Gefluegel-Stufenskala. Sie kommt in der zugeklappten Zeile gar nicht
    //   vor, sondern erst im aufgeklappten Teil - und dort steht das Wort
    //   ("Geflügel nur als Salat — kein Hendl") direkt daneben. Ein Schluessel
    //   ueber der Tabelle erklaerte damit ein Zeichen, das man an dieser Stelle
    //   noch gar nicht gesehen hat, und liess es neben dem Untermenue wie ein
    //   Filterkriterium aussehen. Es ist keins.
    //
    //   Farbige Kante. Sie trug dieselbe Auskunft wie das Zeichen zwei
    //   Zentimeter daneben. Doppelt gesagt ist nicht deutlicher, sondern eine
    //   zweite Sache, die man deuten muss - die Kante ist darum ganz weg.

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
    // neu vermisst - das gilt fuer ALLE Karten. Wer eine vierte dazustellt
    // und diese Zeile vergisst, bekommt eine graue Flaeche, die aussieht wie eine
    // Karte, die noch laedt.
    // Der Reiter tritt auf, statt zu erscheinen. Klasse ab, Umbruch erzwingen,
    // Klasse dran: ohne den Zwischenschritt startet dieselbe Animation beim
    // zweiten Oeffnen nicht neu - der Browser sieht keine Aenderung.
    //
    // Die Klasse steht am ABSCHNITT, die Bewegung im Stylesheet. Der
    // Ruhezustand bleibt dabei der sichtbare: die Elemente bekommen ihre 0 nur
    // aus einem @keyframes mit fill-mode backwards. Mit opacity:0 als Grundwert
    // waere der halbe Reiter fuer pruef-farben.mjs unsichtbar - das Skript
    // ueberspringt alles unter 0,1 Deckkraft und meldete trotzdem gruen.
    var abschnitt = eintrag && eintrag.ansicht
      ? document.getElementById(eintrag.ansicht) : null;
    if (abschnitt) {
      abschnitt.classList.remove("tritt-auf");
      void abschnitt.offsetWidth;
      abschnitt.classList.add("tritt-auf");
    }
    if (id === "karte") karte.invalidateSize();
    // Die Weg-Karten melden sich selbst an (WEG_KARTEN). Frueher stand hier je
    // Reiter eine eigene Zeile; der zweite Reiter derselben Bauart haette sie
    // ein zweites Mal gebraucht, und wer sie vergisst, bekommt eine graue
    // Flaeche, die aussieht wie eine Karte, die noch laedt.
    var wk = WEG_KARTEN[id];
    if (wk) {
      wk.karte.invalidateSize();
      // Erst jetzt hat der Behaelter eine Breite - siehe karteHotelAnpassen.
      if (wk.anpassen) wk.anpassen();
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
