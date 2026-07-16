import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartTooltip from '../ChartTooltip.jsx';
import EmptyChartState from '../EmptyChartState.jsx';
import { SERIES, INK } from '../../../lib/chartTheme.js';

export default function StackedYearBarChart({ data, height = 300 }) {
  if (!data || data.length === 0) return <EmptyChartState />;
  const allKeys = Array.from(new Set(data.flatMap((d) => Object.keys(d).filter((k) => k !== 'name'))));
  const keys = allKeys
    .map((key) => ({ key, total: data.reduce((s, d) => s + (d[key] || 0), 0) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
    .map((k) => k.key);
  if (keys.length === 0) return <EmptyChartState />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: -12 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke={INK.gridline} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: INK.muted }} axisLine={{ stroke: INK.baseline }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: INK.muted }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(235,104,52,0.06)' }} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" iconSize={8} />
        {keys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            name={key}
            stackId="a"
            fill={SERIES[i % SERIES.length]}
            radius={i === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            maxBarSize={56}
            isAnimationActive
            animationDuration={700}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
