import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  QrCode,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Navigation,
  Compass,
  Radio,
} from 'lucide-react';
import { useDemoAuth } from '../context/DemoAuthContext';
import { MOCK_BOOKINGS, MOCK_VEHICLES, MOCK_VENUES } from '../data/mockData';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, switchRole } = useDemoAuth();

  // Active mock booking
  const activeBooking = MOCK_BOOKINGS.find(b => b.status === 'upcoming' || b.status === 'active') || MOCK_BOOKINGS[0];

  // Walk-in simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [snackbarNotice, setSnackbarNotice] = useState<{
    plate: string;
    slot: string;
    venue: string;
    time: string;
  } | null>(null);

  const handleSimulateWalkin = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const randomSlot = `B1-${['A','B','C'][Math.floor(Math.random()*3)]}-${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}`;
      setSnackbarNotice({
        plate: 'KA 05 AB 4321',
        slot: randomSlot,
        venue: 'Phoenix Marketcity Parking',
        time: 'Just now',
      });
      setTimeout(() => setSnackbarNotice(null), 8000);
    }, 1200);
  };

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        background: '#F7F8FA',
        paddingTop: '104px',
        paddingBottom: '96px',
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        
        {/* ─── Top Header & Role Switcher Banner ─────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00C2A8] bg-[#00C2A8]/10 px-2.5 py-0.5 rounded-full border border-[#00C2A8]/20">
                Driver / User Portal
              </span>
              <span className="text-xs text-[#6B7280]">Demo Mode Active</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-[#111827]">
              Welcome back, {user.name || 'Ananya'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Your registered vehicle <span className="kiosk-plate font-bold text-[#111827]">KA 05 AB 4321</span> is paired with FASTag NETC auto-clearance.
            </p>
          </div>

          {/* Role switcher button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => {
                switchRole('owner');
                navigate('/owner-dashboard');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#3B5BFF] text-xs font-semibold text-[#111827] hover:text-[#3B5BFF] transition-all shadow-xs"
            >
              <span>Switch to Owner view</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate('/search')}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#FFFFFF',
                background: '#3B5BFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                cursor: 'pointer',
              }}
            >
              Find a lot
            </button>
          </div>
        </div>

        {/* ─── FULL-WIDTH ANPR KIOSK DEMO ───────── */}
        <div className="mb-8 rounded-xl border border-[#E5E7EB] bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00C2A8]" />
              <span className="text-[10px] font-bold tracking-wider text-[#6B7280] uppercase">Hardware Demo</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#111827] mb-1">
              Auto-Assign Gate System
            </h3>
            <p className="text-sm text-[#6B7280] leading-relaxed max-w-lg">
              Test how cameras recognize plates and trigger the barrier gate automatically.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => navigate('/kiosk')}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded border border-[#E5E7EB] bg-white hover:bg-[#F7F8FA] hover:border-[#D1D5DB] transition-all cursor-pointer text-[#111827]"
            >
              <p className="font-semibold text-sm">Open Display</p>
              <ArrowRight size={16} className="text-[#6B7280]" />
            </button>

            <button
              onClick={handleSimulateWalkin}
              disabled={isSimulating}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded border border-[#3B5BFF] bg-[#3B5BFF] hover:bg-[#3B5BFF]/90 transition-all cursor-pointer text-white disabled:opacity-50"
            >
              <p className="font-semibold text-sm">{isSimulating ? 'Running...' : 'Trigger Ping'}</p>
              <Radio size={16} />
            </button>
          </div>
        </div>

        {/* ─── Varied Stat Chips (Non-identical emphasis) ───────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          
          {/* Prominent Primary Stat Chip (4 cols) */}
          <div className="md:col-span-4 xl:col-span-4 rounded-xl p-5 bg-white border border-[#E5E7EB] flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#111827] bg-[#F3F4F6] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 border border-[#E5E7EB]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C2A8]" />
                  Active Session
                </span>
                <p className="font-display font-bold text-xl text-[#111827] mt-2">
                  Phoenix Marketcity Parking
                </p>
                <p className="text-xs text-[#6B7280]">
                  Bay <span className="font-mono font-bold text-[#111827]">{activeBooking.slot}</span> • Level B1 East Wing
                </p>
              </div>
              <div className="text-right">
                <span className="font-display font-bold text-2xl text-[#111827]">1h 42m</span>
                <p className="text-[10px] text-[#6B7280]">time elapsed</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F1F3F6] mt-1 text-xs">
              <span className="text-[#15803D] font-medium flex items-center gap-1">
                <CheckCircle2 size={13} /> Plate verified at Boom Barrier P2
              </span>
              <span className="font-semibold text-[#111827]">₹120 prepaid</span>
            </div>
          </div>

          {/* Secondary Stat Chip 1 (3 cols): FASTag Wallet Balance */}
          <div className="md:col-span-3 xl:col-span-3 rounded-2xl p-5 bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6B7280] font-medium">FASTag NETC Wallet</span>
                <div className="w-6 h-6 rounded-md bg-[#3B5BFF]/10 text-[#3B5BFF] flex items-center justify-center">
                  <CreditCard size={14} />
                </div>
              </div>
              <p className="font-display font-bold text-2xl text-[#111827]">₹1,450.00</p>
              <p className="text-[11px] text-[#15803D] mt-0.5 flex items-center gap-1">
                <span>✓ Auto-recharge threshold ₹300</span>
              </p>
            </div>
            <button
              onClick={() => alert('FASTag auto-debit has ₹1,450 available balance.')}
              className="mt-3 text-xs font-semibold text-[#3B5BFF] hover:underline text-left cursor-pointer"
            >
              + Quick Recharge ₹500
            </button>
          </div>

          {/* Secondary Stat Chip 2 (2 cols): Saved Vehicles */}
          <div className="md:col-span-2 xl:col-span-2 rounded-2xl p-5 bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6B7280] font-medium">Saved Vehicles</span>
                <div className="w-6 h-6 rounded-md bg-[#22C55E]/10 text-[#15803D] flex items-center justify-center">
                  <Car size={14} />
                </div>
              </div>
              <p className="font-display font-bold text-2xl text-[#111827]">2 Plates</p>
              <p className="kiosk-plate text-xs font-bold text-[#111827] mt-0.5">
                {MOCK_VEHICLES[0].plate}
              </p>
            </div>
            <p className="text-[11px] text-[#6B7280] mt-3">
              Tata Nexon EV • RFID Tag Synced
            </p>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 xl:col-span-3 rounded-2xl p-5 bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#6B7280] font-medium">Quick Links</span>
                <div className="w-6 h-6 rounded-md bg-[#3B5BFF]/10 text-[#3B5BFF] flex items-center justify-center">
                  <Navigation size={14} />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <button
                  onClick={() => navigate('/bookings')}
                  className="w-full text-left text-sm font-semibold text-[#111827] hover:text-[#3B5BFF] flex items-center justify-between bg-[#F7F8FA] px-3 py-2 rounded-lg border border-[#E5E7EB]"
                >
                  My Bookings
                  <ArrowRight size={14} className="text-[#6B7280]" />
                </button>
                <button
                  onClick={() => alert('Opening Payment Methods')}
                  className="w-full text-left text-sm font-semibold text-[#111827] hover:text-[#3B5BFF] flex items-center justify-between bg-[#F7F8FA] px-3 py-2 rounded-lg border border-[#E5E7EB]"
                >
                  Payment Methods
                  <ArrowRight size={14} className="text-[#6B7280]" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Visual Anchor: Boarding-Pass / Ticket-Style Booking Card ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-[#111827] flex items-center gap-2">
              <span>Your Active Digital Boarding Pass</span>
              <span className="text-[10px] uppercase font-bold text-[#111827] bg-[#F3F4F6] px-2 py-0.5 rounded border border-[#E5E7EB]">
              Live Pass
            </span>
            </h2>
            <span className="text-xs text-[#6B7280]">Show this to attendant or drive straight to barrier</span>
          </div>

          {/* Ticket Card Container with Perforations */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white rounded-2xl border border-[#E5E7EB] shadow-md overflow-hidden relative"
          >
            {/* Top gradient stripe */}
            <div className="h-2 w-full bg-[#3B5BFF]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 relative">
              
              {/* Left Main Boarding Pass Body (8 cols) */}
              <div className="lg:col-span-8 p-6 sm:p-8">
                
                {/* Header info */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold font-mono text-[#6B7280]">{activeBooking.id}</span>
                      <span className="text-[10px] font-semibold text-[#15803D] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full">
                        CONFIRMED & PARKED
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-[#111827]">
                      {activeBooking.venue}
                    </h3>
                    <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-1">
                      <MapPin size={13} className="text-[#3B5BFF]" />
                      Whitefield Main Rd, Bengaluru • Level B1 Underpass
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#6B7280]">Reserved Bay</p>
                    <p className="font-display font-bold text-3xl sm:text-4xl text-[#3B5BFF] tracking-tight">
                      {activeBooking.slot}
                    </p>
                  </div>
                </div>

                {/* Dashed line horizontal on mobile */}
                <div className="border-t border-dashed border-[#E5E7EB] my-5" />

                {/* Details Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div>
                    <span className="text-[11px] font-medium text-[#6B7280] block mb-0.5">Date</span>
                    <span className="text-sm font-semibold text-[#111827]">{activeBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-[#6B7280] block mb-0.5">Time Window</span>
                    <span className="text-sm font-semibold text-[#111827]">{activeBooking.startTime} – {activeBooking.endTime}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-[#6B7280] block mb-0.5">Vehicle Plate</span>
                    <span className="kiosk-plate text-xs font-bold text-[#111827] bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#E5E7EB] inline-block">
                      {activeBooking.plate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-[#6B7280] block mb-0.5">Barrier Gateway</span>
                    <span className="text-sm font-semibold text-[#15803D]">ANPR Gate P2</span>
                  </div>
                </div>

                {/* Wayfinding hint pill */}
                <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-xs text-[#111827]">
                    <Compass size={16} className="text-[#00C2A8]" />
                    <span><strong>Wayfinding:</strong> Follow Green LED overhead guides down Ramp 2 to Section A.</span>
                  </div>
                  <button
                    onClick={() => alert(`Navigating to slot ${activeBooking.slot}: Take Pillar A-12 right turn.`)}
                    className="text-xs font-semibold text-[#3B5BFF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Open Slot Navigator <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              {/* Perforation Notch Cutouts (desktop visual craft) */}
              
              {/* Right Tear-Off Stub (4 cols) with dashed border */}
              <div className="lg:col-span-4 p-6 sm:p-8 bg-[#FAFAFC] border-t lg:border-t-0 lg:border-l border-dashed border-[#D1D5DB] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Fast-Pass Stub</span>
                    <span className="text-[11px] font-semibold text-[#15803D]">NETC Synced</span>
                  </div>

                  {/* QR Code graphic container */}
                  <div className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col items-center justify-center text-center mb-4">
                    <div className="w-24 h-24 bg-[#111827] text-white p-2 rounded-lg flex items-center justify-center">
                      <QrCode size={72} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-mono text-[#6B7280] mt-2">SCAN AT KIOSK / ATTENDANT</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Total Rate:</span>
                      <span className="font-bold text-[#111827]">₹{activeBooking.amount}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Payment Mode:</span>
                      <span className="font-semibold text-[#00C2A8]">FASTag Auto-Debit</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E7EB] text-center">
                  <span className="text-[11px] text-[#6B7280]">
                    Auto-barrier opens upon vehicle plate approach.
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* ─── DATA-DENSE DASHBOARD CONTENT ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN (8 cols): History & Locations */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Recent Parking History */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#111827] flex items-center gap-2">
                  <Clock size={18} className="text-[#3B5BFF]" />
                  Recent Parking History
                </h3>
                <button onClick={() => navigate('/bookings')} className="text-xs font-semibold text-[#3B5BFF] hover:underline cursor-pointer">
                  View All
                </button>
              </div>
              <div className="divide-y divide-[#F1F3F6]">
                {MOCK_BOOKINGS.map((booking) => (
                  <div key={booking.id} className="p-4 sm:px-6 hover:bg-[#F9FAFB] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        booking.status === 'completed' ? 'bg-[#F3F4F6] text-[#6B7280]' : 'bg-[#00C2A8]/10 text-[#00C2A8]'
                      }`}>
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-[#111827]">{booking.venue}</h4>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          {booking.date} • {booking.startTime} - {booking.endTime}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-mono font-bold text-[#111827] bg-[#F3F4F6] px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                            {booking.plate}
                          </span>
                          <span className="text-[10px] text-[#6B7280]">Slot: {booking.slot}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <span className="font-bold text-[#111827]">₹{booking.amount}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${
                        booking.status === 'completed' 
                          ? 'bg-[#F3F4F6] text-[#6B7280]' 
                          : 'bg-[#22C55E]/10 text-[#15803D]'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
                {/* Extra mock row for 5th visit */}
                <div className="p-4 sm:px-6 hover:bg-[#F9FAFB] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] text-[#6B7280] flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#111827]">Manipal Hospital Parking</h4>
                      <p className="text-xs text-[#6B7280] mt-0.5">2026-09-02 • 10:15 - 12:45</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#111827] bg-[#F3F4F6] px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                          KA 05 AB 4321
                        </span>
                        <span className="text-[10px] text-[#6B7280]">Slot: A-42</span>
                      </div>
                    </div>
                  </div>
                  <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    <span className="font-bold text-[#111827]">₹80</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 bg-[#F3F4F6] text-[#6B7280]">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby/Recommended Locations Strip */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-[#111827] flex items-center gap-2">
                  <Navigation size={18} className="text-[#00C2A8]" />
                  Nearby Lots with EV Availability
                </h3>
                <button 
                  onClick={() => navigate('/search')}
                  className="text-xs font-semibold text-[#3B5BFF] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  Explore Map <ArrowRight size={12} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[MOCK_VENUES[0], MOCK_VENUES[4], MOCK_VENUES[2]].map((venue) => (
                  <div key={venue.id} className="rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-[#D1D5DB] transition-all cursor-pointer group">
                    <div className="h-24 w-full overflow-hidden relative">
                      <img src={venue.image} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-[#111827] shadow-sm">
                        {venue.distance}
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm text-[#111827] truncate">{venue.name}</h4>
                      <p className="text-[10px] text-[#6B7280] truncate mt-0.5">{venue.address}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#15803D]">{venue.availableSlots} open</span>
                        <span className="text-xs font-semibold text-[#111827]">₹{venue.pricePerHour}/hr</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (4 cols): Vehicles & Notifications */}
          <div className="lg:col-span-4 space-y-6">


            {/* Saved Vehicles */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-[#111827] flex items-center gap-2">
                  <Car size={16} className="text-[#3B5BFF]" />
                  Registered Vehicles
                </h3>
                <button className="text-[11px] font-semibold text-[#3B5BFF] hover:underline cursor-pointer">
                  + Add
                </button>
              </div>
              <div className="p-5 space-y-3">
                {MOCK_VEHICLES.slice(0, 2).map((vehicle) => (
                  <div key={vehicle.id} className="p-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#3B5BFF]/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                          <Car size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#111827]">{vehicle.brand} {vehicle.model}</p>
                          <p className="text-[10px] text-[#6B7280]">{vehicle.color}</p>
                        </div>
                      </div>
                      {vehicle.isFastagLinked && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#00C2A8] bg-[#00C2A8]/10 px-1.5 py-0.5 rounded border border-[#00C2A8]/20">
                          FASTag Synced
                        </span>
                      )}
                    </div>
                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                      <span className="kiosk-plate text-xs font-bold text-[#111827]">{vehicle.plate}</span>
                      <button className="text-[10px] font-semibold text-[#6B7280] hover:text-[#3B5BFF]">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications / Alerts */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5E7EB]">
                <h3 className="font-display font-bold text-base text-[#111827] flex items-center gap-2">
                  <Radio size={16} className="text-[#00C2A8]" />
                  Live Updates
                </h3>
              </div>
              <div className="divide-y divide-[#F1F3F6]">
                <div className="p-4 flex gap-3 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[#00C2A8] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#111827]">Parking Session Started</p>
                    <p className="text-[11px] text-[#6B7280] leading-relaxed mt-0.5">
                      Your vehicle KA 05 AB 4321 has been detected entering Phoenix Marketcity. Slot B1-A-04 reserved.
                    </p>
                    <span className="text-[9px] text-[#9CA3AF] mt-1 block">1h 42m ago</span>
                  </div>
                </div>
                <div className="p-4 flex gap-3 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[#E5E7EB] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#111827]">Low FASTag Balance Warning</p>
                    <p className="text-[11px] text-[#6B7280] leading-relaxed mt-0.5">
                      Your linked NETC wallet has fallen below the auto-recharge threshold (₹300).
                    </p>
                    <span className="text-[9px] text-[#9CA3AF] mt-1 block">Yesterday, 14:20</span>
                  </div>
                </div>
                <div className="p-4 flex gap-3 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-[#E5E7EB] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[#111827]">Receipt Available</p>
                    <p className="text-[11px] text-[#6B7280] leading-relaxed mt-0.5">
                      GST Invoice for your recent visit to Kempegowda Airport is ready to download.
                    </p>
                    <span className="text-[9px] text-[#9CA3AF] mt-1 block">Sep 10, 2026</span>
                  </div>
                </div>
              </div>
            </div>



          </div>

        </div>

      </div>

      {/* ─── Simulation Walk-in Assigned Snackbar / Toast ───────── */}
      <AnimatePresence>
        {snackbarNotice && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 max-w-md w-full"
          >
            <div
              className="p-5 rounded-2xl bg-white border-2 border-[#3B5BFF] shadow-2xl"
              style={{
                boxShadow: '0 20px 40px -10px rgba(59, 91, 255, 0.3)',
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#3B5BFF] text-white flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#111827]">
                      ANPR Gate Auto-Assigned!
                    </h4>
                    <p className="text-[11px] text-[#6B7280]">Barrier gate opened automatically</p>
                  </div>
                </div>
                <button
                  onClick={() => setSnackbarNotice(null)}
                  className="text-xs text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] my-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#6B7280]">Vehicle Plate:</span>
                  <span className="kiosk-plate font-bold text-[#111827]">{snackbarNotice.plate}</span>
                </div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#6B7280]">Allocated Slot:</span>
                  <span className="font-display font-bold text-base text-[#3B5BFF]">{snackbarNotice.slot}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B7280]">Location:</span>
                  <span className="font-medium text-[#111827]">{snackbarNotice.venue}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#15803D] font-medium flex items-center gap-1">
                  <CheckCircle2 size={13} /> Sensor synced with Owner Dashboard
                </span>
                <button
                  onClick={() => setSnackbarNotice(null)}
                  className="font-semibold text-[#3B5BFF] hover:underline cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
