import { useEffect, useRef, useState } from 'react';

// ─── SVG Floor Plan Data ─────────────────────────────────────────
type SlotState = 'available' | 'occupied' | 'ev' | 'reserved';

interface Slot {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  state: SlotState;
  isEV?: boolean;
}

const SLOT_W = 28;
const SLOT_H = 44;
const LANE_Y = 62;
const LANE_H = 36;
const ROW_GAP = 8;

function buildSlots(): Slot[] {
  const cols = 10;
  const startX = 24;
  const gapX = 4;
  const slots: Slot[] = [];

  const initialStates: SlotState[] = [
    'occupied', 'available', 'available', 'ev', 'available',
    'occupied', 'available', 'occupied', 'available', 'available',
    'available', 'occupied', 'ev', 'available', 'occupied',
    'available', 'available', 'occupied', 'available', 'available',
  ];

  for (let c = 0; c < cols; c++) {
    const x = startX + c * (SLOT_W + gapX);
    // Top row
    slots.push({
      id: `A${c + 1}`,
      label: `A${String(c + 1).padStart(2, '0')}`,
      x,
      y: LANE_Y - LANE_H / 2 - ROW_GAP - SLOT_H,
      w: SLOT_W,
      h: SLOT_H,
      state: initialStates[c],
      isEV: c === 3,
    });
    // Bottom row
    slots.push({
      id: `B${c + 1}`,
      label: `B${String(c + 1).padStart(2, '0')}`,
      x,
      y: LANE_Y + LANE_H / 2 + ROW_GAP,
      w: SLOT_W,
      h: SLOT_H,
      state: initialStates[c + 10],
      isEV: c === 2,
    });
  }
  return slots;
}

// Light theme colors
const STATE_FILL: Record<SlotState, string> = {
  available: 'rgba(34, 197, 94, 0.12)',
  occupied: '#F3F4F6',
  ev: 'rgba(59, 91, 255, 0.12)',
  reserved: 'rgba(245, 158, 11, 0.12)',
};
const STATE_STROKE: Record<SlotState, string> = {
  available: '#22C55E',
  occupied: '#D1D5DB',
  ev: '#3B5BFF',
  reserved: '#F59E0B',
};
const STATE_TEXT: Record<SlotState, string> = {
  available: '#15803D',
  occupied: '#9CA3AF',
  ev: '#3B5BFF',
  reserved: '#D97706',
};

const SVG_W = 24 + 10 * (28 + 4) - 4 + 24;
const SVG_H = 180;

export default function ParkingFloorPlan() {
  const [slots, setSlots] = useState<Slot[]>(buildSlots);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const transitions: Record<SlotState, SlotState> = {
      available: 'occupied',
      occupied: 'available',
      reserved: 'available',
      ev: 'ev',
    };

    cycleRef.current = setInterval(() => {
      setSlots(prev => {
        const changeable = prev.filter(s => !s.isEV);
        if (changeable.length === 0) return prev;
        const idx = Math.floor(Math.random() * changeable.length);
        const target = changeable[idx];
        return prev.map(s =>
          s.id === target.id
            ? { ...s, state: transitions[s.state] }
            : s
        );
      });
    }, 3500);

    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, []);

  const available = slots.filter(s => s.state === 'available').length;

  return (
    <div
      className="relative"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 1px 3px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)',
      }}
    >
      {/* Location label */}
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              color: '#111827',
              margin: 0,
            }}
          >
            Koramangala 6th Block
          </p>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0', fontFamily: 'Inter, sans-serif' }}>
            Level B1, {available} of 20 slots free
          </p>
        </div>
        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#22C55E',
              animation: 'pulse-dot 1.6s ease-in-out infinite',
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#15803D', letterSpacing: '0.04em' }}>
            LIVE
          </span>
        </div>
      </div>

      {/* SVG floor plan */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ display: 'block', overflow: 'visible' }}
        aria-label="Live parking floor plan"
      >
        {/* Ramp marker on left */}
        <g transform={`translate(0, ${LANE_Y - 12})`}>
          <rect x="0" y="0" width="16" height="24" rx="3"
            fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1"
          />
          <text x="8" y="15" textAnchor="middle" fontSize="6" fill="#6B7280"
            fontFamily="Inter, sans-serif">↑</text>
        </g>

        {/* Driving lane */}
        <rect
          x={22}
          y={LANE_Y - LANE_H / 2}
          width={SVG_W - 22}
          height={LANE_H}
          rx="3"
          fill="#F7F8FA"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        {/* Lane center dashes */}
        {Array.from({ length: 14 }, (_, i) => (
          <rect
            key={i}
            x={30 + i * 24}
            y={LANE_Y - 1}
            width={14}
            height={2}
            rx="1"
            fill="#D1D5DB"
          />
        ))}

        {/* ANPR camera marker on right edge */}
        <g transform={`translate(${SVG_W - 14}, ${LANE_Y - 10})`}>
          <rect x="0" y="0" width="14" height="20" rx="3"
            fill="rgba(59,91,255,0.08)" stroke="rgba(59,91,255,0.25)" strokeWidth="1"
          />
          <circle cx="7" cy="10" r="3.5" fill="none" stroke="#3B5BFF" strokeWidth="1" />
          <circle cx="7" cy="10" r="1.2" fill="#3B5BFF" />
        </g>

        {/* Slots */}
        {slots.map(slot => (
          <g key={slot.id}>
            <rect
              x={slot.x}
              y={slot.y}
              width={slot.w}
              height={slot.h}
              rx="3"
              fill={STATE_FILL[slot.state]}
              stroke={STATE_STROKE[slot.state]}
              strokeWidth="1"
              style={{ transition: 'fill 0.8s ease, stroke 0.8s ease' }}
            />
            {/* EV bolt */}
            {slot.isEV && (
              <text
                x={slot.x + slot.w / 2}
                y={slot.y + slot.h / 2 - 4}
                textAnchor="middle"
                fontSize="9"
                fill={STATE_TEXT[slot.state]}
                fontFamily="Inter, sans-serif"
              >
                ⚡
              </text>
            )}
            {/* Slot label */}
            <text
              x={slot.x + slot.w / 2}
              y={slot.y + (slot.isEV ? slot.h / 2 + 10 : slot.h / 2 + 4)}
              textAnchor="middle"
              fontSize="6.5"
              fill={STATE_TEXT[slot.state]}
              fontFamily="Inter, sans-serif"
              fontWeight="600"
              style={{ transition: 'fill 0.8s ease' }}
            >
              {slot.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {[
          { state: 'available' as const, label: 'Free' },
          { state: 'occupied' as const, label: 'Taken' },
          { state: 'ev' as const, label: 'EV bay' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                background: STATE_FILL[item.state],
                border: `1px solid ${STATE_STROKE[item.state]}`,
              }}
            />
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
