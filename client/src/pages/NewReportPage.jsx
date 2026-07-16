import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScopeCards from '../components/NewReport/ScopeCards.jsx';
import FileDropzone from '../components/NewReport/FileDropzone.jsx';
import AuthCodeModal from '../components/NewReport/AuthCodeModal.jsx';
import { SCOPE_DEFS, OFFSET_LABEL, OFFSET_FIELD } from '../lib/scopes.js';
import { baseAcademicYear, labelForOffset } from '../lib/academicYear.js';
import { createReport, extractErrorMessage } from '../api/client.js';

export default function NewReportPage() {
  const navigate = useNavigate();
  const [scopeType, setScopeType] = useState('TA');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState({}); // offset -> File
  const [formError, setFormError] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const baseYear = useMemo(() => baseAcademicYear(), []);
  const offsets = SCOPE_DEFS[scopeType].offsets;

  function handleScopeChange(next) {
    setScopeType(next);
    setFiles({});
    setFormError('');
  }

  function handleOpenAuth(e) {
    e.preventDefault();
    setFormError('');
    if (!title.trim()) {
      setFormError('Judul report wajib diisi');
      return;
    }
    const missing = offsets.filter((o) => !files[o]);
    if (missing.length) {
      setFormError(
        `File untuk ${missing.map((o) => OFFSET_LABEL[o]).join(', ')} belum diupload`
      );
      return;
    }
    setAuthError('');
    setAuthOpen(true);
  }

  async function handleConfirmAuth(code) {
    setSubmitting(true);
    setAuthError('');
    try {
      const filesByField = {};
      offsets.forEach((o) => {
        filesByField[OFFSET_FIELD[o]] = files[o];
      });
      const { report } = await createReport({
        title: title.trim(),
        scopeType,
        authCode: code,
        filesByField,
      });
      setAuthOpen(false);
      navigate(`/dashboard/${report.id}`);
    } catch (err) {
      setAuthError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">Tambah Report Baru</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Pilih cakupan perbandingan tahun ajaran, lalu upload data prestasi mahasiswa (.xlsx).
        </p>
      </motion.div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">
          1. Cakupan Perbandingan
        </h2>
        <ScopeCards value={scopeType} onChange={handleScopeChange} />
      </section>

      <motion.section
        key={scopeType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-6 shadow-sm"
      >
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">
          2. Isi Form
        </h2>

        <form onSubmit={handleOpenAuth} className="flex flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--text-primary)]">
              Judul Report
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Contoh: "Rekap Prestasi Mahasiswa Semester Genap 2026"'
              className="w-full rounded-xl border border-[var(--gridline)] bg-[var(--surface-card-alt)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {offsets.map((o) => (
              <FileDropzone
                key={o}
                label={`Data ${OFFSET_LABEL[o]}`}
                sublabel={labelForOffset(baseYear, o)}
                file={files[o]}
                onChange={(f) => setFiles((prev) => ({ ...prev, [o]: f }))}
              />
            ))}
          </div>

          {formError && (
            <div className="rounded-xl bg-[var(--status-critical)]/10 px-4 py-2.5 text-sm font-medium text-[var(--status-critical)]">
              {formError}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-brand-500/30 transition-colors hover:bg-brand-600"
            >
              Buat
            </button>
          </div>
        </form>
      </motion.section>

      <AuthCodeModal
        open={authOpen}
        submitting={submitting}
        error={authError}
        onCancel={() => !submitting && setAuthOpen(false)}
        onSubmit={handleConfirmAuth}
      />
    </div>
  );
}
