
// Karte erzeugen
const map = L.map('map').setView([53.870530, 10.517432], 15);

// OpenStreetMap
L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '© OpenStreetMap'
    }
).addTo(map);

// Marker Marktplatz
L.marker([53.870530, 10.517432])
    .addTo(map)
    .bindPopup("<b>📍 Marktplatz Zarpen</b><br>Start- und Zielpunkt aller Touren.");
