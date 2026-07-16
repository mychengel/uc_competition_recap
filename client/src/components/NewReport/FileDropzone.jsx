import { useRef, useState } from 'react';

export default function FileDropzone({ label, sublabel, file, onChange }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  function validateAndSet(f) {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.xlsx')) {
      setError('File harus berformat .xlsx');
      return;
    }
    setError('');
    onChange(f);
  }

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-sm font-semibold text-[var(--text-primary)]">{label}</label>
        {sublabel && <span className="text-xs font-medium text-brand-600">{sublabel}</span>}
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          validateAndSet(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3.5 transition-colors ${
          dragOver
            ? 'border-brand-400 bg-brand-50'
            : file
              ? 'border-brand-300 bg-brand-50/60'
              : 'border-[var(--gridline)] bg-[var(--surface-card-alt)] hover:border-brand-300'
        }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            file ? 'bg-brand-500 text-white' : 'bg-ink-200 text-ink-600'
          }`}
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
            {file ? (
              <path d="M5 10.5 8.5 14 15 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M10 4v9m0-9 3.5 3.5M10 4 6.5 7.5M4 14v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          {file ? (
            <>
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{file.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{(file.size / 1024).toFixed(0)} KB &middot; klik untuk ganti file</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Klik atau seret file .xlsx ke sini</p>
              <p className="text-xs text-[var(--text-muted)]">Format: Excel (.xlsx) sesuai template</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-[var(--status-critical)]">{error}</p>}
    </div>
  );
}
