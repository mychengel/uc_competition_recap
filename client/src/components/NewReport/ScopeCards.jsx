import { motion } from 'framer-motion';
import { SCOPE_DEFS } from '../../lib/scopes.js';
import { baseAcademicYear, labelForOffset } from '../../lib/academicYear.js';

const ORDER = ['TA', 'TA_TA-1', 'TA_TA-2', 'TA_TA-3'];

export default function ScopeCards({ value, onChange }) {
  const baseYear = baseAcademicYear();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ORDER.map((key, i) => {
        const def = SCOPE_DEFS[key];
        const active = value === key;
        const years = def.offsets.map((o) => labelForOffset(baseYear, o));
        return (
          <motion.button
            key={key}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            onClick={() => onChange(key)}
            className={`flex flex-col gap-3 rounded-2xl border-2 p-5 text-left transition-all ${
              active
                ? 'border-brand-500 bg-[var(--accent-soft-bg)] shadow-md shadow-brand-500/15'
                : 'border-[var(--border-hairline)] bg-[var(--surface-card)] hover:border-brand-300 hover:-translate-y-0.5'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${
                  active ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-600'
                }`}
              >
                {def.offsets.length}
              </span>
              {active && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
                  <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
                    <path d="M5 10.5 8.5 14 15 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">{def.label}</p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{def.description}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {years.map((y) => (
                <span
                  key={y}
                  className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-700"
                >
                  {y}
                </span>
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
