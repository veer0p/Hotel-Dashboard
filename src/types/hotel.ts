// Booking Types
export type BookingStatus = 'confirmed' | 'pending' | 'checked-in' | 'checked-out' | 'cancelled';
export type PaymentMethod = 'pay-at-checkin' | 'online' | 'advance';
export type PaymentStatus = 'pending' | 'partial' | 'paid';

export interface Booking {
  id: string;
  bookingId: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  paidAmount: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  decorationPackageId?: string;
  createdAt: string;
  updatedAt: string;
}

// Room Types
export type RoomType = 'deluxe' | 'suite' | 'penthouse' | 'standard' | 'premium';
export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';
export type BedType = 'single' | 'double' | 'queen' | 'king' | 'twin';

export interface Room {
  id: string;
  roomNumber: string;
  name: string;
  type: RoomType;
  floor: number;
  size: number;
  bedType: BedType;
  maxGuests: number;
  basePrice: number;
  images: string[];
  amenities: string[];
  description: string;
  status: RoomStatus;
}

// Guest Types
export type IdType = 'passport' | 'aadhar' | 'driving-license' | 'pan';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  idType?: IdType;
  idNumber?: string;
  dateOfBirth?: string;
  anniversary?: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit?: string;
  isVIP: boolean;
  isBlacklisted: boolean;
  blacklistReason?: string;
  notes?: string;
  preferences?: GuestPreferences;
  createdAt: string;
}

export interface GuestPreferences {
  roomType?: RoomType;
  floor?: 'high' | 'low' | 'any';
  view?: 'sea' | 'garden' | 'city' | 'any';
  bedType?: BedType;
  dietaryRestrictions?: string[];
  specialRequests?: string[];
}

// Decoration Types
export type OccasionType = 'birthday' | 'anniversary' | 'honeymoon' | 'proposal' | 'celebration' | 'other';

export interface DecorationPackage {
  id: string;
  name: string;
  occasionType: OccasionType;
  price: number;
  images: string[];
  inclusions: string[];
  description: string;
  setupTime: number;
  isActive: boolean;
  showOnWebsite: boolean;
}

export interface DecorationOrder {
  id: string;
  bookingId: string;
  packageId: string;
  roomId: string;
  date: string;
  status: 'pending' | 'setup-complete' | 'delivered';
  notes?: string;
}

// Staff Types
export type StaffRole = 'admin' | 'manager' | 'front-desk' | 'housekeeping';

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  avatar?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalBookingsToday: number;
  bookingsChange: number;
  revenueToday: number;
  revenueChange: number;
  checkInsToday: number;
  checkOutsToday: number;
  availableRooms: number;
  totalRooms: number;
  roomTypeBreakdown: { type: RoomType; available: number; total: number }[];
}

export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface BookingSourceData {
  source: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  time: string;
  guestName: string;
  roomNumber: string;
  action: string;
  status: BookingStatus;
}

// Filter Types
export interface BookingFilters {
  status?: BookingStatus | 'all';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface RoomFilters {
  status?: RoomStatus | 'all';
  type?: RoomType | 'all';
  search?: string;
}

export interface GuestFilters {
  status?: 'all' | 'vip' | 'frequent' | 'blacklist';
  search?: string;
}

// Notification Types
export type NotificationType = 'booking' | 'checkin' | 'payment' | 'room-status' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
