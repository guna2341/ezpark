import { useState } from 'react';
import { Search, Star, MapPin, Compass, Navigation, Plus, Minus } from 'lucide-react';
import { MOCK_VENUES } from '../data/mockData';

interface SearchPageProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const FILTER_TAGS = ['All Lots', 'EV Charging', 'Covered', 'FASTag', 'Valet', '24/7'];

export default function SearchPage({ onNavigate }: SearchPageProps) {
  const [activeFilter, setActiveFilter] = useState('All Lots');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredVenueId, setHoveredVenueId] = useState<string | null>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredVenues = MOCK_VENUES.filter(v => {
    const matchesQuery =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === 'All Lots' ||
      v.amenities.some((a: string) => a.toLowerCase().includes(activeFilter.toLowerCase())) ||
      (activeFilter === 'Covered' && v.amenities.includes('Covered'));
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FA' }}>
      {/* 1. Global container & centering: max-w-[1280px] px-6 md:px-16 */}
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16 pt-[104px] pb-16 md:pb-24">
        {/* Title Header with generous 24px+ spacing */}
        <div className="mb-8 flex items-baseline justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-[28px] sm:text-[34px] text-[#111827] leading-tight m-0">
              Select Your Parking Lot
            </h1>
            <p className="text-[15px] text-[#6B7280] mt-2 m-0">
              Live occupancy & guaranteed reservations across Bengaluru’s smart parking grid
            </p>
          </div>
          <span className="text-xs font-semibold text-[#15803D] bg-[#22C55E]/10 border border-[#22C55E]/20 px-3.5 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            {filteredVenues.reduce((acc, v) => acc + v.availableSlots, 0)} live bays available
          </span>
        </div>

        {/* Search & Filter Bar:
            - Single row on desktop, controls separated by 16px gap, bar padded 16px
            - 24px margin below before results start
            - Stack vertically on mobile, 12px gap, search input full-width on its own row
        */}
        <div
          className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4"
          style={{ boxShadow: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.08)' }}
        >
          {/* Search Input: full width on mobile, flex-1 on desktop */}
          <div className="relative w-full lg:flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
            />
            <input
              id="search-venue-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by venue name, area, or landmark (e.g. Phoenix, Indiranagar, Airport)..."
              style={{
                width: '100%',
                background: '#FAFAFA',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '10px 16px 10px 42px', // 10px/16px input spec
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#111827',
                outline: 'none',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#3B5BFF';
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.background = '#FAFAFA';
              }}
            />
          </div>

          {/* Filter Pills & Controls: 16px gap on desktop, 12px on mobile */}
          <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {FILTER_TAGS.map(tag => {
                const active = activeFilter === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setActiveFilter(tag)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={{
                      background: active ? 'linear-gradient(135deg, #3B5BFF, #00C2A8)' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#6B7280',
                      border: active ? '1px solid transparent' : '1px solid #E5E7EB',
                      boxShadow: active ? '0 1px 3px rgba(59, 91, 255, 0.25)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-medium text-[#FF6B4A] hover:underline whitespace-nowrap ml-auto lg:ml-0"
              >
                Clear query
              </button>
            )}
          </div>
        </div>

        {/* Results: two-column split — lot list left (~60%), sticky map right (~40%), 32px gap between; stacked on mobile */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Lot List: Left Column (~60%) */}
          <div className="w-full lg:w-[60%] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                {filteredVenues.length} {filteredVenues.length === 1 ? 'facility found' : 'facilities found'}
              </span>
              <span className="text-xs text-[#6B7280]">
                Sorted by nearest & availability
              </span>
            </div>

            {filteredVenues.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center shadow-sm">
                <p className="font-display font-bold text-lg text-[#111827] mb-2">
                  No parking lots found
                </p>
                <p className="text-sm text-[#6B7280] mb-6">
                  No facilities match your search query or selected amenities.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveFilter('All Lots'); }}
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#FFFFFF',
                    background: 'linear-gradient(135deg, #3B5BFF, #00C2A8)',
                    padding: '12px 24px', // 12px/24px button spec
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredVenues.map(venue => {
                const isHovered = hoveredVenueId === venue.id || selectedPinId === venue.id;

                return (
                  /* Lot Card:
                     - horizontal layout
                     - 120x120px (or 96x96px mobile) thumbnail + content
                     - 16px internal padding
                     - 16px gap between image/content
                     - inside: name (18px bold) → 4px → address (14px muted) → 8px → price + badge row
                     - cards separated by 12px, never touching
                     - clicking goes straight to location detail + slot map with NO modal
                  */
                  <div
                    key={venue.id}
                    id={`venue-card-${venue.id}`}
                    onClick={() => onNavigate('location', { venue })}
                    onMouseEnter={() => setHoveredVenueId(venue.id)}
                    onMouseLeave={() => setHoveredVenueId(null)}
                    className="bg-white border rounded-2xl p-4 cursor-pointer transition-all flex flex-row items-center gap-4 group"
                    style={{
                      borderColor: isHovered ? '#3B5BFF' : '#E5E7EB',
                      boxShadow: isHovered
                        ? '0 6px 18px rgba(59, 91, 255, 0.12)'
                        : '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.08)',
                    }}
                  >
                    {/* Thumbnail: 120x120px desktop, 96x96px mobile */}
                    <div className="w-[96px] h-[96px] sm:w-[120px] sm:h-[120px] min-w-[96px] sm:min-w-[120px] min-h-[96px] sm:min-h-[120px] rounded-xl overflow-hidden relative flex-shrink-0 bg-[#F1F3F6]">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/95 backdrop-blur-sm text-[#111827] border border-[#E5E7EB]">
                        {venue.category}
                      </div>
                    </div>

                    {/* Content Block */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      {/* Name: 18px bold */}
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-bold text-[18px] text-[#111827] leading-snug truncate m-0 group-hover:text-[#3B5BFF] transition-colors">
                          {venue.name}
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star size={13} fill="#F59E0B" color="#F59E0B" />
                          <span className="text-[13px] font-semibold text-[#D97706]">{venue.rating}</span>
                        </div>
                      </div>

                      {/* 4px gap → Address: 14px muted */}
                      <p className="text-[14px] text-[#6B7280] truncate mt-1 mb-0 flex items-center gap-1">
                        <MapPin size={13} className="text-[#9CA3AF] flex-shrink-0" />
                        <span className="truncate">{venue.address}</span>
                        <span className="text-[#9CA3AF] mx-0.5">·</span>
                        <span className="text-[#6B7280] font-medium flex-shrink-0">{venue.distance}</span>
                      </p>

                      {/* 8px gap → Price + badge row */}
                      <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-baseline gap-1">
                          <span className="font-display font-bold text-[17px] text-[#111827]">
                            ₹{venue.pricePerHour}
                          </span>
                          <span className="text-[12px] text-[#6B7280]">/hr</span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Availability Badge */}
                          <span
                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
                            style={{
                              background: venue.availableSlots > 100
                                ? 'rgba(34,197,94,0.12)'
                                : venue.availableSlots > 20
                                ? 'rgba(245,158,11,0.12)'
                                : 'rgba(239,68,68,0.12)',
                              color: venue.availableSlots > 100
                                ? '#15803D'
                                : venue.availableSlots > 20
                                ? '#D97706'
                                : '#DC2626',
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: venue.availableSlots > 100
                                  ? '#22C55E'
                                  : venue.availableSlots > 20
                                  ? '#F59E0B'
                                  : '#EF4444',
                              }}
                            />
                            {venue.availableSlots} free
                          </span>

                          {/* Amenity tag preview */}
                          {venue.amenities.slice(0, 2).map((a: string) => (
                            <span
                              key={a}
                              className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-[#F1F3F6] border border-[#E5E7EB] text-[#6B7280]"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Map: Right Column (~40%) */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-[96px]">
            <div
              className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm relative h-[440px] lg:h-[calc(100vh-140px)] min-h-[480px] max-h-[720px] flex flex-col"
              style={{ boxShadow: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.08)' }}
            >
              {/* Top Map Header */}
              <div className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Navigation size={14} className="text-[#3B5BFF]" />
                  <span className="font-display font-semibold text-xs text-[#111827]">
                    Bengaluru Metropolitan Region
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="text-[11px] text-[#15803D] font-medium">GPS Telemetry Synced</span>
                </div>
              </div>

              {/* Map Canvas Background (Stylized Vector Map of Bengaluru) */}
              <div className="relative flex-1 bg-[#F8FAFC] overflow-hidden">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 500 600"
                  preserveAspectRatio="xMidYMid slice"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.25s ease',
                  }}
                >
                  <defs>
                    {/* Grid pattern */}
                    <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
                    </pattern>
                    <linearGradient id="lake-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#E0F2FE" />
                      <stop offset="100%" stopColor="#BAE6FD" />
                    </linearGradient>
                  </defs>

                  {/* Grid background */}
                  <rect width="500" height="600" fill="url(#city-grid)" />

                  {/* Parks / Green spaces */}
                  <rect x="180" y="240" width="80" height="90" rx="12" fill="#DCFCE7" opacity="0.6" />
                  <text x="195" y="290" fill="#15803D" fontSize="8" fontWeight="600">Cubbon Park</text>

                  <rect x="210" y="360" width="90" height="70" rx="10" fill="#DCFCE7" opacity="0.6" />
                  <text x="230" y="400" fill="#15803D" fontSize="8" fontWeight="600">Lalbagh Botanical</text>

                  {/* Lakes */}
                  <path d="M 330 200 Q 380 210 390 260 Q 370 290 320 270 Z" fill="url(#lake-grad)" />
                  <text x="335" y="245" fill="#0284C7" fontSize="7" fontWeight="600">Ulsoor Lake</text>

                  <path d="M 340 370 Q 400 380 410 420 Q 360 450 330 410 Z" fill="url(#lake-grad)" />
                  <text x="350" y="405" fill="#0284C7" fontSize="7" fontWeight="600">Bellandur Lake</text>

                  {/* Arterial Ring Roads & Metro Lines */}
                  {/* Outer Ring Road */}
                  <circle cx="260" cy="310" r="190" fill="none" stroke="#CBD5E1" strokeWidth="6" opacity="0.6" />
                  <circle cx="260" cy="310" r="190" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 6" />

                  {/* Inner Ring Road */}
                  <circle cx="260" cy="310" r="110" fill="none" stroke="#CBD5E1" strokeWidth="4" opacity="0.7" />

                  {/* Major Highways */}
                  {/* Airport expressway (North) */}
                  <path d="M 260 0 L 260 310" stroke="#94A3B8" strokeWidth="4" />
                  <path d="M 260 0 L 260 310" stroke="#3B5BFF" strokeWidth="1.5" strokeDasharray="8 4" />
                  <text x="268" y="70" fill="#64748B" fontSize="8" fontWeight="600">Bellary Rd (Airport)</text>

                  {/* Hosur Road (South) */}
                  <path d="M 260 310 L 330 600" stroke="#94A3B8" strokeWidth="4" />
                  <text x="300" y="520" fill="#64748B" fontSize="8" fontWeight="600">Hosur Rd</text>

                  {/* Old Madras Road (East) */}
                  <path d="M 260 310 L 500 250" stroke="#94A3B8" strokeWidth="4" />
                  <text x="400" y="240" fill="#64748B" fontSize="8" fontWeight="600">Old Madras Rd</text>

                  {/* Mysore Road (West) */}
                  <path d="M 260 310 L 0 380" stroke="#94A3B8" strokeWidth="4" />
                  <text x="50" y="370" fill="#64748B" fontSize="8" fontWeight="600">Mysuru Rd</text>
                </svg>

                {/* Venue Pins with Interactive Price Badges */}
                {filteredVenues.map((venue, i) => {
                  const coords: Record<string, { x: number; y: number }> = {
                    v1: { x: 74, y: 38 }, // Phoenix Marketcity (East/Whitefield)
                    v2: { x: 52, y: 12 }, // Airport (North)
                    v3: { x: 38, y: 55 }, // Koramangala
                    v4: { x: 50, y: 44 }, // MG Road / Brigade
                    v5: { x: 68, y: 72 }, // Electronic City
                    v6: { x: 32, y: 36 }, // Malleshwaram
                  };

                  const defaultPos = { x: 25 + (i * 22) % 60, y: 25 + (i * 20) % 55 };
                  const pos = coords[venue.id] || defaultPos;

                  const isHovered = hoveredVenueId === venue.id;
                  const isSelected = selectedPinId === venue.id;
                  const isAvailable = venue.availableSlots > 50;

                  return (
                    <div
                      key={venue.id}
                      style={{
                        position: 'absolute',
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: 'translate(-50%, -100%)',
                        zIndex: isHovered || isSelected ? 30 : 20,
                        transition: 'transform 0.15s ease, z-index 0.15s ease',
                      }}
                      onMouseEnter={() => {
                        setHoveredVenueId(venue.id);
                        setSelectedPinId(venue.id);
                      }}
                      onMouseLeave={() => setHoveredVenueId(null)}
                      onClick={() => onNavigate('location', { venue })}
                    >
                      {/* Floating venue pin badge */}
                      <button
                        className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md transition-transform"
                        style={{
                          background: isHovered ? '#111827' : '#FFFFFF',
                          color: isHovered ? '#FFFFFF' : '#111827',
                          border: isHovered ? '2px solid #3B5BFF' : '1px solid #CBD5E1',
                          transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                          cursor: 'pointer',
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            background: isAvailable ? '#22C55E' : '#F59E0B',
                          }}
                        />
                        <span className="font-display font-bold text-[11px] whitespace-nowrap">
                          ₹{venue.pricePerHour}
                        </span>
                      </button>

                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 bottom-[115%] bg-[#111827] text-white p-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-40 border border-white/10"
                          style={{ minWidth: '160px' }}
                        >
                          <p className="font-display font-bold text-xs m-0 text-white truncate">
                            {venue.name}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF] m-0 mt-0.5">
                            {venue.availableSlots} slots free · Click to view
                          </p>
                        </div>
                      )}

                      {/* Pin pointer tick */}
                      <div
                        className="w-1.5 h-1.5 mx-auto -mt-0.5 rotate-45"
                        style={{
                          background: isHovered ? '#111827' : '#FFFFFF',
                          borderRight: '1px solid #CBD5E1',
                          borderBottom: '1px solid #CBD5E1',
                        }}
                      />
                    </div>
                  );
                })}

                {/* Floating Map Controls */}
                <div className="absolute right-3 bottom-3 flex flex-col gap-1.5 z-20">
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
                    className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center text-[#111827] hover:bg-[#F1F3F6] transition-colors"
                    title="Zoom in"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.85))}
                    className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center text-[#111827] hover:bg-[#F1F3F6] transition-colors"
                    title="Zoom out"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center text-[#111827] hover:bg-[#F1F3F6] transition-colors"
                    title="Reset view"
                  >
                    <Compass size={14} />
                  </button>
                </div>

                {/* Map Legend Overlay */}
                <div className="absolute left-3 bottom-3 bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-lg px-3 py-2 shadow-sm z-20 flex items-center gap-3 text-[11px] text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span>&gt;50 bays free</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span>Filling fast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
