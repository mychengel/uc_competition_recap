import { useMemo, useState } from 'react';

const COLUMNS = [
  { key: 'proposalNo', label: 'Proposal No', width: 'min-w-[110px]' },
  { key: 'year', label: 'TA', width: 'min-w-[70px]' },
  { key: 'periode', label: 'Periode', width: 'min-w-[110px]' },
  { key: 'competitionName', label: 'Kompetisi', width: 'min-w-[220px]' },
  { key: 'majors', label: 'Prodi', width: 'min-w-[160px]', render: (a) => a.majors.join(', ') },
  { key: 'scope', label: 'Scope', width: 'min-w-[100px]' },
  { key: 'status', label: 'Tingkat Pencapaian', width: 'min-w-[140px]' },
  { key: 'participant', label: 'Partisipasi', width: 'min-w-[90px]' },
  { key: 'bentuk', label: 'Moda', width: 'min-w-[80px]' },
  { key: 'participantsCount', label: 'Peserta', width: 'min-w-[80px]', align: 'right' },
  { key: 'creditPoint', label: 'Credit Point', width: 'min-w-[100px]', align: 'right' },
  {
    key: 'certificateUrl',
    label: 'Sertifikat',
    width: 'min-w-[80px]',
    sortable: false,
    render: (a) =>
      a.certificateUrl ? (
        <a
          href={a.certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 font-semibold text-[var(--accent-text)] hover:underline"
        >
          Lihat
          <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
            <path d="M4 3h5v5M9 3 3 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      ) : (
        <span className="text-[var(--text-muted)]">—</span>
      ),
  },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function searchHaystack(a) {
  return [
    a.proposalNo,
    a.competitionName,
    a.competitionOrganizer,
    a.majors.join(' '),
    a.faculties.join(' '),
    a.scope,
    a.status,
    a.category,
    a.cabang,
    a.kategoriSimkatmawa,
    a.represent,
    ...a.rows.map((r) => r.namaMahasiswa),
    ...a.rows.map((r) => r.nim),
  ]
    .join(' ')
    .toLowerCase();
}

export default function DataTable({ achievements }) {
  const [sort, setSort] = useState({ key: 'year', dir: 'desc' });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const searched = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return achievements;
    return achievements.filter((a) => searchHaystack(a).includes(term));
  }, [achievements, search]);

  const sorted = useMemo(() => {
    const list = [...searched];
    list.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), 'id');
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [searched, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageSafe = Math.min(page, totalPages - 1);
  const pageRows = sorted.slice(pageSafe * pageSize, pageSafe * pageSize + pageSize);

  function toggleSort(key) {
    setPage(0);
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  }

  if (achievements.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-[var(--text-muted)]">
        Tidak ada data untuk filter ini
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full max-w-xs">
          <svg viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="m17 17-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Cari proposal, kompetisi, prodi, mahasiswa…"
            className="w-full rounded-lg border border-[var(--gridline)] bg-[var(--surface-card-alt)] py-1.5 pl-9 pr-3 text-xs text-[var(--text-primary)] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
          Tampilkan
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="rounded-lg border border-[var(--gridline)] bg-[var(--surface-card-alt)] px-2 py-1.5 text-xs font-semibold text-[var(--text-primary)] outline-none focus:border-brand-400"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          baris
        </label>
      </div>

      {sorted.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-[var(--text-muted)]">
          Tidak ada hasil untuk pencarian "{search}"
        </div>
      ) : (
        <div className="scrollbar-thin overflow-x-auto rounded-xl border border-[var(--border-hairline)]">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[var(--surface-card-alt)]">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && toggleSort(col.key)}
                    className={`select-none whitespace-nowrap px-3 py-2.5 font-bold text-[var(--text-secondary)] ${col.sortable === false ? '' : 'cursor-pointer'} ${col.width} ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sort.key === col.key && (
                        <svg viewBox="0 0 10 10" fill="none" className={`h-2.5 w-2.5 ${sort.dir === 'desc' ? 'rotate-180' : ''}`}>
                          <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((a, i) => (
                <tr
                  key={a.key}
                  className={`border-t border-[var(--border-hairline)] ${i % 2 === 1 ? 'bg-[var(--surface-card-alt)]/50' : ''} hover:bg-[var(--accent-soft-bg)]/60`}
                >
                  {COLUMNS.map((col) => (
                    <td key={col.key} className={`whitespace-nowrap px-3 py-2 tabular-nums text-[var(--text-primary)] ${col.align === 'right' ? 'text-right' : ''}`}>
                      {col.render ? col.render(a) : String(a[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
        <span>
          {sorted.length === 0
            ? `0 dari ${achievements.length} prestasi unik`
            : `Menampilkan ${pageSafe * pageSize + 1}–${Math.min((pageSafe + 1) * pageSize, sorted.length)} dari ${sorted.length}${
                search ? ` (disaring dari ${achievements.length})` : ''
              } prestasi unik`}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={pageSafe === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-[var(--gridline)] px-2.5 py-1 font-semibold text-[var(--text-secondary)] disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <span className="px-1 font-semibold">
            {pageSafe + 1}/{totalPages}
          </span>
          <button
            disabled={pageSafe >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded-lg border border-[var(--gridline)] px-2.5 py-1 font-semibold text-[var(--text-secondary)] disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
