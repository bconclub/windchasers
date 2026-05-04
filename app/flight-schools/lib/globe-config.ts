export const GLOBE_STYLES = [
  { key: "blue-marble", label: "Blue Marble", url: "/globe/earth-blue-marble.jpg" },
  { key: "day",         label: "Day",         url: "/globe/earth-day.jpg" },
  { key: "night",       label: "Night",       url: "/globe/earth-night.jpg" },
  { key: "dark",        label: "Dark",        url: "/globe/earth-dark.jpg" },
] as const;

export type GlobeStyleKey = (typeof GLOBE_STYLES)[number]["key"];

// Flat map styles — independent from globe style
export const MAP_STYLES = [
  {
    key: "satellite",
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA",
    subdomains: false,
  },
  {
    key: "dark",
    label: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    attribution: "&copy; <a href='https://carto.com/attributions'>CARTO</a>",
    subdomains: true,
  },
  {
    key: "terrain",
    label: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; <a href='https://opentopomap.org'>OpenTopoMap</a>",
    subdomains: true,
  },
  {
    key: "light",
    label: "Light",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    attribution: "&copy; <a href='https://carto.com/attributions'>CARTO</a>",
    subdomains: true,
  },
] as const;

export type MapStyleKey = (typeof MAP_STYLES)[number]["key"];
