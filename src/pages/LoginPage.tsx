import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Building2,
  Car,
  KeyRound,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useDemoAuth, type UserRole } from '../context/DemoAuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useDemoAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [nameInput, setNameInput] = useState('');
  const [credentialInput, setCredentialInput] = useState('');
  const [plateInput, setPlateInput] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    login(selectedRole, nameInput.trim() || undefined);
    if (selectedRole === 'owner') {
      navigate('/owner-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  const handleInstantLaunch = (role: UserRole) => {
    login(role);
    navigate(role === 'owner' ? '/owner-dashboard' : '/user-dashboard');
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#FFFFFF]"
      style={{
        paddingTop: '104px',
        paddingBottom: '80px',
      }}
    >
      {/* Clean background without ambient glows */}
      <div className="absolute inset-0 bg-[#F9FAFB] pointer-events-none" />

      {/* Global Centered Max-Width Container */}
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ─── Left Asymmetric Column: Visual Moment ─────────────── */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Live demo tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] mb-6 shadow-sm w-fit">
              <span className="text-[11px] font-semibold text-[#3B5BFF] bg-[#3B5BFF]/10 px-2 py-0.5 rounded">
                SIMULATED ENVIRONMENT
              </span>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse flex-shrink-0" />
              <span className="text-xs font-medium text-[#111827]">
                Live Edge Cameras & FASTag Telemetry
              </span>
            </div>

            <h1 className="font-display font-bold text-[34px] sm:text-[44px] leading-[1.1] tracking-tight text-[#111827] mb-4">
              Step inside India's fastest{' '}
              <span className="text-[#3B5BFF]">ticketless parking</span> network.
            </h1>

            <p className="text-[16px] sm:text-[17px] leading-relaxed text-[#6B7280] mb-8 max-w-lg">
              Explore role-tailored dashboards built for commercial property operators and everyday drivers. Zero setup, zero real card details.
            </p>

            {/* Clean Visual Moment: Premium SaaS Widget */}
            <div className="relative rounded-2xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden max-w-[480px]">
              {/* Premium Header */}
              <div className="bg-[#FAFAFA] border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-[#111827]">Live Occupancy Feed</h3>
                  <p className="text-xs text-[#6B7280]">Phoenix Marketcity • Level B1</p>
                </div>
                <span className="text-[10px] font-bold text-[#15803D] bg-[#22C55E]/10 px-2 py-1 rounded-full border border-[#22C55E]/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  Live Sync
                </span>
              </div>
              
              {/* Grid Body */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'A-01', status: 'occ' }, { id: 'A-02', status: 'occ' }, 
                    { id: 'A-03', status: 'avail' }, { id: 'A-04', status: 'assigned' },
                    { id: 'B-01', status: 'occ' }, { id: 'B-02', status: 'avail' },
                    { id: 'B-03', status: 'occ' }, { id: 'B-04', status: 'occ' },
                  ].map(slot => (
                    <div
                      key={slot.id}
                      className={`h-24 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all border-2 ${
                        slot.status === 'assigned'
                          ? 'border-[#3B5BFF] bg-[#3B5BFF]/5 text-[#3B5BFF]'
                          : slot.status === 'avail'
                          ? 'border-[#22C55E]/40 bg-[#22C55E]/5 text-[#15803D]'
                          : 'border-[#F3F4F6] bg-[#F9FAFB] text-[#9CA3AF]'
                      }`}
                    >
                      <span className="text-[13px] mb-1.5">{slot.id}</span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        slot.status === 'assigned' ? 'bg-[#3B5BFF]/10' : 
                        slot.status === 'avail' ? 'bg-[#22C55E]/10' : 'bg-[#E5E7EB] text-[#6B7280]'
                      }`}>
                        {slot.status === 'assigned' ? 'Booking' : slot.status === 'avail' ? 'Open' : 'Parked'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Asymmetric Column: Auth & Role Selector Card ── */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div
              className="w-full max-w-[500px] bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-7 sm:p-9 relative"
            >
              {/* Card top banner */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[#111827] font-bold text-sm">
                      P
                    </div>
                    <span className="font-display font-bold text-lg text-[#111827]">ParkEZ Demo Auth</span>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] text-[#6B7280]">
                    Frontend Mock
                  </span>
                </div>
                <h2 className="font-display font-bold text-2xl text-[#111827]">Select reviewer role</h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Choose which perspective you want to evaluate. You can switch at any time in the navbar.
                </p>
              </div>

              {/* Role selector cards: Deliberate personality & active treatment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {/* Owner Role Card */}
                <button
                  type="button"
                  id="login-role-owner-btn"
                  onClick={() => setSelectedRole('owner')}
                  className={`p-4 rounded-xl text-left transition-all relative cursor-pointer border ${
                    selectedRole === 'owner'
                      ? 'border-[#3B5BFF] bg-[#3B5BFF]/5 ring-1 ring-[#3B5BFF]/30'
                      : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        selectedRole === 'owner'
                          ? 'bg-[#3B5BFF] text-white shadow-sm'
                          : 'bg-[#F9FAFB] text-[#6B7280]'
                      }`}
                    >
                      <Building2 size={18} />
                    </div>
                    {selectedRole === 'owner' ? (
                      <CheckCircle2 size={16} className="text-[#3B5BFF]" />
                    ) : (
                      <KeyRound size={14} className="text-[#9CA3AF]" />
                    )}
                  </div>
                  <p className="font-display font-bold text-sm text-[#111827]">Parking Owner</p>
                  <p className="text-[11px] text-[#6B7280] mt-1 leading-normal">
                    Layout designer, slot pricing, occupancy feeds & live analytics.
                  </p>
                </button>

                {/* User / Driver Role Card */}
                <button
                  type="button"
                  id="login-role-user-btn"
                  onClick={() => setSelectedRole('user')}
                  className={`p-4 rounded-xl text-left transition-all relative cursor-pointer border ${
                    selectedRole === 'user'
                      ? 'border-[#00C2A8] bg-[#00C2A8]/5 ring-1 ring-[#00C2A8]/30'
                      : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        selectedRole === 'user'
                          ? 'bg-[#00C2A8] text-white shadow-sm'
                          : 'bg-[#F9FAFB] text-[#6B7280]'
                      }`}
                    >
                      <Car size={18} />
                    </div>
                    {selectedRole === 'user' ? (
                      <CheckCircle2 size={16} className="text-[#00C2A8]" />
                    ) : (
                      <MapPin size={14} className="text-[#9CA3AF]" />
                    )}
                  </div>
                  <p className="font-display font-bold text-sm text-[#111827]">Driver / User</p>
                  <p className="text-[11px] text-[#6B7280] mt-1 leading-normal">
                    Active boarding pass, booking history, FASTag wallet & walk-in entry.
                  </p>
                </button>
              </div>

              {/* Form adapting labels cosmetically */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    {selectedRole === 'owner' ? 'Facility Operator / Owner Name' : 'Driver / Account Holder Name'}
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    placeholder={selectedRole === 'owner' ? 'e.g. Rajesh Iyer' : 'e.g. Ananya Krishnan'}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-lg text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B5BFF] focus:ring-1 focus:ring-[#3B5BFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    {selectedRole === 'owner' ? 'Business Email or Organization' : 'Phone or Registered Email'}
                  </label>
                  <input
                    type="text"
                    value={credentialInput}
                    onChange={e => setCredentialInput(e.target.value)}
                    placeholder={selectedRole === 'owner' ? 'owner@luxproperties.in' : 'ananya.k@gmail.com'}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-lg text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B5BFF] focus:ring-1 focus:ring-[#3B5BFF] transition-all"
                  />
                </div>

                {selectedRole === 'user' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                      Vehicle Plate Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={plateInput}
                      onChange={e => setPlateInput(e.target.value)}
                      placeholder="KA 05 AB 4321"
                      className="kiosk-plate uppercase w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5E7EB] rounded-lg text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8] transition-all"
                    />
                  </motion.div>
                )}

                {/* Primary CTA button — 12px 24px button spec */}
                <button
                  type="submit"
                  id="login-submit-cta-btn"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#FFFFFF',
                    background: '#3B5BFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
                >
                  <span>Continue as {selectedRole === 'owner' ? 'Parking Owner' : 'Driver / User'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Instant 1-click pills for quick evaluation */}
              <div className="mt-5 pt-4 border-t border-[#F1F3F6]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#6B7280] flex items-center gap-1">
                    <Sparkles size={12} className="text-[#3B5BFF]" />
                    Instant 1-Click Launch:
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInstantLaunch('owner')}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all text-center"
                  >
                    Enter Owner Dash
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInstantLaunch('user')}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-[#E5E7EB] text-[#111827] hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-all text-center"
                  >
                    Enter User Dash
                  </button>
                </div>
              </div>

              {/* Small caption */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-[#6B7280]">
                <ShieldCheck size={13} className="text-[#15803D]" />
                <span>This is a demo — no real account or password needed.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
