export const GLOBE_STYLES = [
  { key: "blue-marble", label: "Blue Marble", url: "/globe/earth-blue-marble.jpg" },
  { key: "day",         label: "Day",         url: "/globe/earth-day.jpg" },
  { key: "night",       label: "Night",       url: "/globe/earth-night.jpg" },
  { key: "dark",        label: "Dark",        url: "/globe/earth-dark.jpg" },
] as const;

export type GlobeStyleKey = (typeof GLOBE_STYLES)[number]["key"];

// CartoDB tiles have full-world coverage at every zoom level (no grey-box artifact).
// Esri satellite looks great but breaks at low zoom — CartoDB is the reliable choice.
export const MAP_TILES: Record<GlobeStyleKey, { url: string; attribution: string }> = {
  "blue-marble": {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  "day": {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  "night": {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  "dark": {
    url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};
