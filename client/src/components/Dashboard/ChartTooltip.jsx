export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-card)] px-3 py-2 text-xs shadow-lg">
      {label !== undefined && <p className="mb-1 font-bold text-[var(--text-primary)]">{label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color || p.fill }} />
            <span className="text-[var(--text-secondary)]">{p.name}</span>
            <span className="ml-auto font-bold tabular-nums text-[var(--text-primary)]">
              {typeof p.value === 'number' ? p.value.toLocaleString('id-ID') : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
