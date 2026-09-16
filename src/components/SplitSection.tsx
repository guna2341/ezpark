import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface SplitSectionProps {
  onNavigate: (page: string) => void;
}

export default function SplitSection({ onNavigate }: SplitSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: '#F7F8FA' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold text-[#3B5BFF] tracking-[0.2em] uppercase mb-4">
              Think of Parking, Think of ParkEZ
            </p>
            <h2 className="font-display font-bold text-[clamp(32px,4vw,48px)] text-[#111827] leading-[1.05] mb-6">
              Your spot reserved
              <br />
              before you arrive.
            </h2>
            <p className="text-[15px] text-[#6B7280] leading-relaxed mb-8 max-w-md">
              Browse available slots, pick your time, confirm with one tap.
              The gate knows you're coming. No fumbling with tickets, no hunting for a spot,
              no standing in payment queues.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Search by location, price, or type (car / bike / EV)',
                'Visual floor-plan slot picker — see exactly what you\'re booking',
                'Instant digital confirmation — no print-outs needed',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: '#3B5BFF' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm text-[#111827] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('search')}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#fff',
                background: '#3B5BFF',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 14px rgba(59, 91, 255, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <span>Browse Parking Now</span>
              <ArrowRight size={15} />
            </button>
          </motion.div>

          {/* Right: booking flow mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-[24px] blur-[30px] pointer-events-none"
              style={{ background: 'rgba(59, 91, 255, 0.05)' }}
            />
            <div
              className="relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-lg"
            >
              {/* Header bar */}
              <div className="px-5 py-4 bg-[#FAFAFA]" style={{ borderBottom: '1px solid #E5E7EB' }}>
                <p className="text-sm font-display font-semibold text-[#111827]">Book a Slot</p>
                <p className="text-xs text-[#6B7280]">Phoenix Marketcity — Floor B1</p>
              </div>

              {/* Slot mini-grid */}
              <div className="p-5">
                {/* Time selector */}
                <div className="mb-4">
                  <p className="text-xs text-[#6B7280] mb-2 font-medium">Select time</p>
                  <div className="flex gap-2">
                    {['10:00', '11:00', '12:00', '13:00'].map((t, i) => (
                      <div
                        key={t}
                        className="py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                        style={{
                          background: i === 1
                            ? '#3B5BFF'
                            : '#F1F3F6',
                          color: i === 1 ? 'white' : '#6B7280',
                          border: i === 1 ? 'none' : '1px solid #E5E7EB',
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slot grid preview */}
                <div className="grid gap-1.5 mb-4" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
                  {['av', 'oc', 'av', 'ev', 'av', 'oc', 'av', 'oc',
                    'oc', 'av', 'oc', 'av', 'ev', 'av', 'oc', 'av',
                    'av', 'oc', 'av', 'oc', 'av', 'av', 'oc', 'av'].map((s, i) => (
                    <div
                      key={i}
                      className={`aspect-[2/3] rounded-[3px] border text-[6px] flex items-center justify-center font-bold ${
                        i === 6 ? 'slot-selected' :
                        s === 'av' ? 'slot-available' :
                        s === 'ev' ? 'slot-ev' : 'slot-occupied'
                      }`}
                    >
                      {i === 6 ? '★' : ''}
                    </div>
                  ))}
                </div>

                {/* Selected slot */}
                <div
                  className="rounded-xl p-3 flex items-center justify-between"
                  style={{ background: 'rgba(59,91,255,0.06)', border: '1px solid rgba(59,91,255,0.2)' }}
                >
                  <div>
                    <p className="text-xs text-[#6B7280]">Selected</p>
                    <p className="text-sm font-bold text-[#3B5BFF]">B1 — A-07</p>
                  </div>
                  <div
                    className="px-4 py-2 rounded-full text-xs font-semibold text-white"
                    style={{ background: '#3B5BFF' }}
                  >
                    ₹40/hr
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
