import { useState, useEffect } from 'react';
import { Menu, X, Car, Building2 } from 'lucide-react';
import { useDemoAuth } from '../context/DemoAuthContext';

const NAV_LINKS = [
  { label: 'For businesses', href: '#businesses' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  onNavigate?: (page: string) => void;
  activePage: string;
}

export default function Navbar({ onNavigate, activePage: _activePage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role, switchRole } = useDemoAuth();

  const handleToggleRole = () => {
    if (!onNavigate) return;
    const nextRole = role === 'owner' ? 'user' : 'owner';
    switchRole(nextRole);
    onNavigate(nextRole === 'owner' ? 'owner-dashboard' : 'user-dashboard');
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        background: scrolled ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: scrolled ? '0 1px 3px rgba(16, 24, 40, 0.08)' : 'none',
      }}
    >
      <div
        className="mx-auto w-full max-w-[1600px] px-4 md:px-8 h-[72px] flex items-center justify-between gap-8 nav-inner"
      >
        {/* Logo */}
        <button
          id="nav-logo"
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#3B5BFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
              letterSpacing: '-0.01em',
            }}
          >
            ParkEZ
          </span>
        </button>

        {/* Desktop nav links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            flex: 1,
            marginLeft: '24px',
          }}
          className="nav-links"
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={`/${link.href}`}
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname !== '/') {
                  onNavigate?.('home');
                  setTimeout(() => {
                    document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                color: '#6B7280',
                textDecoration: 'none',
                letterSpacing: '0.015em',
                transition: 'color 0.15s ease',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#111827'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
          className="nav-ctas"
        >


          {/* Quick Role Switcher */}
          <button
            id="nav-role-switcher-btn"
            onClick={handleToggleRole}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '12px',
              color: '#111827',
              background: '#F7F8FA',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            {role === 'owner' ? (
              <>
                <Car size={14} className="text-[#00C2A8]" />
                <span>Switch to User view</span>
              </>
            ) : (
              <>
                <Building2 size={14} className="text-[#3B5BFF]" />
                <span>Switch to Owner view</span>
              </>
            )}
          </button>

          {/* Demo Login Link */}
          <button
            id="nav-demo-login-btn"
            onClick={() => onNavigate?.('login')}
            className="text-xs font-semibold text-[#6B7280] hover:text-[#111827] px-2 py-1.5 transition-colors cursor-pointer"
          >
            Demo Login
          </button>
          {/* Primary CTA — 12px/24px button spec */}
          <button
            id="nav-cta-find-parking"
            onClick={() => onNavigate('search')}
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
              whiteSpace: 'nowrap',
              transition: 'filter 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
          >
            Find a lot
          </button>
          {/* Secondary CTA — 12px/24px button spec */}
          <button
            id="nav-cta-list-parking"
            onClick={() => onNavigate('list-lot')}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: '#111827',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 6px rgba(16, 24, 40, 0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(16, 24, 40, 0.05)';
            }}
          >
            List your lot
          </button>
        </div>

        {/* Mobile toggle — icon-only, 10px padding */}
        <button
          id="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            padding: '10px',
            cursor: 'pointer',
            color: '#111827',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="nav-mobile-toggle"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid #E5E7EB',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 4px 12px rgba(16, 24, 40, 0.08)',
          }}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={`/${link.href}`}
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname !== '/') {
                  onNavigate?.('home');
                  setTimeout(() => {
                    document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                }
                setMobileOpen(false);
              }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                color: '#111827',
                textDecoration: 'none',
                padding: '8px 0',
                cursor: 'pointer',
              }}
            >
              {link.label}
            </a>
          ))}
          <div
            style={{
              borderTop: '1px solid #E5E7EB',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <button
              onClick={() => { onNavigate('search'); setMobileOpen(false); }}
              style={{
                background: '#3B5BFF',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              Find a lot
            </button>
            <button
              onClick={() => { onNavigate('list-lot'); setMobileOpen(false); }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '12px 24px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                color: '#111827',
                cursor: 'pointer',
              }}
            >
              List your lot
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
          .nav-ctas { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
          .nav-inner { padding: 0 24px !important; }
        }
      `}</style>
    </nav>
  );
}
