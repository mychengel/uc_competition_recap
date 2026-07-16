export default function EmptyChartState({ message = 'Tidak ada data untuk filter ini' }) {
  return (
    <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 text-center">
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-ink-300">
        <path d="M4 19h16M7 19V9M12 19V5M17 19v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <p className="text-xs font-medium text-[var(--text-muted)]">{message}</p>
    </div>
  );
}
