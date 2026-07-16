import { NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

const linkBase =
  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors';

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-hairline)] bg-[var(--surface-card)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--surface-card)]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm shadow-brand-500/30">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M12 3 2 8l10 5 8-4.2V15h1.5V8L12 3Z"
                fill="currentColor"
              />
              <path
                d="M6 12.2V16c0 1.66 2.69 3 6 3s6-1.34 6-3v-3.8l-6 3.15-6-3.15Z"
                fill="currentColor"
                opacity="0.7"
              />
            </svg>
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="whitespace-nowrap text-sm font-bold text-[var(--text-primary)] sm:text-base">
              Rekap Prestasi
            </span>
            <span className="hidden whitespace-nowrap text-[11px] font-medium text-[var(--text-muted)] sm:block">
              Competition Reporting Dashboard
            </span>
          </span>
        </button>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/new"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                  : 'bg-[var(--accent-soft-bg)] text-[var(--accent-text)] hover:bg-[var(--accent-soft-bg-hover)]'
              }`
            }
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Tambah Report Baru</span>
            <span className="sm:hidden">Tambah</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? 'bg-ink-800 text-white'
                  : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }`
            }
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path
                d="M10 5v5l3 2M17 10a7 7 0 1 1-2.05-4.95"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Histori Report</span>
            <span className="sm:hidden">Histori</span>
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
