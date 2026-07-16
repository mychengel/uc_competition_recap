import { motion } from 'framer-motion';

const TONE_STYLES = {
  good: { bg: 'bg-[var(--status-good)]/10', text: 'text-[var(--status-good)]', icon: '↑' },
  warning: { bg: 'bg-[var(--status-warning)]/15', text: 'text-[#946200]', icon: '!' },
  critical: { bg: 'bg-[var(--status-critical)]/10', text: 'text-[var(--status-critical)]', icon: '↓' },
  default: { bg: 'bg-brand-50', text: 'text-brand-600', icon: '•' },
};

export default function InsightsPanel({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {insights.map((ins, i) => {
        const tone = TONE_STYLES[ins.tone] || TONE_STYLES.default;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="flex gap-3 rounded-2xl border border-[var(--border-hairline)] bg-[var(--surface-card)] p-4"
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${tone.bg} ${tone.text}`}>
              {tone.icon}
            </span>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">{ins.title}</p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{ins.detail}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
