import { useState, useCallback } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VenueStrip from './components/VenueStrip';
import HowItWorks from './components/HowItWorks';
import TechSection from './components/TechSection';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';
import LocationPage from './pages/LocationPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import KioskScreen from './pages/KioskScreen';
import AdminDashboard from './pages/AdminDashboard';
import ListYourLotPage from './pages/ListYourLotPage';
import type { Venue, ParkingSlot } from './types';
import { MOCK_VENUES } from './data/mockData';

type Page = 'home' | 'search' | 'location' | 'booking' | 'bookings' | 'kiosk' | 'dashboard' | 'list-lot';

interface NavState {
  page: Page;
  venue?: Venue;
  slot?: ParkingSlot;
}

function MarketingHome({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <VenueStrip onNavigate={onNavigate} />
      <HowItWorks />
      <TechSection />
      <Testimonials />
      <Footer />
    </>
  );
}

export default function App() {
  const [navState, setNavState] = useState<NavState>({ page: 'home' });

  const navigate = useCallback((page: string, data?: unknown) => {
    const d = data as { venue?: Venue; slot?: ParkingSlot; } | undefined;
    setNavState({ page: page as Page, venue: d?.venue, slot: d?.slot });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const isFullKiosk = navState.page === 'kiosk';
  const isHome = navState.page === 'home';

  return (
    <div className="min-h-screen w-full">
      {!isFullKiosk && <Navbar onNavigate={navigate} activePage={navState.page} />}

      {/* Demo navigation strip (non-home pages) */}
      {!isHome && !isFullKiosk && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
          style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid #E5E7EB' }}
        >
          <span className="text-[11px] font-medium text-[#6B7280] mr-1">Demo:</span>
          {[
            { id: 'home', label: 'Marketing' },
            { id: 'search', label: 'Find a Lot' },
            { id: 'list-lot', label: 'List Your Lot' },
            { id: 'bookings', label: 'My Bookings' },
            { id: 'kiosk', label: 'Kiosk' },
            { id: 'dashboard', label: 'Admin' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                navState.page === item.id
                  ? 'text-white'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
              style={navState.page === item.id ? { background: 'linear-gradient(135deg, #3B5BFF, #00C2A8)', boxShadow: '0 1px 3px rgba(59, 91, 255, 0.25)' } : {}}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Page router */}
      {navState.page === 'home' && <MarketingHome onNavigate={navigate} />}
      {navState.page === 'search' && <SearchPage onNavigate={navigate} />}
      {navState.page === 'list-lot' && <ListYourLotPage onNavigate={navigate} />}
      {navState.page === 'location' && navState.venue && (
        <LocationPage venue={navState.venue} onNavigate={navigate} />
      )}
      {navState.page === 'location' && !navState.venue && <SearchPage onNavigate={navigate} />}
      {navState.page === 'booking' && (
        <BookingPage
          venue={navState.venue || MOCK_VENUES[0]}
          slot={navState.slot || null}
          onNavigate={navigate}
        />
      )}
      {navState.page === 'bookings' && <MyBookingsPage onNavigate={navigate} />}
      {navState.page === 'kiosk' && <KioskScreen />}
      {navState.page === 'dashboard' && <AdminDashboard />}
    </div>
  );
}
