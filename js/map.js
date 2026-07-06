// Zarpen entdecken – Testkarte: Redder & Hundewiese
// Zarpen entdecken – Testkarte: Redder & Hundewiese

const start = [53.870530, 10.517432];

const mode = window.ZARPEN_MODE || "detail";
const isDetail = mode === "detail";

const map = L.map('map', {
  zoomControl: isDetail,
  scrollWheelZoom: isDetail,
  dragging: true,
  doubleClickZoom: isDetail,
  touchZoom: true
}).setView(start, 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

new L.GPX("gpx/redder-hundewiese.gpx", {
    async: true,
    polyline_options: {
        color: "#2e7d32",
        weight: 6,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round"
    },
    marker_options: {
        startIconUrl: "",
        endIconUrl: "",
        shadowUrl: ""
    }
})
.on("loaded", function(e) {
    console.log("GPX geladen");

    map.fitBounds(e.target.getBounds(), {
        padding: [30, 30]
    });
})
.on("error", function(e) {
    console.error(e);
})
.addTo(map);

const icons = {
  start: { symbol: '📍', className: 'marker-start' },
  sehenswuerdigkeit: { symbol: '⛪', className: 'marker-sehenswuerdigkeit' },
  service: { symbol: 'ℹ️', className: 'marker-service' },
  gastronomie: { symbol: '🍴', className: 'marker-gastronomie' },
  warnung: { symbol: '!', className: 'marker-warnung' },
  rast: { symbol: '🪑', className: 'marker-rast' },
  hund: { symbol: '🐕', className: 'marker-hund' },
  natur: { symbol: '🌿', className: 'marker-natur' },
  bruecke: { symbol: '🌉', className: 'marker-bruecke' },
  oeffentlich: { symbol: '🏛️', className: 'marker-oeffentlich' }
};

function makeIcon(type) {
  const icon = icons[type] || icons.service;
  return L.divIcon({
    className: '',
    html: `<div class="custom-marker ${icon.className}"><span>${icon.symbol}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32]
  });
}

const places = [
  { name: 'Marktplatz Zarpen', type: 'start', lat: 53.871249, lng: 10.517969, text: 'Start- und Zielpunkt der Tour. Von hier hat man einen schönen Blick auf die Dorfkirche.' },
  { name: 'Wegweiser-Schild', type: 'service', lat: 53.871213, lng: 10.518067, text: 'Schilder mit verschiedenen Städten weltweit und ihrer Entfernung zu Zarpen.' },
  { name: 'Schaukasten SPD', type: 'service', lat: 53.871170, lng: 10.518207, text: 'Schaukasten des SPD-Ortsvereins.' },
  { name: 'Schaukasten FKW', type: 'service', lat: 53.870733, lng: 10.518173, text: 'Schaukasten der FKW Zarpen.' },
  { name: 'Kirche Zarpen', type: 'sehenswuerdigkeit', lat: 53.870548, lng: 10.517290, text: 'Die über 800 Jahre alte Dorfkirche prägt den Ortskern.' },
  { name: 'Landgasthof EckKrug', type: 'gastronomie', lat: 53.870307, lng: 10.518309, text: 'Traditionsreicher Landgasthof im Ortskern.' },
  { name: 'Heilsau', type: 'natur', lat: 53.869246, lng: 10.521122, text: 'Über die Heilsaubrücke geht es in Richtung Redder.' },
  { name: 'Achtung: Straße überqueren', type: 'warnung', lat: 53.868123, lng: 10.520449, text: 'An der Kreuzung Lübecker Straße / Redder gibt es keine gesicherte Querung. Bitte besonders auf den Verkehr achten.' },
  { name: 'Schaukasten SoVD', type: 'service', lat: 53.868087, lng: 10.520323, text: 'Schaukasten des Sozialverbandes Zarpen.' },
  { name: 'Sitzbank im Grünen', type: 'rast', lat: 53.864012, lng: 10.517699, text: 'Rastmöglichkeit im Redder mit Blick ins Grüne.' },
  { name: 'Mülleimer & Hundekotbeutel-Station', type: 'hund', lat: 53.863603, lng: 10.515461, text: 'Zugang zur Hundewiese.' },
  { name: 'Holzbrücke', type: 'bruecke', lat: 53.864732, lng: 10.514596, text: 'Die Bürgerverein-Holzbrücke.' },
  { name: 'Sitzbank im Grünen', type: 'rast', lat: 53.864819, lng: 10.514596, text: 'Sitzgelegenheit nahe der Holzbrücke.' },
  { name: 'Insektenhotel', type: 'natur', lat: 53.864562, lng: 10.513940, text: 'Schönes Insektenhotel auf der Hundespielwiese.' },
  { name: 'Hundespielwiese', type: 'hund', lat: 53.864248, lng: 10.513769, text: 'Freilauffläche für Hunde.' },
  { name: 'Sitzbank im Grünen', type: 'rast', lat: 53.863902, lng: 10.513556, text: 'Weitere Sitzbank auf der Hundespielwiese.' },
  { name: 'Feldweg mit Blick ins Dorf', type: 'natur', lat: 53.864808, lng: 10.511883, text: 'Schöner Blick über die Felder in Richtung Kirche und Dorfmitte.' },
  { name: 'Mülleimer & Hundekotbeutel-Station', type: 'hund', lat: 53.866325, lng: 10.508122, text: 'Zugang zur Hundewiese Hauptstraße.' },
  { name: 'Baumschule Zarpen', type: 'natur', lat: 53.867084, lng: 10.508363, text: 'Vorbei an der Baumschule führt die Route zurück in den Ort.' },
  { name: 'Sitzbank', type: 'rast', lat: 53.867974, lng: 10.513137, text: 'Sitzmöglichkeit an der Teichstraße.' },
  { name: 'Freiwillige Feuerwehr Zarpen', type: 'oeffentlich', lat: 53.870127, lng: 10.514563, text: 'Gerätehaus der FF Zarpen.' },
  { name: 'Kindergarten', type: 'oeffentlich', lat: 53.870957, lng: 10.516943, text: 'Ev. Kindertagesstätte Arche Noah.' },
  { name: 'Kindergarten', type: 'oeffentlich', lat: 53.871673, lng: 10.518307, text: 'Villa Kunterbunt" DRK Stormarn.' }
];

places.forEach(place => {
  const typeLabel = {
    start: 'Start/Ziel',
    sehenswuerdigkeit: 'Sehenswürdigkeit',
    service: 'Information',
    gastronomie: 'Gastronomie',
    warnung: 'Hinweis',
    rast: 'Rastplatz',
    hund: 'Hunde-Service',
    natur: 'Natur & Aussicht',
    bruecke: 'Brücke',
    oeffentlich: 'Öffentliche Einrichtung'
  }[place.type] || 'Ort';

  L.marker([place.lat, place.lng], { icon: makeIcon(place.type) })
    .addTo(map)
    .bindPopup(`<b>${place.name}</b><br>${place.text}<br><span class="popup-type">${typeLabel}</span>`);
});


// Infobox oben links
const tourPanel = L.control({ position: 'topleft' });
tourPanel.onAdd = function () {
  const div = L.DomUtil.create('div', 'tour-panel');
  div.innerHTML = `
    <h1>Redder & Hundewiese</h1>
    <div class="subtitle">Zarpen entdecken – Spaziergang</div>
    <div class="facts">
      <div class="fact"><b>2,92 km</b><br>Distanz</div>
      <div class="fact"><b>ca. 36 Min.</b><br>Dauer</div>
      <div class="fact"><b>leicht</b><br>Schwierigkeit</div>
      <div class="fact"><b>10 m</b><br>Höhenmeter</div>
    </div>
    <p>Abwechslungsreiche Runde durch den Redder, über die Hundespielwiese und zurück ins Dorf.</p>
    <hr style="margin:18px 0;">

<h3 style="margin:0 0 10px;">Legende</h3>

<div class="legend-item"><span class="legend-dot route"></span> Streckenverlauf</div>

<div class="legend-item"><span class="legend-dot start"></span> Start/Ziel</div>

<div class="legend-item"><span class="legend-dot sehenswuerdigkeit"></span> Sehenswürdigkeit</div>

<div class="legend-item"><span class="legend-dot gastronomie"></span> Gastronomie</div>

<div class="legend-item"><span class="legend-dot service"></span> Information / Schaukasten</div>

<div class="legend-item"><span class="legend-dot oeffentlich"></span> Öffentliche Einrichtung</div>

<div class="legend-item"><span class="legend-dot rast"></span> Sitzbank</div>

<div class="legend-item"><span class="legend-dot hund"></span> Hunde-Service</div>

<div class="legend-item"><span class="legend-dot natur"></span> Natur & Aussicht</div>

<div class="legend-item"><span class="legend-dot warnung"></span> Hinweis</div>
  `;
  L.DomEvent.disableClickPropagation(div);
  return div;
};
if (isDetail) {
  tourPanel.addTo(map);
}
