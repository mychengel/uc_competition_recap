import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import ChartTooltip from '../ChartTooltip.jsx';
import EmptyChartState from '../EmptyChartState.jsx';
import { INK } from '../../../lib/chartTheme.js';

export default function CreditBarChart({ data, height = 280 }) {
  if (!data || data.length === 0) return <EmptyChartState />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 16, bottom: 4, left: -12 }} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke={INK.gridline} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: INK.muted }} axisLine={{ stroke: INK.baseline }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: INK.muted }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(235,104,52,0.06)' }} />
        <Bar dataKey="creditPoints" name="Credit Point" fill="#eb6834" radius={[4, 4, 0, 0]} maxBarSize={56} isAnimationActive animationDuration={700}>
          <LabelList dataKey="creditPoints" position="top" style={{ fontSize: 11, fontWeight: 700, fill: INK.primary }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
