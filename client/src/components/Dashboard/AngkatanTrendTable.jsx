export default function AngkatanTrendTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-sm text-[var(--text-muted)]">
        Tidak ada data untuk filter ini
      </div>
    );
  }

  return (
    <div className="scrollbar-thin overflow-x-auto rounded-xl border border-[var(--border-hairline)]">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="bg-[var(--surface-card-alt)]">
            <th className="whitespace-nowrap px-3 py-2.5 font-bold text-[var(--text-secondary)]">Angkatan</th>
            <th className="whitespace-nowrap px-3 py-2.5 text-right font-bold text-[var(--text-secondary)]">Total Prestasi</th>
            <th className="whitespace-nowrap px-3 py-2.5 text-right font-bold text-[var(--text-secondary)]">Mahasiswa Terlibat</th>
            <th className="whitespace-nowrap px-3 py-2.5 text-right font-bold text-[var(--text-secondary)]">Credit Point</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.name}
              className={`border-t border-[var(--border-hairline)] ${i % 2 === 1 ? 'bg-[var(--surface-card-alt)]/50' : ''}`}
            >
              <td className="whitespace-nowrap px-3 py-2 font-semibold text-[var(--text-primary)]">{row.name}</td>
              <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-[var(--text-primary)]">{row.value}</td>
              <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-[var(--text-secondary)]">{row.mahasiswa}</td>
              <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-[var(--text-secondary)]">{row.creditPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
