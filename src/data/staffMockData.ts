import { ROOMS, BOOKINGS, INVOICES } from './mockData';
export { ROOMS, BOOKINGS, INVOICES };

export type StaffRole = 'manager' | 'receptionist' | 'housekeeping' | 'concierge';
export type RoomCondition = 'clean' | 'dirty' | 'cleaning' | 'maintenance';
export type ShiftType = 'morning' | 'afternoon' | 'night';
export type TaskStatus = 'pending' | 'in_progress' | 'done';

export interface StaffMember {
  id: string;
  name: string;
  nameJa: string;
  role: StaffRole;
  email: string;
  phone: string;
  avatar: string;
  shift: ShiftType;
  department: string;
  departmentJa: string;
  joinDate: string;
  status: 'active' | 'off' | 'leave';
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomName: string;
  roomNameJa: string;
  floor: number;
  assignedTo: string;
  assignedToJa: string;
  type: 'checkout_clean' | 'daily_clean' | 'deep_clean' | 'turndown';
  status: TaskStatus;
  priority: 'high' | 'medium' | 'low';
  scheduledTime: string;
  completedTime?: string;
  notes?: string;
}

export interface RoomStatus {
  roomId: string;
  condition: RoomCondition;
  lastCleaned?: string;
  assignedStaff?: string;
  maintenanceNote?: string;
}

export interface ShiftReport {
  id: string;
  date: string;
  shift: ShiftType;
  staffId: string;
  staffName: string;
  staffNameJa: string;
  checkInsCount: number;
  checkOutsCount: number;
  newBookings: number;
  issuesReported: number;
  notes: string;
  submittedAt: string;
}

export interface Notification {
  id: string;
  type: 'checkin' | 'checkout' | 'housekeeping' | 'maintenance' | 'booking' | 'alert';
  title: string;
  titleJa: string;
  message: string;
  messageJa: string;
  time: string;
  read: boolean;
}

// Staff Members
export const STAFF_MEMBERS: StaffMember[] = [
  { id: 's001', name: 'Tanaka Yuki', nameJa: '田中 雪', role: 'manager', email: 'yuki.tanaka@grandhotel.jp', phone: '03-1234-0001', avatar: 'TY', shift: 'morning', department: 'Front Office', departmentJa: 'フロントオフィス', joinDate: '2020-04-01', status: 'active' },
  { id: 's002', name: 'Sato Kenji', nameJa: '佐藤 健二', role: 'receptionist', email: 'kenji.sato@grandhotel.jp', phone: '03-1234-0002', avatar: 'SK', shift: 'morning', department: 'Front Office', departmentJa: 'フロントオフィス', joinDate: '2021-07-15', status: 'active' },
  { id: 's003', name: 'Yamamoto Hana', nameJa: '山本 花', role: 'receptionist', email: 'hana.yamamoto@grandhotel.jp', phone: '03-1234-0003', avatar: 'YH', shift: 'afternoon', department: 'Front Office', departmentJa: 'フロントオフィス', joinDate: '2022-01-10', status: 'active' },
  { id: 's004', name: 'Ito Masaru', nameJa: '伊藤 勝', role: 'housekeeping', email: 'masaru.ito@grandhotel.jp', phone: '03-1234-0004', avatar: 'IM', shift: 'morning', department: 'Housekeeping', departmentJa: 'ハウスキーピング', joinDate: '2021-03-20', status: 'active' },
  { id: 's005', name: 'Watanabe Emi', nameJa: '渡辺 恵美', role: 'housekeeping', email: 'emi.watanabe@grandhotel.jp', phone: '03-1234-0005', avatar: 'WE', shift: 'morning', department: 'Housekeeping', departmentJa: 'ハウスキーピング', joinDate: '2022-06-01', status: 'active' },
  { id: 's006', name: 'Nakamura Ryo', nameJa: '中村 涼', role: 'concierge', email: 'ryo.nakamura@grandhotel.jp', phone: '03-1234-0006', avatar: 'NR', shift: 'afternoon', department: 'Concierge', departmentJa: 'コンシェルジュ', joinDate: '2020-09-15', status: 'active' },
  { id: 's007', name: 'Kobayashi Mei', nameJa: '小林 芽衣', role: 'receptionist', email: 'mei.kobayashi@grandhotel.jp', phone: '03-1234-0007', avatar: 'KM', shift: 'night', department: 'Front Office', departmentJa: 'フロントオフィス', joinDate: '2023-02-01', status: 'active' },
  { id: 's008', name: 'Suzuki Taro', nameJa: '鈴木 太郎', role: 'housekeeping', email: 'taro.suzuki@grandhotel.jp', phone: '03-1234-0008', avatar: 'ST', shift: 'afternoon', department: 'Housekeeping', departmentJa: 'ハウスキーピング', joinDate: '2023-05-10', status: 'off' },
];

// Room Status Map
export const ROOM_STATUS_MAP: Record<string, RoomStatus> = {
  r001: { roomId: 'r001', condition: 'clean' },
  r002: { roomId: 'r002', condition: 'dirty', lastCleaned: '2024-03-18 11:00', assignedStaff: '伊藤 勝' },
  r003: { roomId: 'r003', condition: 'clean', lastCleaned: '2024-03-22 09:30' },
  r004: { roomId: 'r004', condition: 'cleaning', assignedStaff: '渡辺 恵美' },
  r005: { roomId: 'r005', condition: 'maintenance', maintenanceNote: 'エアコン修理中' },
  r006: { roomId: 'r006', condition: 'dirty', lastCleaned: '2024-03-12 10:00' },
};

