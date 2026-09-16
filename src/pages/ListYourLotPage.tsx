import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Zap, TrendingUp, CheckCircle, ArrowRight,
  ChevronRight, DollarSign, Camera, Check,
  Sparkles
} from 'lucide-react';

interface ListYourLotProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function ListYourLotPage({ onNavigate }: ListYourLotProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const wizardRef = useRef<HTMLDivElement>(null);

  // Form State
  const [facilityName, setFacilityName] = useState('Prestige Tech Cloud Car Park');
  const [address, setAddress] = useState('Navarathna Agrahara, Devanahalli');
  const [city, setCity] = useState('Bengaluru');
  const [category, setCategory] = useState('Tech Park');
  const [amenities, setAmenities] = useState<string[]>(['EV Charging', 'CCTV', 'FASTag', 'Covered']);

  const [totalSlots, setTotalSlots] = useState(350);
  const [floorCount, setFloorCount] = useState(3);
  const [hardwareType, setHardwareType] = useState('anpr');
  const [evSlots, setEvSlots] = useState(24);
  const [bikeSlots, setBikeSlots] = useState(60);

  const [baseRate, setBaseRate] = useState(40);
  const [surgeEnabled, setSurgeEnabled] = useState(true);
  const [overnightRate, setOvernightRate] = useState(300);
  const [settlementVpa, setSettlementVpa] = useState('prestige.parking@icici');

  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleAmenity = (item: string) => {
    setAmenities(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const scrollToWizard = () => {
    setTimeout(() => {
      wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFinishDeployment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const estimatedMonthly = Math.round(totalSlots * baseRate * 8.5 * 30 * 0.82);

  // Shared styles
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#FFFFFF',
    border: '1.5px solid #D1D5DB',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '8px',
    letterSpacing: '0.01em',
  };

  return (
    <div className="min-h-screen" style={{ background: '#FFFFFF' }}>
      {/* ─── 1. HERO SECTION ─── */}
      <section
        className="relative overflow-hidden"
        style={{ background: '#FFFFFF', paddingTop: '110px', paddingBottom: '96px' }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Column: Headline, subheadline, single CTA */}
            <div className="lg:col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B5BFF]/10 border border-[#3B5BFF]/20 text-[#3B5BFF] text-xs font-semibold" style={{ alignSelf: 'flex-start' }}>
                <Sparkles size={13} />
                ParkEZ Host Onboarding
              </div>

              <h1 className="font-display font-bold text-[#111827] leading-[1.08] tracking-tight" style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', margin: 0 }}>
                Monetize your parking bays with intelligent automation.
              </h1>

              <p className="text-[17px] text-[#6B7280] leading-relaxed max-w-xl" style={{ margin: 0 }}>
                Transform underutilized real estate into an automated revenue engine. Connect your gates, standard CCTV cameras, and bays to ParkEZ in minutes — accept instant FASTag payments with zero hardware lock-in.
              </p>

              <div className="flex items-center gap-4 flex-wrap" style={{ marginTop: '8px' }}>
                <button
                  id="list-lot-hero-cta"
                  onClick={scrollToWizard}
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#FFFFFF',
                    background: '#3B5BFF',
                    padding: '16px 32px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(59, 91, 255, 0.30)',
                    transition: 'transform 0.15s ease, filter 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  Get Started — List Your Facility
                  <ArrowRight size={16} />
                </button>

                <span className="text-xs text-[#6B7280] flex items-center gap-1.5 font-medium">
                  <CheckCircle size={14} className="text-[#22C55E]" />
                  Takes 3 mins · Zero upfront fees
                </span>
              </div>
            </div>

            {/* Right Column: Live telemetry card */}
            <div className="lg:col-span-5">
              <div
                className="rounded-2xl bg-white border border-[#E5E7EB]"
                style={{ padding: '24px', boxShadow: '0 12px 40px rgba(16, 24, 40, 0.10)' }}
              >
                {/* Card header */}
                <div
                  className="flex items-center justify-between"
                  style={{ paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #E5E7EB' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="font-display font-semibold text-xs text-[#111827]">
                      ParkEZ Edge Controller Telemetry
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6B7280]">GATE-01 ONLINE</span>
                </div>

                {/* ANPR camera feed */}
                <div
                  className="rounded-xl overflow-hidden relative bg-[#111827] flex items-center justify-center"
                  style={{ height: '180px', marginBottom: '16px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80"
                    alt="ANPR barrier camera"
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div
                    className="absolute border-2 border-[#22C55E] rounded-lg bg-black/60 backdrop-blur-sm"
                    style={{ bottom: '16px', left: '16px', padding: '6px 10px' }}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-[#22C55E] font-mono font-bold">
                      <Camera size={11} /> ANPR MATCH: KA 05 AB 4321
                    </div>
                    <div className="text-[9px] text-white/80 font-mono" style={{ marginTop: '2px' }}>
                      Barrier Auto-Lift · FASTag Linked
                    </div>
                  </div>
                </div>

                {/* Metric readouts */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]"
                    style={{ padding: '14px 16px' }}
                  >
                    <p className="text-[11px] text-[#6B7280]" style={{ margin: 0 }}>Live Occupancy</p>
                    <p className="font-display font-bold text-lg text-[#111827]" style={{ margin: '4px 0 2px' }}>94.2%</p>
                    <span className="text-[10px] text-[#15803D] font-medium">+18% vs unautomated</span>
                  </div>
                  <div
                    className="rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]"
                    style={{ padding: '14px 16px' }}
                  >
                    <p className="text-[11px] text-[#6B7280]" style={{ margin: 0 }}>Today's Settlements</p>
                    <p className="font-display font-bold text-lg text-[#111827]" style={{ margin: '4px 0 2px' }}>₹48,320</p>
                    <span className="text-[10px] text-[#3B5BFF] font-medium">Daily direct payout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. VALUE PROPOSITION GRID ─── */}
      <section
        className="border-t border-b border-[#E5E7EB]"
        style={{ background: '#F7F8FA', paddingTop: '96px', paddingBottom: '96px' }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
          <div className="text-center max-w-2xl mx-auto" style={{ marginBottom: '56px' }}>
            <h2
              className="font-display font-bold text-[#111827] leading-tight"
              style={{ fontSize: 'clamp(26px, 3vw, 36px)', marginBottom: '12px' }}
            >
              Engineered for commercial real estate owners.
            </h2>
            <p className="text-[15px] text-[#6B7280]" style={{ margin: 0 }}>
              Eliminate ticket printing costs, staff overhead, and cash pilferage with full-stack automation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <DollarSign size={24} />,
                color: '#3B5BFF',
                bg: 'rgba(59,91,255,0.08)',
                title: 'Automated FASTag & UPI Revenue',
                body: 'Direct automated daily settlements to your commercial bank account. 100% digital audit trails with zero cashier leakages or manual ticket reconciliation.',
              },
              {
                icon: <ShieldCheck size={24} />,
                color: '#00C2A8',
                bg: 'rgba(0,194,168,0.08)',
                title: 'Camera-First ANPR Integration',
                body: '99.8% license plate recognition accuracy running on your existing RTSP cameras or standard IP feeds. No expensive proprietary barrier hardware required.',
              },
              {
                icon: <TrendingUp size={24} />,
                color: '#FF6B4A',
                bg: 'rgba(255,107,74,0.08)',
                title: 'Dynamic AI Surge Pricing',
                body: 'Automatically adjust hourly rates based on live venue demand, peak traffic windows, and mall footfall to maximize total revenue per square foot.',
              },
            ].map(card => (
              <div
                key={card.title}
                className="bg-white border border-[#E5E7EB] rounded-2xl"
                style={{ padding: '28px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="rounded-xl flex items-center justify-center"
                  style={{ width: '52px', height: '52px', background: card.bg, color: card.color, marginBottom: '20px' }}
                >
                  {card.icon}
                </div>
                <h3
                  className="font-display font-bold text-[#111827]"
                  style={{ fontSize: '18px', marginBottom: '10px' }}
                >
                  {card.title}
                </h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed" style={{ margin: 0 }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. HOW IT WORKS — HORIZONTAL TIMELINE ─── */}
      <section style={{ background: '#FFFFFF', paddingTop: '96px', paddingBottom: '96px' }}>
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
          <div className="text-center max-w-2xl mx-auto" style={{ marginBottom: '64px' }}>
            <span className="text-xs font-semibold text-[#3B5BFF] uppercase tracking-wider">
              Owner Deployment Flow
            </span>
            <h2
              className="font-display font-bold text-[#111827] leading-tight"
              style={{ fontSize: 'clamp(26px, 3vw, 36px)', marginTop: '8px', marginBottom: '12px' }}
            >
              How it works for lot operators
            </h2>
            <p className="text-[15px] text-[#6B7280]" style={{ margin: 0 }}>
              From setup to your first automatic FASTag payout in four streamlined phases.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-[#E5E7EB] z-0" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
              {[
                { step: '01', title: 'Register & Map Bays', desc: 'Input location address, total capacity, and floor breakdown using our visual layout tool.' },
                { step: '02', title: 'Connect Cameras / Gate', desc: 'Link your existing CCTV stream or install our plug-and-play ANPR edge gateway box.' },
                { step: '03', title: 'Configure Pricing Rules', desc: 'Set base hourly rates, EV charging rates, and automated peak surge caps.' },
                { step: '04', title: 'Go Live & Earn Daily', desc: 'Drivers discover your lot on the app. Receive direct daily UPI settlements.' },
              ].map(item => (
                <div key={item.step} className="flex flex-col items-center text-center" style={{ gap: '16px' }}>
                  <div
                    className="font-display font-bold text-lg flex items-center justify-center rounded-2xl bg-white border-2 border-[#3B5BFF] text-[#3B5BFF] shadow-sm"
                    style={{ width: '56px', height: '56px', flexShrink: 0 }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#111827]" style={{ fontSize: '16px', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-[#6B7280] leading-relaxed" style={{ margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. CLOSING CTA BAND ─── */}
      <section
        className="w-full relative overflow-hidden"
        style={{
          background: '#3B5BFF',
          paddingTop: '96px',
          paddingBottom: '96px',
        }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="font-display font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginBottom: '16px' }}
            >
              Ready to convert empty bays into predictable profit?
            </h2>
            <p className="text-white/90 leading-relaxed max-w-xl mx-auto" style={{ fontSize: '17px', marginBottom: '40px' }}>
              Join over 240+ commercial parking locations across Bengaluru, Hyderabad, and Mumbai on the ParkEZ Network.
            </p>
            <button
              onClick={scrollToWizard}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: '#111827',
                background: '#FFFFFF',
                padding: '16px 36px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <span>Launch Onboarding Wizard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── 5. FOUR-STEP WIZARD ─── */}
      <div
        ref={wizardRef}
        id="onboarding-wizard-section"
        className="border-t border-[#E5E7EB]"
        style={{ background: '#F7F8FA', paddingTop: '96px', paddingBottom: '96px' }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">

          {/* Section heading */}
          <div className="text-center max-w-2xl mx-auto" style={{ marginBottom: '48px' }}>
            <span className="text-xs font-semibold text-[#3B5BFF] uppercase tracking-wider">
              Operator Self-Serve Registration
            </span>
            <h2
              className="font-display font-bold text-[#111827]"
              style={{ fontSize: 'clamp(24px, 2.5vw, 32px)', marginTop: '8px', marginBottom: '10px' }}
            >
              Facility Registration Wizard
            </h2>
            <p className="text-[15px] text-[#6B7280]" style={{ margin: 0 }}>
              Complete all 4 steps below to deploy your parking lot onto the live grid.
            </p>
          </div>

          {/* Constrained wizard column */}
          <div className="max-w-[800px] mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ── Progress stepper ── */}
            <div
              className="bg-white border border-[#E5E7EB] rounded-2xl"
              style={{ padding: '20px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center justify-between relative">
                <div className="absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-[#E5E7EB] z-0" />
                {[
                  { num: 1, label: 'Location' },
                  { num: 2, label: 'Layout & Bays' },
                  { num: 3, label: 'Pricing & Payout' },
                  { num: 4, label: 'Review & Deploy' },
                ].map(s => {
                  const isCompleted = currentStep > s.num;
                  const isCurrent = currentStep === s.num;
                  return (
                    <div
                      key={s.num}
                      onClick={() => { if (s.num < currentStep) setCurrentStep(s.num); }}
                      className="relative z-10 flex flex-col items-center cursor-pointer"
                      style={{ gap: '6px', opacity: s.num > currentStep ? 0.45 : 1, transition: 'opacity 0.2s' }}
                    >
                      <div
                        className="rounded-full flex items-center justify-center font-display font-bold text-xs transition-all"
                        style={{
                          width: '36px',
                          height: '36px',
                          background: isCompleted ? '#22C55E' : isCurrent ? '#3B5BFF' : '#FFFFFF',
                          color: isCompleted || isCurrent ? '#FFFFFF' : '#6B7280',
                          border: isCompleted || isCurrent ? 'none' : '2px solid #D1D5DB',
                          boxShadow: isCurrent ? '0 0 0 4px rgba(59,91,255,0.12)' : 'none',
                        }}
                      >
                        {isCompleted ? <Check size={14} /> : s.num}
                      </div>
                      <span
                        className="text-[11px] font-semibold whitespace-nowrap"
                        style={{ color: isCurrent ? '#3B5BFF' : '#6B7280' }}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Wizard card ── */}
            <div
              className="bg-white border border-[#E5E7EB] rounded-2xl"
              style={{ padding: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              {isSubmitted ? (
                /* Success state */
                <div className="text-center" style={{ padding: '24px 0' }}>
                  <div
                    className="rounded-full flex items-center justify-center mx-auto text-[#22C55E]"
                    style={{ width: '72px', height: '72px', background: 'rgba(34,197,94,0.12)', marginBottom: '24px' }}
                  >
                    <CheckCircle size={36} />
                  </div>
                  <h3 className="font-display font-bold text-[#111827]" style={{ fontSize: '24px', marginBottom: '12px' }}>
                    Facility Registered Successfully!
                  </h3>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-md mx-auto" style={{ marginBottom: '32px' }}>
                    <strong>{facilityName}</strong> has been allocated node ID{' '}
                    <span className="font-mono font-bold text-[#111827]">PKZ-BLR-8924</span>. Your telemetry bridge and FASTag toll clearance are initialized.
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <button
                      onClick={() => onNavigate('dashboard')}
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#FFFFFF',
                        background: '#3B5BFF',
                        padding: '13px 28px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Open Facility in Dashboard
                    </button>
                    <button
                      onClick={() => onNavigate('search')}
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#374151',
                        background: '#FFFFFF',
                        padding: '13px 28px',
                        borderRadius: '10px',
                        border: '1.5px solid #E5E7EB',
                        cursor: 'pointer',
                      }}
                    >
                      View in Search Grid
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFinishDeployment}>

                  {/* ════ STEP 1: Location ════ */}
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div style={{ marginBottom: '28px' }}>
                        <h3 className="font-display font-bold text-[#111827]" style={{ fontSize: '20px', marginBottom: '6px' }}>
                          Step 1: Facility Location & Identity
                        </h3>
                        <p className="text-[13px] text-[#6B7280]" style={{ margin: 0 }}>
                          Enter the physical premises details where drivers will park.
                        </p>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Facility / Car Park Name *</label>
                        <input
                          required
                          value={facilityName}
                          onChange={e => setFacilityName(e.target.value)}
                          placeholder="e.g. Prestige Tech Cloud Car Park"
                          style={inputStyle}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5" style={{ marginBottom: '20px' }}>
                        <div>
                          <label style={labelStyle}>Street Address *</label>
                          <input
                            required
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="e.g. Navarathna Agrahara, Airport Rd"
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>City / Region *</label>
                          <input
                            required
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            placeholder="e.g. Bengaluru"
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Property Category</label>
                        <select
                          value={category}
                          onChange={e => setCategory(e.target.value)}
                          style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                          <option value="Tech Park">Commercial Tech Park / SEZ</option>
                          <option value="Mall">Shopping Mall / Retail Center</option>
                          <option value="Hospital">Hospital / Healthcare Campus</option>
                          <option value="Airport">Airport / Transit Hub</option>
                          <option value="Standalone">Standalone Private Car Park</option>
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle}>Facility Amenities (select all available)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {['EV Charging', 'CCTV 24/7', 'FASTag Reader', 'Covered / Indoor', 'Valet Attendant', 'Wheelchair Access'].map(item => {
                            const active = amenities.includes(item);
                            return (
                              <div
                                key={item}
                                onClick={() => toggleAmenity(item)}
                                className="flex items-center gap-2.5 cursor-pointer rounded-xl border transition-all"
                                style={{
                                  padding: '10px 14px',
                                  background: active ? 'rgba(59,91,255,0.05)' : '#FAFAFA',
                                  borderColor: active ? '#3B5BFF' : '#E5E7EB',
                                  color: active ? '#3B5BFF' : '#6B7280',
                                  fontSize: '13px',
                                  fontWeight: 500,
                                }}
                              >
                                <div
                                  className="rounded flex items-center justify-center text-white text-[10px] flex-shrink-0"
                                  style={{ width: '18px', height: '18px', background: active ? '#3B5BFF' : '#D1D5DB', transition: 'background 0.15s' }}
                                >
                                  {active && '✓'}
                                </div>
                                {item}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ════ STEP 2: Layout & Hardware ════ */}
                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div style={{ marginBottom: '28px' }}>
                        <h3 className="font-display font-bold text-[#111827]" style={{ fontSize: '20px', marginBottom: '6px' }}>
                          Step 2: Capacity & Gate Hardware
                        </h3>
                        <p className="text-[13px] text-[#6B7280]" style={{ margin: 0 }}>
                          Define the total slot allocation and camera gate interface.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5" style={{ marginBottom: '20px' }}>
                        <div>
                          <label style={labelStyle}>Total Parking Bays (Capacity) *</label>
                          <input type="number" min="10" max="10000" value={totalSlots} onChange={e => setTotalSlots(Number(e.target.value))} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Number of Floors / Basements</label>
                          <input type="number" min="1" max="10" value={floorCount} onChange={e => setFloorCount(Number(e.target.value))} style={inputStyle} />
                        </div>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Entry / Exit Gate Hardware</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { id: 'anpr', title: 'ANPR Camera + Barrier', sub: 'Standard RTSP IP Camera feed with automatic plate OCR' },
                            { id: 'fastag', title: 'FASTag NETC Toll Reader', sub: 'Overhead RFID reader connected to bank settlement' },
                            { id: 'kiosk', title: 'ParkEZ Touchscreen Kiosk', sub: 'Barcode / QR dispenser at entry and exit boom' },
                            { id: 'manual', title: 'Attendant Mobile App', sub: 'Zero hardware — attendant logs plates via smartphone' },
                          ].map(hw => {
                            const active = hardwareType === hw.id;
                            return (
                              <div
                                key={hw.id}
                                onClick={() => setHardwareType(hw.id)}
                                className="rounded-xl border cursor-pointer transition-all"
                                style={{ padding: '14px 16px', background: active ? 'rgba(59,91,255,0.05)' : '#FAFAFA', borderColor: active ? '#3B5BFF' : '#E5E7EB' }}
                              >
                                <p className="font-semibold text-[#111827]" style={{ fontSize: '13px', margin: '0 0 4px' }}>{hw.title}</p>
                                <p className="text-[#6B7280]" style={{ fontSize: '11px', margin: 0 }}>{hw.sub}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label style={labelStyle}>EV Charging Bays Included</label>
                          <input type="number" min="0" max={totalSlots} value={evSlots} onChange={e => setEvSlots(Number(e.target.value))} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>2-Wheeler / Bike Bays</label>
                          <input type="number" min="0" max={totalSlots} value={bikeSlots} onChange={e => setBikeSlots(Number(e.target.value))} style={inputStyle} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ════ STEP 3: Pricing & Settlement ════ */}
                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div style={{ marginBottom: '28px' }}>
                        <h3 className="font-display font-bold text-[#111827]" style={{ fontSize: '20px', marginBottom: '6px' }}>
                          Step 3: Rates & Bank Settlements
                        </h3>
                        <p className="text-[13px] text-[#6B7280]" style={{ margin: 0 }}>
                          Set your customer tariffs and provide payment details for daily payouts.
                        </p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5" style={{ marginBottom: '20px' }}>
                        <div>
                          <label style={labelStyle}>Base Hourly Parking Rate (₹) *</label>
                          <input type="number" min="10" max="500" value={baseRate} onChange={e => setBaseRate(Number(e.target.value))} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Overnight / 24-Hour Flat Rate (₹)</label>
                          <input type="number" min="50" max="2000" value={overnightRate} onChange={e => setOvernightRate(Number(e.target.value))} style={inputStyle} />
                        </div>
                      </div>

                      {/* Surge toggle */}
                      <div
                        className="rounded-xl border border-[#E5E7EB] flex items-center justify-between"
                        style={{ background: '#FAFAFA', padding: '16px 20px', marginBottom: '20px' }}
                      >
                        <div>
                          <p className="font-semibold text-[#111827]" style={{ fontSize: '14px', margin: '0 0 4px' }}>Dynamic AI Surge Multiplier</p>
                          <p className="text-[#6B7280]" style={{ fontSize: '12px', margin: 0 }}>Automatically apply a 25% surge rate when lot occupancy crosses 85%</p>
                        </div>
                        <div
                          onClick={() => setSurgeEnabled(!surgeEnabled)}
                          className="cursor-pointer rounded-full flex-shrink-0"
                          style={{
                            width: '44px', height: '24px',
                            background: surgeEnabled ? '#3B5BFF' : '#D1D5DB',
                            position: 'relative', marginLeft: '16px',
                            transition: 'background 0.2s',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute', top: '3px',
                              left: surgeEnabled ? '23px' : '3px',
                              width: '18px', height: '18px',
                              background: '#FFFFFF', borderRadius: '50%',
                              transition: 'left 0.2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Settlement UPI VPA or Current Account (for daily payouts) *</label>
                        <input
                          required
                          value={settlementVpa}
                          onChange={e => setSettlementVpa(e.target.value)}
                          placeholder="e.g. yourbusiness@icici or 9876543210@upi"
                          style={{ ...inputStyle, marginBottom: '8px' }}
                        />
                        <p className="text-[#6B7280]" style={{ fontSize: '12px', margin: 0 }}>
                          Funds are swept automatically at 11:59 PM every night via automated IMPS/NEFT.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* ════ STEP 4: Review & Deploy ════ */}
                  {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div style={{ marginBottom: '28px' }}>
                        <h3 className="font-display font-bold text-[#111827]" style={{ fontSize: '20px', marginBottom: '6px' }}>
                          Step 4: Review & Confirm Deployment
                        </h3>
                        <p className="text-[13px] text-[#6B7280]" style={{ margin: 0 }}>
                          Verify the facility parameters before activating on the ParkEZ Network.
                        </p>
                      </div>

                      {/* Summary table */}
                      <div
                        className="border border-[#E5E7EB] rounded-2xl"
                        style={{ background: '#F7F8FA', marginBottom: '20px', overflow: 'hidden' }}
                      >
                        {[
                          { label: 'Facility Name', value: facilityName, bold: true },
                          { label: 'Address', value: `${address}, ${city}` },
                          { label: 'Total Capacity', value: `${totalSlots} bays (${evSlots} EV, ${bikeSlots} Bike)`, bold: true },
                          { label: 'Base Hourly Rate', value: `₹${baseRate}/hr`, bold: true },
                          { label: 'Gate Integration', value: `${hardwareType} integration`, highlight: true },
                          { label: 'Payout Destination', value: settlementVpa, mono: true },
                        ].map((row, i, arr) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between"
                            style={{ padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid #E5E7EB' : 'none', gap: '16px' }}
                          >
                            <span className="text-[#6B7280]" style={{ fontSize: '13px', flexShrink: 0 }}>{row.label}</span>
                            <span
                              style={{
                                fontSize: row.mono ? '12px' : '13px',
                                fontWeight: (row.bold || row.highlight || row.mono) ? 700 : 500,
                                color: row.highlight ? '#3B5BFF' : row.mono ? '#15803D' : '#111827',
                                fontFamily: row.mono ? 'monospace' : 'inherit',
                                textAlign: 'right',
                              }}
                            >
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Yield estimate */}
                      <div
                        className="rounded-2xl border flex items-center justify-between"
                        style={{ borderColor: 'rgba(59,91,255,0.25)', background: 'rgba(59,91,255,0.04)', padding: '20px 24px', marginBottom: '24px', gap: '16px' }}
                      >
                        <div>
                          <p className="text-[#6B7280]" style={{ fontSize: '12px', margin: '0 0 4px' }}>Projected Monthly Gross Yield</p>
                          <p className="font-display font-bold text-[#3B5BFF]" style={{ fontSize: '28px', margin: 0 }}>
                            ₹{estimatedMonthly.toLocaleString()}
                          </p>
                        </div>
                        <span
                          className="font-semibold text-[#15803D] rounded-full flex-shrink-0"
                          style={{ fontSize: '12px', background: 'rgba(34,197,94,0.12)', padding: '6px 14px' }}
                        >
                          82% Occupancy Model
                        </span>
                      </div>

                      {/* Terms */}
                      <label className="flex items-start gap-3 cursor-pointer" htmlFor="agree-terms">
                        <input
                          type="checkbox" id="agree-terms"
                          checked={agreedTerms}
                          onChange={e => setAgreedTerms(e.target.checked)}
                          className="accent-blue-600 cursor-pointer"
                          style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }}
                        />
                        <span className="text-[#6B7280]" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                          I certify that I am the authorized owner/operator and accept the ParkEZ Telemetry Agreement.
                        </span>
                      </label>
                    </motion.div>
                  )}

                  {/* ── Nav buttons ── */}
                  <div
                    className="flex items-center justify-between border-t border-[#E5E7EB]"
                    style={{ marginTop: '40px', paddingTop: '28px' }}
                  >
                    <button
                      type="button"
                      disabled={currentStep === 1}
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: currentStep === 1 ? '#9CA3AF' : '#374151',
                        background: '#FFFFFF',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: '10px',
                        padding: '13px 28px',
                        cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Back
                    </button>

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          color: '#FFFFFF',
                          background: '#3B5BFF',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '13px 28px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 14px rgba(59,91,255,0.25)',
                        }}
                      >
                        <span>Continue</span>
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!agreedTerms}
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          color: '#FFFFFF',
                          background: '#3B5BFF',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '13px 28px',
                          cursor: agreedTerms ? 'pointer' : 'not-allowed',
                          opacity: agreedTerms ? 1 : 0.5,
                          boxShadow: agreedTerms ? '0 4px 16px rgba(59,91,255,0.28)' : 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Zap size={15} />
                        Complete & Deploy Facility
                      </button>
                    )}
                  </div>

                </form>
              )}
            </div>
            {/* end wizard card */}
          </div>
          {/* end max-w-[800px] */}
        </div>
        {/* end container */}
      </div>
      {/* end wizard section */}

    </div>
  );
}
