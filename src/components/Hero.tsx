import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import ParkingFloorPlan from './ParkingFloorPlan';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white min-h-[90vh] flex items-center pt-[136px] md:pt-[168px] pb-16 md:pb-24"
    >
      {/* Subtle light ambient gradient blob */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          y: bgY,
          backgroundImage: `
            radial-gradient(ellipse 800px 500px at 70% 30%, rgba(59, 91, 255, 0.05) 0%, transparent 60%),
            radial-gradient(ellipse 600px 400px at 15% 60%, rgba(0, 194, 168, 0.04) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Global Centered Max-Width Container */}
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left copy column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Status chip with single coral accent */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] mb-6 shadow-sm"
            >
              <span
                className="text-[11px] font-semibold text-[#FF6B4A] bg-[#FF6B4A]/10 px-2 py-0.5 rounded"
              >
                LIVE
              </span>
              <span
                className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse flex-shrink-0"
              />
              <span className="text-xs font-medium text-[#111827]">
                340 slots open right now across Bengaluru
              </span>
            </div>

            {/* H1 — Space Grotesk 700, Near-black #111827 */}
            <h1
              className="font-display font-bold text-[40px] sm:text-[52px] lg:text-[62px] leading-[1.06] tracking-tight text-[#111827] m-0 mb-6"
            >
              No ticket.
              <br />
              No queue.
              <br />
              Your plate is the key.
            </h1>

            {/* Subheadline — Muted gray #6B7280 with 32px clearance */}
            <p
              className="text-[17px] sm:text-[18px] leading-relaxed text-[#6B7280] m-0 mb-8 max-w-xl"
            >
              Drive up at Phoenix Marketcity or KIA. Our ANPR cameras read your plate in under 2 seconds, assign a slot, and open the gate. Exit works seamlessly with FASTag auto-deduction.
            </p>

            {/* CTAs: 16px gap between buttons, 32px bottom clearance */}
            <div className="flex items-center gap-4 flex-wrap mb-8">
              <button
                id="hero-cta-find-parking"
                onClick={() => onNavigate('search')}
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #3B5BFF 0%, #00C2A8 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px 32px', // Hero CTA spec: 16px 32px
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(59, 91, 255, 0.28)',
                  transition: 'filter 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.filter = 'brightness(1.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                Find a lot
              </button>

              <button
                id="hero-cta-list-parking"
                onClick={() => onNavigate('list-lot')}
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#111827',
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '16px 32px', // Hero CTA spec: 16px 32px
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 3px rgba(16, 24, 40, 0.06)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#D1D5DB';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 24, 40, 0.10)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(16, 24, 40, 0.06)';
                }}
              >
                List your lot
              </button>
            </div>

            {/* Grounding fact with 16px+ clearance */}
            <p className="text-[14px] text-[#6B7280] leading-relaxed m-0 max-w-lg">
              Deployed at 340+ locations across Karnataka, Tamil Nadu and Maharashtra — including Phoenix Marketcity, Lulu Mall, Manipal Hospitals, and KIA.
            </p>
          </div>

          {/* Right column: Interactive Floor Plan (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
            <ParkingFloorPlan />
            <p className="text-xs text-[#6B7280] mt-4 m-0 text-center lg:text-right">
              Floor plan updates live. Click any green slot to reserve it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
