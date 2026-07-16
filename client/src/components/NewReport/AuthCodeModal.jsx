import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AuthCodeModal({ open, submitting, error, onCancel, onSubmit }) {
  const [code, setCode] = useState('');

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 px-4 backdrop-blur-sm"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-2xl bg-[var(--surface-card)] p-6 shadow-2xl"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path d="M10 2 4 5v5c0 4 2.5 6.7 6 8 3.5-1.3 6-4 6-8V5l-6-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M10 9.5v3M10 7.2h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Kode Autentikasi</h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Masukkan kode autentikasi untuk mengonfirmasi pembuatan report baru.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(code);
            }}
          >
            <input
              autoFocus
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Kode autentikasi"
              className="mt-4 w-full rounded-xl border border-[var(--gridline)] bg-[var(--surface-card-alt)] px-4 py-2.5 text-sm font-semibold tracking-widest text-[var(--text-primary)] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            {error && <p className="mt-2 text-xs font-medium text-[var(--status-critical)]">{error}</p>}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-xl border border-[var(--gridline)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-ink-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting || !code}
                className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Membuat…' : 'Buat'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
