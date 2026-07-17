export default function CrossTabTable({ data, segments, nameLabel = 'Nama', segmentLabel = 'Angkatan' }) {
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
            <th className="whitespace-nowrap px-3 py-2.5 font-bold text-[var(--text-secondary)]">{nameLabel}</th>
            {segments.map((seg) => (
              <th key={seg} className="whitespace-nowrap px-3 py-2.5 text-right font-bold text-[var(--text-secondary)]" title={`${segmentLabel} ${seg}`}>
                {seg}
              </th>
            ))}
            <th className="whitespace-nowrap px-3 py-2.5 text-right font-bold text-[var(--text-secondary)]">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.name}
              className={`border-t border-[var(--border-hairline)] ${i % 2 === 1 ? 'bg-[var(--surface-card-alt)]/50' : ''}`}
            >
              <td className="whitespace-nowrap px-3 py-2 font-semibold text-[var(--text-primary)]">{row.name}</td>
              {segments.map((seg) => (
                <td key={seg} className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-[var(--text-secondary)]">
                  {row[seg] ?? '–'}
                </td>
              ))}
              <td className="whitespace-nowrap px-3 py-2 text-right font-bold tabular-nums text-[var(--text-primary)]">
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
