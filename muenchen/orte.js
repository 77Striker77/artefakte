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
   "abfrage": "railway=station und railway=halt innerhalb der Stadtgrenze München (Relation 62428)",
   "abgerufen": "2026-09-09",
   "rang": "primary",
   "lizenz": "ODbL"
  },
  "anzahl": {
   "gesamt": 143,
   "ubahn": 97,
   "sbahn": 46
  },
  "halte": [
   {
    "name": "Aidenbachstraße",
    "art": "ubahn",
    "lat": 48.097887,
    "lon": 11.525195,
    "osm": "node/2650093383"
   },
   {
    "name": "Allach",
    "art": "sbahn",
    "lat": 48.190034,
    "lon": 11.468105,
    "osm": "node/2488012710"
   },
   {
    "name": "Alte Heide",
    "art": "ubahn",
    "lat": 48.178552,
    "lon": 11.602555,
    "osm": "node/1927202335"
   },
   {
    "name": "Am Hart",
    "art": "ubahn",
    "lat": 48.195925,
    "lon": 11.571815,
    "osm": "node/28201702"
   },
   {
    "name": "Arabellapark",
    "art": "ubahn",
    "lat": 48.153555,
    "lon": 11.622063,
    "osm": "node/2660339813"
   },
   {
    "name": "Aubing",
    "art": "sbahn",
    "lat": 48.155971,
    "lon": 11.413159,
    "osm": "node/2488173642"
   },
   {
    "name": "Basler Straße",
    "art": "ubahn",
    "lat": 48.091273,
    "lon": 11.491169,
    "osm": "node/2650093388"
   },
   {
    "name": "Berg am Laim",
    "art": "sbahn",
    "lat": 48.133971,
    "lon": 11.6336,
    "osm": "node/3033367121"
   },
   {
    "name": "Böhmerwaldplatz",
    "art": "ubahn",
    "lat": 48.143505,
    "lon": 11.6156,
    "osm": "node/2660339814"
   },
   {
    "name": "Bonner Platz",
    "art": "ubahn",
    "lat": 48.166667,
    "lon": 11.57829,
    "osm": "node/2650093393"
   },
   {
    "name": "Brudermühlstraße",
    "art": "ubahn",
    "lat": 48.112522,
    "lon": 11.548722,
    "osm": "node/2650093399"
   },
   {
    "name": "Candidplatz",
    "art": "ubahn",
    "lat": 48.1131,
    "lon": 11.571645,
    "osm": "node/73793044"
   },
   {
    "name": "Daglfing",
    "art": "sbahn",
    "lat": 48.149637,
    "lon": 11.649305,
    "osm": "node/2504953877"
   },
   {
    "name": "Dietlindenstraße",
    "art": "ubahn",
    "lat": 48.167122,
    "lon": 11.590853,
    "osm": "node/2660339815"
   },
   {
    "name": "Donnersbergerbrücke",
    "art": "sbahn",
    "lat": 48.142669,
    "lon": 11.536523,
    "osm": "node/2470092007"
   },
   {
    "name": "Dülferstraße",
    "art": "ubahn",
    "lat": 48.212297,
    "lon": 11.563645,
    "osm": "node/3095464861"
   },
   {
    "name": "Englschalking",
    "art": "sbahn",
    "lat": 48.156763,
    "lon": 11.648351,
    "osm": "node/2504953878"
   },
   {
    "name": "Fasanerie",
    "art": "sbahn",
    "lat": 48.197775,
    "lon": 11.525866,
    "osm": "node/2499566263"
   },
   {
    "name": "Fasangarten",
    "art": "sbahn",
    "lat": 48.093167,
    "lon": 11.60582,
    "osm": "node/2478760680"
   },
   {
    "name": "Feldmoching",
    "art": "sbahn",
    "lat": 48.213822,
    "lon": 11.541283,
    "osm": "node/2499552238"
   },
   {
    "name": "Feldmoching",
    "art": "ubahn",
    "lat": 48.213791,
    "lon": 11.541019,
    "osm": "node/3189921161"
   },
   {
    "name": "Forstenrieder Allee",
    "art": "ubahn",
    "lat": 48.095069,
    "lon": 11.499333,
    "osm": "node/2650093404"
   },
   {
    "name": "Frankfurter Ring",
    "art": "ubahn",
    "lat": 48.186817,
    "lon": 11.57272,
    "osm": "node/28201749"
   },
   {
    "name": "Fraunhoferstraße",
    "art": "ubahn",
    "lat": 48.129429,
    "lon": 11.574103,
    "osm": "node/73783822"
   },
   {
    "name": "Freiham",
    "art": "sbahn",
    "lat": 48.140008,
    "lon": 11.41007,
    "osm": "node/2507006563"
   },
   {
    "name": "Freimann",
    "art": "ubahn",
    "lat": 48.191958,
    "lon": 11.614275,
    "osm": "node/1594808593"
   },
   {
    "name": "Friedenheimer Straße",
    "art": "ubahn",
    "lat": 48.135125,
    "lon": 11.510856,
    "osm": "node/2660339816"
   },
   {
    "name": "Fröttmaning",
    "art": "ubahn",
    "lat": 48.211886,
    "lon": 11.616713,
    "osm": "node/2644689596"
   },
   {
    "name": "Fürstenried West",
    "art": "ubahn",
    "lat": 48.088366,
    "lon": 11.48083,
    "osm": "node/2650093410"
   },
   {
    "name": "Georg-Brauchle-Ring",
    "art": "ubahn",
    "lat": 48.177499,
    "lon": 11.529059,
    "osm": "node/28238954"
   },
   {
    "name": "Gern",
    "art": "ubahn",
    "lat": 48.16279,
    "lon": 11.529113,
    "osm": "node/84322745"
   },
   {
    "name": "Giesing",
    "art": "sbahn",
    "lat": 48.11113,
    "lon": 11.596084,
    "osm": "node/2473495234"
   },
   {
    "name": "Giesing",
    "art": "ubahn",
    "lat": 48.111036,
    "lon": 11.595819,
    "osm": "node/3189921261"
   },
   {
    "name": "Giselastraße",
    "art": "ubahn",
    "lat": 48.156559,
    "lon": 11.584048,
    "osm": "node/2644689600"
   },
   {
    "name": "Goetheplatz",
    "art": "ubahn",
    "lat": 48.129034,
    "lon": 11.557355,
    "osm": "node/2644689602"
   },
   {
    "name": "Großhadern",
    "art": "ubahn",
    "lat": 48.114805,
    "lon": 11.477062,
    "osm": "node/2644689605"
   },
   {
    "name": "Hackerbrücke",
    "art": "sbahn",
    "lat": 48.141964,
    "lon": 11.548527,
    "osm": "node/2470092008"
   },
   {
    "name": "Haderner Stern",
    "art": "ubahn",
    "lat": 48.118383,
    "lon": 11.488922,
    "osm": "node/2644689606"
   },
   {
    "name": "Harras",
    "art": "ubahn",
    "lat": 48.116874,
    "lon": 11.538062,
    "osm": "node/2500604016"
   },
   {
    "name": "Harras",
    "art": "sbahn",
    "lat": 48.118399,
    "lon": 11.536535,
    "osm": "node/3189921361"
   },
   {
    "name": "Harthof",
    "art": "ubahn",
    "lat": 48.204344,
    "lon": 11.569393,
    "osm": "node/28205595"
   },
   {
    "name": "Hasenbergl",
    "art": "ubahn",
    "lat": 48.213429,
    "lon": 11.554914,
    "osm": "node/28205626"
   },
   {
    "name": "Hauptbahnhof",
    "art": "ubahn",
    "lat": 48.139293,
    "lon": 11.559975,
    "osm": "node/3278115761"
   },
   {
    "name": "Hauptbahnhof",
    "art": "ubahn",
    "lat": 48.140146,
    "lon": 11.561096,
    "osm": "node/3278115861"
   },
   {
    "name": "Hauptbahnhof (tief)",
    "art": "sbahn",
    "lat": 48.141256,
    "lon": 11.560027,
    "osm": "node/3183012396"
   },
   {
    "name": "Heimeranplatz",
    "art": "sbahn",
    "lat": 48.13301,
    "lon": 11.531443,
    "osm": "node/2499689861"
   },
   {
    "name": "Heimeranplatz",
    "art": "ubahn",
    "lat": 48.133541,
    "lon": 11.532214,
    "osm": "node/3189921262"
   },
   {
    "name": "Hirschgarten",
    "art": "sbahn",
    "lat": 48.143552,
    "lon": 11.519469,
    "osm": "node/2468901140"
   },
   {
    "name": "Hohenzollernplatz",
    "art": "ubahn",
    "lat": 48.162368,
    "lon": 11.568765,
    "osm": "node/3142725229"
   },
   {
    "name": "Holzapfelkreuth",
    "art": "ubahn",
    "lat": 48.116315,
    "lon": 11.501838,
    "osm": "node/2644689608"
   },
   {
    "name": "Implerstraße",
    "art": "ubahn",
    "lat": 48.120199,
    "lon": 11.548451,
    "osm": "node/2562202514"
   },
   {
    "name": "Innsbrucker Ring",
    "art": "ubahn",
    "lat": 48.120437,
    "lon": 11.61879,
    "osm": "node/4711533262"
   },
   {
    "name": "Isartor",
    "art": "sbahn",
    "lat": 48.134213,
    "lon": 11.583136,
    "osm": "node/2473615158"
   },
   {
    "name": "Johanneskirchen",
    "art": "sbahn",
    "lat": 48.167608,
    "lon": 11.646009,
    "osm": "node/2515108020"
   },
   {
    "name": "Josephsburg",
    "art": "ubahn",
    "lat": 48.126573,
    "lon": 11.633809,
    "osm": "node/1692348402"
   },
   {
    "name": "Josephsplatz",
    "art": "ubahn",
    "lat": 48.155744,
    "lon": 11.567093,
    "osm": "node/247674448"
   },
   {
    "name": "Karl-Preis-Platz",
    "art": "ubahn",
    "lat": 48.1179,
    "lon": 11.608404,
    "osm": "node/68655296"
   },
   {
    "name": "Karlsfeld",
    "art": "sbahn",
    "lat": 48.211262,
    "lon": 11.459523,
    "osm": "node/2487884333"
   },
   {
    "name": "Karlsplatz (Stachus)",
    "art": "sbahn",
    "lat": 48.139486,
    "lon": 11.565622,
    "osm": "node/2473297785"
   },
   {
    "name": "Karlsplatz (Stachus)",
    "art": "ubahn",
    "lat": 48.140335,
    "lon": 11.567021,
    "osm": "node/2473297786"
   },
   {
    "name": "Kieferngarten",
    "art": "ubahn",
    "lat": 48.203841,
    "lon": 11.613242,
    "osm": "node/2056183985"
   },
   {
    "name": "Klinikum Großhadern",
    "art": "ubahn",
    "lat": 48.109078,
    "lon": 11.473577,
    "osm": "node/2644689613"
   },
   {
    "name": "Kolumbusplatz",
    "art": "ubahn",
    "lat": 48.119815,
    "lon": 11.576652,
    "osm": "node/2524117388"
   },
   {
    "name": "Königsplatz",
    "art": "ubahn",
    "lat": 48.14501,
    "lon": 11.563209,
    "osm": "node/3114658668"
   },
   {
    "name": "Kreillerstraße",
    "art": "ubahn",
    "lat": 48.125754,
    "lon": 11.646852,
    "osm": "node/4726482189"
   },
   {
    "name": "Laim",
    "art": "sbahn",
    "lat": 48.144497,
    "lon": 11.502966,
    "osm": "node/2468901141"
   },
   {
    "name": "Laimer Platz",
    "art": "ubahn",
    "lat": 48.135461,
    "lon": 11.501976,
    "osm": "node/2660339821"
   },
   {
    "name": "Langwied",
    "art": "sbahn",
    "lat": 48.163044,
    "lon": 11.432452,
    "osm": "node/2468831364"
   },
   {
    "name": "Lehel",
    "art": "ubahn",
    "lat": 48.139656,
    "lon": 11.587921,
    "osm": "node/2660339818"
   },
   {
    "name": "Leienfelsstraße",
    "art": "sbahn",
    "lat": 48.154534,
    "lon": 11.42858,
    "osm": "node/2488177587"
   },
   {
    "name": "Leuchtenbergring",
    "art": "sbahn",
    "lat": 48.134287,
    "lon": 11.615994,
    "osm": "node/2488169605"
   },
   {
    "name": "Lochhausen",
    "art": "sbahn",
    "lat": 48.176031,
    "lon": 11.408717,
    "osm": "node/2468655152"
   },
   {
    "name": "Machtlfinger Straße",
    "art": "ubahn",
    "lat": 48.097374,
    "lon": 11.51504,
    "osm": "node/2650093415"
   },
   {
    "name": "Maillingerstraße",
    "art": "ubahn",
    "lat": 48.149988,
    "lon": 11.545605,
    "osm": "node/84322751"
   },
   {
    "name": "Mangfallplatz",
    "art": "ubahn",
    "lat": 48.09706,
    "lon": 11.579177,
    "osm": "node/73800962"
   },
   {
    "name": "Marienplatz",
    "art": "sbahn",
    "lat": 48.137144,
    "lon": 11.575399,
    "osm": "node/2941687118"
   },
   {
    "name": "Marienplatz",
    "art": "ubahn",
    "lat": 48.138361,
    "lon": 11.576183,
    "osm": "node/3189921461"
   },
   {
    "name": "Max-Weber-Platz",
    "art": "ubahn",
    "lat": 48.135703,
    "lon": 11.597871,
    "osm": "node/5184176689"
   },
   {
    "name": "Messestadt Ost",
    "art": "ubahn",
    "lat": 48.133378,
    "lon": 11.703407,
    "osm": "node/1692348440"
   },
   {
    "name": "Messestadt West",
    "art": "ubahn",
    "lat": 48.13343,
    "lon": 11.690541,
    "osm": "node/1692348451"
   },
   {
    "name": "Michaelibad",
    "art": "ubahn",
    "lat": 48.118349,
    "lon": 11.631823,
    "osm": "node/27214338"
   },
   {
    "name": "Milbertshofen",
    "art": "ubahn",
    "lat": 48.180904,
    "lon": 11.573153,
    "osm": "node/28202314"
   },
   {
    "name": "Mittersendling",
    "art": "sbahn",
    "lat": 48.107796,
    "lon": 11.536379,
    "osm": "node/2500623009"
   },
   {
    "name": "Moosach",
    "art": "sbahn",
    "lat": 48.18004,
    "lon": 11.506022,
    "osm": "node/2499632761"
   },
   {
    "name": "Moosach",
    "art": "ubahn",
    "lat": 48.180964,
    "lon": 11.508181,
    "osm": "node/3157666761"
   },
   {
    "name": "Moosacher St.-Martins-Platz",
    "art": "ubahn",
    "lat": 48.181835,
    "lon": 11.518814,
    "osm": "node/2650093421"
   },
   {
    "name": "Moosfeld",
    "art": "ubahn",
    "lat": 48.130772,
    "lon": 11.670984,
    "osm": "node/1692348456"
   },
   {
    "name": "München Hauptbahnhof",
    "art": "sbahn",
    "lat": 48.140725,
    "lon": 11.556943,
    "osm": "node/2470201868"
   },
   {
    "name": "München Hbf Gleis 27-36, Starnberger Bahnhof",
    "art": "sbahn",
    "lat": 48.141533,
    "lon": 11.55562,
    "osm": "node/3192902576"
   },
   {
    "name": "München Hbf Gleis 5-10, Holzkirchner Bahnhof",
    "art": "sbahn",
    "lat": 48.140147,
    "lon": 11.553162,
    "osm": "node/3192904758"
   },
   {
    "name": "München Ost",
    "art": "sbahn",
    "lat": 48.127721,
    "lon": 11.605519,
    "osm": "node/2465304880"
   },
   {
    "name": "München Süd",
    "art": "sbahn",
    "lat": 48.121566,
    "lon": 11.552973,
    "osm": "node/3256321608"
   },
   {
    "name": "München-Pasing",
    "art": "sbahn",
    "lat": 48.149956,
    "lon": 11.461767,
    "osm": "node/2476438979"
   },
   {
    "name": "Münchner Freiheit",
    "art": "ubahn",
    "lat": 48.161985,
    "lon": 11.586531,
    "osm": "node/2644689618"
   },
   {
    "name": "Neuaubing",
    "art": "sbahn",
    "lat": 48.141692,
    "lon": 11.422085,
    "osm": "node/2507009458"
   },
   {
    "name": "Neuperlach Süd",
    "art": "sbahn",
    "lat": 48.088822,
    "lon": 11.64502,
    "osm": "node/2476467535"
   },
   {
    "name": "Neuperlach Süd",
    "art": "ubahn",
    "lat": 48.088855,
    "lon": 11.645194,
    "osm": "node/3419919093"
   },
   {
    "name": "Neuperlach Zentrum",
    "art": "ubahn",
    "lat": 48.101184,
    "lon": 11.646174,
    "osm": "node/2568050650"
   },
   {
    "name": "Nordfriedhof",
    "art": "ubahn",
    "lat": 48.173188,
    "lon": 11.596986,
    "osm": "node/3157044270"
   },
   {
    "name": "Obermenzing",
    "art": "sbahn",
    "lat": 48.164217,
    "lon": 11.478022,
    "osm": "node/2699799616"
   },
   {
    "name": "Obersendling",
    "art": "ubahn",
    "lat": 48.098233,
    "lon": 11.535934,
    "osm": "node/2650093427"
   },
   {
    "name": "Oberwiesenfeld",
    "art": "ubahn",
    "lat": 48.185998,
    "lon": 11.547622,
    "osm": "node/2650093433"
   },
   {
    "name": "Odeonsplatz",
    "art": "ubahn",
    "lat": 48.143343,
    "lon": 11.578045,
    "osm": "node/1927202337"
   },
   {
    "name": "Odeonsplatz",
    "art": "ubahn",
    "lat": 48.142766,
    "lon": 11.576317,
    "osm": "node/3372671294"
   },
   {
    "name": "Olympia-Einkaufszentrum",
    "art": "ubahn",
    "lat": 48.182126,
    "lon": 11.530922,
    "osm": "node/2541407104"
   },
   {
    "name": "Olympia-Einkaufszentrum",
    "art": "ubahn",
    "lat": 48.182719,
    "lon": 11.530241,
    "osm": "node/3500554803"
   },
   {
    "name": "Olympiazentrum",
    "art": "ubahn",
    "lat": 48.179298,
    "lon": 11.55609,
    "osm": "node/2650093438"
   },
   {
    "name": "Ostbahnhof",
    "art": "ubahn",
    "lat": 48.128078,
    "lon": 11.60363,
    "osm": "node/3189921561"
   },
   {
    "name": "Partnachplatz",
    "art": "ubahn",
    "lat": 48.116941,
    "lon": 11.526726,
    "osm": "node/2644689619"
   },
   {
    "name": "Perlach",
    "art": "sbahn",
    "lat": 48.09341,
    "lon": 11.63152,
    "osm": "node/2476467539"
   },
   {
    "name": "Petuelring",
    "art": "ubahn",
    "lat": 48.175668,
    "lon": 11.565901,
    "osm": "node/2650093444"
   },
   {
    "name": "Poccistraße",
    "art": "ubahn",
    "lat": 48.125488,
    "lon": 11.550244,
    "osm": "node/2644689622"
   },
   {
    "name": "Prinzregentenplatz",
    "art": "ubahn",
    "lat": 48.139266,
    "lon": 11.607034,
    "osm": "node/2660339820"
   },
   {
    "name": "Quiddestraße",
    "art": "ubahn",
    "lat": 48.108112,
    "lon": 11.646674,
    "osm": "node/1544801370"
   },
   {
    "name": "Richard-Strauss-Straße",
    "art": "ubahn",
    "lat": 48.148333,
    "lon": 11.616601,
    "osm": "node/2660339822"
   },
   {
    "name": "Riem",
    "art": "sbahn",
    "lat": 48.143969,
    "lon": 11.677772,
    "osm": "node/2472241431"
   },
   {
    "name": "Rosenheimer Platz",
    "art": "sbahn",
    "lat": 48.129184,
    "lon": 11.593075,
    "osm": "node/2473550316"
   },
   {
    "name": "Rotkreuzplatz",
    "art": "ubahn",
    "lat": 48.154048,
    "lon": 11.533019,
    "osm": "node/84322749"
   },
   {
    "name": "Sankt-Martin-Straße",
    "art": "sbahn",
    "lat": 48.118558,
    "lon": 11.595778,
    "osm": "node/2411834909"
   },
   {
    "name": "Sankt-Quirin-Platz",
    "art": "ubahn",
    "lat": 48.10443,
    "lon": 11.581396,
    "osm": "node/73800960"
   },
   {
    "name": "Scheidplatz",
    "art": "ubahn",
    "lat": 48.171416,
    "lon": 11.572852,
    "osm": "node/1927183970"
   },
   {
    "name": "Schwanthalerhöhe",
    "art": "ubahn",
    "lat": 48.133782,
    "lon": 11.541057,
    "osm": "node/2660339823"
   },
   {
    "name": "Sendlinger Tor",
    "art": "ubahn",
    "lat": 48.133461,
    "lon": 11.566864,
    "osm": "node/2539850174"
   },
   {
    "name": "Sendlinger Tor",
    "art": "ubahn",
    "lat": 48.133523,
    "lon": 11.567094,
    "osm": "node/3372671694"
   },
   {
    "name": "Siemenswerke",
    "art": "sbahn",
    "lat": 48.094307,
    "lon": 11.53273,
    "osm": "node/2500671102"
   },
   {
    "name": "Silberhornstraße",
    "art": "ubahn",
    "lat": 48.114904,
    "lon": 11.580433,
    "osm": "node/99191054"
   },
   {
    "name": "Solln",
    "art": "sbahn",
    "lat": 48.079937,
    "lon": 11.526937,
    "osm": "node/2500732468"
   },
   {
    "name": "Stiglmaierplatz",
    "art": "ubahn",
    "lat": 48.147896,
    "lon": 11.556977,
    "osm": "node/84322752"
   },
   {
    "name": "Studentenstadt",
    "art": "ubahn",
    "lat": 48.183494,
    "lon": 11.60763,
    "osm": "node/1927202338"
   },
   {
    "name": "Thalkirchen",
    "art": "ubahn",
    "lat": 48.10284,
    "lon": 11.545979,
    "osm": "node/2650093598"
   },
   {
    "name": "Therese-Giehse-Allee",
    "art": "ubahn",
    "lat": 48.09473,
    "lon": 11.642716,
    "osm": "node/2660339824"
   },
   {
    "name": "Theresienstraße",
    "art": "ubahn",
    "lat": 48.15151,
    "lon": 11.564452,
    "osm": "node/211557411"
   },
   {
    "name": "Theresienwiese",
    "art": "ubahn",
    "lat": 48.135672,
    "lon": 11.552232,
    "osm": "node/2660347912"
   },
   {
    "name": "Trudering",
    "art": "sbahn",
    "lat": 48.126036,
    "lon": 11.663338,
    "osm": "node/2491219767"
   },
   {
    "name": "Trudering",
    "art": "ubahn",
    "lat": 48.125653,
    "lon": 11.662592,
    "osm": "node/3189921562"
   },
   {
    "name": "Universität",
    "art": "ubahn",
    "lat": 48.150354,
    "lon": 11.581144,
    "osm": "node/2644689645"
   },
   {
    "name": "Untermenzing",
    "art": "sbahn",
    "lat": 48.177712,
    "lon": 11.472685,
    "osm": "node/2488012895"
   },
   {
    "name": "Untersbergstraße",
    "art": "ubahn",
    "lat": 48.112595,
    "lon": 11.587508,
    "osm": "node/73778052"
   },
   {
    "name": "Westendstraße",
    "art": "ubahn",
    "lat": 48.134738,
    "lon": 11.521112,
    "osm": "node/2660347913"
   },
   {
    "name": "Westfriedhof",
    "art": "ubahn",
    "lat": 48.170381,
    "lon": 11.528459,
    "osm": "node/1189888870"
   },
   {
    "name": "Westkreuz",
    "art": "sbahn",
    "lat": 48.148897,
    "lon": 11.443763,
    "osm": "node/2499527320"
   },
   {
    "name": "Westpark",
    "art": "ubahn",
    "lat": 48.117986,
    "lon": 11.516253,
    "osm": "node/2644689647"
   },
   {
    "name": "Wettersteinplatz",
    "art": "ubahn",
    "lat": 48.108206,
    "lon": 11.57574,
    "osm": "node/2554223954"
   }
  ]
 }
};
