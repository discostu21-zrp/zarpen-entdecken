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

// Weiße Kontur unter der Route
new L.GPX("gpx/redder-hundewiese.gpx", {
  async: true,
  polyline_options: {
    color: "#fafafa",
    weight: 11,
    opacity: 1,
    lineCap: "round",
    lineJoin: "round"
  },
  marker_options: {
    startIconUrl: "",
    endIconUrl: "",
    shadowUrl: ""
  }
}).addTo(map);

// Grüne Route darüber
new L.GPX("gpx/redder-hundewiese.gpx", {
  async: true,
  polyline_options: {
    color: "#2e7d32",
    weight: 6,
    opacity: 0.95,
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
  map.fitBounds(e.target.getBounds(), {
    padding: [30, 30]
  });
})
.on("error", function(e) {
  console.error("GPX Fehler:", e);
})
.addTo(map);

const icons = {
  start: { file: 'start.svg', className: 'marker-start' },
  sehenswuerdigkeit: { file: 'church.svg', className: 'marker-sehenswuerdigkeit' },
  service: { file: 'info.svg', className: 'marker-service' },
  gastronomie: { file: 'restaurant.svg', className: 'marker-gastronomie' },
  warnung: { file: 'warning.svg', className: 'marker-warnung' },
  rast: { file: 'bench.svg', className: 'marker-rast' },
  hund: { file: 'dog.svg', className: 'marker-hund' },
  natur: { file: 'leaf.svg', className: 'marker-natur' },
  bruecke: { file: 'bridge.svg', className: 'marker-bruecke' },
  oeffentlich: { file: 'building.svg', className: 'marker-oeffentlich' }
};

function makeIcon(type) {
  const icon = icons[type] || icons.service;

  return L.divIcon({
    className: '',
    html: `
      <div class="custom-marker ${icon.className}">
        <img src="icons/${icon.file}" alt="">
      </div>
    `,
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

const markerLayers = {};

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

  const marker = L.marker([place.lat, place.lng], { icon: makeIcon(place.type) })
    .addTo(map)
    .bindPopup(`<b>${place.name}</b><br>${place.text}<br><span class="popup-type">${typeLabel}</span>`);

  if (!markerLayers[place.type]) {
    markerLayers[place.type] = [];
  }

  markerLayers[place.type].push(marker);
});
let activeLegendType = null;

function highlightType(type) {
  activeLegendType = activeLegendType === type ? null : type;

  Object.keys(markerLayers).forEach(markerType => {
    markerLayers[markerType].forEach(marker => {
      const el = marker.getElement();

      if (!el) return;

      if (!activeLegendType) {
        el.style.opacity = "1";
        el.style.filter = "none";
        el.style.zIndex = "";
      } else if (markerType === activeLegendType) {
        el.style.opacity = "1";
        el.style.filter = "none";
        el.style.zIndex = "1000";
      } else {
        el.style.opacity = "0.22";
        el.style.filter = "grayscale(100%)";
        el.style.zIndex = "1";
      }
    });
  });

  document.querySelectorAll(".legend-item").forEach(item => {
    item.classList.remove("legend-active");
  });

  if (activeLegendType) {
    const activeItem = document.querySelector(`[data-type="${activeLegendType}"]`);
    if (activeItem) {
      activeItem.classList.add("legend-active");
    }
  }
}


// Infobox oben links
const tourPanel = L.control({ position: 'topleft' });

tourPanel.onAdd = function () {

  const div = L.DomUtil.create('div', 'tour-panel');

  div.innerHTML = `

<details class="tour-details" open>

<summary>🌿 Tourinformationen</summary>

<h1>Redder & Hundewiese</h1>

<div class="subtitle">
Zarpen entdecken – Spaziergang
</div>

<div class="facts">

<div class="fact">
<b>2,92 km</b><br>
Distanz
</div>

<div class="fact">
<b>ca. 36 Min.</b><br>
Dauer
</div>

<div class="fact">
<b>leicht</b><br>
Schwierigkeit
</div>

<div class="fact">
<b>10 m</b><br>
Höhenmeter
</div>

</div>

<p>
Abwechslungsreiche Runde durch den Redder,
über die Hundespielwiese und zurück ins Dorf.
</p>

<hr style="margin:18px 0;">

<h3>Legende</h3>

<div class="legend-item" data-type="start" onclick="highlightType('start')">
<span class="legend-icon marker-start">
📍
</span>
Start/Ziel
</div>

<div class="legend-item" data-type="sehenswuerdigkeit" onclick="highlightType('sehenswuerdigkeit')">
<span class="legend-icon marker-sehenswuerdigkeit">
⛪
</span>
Sehenswürdigkeit
</div>

<div class="legend-item" data-type="gastronomie" onclick="highlightType('gastronomie')">
<span class="legend-icon marker-gastronomie">
🍴
</span>
Gastronomie
</div>

<div class="legend-item" data-type="service" onclick="highlightType('service')">
<span class="legend-icon marker-service">
ℹ️
</span>
Information / Schaukasten
</div>

<div class="legend-item" data-type="oeffentlich" onclick="highlightType('oeffentlich')">
<span class="legend-icon marker-oeffentlich">
🏛️
</span>
Öffentliche Einrichtung
</div>

<div class="legend-item" data-type="rast" onclick="highlightType('rast')">
<span class="legend-icon marker-rast">
🪑
</span>
Sitzbank
</div>

<div class="legend-item" data-type="hund" onclick="highlightType('hund')">
<span class="legend-icon marker-hund">
🐕
</span>
Hunde-Service
</div>

<div class="legend-item" data-type="natur" onclick="highlightType('natur')">
<span class="legend-icon marker-natur">
🌿
</span>
Natur & Aussicht
</div>

<div class="legend-item" data-type="warnung" onclick="highlightType('warnung')">
<span class="legend-icon marker-warnung">
!
</span>
Hinweis
</div>

</details>

`;

  L.DomEvent.disableClickPropagation(div);

  return div;

};

if (isDetail) {
    tourPanel.addTo(map);
}
