// Matches the --series-* / --status-* custom properties in index.css (light mode).
// Kept as plain hex here because SVG fill attributes render more reliably than
// var() across chart libraries.
export const SERIES = [
  '#eb6834', // orange (brand)
  '#2a78d6', // blue
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#4a3aa7', // violet
  '#e87ba4', // magenta
  '#008300', // green
  '#e34948', // red
];

export const STATUS = {
  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
};

export const INK = {
  primary: '#14120f',
  secondary: '#52514e',
  muted: '#898781',
  gridline: '#e1e0d9',
  baseline: '#c3c2b7',
};

export function seriesColor(index) {
  return SERIES[index % SERIES.length];
}
