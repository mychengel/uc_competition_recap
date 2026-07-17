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

// Ordinal orange ramp for TA-3 -> TA (oldest -> most recent), used wherever
// academic years are compared as segments of the same bar. Validated with
// scripts/validate_palette.js --ordinal against both light and dark surfaces.
export const YEAR_SEQUENTIAL = {
  'TA-3': '#e0954f',
  'TA-2': '#d17a2e',
  'TA-1': '#b35a12',
  TA: '#7c3a0c',
};

export function yearColor(yearLabel) {
  return YEAR_SEQUENTIAL[yearLabel] || INK.muted;
}

const SEQUENTIAL_LIGHT = [224, 149, 79]; // #e0954f — validated ordinal ramp light end
const SEQUENTIAL_DARK = [124, 58, 12]; // #7c3a0c — validated ordinal ramp dark end

function toHex(n) {
  return Math.round(n).toString(16).padStart(2, '0');
}

/** Generates an N-step light->dark orange ramp between the same validated
 *  endpoints as YEAR_SEQUENTIAL, for ordered dimensions whose segment count
 *  isn't fixed to 4 (e.g. student cohorts/angkatan). Index 0 = oldest/lightest. */
export function sequentialOrangeScale(n) {
  if (n <= 1) return [yearColor('TA')];
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const rgb = SEQUENTIAL_LIGHT.map((c, idx) => c + (SEQUENTIAL_DARK[idx] - c) * t);
    return `#${rgb.map(toHex).join('')}`;
  });
}

/** Returns a `colorForSegment(segment, index, total)`-compatible function
 *  for a known, ordered list of segment keys (e.g. sorted angkatan years). */
export function orderedSegmentColorScale(orderedSegments) {
  const scale = sequentialOrangeScale(orderedSegments.length);
  const indexOf = new Map(orderedSegments.map((s, i) => [s, i]));
  return (segment) => scale[indexOf.get(segment) ?? 0];
}

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
