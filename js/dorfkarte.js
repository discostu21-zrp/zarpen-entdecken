"use strict";

/*
  Dorfkarte Zarpen

  Diese Datei:
  - lädt die Daten aus daten/dorfkarte.json
  - erstellt die Leaflet-Karte
  - erzeugt Marker und Popups
  - erstellt die Kategorie-Filter
  - begrenzt den Kartenausschnitt auf Zarpen
*/

document.addEventListener("DOMContentLoaded", initDorfkarte);

async function initDorfkarte() {
  const mapElement = document.getElementById("map");
  const filterElement = document.getElementById("category-filters");
  const placeCountElement = document.getElementById("place-count");
  const resetButton = document.getElementById("reset-map");

  if (!mapElement) {
    console.error('Das Element mit der ID "map" wurde nicht gefunden.');
    return;
  }

  try {
    if (placeCountElement) {
  placeCountElement.textContent = "Orte werden geladen …";
}

    const response = await fetch("daten/dorfkarte.json");

    if (!response.ok) {
      throw new Error(
        `Die Datei daten/dorfkarte.json konnte nicht geladen werden. Status: ${response.status}`
      );
    }

    const data = await response.json();

    validateData(data);

const map = createMap(data.map);
const categoryLayers = createCategoryLayers(map, data.categories);

if (placeCountElement) {
  const numberOfPlaces = data.places.length;

  placeCountElement.textContent =
    numberOfPlaces === 1
      ? "1 Ort wird angezeigt"
      : `${numberOfPlaces} Orte werden angezeigt`;
}

if (resetButton) {
  resetButton.addEventListener("click", () => {
    map.setView(
      [
        Number(data.map.center.lat),
        Number(data.map.center.lng)
      ],
      Number(data.map.zoom) || 14
    );
  });
}
    addPlacesToMap(
      map,
      data.places,
      data.categories,
      categoryLayers
    );

    createFilterButtons(
      map,
      data.categories,
      categoryLayers,
      filterElement
    );

   } catch (error) {
    console.error("Fehler beim Laden der Dorfkarte:", error);

if (placeCountElement) {
  placeCountElement.textContent =
    "Die Orte konnten leider nicht geladen werden.";
}

    showMapError(mapElement);
  }
}

/*
  Prüft, ob die wichtigsten Bereiche in der JSON-Datei vorhanden sind.
*/

function validateData(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Die Dorfkartendaten sind ungültig.");
  }

  if (!data.map || !data.map.center) {
    throw new Error("Der Kartenmittelpunkt fehlt.");
  }

  if (!Array.isArray(data.categories)) {
    throw new Error("Die Kategorien fehlen.");
  }

  if (!Array.isArray(data.places)) {
    throw new Error("Die Orte fehlen.");
  }
}

/*
  Erstellt die Leaflet-Karte.

  maxBounds begrenzt das Verschieben der Karte auf Zarpen
  und die direkte Umgebung.
*/

function createMap(mapSettings) {
  const centerLat = Number(mapSettings.center.lat);
  const centerLng = Number(mapSettings.center.lng);
  const zoom = Number(mapSettings.zoom) || 14;

  const zarpenBounds = L.latLngBounds(
    [53.8580, 10.4970],
    [53.8825, 10.5320]
  );

  const map = L.map("map", {
    center: [centerLat, centerLng],
    zoom: zoom,
    minZoom: 13,
    maxZoom: 19,
    maxBounds: zarpenBounds,
    maxBoundsViscosity: 0.9,
    zoomControl: true,
    scrollWheelZoom: true
  });

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      minZoom: 13,
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
    }
  ).addTo(map);

  return map;
}

/*
  Für jede Kategorie wird eine eigene Leaflet-Ebene angelegt.
  Dadurch lassen sich die Kategorien später ein- und ausblenden.
*/

function createCategoryLayers(map, categories) {
  const categoryLayers = {};

  categories.forEach((category) => {
    const layerGroup = L.layerGroup();

    layerGroup.addTo(map);
    categoryLayers[category.id] = layerGroup;
  });

  return categoryLayers;
}

/*
  Erstellt alle Marker aus der JSON-Datei.
*/

