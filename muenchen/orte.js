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
  "unterzeile": ""
 },
 "menue": [
  {
   "id": "karte",
   "label": "Karte",
   "ansicht": "feld-karte"
  },
  {
   "id": "quellen",
   "label": "Quellen",
   "ansicht": "feld-quellen"
  }
 ],
 "reisedaten": [
  {
   "feld": "Ziel",
   "wert": "München"
  },
  {
   "feld": "Hinfahrt",
   "wert": "xx"
  },
  {
   "feld": "Rückfahrt",
   "wert": "xx"
  },
  {
   "feld": "Nächte",
   "wert": "xx"
  },
  {
   "feld": "Unterkunft",
   "wert": "xx"
  },
  {
   "feld": "Reisende",
   "wert": "xx"
  }
 ],
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
   "id": "bavaria-filmstadt",
   "name": "Bavaria Filmstadt",
   "art": "film",
   "kurz": "Film",
   "lat": 48.0654274,
   "lon": 11.554015,
   "notiz": "Die Filmstudios in Grünwald, südlich der Stadtgrenze: Kulissenführung, Bullyversum und 4D-Kino. Auf dem Gelände stehen unter anderem die Kulissen von „Das Boot“ und „Wickie“.",
   "osm": "node/5600642776",
   "web": "https://www.filmstadt.de/"
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
 ],
 "bahn": {
  "quelle": {
   "name": "OpenStreetMap über die Overpass-API",
   "abfrage": "railway=station und railway=halt innerhalb der Stadtgrenze München (Relation 62428); Linien über ihre Routen-Relation",
   "abgerufen": "2026-09-09",
   "rang": "primary",
   "lizenz": "ODbL"
  },
  "anzahl": {
   "gesamt": 143,
   "ubahn": 97,
   "sbahn": 46,
   "linien": 1,
   "linienhalte": 23,
   "halte_linien_unbekannt": 0,
   "halte_linien_leer": 1
  },
  "halte": [
   {
    "name": "Aidenbachstraße",
    "art": "ubahn",
    "lat": 48.097887,
    "lon": 11.525195,
    "osm": "node/2650093383",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Allach",
    "art": "sbahn",
    "lat": 48.190034,
    "lon": 11.468105,
    "osm": "node/2488012710",
    "linien": [
     "S2"
    ],
    "fern": 0
   },
   {
    "name": "Alte Heide",
    "art": "ubahn",
    "lat": 48.178552,
    "lon": 11.602555,
    "osm": "node/1927202335",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Am Hart",
    "art": "ubahn",
    "lat": 48.195925,
    "lon": 11.571815,
    "osm": "node/28201702",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Arabellapark",
    "art": "ubahn",
    "lat": 48.153555,
    "lon": 11.622063,
    "osm": "node/2660339813",
    "linien": [
     "U4"
    ],
    "fern": 0
   },
   {
    "name": "Aubing",
    "art": "sbahn",
    "lat": 48.155971,
    "lon": 11.413159,
    "osm": "node/2488173642",
    "linien": [
     "S4",
     "S20"
    ],
    "fern": 0
   },
   {
    "name": "Basler Straße",
    "art": "ubahn",
    "lat": 48.091273,
    "lon": 11.491169,
    "osm": "node/2650093388",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Berg am Laim",
    "art": "sbahn",
    "lat": 48.133971,
    "lon": 11.6336,
    "osm": "node/3033367121",
    "linien": [
     "S2",
     "S4",
     "S6"
    ],
    "fern": 0
   },
   {
    "name": "Böhmerwaldplatz",
    "art": "ubahn",
    "lat": 48.143505,
    "lon": 11.6156,
    "osm": "node/2660339814",
    "linien": [
     "U4"
    ],
    "fern": 0
   },
   {
    "name": "Bonner Platz",
    "art": "ubahn",
    "lat": 48.166667,
    "lon": 11.57829,
    "osm": "node/2650093393",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Brudermühlstraße",
    "art": "ubahn",
    "lat": 48.112522,
    "lon": 11.548722,
    "osm": "node/2650093399",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Candidplatz",
    "art": "ubahn",
    "lat": 48.1131,
    "lon": 11.571645,
    "osm": "node/73793044",
    "linien": [
     "U1"
    ],
    "fern": 0
   },
   {
    "name": "Daglfing",
    "art": "sbahn",
    "lat": 48.149637,
    "lon": 11.649305,
    "osm": "node/2504953877",
    "linien": [
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Dietlindenstraße",
    "art": "ubahn",
    "lat": 48.167122,
    "lon": 11.590853,
    "osm": "node/2660339815",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Donnersbergerbrücke",
    "art": "sbahn",
    "lat": 48.142669,
    "lon": 11.536523,
    "osm": "node/2470092007",
    "linien": [
     "S1",
     "S2",
     "S3",
     "S4",
     "S5",
     "S6",
     "S7",
     "S8",
     "RB 55",
     "RB 56",
     "RB 57",
     "RB 58"
    ],
    "fern": 0
   },
   {
    "name": "Dülferstraße",
    "art": "ubahn",
    "lat": 48.212297,
    "lon": 11.563645,
    "osm": "node/3095464861",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Englschalking",
    "art": "sbahn",
    "lat": 48.156763,
    "lon": 11.648351,
    "osm": "node/2504953878",
    "linien": [
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Fasanerie",
    "art": "sbahn",
    "lat": 48.197775,
    "lon": 11.525866,
    "osm": "node/2499566263",
    "linien": [
     "S1"
    ],
    "fern": 0
   },
   {
    "name": "Fasangarten",
    "art": "sbahn",
    "lat": 48.093167,
    "lon": 11.60582,
    "osm": "node/2478760680",
    "linien": [
     "S3"
    ],
    "fern": 0
   },
   {
    "name": "Feldmoching",
    "art": "sbahn",
    "lat": 48.213822,
    "lon": 11.541283,
    "osm": "node/2499552238",
    "linien": [
     "S1",
     "RB 33"
    ],
    "fern": 0
   },
   {
    "name": "Feldmoching",
    "art": "ubahn",
    "lat": 48.213791,
    "lon": 11.541019,
    "osm": "node/3189921161",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Forstenrieder Allee",
    "art": "ubahn",
    "lat": 48.095069,
    "lon": 11.499333,
    "osm": "node/2650093404",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Frankfurter Ring",
    "art": "ubahn",
    "lat": 48.186817,
    "lon": 11.57272,
    "osm": "node/28201749",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Fraunhoferstraße",
    "art": "ubahn",
    "lat": 48.129429,
    "lon": 11.574103,
    "osm": "node/73783822",
    "linien": [
     "U1",
     "U2",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Freiham",
    "art": "sbahn",
    "lat": 48.140008,
    "lon": 11.41007,
    "osm": "node/2507006563",
    "linien": [
     "S5",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Freimann",
    "art": "ubahn",
    "lat": 48.191958,
    "lon": 11.614275,
    "osm": "node/1594808593",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Friedenheimer Straße",
    "art": "ubahn",
    "lat": 48.135125,
    "lon": 11.510856,
    "osm": "node/2660339816",
    "linien": [
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Fröttmaning",
    "art": "ubahn",
    "lat": 48.211886,
    "lon": 11.616713,
    "osm": "node/2644689596",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Fürstenried West",
    "art": "ubahn",
    "lat": 48.088366,
    "lon": 11.48083,
    "osm": "node/2650093410",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Georg-Brauchle-Ring",
    "art": "ubahn",
    "lat": 48.177499,
    "lon": 11.529059,
    "osm": "node/28238954",
    "linien": [
     "U1",
     "U7"
    ],
    "fern": 0
   },
   {
    "name": "Gern",
    "art": "ubahn",
    "lat": 48.16279,
    "lon": 11.529113,
    "osm": "node/84322745",
    "linien": [
     "U1",
     "U7"
    ],
    "fern": 0
   },
   {
    "name": "Giesing",
    "art": "sbahn",
    "lat": 48.11113,
    "lon": 11.596084,
    "osm": "node/2473495234",
    "linien": [
     "S3",
     "S5"
    ],
    "fern": 0
   },
   {
    "name": "Giesing",
    "art": "ubahn",
    "lat": 48.111036,
    "lon": 11.595819,
    "osm": "node/3189921261",
    "linien": [
     "U2",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Giselastraße",
    "art": "ubahn",
    "lat": 48.156559,
    "lon": 11.584048,
    "osm": "node/2644689600",
    "linien": [
     "U3",
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Goetheplatz",
    "art": "ubahn",
    "lat": 48.129034,
    "lon": 11.557355,
    "osm": "node/2644689602",
    "linien": [
     "U3",
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Großhadern",
    "art": "ubahn",
    "lat": 48.114805,
    "lon": 11.477062,
    "osm": "node/2644689605",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Hackerbrücke",
    "art": "sbahn",
    "lat": 48.141964,
    "lon": 11.548527,
    "osm": "node/2470092008",
    "linien": [
     "S1",
     "S2",
     "S3",
     "S4",
     "S5",
     "S6",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Haderner Stern",
    "art": "ubahn",
    "lat": 48.118383,
    "lon": 11.488922,
    "osm": "node/2644689606",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Harras",
    "art": "ubahn",
    "lat": 48.116874,
    "lon": 11.538062,
    "osm": "node/2500604016",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Harras",
    "art": "sbahn",
    "lat": 48.118399,
    "lon": 11.536535,
    "osm": "node/3189921361",
    "linien": [
     "S7",
     "RB 55",
     "RB 56",
     "RB 57",
     "RB 58"
    ],
    "fern": 0
   },
   {
    "name": "Harthof",
    "art": "ubahn",
    "lat": 48.204344,
    "lon": 11.569393,
    "osm": "node/28205595",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Hasenbergl",
    "art": "ubahn",
    "lat": 48.213429,
    "lon": 11.554914,
    "osm": "node/28205626",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Hauptbahnhof",
    "art": "ubahn",
    "lat": 48.139293,
    "lon": 11.559975,
    "osm": "node/3278115761",
    "linien": [
     "U4",
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Hauptbahnhof",
    "art": "ubahn",
    "lat": 48.140146,
    "lon": 11.561096,
    "osm": "node/3278115861",
    "linien": [
     "U1",
     "U2",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Hauptbahnhof (tief)",
    "art": "sbahn",
    "lat": 48.141256,
    "lon": 11.560027,
    "osm": "node/3183012396",
    "linien": [
     "S1",
     "S2",
     "S3",
     "S4",
     "S5",
     "S6",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Heimeranplatz",
    "art": "sbahn",
    "lat": 48.13301,
    "lon": 11.531443,
    "osm": "node/2499689861",
    "linien": [
     "S7",
     "S20",
     "RB 58"
    ],
    "fern": 0
   },
   {
    "name": "Heimeranplatz",
    "art": "ubahn",
    "lat": 48.133541,
    "lon": 11.532214,
    "osm": "node/3189921262",
    "linien": [
     "U4",
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Hirschgarten",
    "art": "sbahn",
    "lat": 48.143552,
    "lon": 11.519469,
    "osm": "node/2468901140",
    "linien": [
     "S1",
     "S2",
     "S3",
     "S4",
     "S5",
     "S6",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Hohenzollernplatz",
    "art": "ubahn",
    "lat": 48.162368,
    "lon": 11.568765,
    "osm": "node/3142725229",
    "linien": [
     "U2",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Holzapfelkreuth",
    "art": "ubahn",
    "lat": 48.116315,
    "lon": 11.501838,
    "osm": "node/2644689608",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Implerstraße",
    "art": "ubahn",
    "lat": 48.120199,
    "lon": 11.548451,
    "osm": "node/2562202514",
    "linien": [
     "U3",
     "U6",
     "Bus 132"
    ],
    "fern": 0
   },
   {
    "name": "Innsbrucker Ring",
    "art": "ubahn",
    "lat": 48.120437,
    "lon": 11.61879,
    "osm": "node/4711533262",
    "linien": [
     "U2",
     "U5",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Isartor",
    "art": "sbahn",
    "lat": 48.134213,
    "lon": 11.583136,
    "osm": "node/2473615158",
    "linien": [
     "S1",
     "S2",
     "S3",
     "S4",
     "S5",
     "S6",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Johanneskirchen",
    "art": "sbahn",
    "lat": 48.167608,
    "lon": 11.646009,
    "osm": "node/2515108020",
    "linien": [
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Josephsburg",
    "art": "ubahn",
    "lat": 48.126573,
    "lon": 11.633809,
    "osm": "node/1692348402",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Josephsplatz",
    "art": "ubahn",
    "lat": 48.155744,
    "lon": 11.567093,
    "osm": "node/247674448",
    "linien": [
     "U2",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Karl-Preis-Platz",
    "art": "ubahn",
    "lat": 48.1179,
    "lon": 11.608404,
    "osm": "node/68655296",
    "linien": [
     "U2",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Karlsfeld",
    "art": "sbahn",
    "lat": 48.211262,
    "lon": 11.459523,
    "osm": "node/2487884333",
    "linien": [
     "S2"
    ],
    "fern": 0
   },
   {
    "name": "Karlsplatz (Stachus)",
    "art": "sbahn",
    "lat": 48.139486,
    "lon": 11.565622,
    "osm": "node/2473297785",
    "linien": [
     "S1",
     "S2",
     "S3",
     "S4",
     "S5",
     "S6",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Karlsplatz (Stachus)",
    "art": "ubahn",
    "lat": 48.140335,
    "lon": 11.567021,
    "osm": "node/2473297786",
    "linien": [
     "U4",
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Kieferngarten",
    "art": "ubahn",
    "lat": 48.203841,
    "lon": 11.613242,
    "osm": "node/2056183985",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Klinikum Großhadern",
    "art": "ubahn",
    "lat": 48.109078,
    "lon": 11.473577,
    "osm": "node/2644689613",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Kolumbusplatz",
    "art": "ubahn",
    "lat": 48.119815,
    "lon": 11.576652,
    "osm": "node/2524117388",
    "linien": [
     "U1",
     "U2",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Königsplatz",
    "art": "ubahn",
    "lat": 48.14501,
    "lon": 11.563209,
    "osm": "node/3114658668",
    "linien": [
     "U2",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Kreillerstraße",
    "art": "ubahn",
    "lat": 48.125754,
    "lon": 11.646852,
    "osm": "node/4726482189",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Laim",
    "art": "sbahn",
    "lat": 48.144497,
    "lon": 11.502966,
    "osm": "node/2468901141",
    "linien": [
     "S1",
     "S2",
     "S3",
     "S4",
     "S5",
     "S6",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Laimer Platz",
    "art": "ubahn",
    "lat": 48.135461,
    "lon": 11.501976,
    "osm": "node/2660339821",
    "linien": [
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Langwied",
    "art": "sbahn",
    "lat": 48.163044,
    "lon": 11.432452,
    "osm": "node/2468831364",
    "linien": [
     "S3"
    ],
    "fern": 0
   },
   {
    "name": "Lehel",
    "art": "ubahn",
    "lat": 48.139656,
    "lon": 11.587921,
    "osm": "node/2660339818",
    "linien": [
     "U4",
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Leienfelsstraße",
    "art": "sbahn",
    "lat": 48.154534,
    "lon": 11.42858,
    "osm": "node/2488177587",
    "linien": [
     "S4",
     "S20"
    ],
    "fern": 0
   },
   {
    "name": "Leuchtenbergring",
    "art": "sbahn",
    "lat": 48.134287,
    "lon": 11.615994,
    "osm": "node/2488169605",
    "linien": [
     "S1",
     "S2",
     "S4",
     "S6",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Lochhausen",
    "art": "sbahn",
    "lat": 48.176031,
    "lon": 11.408717,
    "osm": "node/2468655152",
    "linien": [
     "S3"
    ],
    "fern": 0
   },
   {
    "name": "Machtlfinger Straße",
    "art": "ubahn",
    "lat": 48.097374,
    "lon": 11.51504,
    "osm": "node/2650093415",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Maillingerstraße",
    "art": "ubahn",
    "lat": 48.149988,
    "lon": 11.545605,
    "osm": "node/84322751",
    "linien": [
     "U1",
     "U7"
    ],
    "fern": 0
   },
   {
    "name": "Mangfallplatz",
    "art": "ubahn",
    "lat": 48.09706,
    "lon": 11.579177,
    "osm": "node/73800962",
    "linien": [
     "U1"
    ],
    "fern": 0
   },
   {
    "name": "Marienplatz",
    "art": "sbahn",
    "lat": 48.137144,
    "lon": 11.575399,
    "osm": "node/2941687118",
    "linien": [
     "S1",
     "S2",
     "S3",
     "S4",
     "S5",
     "S6",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Marienplatz",
    "art": "ubahn",
    "lat": 48.138361,
    "lon": 11.576183,
    "osm": "node/3189921461",
    "linien": [
     "U3",
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Max-Weber-Platz",
    "art": "ubahn",
    "lat": 48.135703,
    "lon": 11.597871,
    "osm": "node/5184176689",
    "linien": [
     "U4",
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Messestadt Ost",
    "art": "ubahn",
    "lat": 48.133378,
    "lon": 11.703407,
    "osm": "node/1692348440",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Messestadt West",
    "art": "ubahn",
    "lat": 48.13343,
    "lon": 11.690541,
    "osm": "node/1692348451",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Michaelibad",
    "art": "ubahn",
    "lat": 48.118349,
    "lon": 11.631823,
    "osm": "node/27214338",
    "linien": [
     "U5",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Milbertshofen",
    "art": "ubahn",
    "lat": 48.180904,
    "lon": 11.573153,
    "osm": "node/28202314",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Mittersendling",
    "art": "sbahn",
    "lat": 48.107796,
    "lon": 11.536379,
    "osm": "node/2500623009",
    "linien": [
     "S7",
     "S20",
     "RB 58"
    ],
    "fern": 0
   },
   {
    "name": "Moosach",
    "art": "sbahn",
    "lat": 48.18004,
    "lon": 11.506022,
    "osm": "node/2499632761",
    "linien": [
     "S1",
     "RB 33"
    ],
    "fern": 0
   },
   {
    "name": "Moosach",
    "art": "ubahn",
    "lat": 48.180964,
    "lon": 11.508181,
    "osm": "node/3157666761",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Moosacher St.-Martins-Platz",
    "art": "ubahn",
    "lat": 48.181835,
    "lon": 11.518814,
    "osm": "node/2650093421",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Moosfeld",
    "art": "ubahn",
    "lat": 48.130772,
    "lon": 11.670984,
    "osm": "node/1692348456",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "München Hauptbahnhof",
    "art": "sbahn",
    "lat": 48.140725,
    "lon": 11.556943,
    "osm": "node/2470201868",
    "linien": [
     "RB 16",
     "RB 33",
     "RB 86",
     "RB 87",
     "RE 1",
     "RE 2",
     "RE 3",
     "RE 4",
     "RE 9",
     "RE 25",
     "RE 80",
     "930"
    ],
    "fern": 41
   },
   {
    "name": "München Hbf Gleis 27-36, Starnberger Bahnhof",
    "art": "sbahn",
    "lat": 48.141533,
    "lon": 11.55562,
    "osm": "node/3192902576",
    "linien": [
     "S7",
     "RB 6",
     "RB 6/S6",
     "RB 55",
     "RB 56",
     "RB 57",
     "RB 58",
     "RB 60",
     "RB 65",
     "RB 66",
     "RB 68",
     "RB 74",
     "RE 61",
     "RE 62",
     "RE 70",
     "RE 76",
     "RE 96"
    ],
    "fern": 2
   },
   {
    "name": "München Hbf Gleis 5-10, Holzkirchner Bahnhof",
    "art": "sbahn",
    "lat": 48.140147,
    "lon": 11.553162,
    "osm": "node/3192904758",
    "linien": [
     "RB 40",
     "RB 54",
     "RE 4",
     "RE 5"
    ],
    "fern": 3
   },
   {
    "name": "München Ost",
    "art": "sbahn",
    "lat": 48.127721,
    "lon": 11.605519,
    "osm": "node/2465304880",
    "linien": [
     "S1",
     "S2",
     "S3",
     "S4",
     "S5",
     "S6",
     "S8",
     "RB 40",
     "RB 48",
     "RB 54",
     "RE 4",
     "RE 5"
    ],
    "fern": 24
   },
   {
    "name": "München Süd",
    "art": "sbahn",
    "lat": 48.121566,
    "lon": 11.552973,
    "osm": "node/3256321608",
    "linien": [],
    "fern": 0
   },
   {
    "name": "München-Pasing",
    "art": "sbahn",
    "lat": 48.149956,
    "lon": 11.461767,
    "osm": "node/2476438979",
    "linien": [
     "S3",
     "S4",
     "S5",
     "S6",
     "S8",
     "S20",
     "RB 6",
     "RB 6/S6",
     "RB 60",
     "RB 65",
     "RB 66",
     "RB 68",
     "RB 74",
     "RB 86",
     "RB 87",
     "RE 9",
     "RE 61",
     "RE 62",
     "RE 70",
     "RE 76",
     "RE 80",
     "RE 96"
    ],
    "fern": 4
   },
   {
    "name": "Münchner Freiheit",
    "art": "ubahn",
    "lat": 48.161985,
    "lon": 11.586531,
    "osm": "node/2644689618",
    "linien": [
     "U3",
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Neuaubing",
    "art": "sbahn",
    "lat": 48.141692,
    "lon": 11.422085,
    "osm": "node/2507009458",
    "linien": [
     "S5",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Neuperlach Süd",
    "art": "sbahn",
    "lat": 48.088822,
    "lon": 11.64502,
    "osm": "node/2476467535",
    "linien": [
     "S5"
    ],
    "fern": 0
   },
   {
    "name": "Neuperlach Süd",
    "art": "ubahn",
    "lat": 48.088855,
    "lon": 11.645194,
    "osm": "node/3419919093",
    "linien": [
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Neuperlach Zentrum",
    "art": "ubahn",
    "lat": 48.101184,
    "lon": 11.646174,
    "osm": "node/2568050650",
    "linien": [
     "U5",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Nordfriedhof",
    "art": "ubahn",
    "lat": 48.173188,
    "lon": 11.596986,
    "osm": "node/3157044270",
    "linien": [
     "U6",
     "Bus 150",
     "Bus LHX"
    ],
    "fern": 0
   },
   {
    "name": "Obermenzing",
    "art": "sbahn",
    "lat": 48.164217,
    "lon": 11.478022,
    "osm": "node/2699799616",
    "linien": [
     "S2"
    ],
    "fern": 0
   },
   {
    "name": "Obersendling",
    "art": "ubahn",
    "lat": 48.098233,
    "lon": 11.535934,
    "osm": "node/2650093427",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Oberwiesenfeld",
    "art": "ubahn",
    "lat": 48.185998,
    "lon": 11.547622,
    "osm": "node/2650093433",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Odeonsplatz",
    "art": "ubahn",
    "lat": 48.143343,
    "lon": 11.578045,
    "osm": "node/1927202337",
    "linien": [
     "U3",
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Odeonsplatz",
    "art": "ubahn",
    "lat": 48.142766,
    "lon": 11.576317,
    "osm": "node/3372671294",
    "linien": [
     "U4",
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Olympia-Einkaufszentrum",
    "art": "ubahn",
    "lat": 48.182126,
    "lon": 11.530922,
    "osm": "node/2541407104",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Olympia-Einkaufszentrum",
    "art": "ubahn",
    "lat": 48.182719,
    "lon": 11.530241,
    "osm": "node/3500554803",
    "linien": [
     "U1",
     "U7"
    ],
    "fern": 0
   },
   {
    "name": "Olympiazentrum",
    "art": "ubahn",
    "lat": 48.179298,
    "lon": 11.55609,
    "osm": "node/2650093438",
    "linien": [
     "U3",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Ostbahnhof",
    "art": "ubahn",
    "lat": 48.128078,
    "lon": 11.60363,
    "osm": "node/3189921561",
    "linien": [
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Partnachplatz",
    "art": "ubahn",
    "lat": 48.116941,
    "lon": 11.526726,
    "osm": "node/2644689619",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Perlach",
    "art": "sbahn",
    "lat": 48.09341,
    "lon": 11.63152,
    "osm": "node/2476467539",
    "linien": [
     "S5"
    ],
    "fern": 0
   },
   {
    "name": "Petuelring",
    "art": "ubahn",
    "lat": 48.175668,
    "lon": 11.565901,
    "osm": "node/2650093444",
    "linien": [
     "U3",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Poccistraße",
    "art": "ubahn",
    "lat": 48.125488,
    "lon": 11.550244,
    "osm": "node/2644689622",
    "linien": [
     "U3",
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Prinzregentenplatz",
    "art": "ubahn",
    "lat": 48.139266,
    "lon": 11.607034,
    "osm": "node/2660339820",
    "linien": [
     "U4"
    ],
    "fern": 0
   },
   {
    "name": "Quiddestraße",
    "art": "ubahn",
    "lat": 48.108112,
    "lon": 11.646674,
    "osm": "node/1544801370",
    "linien": [
     "U5",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Richard-Strauss-Straße",
    "art": "ubahn",
    "lat": 48.148333,
    "lon": 11.616601,
    "osm": "node/2660339822",
    "linien": [
     "U4"
    ],
    "fern": 0
   },
   {
    "name": "Riem",
    "art": "sbahn",
    "lat": 48.143969,
    "lon": 11.677772,
    "osm": "node/2472241431",
    "linien": [
     "S2"
    ],
    "fern": 0
   },
   {
    "name": "Rosenheimer Platz",
    "art": "sbahn",
    "lat": 48.129184,
    "lon": 11.593075,
    "osm": "node/2473550316",
    "linien": [
     "S1",
     "S2",
     "S3",
     "S4",
     "S5",
     "S6",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Rotkreuzplatz",
    "art": "ubahn",
    "lat": 48.154048,
    "lon": 11.533019,
    "osm": "node/84322749",
    "linien": [
     "U1",
     "U7"
    ],
    "fern": 0
   },
   {
    "name": "Sankt-Martin-Straße",
    "art": "sbahn",
    "lat": 48.118558,
    "lon": 11.595778,
    "osm": "node/2411834909",
    "linien": [
     "S3",
     "S5"
    ],
    "fern": 0
   },
   {
    "name": "Sankt-Quirin-Platz",
    "art": "ubahn",
    "lat": 48.10443,
    "lon": 11.581396,
    "osm": "node/73800960",
    "linien": [
     "U1"
    ],
    "fern": 0
   },
   {
    "name": "Scheidplatz",
    "art": "ubahn",
    "lat": 48.171416,
    "lon": 11.572852,
    "osm": "node/1927183970",
    "linien": [
     "U2",
     "U3",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Schwanthalerhöhe",
    "art": "ubahn",
    "lat": 48.133782,
    "lon": 11.541057,
    "osm": "node/2660339823",
    "linien": [
     "U4",
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Sendlinger Tor",
    "art": "ubahn",
    "lat": 48.133461,
    "lon": 11.566864,
    "osm": "node/2539850174",
    "linien": [
     "U3",
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Sendlinger Tor",
    "art": "ubahn",
    "lat": 48.133523,
    "lon": 11.567094,
    "osm": "node/3372671694",
    "linien": [
     "U1",
     "U2",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Siemenswerke",
    "art": "sbahn",
    "lat": 48.094307,
    "lon": 11.53273,
    "osm": "node/2500671102",
    "linien": [
     "S7",
     "S20",
     "RB 55",
     "RB 56",
     "RB 57",
     "RB 58"
    ],
    "fern": 0
   },
   {
    "name": "Silberhornstraße",
    "art": "ubahn",
    "lat": 48.114904,
    "lon": 11.580433,
    "osm": "node/99191054",
    "linien": [
     "U2",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Solln",
    "art": "sbahn",
    "lat": 48.079937,
    "lon": 11.526937,
    "osm": "node/2500732468",
    "linien": [
     "S7",
     "S20",
     "RB 55",
     "RB 56",
     "RB 57",
     "RB 58"
    ],
    "fern": 0
   },
   {
    "name": "Stiglmaierplatz",
    "art": "ubahn",
    "lat": 48.147896,
    "lon": 11.556977,
    "osm": "node/84322752",
    "linien": [
     "U1",
     "U7"
    ],
    "fern": 0
   },
   {
    "name": "Studentenstadt",
    "art": "ubahn",
    "lat": 48.183494,
    "lon": 11.60763,
    "osm": "node/1927202338",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Thalkirchen",
    "art": "ubahn",
    "lat": 48.10284,
    "lon": 11.545979,
    "osm": "node/2650093598",
    "linien": [
     "U3"
    ],
    "fern": 0
   },
   {
    "name": "Therese-Giehse-Allee",
    "art": "ubahn",
    "lat": 48.09473,
    "lon": 11.642716,
    "osm": "node/2660339824",
    "linien": [
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Theresienstraße",
    "art": "ubahn",
    "lat": 48.15151,
    "lon": 11.564452,
    "osm": "node/211557411",
    "linien": [
     "U2",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Theresienwiese",
    "art": "ubahn",
    "lat": 48.135672,
    "lon": 11.552232,
    "osm": "node/2660347912",
    "linien": [
     "U4",
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Trudering",
    "art": "sbahn",
    "lat": 48.126036,
    "lon": 11.663338,
    "osm": "node/2491219767",
    "linien": [
     "S4",
     "S6"
    ],
    "fern": 0
   },
   {
    "name": "Trudering",
    "art": "ubahn",
    "lat": 48.125653,
    "lon": 11.662592,
    "osm": "node/3189921562",
    "linien": [
     "U2"
    ],
    "fern": 0
   },
   {
    "name": "Universität",
    "art": "ubahn",
    "lat": 48.150354,
    "lon": 11.581144,
    "osm": "node/2644689645",
    "linien": [
     "U3",
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Untermenzing",
    "art": "sbahn",
    "lat": 48.177712,
    "lon": 11.472685,
    "osm": "node/2488012895",
    "linien": [
     "S2"
    ],
    "fern": 0
   },
   {
    "name": "Untersbergstraße",
    "art": "ubahn",
    "lat": 48.112595,
    "lon": 11.587508,
    "osm": "node/73778052",
    "linien": [
     "U2",
     "U7",
     "U8"
    ],
    "fern": 0
   },
   {
    "name": "Westendstraße",
    "art": "ubahn",
    "lat": 48.134738,
    "lon": 11.521112,
    "osm": "node/2660347913",
    "linien": [
     "U4",
     "U5"
    ],
    "fern": 0
   },
   {
    "name": "Westfriedhof",
    "art": "ubahn",
    "lat": 48.170381,
    "lon": 11.528459,
    "osm": "node/1189888870",
    "linien": [
     "U1",
     "U7"
    ],
    "fern": 0
   },
   {
    "name": "Westkreuz",
    "art": "sbahn",
    "lat": 48.148897,
    "lon": 11.443763,
    "osm": "node/2499527320",
    "linien": [
     "S5",
     "S6",
     "S8"
    ],
    "fern": 0
   },
   {
    "name": "Westpark",
    "art": "ubahn",
    "lat": 48.117986,
    "lon": 11.516253,
    "osm": "node/2644689647",
    "linien": [
     "U6"
    ],
    "fern": 0
   },
   {
    "name": "Wettersteinplatz",
    "art": "ubahn",
    "lat": 48.108206,
    "lon": 11.57574,
    "osm": "node/2554223954",
    "linien": [
     "U1"
    ],
    "fern": 0
   }
  ],
  "linien": [
   {
    "id": "tram25",
    "art": "tram",
    "ref": "25",
    "zweck": "Die einzige Schienenverbindung zur Bavaria Filmstadt.",
    "von": "Grünwald, Derbolfinger Platz",
    "nach": "Max-Weber-Platz (Johannisplatz) (U)",
    "osm": "relation/2078277",
    "halte": [
     {
      "name": "Grünwald, Derbolfinger Platz",
      "lat": 48.041959,
      "lon": 11.524029,
      "osm": "node/60535737",
      "linien": [
       "Tram 25"
      ],
      "fern": 0
     },
     {
      "name": "Grünwald, Ludwig-Thoma-Straße",
      "lat": 48.049471,
      "lon": 11.53549,
      "osm": "node/1670410326",
      "linien": [
       "Tram 25"
      ],
      "fern": 0
     },
     {
      "name": "Grünwald, Parkplatz",
      "lat": 48.05503,
      "lon": 11.540615,
      "osm": "node/1495572899",
      "linien": [
       "Tram 25"
      ],
      "fern": 0
     },
     {
      "name": "Robert-Koch-Straße",
      "lat": 48.062466,
      "lon": 11.544967,
      "osm": "node/1670410340",
      "linien": [
       "Tram 25"
      ],
      "fern": 0
     },
     {
      "name": "Grünwald, Bavariafilmplatz",
      "lat": 48.067426,
      "lon": 11.546298,
      "osm": "node/1493475916",
      "linien": [
       "Tram 25"
      ],
      "fern": 0
     },
     {
      "name": "Schilcherweg",
      "lat": 48.071429,
      "lon": 11.547498,
      "osm": "node/1493475923",
      "linien": [
       "Tram 25"
      ],
      "fern": 0
     },
     {
      "name": "Großhesseloher Brücke",
      "lat": 48.077212,
      "lon": 11.550391,
      "osm": "node/1670410322",
      "linien": [
       "Tram 25",
       "Tram N27",
       "Bus N272"
      ],
      "fern": 0
     },
     {
      "name": "Menterschwaige",
      "lat": 48.080148,
      "lon": 11.551786,
      "osm": "node/1495572898",
      "linien": [
       "Tram 25",
       "Tram N27"
      ],
      "fern": 0
     },
     {
      "name": "Klinikum Harlaching",
      "lat": 48.086681,
      "lon": 11.554822,
      "osm": "node/1493439816",
      "linien": [
       "Tram 25",
       "Tram N27",
       "Bus 139"
      ],
      "fern": 0
     },
     {
      "name": "Theodolindenplatz",
      "lat": 48.090395,
      "lon": 11.557067,
      "osm": "node/1493398941",
      "linien": [
       "Tram 25",
       "Tram N27"
      ],
      "fern": 0
     },
     {
      "name": "Authariplatz",
      "lat": 48.091813,
      "lon": 11.562382,
      "osm": "node/1493399025",
      "linien": [
       "Tram 25",
       "Tram N27"
      ],
      "fern": 0
     },
     {
      "name": "Tiroler Platz",
      "lat": 48.096288,
      "lon": 11.563724,
      "osm": "node/1493340358",
      "linien": [
       "Tram 25",
       "Tram N27"
      ],
      "fern": 0
     },
     {
      "name": "Südtiroler Straße",
      "lat": 48.100785,
      "lon": 11.566687,
      "osm": "node/1493333370",
      "linien": [
       "Tram 25",
       "Tram N27"
      ],
      "fern": 0
     },
     {
      "name": "Kurzstraße",
      "lat": 48.104445,
      "lon": 11.569711,
      "osm": "node/1493333396",
      "linien": [
       "Tram 25",
       "Tram N27"
      ],
      "fern": 0
     },
     {
      "name": "Wettersteinplatz",
      "lat": 48.109471,
      "lon": 11.574986,
      "osm": "node/1496660322",
      "linien": [
       "Tram 25",
       "Tram N27"
      ],
      "fern": 0
     },
     {
      "name": "Tegernseer Landstraße",
      "lat": 48.112407,
      "lon": 11.576456,
      "osm": "node/1493315919",
      "linien": [
       "Tram 25",
       "Tram N27",
       "Bus 54",
       "Bus 153",
       "Bus N43",
       "Bus N44",
       "Bus X30",
       "Bus X204"
      ],
      "fern": 0
     },
     {
      "name": "Silberhornstraße",
      "lat": 48.115579,
      "lon": 11.579931,
      "osm": "node/1493315933",
      "linien": [
       "Tram 25",
       "Tram N27",
       "Bus N45",
       "Bus X30"
      ],
      "fern": 0
     },
     {
      "name": "Ostfriedhof",
      "lat": 48.119404,
      "lon": 11.583965,
      "osm": "node/1670275570",
      "linien": [
       "Tram 18",
       "Tram 25",
       "Tram E7",
       "Tram N27",
       "Bus 58",
       "Bus 68",
       "Bus N45",
       "Bus X30"
      ],
      "fern": 0
     },
     {
      "name": "Carl-Amery-Platz",
      "lat": 48.121445,
      "lon": 11.585677,
      "osm": "node/6875392408",
      "linien": [
       "Tram 25",
       "Tram E7",
       "Bus 58",
       "Bus 68",
       "Bus N45"
      ],
      "fern": 0
     },
     {
      "name": "Regerplatz",
      "lat": 48.124248,
      "lon": 11.587956,
      "osm": "node/1294816254",
      "linien": [
       "Tram 25",
       "Tram E7",
       "Bus 62",
       "Bus N45"
      ],
      "fern": 0
     },
     {
      "name": "Rosenheimer Platz",
      "lat": 48.128975,
      "lon": 11.594187,
      "osm": "node/1293262020",
      "linien": [
       "Tram 25",
       "Tram E7"
      ],
      "fern": 0
     },
     {
      "name": "Wörthstraße",
      "lat": 48.13185,
      "lon": 11.597567,
      "osm": "node/1293262076",
      "linien": [
       "Tram 21",
       "Tram 25",
       "Tram E7",
       "Tram N19"
      ],
      "fern": 0
     },
     {
      "name": "Max-Weber-Platz (Johannisplatz)",
      "lat": 48.134429,
      "lon": 11.598195,
      "osm": "node/1744600782",
      "linien": [
       "Tram 21",
       "Tram 25",
       "Tram N19"
      ],
      "fern": 0
     }
    ],
    "verlauf": [
     [
      [
       48.04196,
       11.52403
      ],
      [
       48.04209,
       11.52414
      ],
      [
       48.04211,
       11.52415
      ],
      [
       48.04212,
       11.52416
      ],
      [
       48.04214,
       11.52416
      ],
      [
       48.04216,
       11.52416
      ],
      [
       48.04218,
       11.52417
      ],
      [
       48.0422,
       11.52416
      ],
      [
       48.04223,
       11.52415
      ],
      [
       48.04225,
       11.52414
      ],
      [
       48.04227,
       11.52413
      ],
      [
       48.04228,
       11.52412
      ],
      [
       48.0423,
       11.5241
      ],
      [
       48.04232,
       11.52409
      ],
      [
       48.04237,
       11.52404
      ],
      [
       48.04243,
       11.52399
      ],
      [
       48.04249,
       11.52394
      ],
      [
       48.04251,
       11.52393
      ],
      [
       48.04253,
       11.52392
      ],
      [
       48.04254,
       11.52392
      ],
      [
       48.04255,
       11.52391
      ],
      [
       48.04257,
       11.52391
      ],
      [
       48.04258,
       11.52391
      ],
      [
       48.04259,
       11.52392
      ],
      [
       48.04261,
       11.52392
      ],
      [
       48.04262,
       11.52392
      ],
      [
       48.04263,
       11.52393
      ],
      [
       48.04264,
       11.52394
      ],
      [
       48.04265,
       11.52394
      ],
      [
       48.04304,
       11.52428
      ],
      [
       48.04319,
       11.52443
      ],
      [
       48.04329,
       11.52458
      ],
      [
       48.04336,
       11.52472
      ],
      [
       48.04342,
       11.52488
      ],
      [
       48.04349,
       11.52512
      ],
      [
       48.04352,
       11.52529
      ],
      [
       48.04352,
       11.52551
      ],
      [
       48.04351,
       11.52577
      ],
      [
       48.04349,
       11.5263
      ],
      [
       48.04347,
       11.52682
      ],
      [
       48.04346,
       11.52711
      ],
      [
       48.04346,
       11.52722
      ],
      [
       48.04346,
       11.52732
      ],
      [
       48.04345,
       11.52743
      ],
      [
       48.04346,
       11.52755
      ],
      [
       48.04347,
       11.52766
      ],
      [
       48.04351,
       11.52787
      ],
      [
       48.04354,
       11.528
      ],
      [
       48.04359,
       11.52814
      ],
      [
       48.04365,
       11.52827
      ],
      [
       48.04373,
       11.52841
      ],
      [
       48.04383,
       11.52856
      ],
      [
       48.04421,
       11.52902
      ],
      [
       48.04635,
       11.53148
      ],
      [
       48.04687,
       11.53209
      ],
      [
       48.04715,
       11.53243
      ],
      [
       48.04739,
       11.53278
      ],
      [
       48.0478,
       11.53342
      ],
      [
       48.04833,
       11.53423
      ],
      [
       48.04898,
       11.53503
      ],
      [
       48.04947,
       11.53549
      ],
      [
       48.04957,
       11.53558
      ],
      [
       48.05103,
       11.53701
      ],
      [
       48.05226,
       11.53821
      ],
      [
       48.05257,
       11.53852
      ],
      [
       48.05288,
       11.53881
      ],
      [
       48.0532,
       11.5391
      ],
      [
       48.05352,
       11.53937
      ],
      [
       48.0539,
       11.5397
      ],
      [
       48.05429,
       11.54002
      ],
      [
       48.05503,
       11.54062
      ],
      [
       48.05508,
       11.54066
      ],
      [
       48.05512,
       11.54069
      ],
      [
       48.05518,
       11.54073
      ],
      [
       48.05585,
       11.54125
      ],
      [
       48.05825,
       11.54278
      ],
      [
       48.05937,
       11.54342
      ],
      [
       48.06021,
       11.5439
      ],
      [
       48.06068,
       11.54415
      ],
      [
       48.06208,
       11.54481
      ],
      [
       48.06247,
       11.54497
      ],
      [
       48.06253,
       11.545
      ],
      [
       48.0627,
       11.54507
      ],
      [
       48.06296,
       11.54518
      ],
      [
       48.06355,
       11.54542
      ],
      [
       48.0641,
       11.54562
      ],
      [
       48.06458,
       11.54578
      ],
      [
       48.06474,
       11.54583
      ],
      [
       48.06513,
       11.54593
      ],
      [
       48.0656,
       11.54602
      ],
      [
       48.06657,
       11.54619
      ],
      [
       48.067,
       11.54626
      ],
      [
       48.06743,
       11.5463
      ],
      [
       48.06758,
       11.5463
      ],
      [
       48.068,
       11.5463
      ],
      [
       48.06831,
       11.54629
      ],
      [
       48.06848,
       11.54627
      ],
      [
       48.06866,
       11.54626
      ],
      [
       48.06884,
       11.54628
      ],
      [
       48.06902,
       11.54631
      ],
      [
       48.06926,
       11.54638
      ],
      [
       48.0696,
       11.54654
      ],
      [
       48.07143,
       11.5475
      ],
      [
       48.07154,
       11.54755
      ],
      [
       48.07293,
       11.54829
      ],
      [
       48.07433,
       11.54897
      ],
      [
       48.07598,
       11.54979
      ],
      [
       48.07607,
       11.54984
      ]
     ],
     [
      [
       48.07607,
       11.54984
      ],
      [
       48.07621,
       11.54991
      ]
     ],
     [
      [
       48.07621,
       11.54991
      ],
      [
       48.07649,
       11.55004
      ],
      [
       48.07662,
       11.55011
      ],
      [
       48.07682,
       11.5502
      ],
      [
       48.0769,
       11.55024
      ]
     ],
     [
      [
       48.0769,
       11.55024
      ],
      [
       48.07721,
       11.55039
      ],
      [
       48.07732,
       11.55045
      ],
      [
       48.07776,
       11.55065
      ],
      [
       48.07861,
       11.55105
      ],
      [
       48.07895,
       11.55122
      ],
      [
       48.07938,
       11.55143
      ],
      [
       48.08015,
       11.55179
      ],
      [
       48.08022,
       11.55182
      ],
      [
       48.0803,
       11.55186
      ],
      [
       48.08167,
       11.5525
      ],
      [
       48.08231,
       11.5528
      ],
      [
       48.08302,
       11.55312
      ],
      [
       48.08312,
       11.55317
      ],
      [
       48.08431,
       11.55372
      ],
      [
       48.08548,
       11.55426
      ],
      [
       48.08622,
       11.55461
      ],
      [
       48.08668,
       11.55482
      ],
      [
       48.08677,
       11.55486
      ],
      [
       48.08681,
       11.55488
      ],
      [
       48.08688,
       11.55491
      ],
      [
       48.08695,
       11.55495
      ],
      [
       48.08731,
       11.55512
      ],
      [
       48.08757,
       11.55525
      ],
      [
       48.08771,
       11.55533
      ],
      [
       48.08785,
       11.5554
      ],
      [
       48.08798,
       11.55547
      ],
      [
       48.0881,
       11.55554
      ],
      [
       48.08834,
       11.55567
      ],
      [
       48.08858,
       11.55582
      ],
      [
       48.08902,
       11.55607
      ],
      [
       48.08945,
       11.55632
      ],
      [
       48.08989,
       11.55658
      ],
      [
       48.09003,
       11.55668
      ],
      [
       48.09013,
       11.55676
      ],
      [
       48.09018,
       11.55681
      ],
      [
       48.09023,
       11.55686
      ],
      [
       48.09027,
       11.55691
      ],
      [
       48.09033,
       11.55698
      ],
      [
       48.09039,
       11.55707
      ],
      [
       48.09042,
       11.55711
      ],
      [
       48.09045,
       11.55716
      ],
      [
       48.09049,
       11.55723
      ],
      [
       48.0905,
       11.55726
      ],
      [
       48.09052,
       11.5573
      ],
      [
       48.09054,
       11.55734
      ],
      [
       48.09058,
       11.55743
      ],
      [
       48.09063,
       11.55757
      ],
      [
       48.09066,
       11.55767
      ],
      [
       48.0907,
       11.55779
      ],
      [
       48.09075,
       11.55799
      ],
      [
       48.09079,
       11.55821
      ],
      [
       48.09084,
       11.55846
      ],
      [
       48.09089,
       11.55876
      ],
      [
       48.09092,
       11.55902
      ],
      [
       48.09111,
       11.56043
      ],
      [
       48.09118,
       11.56087
      ],
      [
       48.0912,
       11.56102
      ],
      [
       48.09123,
       11.56116
      ],
      [
       48.09128,
       11.56135
      ],
      [
       48.09133,
       11.56149
      ],
      [
       48.09138,
       11.56163
      ],
      [
       48.09142,
       11.56174
      ],
      [
       48.09148,
       11.56187
      ],
      [
       48.09156,
       11.56201
      ],
      [
       48.09164,
       11.56215
      ],
      [
       48.09175,
       11.5623
      ],
      [
       48.09181,
       11.56238
      ],
      [
       48.09191,
       11.56249
      ],
      [
       48.09197,
       11.56255
      ],
      [
       48.09205,
       11.56262
      ],
      [
       48.09211,
       11.56267
      ],
      [
       48.09227,
       11.56278
      ],
      [
       48.09236,
       11.56283
      ],
      [
       48.09249,
       11.56289
      ],
      [
       48.09266,
       11.56294
      ],
      [
       48.09289,
       11.56298
      ],
      [
       48.09313,
       11.56302
      ],
      [
       48.0936,
       11.56308
      ],
      [
       48.09393,
       11.56313
      ],
      [
       48.0942,
       11.56318
      ],
      [
       48.09426,
       11.56319
      ],
      [
       48.09469,
       11.56326
      ],
      [
       48.09512,
       11.56335
      ],
      [
       48.09533,
       11.5634
      ],
      [
       48.09553,
       11.56347
      ],
      [
       48.09567,
       11.56352
      ],
      [
       48.09582,
       11.56357
      ],
      [
       48.09594,
       11.56361
      ],
      [
       48.09604,
       11.56364
      ],
      [
       48.09629,
       11.56372
      ],
      [
       48.09666,
       11.56386
      ],
      [
       48.0969,
       11.56395
      ],
      [
       48.09712,
       11.56405
      ],
      [
       48.09733,
       11.56415
      ],
      [
       48.09759,
       11.56428
      ],
      [
       48.09783,
       11.56443
      ],
      [
       48.09804,
       11.56456
      ],
      [
       48.09832,
       11.56475
      ],
      [
       48.09861,
       11.56497
      ],
      [
       48.09878,
       11.5651
      ],
      [
       48.09973,
       11.56586
      ],
      [
       48.10079,
       11.56669
      ],
      [
       48.10088,
       11.56676
      ],
      [
       48.10096,
       11.56683
      ],
      [
       48.10123,
       11.56704
      ],
      [
       48.1015,
       11.56727
      ],
      [
       48.10179,
       11.5675
      ],
      [
       48.10204,
       11.56771
      ],
      [
       48.10232,
       11.56793
      ],
      [
       48.1026,
       11.56816
      ],
      [
       48.10293,
       11.56843
      ],
      [
       48.10312,
       11.56858
      ],
      [
       48.10328,
       11.5687
      ],
      [
       48.10359,
       11.56896
      ],
      [
       48.10391,
       11.56923
      ],
      [
       48.10423,
       11.56952
      ],
      [
       48.10444,
       11.56971
      ],
      [
       48.10455,
       11.56981
      ],
      [
       48.10463,
       11.56989
      ],
      [
       48.10469,
       11.56995
      ],
      [
       48.10488,
       11.57013
      ],
      [
       48.10506,
       11.57029
      ],
      [
       48.10553,
       11.57074
      ],
      [
       48.10582,
       11.57101
      ],
      [
       48.1061,
       11.57128
      ],
      [
       48.10637,
       11.57153
      ],
      [
       48.10651,
       11.57168
      ],
      [
       48.10665,
       11.57183
      ],
      [
       48.10688,
       11.57208
      ],
      [
       48.107,
       11.57223
      ],
      [
       48.10712,
       11.57238
      ],
      [
       48.10745,
       11.57279
      ],
      [
       48.10775,
       11.57316
      ],
      [
       48.10799,
       11.57347
      ],
      [
       48.10817,
       11.57366
      ],
      [
       48.10835,
       11.57386
      ],
      [
       48.10856,
       11.5741
      ],
      [
       48.10885,
       11.57442
      ],
      [
       48.10886,
       11.57443
      ],
      [
       48.1089,
       11.57447
      ],
      [
       48.10895,
       11.57453
      ],
      [
       48.10907,
       11.57463
      ],
      [
       48.10922,
       11.57477
      ],
      [
       48.10938,
       11.57491
      ],
      [
       48.10947,
       11.57499
      ],
      [
       48.1096,
       11.57509
      ],
      [
       48.10968,
       11.57514
      ],
      [
       48.10998,
       11.57536
      ],
      [
       48.11017,
       11.57548
      ],
      [
       48.11034,
       11.57557
      ],
      [
       48.11091,
       11.57585
      ],
      [
       48.11142,
       11.57609
      ],
      [
       48.11149,
       11.57611
      ],
      [
       48.11165,
       11.57618
      ],
      [
       48.11171,
       11.5762
      ],
      [
       48.11181,
       11.57625
      ],
      [
       48.11201,
       11.57632
      ],
      [
       48.11211,
       11.57636
      ],
      [
       48.11241,
       11.57646
      ]
     ],
     [
      [
       48.11241,
       11.57646
      ],
      [
       48.1126,
       11.57652
      ],
      [
       48.11264,
       11.57653
      ],
      [
       48.11267,
       11.57655
      ],
      [
       48.11268,
       11.57656
      ],
      [
       48.11269,
       11.57657
      ],
      [
       48.11272,
       11.57659
      ],
      [
       48.11274,
       11.5766
      ],
      [
       48.11277,
       11.57663
      ],
      [
       48.11282,
       11.57671
      ],
      [
       48.11287,
       11.57679
      ],
      [
       48.11297,
       11.57699
      ],
      [
       48.11301,
       11.57707
      ],
      [
       48.11308,
       11.57717
      ],
      [
       48.11314,
       11.57726
      ],
      [
       48.11319,
       11.57733
      ],
      [
       48.11346,
       11.5777
      ],
      [
       48.11355,
       11.57783
      ]
     ],
     [
      [
       48.11355,
       11.57783
      ],
      [
       48.11362,
       11.57792
      ],
      [
       48.11387,
       11.57827
      ],
      [
       48.114,
       11.57845
      ],
      [
       48.11412,
       11.57862
      ],
      [
       48.11418,
       11.5787
      ],
      [
       48.11421,
       11.57873
      ],
      [
       48.11424,
       11.57877
      ],
      [
       48.1143,
       11.57883
      ],
      [
       48.11434,
       11.57888
      ],
      [
       48.11439,
       11.57892
      ],
      [
       48.11448,
       11.579
      ],
      [
       48.11456,
       11.57905
      ],
      [
       48.11464,
       11.57911
      ],
      [
       48.1148,
       11.57919
      ],
      [
       48.11499,
       11.57931
      ],
      [
       48.11503,
       11.57933
      ],
      [
       48.11507,
       11.57936
      ],
      [
       48.11511,
       11.5794
      ],
      [
       48.11513,
       11.57942
      ],
      [
       48.11517,
       11.57945
      ],
      [
       48.11522,
       11.57951
      ],
      [
       48.11535,
       11.57967
      ],
      [
       48.11558,
       11.57993
      ],
      [
       48.11572,
       11.58008
      ],
      [
       48.11577,
       11.58014
      ],
      [
       48.11582,
       11.58019
      ],
      [
       48.11593,
       11.58031
      ]
     ],
     [
      [
       48.11593,
       11.58031
      ],
      [
       48.11622,
       11.58061
      ],
      [
       48.11642,
       11.58084
      ],
      [
       48.11662,
       11.58106
      ],
      [
       48.1167,
       11.58116
      ],
      [
       48.11683,
       11.5813
      ],
      [
       48.11696,
       11.58144
      ],
      [
       48.11732,
       11.58185
      ],
      [
       48.11739,
       11.58192
      ],
      [
       48.11759,
       11.58214
      ],
      [
       48.11777,
       11.58232
      ],
      [
       48.11791,
       11.58246
      ],
      [
       48.11795,
       11.58251
      ],
      [
       48.11806,
       11.58261
      ],
      [
       48.11825,
       11.58282
      ],
      [
       48.1186,
       11.58318
      ],
      [
       48.11872,
       11.5833
      ],
      [
       48.11876,
       11.58334
      ]
     ],
     [
      [
       48.11876,
       11.58334
      ],
      [
       48.11887,
       11.58345
      ]
     ],
     [
      [
       48.11887,
       11.58345
      ],
      [
       48.11887,
       11.58345
      ],
      [
       48.11892,
       11.5835
      ],
      [
       48.11896,
       11.58355
      ],
      [
       48.11901,
       11.58362
      ],
      [
       48.11903,
       11.58364
      ],
      [
       48.11905,
       11.58366
      ],
      [
       48.11906,
       11.58367
      ],
      [
       48.1191,
       11.58371
      ],
      [
       48.1191,
       11.58372
      ],
      [
       48.11912,
       11.58373
      ],
      [
       48.11915,
       11.58376
      ],
      [
       48.11918,
       11.58379
      ],
      [
       48.11919,
       11.58379
      ],
      [
       48.11922,
       11.58381
      ]
     ],
     [
      [
       48.11922,
       11.58381
      ],
      [
       48.11923,
       11.58383
      ],
      [
       48.1194,
       11.58397
      ],
      [
       48.11961,
       11.58413
      ],
      [
       48.11972,
       11.58423
      ],
      [
       48.11987,
       11.58438
      ],
      [
       48.11997,
       11.5845
      ],
      [
       48.12009,
       11.58461
      ],
      [
       48.12021,
       11.58471
      ],
      [
       48.12022,
       11.58472
      ]
     ],
     [
      [
       48.12022,
       11.58472
      ],
      [
       48.12038,
       11.58484
      ]
     ],
     [
      [
       48.12038,
       11.58484
      ],
      [
       48.12043,
       11.58487
      ],
      [
       48.12046,
       11.58489
      ],
      [
       48.1205,
       11.58492
      ],
      [
       48.12058,
       11.58496
      ],
      [
       48.12071,
       11.58503
      ],
      [
       48.12083,
       11.58511
      ],
      [
       48.12092,
       11.58519
      ],
      [
       48.12145,
       11.58568
      ],
      [
       48.12147,
       11.5857
      ],
      [
       48.12153,
       11.58576
      ],
      [
       48.12158,
       11.5858
      ],
      [
       48.12165,
       11.58587
      ],
      [
       48.12176,
       11.58596
      ],
      [
       48.12179,
       11.58598
      ],
      [
       48.12214,
       11.58628
      ],
      [
       48.12218,
       11.58631
      ],
      [
       48.12248,
       11.58656
      ],
      [
       48.12267,
       11.58671
      ],
      [
       48.12297,
       11.58694
      ],
      [
       48.1239,
       11.58759
      ],
      [
       48.124,
       11.58767
      ],
      [
       48.1241,
       11.58776
      ],
      [
       48.12414,
       11.58781
      ],
      [
       48.12417,
       11.58784
      ],
      [
       48.12425,
       11.58796
      ],
      [
       48.12434,
       11.58812
      ],
      [
       48.12442,
       11.58827
      ],
      [
       48.12459,
       11.58857
      ],
      [
       48.12478,
       11.58891
      ],
      [
       48.1248,
       11.58896
      ],
      [
       48.12483,
       11.589
      ],
      [
       48.12486,
       11.58907
      ],
      [
       48.1249,
       11.58915
      ],
      [
       48.12525,
       11.58996
      ],
      [
       48.12541,
       11.59033
      ],
      [
       48.12554,
       11.59062
      ],
      [
       48.1258,
       11.59124
      ],
      [
       48.12583,
       11.5913
      ],
      [
       48.12593,
       11.5915
      ],
      [
       48.12608,
       11.59182
      ],
      [
       48.12619,
       11.59203
      ],
      [
       48.12621,
       11.59208
      ],
      [
       48.12629,
       11.59221
      ],
      [
       48.12647,
       11.59247
      ],
      [
       48.12656,
       11.59256
      ],
      [
       48.1268,
       11.59276
      ],
      [
       48.12698,
       11.5929
      ],
      [
       48.12705,
       11.59296
      ],
      [
       48.12712,
       11.593
      ],
      [
       48.12783,
       11.59345
      ],
      [
       48.12842,
       11.59383
      ],
      [
       48.12846,
       11.59386
      ],
      [
       48.12852,
       11.5939
      ],
      [
       48.12863,
       11.59396
      ],
      [
       48.12868,
       11.59398
      ],
      [
       48.12872,
       11.594
      ],
      [
       48.12877,
       11.59403
      ],
      [
       48.12882,
       11.59406
      ],
      [
       48.12888,
       11.5941
      ],
      [
       48.12893,
       11.59414
      ],
      [
       48.12898,
       11.59419
      ],
      [
       48.12951,
       11.59477
      ],
      [
       48.13006,
       11.59532
      ],
      [
       48.13012,
       11.5954
      ],
      [
       48.13016,
       11.59546
      ],
      [
       48.13022,
       11.59555
      ],
      [
       48.13026,
       11.59561
      ],
      [
       48.1303,
       11.59566
      ],
      [
       48.13036,
       11.59572
      ],
      [
       48.13042,
       11.59578
      ],
      [
       48.13062,
       11.59597
      ],
      [
       48.13066,
       11.59601
      ],
      [
       48.1307,
       11.59604
      ],
      [
       48.13076,
       11.59608
      ],
      [
       48.1309,
       11.59617
      ],
      [
       48.13102,
       11.59625
      ],
      [
       48.13109,
       11.59631
      ],
      [
       48.13115,
       11.59638
      ],
      [
       48.13118,
       11.59642
      ],
      [
       48.1312,
       11.59644
      ],
      [
       48.13122,
       11.59647
      ],
      [
       48.13185,
       11.59757
      ],
      [
       48.13187,
       11.5976
      ],
      [
       48.1319,
       11.59766
      ],
      [
       48.13192,
       11.59768
      ],
      [
       48.13194,
       11.5977
      ],
      [
       48.13196,
       11.59772
      ],
      [
       48.13197,
       11.59773
      ],
      [
       48.13198,
       11.59773
      ],
      [
       48.13202,
       11.59775
      ],
      [
       48.13205,
       11.59776
      ],
      [
       48.13207,
       11.59776
      ],
      [
       48.13209,
       11.59776
      ],
      [
       48.13212,
       11.59775
      ],
      [
       48.13215,
       11.59774
      ],
      [
       48.13219,
       11.59772
      ],
      [
       48.13222,
       11.59769
      ],
      [
       48.13225,
       11.59766
      ],
      [
       48.13225,
       11.59766
      ],
      [
       48.13231,
       11.59761
      ],
      [
       48.13236,
       11.59758
      ],
      [
       48.13241,
       11.59756
      ],
      [
       48.13255,
       11.59753
      ],
      [
       48.13256,
       11.59753
      ]
     ],
     [
      [
       48.13256,
       11.59753
      ],
      [
       48.1331,
       11.59741
      ],
      [
       48.13317,
       11.59739
      ],
      [
       48.13323,
       11.59738
      ],
      [
       48.13327,
       11.59737
      ],
      [
       48.13331,
       11.59736
      ],
      [
       48.13334,
       11.59736
      ],
      [
       48.13336,
       11.59736
      ],
      [
       48.1334,
       11.59736
      ],
      [
       48.13344,
       11.59737
      ],
      [
       48.13347,
       11.59737
      ],
      [
       48.13351,
       11.59738
      ],
      [
       48.13355,
       11.59739
      ],
      [
       48.13359,
       11.59741
      ],
      [
       48.13363,
       11.59743
      ],
      [
       48.1337,
       11.59747
      ],
      [
       48.13378,
       11.59751
      ],
      [
       48.13398,
       11.59764
      ],
      [
       48.134,
       11.59766
      ],
      [
       48.13403,
       11.59768
      ],
      [
       48.13405,
       11.5977
      ]
     ],
     [
      [
       48.13405,
       11.5977
      ],
      [
       48.13406,
       11.59771
      ],
      [
       48.13407,
       11.59772
      ],
      [
       48.13408,
       11.59773
      ],
      [
       48.13409,
       11.59774
      ],
      [
       48.13409,
       11.59776
      ],
      [
       48.1341,
       11.59777
      ],
      [
       48.13411,
       11.59778
      ],
      [
       48.13413,
       11.59781
      ],
      [
       48.13416,
       11.59785
      ],
      [
       48.13418,
       11.59788
      ],
      [
       48.1342,
       11.5979
      ],
      [
       48.13424,
       11.59795
      ],
      [
       48.13428,
       11.598
      ],
      [
       48.13434,
       11.59807
      ],
      [
       48.13443,
       11.59819
      ]
     ]
    ]
   }
  ]
 }
};
