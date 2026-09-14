import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SLOT_ROWS = 3;
const SLOT_COLS = 8;

type SlotStatus = 'available' | 'occupied' | 'selected' | 'ev';

function generateInitialSlots(): SlotStatus[] {
  const pattern: SlotStatus[] = [
    'available', 'occupied', 'occupied', 'ev', 'available', 'occupied', 'available', 'occupied',
    'occupied', 'available', 'ev', 'occupied', 'available', 'available', 'occupied', 'occupied',
    'available', 'occupied', 'available', 'occupied', 'occupied', 'available', 'occupied', 'ev',
  ];
  return pattern;
}

export default function LiveSlotMockup() {
  const [slots, setSlots] = useState<SlotStatus[]>(generateInitialSlots());
  const [selected, setSelected] = useState<number | null>(null);
  const [time, setTime] = useState(new Date());

  // Simulate live slot changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots(prev => {
        const next = [...prev];
        const randomIdx = Math.floor(Math.random() * next.length);
        if (next[randomIdx] === 'available') {
          next[randomIdx] = 'occupied';
        } else if (next[randomIdx] === 'occupied') {
          next[randomIdx] = 'available';
        }
        return next;
      });
      setTime(new Date());
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const slotColors: Record<SlotStatus, string> = {
    available: 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]',
    occupied: 'bg-[#F97316]/10 border-[#F97316]/25 text-[#F97316]/70',
    selected: 'border-[#00D9C0] text-[#00D9C0] shadow-[0_0_10px_rgba(0,217,192,0.4)]',
    ev: 'bg-[#2F80FF]/12 border-[#2F80FF]/35 text-[#2F80FF]',
  };

  const labels = Array.from({ length: SLOT_ROWS * SLOT_COLS }, (_, i) => {
    const row = String.fromCharCode(65 + Math.floor(i / SLOT_COLS));
    const col = String(i % SLOT_COLS + 1).padStart(2, '0');
    return `${row}${col}`;
  });

  const available = slots.filter(s => s === 'available' || s === 'ev').length;

  return (
    <div className="relative float-anim">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-[24px] blur-[40px] pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(47,128,255,0.25), rgba(0,217,192,0.15))' }}
      />

      {/* Main card */}
      <div
        className="relative rounded-[20px] overflow-hidden"
        style={{
          background: 'rgba(18, 24, 31, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          width: 'clamp(320px, 45vw, 520px)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div>
            <p className="text-xs text-[#8993A4] mb-0.5">Phoenix Marketcity — Floor B1</p>
            <p className="font-display font-semibold text-[#EDEFF2] text-sm">Live Slot Availability</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="pulse-dot bg-[#22C55E]" />
            <span className="text-xs font-semibold text-[#22C55E]">LIVE</span>
            <span className="text-xs text-[#8993A4] ml-2">
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="px-5 py-3 flex gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            { label: 'Available', val: available, color: '#22C55E' },
            { label: 'Occupied', val: slots.filter(s => s === 'occupied').length, color: '#F97316' },
            { label: 'EV Bays', val: slots.filter(s => s === 'ev').length, color: '#2F80FF' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
              <span className="text-xs text-[#8993A4]">{stat.label}:</span>
              <span className="text-xs font-bold text-[#EDEFF2]">{stat.val}</span>
            </div>
          ))}
        </div>

        {/* Slot grid */}
        <div className="p-5">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${SLOT_COLS}, 1fr)` }}
          >
            {slots.map((status, i) => {
              const isSelected = selected === i;
              const effectiveStatus: SlotStatus = isSelected ? 'selected' : status;
              return (
                <motion.button
                  key={i}
                  layout
                  onClick={() => {
                    if (status === 'available' || status === 'ev') {
                      setSelected(isSelected ? null : i);
                    }
                  }}
                  className={`
                    relative aspect-[2/3] rounded-[4px] border text-[7px] font-bold
                    flex flex-col items-center justify-center gap-0.5
                    transition-all duration-200
                    ${slotColors[effectiveStatus]}
                    ${isSelected
                      ? 'bg-gradient-to-b from-[#2F80FF]/20 to-[#00D9C0]/20'
                      : ''}
                    ${(status === 'available' || status === 'ev') && !isSelected ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                  `}
                  whileHover={status === 'available' ? { scale: 1.08 } : {}}
                  animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                >
                  {status === 'ev' && !isSelected && (
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                      <path d="M5 1L3 5h2L4 9l3-5H5L6 1z"/>
                    </svg>
                  )}
                  <span className="leading-none">{labels[i]}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 justify-center">
            {[
              { label: 'Free', color: 'bg-[#22C55E]/20 border-[#22C55E]/40' },
              { label: 'Busy', color: 'bg-[#F97316]/15 border-[#F97316]/30' },
              { label: 'EV', color: 'bg-[#2F80FF]/15 border-[#2F80FF]/30' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-[2px] border ${item.color}`} />
                <span className="text-[10px] text-[#8993A4]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking bar — shows when slot is selected */}
        <motion.div
          initial={false}
          animate={{ height: selected !== null ? 'auto' : 0, opacity: selected !== null ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
          style={{ borderTop: selected !== null ? '1px solid rgba(0,217,192,0.2)' : undefined }}
        >
          <div className="px-5 py-4 flex items-center justify-between bg-[#00D9C0]/5">
            <div>
              <p className="text-xs text-[#8993A4]">Selected</p>
              <p className="text-sm font-bold text-[#00D9C0]">
                {selected !== null ? `Slot ${labels[selected]}` : ''}
              </p>
            </div>
            <button className="gradient-btn text-white text-xs font-semibold px-4 py-2 rounded-full">
              <span>Book — ₹40/hr</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Floating notification card */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -right-6 top-8 glass rounded-xl p-3 shadow-xl"
        style={{ width: '180px' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l4 4 6-6" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-[#8993A4]">Auto-entry</p>
            <p className="text-xs font-bold text-[#EDEFF2]">KA 05 AB 4321</p>
            <p className="text-[10px] text-[#22C55E]">Slot A-06 assigned</p>
          </div>
        </div>
      </motion.div>

      {/* Floating plate scan card */}
      <motion.div
        initial={{ opacity: 0, x: -40, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute -left-4 bottom-12 glass rounded-xl p-3 shadow-xl"
        style={{ width: '160px' }}
      >
        <p className="text-[10px] text-[#8993A4] mb-1.5">ANPR Scan</p>
        <p className="kiosk-plate text-sm text-[#EDEFF2]">MH 12 DE 5567</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="pulse-dot bg-[#2F80FF]" style={{ width: '6px', height: '6px' }} />
          <span className="text-[10px] text-[#2F80FF]">Processing…</span>
        </div>
      </motion.div>
    </div>
  );
}
