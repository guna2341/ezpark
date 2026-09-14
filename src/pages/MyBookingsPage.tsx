import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, CheckCircle, Clock, XCircle, Bike } from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_VEHICLES } from '../data/mockData';

interface MyBookingsPageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function MyBookingsPage({ onNavigate: _onNavigate }: MyBookingsPageProps) {
  const [tab, setTab] = useState<'bookings' | 'vehicles'>('bookings');

  const statusConfig = {
    upcoming: { label: 'Upcoming', color: '#3B5BFF', bg: 'rgba(59, 91, 255, 0.1)', icon: Clock },
    active: { label: 'Active', color: '#15803D', bg: 'rgba(34, 197, 94, 0.12)', icon: CheckCircle },
    completed: { label: 'Completed', color: '#6B7280', bg: '#F3F4F6', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', icon: XCircle },
  };

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FA', paddingTop: '104px', paddingBottom: '96px' }}>
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-[#111827]">Account & Bookings</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage active parking sessions, vehicle license plates, and FASTag integration</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-1.5 mb-8 w-fit shadow-sm">
          {(['bookings', 'vehicles'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm font-semibold px-5 py-2.5 rounded-lg capitalize transition-all cursor-pointer ${
                tab === t ? 'text-white' : 'text-[#6B7280] hover:text-[#111827]'
              }`}
              style={tab === t ? { background: 'linear-gradient(135deg, #3B5BFF, #00C2A8)', boxShadow: '0 2px 6px rgba(59, 91, 255, 0.25)' } : {}}
            >
              {t === 'bookings' ? 'My Bookings & Receipts' : 'Registered Vehicles & FASTag'}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main list (8 cols) */}
          <div className="lg:col-span-8">
            {tab === 'bookings' ? (
              <div className="space-y-4">
                {MOCK_BOOKINGS.map((booking, i) => {
                  const cfg = statusConfig[booking.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm"
                    >
                      {booking.status === 'active' && (
                        <div
                          className="h-1.5 w-full"
                          style={{ background: 'linear-gradient(135deg, #3B5BFF, #00C2A8)' }}
                        />
                      )}
                      {/* 24px standard card padding */}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <span className="text-xs font-mono font-bold text-[#6B7280]">{booking.id}</span>
                              <span
                                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                                style={{ background: cfg.bg, color: cfg.color }}
                              >
                                <StatusIcon size={12} />
                                {cfg.label}
                              </span>
                            </div>
                            <h3 className="font-display font-semibold text-[#111827] text-lg">{booking.venue}</h3>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-display font-bold text-2xl text-[#111827]">₹{booking.amount}</p>
                            <span className="text-[11px] text-[#6B7280]">FASTag auto-debit</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-3 my-2 border-y border-[#F3F4F6]">
                          {[
                            { label: 'Slot Bay', val: booking.slot },
                            { label: 'Reservation Date', val: booking.date },
                            { label: 'Session Duration', val: `${booking.startTime} – ${booking.endTime}` },
                          ].map(item => (
                            <div key={item.label}>
                              <p className="text-[11px] text-[#6B7280] mb-0.5 font-medium">{item.label}</p>
                              <p className="text-sm font-semibold text-[#111827]">{item.val}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Car size={16} color="#6B7280" />
                            <span className="kiosk-plate text-sm font-bold text-[#111827]">{booking.plate}</span>
                          </div>
                          {booking.status === 'upcoming' && (
                            <button className="flex items-center gap-1 text-xs font-semibold text-[#EF4444] hover:text-[#DC2626] transition-colors cursor-pointer">
                              Cancel Reservation
                            </button>
                          )}
                          {booking.status === 'active' && (
                            <div className="flex items-center gap-2">
                              <span className="pulse-dot bg-[#22C55E]" style={{ width: '8px', height: '8px' }} />
                              <span className="text-xs font-semibold text-[#15803D]">Currently Parked</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {MOCK_VEHICLES.map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl p-6 bg-white border border-[#E5E7EB] shadow-sm"
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(59, 91, 255, 0.08)', border: '1px solid rgba(59, 91, 255, 0.2)' }}
                      >
                        {v.type === 'bike'
                          ? <Bike size={28} color="#3B5BFF" />
                          : v.type === 'ev'
                          ? <Zap size={28} color="#00C2A8" />
                          : <Car size={28} color="#3B5BFF" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="kiosk-plate font-bold text-[#111827] text-lg">{v.plate}</p>
                          {v.isFastagLinked && (
                            <span className="text-[11px] text-[#15803D] bg-[#22C55E]/10 border border-[#22C55E]/20 font-semibold px-2.5 py-0.5 rounded-full">
                              FASTag Linked ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280] mt-1">{v.brand} {v.model} ({v.color})</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
              <h3 className="font-display font-semibold text-lg text-[#111827]">Account Health</h3>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] font-medium">FASTag NETC Gateway</p>
                  <p className="text-sm font-semibold text-[#15803D] mt-1 flex items-center gap-1.5">
                    <CheckCircle size={15} /> Active & Connected
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] font-medium">Automatic Gate Clearance</p>
                  <p className="text-sm font-semibold text-[#111827] mt-1">2 Registered Plates</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] font-medium">Total Parking Hours Logged</p>
                  <p className="text-xl font-bold text-[#111827] mt-1">48.5 hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
