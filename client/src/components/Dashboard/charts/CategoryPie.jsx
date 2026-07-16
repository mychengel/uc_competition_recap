import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ChartTooltip from '../ChartTooltip.jsx';
import EmptyChartState from '../EmptyChartState.jsx';
import { capTopN } from '../../../lib/chartData.js';
import { SERIES, INK } from '../../../lib/chartTheme.js';

const RADIAN = Math.PI / 180;

function colorFor(capped, i) {
  return i === capped.length - 1 && capped[i].name === 'Lainnya' ? INK.baseline : SERIES[i % SERIES.length];
}

// Places the percent label at the mid-radius INSIDE the donut ring, so it
// never overflows the chart bounds regardless of which slice is largest.
function renderInsideLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.08) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 11, fontWeight: 700 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function CategoryPie({ data, height = 260 }) {
  if (!data || data.length === 0) return <EmptyChartState />;
  const capped = capTopN(data, 7);
  const pieHeight = Math.max(160, height - 36);

  return (
    <div>
      <ResponsiveContainer width="100%" height={pieHeight}>
        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Pie
            data={capped}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="52%"
            outerRadius="80%"
            paddingAngle={2}
            cornerRadius={4}
            isAnimationActive
            animationDuration={700}
            label={renderInsideLabel}
            labelLine={false}
          >
            {capped.map((_, i) => (
              <Cell key={i} fill={colorFor(capped, i)} stroke="var(--surface-card)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1.5">
        {capped.map((d, i) => (
          <span key={d.name} className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: colorFor(capped, i) }} />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}
