import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchReportHistory, extractErrorMessage } from '../api/client.js';
import { SCOPE_DEFS } from '../lib/scopes.js';

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportHistory()
      .then(setReports)
      .catch((err) => setError(extractErrorMessage(err)));
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">Histori Report</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Klik salah satu report untuk membuka kembali dashboard-nya.
      </p>

      {error && (
        <div className="mt-6 rounded-xl bg-[var(--status-critical)]/10 px-4 py-3 text-sm font-medium text-[var(--status-critical)]">
          {error}
        </div>
      )}

      {!reports && !error && (
        <div className="mt-8 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-ink-100" />
          ))}
        </div>
      )}

      {reports && reports.length === 0 && (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-[var(--gridline)] bg-[var(--surface-card)] py-16 text-center">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Belum ada report tersimpan</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Buat report pertama Anda melalui menu "Tambah Report Baru".</p>
          <button
            onClick={() => navigate('/new')}
            className="mt-5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
          >
            Tambah Report Baru
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {reports?.map((r, i) => (
          <motion.button
            key={r.id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            onClick={() => navigate(`/dashboard/${r.id}`)}
            className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                  <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 14.5v-9Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 8h6M7 11h6M7 14h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-[var(--text-primary)]">{r.title}</p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  {SCOPE_DEFS[r.scopeType]?.label ?? r.scopeType} &middot; dibuat {formatDate(r.createdAt)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.files.map((f) => (
                    <span key={f.label} className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-700">
                      {f.label} &middot; {f.academicYearLabel} &middot; {f.rowCount} baris
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0 text-ink-400">
              <path d="M7.5 5 13 10l-5.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
