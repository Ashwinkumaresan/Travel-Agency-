export type UserRole = 'customer' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  staffId?: string;
  location?: string; // Assigned location for staff
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
}

export interface Vehicle {
  id: number;
  name: string;
  number: string;
}

export interface RouteMapping {
  id: string;
  from: string;
  to: string;
  driverId: number;
  driverName: string;
  vehicleId: number;
  vehicleNumber: string;
}

export type BookingStatus = 'in-place' | 'shipping' | 'sent' | 'incoming' | 'received' | 'pending' | 'confirmed' | 'due' | 'completed' | 'cancelled';
export type PaymentMode = 'pre-paid' | 'post-paid' | 'half-half';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Booking {
  id: string;
  packageId: string;
  packageName: string;
  destination: string;
  travelDate: string;
  travellersCount: number;
  totalPrice: number;
  status: BookingStatus;
  paymentMode: PaymentMode;
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentDeadline?: string;
  customerName: string;
  customerEmail: string;
  submittedAt: string;
  assignedStaffId?: string;
  
  // New fields for transport booking
  gender?: string;
  age?: number;
  phone1?: string;
  phone2?: string;
  pickupAddress?: string;
  dropAddress?: string;
  totalMembers?: number;
  totalMales?: number;
  totalFemales?: number;
  prePaymentDeadline?: string;
  postPaymentDeadline?: string;
  halfPaymentDeadline?: string;
  
  // Courier Booking Fields
  isFragile?: boolean;
  productDescription?: string;
  weightKg?: number;
  ratePerKg?: number;
  pickupLocation?: string;
  deliveryLocation?: string;
  vehicleNo?: string;
  completedAt?: string; // Timestamp for report
}

export interface DailyLog {
  id: string;
  staffId: string;
  staffName: string;
  location: string;
  courierId: string;
  action: 'sent' | 'received';
  timestamp: string;
}

export type TicketCategory = 'Booked' | 'Completed' | 'Common Query';

export interface Ticket {
  id: string;
  subject: string;
  category: TicketCategory;
  bookingId?: string;
  customerId: string;
  customerName: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  attachments?: string[];
}

export interface ExpenseItem {
  label: string;
  amount: number;
}

export interface TripFinance {
  id: string;
  bookingId: string;
  expenses: ExpenseItem[];
  revenue: number;
  profit: number;
  loss: number;
  updatedAt: string;
}
