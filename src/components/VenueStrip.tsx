const VENUES = [
  {
    label: 'Malls',
    detail: 'Phoenix, Lulu, Orion, VR',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=480&q=80',
  },
  {
    label: 'Hospitals',
    detail: 'Manipal, Apollo, Fortis',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=480&q=80',
  },
  {
    label: 'Airports',
    detail: 'KIA, MAA, BOM, DEL',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=480&q=80',
  },
  {
    label: 'Hotels',
    detail: 'ITC, Taj, Marriott, Hyatt',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=480&q=80',
  },
  {
    label: 'Co-working',
    detail: 'WeWork, IndiQube, 91Springboard',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=480&q=80',
  },
  {
    label: 'Restaurants',
    detail: 'High-footfall dining blocks',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=480&q=80',
  },
  {
    label: 'Temples',
    detail: 'ISKCON, Siddhivinayak, Tirupati',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=480&q=80',
  },
  {
    label: 'Events',
    detail: 'Arenas, expo centers, stadiums',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=480&q=80',
  },
];

interface VenueStripProps {
  onNavigate?: (page: string) => void;
}

export default function VenueStrip({ onNavigate }: VenueStripProps) {
  return (
    <section
      style={{
        background: '#F7F8FA',
        paddingTop: '96px',
        paddingBottom: '96px',
        overflow: 'hidden',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      {/* Section header */}
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16 mb-12">
        <h2
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
            color: '#111827',
            margin: 0,
          }}
        >
          Wherever you park, we're already there.
        </h2>
      </div>

      {/* Horizontal scroll strip container */}
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
        <div
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '16px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
          className="venue-scroll-strip"
        >
          {VENUES.map(venue => (
            <button
              key={venue.label}
              onClick={() => onNavigate?.('search')}
              style={{
                flexShrink: 0,
                width: '240px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(16, 24, 40, 0.06)',
                cursor: 'pointer',
                textAlign: 'left',
                scrollSnapAlign: 'start',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(16, 24, 40, 0.10)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(16, 24, 40, 0.06)';
              }}
            >
              {/* Full-bleed image */}
              <div style={{ height: '140px', overflow: 'hidden' }}>
                <img
                  src={venue.image}
                  alt={venue.label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Content block: 24px padding per content card spec */}
              <div style={{ padding: '24px' }}>
                <h3
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '8px',
                  }}
                >
                  {venue.label}
                </h3>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: '#6B7280',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {venue.detail}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .venue-scroll-strip::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
