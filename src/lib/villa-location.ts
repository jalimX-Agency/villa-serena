/**
 * Where the villa is, for every map, map link and the structured data (annex of 10 Nov 2026, M18).
 * A text search ("km 17") lets Google guess, and from France or Germany it guessed wrong; GPS
 * coordinates open the same spot for everyone. Fill lat/lng (and placeId if the villa has a
 * Google Business Profile) as soon as the villa sends them.
 */
export const VILLA_LOCATION = {
  lat: null as number | null, // e.g. 31.5xxxxx (portal of the villa)
  lng: null as number | null, // e.g. -7.9xxxxx
  placeId: "", // Google Place ID, if any
  zoom: 14,
  /** Used only until the coordinates are known. */
  fallbackQuery: "Route de l'Ourika km 17, Sidi Bouzguia, Marrakech",
};

const { lat, lng, placeId, zoom, fallbackQuery } = VILLA_LOCATION;
const hasCoords = lat !== null && lng !== null;
const query = hasCoords ? `${lat},${lng}` : encodeURIComponent(fallbackQuery);

/** Embedded map (shown after cookie consent), no API key needed. */
export const mapEmbedUrl = (lang: string) =>
  `https://www.google.com/maps?q=${query}&z=${hasCoords ? zoom : 13}&hl=${lang === "en" ? "en" : "fr"}&output=embed`;

/** « Ouvrir dans Google Maps ». */
export const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${query}` + (placeId ? `&query_place_id=${placeId}` : "");

/** « Itinéraire » (handy on mobile). */
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}` + (placeId ? `&destination_place_id=${placeId}` : "");

/** schema.org GeoCoordinates, only once the coordinates are known. */
export const geoSchema = hasCoords ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng } } : {};
