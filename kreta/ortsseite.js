// ortsseite.js — die Logik ALLER Ortsseiten.
//
// Jede Stadtseite (heraklion.html, chania.html, …) ist ein Rumpf aus Kopf,
// Menue und leeren Behaeltern; gefuellt wird sie von hier. Der Ort steht nicht
// in der Datei, sondern wird am eigenen DATEINAMEN erkannt und in reise.json
// nachgeschlagen - so gibt es keine Stelle, an der die Zuordnung ein zweites
// Mal gepflegt werden muesste.
//
// Eine weitere Ortsseite anlegen heisst darum weiterhin: Eintrag in
// "ortsseiten" ergaenzen, Rumpfdatei mit passendem Namen danebenlegen. Menue,
// aktive Markierung und diese Seite ergeben sich von selbst.

(function () {
  "use strict";
  const D = window.DATEN || {};
  const $ = (id) => document.getElementById(id);
  const esc = window.esc;

  const DATEI = location.pathname.replace(/\/$/, "").split("/").pop() || "index.html";
  const SEITE = (D.ortsseiten || []).find((o) => o.seite === DATEI);

  /* Ohne Eintrag in reise.json weiss diese Seite nicht, welchen Ort sie zeigt.
     Das ist kein Fall fuer stille Rueckfallwerte: eine Karte, die dann
     irgendwohin blickt, sieht aus wie ein Ergebnis. */
  if (!SEITE) {
    $("tUnterzeile").textContent = "Diese Seite ist in reise.json nicht als Ortsseite "
      + "eingetragen (gesucht: " + DATEI + "). Es wird nichts angezeigt, weil nicht "
      + "feststeht, welcher Ort gemeint ist.";
    return;
  }

  const STADT = (D.staedte || []).find((s) => s.name === SEITE.name) || null;
  const HOTEL = D.hotel || null;
  const QUARTIER = (D.ortsseiten || []).find((o) => o.quartier) || null;

  $("tTitel").textContent = SEITE.titel || SEITE.name;
  if (SEITE.unterzeile) $("tUnterzeile").innerHTML = SEITE.unterzeile;
  $("tEyebrow").textContent = "Vor Ort · " + SEITE.name;

  /* ---------- Fakten ----------
     Sie liegen laengst in kreta-orte.json, weil die Uebersichtskarte sie fuer
     ihre Staedte-Reiter braucht. Diese Seite holt sie sich von dort, statt
     dieselben Zahlen ein zweites Mal zu pflegen. */
  if (STADT) {
    const zeile = (t, w) => "<div class='fakt'><dt>" + esc(t) + "</dt><dd>" + w + "</dd></div>";
    const weg = STADT.strasse_hotel_km === "unbekannt"
      ? "Entfernung unbekannt"
      : STADT.strasse_hotel_km + " km · rund " + STADT.fahrzeit_hotel_min + " min";
    $("fakten").innerHTML =
      zeile("Einwohner", STADT.einwohner === "unbekannt"
        ? "unbekannt"
        : STADT.einwohner.toLocaleString("de-DE") + " <small>(Zählung "
          + esc(STADT.einwohner_jahr) + ")</small>")
      + zeile("Ab dem Quartier", esc(weg))
      + zeile("Luftlinie", STADT.luftlinie_hotel_km + " km")
      + zeile("Griechisch", esc(STADT.name_gr));

    if (STADT.charakteristik && STADT.charakteristik !== "unbekannt")
      $("charakter").textContent = STADT.charakteristik;

    const NAMEN = { museen: ["Museum", "Museen"], festungen: ["Festung", "Festungen"],
      ausgrabungen: ["Ausgrabung", "Ausgrabungen"],
      faehranleger: ["Fähranleger", "Fähranleger"], marinas: ["Marina", "Marinas"] };
    $("merkmale").innerHTML = Object.entries(STADT.merkmale || {})
      .filter(([k, v]) => v > 0 && NAMEN[k])
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => '<span class="chip">' + v + " " + NAMEN[k][v === 1 ? 0 : 1] + "</span>")
      .join("");

    $("wege").innerHTML =
      '<a href="https://www.google.com/maps/search/?api=1&query='
      + encodeURIComponent(SEITE.name + " " + (D.zielName || ""))
      + '" target="_blank" rel="noopener">In Google Maps</a>'
      + (HOTEL ? '<a href="https://www.google.com/maps/dir/?api=1&origin='
        + encodeURIComponent(HOTEL.name + ", " + (HOTEL.adresse || ""))
        + "&destination=" + encodeURIComponent(SEITE.name + " " + (D.zielName || ""))
        + '" target="_blank" rel="noopener">Route ab Quartier</a>' : "")
      + (STADT.wikipedia ? '<a href="' + esc(STADT.wikipedia)
        + '" target="_blank" rel="noopener">Wikipedia</a>' : "");
  } else {
    /* Eine Ortsseite ohne Eintrag in der Insel-Ebene: die Karte steht, die
       Zahlen fehlen. Das gehoert gesagt, nicht verschwiegen. */
    $("charakter").textContent = "Für " + SEITE.name + " liegen in kreta-orte.json "
      + "keine Stadtdaten (Einwohner, Entfernung, Fahrzeit) vor.";
  }

  /* ---------- Karte ---------- */
  const karte = L.map("karte", { scrollWheelZoom: true })
    .setView([SEITE.lat, SEITE.lon], SEITE.zoom || 15);

  const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende',
  }).addTo(karte);
  const satellit = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19, attribution: "Luftbild: Esri, Maxar, Earthstar Geographics" });
  L.control.layers({ "Karte": osm, "Satellit": satellit }, null, { position: "topright" }).addTo(karte);
  L.control.scale({ imperial: false, position: "bottomleft" }).addTo(karte);

  /* Die Pixel-Symbole, dieselbe Schreibweise wie auf der Quartierseite: ein
     9x9-Raster je Zeile, daraus ein Sprite. shape-rendering="crispEdges" ist
     Pflicht - sonst zeichnet der Browser die Pixelkanten weich. */
  const SYMBOLE = {
    /* Busbahnhof: Bus von vorn - Dach, Scheibe, zwei Raeder. */
    busbahnhof: [".XXXXXXX.",
            "XXXXXXXXX",
            "X.......X",
            "X.XXXXX.X",
            "X.XXXXX.X",
            "X.......X",
            "XXXXXXXXX",
            "X.X...X.X",
            ".X.....X."],
    /* Essen & Trinken: Gabel und Messer. */
    essen: ["XX.XX..XX",
            "XX.XX..XX",
            "XX.XX..XX",
            "XXXXX..XX",
            ".XXX...XX",
            "..XX...XX",
            "..XX...XX",
            "..XX...XX",
            "........."],
    /* Kaffee & Backwaren: Tasse mit Henkel auf einer Untertasse. */
    kaffee: [".........",
            ".XXXXX...",
            ".X...X.XX",
            ".X...X.X.",
            ".X...X.XX",
            ".X...X...",
            ".XXXXX...",
            ".........",
            "XXXXXXXXX"],
    /* Altstadt: Haeuserzeile. */
    altstadt: [".........",
            "..X...X..",
            ".XXX.XXX.",
            ".X.X.X.X.",
            "XXXXXXXXX",
            "X.X.X.X.X",
            "XXXXXXXXX",
            "X.XX.XX.X",
            "XXXXXXXXX"],
    /* Festung & Tore: Zinnenkranz. */
    festung: [".........",
            "X.X.X.X.X",
            "XXXXXXXXX",
            "XXXXXXXXX",
            "X.XXXXX.X",
            "XXXXXXXXX",
            "XX.XXX.XX",
            "XXXXXXXXX",
            "XXXXXXXXX"],
    /* Museum: Giebel auf Saeulen. */
    museum: ["....X....",
            "..XXXXX..",
            ".XXXXXXX.",
            "XXXXXXXXX",
            ".........",
            ".X.X.X.X.",
            ".X.X.X.X.",
            ".X.X.X.X.",
            "XXXXXXXXX"],
    /* Kirche: Kreuz ueber dem Bau. */
    kirche: ["....X....",
            "...XXX...",
            "....X....",
            "..XXXXX..",
            ".XX...XX.",
            ".X.....X.",
            ".X.XXX.X.",
            ".X.XXX.X.",
            "XXXXXXXXX"],
    /* Hafen: Anker. */
    hafen: ["....X....",
            "...X.X...",
            "....X....",
            "..XXXXX..",
            "....X....",
            "X...X...X",
            "X...X...X",
            ".X..X..X.",
            "..XXXXX.."],
    /* Strand: Sonne ueber Welle - wie auf der Quartierseite. */
    strand: ["....X....",
            ".X..X..X.",
            "..XXXXX..",
            ".XXXXXXX.",
            "..XXXXX..",
            ".........",
            ".XX...XX.",
            "X..XX...X",
            "........."],
    /* Bauwerk: Loggia, Saeulen unter Gebaelk. */
    bau: [".........",
            "XXXXXXXXX",
            "XXXXXXXXX",
            ".X.X.X.X.",
            ".X.X.X.X.",
            ".X.X.X.X.",
            ".X.X.X.X.",
            "XXXXXXXXX",
            "XXXXXXXXX"],
    hotel: ["....X....",
            "...XXX...",
            "XXXXXXXXX",
            ".XXXXXXX.",
            "..XXXXX..",
            "..XX.XX..",
            ".XX...XX.",
            ".X.....X.",
            "........."],
  };
  (function sprite() {
    let inhalt = "";
    for (const [name, raster] of Object.entries(SYMBOLE)) {
      let rects = "";
      raster.forEach((zeile, y) => {
        let x = 0;
        while (x < zeile.length) {
          if (zeile[x] !== "X") { x++; continue; }
          let b = 0;
          while (zeile[x + b] === "X") b++;
          rects += '<rect x="' + x + '" y="' + y + '" width="' + b + '" height="1"/>';
          x += b;
        }
      });
      inhalt += '<symbol id="sym-' + name + '" viewBox="0 0 9 9">' + rects + "</symbol>";
    }
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
    svg.innerHTML = inhalt;
    document.body.prepend(svg);
  })();

  const symbolSvg = (sym) => SYMBOLE[sym]
    ? '<svg shape-rendering="crispEdges" aria-hidden="true"><use href="#sym-' + sym + '"/></svg>'
    : "";
  const marke = (klasse, sym, klein) => {
    const mass = klein ? 22 : 36;
    return L.divIcon({
      className: "",
      html: '<i class="pixpin ' + klasse + (klein ? " klein" : "") + '">'
        + symbolSvg(sym) + "</i>",
      iconSize: [mass, mass], iconAnchor: [mass / 2, mass / 2],
      popupAnchor: [0, -mass / 2],
    });
  };

  /* ---------- Sehenswertes ----------
     Die Punkte kommen aus ortsdetails.json - dieselbe Mechanik wie die Lokale
     auf der Quartierseite, nur eine Ebene weiter. */
  const DETAIL = (D.ortsdetails || {})[SEITE.id] || { punkte: [] };
  const ARTEN = (D.ortsdetailArten || []).filter(
    (a) => DETAIL.punkte.some((p) => p.art === a.id));
  const PUNKTE = DETAIL.punkte;

  const gruppen = {}, markerVon = new Map();
  const an = new Set(ARTEN.map((a) => a.id));

  const wegeLinks = (p) => {
    const suche = p.maps || ("https://www.google.com/maps/search/?api=1&query="
      + encodeURIComponent(p.name + " " + SEITE.name));
    return '<div class="pop-wege"><a href="' + suche
      + '" target="_blank" rel="noopener">In Google Maps</a>'
      + (HOTEL ? '<a href="https://www.google.com/maps/dir/?api=1&origin='
        + encodeURIComponent(HOTEL.name + ", " + (HOTEL.adresse || ""))
        + "&destination=" + encodeURIComponent(p.name + " " + SEITE.name)
        /* Beim Busbahnhof ist die Frage nicht "wie fahre ich hin", sondern "wie
           komme ich mit dem Bus her". OpenStreetMap kennt keine Fahrplaene -
           dieser Link reicht die Frage an einen Dienst weiter, der sie
           beantworten kann, statt sie hier zu erfinden. Findet Google keine
           Verbindung, sagt es das; eine Zahl auf dieser Seite koennte das nicht. */
        + (p.art === "busbahnhof" ? "&travelmode=transit" : "")
        + '" target="_blank" rel="noopener">'
        + (p.art === "busbahnhof" ? "Bus-Verbindung ab Quartier" : "Route ab Quartier")
        + "</a>" : "")
      + (p.wikipedia ? '<a href="' + esc(p.wikipedia)
        + '" target="_blank" rel="noopener">Wikipedia</a>' : "")
      + (p.web ? '<a href="' + esc(p.web)
        + '" target="_blank" rel="noopener">Website</a>' : "")
      + "</div>";
  };

  const titelVon = (id) => (ARTEN.find((a) => a.id === id) || {}).titel || id;

  ARTEN.forEach((a) => { gruppen[a.id] = L.layerGroup(); });
  PUNKTE.forEach((p, i) => {
    p.id = "p" + i;
    const m = L.marker([p.lat, p.lon], {
      icon: marke("k-" + p.art, p.art, p.art !== "altstadt" && p.art !== "busbahnhof"),
      zIndexOffset: p.art === "busbahnhof" ? 400 : (p.art === "altstadt" ? 300 : 100),
    })
      .bindPopup('<span class="pop-art">' + esc(titelVon(p.art)) + "</span>"
        + '<span class="pop-name">' + esc(p.name) + "</span>"
        + (p.beschreibung ? '<span class="pop-zeile">' + esc(p.beschreibung) + "</span>" : "")
        + ((p.art === "essen" || p.art === "kaffee") && p.bew != null
            ? '<span class="pop-zeile">Google ' + p.bew.toFixed(1) + " / 5"
              + (p.anz ? " (" + p.anz.toLocaleString("de-DE") + " Stimmen)" : "")
              + (p.preis ? " · " + esc(p.preis) : "") + "</span>" : "")
        + ((p.art === "essen" || p.art === "kaffee") && p.adresse
            ? '<span class="pop-zeile">' + esc(p.adresse) + "</span>" : "")
        + (p.zeiten ? '<span class="pop-zeile">Geöffnet: ' + esc(p.zeiten) + "</span>" : "")
        + wegeLinks(p), { maxWidth: 300 })
      .bindTooltip(p.name, { direction: "top", offset: [0, -12] });
    markerVon.set(p.id, m);
    if (gruppen[p.art]) gruppen[p.art].addLayer(m);
  });
  ARTEN.forEach((a) => gruppen[a.id].addTo(karte));

  /* Der Ausschnitt aus reise.json ist die OBERGRENZE, nicht das letzte Wort:
     die Punkte liegen im 2-km-Umkreis, und wie viel davon ins Bild passt,
     haengt an der Fensterbreite. Bei festem Zoom lagen auf 320 px die
     aeusseren Punkte ausserhalb - man sucht sie dann in einer Liste, die
     behauptet, sie stuenden auf der Karte. */
  if (PUNKTE.length > 1) {
    karte.fitBounds(L.latLngBounds(PUNKTE.map((p) => [p.lat, p.lon])),
      { padding: [28, 28], maxZoom: SEITE.zoom || 15 });
  }

  /* ---------- Die Ringe ab dem Ankunftspunkt ----------
     Wer mit dem Bus kommt, steigt am Ueberland-Bahnhof aus und laeuft von dort
     los - nicht vom geometrischen Stadtmittelpunkt. Die Ringe liegen darum um
     den Bahnhof: man liest ab, was zu Fuss erreichbar ist, ohne etwas
     anzuklicken. Bei mehreren Bahnhoefen traegt sie der zentrumsnaechste, und
     genau das steht auch unter der Karte.
     Die Fahne sitzt am noerdlichen Scheitel - dort liegt bei diesen Kuestenorten
     Wasser, sie verdeckt also keine Punkte. */
  const RINGZENTRUM = DETAIL.ringzentrum || null;
  if (RINGZENTRUM) {
    [500, 1000, 2000].forEach((m) => {
      L.circle([RINGZENTRUM.lat, RINGZENTRUM.lon],
        { radius: m, className: "ring", interactive: false }).addTo(karte);
      L.marker([RINGZENTRUM.lat + m / 111320, RINGZENTRUM.lon], {
        icon: L.divIcon({ className: "", html: "", iconSize: [0, 0] }),
        interactive: false, keyboard: false,
      })
        .bindTooltip(m >= 1000 ? (m / 1000) + " km" : m + " m",
          { permanent: true, direction: "center", className: "ringmass" })
        .addTo(karte);
    });
  }

  /* Die Altstadt fuehrt OSM als PUNKT, nicht als Flaeche. Der Kreis ist darum
     ausdruecklich eine Orientierungshilfe und keine Grenze - und genau das
     steht auch unter der Karte. Eine gezeichnete Flaeche, die wie eine amtliche
     aussieht, waere hier die unehrlichere Loesung. */
  const altstadt = PUNKTE.find((p) => p.art === "altstadt");
  if (altstadt) {
    L.circle([altstadt.lat, altstadt.lon],
      { radius: 350, className: "altstadtkreis", interactive: false }).addTo(karte);
  }

  const hinweise = [];
  if (RINGZENTRUM) {
    const weitere = PUNKTE.filter((p) => p.art === "busbahnhof").length - 1;
    hinweise.push("<strong>Die Ringe messen ab dem Busbahnhof</strong> ("
      + esc(RINGZENTRUM.name) + ") — 500 m, 1 km, 2 km. Das ist der Punkt, an dem "
      + "man ankommt, wenn man mit dem Überlandbus anreist."
      + (weitere > 0
        ? " Die Stadt hat noch " + weitere + (weitere === 1 ? " weiteren" : " weitere")
          + " Überland-Bahnhof; gemessen wird ab dem zentrumsnächsten."
        : "")
      + " <em>Welche Linie welchen Bahnhof anfährt, sagt OpenStreetMap nicht — "
      + "Fahrpläne sind dort nicht erfasst.</em>");
  }
  if (altstadt) {
    hinweise.push("<strong>Der Kreis um die Altstadt ist eine Orientierungshilfe, "
      + "keine Grenze.</strong> OpenStreetMap führt die Altstadt als Punkt, nicht als "
      + "Fläche — gezeichnet sind 350 m um diesen Punkt.");
  }
  /* Frueher ein korallenrotes Banner. Die Angaben sind Pflicht, ihre Lautstaerke
     war es nicht - als Ausklapper stehen sie weiter auf der Seite, draengen sich
     aber nicht mehr vor die Karte. Dieselbe Loesung wie bei der Legende auf der
     Uebersichtskarte: <details> ist ohne Skript bedienbar, per Tastatur
     erreichbar und meldet seinen Zustand von sich aus. */
  if (hinweise.length) {
    const h = $("kartenhinweis");
    h.hidden = false;
    h.innerHTML = "<details class='hinweisklapp'><summary>Was die Karte nicht sagt"
      + "<span class='kpfeil' aria-hidden='true'></span></summary>"
      + "<div class='inhalt'>" + hinweise.map((x) => "<p>" + x + "</p>").join("") + "</div></details>";
  }

  /* ---------- Filterleiste ---------- */
  ARTEN.forEach((a) => {
    const n = PUNKTE.filter((p) => p.art === a.id).length;
    const b = document.createElement("button");
    b.className = "knopf"; b.type = "button";
    b.setAttribute("aria-pressed", "true");
    b.innerHTML = '<span class="punkt marksym" style="color:var(--p-' + a.id + ')">'
      + symbolSvg(a.id) + "</span>" + esc(a.titel)
      + ' <span class="zahl">' + n + "</span>";
    b.addEventListener("click", () => {
      if (an.has(a.id)) { an.delete(a.id); karte.removeLayer(gruppen[a.id]); }
      else { an.add(a.id); gruppen[a.id].addTo(karte); }
      b.setAttribute("aria-pressed", String(an.has(a.id)));
      listeZeichnen();
    });
    $("artenLeiste").appendChild(b);
  });

  /* Das Quartier liegt ausserhalb dieses Ausschnitts, gehoert aber auf die
     Karte: es ist der Bezugspunkt, von dem aus man herkommt. Bei den weit
     entfernten Staedten im Osten sieht man es erst beim Herauszoomen - genau
     das ist die Auskunft. */
  if (HOTEL && HOTEL.lat) {
    L.marker([HOTEL.lat, HOTEL.lon], { icon: marke("k-hotel", "hotel", false), zIndexOffset: 500 })
      .bindPopup('<span class="pop-art">Unser Hotel</span><span class="pop-name">'
        + esc(HOTEL.name) + '</span><div class="pop-wege">'
        + "<a href='hotel.html'>Hotel im Detail</a>"
        + (QUARTIER ? "<a href='" + esc(QUARTIER.seite) + "'>Karte vor Ort</a>" : "")
        + "</div>")
      .addTo(karte);
  }

  /* Die Quellenzeilen kommen aus den Daten, nicht je Ort von Hand gepflegt:
     sechs handgeschriebene Abrufdaten altern still, waehrend die Daten
     daneben frisch sind. */
  $("kartequelle").textContent = "Karte: OpenStreetMap-Mitwirkende · Luftbild: Esri";
  $("kartedetail").textContent = STADT
    ? "Stadtdaten und Entfernung: kreta-orte.json, Stand " + (D.inselStand || "unbekannt")
    : "";

  /* ---------- Liste in Reitern ----------
     Derselbe Aufbau wie auf der Quartierseite: eine Gruppe je Art, leere
     Gruppen fallen weg, und die Reiter werden bei jedem Filterwechsel neu
     gebaut - die Tastatur-Handler haengen darum an den neuen Knoepfen. */
  let reiterAktiv = 0;

  function reiterWaehlen(i, fokus) {
    const knoepfe = [...$("listenreiter").querySelectorAll('[role="tab"]')];
    if (!knoepfe.length) return;
    i = Math.max(0, Math.min(i, knoepfe.length - 1));
    reiterAktiv = i;
    knoepfe.forEach((b, k) => {
      const auf = k === i;
      b.setAttribute("aria-selected", auf ? "true" : "false");
      b.tabIndex = auf ? 0 : -1;
      const tafel = document.getElementById(b.getAttribute("aria-controls"));
      if (tafel) tafel.hidden = !auf;
      if (auf && fokus) b.focus();
    });
  }

  const zeileHtml = (p) =>
    '<li class="zeilenhuelle"><button class="zeile" type="button" data-id="' + p.id + '">'
    + '<span class="punkt marksym" style="color:var(--p-' + p.art + ')">'
    + symbolSvg(p.art) + "</span>"
    + '<span><span class="zname">' + esc(p.name) + "</span>"
    + (function () {
        // Keine Zweitzeile, die nur den Namen wiederholt ("Altstadt / Altstadt").
        if (p.art === "essen" || p.art === "kaffee") {
          return '<span class="zmeta">'
            + esc([p.typ, p.bew != null ? p.bew.toFixed(1) + "★"
                    + (p.anz ? " (" + p.anz.toLocaleString("de-DE") + ")" : "") : null,
                   p.preis || null,
                   p.m_bus != null ? p.m_bus + " m ab Bus" : null]
              .filter(Boolean).join(" · ")) + "</span>";
        }
        const zweit = p.beschreibung
          || (p.art === "busbahnhof" && p.entfernung_zentrum_m != null
            ? "Überlandbusse · " + p.entfernung_zentrum_m + " m vom Stadtzentrum"
              + (p.betreiber ? " · " + p.betreiber : "")
            : titelVon(p.art));
        return zweit && zweit !== p.name
          ? '<span class="zmeta">' + esc(zweit) + "</span>" : "";
      })() + "</span>"
    + "</button>"
    + '<a class="zumaps" href="'
    + (p.maps || ("https://www.google.com/maps/search/?api=1&query="
        + encodeURIComponent(p.name + " " + SEITE.name)))
    + '" target="_blank" rel="noopener" aria-label="' + esc(p.name)
    + ' in Google Maps ansehen">Maps</a></li>';

  function listeZeichnen() {
    const sichtbar = PUNKTE.filter((p) => an.has(p.art));
    const proArt = {};
    for (const p of sichtbar) (proArt[p.art] ||= []).push(p);
    const zeigbar = ARTEN.filter((a) => (proArt[a.id] || []).length);

    $("listenreiter").innerHTML = zeigbar.map((a, i) =>
      '<button role="tab" type="button" id="rt-' + a.id + '" aria-controls="tp-' + a.id + '"'
      + ' aria-selected="' + (i === reiterAktiv ? "true" : "false") + '"'
      + (i === reiterAktiv ? "" : ' tabindex="-1"') + ">"
      + '<span class="punkt marksym" style="color:var(--p-' + a.id + ')">'
      + symbolSvg(a.id) + "</span>" + esc(a.titel)
      + ' <span class="zahl">' + proArt[a.id].length + "</span></button>").join("");

    $("listentafeln").innerHTML = zeigbar.map((a, i) =>
      '<div class="tafelinhalt" role="tabpanel" id="tp-' + a.id + '"'
      + ' aria-labelledby="rt-' + a.id + '" tabindex="0"'
      + (i === reiterAktiv ? "" : " hidden") + ">"
      + '<ul class="liste">' + proArt[a.id].map(zeileHtml).join("") + "</ul></div>").join("");

    [...$("listenreiter").querySelectorAll('[role="tab"]')].forEach((b, i) => {
      b.addEventListener("click", () => reiterWaehlen(i, false));
      b.addEventListener("keydown", (e) => {
        const n = zeigbar.length;
        if (e.key === "ArrowRight") { reiterWaehlen((i + 1) % n, true); e.preventDefault(); }
        else if (e.key === "ArrowLeft") { reiterWaehlen((i - 1 + n) % n, true); e.preventDefault(); }
        else if (e.key === "Home") { reiterWaehlen(0, true); e.preventDefault(); }
        else if (e.key === "End") { reiterWaehlen(n - 1, true); e.preventDefault(); }
      });
    });
    if (reiterAktiv >= zeigbar.length) reiterWaehlen(0, false);
  }

  /* Ein Klick in der Liste zeigt den Punkt auf der Karte. Der Handler haengt am
     bleibenden Behaelter - die Tafeln darin werden neu gebaut. */
  $("listentafeln").addEventListener("click", (e) => {
    const b = e.target.closest(".zeile");
    if (!b) return;
    const p = PUNKTE.find((x) => x.id === b.dataset.id);
    const m = markerVon.get(b.dataset.id);
    if (!p || !m) return;
    karte.setView([p.lat, p.lon], Math.max(karte.getZoom(), 16));
    m.openPopup();
    $("karte").scrollIntoView({ block: "nearest",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });

  if (PUNKTE.length) listeZeichnen();

  /* ---------- Was NICHT erhoben ist, steht auf der Seite ----------
     Sonst liest sich eine Liste mit zwei Dutzend Punkten wie eine
     vollstaendige. Gastronomie und Geschaefte sind nur fuer den Quartierort
     recherchiert; die Zahl dort wird gezaehlt, nicht behauptet. */
  const quartierOrte = (D.orte || []).filter((o) => o.art !== "Bus").length;
  const kasten = document.createElement("div");
  kasten.className = "nochleer";
  if (!PUNKTE.length) {
    kasten.innerHTML = "<p><strong>Hier ist noch nichts erfasst.</strong> Für "
      + esc(SEITE.name) + " liegen noch keine Sehenswürdigkeiten aus OpenStreetMap vor. "
      + "Die Seite zeigt bewusst eine leere Liste statt einer gefüllten, die niemand "
      + "geprüft hat.</p>";
  } else if (PUNKTE.some((p) => p.art === "essen" || p.art === "kaffee")) {
    /* Sobald Lokale da sind, ist die ehrliche Auskunft eine andere: nicht
       "nicht erfasst", sondern "gefiltert". Wer das nicht sagt, laesst eine
       Auswahl wie eine Vollstaendigkeit aussehen - und ein Lokal, das fehlt,
       wirkt dann wie eines, das es nicht gibt. */
    const n = PUNKTE.filter((p) => p.art === "essen" || p.art === "kaffee").length;
    kasten.className = "";
    kasten.innerHTML = "<details class='hinweisklapp'><summary>Wie diese "
      + n + " Lokale ausgewählt wurden<span class='kpfeil' aria-hidden='true'></span>"
      + "</summary><div class='inhalt'>"
      + "<p><strong>Eine Auswahl, keine Liste aller.</strong> Aufgenommen ist, was bei "
      + "Google mindestens 4,7 Sterne bei mindestens 300 Stimmen hat — beides zusammen: "
      + "eine 5,0 aus zwölf Stimmen sagt nichts. Was fehlt, ist deshalb nicht schlecht, "
      + "sondern liegt unter der Schwelle.</p>"
      + "<p>Gehobene Preisstufen und reine Fischlokale sind ausgenommen. "
      + "<em>Google unterscheidet dabei nicht zwischen einem Fischrestaurant und einer "
      + "Taverne, die auch Fisch führt — der Filter kann eine Taverne zu Unrecht "
      + "treffen.</em></p>"
      + "<p>Öffnungszeiten stehen bewusst nicht dabei: sie ändern sich saisonal und "
      + "wären am Abrufdatum festgenagelt.</p></div></details>"
  } else {
    kasten.innerHTML = "<p><strong>Noch nicht erfasst:</strong> Lokale, Cafés und "
      + "Geschäfte in " + esc(SEITE.name) + ". Was hier steht, sind Sehenswürdigkeiten "
      + "aus OpenStreetMap; die Gastronomie ist für diesen Ort nicht recherchiert."
      + (QUARTIER && quartierOrte
        ? " Für " + esc(QUARTIER.name) + " sind es zum Vergleich " + quartierOrte
          + " einzeln geprüfte Orte — <a href='" + esc(QUARTIER.seite)
          + "'>so sieht das dann aus</a>."
        : "")
      + "</p>"
      /* Ein fehlender Altstadt-Kreis sieht aus wie "hier gibt es keine Altstadt".
         Tatsaechlich fuehrt OpenStreetMap nur in Rethymno einen Punkt dafuer;
         Chania steht dort mit seinen sechs Vierteln (Kastelli, Splantzia,
         Topanas …), Heraklion und Agios Nikolaos nur mit Wohnvierteln. Wer das
         verschweigt, laesst eine Datenluecke wie einen Befund aussehen. */
      + (altstadt ? "" : "<p><strong>Kein Altstadt-Bereich eingezeichnet.</strong> "
        + "OpenStreetMap führt für " + esc(SEITE.name) + " keinen Altstadt-Punkt — "
        + "mancherorts stehen dort stattdessen die einzelnen Viertel, anderswo gar "
        + "nichts. Der Kreis fehlt also wegen der Datenlage, nicht weil es keine "
        + "Altstadt gäbe.</p>");
  }
  $("ortsliste").appendChild(kasten);

  $("fuss").innerHTML =
    "<p>Kartenmaterial: &copy; OpenStreetMap-Mitwirkende (ODbL) · Luftbild: Esri, Maxar, "
    + "Earthstar Geographics.</p>"
    + "<p>Sehenswürdigkeiten: " + esc((D.ortsdetailQuellen || {}).punkte || "unbekannt") + "</p>"
    + ((D.ortsdetailQuellen || {}).beschreibung
      ? "<p>Beschreibungen: " + esc(D.ortsdetailQuellen.beschreibung) + "</p>" : "")
    + (STADT ? "<p>Stadtdaten: Einwohner aus Wikidata (griechische Volkszählung), "
      + "Straßenentfernung und Fahrzeit aus OSRM ab dem gewählten Quartier, "
      + "Charakteristik aus Wikipedia — alle abgerufen "
      + esc(D.inselStand || "unbekannt") + ".</p>" : "");
})();
