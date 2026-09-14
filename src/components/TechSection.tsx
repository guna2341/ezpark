const FEATURES = [
  { label: 'ANPR at the gate', desc: 'Edge-compute camera. Works in rain, at night, partial plates.' },
  { label: 'IoT slot sensors', desc: 'Ultrasonic per bay, 500ms refresh. No blind spots.' },
  { label: 'Dynamic pricing', desc: 'Weekend evening surge up to 1.8× — owner-configurable.' },
  { label: 'FASTag NETC exit', desc: 'Auto-deduct on exit, no stop, no QR scan.' },
  { label: 'Fraud detection', desc: 'Anomaly model trained on 10M+ parking events.' },
  { label: 'API-first', desc: 'REST + webhook. Connects to any property management system.' },
];

export default function TechSection() {
  return (
    <section
      style={{
        background: '#F1F3F6',
        paddingTop: '96px',
        paddingBottom: '96px',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle colored accent blob for visual weight without darkness */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 91, 255, 0.06) 0%, rgba(0, 194, 168, 0.03) 60%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16 relative z-10">
        {/* Editorial layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 1fr',
            gap: '96px',
            alignItems: 'start',
          }}
          className="tech-grid"
        >
          {/* Left: quiet vertical label */}
          <div style={{ paddingTop: '8px' }}>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#6B7280',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              The technology
              <br />behind the gate.
            </p>
          </div>

          {/* Right: editorial content block */}
          <div>
            {/* Pull-quote stat */}
            <div
              style={{
                borderLeft: '3px solid #3B5BFF',
                paddingLeft: '32px',
                marginBottom: '64px',
              }}
            >
              <p
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '16px',
                }}
              >
                Gate to bay
                <br />in under 2 seconds.
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '17px',
                  lineHeight: 1.6,
                  color: '#6B7280',
                  margin: 0,
                  maxWidth: '55ch',
                }}
              >
                Three layers — an ANPR edge node at the gate, ultrasonic IoT sensors in each bay, 
                and an ML inference cluster in the cloud — update slot state within 500 milliseconds 
                of a vehicle moving. The 2-second figure is gate open to slot assigned, on a live 
                deployment at Lulu Mall, Kochi, measured across 12,000 entries.
              </p>
            </div>

            {/* Feature list: 24px internal card padding */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(16, 24, 40, 0.06)',
                overflow: 'hidden',
              }}
              className="features-grid"
            >
              {FEATURES.map((f, i) => (
                <div
                  key={f.label}
                  style={{
                    padding: '24px',
                    borderTop: i > 1 ? '1px solid #E5E7EB' : 'none',
                    borderRight: i % 2 === 0 ? '1px solid #E5E7EB' : 'none',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 600,
                      fontSize: '15px',
                      color: '#111827',
                      margin: 0,
                      marginBottom: '8px',
                    }}
                  >
                    {f.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: '#6B7280',
                      margin: 0,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tech-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .features-grid > div {
            border-right: none !important;
            border-top: 1px solid #E5E7EB !important;
          }
          .features-grid > div:first-child {
            border-top: none !important;
          }
        }
      `}</style>
    </section>
  );
}
