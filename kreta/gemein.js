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
// Sie stehen im Markup aller vier Seiten nur als Rueckfall - haette man sie dort
// gepflegt, muesste man fuer die naechste Reise vier Dateien anfassen und wuerde
// eine davon vergessen. "Vor Ort" heisst darum jetzt so wie der Ort, an dem das
// gewaehlte Quartier liegt: das ist die Information, die man auf einem Menuepunkt
// tatsaechlich sucht.
(function () {
  "use strict";
  const D = window.DATEN || {};
  const hier = location.pathname.replace(/\/$/, "").split("/").pop() || "index.html";
  document.querySelectorAll(".menue a").forEach((a) => {
    const ziel = a.getAttribute("href").replace(/\/$/, "").split("/").pop() || "index.html";
    if (ziel === hier) a.setAttribute("aria-current", "page");
    if (ziel === "karte.html" && D.bezugOrt && D.bezugOrt !== "unbekannt") {
      a.textContent = D.bezugOrt;
      a.title = "Vor Ort: " + D.bezugOrt;
    }
  });
  const marke = document.querySelector(".marke");
  if (marke && D.texte && D.texte.marke) marke.textContent = D.texte.marke;
})();
