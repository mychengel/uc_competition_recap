import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import ChartTooltip from '../ChartTooltip.jsx';
import EmptyChartState from '../EmptyChartState.jsx';
import { INK } from '../../../lib/chartTheme.js';

const MAX_LABEL_CHARS = 22;

function truncateLabel(value) {
  const str = String(value);
  return str.length > MAX_LABEL_CHARS ? `${str.slice(0, MAX_LABEL_CHARS - 1)}…` : str;
}

export default function RankedBarChart({ data, color = '#eb6834', height = 300 }) {
  if (!data || data.length === 0) return <EmptyChartState />;
  const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 12);
  const rowHeight = 32;
  const chartHeight = Math.max(height, sorted.length * rowHeight + 20);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 4 }} barCategoryGap={10}>
        <CartesianGrid horizontal={false} stroke={INK.gridline} />
        <XAxis type="number" tick={{ fontSize: 11, fill: INK.muted }} axisLine={{ stroke: INK.baseline }} tickLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={150}
          tickFormatter={truncateLabel}
          interval={0}
          tick={{ fontSize: 11, fill: INK.secondary }}
          axisLine={{ stroke: INK.baseline }}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(235,104,52,0.06)' }} />
        <Bar dataKey="value" name="Jumlah" radius={[0, 4, 4, 0]} maxBarSize={18} isAnimationActive animationDuration={700}>
          {sorted.map((_, i) => (
            <Cell key={i} fill={color} />
          ))}
          <LabelList dataKey="value" position="right" style={{ fontSize: 11, fontWeight: 700, fill: INK.primary }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
