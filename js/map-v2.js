// Gemeinsame Kartenlogik für „Zarpen entdecken“

window.initZarpenMap = function (routeData) {

  // --------------------------------------------------
  // 1. Routendaten kontrollieren
  // --------------------------------------------------

  if (!routeData) {
    throw new Error("Es wurden keine Routendaten übergeben.");
  }

  if (!routeData.start) {
    throw new Error(
      "In der route.json fehlen die Startkoordinaten."
    );
  }

  if (!routeData.gpx) {
    throw new Error(
      "In der route.json fehlt der Pfad zur GPX-Datei."
    );
  }

  if (!Array.isArray(routeData.places)) {
    throw new Error(
      "In der route.json fehlt die Liste places."
    );
  }

  const isMobile =
    window.matchMedia("(max-width: 768px)").matches;

  const start = [
    routeData.start.lat,
    routeData.start.lng
  ];

  const startZoom =
    routeData.start.zoom || 15;


  // --------------------------------------------------
  // 2. Leaflet-Karte erzeugen
  // --------------------------------------------------

  const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
    dragging: true,
    doubleClickZoom: true,
    touchZoom: true
  }).setView(start, startZoom);


  // --------------------------------------------------
  // 3. OpenStreetMap-Hintergrund
  // --------------------------------------------------

  L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap"
    }
  ).addTo(map);


  // --------------------------------------------------
  // 4. Weiße Kontur unter der Route
  // --------------------------------------------------

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


  // --------------------------------------------------
  // 5. Grüne GPX-Route
  // --------------------------------------------------

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

    showMapError(
      "Die Route konnte nicht angezeigt werden."
    );

  })

  .addTo(map);


  // --------------------------------------------------
  // 6. Marker-Kategorien und Symbole
  // --------------------------------------------------

  const icons = {
    start: {
      file: "start.svg",
      className: "marker-start"
    },

    sehenswuerdigkeit: {
      file: "church.svg",
      className: "marker-sehenswuerdigkeit"
    },

    service: {
      file: "info.svg",
      className: "marker-service"
    },

    gastronomie: {
      file: "restaurant.svg",
      className: "marker-gastronomie"
    },

    warnung: {
      file: "warning.svg",
      className: "marker-warnung"
    },

    rast: {
      file: "bench.svg",
      className: "marker-rast"
    },

    hund: {
      file: "dog.svg",
      className: "marker-hund"
    },

    natur: {
      file: "leaf.svg",
      className: "marker-natur"
    },

    bruecke: {
      file: "bridge.svg",
      className: "marker-bruecke"
    },

    oeffentlich: {
      file: "building.svg",
      className: "marker-oeffentlich"
    }
  };


  // Bezeichnungen für die Popups
  const typeLabels = {
    start: "Start/Ziel",
    sehenswuerdigkeit: "Sehenswürdigkeit",
    service: "Information",
    gastronomie: "Gastronomie",
    warnung: "Hinweis",
    rast: "Rastplatz",
    hund: "Hunde-Service",
    natur: "Natur & Aussicht",
    bruecke: "Brücke",
    oeffentlich: "Öffentliche Einrichtung"
  };


  // --------------------------------------------------
  // 7. Leaflet-Symbol erstellen
  // --------------------------------------------------

  function makeIcon(type) {

    const icon =
      icons[type] || icons.service;

    return L.divIcon({
      className: "",

      html: `
        <div class="custom-marker ${icon.className}">
          <img
            src="icons/${icon.file}"
            alt=""
          >
        </div>
      `,

      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -32]
    });
  }


  // --------------------------------------------------
  // 8. Marker aus route.json erzeugen
  // --------------------------------------------------

  routeData.places.forEach(function (place) {

    if (
      typeof place.lat !== "number" ||
      typeof place.lng !== "number"
    ) {
      console.warn(
        "Marker ohne gültige Koordinaten:",
        place
      );

      return;
    }

    const typeLabel =
      typeLabels[place.type] || "Ort";

    const iconData =
      icons[place.type] || icons.service;

    const iconUrl =
      `icons/${iconData.file}`;


    // ----------------------------------------------
    // Verschobene Markerposition
    // ----------------------------------------------

    const hasOffset =
      typeof place.offsetLat === "number" &&
      typeof place.offsetLng === "number";

    const markerLat =
      hasOffset
        ? place.offsetLat
        : place.lat;

    const markerLng =
      hasOffset
        ? place.offsetLng
        : place.lng;


    // ----------------------------------------------
    // Verbindungslinie bei verschobenem Marker
    // ----------------------------------------------

    if (hasOffset) {

      L.polyline(
        [
          [place.lat, place.lng],
          [markerLat, markerLng]
        ],
        {
          color: "#333333",
          weight: 3,
          opacity: 1,
          dashArray: "8,6",
          lineCap: "round",
          interactive: false
        }
      ).addTo(map);


      // Kleiner Punkt am tatsächlichen Standort
      L.circleMarker(
        [place.lat, place.lng],
        {
          radius: 5,
          color: "#ffffff",
          weight: 2,
          fillColor: "#555555",
          fillOpacity: 1,
          interactive: false
        }
      ).addTo(map);

    }


    // ----------------------------------------------
    // Überschrift im Popup
    // ----------------------------------------------

    const popupTitle = `
      <img
        class="popup-title-icon"
        src="${iconUrl}"
        alt=""
      >

      <span>${place.name}</span>
    `;


    // ----------------------------------------------
    // Kopfbereich mit oder ohne Bild
    // ----------------------------------------------

    const popupHeader = place.image
      ? `
        <div class="popup-header">

          <img
            class="popup-image"
            src="${place.image}"
            alt="${place.name}"
          >

          <div class="popup-title-overlay">
            ${popupTitle}
          </div>

        </div>
      `
      : `
        <div class="popup-title">
          ${popupTitle}
        </div>
      `;


    // ----------------------------------------------
    // Kategorie
    // ----------------------------------------------

    const categoryLabel = `
      <div class="popup-type-label">
        ${typeLabel}
      </div>
    `;


    // ----------------------------------------------
    // Text
    // ----------------------------------------------

    const popupText = place.text
      ? `
        <div class="popup-text">
          ${place.text}
        </div>
      `
      : "";


    // ----------------------------------------------
    // Geschichte
    // ----------------------------------------------

    const storyBox = place.story
      ? `
        <div class="popup-story">
          ${place.story}
        </div>
      `
      : "";


    // ----------------------------------------------
    // Link zur Webseite
    // ----------------------------------------------

    const linkButton = place.link
      ? `
        <a
          class="popup-link"
          href="${place.link}"
          target="_blank"
          rel="noopener"
        >
          Webseite öffnen
        </a>
      `
      : "";


    // ----------------------------------------------
    // Marker erstellen
    // ----------------------------------------------

    const marker = L.marker(
      [markerLat, markerLng],
      {
        icon: makeIcon(place.type),
        title: place.name || ""
      }
    ).addTo(map);


    // ----------------------------------------------
    // Popup an Marker binden
    // ----------------------------------------------

    marker.bindPopup(`
      <div class="popup-card">

        ${popupHeader}

        ${categoryLabel}

        ${popupText}

        ${storyBox}

        ${linkButton}

      </div>
    `, {
      maxWidth: 340,
      minWidth: 240
    });

  });


  // --------------------------------------------------
  // 9. Seitentitel anpassen
  // --------------------------------------------------

  if (routeData.title) {
    document.title =
      `${routeData.title} – Zarpen entdecken`;
  }


  console.log(
    `Tour „${routeData.title || routeData.id}“ wurde geladen.`
  );


  // --------------------------------------------------
  // 10. Fehlermeldung anzeigen
  // --------------------------------------------------

  function showMapError(message) {

    const errorMessage =
      document.getElementById("error-message");

    if (!errorMessage) {
      return;
    }

    errorMessage.hidden = false;
    errorMessage.textContent = message;
  }

};
