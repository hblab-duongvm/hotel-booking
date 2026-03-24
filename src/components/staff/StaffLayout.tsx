import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, BedDouble, Users,
  FileText, ClipboardList, BarChart3, Bell, LogOut,
  Menu, X, ChevronRight, Settings
} from 'lucide-react';
import { NOTIFICATIONS } from '../../data/staffMockData';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  labelJa: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/staff', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', labelJa: 'ダッシュボード' },
  { path: '/staff/bookings', icon: <CalendarCheck className="w-5 h-5" />, label: 'Bookings', labelJa: '予約管理', badge: 3 },
  { path: '/staff/rooms', icon: <BedDouble className="w-5 h-5" />, label: 'Rooms', labelJa: '客室管理' },
  { path: '/staff/housekeeping', icon: <ClipboardList className="w-5 h-5" />, label: 'Housekeeping', labelJa: 'ハウスキーピング', badge: 2 },
  { path: '/staff/guests', icon: <Users className="w-5 h-5" />, label: 'Guests', labelJa: 'ゲスト管理' },
  { path: '/staff/invoices', icon: <FileText className="w-5 h-5" />, label: 'Invoices', labelJa: '請求書管理' },
  { path: '/staff/schedule', icon: <BarChart3 className="w-5 h-5" />, label: 'Schedule', labelJa: 'シフト管理' },
  { path: '/staff/reports', icon: <BarChart3 className="w-5 h-5" />, label: 'Shift Reports', labelJa: '勤務報告' },
];

interface StaffLayoutProps {
  children: React.ReactNode;
  lang: 'ja' | 'en';
  onLangChange: (l: 'ja' | 'en') => void;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children, lang, onLangChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  const isActive = (path: string) =>
    path === '/staff' ? location.pathname === '/staff' : location.pathname.startsWith(path);

  const currentPage = NAV_ITEMS.find(n => isActive(n.path));

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <BedDouble className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">Grand Hotel</div>
              <div className="text-slate-400 text-xs">{lang === 'ja' ? 'スタッフポータル' : 'Staff Portal'}</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Staff Info */}
        <div className="px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">SK</div>
            <div>
              <div className="text-white text-sm font-medium">{lang === 'ja' ? '佐藤 健二' : 'Sato Kenji'}</div>
              <div className="text-slate-400 text-xs">{lang === 'ja' ? 'フロント係' : 'Receptionist'}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5
                transition-all duration-150 group relative
                ${isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              {item.icon}
              <span className="text-sm font-medium flex-1">{lang === 'ja' ? item.labelJa : item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
              {isActive(item.path) && <ChevronRight className="w-4 h-4 opacity-60" />}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 py-3 border-t border-slate-700 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm">
            <Settings className="w-5 h-5" />
            <span>{lang === 'ja' ? '設定' : 'Settings'}</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-all text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>{lang === 'ja' ? 'ログアウト' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900">
                {currentPage ? (lang === 'ja' ? currentPage.labelJa : currentPage.label) : 'Staff Portal'}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {lang === 'ja' ? `${new Date().toLocaleDateString('ja-JP')} — グランドホテル` : `${new Date().toLocaleDateString('en-US')} — Grand Hotel`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => onLangChange(lang === 'ja' ? 'en' : 'ja')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              {lang === 'ja' ? 'EN' : 'JA'}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm">
                      {lang === 'ja' ? '通知' : 'Notifications'}
                    </span>
                    <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                      {lang === 'ja' ? '全て既読' : 'Mark all read'}
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {NOTIFICATIONS.map(n => (
                      <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            n.type === 'checkin' ? 'bg-green-500' :
                            n.type === 'checkout' ? 'bg-orange-500' :
                            n.type === 'maintenance' ? 'bg-red-500' :
                            n.type === 'housekeeping' ? 'bg-purple-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-900">
                              {lang === 'ja' ? n.titleJa : n.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 truncate">
                              {lang === 'ja' ? n.messageJa : n.message}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              SK
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
