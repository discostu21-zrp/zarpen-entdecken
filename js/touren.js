document.addEventListener("DOMContentLoaded", async () => {
  const tourList = document.getElementById("tour-list");

  if (!tourList) {
    console.error("Der Bereich #tour-list wurde nicht gefunden.");
    return;
  }

  try {
    const directoryResponse = await fetch("touren/touren.json");

    if (!directoryResponse.ok) {
      throw new Error(
        `Tourenverzeichnis konnte nicht geladen werden: ${directoryResponse.status}`
      );
    }

    const directoryData = await directoryResponse.json();
    const tourIds = directoryData.tours;

    if (!Array.isArray(tourIds) || tourIds.length === 0) {
      throw new Error("Im Tourenverzeichnis sind keine Touren eingetragen.");
    }

    const tours = await Promise.all(
      tourIds.map(async (tourId) => {
        const routeResponse = await fetch(
          `touren/${tourId}/route.json`
        );

        if (!routeResponse.ok) {
          throw new Error(
            `Die Tour "${tourId}" konnte nicht geladen werden.`
          );
        }

        const routeData = await routeResponse.json();

        return {
          ...routeData,
          routeId: tourId
        };
      })
    );

    tourList.innerHTML = "";

    tours.forEach((tour) => {
      const card = createTourCard(tour);
      tourList.appendChild(card);
    });
  } catch (error) {
    console.error(error);

    tourList.innerHTML = `
      <div class="error-message">
        <h2>Touren konnten nicht geladen werden</h2>
        <p>
          Bitte lade die Seite später erneut oder prüfe die Dateien
          im Tourenverzeichnis.
        </p>
      </div>
    `;
  }
});

function createTourCard(tour) {
  const article = document.createElement("article");
  article.className = "tour-card";

  const title = tour.title || "Unbenannte Tour";
  const subtitle = tour.subtitle || "";
  const heroImage = tour.heroImage || "";
  const facts = tour.facts || {};

  const distance = facts.distance || "Keine Angabe";
  const duration = facts.duration || "Keine Angabe";
  const difficulty = facts.difficulty || "Keine Angabe";
  const surface = facts.surface || "";

  article.innerHTML = `
    <a
      class="tour-card-image-link"
      href="tour.html?route=${encodeURIComponent(tour.routeId)}"
      aria-label="${escapeHtml(title)} ansehen"
    >
      <img
        class="tour-card-image"
        src="${escapeHtml(heroImage)}"
        alt="${escapeHtml(title)}"
        loading="lazy"
      >
    </a>

    <div class="tour-card-content">
      <h2 class="tour-card-title">
        ${escapeHtml(title)}
      </h2>

      <div class="tour-card-facts">
        <span>${escapeHtml(distance)}</span>
        <span>${escapeHtml(duration)}</span>
        <span>${escapeHtml(difficulty)}</span>
      </div>

      <p class="tour-card-description">
        ${escapeHtml(subtitle)}
      </p>

      ${
        surface
          ? `
            <p class="tour-card-surface">
              <strong>Wege:</strong>
              ${escapeHtml(surface)}
            </p>
          `
          : ""
      }

      <a
        class="tour-card-button"
        href="tour.html?route=${encodeURIComponent(tour.routeId)}"
      >
        Tour ansehen
        <span aria-hidden="true">→</span>
      </a>
    </div>
  `;

  return article;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