// Housekeeping Tasks
export const HOUSEKEEPING_TASKS: HousekeepingTask[] = [
  { id: 'hk001', roomId: 'r002', roomName: 'Deluxe Double Room', roomNameJa: 'デラックスダブルルーム', floor: 5, assignedTo: 'Ito Masaru', assignedToJa: '伊藤 勝', type: 'checkout_clean', status: 'pending', priority: 'high', scheduledTime: '11:00', notes: 'チェックアウト後の清掃' },
  { id: 'hk002', roomId: 'r006', roomName: 'Standard Single Room', roomNameJa: 'スタンダードシングルルーム', floor: 2, assignedTo: 'Watanabe Emi', assignedToJa: '渡辺 恵美', type: 'checkout_clean', status: 'in_progress', priority: 'high', scheduledTime: '10:30' },
  { id: 'hk003', roomId: 'r001', roomName: 'Standard Twin Room', roomNameJa: 'スタンダードツインルーム', floor: 3, assignedTo: 'Ito Masaru', assignedToJa: '伊藤 勝', type: 'daily_clean', status: 'done', priority: 'medium', scheduledTime: '09:00', completedTime: '09:45' },
  { id: 'hk004', roomId: 'r004', roomName: 'Family Room', roomNameJa: 'ファミリールーム', floor: 4, assignedTo: 'Suzuki Taro', assignedToJa: '鈴木 太郎', type: 'daily_clean', status: 'pending', priority: 'medium', scheduledTime: '14:00' },
  { id: 'hk005', roomId: 'r003', roomName: 'Executive Suite', roomNameJa: 'エグゼクティブスイート', floor: 10, assignedTo: 'Watanabe Emi', assignedToJa: '渡辺 恵美', type: 'turndown', status: 'pending', priority: 'low', scheduledTime: '17:00' },
];

// Shift Reports
export const SHIFT_REPORTS: ShiftReport[] = [
  { id: 'sr001', date: '2024-03-22', shift: 'morning', staffId: 's002', staffName: 'Sato Kenji', staffNameJa: '佐藤 健二', checkInsCount: 3, checkOutsCount: 2, newBookings: 1, issuesReported: 0, notes: '特に問題なし。スムーズな対応ができました。', submittedAt: '2024-03-22 14:55' },
  { id: 'sr002', date: '2024-03-21', shift: 'afternoon', staffId: 's003', staffName: 'Yamamoto Hana', staffNameJa: '山本 花', checkInsCount: 2, checkOutsCount: 1, newBookings: 3, issuesReported: 1, notes: '305号室のエアコンに不具合あり。メンテナンスに連絡済み。', submittedAt: '2024-03-21 22:50' },
  { id: 'sr003', date: '2024-03-21', shift: 'morning', staffId: 's002', staffName: 'Sato Kenji', staffNameJa: '佐藤 健二', checkInsCount: 4, checkOutsCount: 3, newBookings: 2, issuesReported: 0, notes: 'VIPゲスト（山田様）のチェックイン対応。特別リクエスト対応済み。', submittedAt: '2024-03-21 14:58' },
  { id: 'sr004', date: '2024-03-20', shift: 'night', staffId: 's007', staffName: 'Kobayashi Mei', staffNameJa: '小林 芽衣', checkInsCount: 1, checkOutsCount: 0, newBookings: 0, issuesReported: 1, notes: '深夜に騒音クレームあり。対応済み。', submittedAt: '2024-03-21 07:02' },
];

// Notifications
export const NOTIFICATIONS: Notification[] = [
  { id: 'n001', type: 'checkin', title: 'Check-in Due', titleJa: 'チェックイン予定', message: 'Yamada Ichiro - Executive Suite (Room 1003)', messageJa: '山田 一郎様 - エグゼクティブスイート（1003号室）', time: '14:00', read: false },
  { id: 'n002', type: 'checkout', title: 'Check-out Due', titleJa: 'チェックアウト予定', message: 'Tanaka Taro - Deluxe Double (Room 502)', messageJa: '田中 太郎様 - デラックスダブル（502号室）', time: '11:00', read: false },
  { id: 'n003', type: 'housekeeping', title: 'Room Ready', titleJa: 'お部屋準備完了', message: 'Room 301 cleaning completed by Ito Masaru', messageJa: '301号室の清掃が完了しました（伊藤 勝）', time: '09:45', read: true },
  { id: 'n004', type: 'maintenance', title: 'Maintenance Alert', titleJa: 'メンテナンス警告', message: 'Room 505 - AC unit requires repair', messageJa: '505号室 - エアコンの修理が必要です', time: '08:30', read: false },
  { id: 'n005', type: 'booking', title: 'New Booking', titleJa: '新規予約', message: 'New booking BK2024009 received online', messageJa: 'オンラインで新規予約 BK2024009 を受信しました', time: '07:15', read: true },
];

// Today's arrivals & departures
export const TODAY_ARRIVALS = BOOKINGS.filter(b => b.status === 'confirmed').slice(0, 3);
export const TODAY_DEPARTURES = BOOKINGS.filter(b => b.status === 'checked_in').slice(0, 2);
