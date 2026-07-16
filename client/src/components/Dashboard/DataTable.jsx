import { useMemo, useState } from 'react';

const COLUMNS = [
  { key: 'proposalNo', label: 'Proposal No', width: 'min-w-[110px]' },
  { key: 'year', label: 'TA', width: 'min-w-[70px]' },
  { key: 'competitionName', label: 'Kompetisi', width: 'min-w-[220px]' },
  { key: 'majors', label: 'Prodi', width: 'min-w-[160px]', render: (a) => a.majors.join(', ') },
  { key: 'scope', label: 'Scope', width: 'min-w-[100px]' },
  { key: 'category', label: 'Kategori', width: 'min-w-[130px]' },
  { key: 'bentuk', label: 'Bentuk', width: 'min-w-[90px]' },
  { key: 'status', label: 'Status', width: 'min-w-[100px]' },
  { key: 'participantsCount', label: 'Peserta', width: 'min-w-[80px]', align: 'right' },
  { key: 'creditPoint', label: 'Credit Point', width: 'min-w-[100px]', align: 'right' },
];

const PAGE_SIZE = 10;

export default function DataTable({ achievements }) {
  const [sort, setSort] = useState({ key: 'year', dir: 'desc' });
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const list = [...achievements];
    list.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), 'id');
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [achievements, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages - 1);
  const pageRows = sorted.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);

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
      <div className="scrollbar-thin overflow-x-auto rounded-xl border border-[var(--border-hairline)]">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-[var(--surface-card-alt)]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`cursor-pointer select-none whitespace-nowrap px-3 py-2.5 font-bold text-[var(--text-secondary)] ${col.width} ${col.align === 'right' ? 'text-right' : 'text-left'}`}
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
                className={`border-t border-[var(--border-hairline)] ${i % 2 === 1 ? 'bg-[var(--surface-card-alt)]/50' : ''} hover:bg-brand-50/60`}
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

      <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>
          Menampilkan {pageSafe * PAGE_SIZE + 1}–{Math.min((pageSafe + 1) * PAGE_SIZE, sorted.length)} dari {sorted.length} prestasi unik
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
