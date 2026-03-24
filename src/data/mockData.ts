export type RoomType = 'standard' | 'deluxe' | 'suite' | 'family' | 'executive';
export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'paid' | 'unpaid';

export interface Room {
  id: string;
  name: string;
  nameJa: string;
  type: RoomType;
  floor: number;
  capacity: number;
  size: number;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  description: string;
  descriptionJa: string;
  images: string[];
  amenities: string[];
  amenitiesJa: string[];
  available: boolean;
}

export interface Guest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  roomId: string;
  room: Room;
  guest: Guest;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  roomCharge: number;
  tax: number;
  total: number;
  status: BookingStatus;
  paymentMethod: 'hotel' | 'online';
  specialRequests?: string;
  createdAt: string;
  invoiceId: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  booking: Booking;
  issueDate: string;
  dueDate: string;
  paymentStatus: PaymentStatus;
  paidAt?: string;
}

export const ROOMS: Room[] = [
  {
    id: 'r001',
    name: 'Standard Twin Room',
    nameJa: 'スタンダードツインルーム',
    type: 'standard',
    floor: 3,
    capacity: 2,
    size: 28,
    pricePerNight: 12000,
    rating: 4.2,
    reviewCount: 128,
    description: 'A comfortable standard room with twin beds, perfect for business travelers or couples. Features modern furnishings and city views.',
    descriptionJa: 'ビジネス旅行者やカップルに最適なツインベッドの快適なスタンダードルームです。モダンな家具と市街地の眺望をお楽しみいただけます。',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
    ],
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Fridge', 'Safe', 'Hair Dryer', 'Work Desk'],
    amenitiesJa: ['無料WiFi', 'エアコン', '薄型テレビ', 'ミニ冷蔵庫', 'セーフティボックス', 'ドライヤー', 'ワークデスク'],
    available: true,
  },
  {
    id: 'r002',
    name: 'Deluxe Double Room',
    nameJa: 'デラックスダブルルーム',
    type: 'deluxe',
    floor: 5,
    capacity: 2,
    size: 36,
    pricePerNight: 18000,
    rating: 4.5,
    reviewCount: 94,
    description: 'Spacious deluxe room with a king-size bed, premium amenities, and stunning panoramic views. Ideal for a romantic getaway.',
    descriptionJa: 'キングサイズベッドとプレミアムアメニティ、パノラマビューを備えた広々としたデラックスルームです。ロマンチックな旅行に最適です。',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    ],
    amenities: ['Free WiFi', 'Air Conditioning', '55" Smart TV', 'Mini Bar', 'Bathtub', 'Balcony', 'Coffee Machine', 'Safe'],
    amenitiesJa: ['無料WiFi', 'エアコン', '55インチスマートTV', 'ミニバー', 'バスタブ', 'バルコニー', 'コーヒーメーカー', 'セーフティボックス'],
    available: true,
  },
  {
    id: 'r003',
    name: 'Executive Suite',
    nameJa: 'エグゼクティブスイート',
    type: 'suite',
    floor: 10,
    capacity: 2,
    size: 65,
    pricePerNight: 45000,
    rating: 4.9,
    reviewCount: 47,
    description: 'Our most luxurious suite featuring a separate living area, premium furnishings, and exclusive floor access. The ultimate luxury experience.',
    descriptionJa: '独立したリビングエリア、プレミアム家具、専用フロアアクセスを備えた最高級スイートです。究極の贅沢体験をお楽しみください。',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    ],
    amenities: ['Free WiFi', 'Air Conditioning', '65" OLED TV', 'Full Mini Bar', 'Jacuzzi', 'Private Terrace', 'Butler Service', 'Espresso Machine', 'Safe', 'Lounge Access'],
    amenitiesJa: ['無料WiFi', 'エアコン', '65インチ有機ELテレビ', 'フルミニバー', 'ジャグジー', 'プライベートテラス', 'バトラーサービス', 'エスプレッソマシン', 'セーフティボックス', 'ラウンジアクセス'],
    available: true,
  },
  {
    id: 'r004',
    name: 'Family Room',
    nameJa: 'ファミリールーム',
    type: 'family',
    floor: 4,
    capacity: 4,
    size: 52,
    pricePerNight: 28000,
    rating: 4.4,
    reviewCount: 73,
    description: 'Spacious family room with two queen beds, perfect for families with children. Features a dedicated kids corner and family-friendly amenities.',
    descriptionJa: 'クイーンベッド2台を備えた広々としたファミリールームです。子供向けのコーナーとファミリー向けアメニティを完備しています。',
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    ],
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Fridge', 'Kids Corner', 'Extra Towels', 'Crib Available', 'Safe'],
    amenitiesJa: ['無料WiFi', 'エアコン', 'スマートTV', 'ミニ冷蔵庫', 'キッズコーナー', '追加タオル', 'ベビーベッド対応', 'セーフティボックス'],
    available: true,
  },
  {
    id: 'r005',
    name: 'Executive Double Room',
    nameJa: 'エグゼクティブダブルルーム',
    type: 'executive',
    floor: 8,
    capacity: 2,
    size: 42,
    pricePerNight: 32000,
    rating: 4.7,
    reviewCount: 61,
    description: 'Premium executive room with exclusive lounge access, premium bedding, and high-speed internet. Perfect for business executives.',
    descriptionJa: 'ラウンジアクセス、プレミアム寝具、高速インターネットを備えたプレミアムエグゼクティブルームです。ビジネスエグゼクティブに最適です。',
    images: [
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
      'https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80',
    ],
    amenities: ['Free WiFi', 'Air Conditioning', '50" Smart TV', 'Mini Bar', 'Lounge Access', 'Nespresso Machine', 'Bathrobe & Slippers', 'Safe', 'Work Desk'],
    amenitiesJa: ['無料WiFi', 'エアコン', '50インチスマートTV', 'ミニバー', 'ラウンジアクセス', 'ネスプレッソマシン', 'バスローブ＆スリッパ', 'セーフティボックス', 'ワークデスク'],
    available: false,
  },
  {
    id: 'r006',
    name: 'Standard Single Room',
    nameJa: 'スタンダードシングルルーム',
    type: 'standard',
    floor: 2,
    capacity: 1,
    size: 22,
    pricePerNight: 9000,
    rating: 4.0,
    reviewCount: 156,
    description: 'A cozy single room ideal for solo travelers. Compact yet comfortable with all essential amenities.',
    descriptionJa: '一人旅に最適な居心地の良いシングルルームです。コンパクトながら快適で、必要なアメニティを全て完備しています。',
    images: [
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80',
      'https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800&q=80',
    ],
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Fridge', 'Safe', 'Hair Dryer'],
    amenitiesJa: ['無料WiFi', 'エアコン', '薄型テレビ', 'ミニ冷蔵庫', 'セーフティボックス', 'ドライヤー'],
    available: true,
  },
];

