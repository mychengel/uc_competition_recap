import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10">
          <path
            d="M4 19V6a1 1 0 0 1 1-1h9l6 6v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M14 5v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M8 13h8M8 16.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
        className="mt-6 text-2xl font-bold text-[var(--text-primary)] sm:text-3xl"
      >
        Belum ada dashboard yang ditampilkan
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className="mt-3 max-w-xl text-sm text-[var(--text-secondary)] sm:text-base"
      >
        Pilih salah satu untuk mulai: buat report prestasi mahasiswa baru dari file Excel,
        atau buka kembali salah satu report yang pernah dibuat sebelumnya.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
        className="mt-10 grid w-full gap-4 sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={() => navigate('/new')}
          className="group flex flex-col items-start gap-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white transition-transform group-hover:scale-105">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-base font-bold text-[var(--text-primary)]">Tambah Report Baru</span>
          <span className="text-sm text-[var(--text-secondary)]">
            Upload data prestasi mahasiswa (.xlsx) untuk TA saat ini, atau bandingkan hingga 4 tahun ajaran terakhir.
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/history')}
          className="group flex flex-col items-start gap-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-ink-400 hover:shadow-lg"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-800 text-white transition-transform group-hover:scale-105">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path
                d="M10 5v5l3 2M17 10a7 7 0 1 1-2.05-4.95"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-base font-bold text-[var(--text-primary)]">Histori Report</span>
          <span className="text-sm text-[var(--text-secondary)]">
            Buka kembali dashboard dari report yang sudah pernah dibuat sebelumnya.
          </span>
        </button>
      </motion.div>
    </div>
  );
}
