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
 *  stack segment per `segments` entry present in that row's data, colored by
 *  `colorForSegment`. Defaults to the TA ordinal ramp (oldest -> most recent
 *  = lightest -> most saturated) for backward compatibility; pass an
 *  explicit `segments` + `colorForSegment` (e.g. angkatan cohorts) to reuse
 *  the same chart for other ordered breakdowns. */
export default function DimensionYearStackedBarChart({
  data,
  segments: segmentsProp,
  colorForSegment = yearColor,
  height = 320,
}) {
  if (!data || data.length === 0) return <EmptyChartState />;

  const candidateSegments = segmentsProp || YEAR_ORDER;
  const segments = candidateSegments.filter((s) => data.some((d) => d[s] !== undefined));
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
        {segments.length > 1 && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" iconSize={8} />}
        {segments.map((segment, i) => (
          <Bar
            key={segment}
            dataKey={segment}
            name={segment}
            stackId="a"
            fill={colorForSegment(segment, i, segments.length)}
            radius={i === segments.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
            maxBarSize={18}
            isAnimationActive
            animationDuration={700}
          >
            {i === segments.length - 1 && (
              <LabelList dataKey="total" position="right" style={{ fontSize: 11, fontWeight: 700, fill: INK.primary }} />
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
