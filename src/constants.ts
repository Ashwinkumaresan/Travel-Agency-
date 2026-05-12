import { Booking, Ticket, TripFinance, User, Driver, Vehicle, RouteMapping, GDM } from './types';

export const COURIER_LOCATIONS = ['Chennai', 'Salem', 'Vellore', 'Coimbatore', 'Erode', 'Namakkal'] as const;
export const COURIER_RATE_PER_KG = 30;

export const TRANSPORT_TYPES = [
  { id: 'car-2', name: 'Car 2 Seater', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80', capacity: 2 },
  { id: 'car-4', name: 'Car 4 Seater', image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80', capacity: 4 },
  { id: 'omni', name: 'Omni', image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=400&q=80', capacity: 8 },
  { id: 'traveler-van', name: 'Traveler Van', image: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&w=400&q=80', capacity: 12 },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    packageId: 'traveler-van',
    packageName: 'Traveler Van',
    destination: 'Coimbatore',
    travelDate: '2026-05-15',
    travellersCount: 1,
    totalPrice: 450,
    status: 'in-place',
    paymentMode: 'pre-paid',
    paymentStatus: 'paid',
    customerName: 'Arjun Reddy',
    customerEmail: 'arjun@example.com',
    submittedAt: '2026-05-10T10:00:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Coimbatore',
    lrNo: 'LR-2026-001',
    weightKg: 15,
    vehicleNo: ''
  },
  {
    id: 'BK-1002',
    packageId: 'omni',
    packageName: 'Omni',
    destination: 'Salem',
    travelDate: '2026-05-16',
    travellersCount: 1,
    totalPrice: 320,
    status: 'in-place',
    paymentMode: 'post-paid',
    paymentStatus: 'to-pay',
    customerName: 'Priya Mani',
    customerEmail: 'priya@example.com',
    submittedAt: '2026-05-11T14:30:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Salem',
    lrNo: 'LR-2026-002',
    weightKg: 8,
    vehicleNo: ''
  },
  {
    id: 'BK-1003',
    packageId: 'heavy-truck',
    packageName: 'Heavy Truck',
    destination: 'Vellore',
    travelDate: '2026-05-15',
    travellersCount: 1,
    totalPrice: 1200,
    status: 'shipping',
    paymentMode: 'pre-paid',
    paymentStatus: 'paid',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram@example.com',
    submittedAt: '2026-05-09T08:15:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Vellore',
    lrNo: 'LR-2026-003',
    weightKg: 450,
    vehicleNo: 'TN-01-AB-1234'
  },
  {
    id: 'BK-1004',
    packageId: 'delivery-van',
    packageName: 'Delivery Van',
    destination: 'Namakkal',
    travelDate: '2026-05-17',
    travellersCount: 1,
    totalPrice: 280,
    status: 'incoming',
    paymentMode: 'post-paid',
    paymentStatus: 'to-pay',
    customerName: 'Sathish Kumar',
    customerEmail: 'sathish@example.com',
    submittedAt: '2026-05-11T11:20:00Z',
    pickupLocation: 'Salem',
    deliveryLocation: 'Namakkal',
    lrNo: 'LR-2026-004',
    weightKg: 5,
    vehicleNo: 'TN-03-EF-9012'
  },
  {
    id: 'BK-1005',
    packageId: 'mini-van',
    packageName: 'Mini Van',
    destination: 'Chennai',
    travelDate: '2026-05-14',
    travellersCount: 1,
    totalPrice: 550,
    status: 'received',
    paymentMode: 'pre-paid',
    paymentStatus: 'paid',
    customerName: 'Deepika Rao',
    customerEmail: 'deepika@example.com',
    submittedAt: '2026-05-08T16:45:00Z',
    pickupLocation: 'Coimbatore',
    deliveryLocation: 'Chennai',
    lrNo: 'LR-2026-005',
    weightKg: 20,
    vehicleNo: 'TN-04-GH-3456'
  },
  {
    id: 'BK-1006',
    packageId: 'delivery-van',
    packageName: 'Delivery Van',
    destination: 'Erode',
    travelDate: '2026-05-18',
    travellersCount: 1,
    totalPrice: 410,
    status: 'in-place',
    paymentMode: 'post-paid',
    paymentStatus: 'to-pay',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul@example.com',
    submittedAt: '2026-05-12T09:10:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Erode',
    lrNo: 'LR-2026-006',
    weightKg: 12,
    vehicleNo: ''
  },
  {
    id: 'BK-1007',
    packageId: 'omni',
    packageName: 'Omni',
    destination: 'Vellore',
    travelDate: '2026-05-19',
    travellersCount: 1,
    totalPrice: 190,
    status: 'in-place',
    paymentMode: 'pre-paid',
    paymentStatus: 'paid',
    customerName: 'Anitha Raj',
    customerEmail: 'anitha@example.com',
    submittedAt: '2026-05-12T10:30:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Vellore',
    lrNo: 'LR-2026-007',
    weightKg: 4,
    vehicleNo: ''
  },
  {
    id: 'BK-1008',
    packageId: 'heavy-truck',
    packageName: 'Heavy Truck',
    destination: 'Salem',
    travelDate: '2026-05-15',
    travellersCount: 1,
    totalPrice: 2200,
    status: 'shipping',
    paymentMode: 'post-paid',
    paymentStatus: 'to-pay',
    customerName: 'Karthik Raja',
    customerEmail: 'karthik@example.com',
    submittedAt: '2026-05-09T12:00:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Salem',
    lrNo: 'LR-2026-008',
    weightKg: 800,
    vehicleNo: 'TN-01-AB-1234'
  },
  {
    id: 'BK-1009',
    packageId: 'delivery-van',
    packageName: 'Delivery Van',
    destination: 'Coimbatore',
    travelDate: '2026-05-20',
    travellersCount: 1,
    totalPrice: 380,
    status: 'in-place',
    paymentMode: 'post-paid',
    paymentStatus: 'to-pay',
    customerName: 'Meera Nair',
    customerEmail: 'meera@example.com',
    submittedAt: '2026-05-11T16:00:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Coimbatore',
    lrNo: 'LR-2026-009',
    weightKg: 10,
    vehicleNo: ''
  },
  {
    id: 'BK-1010',
    packageId: 'mini-van',
    packageName: 'Mini Van',
    destination: 'Namakkal',
    travelDate: '2026-05-15',
    travellersCount: 1,
    totalPrice: 420,
    status: 'incoming',
    paymentMode: 'pre-paid',
    paymentStatus: 'paid',
    customerName: 'Vijay Sethu',
    customerEmail: 'vijay@example.com',
    submittedAt: '2026-05-10T14:45:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Namakkal',
    lrNo: 'LR-2026-010',
    weightKg: 18,
    vehicleNo: 'TN-02-CD-5678'
  },
  {
    id: 'BK-1011',
    packageId: 'omni',
    packageName: 'Omni',
    destination: 'Chennai',
    travelDate: '2026-05-16',
    travellersCount: 1,
    totalPrice: 350,
    status: 'received',
    paymentMode: 'post-paid',
    paymentStatus: 'to-pay',
    customerName: 'Sneha Latha',
    customerEmail: 'sneha@example.com',
    submittedAt: '2026-05-11T09:30:00Z',
    pickupLocation: 'Salem',
    deliveryLocation: 'Chennai',
    lrNo: 'LR-2026-011',
    weightKg: 7,
    vehicleNo: 'TN-03-EF-9012'
  },
  {
    id: 'BK-1012',
    packageId: 'delivery-van',
    packageName: 'Delivery Van',
    destination: 'Salem',
    travelDate: '2026-05-22',
    travellersCount: 1,
    totalPrice: 260,
    status: 'in-place',
    paymentMode: 'pre-paid',
    paymentStatus: 'paid',
    customerName: 'Ganesh Gaitonde',
    customerEmail: 'ganesh@example.com',
    submittedAt: '2026-05-12T11:00:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Salem',
    lrNo: 'LR-2026-012',
    weightKg: 6,
    vehicleNo: ''
  },
  {
    id: 'BK-1013',
    packageId: 'heavy-truck',
    packageName: 'Heavy Truck',
    destination: 'Namakkal',
    travelDate: '2026-05-16',
    travellersCount: 1,
    totalPrice: 1500,
    status: 'shipping',
    paymentMode: 'post-paid',
    paymentStatus: 'to-pay',
    customerName: 'Zubair Khan',
    customerEmail: 'zubair@example.com',
    submittedAt: '2026-05-10T11:15:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Namakkal',
    lrNo: 'LR-2026-013',
    weightKg: 300,
    vehicleNo: 'TN-01-AB-1234'
  },
  {
    id: 'BK-1014',
    packageId: 'delivery-van',
    packageName: 'Delivery Van',
    destination: 'Vellore',
    travelDate: '2026-05-17',
    travellersCount: 1,
    totalPrice: 320,
    status: 'incoming',
    paymentMode: 'pre-paid',
    paymentStatus: 'paid',
    customerName: 'Lokesh K',
    customerEmail: 'lokesh@example.com',
    submittedAt: '2026-05-11T13:40:00Z',
    pickupLocation: 'Salem',
    deliveryLocation: 'Vellore',
    lrNo: 'LR-2026-014',
    weightKg: 9,
    vehicleNo: 'TN-03-EF-9012'
  },
  {
    id: 'BK-1015',
    packageId: 'mini-van',
    packageName: 'Mini Van',
    destination: 'Salem',
    travelDate: '2026-05-14',
    travellersCount: 1,
    totalPrice: 480,
    status: 'received',
    paymentMode: 'pre-paid',
    paymentStatus: 'paid',
    customerName: 'Anirudh R',
    customerEmail: 'ani@example.com',
    submittedAt: '2026-05-08T15:20:00Z',
    pickupLocation: 'Chennai',
    deliveryLocation: 'Salem',
    lrNo: 'LR-2026-015',
    weightKg: 22,
    vehicleNo: 'TN-01-AB-1234'
  }
];

export const MOCK_GDMS: GDM[] = [
  {
    id: 'GDM-001',
    gdmNo: 'GDM-2026-001',
    vehicleNo: 'TN-01-AB-1234',
    driverName: 'Ravi Teja',
    driverPhone: '+91 98765 43210',
    route: 'Chennai → Salem → Coimbatore',
    totalLRCount: 5,
    totalPackages: 12,
    totalWeight: 1560,
    totalFreight: 5800,
    paidCount: 3,
    toPayCount: 2,
    dispatchDate: '2026-05-12T09:00:00Z',
    status: 'generated',
    lrIds: ['BK-1003', 'BK-1008', 'BK-1013', 'BK-1015']
  },
  {
    id: 'GDM-002',
    gdmNo: 'GDM-2026-002',
    vehicleNo: 'TN-03-EF-9012',
    driverName: 'Kumar Swami',
    driverPhone: '+91 98765 43211',
    route: 'Chennai → Vellore → Coimbatore',
    totalLRCount: 3,
    totalPackages: 8,
    totalWeight: 1200,
    totalFreight: 4200,
    paidCount: 2,
    toPayCount: 1,
    dispatchDate: '2026-05-13T10:30:00Z',
    status: 'draft',
    lrIds: ['BK-1004', 'BK-1011', 'BK-1014']
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
    vehicleNumber: 'TN-01-AB-1234',
    routePath: ['Chennai', 'Coimbatore'],
    stopsCount: 0
  },
  { 
    id: 'RM-002', 
    from: 'Chennai', 
    to: 'Salem', 
    driverId: 4, 
    driverName: 'Kumar Swami', 
    vehicleId: 2, 
    vehicleNumber: 'TN-02-CD-5678',
    routePath: ['Chennai', 'Salem'],
    stopsCount: 0
  },
  { 
    id: 'RM-003', 
    from: 'Salem', 
    to: 'Chennai', 
    driverId: 1, 
    driverName: 'Suresh Kumar', 
    vehicleId: 3, 
    vehicleNumber: 'TN-03-EF-9012',
    routePath: ['Salem', 'Chennai'],
    stopsCount: 0
  },
];
