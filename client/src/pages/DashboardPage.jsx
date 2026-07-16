import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchReportDashboard, extractErrorMessage } from '../api/client.js';
import {
  buildFilterOptions,
  emptyFilters,
  filterRows,
  computeMetrics,
  computeInsights,
} from '../lib/aggregate.js';
import { SCOPE_DEFS } from '../lib/scopes.js';
import FilterBar from '../components/Dashboard/FilterBar.jsx';
import KpiCards from '../components/Dashboard/KpiCards.jsx';
import InsightsPanel from '../components/Dashboard/InsightsPanel.jsx';
import ChartCard from '../components/Dashboard/ChartCard.jsx';
import DataTable from '../components/Dashboard/DataTable.jsx';
import RankedBarChart from '../components/Dashboard/charts/RankedBarChart.jsx';
import CategoryPie from '../components/Dashboard/charts/CategoryPie.jsx';
import TrendLineChart from '../components/Dashboard/charts/TrendLineChart.jsx';
import CreditBarChart from '../components/Dashboard/charts/CreditBarChart.jsx';
import StackedYearBarChart from '../components/Dashboard/charts/StackedYearBarChart.jsx';

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(emptyFilters());

  useEffect(() => {
    setPayload(null);
    setError('');
    setFilters(emptyFilters());
    fetchReportDashboard(id)
      .then(setPayload)
      .catch((err) => setError(extractErrorMessage(err)));
  }, [id]);

  const filterOptions = useMemo(() => (payload ? buildFilterOptions(payload.rows) : null), [payload]);
  const filteredRows = useMemo(() => (payload ? filterRows(payload.rows, filters) : []), [payload, filters]);
  const metrics = useMemo(() => computeMetrics(filteredRows), [filteredRows]);
  const insights = useMemo(() => computeInsights(metrics), [metrics]);

  function handleFilterChange(key, next) {
    setFilters((prev) => ({ ...prev, [key]: next }));
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-lg font-bold text-[var(--text-primary)]">Gagal memuat dashboard</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{error}</p>
        <button
          onClick={() => navigate('/history')}
          className="mt-6 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600"
        >
          Kembali ke Histori
        </button>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        <div className="h-9 w-1/3 animate-pulse rounded-lg bg-ink-100" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-ink-100" />
          ))}
        </div>
      </div>
    );
  }

  const { report } = payload;

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
            {SCOPE_DEFS[report.scopeType]?.label ?? report.scopeType}
          </p>
          <h1 className="mt-0.5 text-2xl font-extrabold text-[var(--text-primary)] sm:text-3xl">{report.title}</h1>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Dibuat {formatDate(report.createdAt)} &middot; {report.files.map((f) => f.academicYearLabel).join(', ')}
          </p>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="rounded-xl border border-[var(--gridline)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-ink-100"
        >
          Lihat Histori Lain
        </button>
      </motion.div>

      <div className="mt-6">
        <FilterBar options={filterOptions} filters={filters} onChange={handleFilterChange} onReset={() => setFilters(emptyFilters())} />
      </div>

      <div className="mt-6">
        <KpiCards metrics={metrics} />
      </div>

      {insights.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">Insights</h2>
          <InsightsPanel insights={insights} />
        </div>
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Tren Prestasi & Mahasiswa Terlibat" subtitle="Perbandingan antar tahun ajaran">
          <TrendLineChart
            data={metrics.byYear}
            lines={[
              { dataKey: 'value', name: 'Prestasi' },
              { dataKey: 'mahasiswa', name: 'Mahasiswa Terlibat' },
            ]}
          />
        </ChartCard>
        <ChartCard title="Tren Credit Point" subtitle="Akumulasi credit point per tahun ajaran" delay={0.05}>
          <CreditBarChart data={metrics.byYear} />
        </ChartCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Komposisi Scope Kompetisi per Tahun" subtitle="Internasional, nasional, regional, dst." delay={0.05}>
          <StackedYearBarChart data={metrics.byYearScope} />
        </ChartCard>
        <ChartCard title="Distribusi Scope Kompetisi" subtitle="Total pada cakupan filter saat ini" delay={0.1}>
          <CategoryPie data={metrics.byScope} />
        </ChartCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Prestasi per Program Studi" subtitle="Diurutkan dari yang terbanyak" delay={0.05}>
          <RankedBarChart data={metrics.byMajor} />
        </ChartCard>
        <ChartCard title="Prestasi per Fakultas" subtitle="Diurutkan dari yang terbanyak" delay={0.1}>
          <RankedBarChart data={metrics.byFaculty} color="#d95926" />
        </ChartCard>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ChartCard title="Kategori Pencapaian" subtitle="Juara, finalis, dsb.">
          <CategoryPie data={metrics.byCategory} height={240} />
        </ChartCard>
        <ChartCard title="Bentuk Kompetisi" subtitle="Individu vs. tim" delay={0.05}>
          <CategoryPie data={metrics.byBentuk} height={240} />
        </ChartCard>
        <ChartCard title="Status" subtitle="Status akhir prestasi" delay={0.1}>
          <CategoryPie data={metrics.byStatus} height={240} />
        </ChartCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Penyelenggara Kompetisi Teratas" subtitle="Top 8 berdasarkan jumlah prestasi" delay={0.05}>
          <RankedBarChart data={metrics.byOrganizer} color="#4a3aa7" height={260} />
        </ChartCard>
        <ChartCard title="Kategori Simkatmawa" subtitle="Distribusi kategori pelaporan Simkatmawa" delay={0.1}>
          <CategoryPie data={metrics.byKategoriSimkatmawa} height={260} />
        </ChartCard>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">
          Data Prestasi ({metrics.totalPrestasi} unik)
        </h2>
        <div className="rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-4 shadow-sm">
          <DataTable achievements={metrics.achievements} />
        </div>
      </div>
    </div>
  );
}
