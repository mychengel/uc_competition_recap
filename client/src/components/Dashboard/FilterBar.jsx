import MultiSelectDropdown from './MultiSelectDropdown.jsx';

const DIMENSIONS = [
  { key: 'years', label: 'Tahun Ajaran' },
  { key: 'periodes', label: 'Periode' },
  { key: 'faculties', label: 'Fakultas' },
  { key: 'majors', label: 'Prodi' },
  { key: 'scopes', label: 'Scope' },
  { key: 'statuses', label: 'Tingkat Pencapaian' },
  { key: 'categories', label: 'Tipe Kegiatan' },
  { key: 'bentuks', label: 'Moda Pelaksanaan' },
  { key: 'participants', label: 'Bentuk Partisipasi' },
  { key: 'representations', label: 'Represent' },
  { key: 'cabangs', label: 'Cabang' },
  { key: 'kategoriSimkatmawas', label: 'Kategori Simkatmawa' },
];

export default function FilterBar({ options, filters, onChange, onReset }) {
  const activeCount = Object.values(filters).reduce((s, arr) => s + arr.length, 0);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-3 shadow-sm">
      <span className="mr-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
          <path d="M2 3.5h12M4.5 8h7M7 12.5h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Filter
      </span>
      {DIMENSIONS.map((d) => (
        <MultiSelectDropdown
          key={d.key}
          label={d.label}
          options={options[d.key] || []}
          selected={filters[d.key] || []}
          onChange={(next) => onChange(d.key, next)}
        />
      ))}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--status-critical)]"
        >
          Reset semua ({activeCount})
        </button>
      )}
    </div>
  );
}
