import { motion } from 'framer-motion';

function Delta({ from, to }) {
  if (from === undefined || to === undefined || from === to) return null;
  const pct = from === 0 ? 100 : ((to - from) / from) * 100;
  const up = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
        up ? 'bg-[var(--status-good)]/10 text-[var(--status-good)]' : 'bg-[var(--status-critical)]/10 text-[var(--status-critical)]'
      }`}
    >
      <svg viewBox="0 0 10 10" fill="none" className={`h-2.5 w-2.5 ${up ? '' : 'rotate-180'}`}>
        <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

function Tile({ icon, label, value, sub, delta, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="flex flex-col gap-2 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          {icon}
        </span>
        {delta}
      </div>
      <div>
        <p className="text-2xl font-extrabold tabular-nums text-[var(--text-primary)]">{value}</p>
        <p className="text-xs font-semibold text-[var(--text-secondary)]">{label}</p>
        {sub && <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function KpiCards({ metrics }) {
  const {
    totalPrestasi,
    totalCreditPoints,
    totalMahasiswaTerlibat,
    totalPartisipasi,
    teamAchievements,
    winningAchievements,
    winRate,
    byYear,
  } = metrics;
  const first = byYear[0];
  const last = byYear[byYear.length - 1];
  const hasTrend = byYear.length >= 2;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Tile
        index={0}
        icon={
          <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
            <path d="M10 2 4 5v5c0 4 2.5 6.7 6 8 3.5-1.3 6-4 6-8V5l-6-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7.5 10 9.2 11.7 12.8 8.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        label="Total Prestasi (unik)"
        value={totalPrestasi.toLocaleString('id-ID')}
        sub="Dihitung 1x per Proposal No"
        delta={hasTrend ? <Delta from={first.value} to={last.value} /> : null}
      />
      <Tile
        index={1}
        icon={
          <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
            <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3.5 17c.7-3.5 3.4-5.5 6.5-5.5s5.8 2 6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        }
        label="Mahasiswa Terlibat"
        value={totalMahasiswaTerlibat.toLocaleString('id-ID')}
        sub={`${totalPartisipasi.toLocaleString('id-ID')} partisipasi (termasuk tim)`}
        delta={hasTrend ? <Delta from={first.mahasiswa} to={last.mahasiswa} /> : null}
      />
      <Tile
        index={2}
        icon={
          <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
            <path d="M10 2 4 5v5c0 4 2.5 6.7 6 8 3.5-1.3 6-4 6-8V5l-6-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10 6.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        label="Total Credit Point"
        value={totalCreditPoints.toLocaleString('id-ID')}
        sub="Akumulasi dari prestasi unik"
        delta={hasTrend ? <Delta from={first.creditPoints} to={last.creditPoints} /> : null}
      />
      <Tile
        index={3}
        icon={
          <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
            <path d="M6 3h8l-1 6.5L10 12l-3-2.5L6 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8.5 14h3M10 12v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6 4.5H3.5c0 2 1 3.5 2.8 3.9M14 4.5h2.5c0 2-1 3.5-2.8 3.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        }
        label="Win Rate Juara"
        value={`${winRate.toFixed(0)}%`}
        sub={`${winningAchievements.toLocaleString('id-ID')} dari ${totalPrestasi.toLocaleString('id-ID')} prestasi`}
        delta={hasTrend ? <Delta from={first.winRate} to={last.winRate} /> : null}
      />
      <Tile
        index={4}
        icon={
          <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
            <circle cx="6.5" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="13.5" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2.5 16c.4-2.8 2-4.5 4-4.5s3.6 1.7 4 4.5M9.5 16c.4-2.8 2-4.5 4-4.5s3.6 1.7 4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        }
        label="Prestasi Tim"
        value={teamAchievements.toLocaleString('id-ID')}
        sub={`${totalPrestasi ? ((teamAchievements / totalPrestasi) * 100).toFixed(0) : 0}% dari total prestasi`}
      />
    </div>
  );
}
