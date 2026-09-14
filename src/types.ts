export interface ParkingSlot {
  id: string;
  label: string;
  type: 'car' | 'bike' | 'ev' | 'accessible';
  status: 'available' | 'occupied' | 'reserved';
  floor: string;
  price: number;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number;
  rating: number;
  distance: string;
  image: string;
  amenities: string[];
  category: string;
}

export interface Booking {
  id: string;
  venue: string;
  slot: string;
  date: string;
  startTime: string;
  endTime: string;
  plate: string;
  amount: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  qrCode: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: 'car' | 'bike' | 'ev';
  brand: string;
  model: string;
  color: string;
  isFastagLinked: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  venue: string;
  avatar: string;
  rating: number;
  quote: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  date: string;
  readTime: string;
}
