export const GLOBE_STYLES = [
  { key: "blue-marble", label: "Blue Marble", url: "/globe/earth-blue-marble.jpg" },
  { key: "day",         label: "Day",         url: "/globe/earth-day.jpg" },
  { key: "night",       label: "Night",       url: "/globe/earth-night.jpg" },
  { key: "dark",        label: "Dark",        url: "/globe/earth-dark.jpg" },
] as const;

export type GlobeStyleKey = (typeof GLOBE_STYLES)[number]["key"];

// Flat map styles — independent from globe style.
// `labelsUrl` is an optional reference-only tile layer stacked on top of the
// base imagery so country / city names show up. Set to null when the base
// tile already includes labels.
export const MAP_STYLES = [
  {
    key: "satellite",
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA",
    subdomains: false,
    labelsUrl: "https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  },
  {
    key: "dark",
    label: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
    attribution: "&copy; <a href='https://carto.com/attributions'>CARTO</a>",
    subdomains: true,
    labelsUrl: "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
  },
  {
    key: "terrain",
    label: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; <a href='https://opentopomap.org'>OpenTopoMap</a>",
    subdomains: true,
    labelsUrl: null,
  },
  {
    key: "light",
    label: "Light",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    attribution: "&copy; <a href='https://carto.com/attributions'>CARTO</a>",
    subdomains: true,
    labelsUrl: null,
  },
] as const;

export type MapStyleKey = (typeof MAP_STYLES)[number]["key"];