const makeBooking = (
  id: string, roomId: string, firstName: string, lastName: string,
  email: string, phone: string, checkIn: string, checkOut: string,
  nights: number, guests: number, status: BookingStatus,
  paymentMethod: 'hotel' | 'online', createdAt: string
): Booking => {
  const room = ROOMS.find(r => r.id === roomId)!;
  const roomCharge = room.pricePerNight * nights;
  const tax = Math.round(roomCharge * 0.1);
  return {
    id,
    roomId,
    room,
    guest: { firstName, lastName, email, phone },
    checkIn,
    checkOut,
    nights,
    guests,
    roomCharge,
    tax,
    total: roomCharge + tax,
    status,
    paymentMethod,
    createdAt,
    invoiceId: `INV-${id.replace('BK', '')}`,
  };
};

export const BOOKINGS: Booking[] = [
  makeBooking('BK2024001', 'r002', '田中', '太郎', 'tanaka@example.com', '090-1234-5678', '2024-03-15', '2024-03-18', 3, 2, 'checked_out', 'online', '2024-03-10'),
  makeBooking('BK2024002', 'r001', '佐藤', '花子', 'sato@example.com', '080-9876-5432', '2024-03-20', '2024-03-22', 2, 1, 'checked_out', 'hotel', '2024-03-15'),
  makeBooking('BK2024003', 'r003', '山田', '一郎', 'yamada@example.com', '070-5555-1234', '2024-04-01', '2024-04-05', 4, 2, 'confirmed', 'online', '2024-03-25'),
  makeBooking('BK2024004', 'r004', '鈴木', '美咲', 'suzuki@example.com', '090-3333-7777', '2024-04-10', '2024-04-14', 4, 4, 'confirmed', 'hotel', '2024-03-28'),
  makeBooking('BK2024005', 'r005', '伊藤', '健太', 'ito@example.com', '080-2222-8888', '2024-03-22', '2024-03-24', 2, 2, 'checked_in', 'online', '2024-03-18'),
  makeBooking('BK2024006', 'r006', '渡辺', '愛', 'watanabe@example.com', '070-4444-9999', '2024-03-10', '2024-03-12', 2, 1, 'cancelled', 'hotel', '2024-03-05'),
  makeBooking('BK2024007', 'r002', '中村', '誠', 'nakamura@example.com', '090-6666-2222', '2024-04-20', '2024-04-23', 3, 2, 'confirmed', 'online', '2024-04-01'),
  makeBooking('BK2024008', 'r001', '小林', '由美', 'kobayashi@example.com', '080-7777-3333', '2024-03-28', '2024-03-30', 2, 2, 'checked_out', 'hotel', '2024-03-20'),
];

export const INVOICES: Invoice[] = BOOKINGS.map(b => ({
  id: b.invoiceId,
  bookingId: b.id,
  booking: b,
  issueDate: b.createdAt,
  dueDate: b.checkIn,
  paymentStatus: (b.status === 'cancelled' ? 'unpaid' : b.paymentMethod === 'online' ? 'paid' : b.status === 'checked_out' ? 'paid' : 'unpaid') as PaymentStatus,
  paidAt: b.paymentMethod === 'online' ? b.createdAt : b.status === 'checked_out' ? b.checkOut : undefined,
}));

export const MONTHLY_REVENUE = [
  { month: '10月', monthEn: 'Oct', revenue: 1850000, bookings: 42 },
  { month: '11月', monthEn: 'Nov', revenue: 2100000, bookings: 51 },
  { month: '12月', monthEn: 'Dec', revenue: 2850000, bookings: 68 },
  { month: '1月', monthEn: 'Jan', revenue: 1650000, bookings: 38 },
  { month: '2月', monthEn: 'Feb', revenue: 1920000, bookings: 45 },
  { month: '3月', monthEn: 'Mar', revenue: 2430000, bookings: 58 },
];

export const BOOKING_STATUS_DATA = [
  { name: '確定済み', nameEn: 'Confirmed', value: 45, color: '#3b82f6' },
  { name: 'チェックイン済み', nameEn: 'Checked In', value: 18, color: '#10b981' },
  { name: 'チェックアウト済み', nameEn: 'Checked Out', value: 28, color: '#6366f1' },
  { name: 'キャンセル済み', nameEn: 'Cancelled', value: 9, color: '#ef4444' },
];
