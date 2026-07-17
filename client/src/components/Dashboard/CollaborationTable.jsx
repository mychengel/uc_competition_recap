import { useMemo, useState } from 'react';

const PAGE_SIZE = 10;

export default function CollaborationTable({ data }) {
  const [sort, setSort] = useState({ key: 'count', dir: 'desc' });
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const list = [...data];
    list.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv), 'id');
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [data, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages - 1);
  const pageRows = sorted.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key) {
    setPage(0);
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }));
  }

  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-center text-sm text-[var(--text-muted)]">
        Belum ada prestasi tim lintas program studi pada cakupan filter ini
      </div>
    );
  }

  const columns = [
    { key: 'name', label: 'Kolaborasi Prodi' },
    { key: 'count', label: 'Total Kolaborasi', align: 'right' },
    { key: 'juara', label: 'Juara', align: 'right' },
    { key: 'winRate', label: 'Win Rate', align: 'right', render: (r) => `${r.winRate.toFixed(0)}%` },
    { key: 'creditPoints', label: 'Credit Point', align: 'right' },
  ];

  return (
    <div>
      <div className="scrollbar-thin overflow-x-auto rounded-xl border border-[var(--border-hairline)]">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-[var(--surface-card-alt)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`cursor-pointer select-none whitespace-nowrap px-3 py-2.5 font-bold text-[var(--text-secondary)] ${col.align === 'right' ? 'text-right' : 'text-left'}`}
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
            {pageRows.map((row, i) => (
              <tr
                key={row.name}
                className={`border-t border-[var(--border-hairline)] ${i % 2 === 1 ? 'bg-[var(--surface-card-alt)]/50' : ''} hover:bg-[var(--accent-soft-bg)]/60`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`whitespace-nowrap px-3 py-2 tabular-nums text-[var(--text-primary)] ${col.align === 'right' ? 'text-right' : ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>
          Menampilkan {pageSafe * PAGE_SIZE + 1}–{Math.min((pageSafe + 1) * PAGE_SIZE, sorted.length)} dari {sorted.length} kombinasi prodi
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
