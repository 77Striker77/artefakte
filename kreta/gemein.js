// Gemeinsame Textausgabe.
//
// esc() ist die strenge Form und gehoert in jedes Attribut.
// reich() ist fuer Fliesstext: escapen wie immer, danach genau ein Tag wieder
// zulassen. hotels.json enthaelt 188 <b>-Auszeichnungen, weil dieselben Felder
// auch die PDF speisen; ohne diese Ausnahme stuenden die spitzen Klammern als
// Text auf der Seite. Allowlist, kein Roh-Einbau: alles andere bleibt entschaerft.
window.esc = function (s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
};
window.reich = function (s) {
  return window.esc(s)
    .replace(/&lt;b&gt;/g, "<strong>")
    .replace(/&lt;\/b&gt;/g, "</strong>");
};

// Menue: die aktuelle Seite markieren und die reiseabhaengigen Beschriftungen
// setzen. Einen Themenumschalter gibt es nicht mehr - eine Palette, durchgezogen.
//
// Marke und der Name des Vor-Ort-Punktes kommen aus reise.json (ueber daten.js).
// Sie stehen im Markup aller Seiten nur als Rueckfall - haette man sie dort
// gepflegt, muesste man fuer die naechste Reise jede Datei anfassen und wuerde
// eine davon vergessen. "Vor Ort" heisst darum jetzt so wie der Ort, an dem das
// gewaehlte Quartier liegt: das ist die Information, die man auf einem Menuepunkt
// tatsaechlich sucht.
(function () {
  "use strict";
  const D = window.DATEN || {};
  const hier = location.pathname.replace(/\/$/, "").split("/").pop() || "index.html";

  /* Die Ortspunkte im Menue kommen aus reise.json, nicht aus dem Markup der
     Seiten. Eine weitere Ortsseite ist damit ein Eintrag dort plus eine
     HTML-Datei - stuenden sie im Markup, muesste man fuer jeden neuen Ort alle
     elf Seiten anfassen und wuerde eine vergessen.

     Die erste Ebene traegt nur den Quartierort, und der traegt einen Stern: er
     ist der einzige, an dem man tatsaechlich wohnt. Die Staedte liegen in einem
     eigenen Aufklapper - sieben Ortspunkte nebeneinander sprengen die Leiste,
     auf dem Handy schon bei dreien. */
  const orte = D.ortsseiten || [];
  const quartiere = orte.filter((o) => o.quartier);
  const staedte = orte.filter((o) => !o.quartier);

  const ortLink = (o) => {
    const a = document.createElement("a");
    a.href = o.seite;
    if (o.quartier) {
      const st = document.createElement("span");
      st.className = "menuestern";
      st.textContent = "★";
      st.setAttribute("aria-hidden", "true");
      a.append(st, document.createTextNode(o.name));
      a.title = o.name + " — hier liegt das gewählte Hotel";
    } else {
      a.textContent = o.name;
    }
    return a;
  };

  const halter = document.querySelector(".menue a[href='karte.html']");
  /* Ohne Quartiereintrag bliebe an dieser Stelle ein Loch: der Platzhalter waere
     ersetzt durch nichts. Dann bleibt er lieber stehen. */
  if (halter && quartiere.length) {
    const frag = document.createDocumentFragment();
    quartiere.forEach((o) => frag.append(ortLink(o)));
    halter.replaceWith(frag);
  }

  /* Der Staedte-Aufklapper wird hier gebaut, nicht im Markup gepflegt - sonst
     traegt jede der Seiten dieselbe Liste ein zweites Mal. Er steht als
     Geschwister NEBEN .menue: die Leiste hat overflow-x:auto und wuerde ein
     aufgeklapptes Untermenue darin auch senkrecht abschneiden. */
  const mehr = document.querySelector(".untermenue");
  if (staedte.length && mehr) {
    const d = document.createElement("details");
    d.className = "untermenue";
    const s = document.createElement("summary");
    s.setAttribute("aria-label", "Städte auf " + (D.zielName || "der Insel"));
    s.append(document.createTextNode("Städte"));
    const pfeil = document.createElement("span");
    pfeil.className = "mpfeil";
    pfeil.setAttribute("aria-hidden", "true");
    s.append(pfeil);
    const tafel = document.createElement("div");
    tafel.className = "untermenue-tafel";
    staedte.forEach((o) => tafel.append(ortLink(o)));
    d.append(s, tafel);
    mehr.before(d);
  }

  // Auch die Links im Untermenue: das steht seit dem Klipprand-Umbau NEBEN
  // .menue, nicht mehr darin - ein Selektor nur auf ".menue a" liesse die
  // Hotelseite so aussehen, als waere man nirgends.
  document.querySelectorAll(".menue a, .untermenue-tafel a").forEach((a) => {
    const ziel = a.getAttribute("href").replace(/\/$/, "").split("/").pop() || "index.html";
    if (ziel === hier) a.setAttribute("aria-current", "page");
  });
  const marke = document.querySelector(".marke");
  if (marke && D.texte && D.texte.marke) marke.textContent = D.texte.marke;

  /* Liegt die aktuelle Seite in einem Untermenue, faerbt sich der Aufklapper mit -
     sonst sieht die Leiste auf der Hotelseite so aus, als waere man nirgends.
     Seit es zwei Aufklapper gibt (Staedte und Mehr), laeuft das ueber alle. */
  document.querySelectorAll(".untermenue").forEach((unter) => {
    if (unter.querySelector('a[aria-current="page"]')) unter.classList.add("hier");

    /* Ein Klick daneben schliesst das Menue. <details> tut das von sich aus
       nicht - es bliebe offen stehen, bis man den Aufklapper erneut trifft.
       Ein Klick auf den einen Aufklapper schliesst dabei auch den anderen:
       zwei gleichzeitig offene Tafeln ueberlagern einander. */
    document.addEventListener("click", (e) => {
      if (unter.open && !unter.contains(e.target)) unter.open = false;
    });
    /* Escape schliesst und gibt den Fokus zurueck auf den Aufklapper. Ohne das
       landet man mit der Tastatur in einem offenen Menue und kommt nur per Tab
       wieder heraus. */
    unter.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && unter.open) {
        unter.open = false;
        unter.querySelector("summary").focus();
      }
    });
  });
})();
