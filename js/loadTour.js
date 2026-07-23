// Lädt die Routendaten anhand der Adresse,
// zum Beispiel: tour.html?route=allee

(async function loadTour() {
  const loadingMessage =
    document.getElementById("loading-message");

  const errorMessage =
    document.getElementById("error-message");

  try {
    const urlParameters =
      new URLSearchParams(window.location.search);

    const routeId =
      urlParameters.get("route") || "redder";

    const routeFile =
      `touren/${routeId}/route.json`;

    const response = await fetch(routeFile);

    if (!response.ok) {
      throw new Error(
        `Routendatei konnte nicht geladen werden: ${routeFile}`
      );
    }

    const routeData = await response.json();

    if (typeof window.initZarpenMap !== "function") {
      throw new Error(
        "Die Kartenfunktion initZarpenMap ist nicht verfügbar."
      );
    }

    if (loadingMessage) {
      loadingMessage.remove();
    }

    window.initZarpenMap(routeData);

  } catch (error) {
    console.error("Fehler beim Laden der Tour:", error);

    if (loadingMessage) {
      loadingMessage.hidden = true;
    }

    if (errorMessage) {
      errorMessage.hidden = false;
      errorMessage.textContent =
        "Die gewünschte Tour konnte nicht geladen werden.";
    }
  }
})();
