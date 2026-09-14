import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Shield, Clock, MapPin } from 'lucide-react';
import VisualSlotMap from '../components/VisualSlotMap';
import type { Venue, ParkingSlot } from '../types';

interface LocationPageProps {
  venue: Venue;
  onNavigate: (page: string, data?: unknown) => void;
}

const PRICING = [
  { label: 'Up to 1 hour', price: '₹40' },
  { label: '1–3 hours', price: '₹35/hr' },
  { label: '3–8 hours', price: '₹30/hr' },
  { label: 'Day pass (12h)', price: '₹280' },
  { label: 'Monthly pass', price: '₹3,500' },
];

export default function LocationPage({ venue, onNavigate }: LocationPageProps) {
  const [selectedFloor] = useState('B1');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);

  const photos = [
    venue.image,
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FA', paddingTop: '104px', paddingBottom: '96px' }}>
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('search')}
            className="flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft size={16} /> Back to results
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left — photos + info (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Photo gallery */}
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-4 shadow-sm" style={{ height: '360px' }}>
                <motion.img
                  key={activePhoto}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={photos[activePhoto]}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(17,24,39,0.8) 0%, transparent 55%)' }}
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">{venue.name}</h1>
                  <p className="text-sm text-white/90 flex items-center gap-1.5 font-medium">
                    <MapPin size={14} /> {venue.address}, {venue.city}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`rounded-xl overflow-hidden border-2 transition-all ${i === activePhoto ? 'border-[#3B5BFF] shadow-sm' : 'border-transparent opacity-75 hover:opacity-100'}`}
                    style={{ width: '92px', height: '64px', cursor: 'pointer' }}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Stats row — 24px standard card padding */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Rating', val: `${venue.rating} ★`, color: '#F59E0B' },
                { label: 'Available', val: `${venue.availableSlots} slots`, color: '#15803D' },
                { label: 'Distance', val: venue.distance, color: '#3B5BFF' },
              ].map(s => (
                <div
                  key={s.label}
                  className="rounded-2xl p-6 text-center bg-white border border-[#E5E7EB] shadow-sm"
                >
                  <p className="font-bold text-2xl mb-1" style={{ color: s.color }}>{s.val}</p>
                  <p className="text-xs text-[#6B7280] font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Amenities — 24px card padding */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-semibold text-[#111827] text-lg mb-4">Amenities & Features</h2>
              <div className="flex flex-wrap gap-2.5">
                {venue.amenities.map(a => (
                  <span
                    key={a}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] text-[#111827] font-medium"
                  >
                    {a === 'EV Charging' && <Zap size={14} color="#3B5BFF" />}
                    {a === 'CCTV' && <Shield size={14} color="#3B5BFF" />}
                    {a === '24/7' && <Clock size={14} color="#3B5BFF" />}
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing table — 24px card container */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
              <h2 className="font-display font-semibold text-[#111827] text-lg mb-4">Transparent Pricing</h2>
              <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
                {PRICING.map((p, i) => (
                  <div
                    key={p.label}
                    className="flex items-center justify-between px-5 py-3.5"
                    style={{
                      borderBottom: i < PRICING.length - 1 ? '1px solid #E5E7EB' : undefined,
                      background: i % 2 === 0 ? '#F7F8FA' : '#FFFFFF',
                    }}
                  >
                    <span className="text-sm text-[#6B7280]">{p.label}</span>
                    <span className="text-sm font-semibold text-[#111827]">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — slot map + book CTA (5 cols sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <VisualSlotMap
                initialSlot={selectedSlot}
                selectedFloor={selectedFloor}
                onSelectSlot={setSelectedSlot}
                onConfirmSlot={(slot) => onNavigate('booking', { venue, slot })}
                confirmButtonText="Book This Slot"
                isSidebar={true}
              />

              {/* Operating hours — 24px card padding */}
              <div className="rounded-2xl p-6 bg-white border border-[#E5E7EB] shadow-sm">
                <h3 className="text-sm font-semibold text-[#111827] mb-4">Operating Hours</h3>
                <div className="space-y-2.5">
                  {[
                    { day: 'Mon – Fri', hours: '6:00 AM – 11:00 PM' },
                    { day: 'Saturday', hours: '6:00 AM – 11:30 PM' },
                    { day: 'Sunday', hours: '7:00 AM – 10:30 PM' },
                  ].map(h => (
                    <div key={h.day} className="flex items-center justify-between py-1.5 border-b border-[#F3F4F6] last:border-0">
                      <span className="text-xs text-[#6B7280]">{h.day}</span>
                      <span className="text-xs font-semibold text-[#111827]">{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
