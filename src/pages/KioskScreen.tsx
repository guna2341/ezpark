import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

type KioskState = 'scanning' | 'reserved' | 'walkin' | 'full';
type KioskMode = 'entry' | 'exit';

interface KioskScreenProps {
  mode?: KioskMode;
}

const SCAN_PLATES = ['KA 05 AB 4321', 'MH 12 DE 5567', 'TN 07 BX 9988', 'DL 01 EA 4567'];

export default function KioskScreen({ mode = 'entry' }: KioskScreenProps) {
  const [kioskMode, setKioskMode] = useState<KioskMode>(mode);
  const [state, setState] = useState<KioskState>('scanning');
  const [plate, setPlate] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [gateOpen, setGateOpen] = useState(false);
  const [demoIdx, setDemoIdx] = useState(0);

  // Auto-simulate scan cycle
  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const runCycle = () => {
      setState('scanning');
      setScanProgress(0);
      setGateOpen(false);

      // Progress bar fills
      let prog = 0;
      const interval = setInterval(() => {
        prog += 4;
        setScanProgress(Math.min(prog, 100));
        if (prog >= 100) clearInterval(interval);
      }, 50);

      // Show result
      const t1 = setTimeout(() => {
        const scanPlate = SCAN_PLATES[demoIdx % SCAN_PLATES.length];
        setPlate(scanPlate);
        const outcomes: KioskState[] = kioskMode === 'entry'
          ? ['reserved', 'walkin', 'walkin', 'full']
          : ['walkin', 'walkin', 'reserved', 'walkin'];
        setState(outcomes[demoIdx % outcomes.length]);
        setDemoIdx(i => i + 1);
      }, 2500);

      // Gate open
      const t2 = setTimeout(() => {
        if (kioskMode === 'entry') setGateOpen(true);
        else setGateOpen(true);
      }, 4000);

      // Reset
      const t3 = setTimeout(runCycle, 7000);

      timeouts = [t1, t2, t3];
    };

    runCycle();
    return () => timeouts.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kioskMode]);

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#1E2A4A', fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* Mode toggle (demo control) */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="flex gap-2 bg-white/10 border border-white/15 rounded-full p-1.5 shadow-md">
          {(['entry', 'exit'] as const).map(m => (
            <button
              key={m}
              onClick={() => setKioskMode(m)}
              className={`text-sm font-semibold px-6 py-2.5 rounded-full capitalize transition-all cursor-pointer ${
                kioskMode === m ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
              style={kioskMode === m ? { background: 'linear-gradient(135deg, #3B5BFF, #00C2A8)', boxShadow: '0 2px 8px rgba(59,91,255,0.3)' } : {}}
            >
              {m} Gate Kiosk
            </button>
          ))}
        </div>
      </div>

      {/* Main kiosk display — centered in 1280px container */}
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16 flex-1 flex flex-col items-center justify-center py-12">
        <AnimatePresence mode="wait">
          {/* SCANNING STATE */}
          {state === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
              style={{ maxWidth: '500px', width: '100%' }}
            >
              {/* Camera animation */}
              <div className="relative mb-10">
                <div
                  className="w-48 h-36 rounded-2xl border-2 border-dashed overflow-hidden relative"
                  style={{ borderColor: 'rgba(47,128,255,0.5)', background: 'rgba(18,24,31,0.6)' }}
                >
                  {/* Scan line */}
                  <motion.div
                    className="absolute left-0 right-0 h-0.5"
                    style={{ background: 'linear-gradient(135deg, transparent, #2F80FF, #00D9C0, transparent)' }}
                    animate={{ y: [0, 136, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* Corner marks */}
                  {[['top-0 left-0', 'border-t-2 border-l-2'],
                    ['top-0 right-0', 'border-t-2 border-r-2'],
                    ['bottom-0 left-0', 'border-b-2 border-l-2'],
                    ['bottom-0 right-0', 'border-b-2 border-r-2']].map(([pos, border]) => (
                    <div
                      key={pos}
                      className={`absolute ${pos} w-5 h-5 ${border}`}
                      style={{ borderColor: '#2F80FF' }}
                    />
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" opacity={0.3}>
                      <rect x="2" y="8" width="28" height="16" rx="3" stroke="#2F80FF" strokeWidth="1.5"/>
                      <path d="M7 16h4M14 12h4M14 20h4M21 16h4" stroke="#2F80FF" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
                {/* Glow below camera */}
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 blur-xl opacity-60"
                  style={{ background: 'radial-gradient(ellipse, #2F80FF, transparent)' }}
                />
              </div>

              {/* Progress bar */}
              <div className="w-64 h-1 bg-white/08 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #2F80FF, #00D9C0)',
                    width: `${scanProgress}%`,
                    transition: 'width 0.1s linear',
                  }}
                />
              </div>

              <h1
                className="font-bold text-[clamp(20px,4vw,28px)] text-white mb-2"
                style={{ letterSpacing: '0.04em' }}
              >
                SCANNING PLATE
              </h1>
              <p className="text-white/40 text-base">Position your vehicle at the gate</p>

              <div className="mt-8 flex items-center gap-2">
                <span className="pulse-dot bg-[#2F80FF]" />
                <span className="text-sm text-[#2F80FF] font-medium">ANPR Active</span>
              </div>
            </motion.div>
          )}

          {/* RESERVED STATE — walk-in or pre-booked entry */}
          {(state === 'reserved' || state === 'walkin') && kioskMode === 'entry' && (
            <motion.div
              key="entry-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center text-center"
              style={{ maxWidth: '560px', width: '100%' }}
            >
              {/* Plate */}
              <div
                className="mb-6 px-8 py-4 rounded-2xl"
                style={{
                  background: 'rgba(18,24,31,0.8)',
                  border: '2px solid rgba(34,197,94,0.4)',
                  boxShadow: '0 0 40px rgba(34,197,94,0.15)',
                }}
              >
                <p className="text-[#8993A4] text-sm mb-2 font-medium">Plate Recognized</p>
                <p
                  className="kiosk-plate text-[clamp(36px,7vw,56px)] font-black text-white"
                  style={{ letterSpacing: '0.15em', textShadow: '0 0 20px rgba(34,197,94,0.4)' }}
                >
                  {plate}
                </p>
              </div>

              {/* Welcome / assignment */}
              <div
                className="w-full rounded-2xl p-6 mb-6"
                style={{
                  background: state === 'reserved'
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(0,217,192,0.08))'
                    : 'linear-gradient(135deg, rgba(47,128,255,0.12), rgba(0,217,192,0.08))',
                  border: '1px solid rgba(34,197,94,0.25)',
                }}
              >
                {state === 'reserved' ? (
                  <>
                    <p className="text-[#22C55E] text-lg font-semibold mb-1">Welcome back!</p>
                    <p className="text-white/60 text-sm mb-4">Your pre-booked slot is ready</p>
                    <p
                      className="font-bold text-white"
                      style={{ fontSize: 'clamp(48px,10vw,80px)', lineHeight: 1 }}
                    >
                      B1 — A04
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="inline-flex items-center gap-2 text-sm text-white/50">
                        <span>↑ Turn left at ramp, Level B1, Aisle A</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[#2F80FF] text-lg font-semibold mb-1">Walk-in — Slot Assigned</p>
                    <p className="text-white/60 text-sm mb-4">Proceed to your designated spot</p>
                    <p
                      className="font-bold text-white"
                      style={{ fontSize: 'clamp(48px,10vw,80px)', lineHeight: 1 }}
                    >
                      G — C07
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="inline-flex items-center gap-2 text-sm text-white/50">
                        <span>↑ Ground floor, Section C, Slot 07</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Gate animation */}
              <AnimatePresence>
                {gateOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      className="w-20 h-2 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #2F80FF, #00D9C0)' }}
                      animate={{ scaleX: [1, 0] }}
                      transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
                      style={{ originX: 'right', background: 'linear-gradient(135deg, #2F80FF, #00D9C0)' }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="pulse-dot bg-[#22C55E]" />
                      <span className="text-xl font-bold text-[#22C55E] tracking-wide">GATE OPENING</span>
                    </div>
                    <motion.div
                      className="w-20 h-2 rounded-full"
                      animate={{ scaleX: [1, 0] }}
                      transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
                      style={{ originX: 'left', background: 'linear-gradient(135deg, #00D9C0, #2F80FF)' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* EXIT STATE */}
          {(state === 'reserved' || state === 'walkin') && kioskMode === 'exit' && (
            <motion.div
              key="exit-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center text-center"
              style={{ maxWidth: '560px', width: '100%' }}
            >
              {/* Plate */}
              <div
                className="mb-6 px-8 py-4 rounded-2xl"
                style={{ background: 'rgba(18,24,31,0.8)', border: '2px solid rgba(47,128,255,0.4)', boxShadow: '0 0 40px rgba(47,128,255,0.15)' }}
              >
                <p className="text-[#8993A4] text-sm mb-2 font-medium">Exit Scan</p>
                <p
                  className="kiosk-plate text-[clamp(36px,7vw,56px)] font-black text-white"
                  style={{ letterSpacing: '0.15em' }}
                >
                  {plate}
                </p>
              </div>

              {/* Fare card */}
              <div
                className="w-full rounded-2xl p-6 mb-6"
                style={{ background: 'rgba(18,24,31,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Entry', val: '11:32 AM' },
                    { label: 'Duration', val: '2h 28m' },
                    { label: 'Slot', val: 'B1-A04' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-white/40 text-xs mb-1 tracking-wider uppercase">{item.label}</p>
                      <p className="font-bold text-white text-lg">{item.val}</p>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-center justify-between pt-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Total Fare</p>
                    <p className="font-bold text-white" style={{ fontSize: '56px', lineHeight: 1 }}>₹100</p>
                  </div>
                  <div
                    className="text-right rounded-xl px-5 py-4"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}
                  >
                    <p className="text-[#22C55E] font-bold text-lg">FASTag Charged ✓</p>
                    <p className="text-[#22C55E]/70 text-sm">Auto-deducted via NETC</p>
                  </div>
                </div>
              </div>

              {gateOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <span className="pulse-dot bg-[#22C55E]" />
                  <span className="text-2xl font-bold text-[#22C55E] tracking-widest">GATE OPENING — SAFE JOURNEY!</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* FULL STATE */}
          {state === 'full' && (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
              style={{ maxWidth: '560px', width: '100%' }}
            >
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)' }}
              >
                <AlertTriangle size={36} color="#EF4444" />
              </div>
              <h1 className="font-bold text-[clamp(36px,6vw,56px)] text-[#EF4444] mb-3 tracking-tight">LOT FULL</h1>
              <p className="text-white/50 text-lg mb-8">We're at capacity right now. Please try nearby alternatives.</p>
              <div className="w-full space-y-3">
                {[
                  { name: 'WeWork Galaxy — 2.1 km', slots: '156 available', price: '₹50/hr' },
                  { name: 'UB City Parking — 3.4 km', slots: '43 available', price: '₹60/hr' },
                ].map(alt => (
                  <div
                    key={alt.name}
                    className="rounded-xl p-4 text-left"
                    style={{ background: 'rgba(18,24,31,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{alt.name}</p>
                        <p className="text-[#22C55E] text-sm">{alt.slots}</p>
                      </div>
                      <p className="font-bold text-white">{alt.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div
        className="py-4 px-8 flex items-center justify-between"
        style={{ background: 'rgba(18,24,31,0.6)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <span className="pulse-dot bg-[#22C55E]" />
          <span className="text-xs text-[#22C55E] font-medium">ParkEZ System Online</span>
        </div>
        <p className="text-xs text-white/30">Phoenix Marketcity — Gate {kioskMode === 'entry' ? '1 — Entry' : '2 — Exit'}</p>
        <p className="text-xs text-white/30 font-mono">
          {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
