import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface TickerBarProps {
  items: string[];
}

export default function TickerBar({ items }: TickerBarProps) {
  const prefersReducedMotion = useReducedMotion();
  const renderedItems = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-slate-200 bg-white">
      <motion.div
        className="flex min-w-max items-center gap-4 px-4 py-4"
        animate={prefersReducedMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
      >
        {renderedItems.map((item, index) => (
          <div
            className="flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-extrabold text-slate-900 shadow-sm"
            key={`${item}-${index}`}
          >
            <CheckCircle2 className="size-5 shrink-0 text-teal-700" aria-hidden="true" />
            <span className="whitespace-nowrap">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
