import { Booking, Ticket, TripFinance, User, Driver, Vehicle, RouteMapping } from './types';

export const COURIER_LOCATIONS = ['Chennai', 'Salem', 'Vellore', 'Coimbatore'] as const;
export const COURIER_RATE_PER_KG = 30;

export const TRANSPORT_TYPES = [
  { id: 'car-2', name: 'Car 2 Seater', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80', capacity: 2 },
  { id: 'car-4', name: 'Car 4 Seater', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80', capacity: 4 },
  { id: 'omni', name: 'Omni', image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=400&q=80', capacity: 8 },
  { id: 'traveler-van', name: 'Traveler Van', image: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&w=400&q=80', capacity: 12 },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-20250409-0042',
    packageId: 'car-4',
    packageName: 'Car 4 Seater',
    destination: 'City Tour',
    travelDate: '2025-06-15',
    travellersCount: 4,
    totalPrice: 500,
    status: 'confirmed',
    paymentMode: 'pre-paid',
    paymentStatus: 'paid',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    submittedAt: '2025-04-01T10:00:00Z',
    gender: 'Male',
    age: 32,
    phone1: '+1234567890',
    phone2: '+0987654321',
    pickupAddress: '123 Main St, Downtown',
    dropAddress: '456 Park Ave, Uptown',
    totalMembers: 4,
    totalMales: 2,
    totalFemales: 2,
    prePaymentDeadline: '2025-06-01',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Salem'
  },
  {
    id: 'BK-20250410-0015',
    packageId: 'traveler-van',
    packageName: 'Traveler Van',
    destination: 'Mountain Trek',
    travelDate: '2025-07-20',
    travellersCount: 10,
    totalPrice: 1200,
    status: 'pending',
    paymentMode: 'half-half',
    paymentStatus: 'partial',
    paymentDeadline: '2025-05-15',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    submittedAt: '2025-04-05T14:30:00Z',
    gender: 'Female',
    age: 28,
    phone1: '+1122334455',
    phone2: '+5544332211',
    pickupAddress: '789 Lake Rd, Suburbia',
    dropAddress: '321 Mountain View, Highlands',
    totalMembers: 10,
    totalMales: 5,
    totalFemales: 5,
    halfPaymentDeadline: '2025-05-15',
    postPaymentDeadline: '2025-07-25',
    pickupLocation: 'Salem',
    deliveryLocation: 'Chennai'
  }
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TKT-0198',
    subject: 'Issue with AC in Car 4 Seater',
    category: 'Booked',
    bookingId: 'BK-20250409-0042',
    customerId: 'cust_1',
    customerName: 'John Doe',
    status: 'open',
    priority: 'medium',
    createdAt: '2025-04-08T09:00:00Z',
    updatedAt: '2025-04-08T11:00:00Z',
    messages: [
      {
        id: 'm1',
        senderId: 'cust_1',
        senderName: 'John Doe',
        senderRole: 'customer',
        text: 'The AC in the car was not cooling properly during the city tour.',
        timestamp: '2025-04-08T09:00:00Z'
      },
      {
        id: 'm2',
        senderId: 'staff_1',
        senderName: 'Staff Member',
        senderRole: 'staff',
        text: 'We apologize for the inconvenience. We will check the vehicle immediately and ensure it is fixed for your next trip.',
        timestamp: '2025-04-08T10:30:00Z'
      }
    ]
  },
  {
    id: 'TKT-0205',
    subject: 'Refund for cancelled trip',
    category: 'Completed',
    bookingId: 'BK-20250410-0015',
    customerId: 'cust_1',
    customerName: 'John Doe',
    status: 'resolved',
    priority: 'high',
    createdAt: '2025-04-09T14:00:00Z',
    updatedAt: '2025-04-10T09:00:00Z',
    messages: [
      {
        id: 'm1',
        senderId: 'cust_1',
        senderName: 'John Doe',
        senderRole: 'customer',
        text: 'I haven\'t received the refund for my cancelled mountain trek yet.',
        timestamp: '2025-04-09T14:00:00Z'
      },
      {
        id: 'm2',
        senderId: 'staff_1',
        senderName: 'Staff Member',
        senderRole: 'staff',
        text: 'The refund has been processed and should reflect in your account within 3-5 business days.',
        timestamp: '2025-04-10T09:00:00Z'
      }
    ]
  },
  {
    id: 'TKT-0210',
    subject: 'Inquiry about traveler van availability',
    category: 'Common Query',
    customerId: 'cust_1',
    customerName: 'John Doe',
    status: 'open',
    priority: 'low',
    createdAt: '2025-04-10T10:00:00Z',
    updatedAt: '2025-04-10T10:00:00Z',
    messages: [
      {
        id: 'm1',
        senderId: 'cust_1',
        senderName: 'John Doe',
        senderRole: 'customer',
        text: 'Do you have traveler vans available for next weekend?',
        timestamp: '2025-04-10T10:00:00Z'
      }
    ]
  }
];

export const MOCK_FINANCES: TripFinance[] = [
  {
    id: 'FIN-001',
    bookingId: 'BK-20250409-0042',
    expenses: [
      { label: 'Petrol', amount: 150 },
      { label: 'Driver', amount: 100 },
      { label: 'Toll', amount: 50 }
    ],
    revenue: 500,
    profit: 200,
    loss: 0,
    updatedAt: '2025-04-10T10:00:00Z'
  }
];

export const MOCK_CUSTOMERS: User[] = [
  {
    id: 'cust_1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    phone: '+1234567890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'cust_2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'customer',
    phone: '+1122334455',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'cust_3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'customer',
    phone: '+1555666777',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 1, name: 'Suresh Kumar', phone: '9876543210' },
  { id: 2, name: 'Mani Kandan', phone: '8765432109' },
  { id: 3, name: 'Ravi Teja', phone: '7654321098' },
  { id: 4, name: 'Kumar Swami', phone: '6543210987' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 1, name: 'Delivery Van', number: 'TN-01-AB-1234' },
  { id: 2, name: 'Cargo Bike', number: 'TN-02-CD-5678' },
  { id: 3, name: 'Heavy Truck', number: 'TN-03-EF-9012' },
  { id: 4, name: 'Mini Van', number: 'TN-04-GH-3456' },
];

export const MOCK_ROUTE_MAPPINGS: RouteMapping[] = [
  { 
    id: 'RM-001', 
    from: 'Chennai', 
    to: 'Coimbatore', 
    driverId: 3, 
    driverName: 'Ravi Teja', 
    vehicleId: 1, 
    vehicleNumber: 'TN-01-AB-1234' 
  },
  { 
    id: 'RM-002', 
    from: 'Chennai', 
    to: 'Salem', 
    driverId: 4, 
    driverName: 'Kumar Swami', 
    vehicleId: 2, 
    vehicleNumber: 'TN-02-CD-5678' 
  },
  { 
    id: 'RM-003', 
    from: 'Salem', 
    to: 'Chennai', 
    driverId: 1, 
    driverName: 'Suresh Kumar', 
    vehicleId: 3, 
    vehicleNumber: 'TN-03-EF-9012' 
  },
];
