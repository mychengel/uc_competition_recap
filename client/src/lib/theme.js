const STORAGE_KEY = 'uc-recap-theme';

export function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY); // 'light' | 'dark' | null (null = follow system)
}

function getSystemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getEffectiveTheme() {
  return getStoredTheme() || getSystemTheme();
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

/** Call once as early as possible to avoid a flash of the wrong theme. */
export function initTheme() {
  const stored = getStoredTheme();
  if (stored) document.documentElement.setAttribute('data-theme', stored);
}
