import { useState } from 'react';
import { ArrowRight, Search, Plus, AlertCircle } from 'lucide-react';

export default function ComponentsShowcase() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-8 pb-24 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <header className="border-b border-[#E5E7EB] pb-6">
          <h1 className="font-display font-bold text-3xl text-[#111827]">Atomic Component Showcase</h1>
          <p className="text-sm text-[#6B7280] mt-2">Strict flat-color implementation (Zero gradients, pure #3B5BFF indigo primary)</p>
        </header>

        {/* Buttons */}
        <section>
          <h2 className="font-display font-bold text-xl text-[#111827] mb-6">Buttons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-start">
            
            {/* Primary */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Primary Button</span>
              <div className="space-y-3">
                <button className="w-full bg-[#3B5BFF] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  Continue <ArrowRight size={16} />
                </button>
                <button className="w-full bg-[#314de6] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  Hover State <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Secondary / Outline */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Secondary Outline</span>
              <div className="space-y-3">
                <button className="w-full bg-white border-2 border-[#E5E7EB] text-[#111827] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  Cancel
                </button>
                <button className="w-full bg-[#F7F8FA] border-2 border-[#3B5BFF] text-[#3B5BFF] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  Hover State
                </button>
              </div>
            </div>

            {/* Subtle / Ghost */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Subtle Button</span>
              <div className="space-y-3">
                <button className="w-full text-[#6B7280] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  Skip for now
                </button>
                <button className="w-full bg-[#E5E7EB]/50 text-[#111827] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  Hover State
                </button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Icon Buttons</span>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg flex items-center justify-center transition-colors">
                  <Search size={18} />
                </button>
                <button className="w-10 h-10 bg-[#EEF1FF] border border-[#3B5BFF]/20 text-[#3B5BFF] rounded-lg flex items-center justify-center transition-colors">
                  <Search size={18} />
                </button>
                <button className="w-10 h-10 bg-[#3B5BFF] text-white rounded-lg flex items-center justify-center transition-colors hover:bg-[#314de6]">
                  <Plus size={18} />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="font-display font-bold text-xl text-[#111827] mb-6">Form Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Default Input</span>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Email Address</label>
                <input 
                  type="text" 
                  placeholder="name@example.com"
                  className="w-full bg-white border border-[#E5E7EB] text-[#111827] px-4 py-2.5 rounded-lg text-sm outline-none transition-colors"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Focus State</span>
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Email Address</label>
                <input 
                  type="text" 
                  defaultValue="name@example.com"
                  className="w-full bg-white border-2 border-[#3B5BFF] text-[#111827] px-4 py-2.5 rounded-lg text-sm outline-none shadow-[0_0_0_4px_rgba(59,91,255,0.1)] transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Error State</span>
              <div>
                <label className="block text-xs font-semibold text-[#EF4444] mb-1.5">Email Address</label>
                <div className="relative">
                  <input 
                    type="text" 
                    defaultValue="invalid-email"
                    className="w-full bg-[#FEF2F2] border-2 border-[#EF4444] text-[#EF4444] px-4 py-2.5 rounded-lg text-sm outline-none transition-all pr-10"
                  />
                  <AlertCircle size={16} className="text-[#EF4444] absolute right-3 top-3" />
                </div>
                <p className="text-[11px] text-[#EF4444] mt-1.5">Please enter a valid email address.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Badges & Chips */}
        <section>
          <h2 className="font-display font-bold text-xl text-[#111827] mb-6">Badges & Chips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status Badges</span>
              <div className="flex flex-wrap gap-3">
                {/* Primary Flat */}
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B5BFF] bg-[#EEF1FF] px-2.5 py-1 rounded-md border border-[#3B5BFF]/20">
                  Active Demo
                </span>
                {/* Success Flat */}
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] bg-[#22C55E]/10 px-2.5 py-1 rounded-md border border-[#22C55E]/20">
                  Confirmed
                </span>
                {/* Warning Flat */}
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] bg-[#F59E0B]/10 px-2.5 py-1 rounded-md border border-[#F59E0B]/20">
                  Pending
                </span>
                {/* Neutral Flat */}
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] bg-[#F3F4F6] px-2.5 py-1 rounded-md border border-[#E5E7EB]">
                  Completed
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Live Status Indicators</span>
              <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3B5BFF] relative">
                    <div className="absolute inset-0 rounded-full bg-[#3B5BFF] animate-ping opacity-50"></div>
                  </div>
                  <span className="text-xs font-semibold text-[#111827]">Live Sync</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></div>
                  <span className="text-xs font-semibold text-[#111827]">Operational</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                  <span className="text-xs font-semibold text-[#111827]">Out of Service</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="font-display font-bold text-xl text-[#111827] mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Content Card Default */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Content Card (Default)</span>
              <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_rgba(16,24,40,0.06)]">
                <div className="w-10 h-10 rounded-xl bg-[#EEF1FF] text-[#3B5BFF] flex items-center justify-center mb-4">
                  <Search size={20} />
                </div>
                <h3 className="font-display font-bold text-base text-[#111827] mb-1">Standard Card</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
                  Used for generic content blocks. Features a subtle border and standard soft shadow.
                </p>
                <div className="pt-3 border-t border-[#E5E7EB] text-[11px] text-[#3B5BFF] font-semibold flex items-center gap-1">
                  Learn more <ArrowRight size={12} />
                </div>
              </div>
            </div>

            {/* Content Card Hover */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Content Card (Hover State)</span>
              <div className="bg-white p-6 rounded-2xl border border-[#3B5BFF]/30 shadow-[0_4px_6px_-1px_rgba(16,24,40,0.1),0_2px_4px_-1px_rgba(16,24,40,0.06)] cursor-pointer transform -translate-y-0.5 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#3B5BFF] text-white flex items-center justify-center mb-4">
                  <Search size={20} />
                </div>
                <h3 className="font-display font-bold text-base text-[#111827] mb-1">Interactive Card</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
                  Hover state elevates the shadow, brightens the border with primary color, and fills the icon background.
                </p>
                <div className="pt-3 border-t border-[#E5E7EB] text-[11px] text-[#3B5BFF] font-semibold flex items-center gap-1">
                  Learn more <ArrowRight size={12} />
                </div>
              </div>
            </div>

            {/* Dense Data Card */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Dense Data Card</span>
              <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-[#6B7280] uppercase">Today's Revenue</span>
                    <div className="w-6 h-6 rounded bg-[#EEF1FF] text-[#3B5BFF] flex items-center justify-center">
                      <span className="font-serif text-[10px] font-bold">₹</span>
                    </div>
                  </div>
                  <p className="font-display font-bold text-2xl text-[#111827]">₹48,300</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-[#15803D] bg-[#22C55E]/10 px-1.5 py-0.5 rounded">↑ 14.2%</span>
                    <span className="text-[10px] text-[#6B7280]">vs yesterday</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F3F6] text-[10px] text-[#6B7280] flex justify-between">
                  <span>243 Bookings</span>
                  <span className="text-[#3B5BFF] font-semibold">View ledger</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
