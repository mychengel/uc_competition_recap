import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex flex-col rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-5 shadow-sm ${className}`}
    >
      <div className="mb-3">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">{title}</h3>
        {subtitle && <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </motion.div>
  );
}
