import { ArrowRight } from 'lucide-react';

const LINKS = {
  Product: [
    'Find parking',
    'For businesses',
    'EV charging bays',
    'Monthly passes',
    'API & integrations',
  ],
  Company: [
    'About ParkEZ',
    'Careers — 14 open roles',
    'Press',
    'Partners',
    'Contact',
  ],
  Legal: [
    'Privacy policy',
    'Terms of service',
    'ANPR data policy',
    'Cookie settings',
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: '#F7F8FA',
        borderTop: '1px solid #E5E7EB',
        paddingTop: '96px',
        paddingBottom: '64px',
      }}
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
        {/* Top row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr',
            gap: '64px',
            marginBottom: '64px',
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#3B5BFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 13V7.5C2 5.57 3.57 4 5.5 4h5C12.43 4 14 5.57 14 7.5V13"
                    stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M0.5 13h15" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="5.5" cy="8.5" r="1" fill="white"/>
                  <circle cx="10.5" cy="8.5" r="1" fill="white"/>
                </svg>
              </div>
              <span
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#111827',
                }}
              >
                ParkEZ
              </span>
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#6B7280',
                margin: 0,
                marginBottom: '32px',
                maxWidth: '28ch',
              }}
            >
              Smart parking at malls, hospitals, airports, and hotels across India.
              No tickets. No queues.
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                {
                  label: 'LinkedIn',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                  ),
                },
                {
                  label: 'Twitter / X',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Instagram',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                    </svg>
                  ),
                },
              ].map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    background: '#FFFFFF',
                    color: '#6B7280',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s ease, color 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB';
                    (e.currentTarget as HTMLElement).style.color = '#111827';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
                    (e.currentTarget as HTMLElement).style.color = '#6B7280';
                  }}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#111827',
                  margin: 0,
                  marginBottom: '24px',
                  letterSpacing: '0.03em',
                }}
              >
                {section}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {links.map(link => (
                  <li key={link} style={{ marginBottom: '12px' }}>
                    <a
                      href="#"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6B7280',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#111827'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                color: '#111827',
                margin: 0,
                marginBottom: '12px',
                letterSpacing: '0.03em',
              }}
            >
              Stay in the loop
            </p>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: 1.5,
                color: '#6B7280',
                margin: 0,
                marginBottom: '16px',
              }}
            >
              Product updates, city launches, parking industry data.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none',
                  minWidth: 0,
                }}
              />
              <button
                style={{
                  background: '#3B5BFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ArrowRight size={16} color="white" />
              </button>
            </div>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: '#9CA3AF',
                margin: 0,
                marginTop: '8px',
              }}
            >
              No spam. Unsubscribe any time.
            </p>

            {/* Contact */}
            <div style={{ marginTop: '32px' }}>
              <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280', margin: 0, marginBottom: '8px' }}>
                hello@parkez.in
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280', margin: 0 }}>
                +91 80 4567 8900
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              color: '#9CA3AF',
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} ParkEZ Technologies Pvt Ltd. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy', 'Terms', 'Security', 'System status'].map(item => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: '#9CA3AF',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#111827'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9CA3AF'; }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
