// Gemeinsame Kartenlogik für „Zarpen entdecken“

window.initZarpenMap = function (routeData) {

  // Prüfen, ob die wichtigsten Routendaten vorhanden sind
  if (!routeData) {
    throw new Error("Es wurden keine Routendaten übergeben.");
  }

  if (!routeData.start) {
    throw new Error("In der route.json fehlen die Startkoordinaten.");
  }

  if (!routeData.gpx) {
    throw new Error("In der route.json fehlt der Pfad zur GPX-Datei.");
  }

  const isMobile =
    window.matchMedia("(max-width: 768px)").matches;

  // Startposition aus der route.json
  const start = [
    routeData.start.lat,
    routeData.start.lng
  ];

  const startZoom =
    routeData.start.zoom || 15;

  // Leaflet-Karte erzeugen
  const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
    dragging: true,
    doubleClickZoom: true,
    touchZoom: true
  }).setView(start, startZoom);

  // OpenStreetMap-Hintergrund
  L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap"
    }
  ).addTo(map);

  // Weiße Kontur unter der Route
  new L.GPX(routeData.gpx, {
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

  // Grüne GPX-Route
  new L.GPX(routeData.gpx, {
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

  .on("loaded", function (event) {

    // Karte automatisch auf die gesamte Route ausrichten
    map.fitBounds(
      event.target.getBounds(),
      {
        padding: isMobile
          ? [20, 20]
          : [30, 30]
      }
    );

  })

  .on("error", function (error) {

    console.error(
      "Fehler beim Laden der GPX-Datei:",
      error
    );

    const errorMessage =
      document.getElementById("error-message");

    if (errorMessage) {
      errorMessage.hidden = false;
      errorMessage.textContent =
        "Die Route konnte nicht angezeigt werden.";
    }

  })

  .addTo(map);

  console.log(
    `Tour „${routeData.title}“ wurde geladen.`
  );
};