function addPlacesToMap(
  map,
  places,
  categories,
  categoryLayers
) {
  places.forEach((place) => {
    const lat = Number(place.lat);
    const lng = Number(place.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      console.warn(
        `Ungültige Koordinaten bei "${place.name}".`,
        place
      );
      return;
    }

    const category = categories.find(
      (item) => item.id === place.category
    );

    if (!category) {
      console.warn(
        `Unbekannte Kategorie "${place.category}" bei "${place.name}".`
      );
      return;
    }

    const marker = L.marker(
      [lat, lng],
      {
        icon: createCategoryIcon(place.category),
        title: place.name,
        alt: place.name,
        keyboard: true
      }
    );

    marker.bindPopup(
      createPopupContent(place, category),
      {
        maxWidth: 340,
        minWidth: 230
      }
    );

    marker.addTo(categoryLayers[place.category]);
  });
}

/*
  Erstellt die farbigen Marker.

  Für jede Kategorie gibt es:
  - eine eigene Farbe
  - ein passendes Symbol
*/

function createCategoryIcon(categoryId) {
  const categoryDesign = getCategoryDesign(categoryId);

  return L.divIcon({
    className: "dorf-marker-wrapper",
    html: `
      <div
        class="dorf-marker"
        style="--marker-color: ${categoryDesign.color};"
        aria-hidden="true"
      >
        <span>${categoryDesign.symbol}</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -23]
  });
}

/*
  Farben und Symbole der Kategorien.

  Die Symbole sind bewusst einfache Zeichen,
  damit keine zusätzliche Icon-Bibliothek nötig ist.
*/

function getCategoryDesign(categoryId) {
  const designs = {
    gemeinde: {
      color: "#064E3B",
      symbol: "⌂"
    },

    information: {
      color: "#526D82",
      symbol: "i"
    },

    sehenswuerdigkeit: {
      color: "#7B4B3A",
      symbol: "◆"
    },

    oeffentlich: {
      color: "#2457A7",
      symbol: "●"
    },

    freizeit: {
      color: "#6B21A8",
      symbol: "★"
    },

    gesundheit: {
      color: "#C62828",
      symbol: "+"
    },

    entsorgung: {
      color: "#5D6D3E",
      symbol: "↻"
    },

    gastronomie: {
      color: "#D95F02",
      symbol: "●"
    },

    einkaufen: {
      color: "#B7791F",
      symbol: "◆"
    },

    briefkasten: {
      color: "#E0A800",
      symbol: "✉"
    }
  };

  return designs[categoryId] || {
    color: "#064E3B",
    symbol: "●"
  };
}

/*
  Erstellt den vollständigen Inhalt eines Popups.
  Leere Felder werden automatisch nicht angezeigt.
*/

function createPopupContent(place, category) {
  const imageHtml = place.image
    ? `
      <img
        class="dorf-popup-image"
        src="${escapeAttribute(place.image)}"
        alt="${escapeAttribute(place.name)}"
        loading="lazy"
        onerror="this.style.display='none'"
      >
    `
    : "";

  const descriptionHtml = place.description
    ? `
      <p class="dorf-popup-description">
        ${escapeHtml(place.description)}
      </p>
    `
    : "";

  const addressHtml = createPopupRow(
    "Adresse",
    place.address
  );

  const phoneHtml = place.phone
    ? `
      <div class="dorf-popup-row">
        <strong>Telefon:</strong>
        <a href="tel:${createTelephoneLink(place.phone)}">
          ${escapeHtml(place.phone)}
        </a>
      </div>
    `
    : "";

  const openingHoursHtml = createPopupRow(
    "Öffnungszeiten",
    place.openingHours
  );

  const noticeHtml = place.notice
    ? `
      <div class="dorf-popup-notice">
        <strong>Hinweis:</strong>
        ${escapeHtml(place.notice)}
      </div>
    `
    : "";

  const linkHtml = place.link
    ? `
      <a
        class="dorf-popup-link"
        href="${escapeAttribute(place.link)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Weitere Informationen
        <span aria-hidden="true">→</span>
      </a>
    `
    : "";

  return `
    <article class="dorf-popup">
      ${imageHtml}

      <div class="dorf-popup-content">
        <span class="dorf-popup-category">
          ${escapeHtml(category.label)}
        </span>

        <h3>${escapeHtml(place.name)}</h3>

        ${descriptionHtml}

        <div class="dorf-popup-details">
          ${addressHtml}
          ${phoneHtml}
          ${openingHoursHtml}
        </div>

        ${noticeHtml}
        ${linkHtml}
      </div>
    </article>
  `;
}

/*
  Kleine Hilfsfunktion für Adressen und Öffnungszeiten.
*/

function createPopupRow(label, value) {
  if (!value) {
    return "";
  }

  return `
    <div class="dorf-popup-row">
      <strong>${escapeHtml(label)}:</strong>
      <span>${escapeHtml(value)}</span>
    </div>
  `;
}

/*
  Erstellt die Filterbuttons oberhalb der Karte.
*/

function createFilterButtons(
  map,
  categories,
  categoryLayers,
  filterElement
) {
  if (!filterElement) {
    console.warn(
      'Das Element mit der ID "category-filters" wurde nicht gefunden.'
    );
    return;
  }

  filterElement.innerHTML = "";

  const allButton = createFilterButton(
    "Alle",
    "all",
    true
  );

  filterElement.appendChild(allButton);

  categories.forEach((category) => {
    const button = createFilterButton(
      category.label,
      category.id,
      true
    );

    filterElement.appendChild(button);
  });

  filterElement.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-button");

    if (!button) {
      return;
    }

    const categoryId = button.dataset.category;

    if (categoryId === "all") {
      activateAllCategories(
        map,
        categories,
        categoryLayers,
        filterElement
      );

      return;
    }

    toggleCategory(
      map,
      categoryId,
      categoryLayers,
      button
    );

    updateAllButton(
      categories,
      categoryLayers,
      filterElement,
      map
    );
  });
}

/*
  Erstellt einen einzelnen Filterbutton.
*/

function createFilterButton(
  label,
  categoryId,
  active
) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "filter-button";
  button.dataset.category = categoryId;
  button.textContent = label;
  button.setAttribute(
    "aria-pressed",
    active ? "true" : "false"
  );

  if (active) {
    button.classList.add("is-active");
  }

  return button;
}

/*
  Schaltet eine einzelne Kategorie ein oder aus.
*/

function toggleCategory(
  map,
  categoryId,
  categoryLayers,
  button
) {
  const layer = categoryLayers[categoryId];

  if (!layer) {
    return;
  }

  if (map.hasLayer(layer)) {
    map.removeLayer(layer);
    setButtonState(button, false);
  } else {
    layer.addTo(map);
    setButtonState(button, true);
  }
}

/*
  Aktiviert mit einem Klick wieder alle Kategorien.
*/

function activateAllCategories(
  map,
  categories,
  categoryLayers,
  filterElement
) {
  categories.forEach((category) => {
    const layer = categoryLayers[category.id];

    if (layer && !map.hasLayer(layer)) {
      layer.addTo(map);
    }
  });

  const buttons =
    filterElement.querySelectorAll(".filter-button");

  buttons.forEach((button) => {
    setButtonState(button, true);
  });
}

/*
  Aktualisiert den Button "Alle".

  Er ist nur aktiv, wenn wirklich alle Kategorien
  auf der Karte eingeblendet sind.
*/

function updateAllButton(
  categories,
  categoryLayers,
  filterElement,
  map
) {
  const allActive = categories.every((category) => {
    const layer = categoryLayers[category.id];
    return layer && map.hasLayer(layer);
  });

  const allButton = filterElement.querySelector(
    '[data-category="all"]'
  );

  if (allButton) {
    setButtonState(allButton, allActive);
  }
}

/*
  Ändert Aussehen und barrierefreien Status eines Buttons.
*/

function setButtonState(button, active) {
  button.classList.toggle("is-active", active);

  button.setAttribute(
    "aria-pressed",
    active ? "true" : "false"
  );
}

/*
  Status- oder Fehlermeldung oberhalb der Karte.
*/

function setStatus(statusElement, message) {
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.hidden = message === "";
}

/*
  Zeigt eine Fehlermeldung innerhalb der Kartenfläche.
*/

function showMapError(mapElement) {
  mapElement.innerHTML = `
    <div class="map-error">
      <h2>Dorfkarte nicht verfügbar</h2>
      <p>
        Die Karte oder ihre Daten konnten nicht geladen werden.
        Bitte versuche es später erneut.
      </p>
    </div>
  `;
}

/*
  Wandelt eine Telefonnummer in einen tel:-Link um.
*/

function createTelephoneLink(phone) {
  return String(phone).replace(/[^\d+]/g, "");
}

/*
  Schutz gegen versehentlich eingefügten HTML-Code.
*/

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/*
  Schutz für Werte innerhalb von HTML-Attributen.
*/

function escapeAttribute(value) {
  return escapeHtml(value);
}
