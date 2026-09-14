import type { ParkingSlot, Venue, Booking, Vehicle, Testimonial, BlogPost } from './types';

// ─── Parking Slots ──────────────────────────────────────────────
export const generateSlots = (floor: string, rows: number, cols: number): ParkingSlot[] => {
  const slots: ParkingSlot[] = [];
  const statuses: ParkingSlot['status'][] = ['available', 'occupied', 'occupied', 'available', 'reserved', 'available', 'occupied', 'available'];
  const types: ParkingSlot['type'][] = ['car', 'car', 'car', 'ev', 'accessible', 'car', 'bike', 'car'];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const label = `${String.fromCharCode(65 + r)}-${String(c + 1).padStart(2, '0')}`;
      slots.push({
        id: `${floor}-${label}`,
        label,
        type: types[idx % types.length],
        status: statuses[idx % statuses.length],
        floor,
        price: floor === 'B1' ? 40 : floor === 'B2' ? 35 : 30,
      });
      idx++;
    }
  }
  return slots;
};

export const MOCK_SLOTS: ParkingSlot[] = [
  ...generateSlots('G', 3, 8),
  ...generateSlots('B1', 4, 10),
  ...generateSlots('B2', 4, 10),
];

// ─── Venues ─────────────────────────────────────────────────────
export const MOCK_VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'Phoenix Marketcity Parking',
    address: 'Whitefield Main Road, Mahadevapura',
    city: 'Bengaluru',
    totalSlots: 1200,
    availableSlots: 347,
    pricePerHour: 40,
    rating: 4.7,
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80',
    amenities: ['EV Charging', 'CCTV', 'FASTag', '24/7'],
    category: 'Mall',
  },
  {
    id: 'v2',
    name: 'Kempegowda International Airport',
    address: 'Devanahalli, North Bengaluru',
    city: 'Bengaluru',
    totalSlots: 4500,
    availableSlots: 1102,
    pricePerHour: 80,
    rating: 4.5,
    distance: '38 km',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    amenities: ['Pre-book', 'EV', 'Valet', 'FASTag', 'Covered'],
    category: 'Airport',
  },
  {
    id: 'v3',
    name: 'Manipal Hospital Parking',
    address: '98, HAL Airport Road, Kodihalli',
    city: 'Bengaluru',
    totalSlots: 600,
    availableSlots: 23,
    pricePerHour: 30,
    rating: 4.2,
    distance: '4.8 km',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    amenities: ['Accessible', 'CCTV', 'FASTag'],
    category: 'Hospital',
  },
  {
    id: 'v4',
    name: 'ITC Gardenia Hotel Valet',
    address: '1, Residency Road, Shanthala Nagar',
    city: 'Bengaluru',
    totalSlots: 280,
    availableSlots: 89,
    pricePerHour: 120,
    rating: 4.9,
    distance: '2.4 km',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    amenities: ['Valet', 'EV', 'Covered', 'FASTag'],
    category: 'Hotel',
  },
  {
    id: 'v5',
    name: 'WeWork Galaxy Parking',
    address: '43, Residency Road, Richmond',
    city: 'Bengaluru',
    totalSlots: 320,
    availableSlots: 156,
    pricePerHour: 50,
    rating: 4.6,
    distance: '3.1 km',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    amenities: ['Monthly Pass', 'EV', 'FASTag', 'Bike'],
    category: 'Coworking',
  },
  {
    id: 'v6',
    name: 'ISKCON Temple Parking',
    address: 'Hare Krishna Hill, Chord Rd',
    city: 'Bengaluru',
    totalSlots: 800,
    availableSlots: 234,
    pricePerHour: 20,
    rating: 4.4,
    distance: '5.7 km',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    amenities: ['Open Air', 'FASTag', 'Bike'],
    category: 'Temple',
  },
];

// ─── Bookings ────────────────────────────────────────────────────
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-9012',
    venue: 'Phoenix Marketcity Parking',
    slot: 'B1-A-04',
    date: '2026-09-14',
    startTime: '11:00',
    endTime: '14:00',
    plate: 'KA 05 AB 4321',
    amount: 120,
    status: 'upcoming',
    qrCode: 'QR-BK-9012',
  },
  {
    id: 'BK-8847',
    venue: 'Kempegowda International Airport',
    slot: 'P2-C-18',
    date: '2026-09-10',
    startTime: '06:00',
    endTime: '14:00',
    plate: 'KA 05 AB 4321',
    amount: 640,
    status: 'completed',
    qrCode: 'QR-BK-8847',
  },
  {
    id: 'BK-8731',
    venue: 'ITC Gardenia Hotel Valet',
    slot: 'V-14',
    date: '2026-09-08',
    startTime: '19:30',
    endTime: '23:00',
    plate: 'MH 12 DE 5567',
    amount: 420,
    status: 'completed',
    qrCode: 'QR-BK-8731',
  },
  {
    id: 'BK-8612',
    venue: 'WeWork Galaxy Parking',
    slot: 'G-B-07',
    date: '2026-09-14',
    startTime: '09:00',
    endTime: '19:00',
    plate: 'KA 05 AB 4321',
    amount: 500,
    status: 'active',
    qrCode: 'QR-BK-8612',
  },
];

