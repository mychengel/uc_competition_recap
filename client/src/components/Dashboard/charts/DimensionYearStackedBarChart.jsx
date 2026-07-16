import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import ChartTooltip from '../ChartTooltip.jsx';
import EmptyChartState from '../EmptyChartState.jsx';
import { YEAR_ORDER } from '../../../lib/aggregate.js';
import { yearColor, INK } from '../../../lib/chartTheme.js';

const MAX_LABEL_CHARS = 22;

function truncateLabel(value) {
  const str = String(value);
  return str.length > MAX_LABEL_CHARS ? `${str.slice(0, MAX_LABEL_CHARS - 1)}…` : str;
}

/** Horizontal stacked bar: one row per dimension value (major/faculty), one
 *  stack segment per academic year present, using the ordinal orange ramp so
 *  "more recent year" reads as "more saturated" at a glance. */
export default function DimensionYearStackedBarChart({ data, height = 320 }) {
  if (!data || data.length === 0) return <EmptyChartState />;

  const years = YEAR_ORDER.filter((y) => data.some((d) => d[y] !== undefined));
  const rowHeight = 32;
  const chartHeight = Math.max(height, data.length * rowHeight + 20);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 4 }} barCategoryGap={10}>
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
        {years.length > 1 && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" iconSize={8} />}
        {years.map((year, i) => (
          <Bar
            key={year}
            dataKey={year}
            name={year}
            stackId="a"
            fill={yearColor(year)}
            radius={i === years.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
            maxBarSize={18}
            isAnimationActive
            animationDuration={700}
          >
            {i === years.length - 1 && (
              <LabelList dataKey="total" position="right" style={{ fontSize: 11, fontWeight: 700, fill: INK.primary }} />
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
