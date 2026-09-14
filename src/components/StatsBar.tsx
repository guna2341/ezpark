import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: 2, suffix: 'M+', label: 'Drivers Served' },
  { value: 1, suffix: 'M+', label: 'Monthly Transactions' },
  { value: 1200, suffix: '+', label: 'Parking Slots' },
  { value: 12, suffix: '+', label: 'States' },
];

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix: string; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden"
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-semibold text-[#3B5BFF] tracking-[0.2em] uppercase mb-12"
        >
          ParkEZ by the numbers
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="font-display font-bold text-[clamp(40px,5vw,64px)] leading-none mb-2 text-[#111827]"
                style={{
                  fontFeatureSettings: '"tnum"',
                }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <p className="text-sm text-[#6B7280] font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Award strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 flex items-center justify-center gap-8 flex-wrap"
        >
          {['ET Startup Awards 2025', 'NASSCOM DeepTech Club', 'AWS Activate Alumni', 'Google for Startups'].map(award => (
            <div key={award} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L8 9.5 5 11l.5-3.5L3 5l3.5-.5z" stroke="#3B5BFF" strokeWidth="1.2"/>
              </svg>
              <span className="text-xs font-medium text-[#6B7280] whitespace-nowrap">{award}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
