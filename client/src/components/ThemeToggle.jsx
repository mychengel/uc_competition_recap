import { useEffect, useState } from 'react';
import { getEffectiveTheme, applyTheme } from '../lib/theme.js';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getEffectiveTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={isDark ? 'Mode terang' : 'Mode gelap'}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--gridline)] bg-[var(--surface-card)] text-[var(--text-secondary)] transition-colors hover:border-brand-300 hover:text-[var(--accent-text)]"
    >
      {isDark ? (
        <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
          <path
            d="M10 3.5v1.5M10 15v1.5M16.5 10H15M5 10H3.5M14.6 14.6l-1.1-1.1M6.5 6.5 5.4 5.4M14.6 5.4l-1.1 1.1M6.5 13.5l-1.1 1.1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
          <path
            d="M16.5 12.3A6.8 6.8 0 0 1 7.7 3.5a6.8 6.8 0 1 0 8.8 8.8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
