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

// Gemeinsames Verhalten aller drei Seiten: Themenumschalter und Menue-Markierung.
(function () {
  "use strict";

  // --- Thema -----------------------------------------------------------------
  // Drei Zustaende: ausdrueckliche Wahl (data-theme), sonst Systemeinstellung.
  // Die Wahl ueberlebt den Seitenwechsel, sonst springt das Menue bei jedem Klick.
  const wurzel = document.documentElement;
  let gespeichert = null;
  try { gespeichert = localStorage.getItem("kreta-thema"); } catch (e) { /* Privatfenster */ }
  if (gespeichert === "dark" || gespeichert === "light") wurzel.dataset.theme = gespeichert;

  const dunkel = () => wurzel.dataset.theme === "dark"
    || (!wurzel.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);

  const knopf = document.querySelector(".themaKnopf");
  const beschriften = () => {
    if (!knopf) return;
    const d = dunkel();
    knopf.textContent = d ? "Hell" : "Dunkel";
    knopf.setAttribute("aria-pressed", String(d));
  };
  if (knopf) {
    knopf.addEventListener("click", () => {
      wurzel.dataset.theme = dunkel() ? "light" : "dark";
      try { localStorage.setItem("kreta-thema", wurzel.dataset.theme); } catch (e) { /* egal */ }
      beschriften();
      document.dispatchEvent(new CustomEvent("themawechsel"));
    });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (!wurzel.dataset.theme) { beschriften(); document.dispatchEvent(new CustomEvent("themawechsel")); }
    });
    beschriften();
  }

  // --- Menue: die aktuelle Seite markieren -----------------------------------
  const hier = location.pathname.replace(/\/$/, "").split("/").pop() || "index.html";
  document.querySelectorAll(".menue a").forEach((a) => {
    const ziel = a.getAttribute("href").replace(/\/$/, "").split("/").pop() || "index.html";
    if (ziel === hier) a.setAttribute("aria-current", "page");
  });
})();