// ─── Vehicles ────────────────────────────────────────────────────
export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'vh1',
    plate: 'KA 05 AB 4321',
    type: 'car',
    brand: 'Tata',
    model: 'Nexon EV',
    color: 'Pristine White',
    isFastagLinked: true,
  },
  {
    id: 'vh2',
    plate: 'MH 12 DE 5567',
    type: 'car',
    brand: 'Hyundai',
    model: 'Creta',
    color: 'Typhoon Silver',
    isFastagLinked: false,
  },
  {
    id: 'vh3',
    plate: 'KA 51 S 8890',
    type: 'bike',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    color: 'Gunmetal Grey',
    isFastagLinked: false,
  },
];

// ─── Testimonials ────────────────────────────────────────────────
export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Ananya Krishnan',
    role: 'Software Engineer',
    venue: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
    quote: "Pulled up to Phoenix Marketcity at 7 PM on a Saturday. Gate scanned my plate, assigned slot B-14 — I was parked in 90 seconds. No ticket, no queue, no stress.",
  },
  {
    id: 't2',
    name: 'Rajesh Iyer',
    role: 'Founder, Lux Motors',
    venue: 'Chennai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5,
    quote: "We deployed ParkEZ at our showroom. FASTag exits cut our staff overhead by 40%. The dashboard's live feed is addictive — I check it more than Instagram.",
  },
  {
    id: 't3',
    name: 'Priya Sharma',
    role: 'Operations Head, Manipal Hospitals',
    venue: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5,
    quote: "Patient families are stressed enough. The old token system made it worse. Since ParkEZ, our patient satisfaction score for facilities jumped 22 points.",
  },
  {
    id: 't4',
    name: 'Vikram Nair',
    role: 'Weekend traveler',
    venue: 'Kochi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    rating: 4,
    quote: "Pre-booked airport parking three weeks out. Got there at 4 AM, gate opened automatically. When I landed, I just walked to my car. No ticket to look for.",
  },
];

// ─── Blog Posts ──────────────────────────────────────────────────
export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'How ANPR Cut Entry Time From 45 Seconds to 2 at Lulu Mall',
    category: 'Case Study',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    excerpt: 'A deep dive into deploying license plate recognition across 12 entry gates — the hardware, the edge-compute setup, and the results.',
    date: 'Sep 08, 2026',
    readTime: '7 min read',
  },
  {
    id: 'b2',
    title: 'Dynamic Pricing in Parking: Lessons from Surge-Pricing OTA Models',
    category: 'Insights',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    excerpt: 'We increased per-spot revenue by 31% on weekend evenings without a single complaint — here\'s the yield management logic behind it.',
    date: 'Aug 29, 2026',
    readTime: '5 min read',
  },
  {
    id: 'b3',
    title: 'EV Charging + Parking: Why the Two Must Converge Now',
    category: 'Opinion',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80',
    excerpt: 'India added 1.7M EVs in FY26. Parking operators ignoring charging infrastructure are leaving ₹3,200/slot/month on the table.',
    date: 'Aug 15, 2026',
    readTime: '6 min read',
  },
];

// ─── Dashboard stats (mock time series) ─────────────────────────
export const REVENUE_DATA = [
  { date: 'Sep 8', revenue: 42000, bookings: 187 },
  { date: 'Sep 9', revenue: 38500, bookings: 163 },
  { date: 'Sep 10', revenue: 51200, bookings: 231 },
  { date: 'Sep 11', revenue: 67800, bookings: 298 },
  { date: 'Sep 12', revenue: 58400, bookings: 261 },
  { date: 'Sep 13', revenue: 72100, bookings: 324 },
  { date: 'Sep 14', revenue: 48300, bookings: 198 },
];

export const OCCUPANCY_BY_HOUR = [
  { hour: '6AM', occupancy: 22 },
  { hour: '8AM', occupancy: 71 },
  { hour: '10AM', occupancy: 88 },
  { hour: '12PM', occupancy: 94 },
  { hour: '2PM', occupancy: 87 },
  { hour: '4PM', occupancy: 91 },
  { hour: '6PM', occupancy: 98 },
  { hour: '8PM', occupancy: 76 },
  { hour: '10PM', occupancy: 41 },
];
