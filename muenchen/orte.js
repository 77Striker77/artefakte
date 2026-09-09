// ERZEUGT von bau/bau-oeffentlich.mjs am 2026-09-09.
// Nicht von Hand aendern — Quelle ist bau/muenchen-orte.json und bau/reise.json.
const DATEN = {
 "ziel": {
  "name": "München",
  "land": "Deutschland",
  "mitte": {
   "lat": 48.1487,
   "lon": 11.5793
  },
  "zoom": 12,
  "bbox": [
   48.061,
   11.36,
   48.248,
   11.723
  ],
  "quelle": "OpenStreetMap, Relation 62428 (Stadtgrenze München)",
  "abgerufen": "2026-09-09",
  "rang": "primary"
 },
 "texte": {
  "marke": "München",
  "eyebrow": "Reiseziel · Deutschland",
  "titel": "München",
  "titel_betont": "erst die Stadt, dann die Tage",
  "unterzeile": "Die Stadt auf einer Karte: der Ankunftspunkt und die Orientierungspunkte, an denen man sich in München zurechtfindet. Diese Seite wächst mit der Recherche — Unterkunft, Wege und Tage kommen dazu, sobald sie feststehen."
 },
 "quelle": {
  "name": "OpenStreetMap über die Overpass-API",
  "abgerufen": "2026-09-09",
  "rang": "primary",
  "lizenz": "ODbL"
 },
 "orte": [
  {
   "id": "hauptbahnhof",
   "name": "München Hauptbahnhof",
   "art": "ankunft",
   "kurz": "Hbf",
   "lat": 48.1407253,
   "lon": 11.5569426,
   "notiz": "Der Ankunftspunkt. Fern-, Regional-, S- und U-Bahn unter einem Dach.",
   "osm": "node/2470201868"
  },
  {
   "id": "marienplatz",
   "name": "Marienplatz",
   "art": "zentrum",
   "kurz": "Mitte",
   "lat": 48.1371436,
   "lon": 11.5753989,
   "notiz": "Der Mittelpunkt der Altstadt, mit dem Neuen Rathaus. Von Hbf zwei Stationen mit der S-Bahn.",
   "osm": "node/2941687118"
  },
  {
   "id": "frauenkirche",
   "name": "Frauenkirche",
   "art": "wahrzeichen",
   "kurz": "Dom",
   "lat": 48.1386005,
   "lon": 11.5735983,
   "notiz": "Die zwei Kuppeltürme sind das Wahrzeichen der Stadt und von fast überall die Orientierung.",
   "osm": "way/225698612"
  },
  {
   "id": "englischer-garten",
   "name": "Englischer Garten",
   "art": "park",
   "kurz": "Park",
   "lat": 48.1649065,
   "lon": 11.6062213,
   "notiz": "Zieht sich vom Stadtzentrum nach Norden bis über die Stadtgrenze hinaus.",
   "osm": "way/159075298"
  },
  {
   "id": "olympiapark",
   "name": "Olympiapark",
   "art": "park",
   "kurz": "Olympia",
   "lat": 48.1687819,
   "lon": 11.5496527,
   "notiz": "Das Gelände der Spiele von 1972 im Norden, mit Zeltdach, See und Turm.",
   "osm": "way/10053878"
  }
 ]
};
