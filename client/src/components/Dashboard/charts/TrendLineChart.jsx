import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartTooltip from '../ChartTooltip.jsx';
import EmptyChartState from '../EmptyChartState.jsx';
import { SERIES, INK } from '../../../lib/chartTheme.js';

export default function TrendLineChart({ data, lines, height = 280 }) {
  if (!data || data.length === 0) return <EmptyChartState />;
  if (data.length === 1) {
    return <EmptyChartState message="Pilih lebih dari 1 tahun ajaran untuk melihat tren" />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: -12 }}>
        <CartesianGrid vertical={false} stroke={INK.gridline} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: INK.muted }} axisLine={{ stroke: INK.baseline }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: INK.muted }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} />
        {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" iconSize={8} />}
        {lines.map((l, i) => (
          <Line
            key={l.dataKey}
            type="monotone"
            dataKey={l.dataKey}
            name={l.name}
            stroke={SERIES[i % SERIES.length]}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 0, fill: SERIES[i % SERIES.length] }}
            activeDot={{ r: 6 }}
            isAnimationActive
            animationDuration={800}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
