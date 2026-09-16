import './index.css';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
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
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import ComponentsShowcase from './pages/ComponentsShowcase';
import type { Venue, ParkingSlot } from './types';
import { MOCK_VENUES } from './data/mockData';


// ─── Scroll to top on every route change ─────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

// ─── Marketing home ───────────────────────────────────────────────
function MarketingHome() {
  const navigate = useNavigate();
  const nav = (page: string) => navigate(`/${page === 'home' ? '' : page}`);
  return (
    <>
      <Hero onNavigate={nav} />
      <div id="businesses">
        <VenueStrip onNavigate={nav} />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="pricing">
        <TechSection />
      </div>
      <Testimonials />
      <div id="contact">
        <Footer />
      </div>
    </>
  );
}

// ─── Location page wrapper (reads venue from router state) ────────
function LocationPageRoute() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { venue?: Venue } };
  const venue = state?.venue ?? MOCK_VENUES[0];

  const nav = (_page: string, data?: unknown) => {
    const d = data as { venue?: Venue; slot?: ParkingSlot } | undefined;
    navigate('/booking', { state: { venue: d?.venue ?? venue, slot: d?.slot ?? null } });
  };
  return <LocationPage venue={venue} onNavigate={nav} />;
}

// ─── Booking page wrapper (reads venue + slot from router state) ──
function BookingPageRoute() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { venue?: Venue; slot?: ParkingSlot } };
  const venue = state?.venue ?? MOCK_VENUES[0];
  const slot = state?.slot ?? null;

  const nav = (page: string) => navigate(`/${page}`);
  return <BookingPage venue={venue} slot={slot} onNavigate={nav} />;
}

// ─── SearchPage wrapper ───────────────────────────────────────────
function SearchPageRoute() {
  const navigate = useNavigate();
  const nav = (_page: string, data?: unknown) => {
    const d = data as { venue?: Venue } | undefined;
    if (d?.venue) {
      navigate(`/location/${d.venue.id}`, { state: { venue: d.venue } });
    } else {
      navigate('/search');
    }
  };
  return <SearchPage onNavigate={nav} />;
}

// ─── MyBookingsPage wrapper ───────────────────────────────────────
function MyBookingsPageRoute() {
  const navigate = useNavigate();
  const nav = (page: string, data?: unknown) => {
    const d = data as { venue?: Venue; slot?: ParkingSlot } | undefined;
    navigate(`/${page}`, d ? { state: d } : undefined);
  };
  return <MyBookingsPage onNavigate={nav} />;
}

// ─── ListYourLotPage wrapper ──────────────────────────────────────
function ListYourLotPageRoute() {
  const navigate = useNavigate();
  const nav = (page: string) => navigate(`/${page}`);
  return <ListYourLotPage onNavigate={nav} />;
}

// ─── Root app ─────────────────────────────────────────────────────
export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // First-time visit redirect
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedParkEZ');
    if (!hasVisited && pathname === '/') {
      localStorage.setItem('hasVisitedParkEZ', 'true');
      navigate('/login');
    }
  }, [pathname, navigate]);

  const isKiosk = pathname === '/kiosk';

  return (
    <div className="min-h-screen w-full">
      <ScrollToTop />
      {!isKiosk && <Navbar activePage={pathname} onNavigate={(page) => navigate(`/${page === 'home' ? '' : page}`)} />}

      <Routes>
        <Route path="/" element={<MarketingHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/owner-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/dashboard" element={<Navigate to="/owner-dashboard" replace />} />
        <Route path="/search" element={<SearchPageRoute />} />
        <Route path="/location/:venueId" element={<LocationPageRoute />} />
        <Route path="/booking" element={<BookingPageRoute />} />
        <Route path="/bookings" element={<MyBookingsPageRoute />} />
        <Route path="/kiosk" element={<KioskScreen />} />
        <Route path="/list-lot" element={<ListYourLotPageRoute />} />
        <Route path="/components" element={<ComponentsShowcase />} />
        {/* Catch-all → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
