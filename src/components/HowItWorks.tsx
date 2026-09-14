const STEPS = [
  {
    n: 1,
    title: 'Book Online',
    body: 'Reserve a specific slot up to 30 days ahead. Or just drive up — walk-ins get auto-assigned via QR scan at the gate.',
    tag: 'UPI, FASTag, or card',
  },
  {
    n: 2,
    title: 'Auto Entry',
    body: 'ANPR camera reads KA 05 AB 4321 in under 2 seconds. Gate opens. Slot number shown on the entry display.',
    tag: '< 2 sec recognition',
  },
  {
    n: 3,
    title: 'Park Secure',
    body: 'IoT sensor confirms your slot is occupied. Live map in-app shows exactly where you parked. CCTV throughout.',
    tag: 'IoT sensors and CCTV monitoring',
  },
  {
    n: 4,
    title: 'Auto Exit & Pay',
    body: 'Exit camera reads your plate, calculates duration, deducts from FASTag or saved card. Gate opens. Done.',
    tag: 'Zero stop. Zero queue.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: '#FFFFFF',
        paddingTop: '96px',
        paddingBottom: '96px',
      }}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
        {/* Section heading */}
        <h2
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
            color: '#111827',
            margin: 0,
            marginBottom: '64px',
          }}
        >
          From driveway to bay in four steps.
        </h2>

        {/* Timeline */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '48px',
          }}
          className="how-timeline"
        >
          {/* Connecting line */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: 'calc(12.5% - 20px)',
              right: 'calc(12.5% - 20px)',
              height: '1px',
              background: '#E5E7EB',
              zIndex: 0,
            }}
          />

          {STEPS.map(step => (
            <div key={step.n} style={{ position: 'relative', zIndex: 1 }}>
              {/* Step number circle */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step.n === 1 || step.n === 4
                    ? '#111827'
                    : '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: step.n === 1 || step.n === 4 ? '#FFFFFF' : '#6B7280',
                  }}
                >
                  {step.n}
                </span>
              </div>

              {/* Step title */}
              <h3
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: 1.2,
                  color: '#111827',
                  margin: 0,
                  marginBottom: '16px',
                }}
              >
                {step.title}
              </h3>

              {/* Body */}
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: '#6B7280',
                  margin: 0,
                  marginBottom: '16px',
                }}
              >
                {step.body}
              </p>

              {/* Quiet tag */}
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  color: '#9CA3AF',
                  margin: 0,
                }}
              >
                {step.tag}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .how-timeline {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .how-timeline > * > div:first-child {
            margin-bottom: 24px;
          }
        }
      `}</style>
    </section>
  );
}
