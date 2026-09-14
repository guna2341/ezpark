import { useState } from 'react';

const QUOTES = [
  {
    quote:
      "Pulled up to Phoenix Marketcity at 7 PM on a Saturday. Gate scanned my plate, assigned slot B-14. I was parked in 90 seconds. No ticket, no queue. First time that has ever happened to me in Bengaluru.",
    name: 'Ananya Krishnan',
    role: 'Software Engineer',
    location: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80',
  },
  {
    quote:
      "We deployed ParkEZ across all three showroom lots in Chennai. FASTag auto-exit cut our exit-booth staff from four people to one. Revenue per slot went up because we stopped losing cars to the 'I'll park on the road' crowd.",
    name: 'Rajesh Iyer',
    role: 'Operations Director, Lux Motors',
    location: 'Chennai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80',
  },
  {
    quote:
      "Patient families arrive stressed. The old token-and-queue system at our hospital made that worse. Since ParkEZ, the first thing people say when they walk in isn't 'where do I park' — they just walk in.",
    name: 'Priya Sharma',
    role: 'VP Operations, Manipal Hospitals',
    location: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80',
  },
  {
    quote:
      "Pre-booked airport parking three weeks out. Arrived at BLR at 4:17 AM with my family. The gate opened before I reached it. When we landed nine days later, I walked straight to the car. No ticket to find. Nothing.",
    name: 'Vikram Nair',
    role: 'Frequent flier',
    location: 'Kochi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const q = QUOTES[active];

  return (
    <section
      style={{
        background: '#FFFFFF',
        paddingTop: '96px',
        paddingBottom: '96px',
        borderTop: '1px solid #E5E7EB',
      }}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
        {/* Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: '96px',
            alignItems: 'start',
          }}
          className="testimonials-grid"
        >
          {/* Left: navigation */}
          <div style={{ paddingTop: '4px' }}>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#6B7280',
                margin: 0,
                marginBottom: '24px',
              }}
            >
              What our users say
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {QUOTES.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => setActive(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: i === active ? 600 : 400,
                    color: i === active ? '#111827' : '#6B7280',
                    borderLeft: i === active ? '2px solid #3B5BFF' : '2px solid transparent',
                    paddingLeft: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: large single quote */}
          <div>
            {/* Quote mark */}
            <p
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '80px',
                lineHeight: 0.8,
                color: 'rgba(17, 24, 39, 0.12)',
                margin: 0,
                marginBottom: '24px',
                userSelect: 'none',
              }}
            >
              "
            </p>

            {/* Quote text */}
            <blockquote
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(18px, 2.5vw, 26px)',
                lineHeight: 1.45,
                color: '#111827',
                margin: 0,
                marginBottom: '40px',
                maxWidth: '48ch',
              }}
            >
              {q.quote}
            </blockquote>

            {/* Attribution */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={q.avatar}
                alt={q.name}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #E5E7EB',
                }}
              />
              <div>
                <p
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#111827',
                    margin: 0,
                  }}
                >
                  {q.name}
                </p>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: '#6B7280',
                    margin: '4px 0 0',
                  }}
                >
                  {q.role}, {q.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
