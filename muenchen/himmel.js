// himmel.js — der Pixel-Sternenhimmel hinter dem ganzen Cockpit.
//
// Uebernommen aus der Bausteinbibliothek der Design-Werkstatt
// (artefakt-bausteine/vorlagen/background-pixel-stars.html), nicht neu erfunden.
// Fuenf Dinge sind gegenueber der Vorlage anders, und jedes hat einen Grund:
//
//   1. EINE Blockgroesse fuer alles. Die Vorlage setzt Sterne auf ein 5-px- und
//      Schnuppen auf ein 2-px-Raster und nennt das selbst als Falle: zwei
//      Aufloesungen uebereinander ergeben kein Pixelbild, sondern zwei.
//   2. Die Farben kommen aus dem Stylesheet, nicht aus einer Palette im Skript.
//      Zwei Fassungen einer Farbe driften auseinander - dieselbe Begruendung,
//      aus der karte.js die Linienfarben aus den Tokens liest.
//   3. Die Deckung ist GEDECKELT (siehe DECKEL). Ein Hintergrund, der hinter
//      Text liegt, verschiebt dessen gemessenen Kontrast; ohne feste Obergrenze
//      waere der Kontrast dieser Seite vom Zufallsgenerator abhaengig und damit
//      nicht mehr pruefbar. Genau die Falle, die diese Seite bei Leaflets
//      Attributionsleiste und bei den Kartenmarken schon einmal hatte.
//   4. prefers-reduced-motion zeichnet EIN Bild und startet keine Schleife. Die
//      Vorlage fragt es gar nicht ab und nennt das als ihren wichtigsten
//      fehlenden Schalter - ein flaechendeckendes Blinken ist genau das, was
//      diese Einstellung meint.
//   5. Gezeichnet wird auf einen ZWEITEN Puffer und in EINEM Zug kopiert. Nur so
//      haelt der Deckel aus 3. auch bei ueberlappenden Bloecken; die Vorlage
//      setzt die Deckung je Block, und Canvas addiert sie dann.
//
// Der Himmel ist reine Zier: er traegt keine Auskunft, ist aria-hidden und
// nimmt keine Klicks. Faellt er aus, fehlt nichts als der Effekt.
(function () {
  "use strict";

  var leinwand = document.getElementById("himmel");
  if (!leinwand || !leinwand.getContext) return;
  var ctx = leinwand.getContext("2d");

  // GEMESSEN am 09.09.2026, nicht geschaetzt: bei 0,22 Deckung steht der
  // schwaechste Textton der Seite (--auf-grund-leise, #E0AFA8) auf dem hellsten
  // Stern (--auf-grund auf --grund) noch bei 5,08:1. Bei 0,26 faellt er unter
  // 4,5:1. Wer den Wert anhebt, hebt ihn gegen diese Rechnung an - und
  // pruef-farben.mjs misst genau diesen Fall mit.
  var DECKEL = 0.22;

  // WIE der Deckel gehalten wird, und warum nicht anders: gezeichnet wird auf
  // eine ZWEITE, unsichtbare Leinwand mit voller Deckung, und die wird danach in
  // EINEM Zug mit globalAlpha = DECKEL herueberkopiert.
  //
  // Der erste Versuch setzte die Deckung je Block. Das hielt genau so lange, wie
  // sich zwei Bloecke nicht ueberlappten - danach addiert Canvas die Deckungen.
  // Gemessen kamen 0,427 heraus statt 0,220, also fast das Doppelte, und der
  // Kontrastnachweis darunter war damit wertlos. Aufgefallen ist es nur, weil
  // die Pruefung den Bildpuffer ausliest statt das Ergebnis anzusehen.
  //
  // Ueber den Umweg ist der Deckel keine Absicht mehr, sondern eine RECHNUNG:
  // was im Puffer steht, kann hoechstens deckend sein, und deckend mal DECKEL
  // ist DECKEL. Zwei uebereinanderliegende Sterne werden dadurch nicht heller
  // als einer - sie verschmelzen, so wie es im Pixelbild auch aussehen soll.
  var puffer = document.createElement("canvas");
  var pctx = puffer.getContext("2d");

  var BLOCK = 4;         // eine Kantenlaenge fuer Sterne UND Schnuppen
  var BILDRATE = 16;     // der Vorlagenwert: schnell genug zum Flimmern,
                         // langsam genug, dass es nicht nach Video aussieht
  // Sterne je 100 000 Geraetepixel. Erster Versuch waren 9 - gemessen 103
  // Bloecke auf 1280x900, und das las sich als Staub, nicht als Himmel. Die
  // Dichte ist der Hebel, der den Effekt sichtbar macht, OHNE den Deckel
  // anzutasten: der Kontrast haengt an der Deckung eines einzelnen Blocks, nicht
  // an ihrer Zahl. 22 statt der 25 der Vorlage - das hier ist ein Werkzeug und
  // keine Effektbuehne.
  var DICHTE = 22;
  var SCHNUPPE_ALLE = 9000;

  // Aus dem Stylesheet, nicht hier wiederholt. Warme Toene liegen auf dieser
  // Seite als PUNKT vor, nie als Flaeche - ein 4-px-Block ist ein Punkt.
  var wurzel = getComputedStyle(document.documentElement);
  var farbe = function (name, ersatz) {
    var v = wurzel.getPropertyValue(name).trim();
    return v || ersatz;
  };
  var PALETTE = [
    farbe("--auf-grund", "#FBEDEA"),
    farbe("--auf-grund-leise", "#E0AFA8"),
    farbe("--auf-grund-leise", "#E0AFA8"),
    farbe("--m-zentrum", "#C2410C"),
    farbe("--m-ankunft", "#7C6100")
  ];
  var SPUR = farbe("--auf-grund-leise", "#E0AFA8");

  var ruhig = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  var breite = 0, hoehe = 0, kante = BLOCK, spalten = 0, zeilen = 0;
  var sterne = [], schnuppen = [], bild = 0, letzte = 0, uhr = null;

  function neuMessen () {
    var dpr = window.devicePixelRatio || 1;
    // In GERAETEPIXELN rechnen und die Kante auf ganze runden - sonst
    // interpoliert der Browser die Bloecke und der Pixel-Look wird weich.
    kante = Math.max(1, Math.round(BLOCK * dpr));
    breite = Math.round(window.innerWidth * dpr);
    hoehe = Math.round(window.innerHeight * dpr);
    if (!breite || !hoehe) return;
    leinwand.width = breite;
    leinwand.height = hoehe;
    puffer.width = breite;
    puffer.height = hoehe;
    ctx.imageSmoothingEnabled = false;
    pctx.imageSmoothingEnabled = false;
    spalten = Math.floor(breite / kante);
    zeilen = Math.floor(hoehe / kante);
    sterneSetzen();
    zeichnen(0);
  }

  function neuerStern () {
    return {
      sx: (Math.random() * spalten) | 0,
      sy: (Math.random() * zeilen) | 0,
      farbe: PALETTE[(Math.random() * PALETTE.length) | 0],
      // Relative Deckung, 0 bis 1. Der Deckel wird NICHT hier eingerechnet -
      // sonst stuende er zweimal drin, sobald der Puffer kopiert wird.
      deckung: 0.45 + Math.random() * 0.55,
      // Jeder achte Stern ist zwei Bloecke breit. Das ist KEIN zweites Raster -
      // die Falle der Vorlage waren zwei verschiedene Rastermasse (5 px und
      // 2 px) im selben Bild; hier liegt alles auf demselben 4-px-Gitter und
      // belegt nur mehr Felder davon. Groesse macht den Himmel sichtbar, wo
      // Helligkeit es nicht darf: sie aendert am Kontrast nichts.
      gross: Math.random() < 0.13,
      blinkt: Math.random() < 0.55,
      takt: 2 + Math.random() * 3,
      alter: Math.random() * 2,
      hell: Math.random() < 0.5
    };
  }

  function sterneSetzen () {
    var anzahl = Math.floor(breite * hoehe / 100000 * DICHTE);
    sterne = [];
    for (var i = 0; i < anzahl; i++) sterne.push(neuerStern());
  }

  function schnuppeStarten () {
    if (!breite || ruhig.matches || document.hidden) return;
    var winkel = (50 + Math.random() * 70) * Math.PI / 180;
    schnuppen.push({
      x: Math.random() * breite, y: 0,
      dx: Math.cos(winkel), dy: Math.sin(winkel),
      tempo: (7 + Math.random() * 4) * (kante / BLOCK),
      seit: 0, spur: []
    });
  }

  function zeichnen (dt) {
    // Alles auf den PUFFER, mit relativer Deckung. Der Deckel kommt erst beim
    // Kopieren dazu - Begruendung oben bei DECKEL.
    pctx.clearRect(0, 0, breite, hoehe);

    for (var i = 0; i < sterne.length; i++) {
      var s = sterne[i];
      if (s.blinkt && dt) {
        s.alter += dt;
        if (s.alter >= s.takt) { s.alter = 0; s.hell = !s.hell; }
      }
      // Harte Stufe statt weichem Verlauf: das ist der 16-Bit-Look, und die
      // Seite lebt ohnehin von harten Kanten.
      pctx.globalAlpha = s.blinkt && !s.hell ? s.deckung * 0.35 : s.deckung;
      pctx.fillStyle = s.farbe;
      var k = s.gross ? kante * 2 : kante;
      pctx.fillRect(s.sx * kante, s.sy * kante, k, k);
    }

    pctx.globalAlpha = 1;

    schnuppen = schnuppen.filter(function (f) {
      f.x += f.dx * f.tempo;
      f.y += f.dy * f.tempo;
      f.seit += f.tempo;
      if (f.seit >= kante) {
        f.seit = 0;
        f.spur.push({ sx: (f.x / kante) | 0, sy: (f.y / kante) | 0, deckung: 1 });
      }
      f.spur = f.spur.filter(function (p) { return (p.deckung -= 0.12) > 0; });

      pctx.fillStyle = SPUR;
      for (var j = 0; j < f.spur.length; j++) {
        pctx.globalAlpha = f.spur[j].deckung;
        pctx.fillRect(f.spur[j].sx * kante, f.spur[j].sy * kante, kante, kante);
      }
      pctx.globalAlpha = 1;
      pctx.fillStyle = PALETTE[0];
      pctx.fillRect(((f.x / kante) | 0) * kante, ((f.y / kante) | 0) * kante, kante, kante);

      return f.x > -80 && f.x < breite + 80 && f.y < hoehe + 80;
    });

    // Der eine Zug, an dem der ganze Kontrastnachweis haengt.
    ctx.clearRect(0, 0, breite, hoehe);
    ctx.globalAlpha = DECKEL;
    ctx.drawImage(puffer, 0, 0);
    ctx.globalAlpha = 1;
  }

  function schritt (zeit) {
    var abstand = 1000 / BILDRATE;
    if (zeit - letzte >= abstand) {
      var dt = letzte ? Math.min((zeit - letzte) / 1000, 0.25) : 0;
      zeichnen(dt);
      letzte = zeit;
    }
    bild = requestAnimationFrame(schritt);
  }

  function anhalten () {
    if (bild) { cancelAnimationFrame(bild); bild = 0; }
    if (uhr) { clearTimeout(uhr); uhr = null; }
  }

  function laufen () {
    anhalten();
    // Ein Standbild ist die richtige Antwort auf reduzierte Bewegung - nicht
    // ein leerer Hintergrund. Der Effekt bleibt sichtbar, nur ohne Blinken.
    if (ruhig.matches) { zeichnen(0); return; }
    letzte = 0;
    bild = requestAnimationFrame(schritt);
    (function takt () {
      uhr = setTimeout(function () { schnuppeStarten(); takt(); },
                       SCHNUPPE_ALLE * (0.6 + Math.random() * 0.8));
    }());
  }

  // In einem verdeckten Reiter weiterzurechnen kostet Akku und zeigt niemandem
  // etwas. requestAnimationFrame pausiert von selbst, der Schnuppen-Timer nicht.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) anhalten(); else laufen();
  });

  var wartet = 0;
  window.addEventListener("resize", function () {
    clearTimeout(wartet);
    wartet = setTimeout(neuMessen, 180);
  });

  if (ruhig.addEventListener) ruhig.addEventListener("change", laufen);

  neuMessen();
  laufen();
}());
