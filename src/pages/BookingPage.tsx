import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Car, Zap, CreditCard, Check, QrCode } from 'lucide-react';
import { MOCK_VEHICLES } from '../data/mockData';
import VisualSlotMap from '../components/VisualSlotMap';
import type { Venue, ParkingSlot } from '../types';

interface BookingPageProps {
  venue: Venue;
  slot?: ParkingSlot | null;
  onNavigate: (page: string, data?: unknown) => void;
}

type Step = 'slot' | 'datetime' | 'vehicle' | 'payment' | 'confirm';

export default function BookingPage({ venue, slot: initialSlot, onNavigate }: BookingPageProps) {
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(initialSlot || null);
  const [step, setStep] = useState<Step>('slot');
  const [selectedDate, setSelectedDate] = useState('2026-09-15');
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState(2);
  const [selectedVehicle, setSelectedVehicle] = useState(MOCK_VEHICLES[0].id);
  const [paymentMethod, setPaymentMethod] = useState<'fastag' | 'upi' | 'card'>('fastag');
  const [booked, setBooked] = useState(false);

  const slotPrice = selectedSlot?.price || 40;
  const total = slotPrice * duration;
  const STEPS: Step[] = ['slot', 'datetime', 'vehicle', 'payment', 'confirm'];
  const stepIdx = STEPS.indexOf(step);

  const handleNext = () => {
    if (step === 'confirm') {
      setBooked(true);
    } else {
      setStep(STEPS[stepIdx + 1]);
    }
  };

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F8FA', paddingTop: '104px', paddingBottom: '96px' }}>
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="max-w-lg w-full text-center"
          >
            {/* Success icon */}
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-sm"
              style={{ background: 'rgba(34, 197, 94, 0.12)', border: '2px solid rgba(34, 197, 94, 0.3)' }}
            >
              <Check size={36} color="#15803D" strokeWidth={2.5} />
            </div>
            <h1 className="font-display font-bold text-3xl text-[#111827] mb-3">Booking Confirmed!</h1>
            <p className="text-[#6B7280] mb-8 text-sm leading-relaxed max-w-md mx-auto">
              Your bay is reserved and synced with gate ANPR sensors. Show this QR at the gate or simply drive in — the camera recognizes your plate automatically.
            </p>

            {/* QR Card — 32px padding per large card spec */}
            <div className="rounded-2xl p-8 mb-8 bg-white border border-[#E5E7EB] shadow-sm">
              <div className="w-40 h-40 mx-auto bg-[#F7F8FA] border border-[#E5E7EB] rounded-2xl mb-6 flex items-center justify-center p-4">
                <QrCode size={110} color="#111827" />
              </div>
              <p className="text-xs font-mono font-bold text-[#6B7280] mb-6">Booking ID: BK-{Math.floor(Math.random() * 9000) + 1000}</p>

              <div className="text-left space-y-3">
                {[
                  { label: 'Venue', val: venue.name },
                  { label: 'Slot', val: selectedSlot ? `${selectedSlot.label} (Level ${selectedSlot.floor})` : 'A-01' },
                  { label: 'Date', val: selectedDate },
                  { label: 'Time', val: `${startTime} — ${duration}h duration` },
                  { label: 'Vehicle', val: MOCK_VEHICLES.find(v => v.id === selectedVehicle)?.plate || '' },
                  { label: 'Total Paid', val: `₹${total}` },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                    <span className="text-xs text-[#6B7280] font-medium">{item.label}</span>
                    <span className="text-xs font-semibold text-[#111827]">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('bookings')}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                color: '#FFFFFF',
                background: '#3B5BFF',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 4px 14px rgba(59, 91, 255, 0.25)',
              }}
            >
              View My Bookings
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FA', paddingTop: '104px', paddingBottom: '96px' }}>
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
        {/* Back */}
        <button
          onClick={() => stepIdx > 0 ? setStep(STEPS[stepIdx - 1]) : onNavigate('location', { venue, slot: selectedSlot || undefined })}
          className="flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors mb-8"
        >
          <ArrowLeft size={16} /> {stepIdx > 0 ? 'Back to previous step' : 'Back to location overview'}
        </button>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className="flex-1 h-2 rounded-full transition-all duration-500"
                style={{
                  background: i <= stepIdx
                    ? '#3B5BFF'
                    : '#E5E7EB',
                }}
              />
            </div>
          ))}
        </div>

        {/* Step label */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#3B5BFF] mb-2 uppercase tracking-wide">
            Step {stepIdx + 1} of {STEPS.length} — {venue.name}
          </p>
          <h1 className="font-display font-bold text-3xl text-[#111827]">
            {step === 'slot' && 'Select your parking slot'}
            {step === 'datetime' && 'Pick your date & time'}
            {step === 'vehicle' && 'Which vehicle are you bringing?'}
            {step === 'payment' && 'Select payment method'}
            {step === 'confirm' && 'Review and confirm booking'}
          </h1>
        </div>

        {/* Step 1: Visual Slot Map is full-width in the 1280px container */}
        {step === 'slot' ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
            <VisualSlotMap
              initialSlot={selectedSlot}
              onSelectSlot={(s) => setSelectedSlot(s)}
              onConfirmSlot={(s) => {
                setSelectedSlot(s);
                setStep('datetime');
              }}
              confirmButtonText="Confirm Slot & Continue"
            />
          </div>
        ) : (
          /* Steps 2-5: Two-column split with sticky Order Summary on the right */
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Step 2: Date & Time */}
                  {step === 'datetime' && (
                    <div className="space-y-6 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
                      <div>
                        <label className="block text-sm text-[#111827] mb-2 font-semibold">Reservation Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          min="2026-09-14"
                          onChange={e => setSelectedDate(e.target.value)}
                          className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[#111827] text-sm focus:outline-none focus:border-[#3B5BFF]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#111827] mb-2 font-semibold">Expected Entry Time</label>
                        <div className="grid grid-cols-4 gap-2.5">
                          {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map(t => (
                            <button
                              key={t}
                              onClick={() => setStartTime(t)}
                              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                startTime === t
                                  ? 'text-white'
                                  : 'bg-[#F7F8FA] border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB]'
                              }`}
                              style={startTime === t ? { background: '#3B5BFF', boxShadow: '0 2px 6px rgba(59,91,255,0.25)' } : {}}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-[#111827] mb-2 font-semibold">Duration (Hours)</label>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setDuration(d => Math.max(1, d - 1))}
                            className="w-11 h-11 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] text-xl flex items-center justify-center hover:bg-[#E5E7EB] cursor-pointer"
                          >
                            −
                          </button>
                          <div className="text-center px-4">
                            <p className="font-display font-bold text-3xl text-[#111827] leading-none mb-1">{duration}</p>
                            <p className="text-xs text-[#6B7280] font-medium">hour{duration > 1 ? 's' : ''}</p>
                          </div>
                          <button
                            onClick={() => setDuration(d => Math.min(12, d + 1))}
                            className="w-11 h-11 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] text-xl flex items-center justify-center hover:bg-[#E5E7EB] cursor-pointer"
                          >
                            +
                          </button>
                          <div className="ml-4 flex-1 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl p-4">
                            <p className="text-xs text-[#6B7280] font-medium">Estimated cost (Slot {selectedSlot?.label || 'A-01'})</p>
                            <p className="font-display font-bold text-2xl text-[#111827]">₹{total}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Vehicle */}
                  {step === 'vehicle' && (
                    <div className="space-y-4">
                      {MOCK_VEHICLES.map(v => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVehicle(v.id)}
                          className="w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left shadow-sm cursor-pointer"
                          style={{
                            background: selectedVehicle === v.id ? 'rgba(59,91,255,0.04)' : '#FFFFFF',
                            border: selectedVehicle === v.id ? '2px solid #3B5BFF' : '1px solid #E5E7EB',
                          }}
                        >
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(59,91,255,0.1)' }}
                          >
                            {v.type === 'ev' ? <Zap size={22} color="#3B5BFF" /> : <Car size={22} color="#3B5BFF" />}
                          </div>
                          <div className="flex-1">
                            <p className="kiosk-plate font-bold text-base text-[#111827]">{v.plate}</p>
                            <p className="text-xs text-[#6B7280] mt-0.5">{v.brand} {v.model}, {v.color}</p>
                            {v.isFastagLinked && (
                              <span className="text-[11px] text-[#15803D] font-semibold mt-1 inline-block">FASTag linked ✓</span>
                            )}
                          </div>
                          {selectedVehicle === v.id && (
                            <div className="w-6 h-6 rounded-full bg-[#3B5BFF] flex items-center justify-center flex-shrink-0">
                              <Check size={14} color="white" />
                            </div>
                          )}
                        </button>
                      ))}
                      <button className="w-full py-3.5 rounded-xl border border-dashed border-[#D1D5DB] text-sm font-medium text-[#6B7280] hover:border-[#3B5BFF] hover:text-[#3B5BFF] transition-all bg-white cursor-pointer">
                        + Add another vehicle plate
                      </button>
                    </div>
                  )}

                  {/* Step 4: Payment */}
                  {step === 'payment' && (
                    <div className="space-y-4">
                      {[
                        { id: 'fastag', label: 'FASTag Auto-Pay (Zero Stop)', desc: 'Charged automatically on exit via NETC FASTag', badge: 'Recommended' },
                        { id: 'upi', label: 'UPI Instant / GPay / PhonePe', desc: 'Pre-pay now and receive entry gate QR pass' },
                        { id: 'card', label: 'Credit or Debit Card', desc: 'Visa, Mastercard, RuPay accepted securely' },
                      ].map(pm => (
                        <button
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id as typeof paymentMethod)}
                          className="w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left shadow-sm cursor-pointer"
                          style={{
                            background: paymentMethod === pm.id ? 'rgba(59,91,255,0.04)' : '#FFFFFF',
                            border: paymentMethod === pm.id ? '2px solid #3B5BFF' : '1px solid #E5E7EB',
                          }}
                        >
                          <div className="w-12 h-12 rounded-xl bg-[#3B5BFF]/10 flex items-center justify-center flex-shrink-0">
                            <CreditCard size={20} color="#3B5BFF" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-[#111827]">{pm.label}</p>
                              {pm.badge && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#15803D]">{pm.badge}</span>
                              )}
                            </div>
                            <p className="text-xs text-[#6B7280]">{pm.desc}</p>
                          </div>
                          {paymentMethod === pm.id && (
                            <div className="w-6 h-6 rounded-full bg-[#3B5BFF] flex items-center justify-center flex-shrink-0">
                              <Check size={14} color="white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 5: Confirm */}
                  {step === 'confirm' && (
                    <div className="rounded-2xl p-6 bg-white border border-[#E5E7EB] shadow-sm">
                      <h2 className="font-display font-semibold text-lg text-[#111827] mb-4">Reservation Summary</h2>
                      <div className="space-y-3">
                        {[
                          { label: 'Venue Location', val: venue.name },
                          { label: 'Selected Bay', val: selectedSlot ? `${selectedSlot.label} (Floor ${selectedSlot.floor})` : 'A-01' },
                          { label: 'Base Hourly Rate', val: `₹${slotPrice}/hr` },
                          { label: 'Date', val: selectedDate },
                          { label: 'Schedule', val: `${startTime} for ${duration} hours` },
                          { label: 'Registered Vehicle', val: MOCK_VEHICLES.find(v => v.id === selectedVehicle)?.plate || '' },
                          { label: 'Payment Channel', val: paymentMethod === 'fastag' ? 'FASTag on exit' : 'Pre-paid Online' },
                        ].map(item => (
                          <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6] last:border-0">
                            <span className="text-sm text-[#6B7280]">{item.label}</span>
                            <span className="text-sm font-semibold text-[#111827]">{item.val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-6 mt-4 border-t border-[#E5E7EB]">
                        <span className="font-display font-bold text-[#111827] text-lg">Total Due</span>
                        <span className="font-display font-bold text-3xl text-[#111827]">₹{total}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Next/Book Button with 12px 24px spec */}
              <button
                onClick={handleNext}
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#FFFFFF',
                  background: '#3B5BFF',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '24px',
                  boxShadow: '0 4px 16px rgba(59, 91, 255, 0.25)',
                }}
              >
                {step === 'confirm' ? 'Confirm & Reserve Bay' : 'Continue to next step'}
              </button>
            </div>

            {/* Right Column: Sticky Summary Panel (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#111827]">{venue.name}</h3>
                    <p className="text-xs text-[#6B7280] mt-1">{venue.address}, {venue.city}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#22C55E]/10 text-[#15803D]">
                    Guaranteed
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Slot Assigned:</span>
                    <span className="font-semibold text-[#111827]">
                      {selectedSlot ? `${selectedSlot.label} (Level ${selectedSlot.floor})` : 'A-01'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Hourly Tariff:</span>
                    <span className="font-semibold text-[#111827]">₹{slotPrice}/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Duration:</span>
                    <span className="font-semibold text-[#111827]">{duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Date & Time:</span>
                    <span className="font-semibold text-[#111827]">{selectedDate}, {startTime}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#6B7280]">Total Payable</p>
                    <p className="font-display font-bold text-2xl text-[#111827]">₹{total}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#15803D] font-medium block">FASTag or UPI</span>
                    <span className="text-[10px] text-[#6B7280]">Taxes included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
