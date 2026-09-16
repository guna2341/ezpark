import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, MapPin, X, Sparkles } from 'lucide-react';
import type { ParkingSlot } from '../types';
import { generateSlots } from '../data/mockData';

interface VisualSlotMapProps {
  initialSlot?: ParkingSlot | null;
  selectedFloor?: string;
  onSelectSlot: (slot: ParkingSlot | null) => void;
  onConfirmSlot?: (slot: ParkingSlot) => void;
  confirmButtonText?: string;
  isSidebar?: boolean;
}

export default function VisualSlotMap({
  initialSlot = null,
  selectedFloor: propFloor,
  onSelectSlot,
  onConfirmSlot,
  confirmButtonText = 'Confirm Slot',
  isSidebar = false,
}: VisualSlotMapProps) {
  const [floor, setFloor] = useState(propFloor || 'B1');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(initialSlot);
  const [glowingSlotId, setGlowingSlotId] = useState<string | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<ParkingSlot | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    slot: ParkingSlot | null;
    message: string;
  }>({ visible: false, slot: null, message: '' });

  const snackbarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate slots for active floor (4 rows of 14 slots = 56 bays)
  const createFloorSlots = (floorLevel: string): ParkingSlot[] => {
    const raw = generateSlots(floorLevel, 4, 14);
    return raw.map(slot => {
      // Ensure B-14 is available and EV Charging to match the exact requirement
      if (slot.label === 'B-14') {
        return {
          ...slot,
          type: 'ev' as const,
          status: 'available' as const,
        };
      }
      return slot;
    });
  };

  const [floorSlots, setFloorSlots] = useState<ParkingSlot[]>(() => createFloorSlots(floor));

  // Sync when floor changes
  useEffect(() => {
    setFloorSlots(createFloorSlots(floor));
  }, [floor]);

  // Sync initialSlot if provided externally
  useEffect(() => {
    if (initialSlot) {
      setSelectedSlot(initialSlot);
      if (initialSlot.floor && initialSlot.floor !== floor) {
        setFloor(initialSlot.floor);
      }
    }
  }, [initialSlot]);

  // Click handler for a slot
  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status !== 'available' && selectedSlot?.id !== slot.id) {
      return; // Occupied or reserved slots cannot be selected
    }

    if (selectedSlot?.id === slot.id) {
      // Deselect if already selected
      setSelectedSlot(null);
      onSelectSlot(null);
    } else {
      // Select single slot
      setSelectedSlot(slot);
      onSelectSlot(slot);
    }
  };

  // Walk-in Auto-assignment simulation
  const handleSimulateWalkIn = () => {
    const available = floorSlots.filter(s => s.status === 'available');
    if (available.length === 0) return;

    // Target B-14 if available (or EV bay, or middle bay)
    const b14 = available.find(s => s.label === 'B-14');
    const target = b14 || available.find(s => s.type === 'ev') || available[Math.floor(available.length / 2)];

    // Automatically select the slot in UI state
    setSelectedSlot(target);
    onSelectSlot(target);

    // Trigger brief pulse/glow animation on the slot map
    setGlowingSlotId(target.id);
    setTimeout(() => {
      setGlowingSlotId(null);
    }, 2400);

    // Trigger auto-dismissing snackbar at bottom
    if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);

    setSnackbar({
      visible: true,
      slot: target,
      message: `Slot ${target.label} assigned to you`,
    });

    snackbarTimerRef.current = setTimeout(() => {
      setSnackbar(prev => ({ ...prev, visible: false }));
    }, 4500);
  };

  const dismissSnackbar = () => {
    if (snackbarTimerRef.current) clearTimeout(snackbarTimerRef.current);
    setSnackbar(prev => ({ ...prev, visible: false }));
  };

  const rows = ['A', 'B', 'C', 'D'];

  const getTypeBadge = (type: ParkingSlot['type']) => {
    switch (type) {
      case 'ev':
        return 'EV Charging';
      case 'accessible':
        return 'Accessible Bay';
      case 'bike':
        return 'Two-Wheeler';
      default:
        return 'Standard Bay';
    }
  };

  return (
    <div className="relative w-full">
      {/* Floor & Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>
            Level:
          </span>
          <div style={{ display: 'flex', gap: '4px', background: '#F3F4F6', padding: '3px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            {['G', 'B1', 'B2'].map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFloor(f)}
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: floor === f ? '#3B5BFF' : 'transparent',
                  color: floor === f ? '#FFFFFF' : '#6B7280',
                  boxShadow: floor === f ? '0 1px 3px rgba(59, 91, 255, 0.25)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Walk-in Auto Assignment Simulation Button */}
        <button
          id="simulate-walkin-btn"
          type="button"
          onClick={handleSimulateWalkIn}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            padding: '6px 14px',
            borderRadius: '6px',
            background: 'rgba(59, 91, 255, 0.08)',
            border: '1px solid rgba(59, 91, 255, 0.25)',
            color: '#3B5BFF',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(59, 91, 255, 0.15)';
            e.currentTarget.style.borderColor = '#3B5BFF';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(59, 91, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(59, 91, 255, 0.25)';
          }}
        >
          <Sparkles size={13} color="#3B5BFF" />
          Simulate walk-in entry
        </button>
      </div>

      {/* Visual Slot Grid Map */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '24px',
          overflowX: 'auto',
          boxShadow: '0 1px 3px rgba(16, 24, 40, 0.06)',
        }}
      >
        {/* Driveway / Ramp Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            padding: '8px 16px',
            borderRadius: '6px',
            background: '#F7F8FA',
            border: '1px dashed #D1D5DB',
          }}
        >
          <span style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#6B7280', letterSpacing: '0.04em' }}>
            ← RAMP ENTRY (GATE 1)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#22C55E',
                display: 'inline-block',
                animation: 'pulse-dot 1.6s infinite',
              }}
            />
            <span style={{ fontFamily: 'Inter', fontSize: '11px', color: '#15803D', fontWeight: 600 }}>
              ANPR Camera Active
            </span>
          </div>
        </div>

        {/* Slot rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '640px' }}>
          {rows.map((rowLetter, rIdx) => {
            const rowSlots = floorSlots.filter(s => s.label.startsWith(rowLetter));

            return (
              <div key={rowLetter}>
                {/* Aisle driving lane between Row B and C */}
                {rIdx === 2 && (
                  <div
                    style={{
                      height: '32px',
                      background: '#F7F8FA',
                      borderTop: '1px dashed #E5E7EB',
                      borderBottom: '1px dashed #E5E7EB',
                      margin: '8px 0 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B7280', letterSpacing: '0.06em', fontWeight: 500 }}>
                      DRIVING LANE — AISLE {rowLetter}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(14, minmax(40px, 1fr))',
                    gap: '6px',
                  }}
                >
                  {rowSlots.map(slot => {
                    const isSelected = selectedSlot?.id === slot.id;
                    const isGlowing = glowingSlotId === slot.id;
                    const isAvailable = slot.status === 'available';
                    const isOccupied = slot.status === 'occupied';
                    const isReserved = slot.status === 'reserved';

                    // Color-coding per spec:
                    // green = available/selectable
                    // gray/amber = occupied or reserved
                    // blue = currently selected by this user
                    let bg = 'rgba(34, 197, 94, 0.1)';
                    let border = '1px solid #22C55E';
                    let textColor = '#15803D';
                    let cursor = 'pointer';

                    if (isSelected) {
                      bg = 'rgba(59, 91, 255, 0.1)';
                      border = '2px solid #3B5BFF';
                      textColor = '#3B5BFF';
                    } else if (isOccupied) {
                      bg = '#F3F4F6';
                      border = '1px solid #E5E7EB';
                      textColor = '#9CA3AF';
                      cursor = 'not-allowed';
                    } else if (isReserved) {
                      bg = 'rgba(245, 158, 11, 0.12)';
                      border = '1px solid #F59E0B';
                      textColor = '#D97706';
                      cursor = 'not-allowed';
                    }

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        id={`slot-btn-${slot.label}`}
                        disabled={!isAvailable && !isSelected}
                        onClick={() => handleSlotClick(slot)}
                        onMouseEnter={e => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
                          setHoveredSlot(slot);
                        }}
                        onMouseLeave={() => setHoveredSlot(null)}
                        className={isGlowing ? 'slot-auto-assigned' : ''}
                        style={{
                          height: '62px',
                          borderRadius: '6px',
                          background: bg,
                          border: border,
                          cursor: cursor,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px',
                          padding: '3px',
                          transition: 'all 0.15s ease',
                          position: 'relative',
                          outline: 'none',
                        }}
                      >
                        {/* Slot Label */}
                        <span
                          style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: isSelected ? 700 : 600,
                            fontSize: '11px',
                            color: textColor,
                            lineHeight: 1,
                          }}
                        >
                          {slot.label}
                        </span>

                        {/* Visual indicator / icon inside slot */}
                        {isSelected ? (
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: '#3B5BFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={11} color="#FFFFFF" strokeWidth={3} />
                          </div>
                        ) : slot.type === 'ev' ? (
                          <Zap size={13} color={textColor} />
                        ) : slot.type === 'accessible' ? (
                          <span style={{ fontSize: '11px' }}>♿</span>
                        ) : isOccupied ? (
                          <span style={{ fontSize: '9px', color: '#9CA3AF' }}>taken</span>
                        ) : isReserved ? (
                          <span style={{ fontSize: '9px', color: '#D97706' }}>hold</span>
                        ) : (
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#22C55E',
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #E5E7EB',
          }}
        >
          {[
            { label: 'Available (Click to select)', bg: 'rgba(34, 197, 94, 0.15)', border: '#22C55E', color: '#15803D' },
            { label: 'Your Selected Slot', bg: 'rgba(59, 91, 255, 0.2)', border: '#3B5BFF', color: '#3B5BFF' },
            { label: 'Occupied', bg: '#F3F4F6', border: '#E5E7EB', color: '#6B7280' },
            { label: 'Reserved', bg: 'rgba(245, 158, 11, 0.15)', border: '#F59E0B', color: '#D97706' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                }}
              />
              <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Desktop Hover Tooltip */}
      {hoveredSlot && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translate(-50%, -100%)',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            padding: '6px 12px',
            boxShadow: '0 8px 24px rgba(16, 24, 40, 0.12)',
            pointerEvents: 'none',
            zIndex: 60,
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '13px', color: '#111827' }}>
              {hoveredSlot.label}
            </span>
            <span style={{ color: '#9CA3AF', fontSize: '12px' }}>·</span>
            <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#3B5BFF', fontWeight: 600 }}>
              {getTypeBadge(hoveredSlot.type)}
            </span>
            <span style={{ color: '#9CA3AF', fontSize: '12px' }}>·</span>
            <span
              style={{
                fontFamily: 'Inter',
                fontSize: '11px',
                fontWeight: 600,
                color: hoveredSlot.status === 'available' ? '#15803D' : '#D97706',
                textTransform: 'capitalize',
              }}
            >
              {hoveredSlot.status}
            </span>
          </div>
        </div>
      )}

      {/* Summary Bar/Panel — Sticky at bottom on mobile, inline/sidebar on desktop */}
      <div
        className={isSidebar ? 'mt-6' : 'mt-6 sticky bottom-4 z-30'}
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '16px 24px',
          boxShadow: '0 4px 16px rgba(16, 24, 40, 0.08), 0 1px 2px rgba(16, 24, 40, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280' }}>
                Selected Slot:
              </span>
              {selectedSlot ? (
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: 700, color: '#3B5BFF' }}>
                  {selectedSlot.label} (Level {selectedSlot.floor})
                </span>
              ) : (
                <span style={{ fontFamily: 'Inter', fontSize: '13px', color: '#9CA3AF', fontStyle: 'italic' }}>
                  No slot selected — tap any green bay
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280' }}>
                Rate: <strong style={{ color: '#111827' }}>₹{selectedSlot?.price || 40}/hour</strong>
              </span>
              {selectedSlot?.type && (
                <span
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(59, 91, 255, 0.1)',
                    color: '#3B5BFF',
                  }}
                >
                  {getTypeBadge(selectedSlot.type)}
                </span>
              )}
            </div>
          </div>

          {/* Confirm Slot CTA Button — Disabled until slot is chosen */}
          <button
            id="confirm-slot-btn"
            type="button"
            disabled={!selectedSlot}
            onClick={() => {
              if (selectedSlot && onConfirmSlot) {
                onConfirmSlot(selectedSlot);
              }
            }}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: selectedSlot ? 'pointer' : 'not-allowed',
              background: selectedSlot
                ? '#3B5BFF'
                : '#F3F4F6',
              color: selectedSlot ? '#FFFFFF' : '#9CA3AF',
              boxShadow: selectedSlot ? '0 2px 8px rgba(59, 91, 255, 0.3)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>

      {/* Auto-assignment Walk-In Snackbar Notification */}
      <AnimatePresence>
        {snackbar.visible && snackbar.slot && (
          <motion.div
            id="auto-assign-snackbar"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 100,
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              padding: '12px 20px',
              boxShadow: '0 16px 40px rgba(16, 24, 40, 0.15), 0 4px 12px rgba(59, 91, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '90vw',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(59, 91, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MapPin size={18} color="#3B5BFF" />
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#111827',
                  margin: 0,
                }}
              >
                {snackbar.message}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255, 107, 74, 0.12)',
                    color: '#FF6B4A',
                  }}
                >
                  {getTypeBadge(snackbar.slot.type)}
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280' }}>
                  Level {snackbar.slot.floor}
                </span>
              </div>
            </div>

            <button
              id="dismiss-snackbar-btn"
              onClick={dismissSnackbar}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9CA3AF',
                padding: '4px',
                marginLeft: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
