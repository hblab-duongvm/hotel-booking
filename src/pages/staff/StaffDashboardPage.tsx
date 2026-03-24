import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck, BedDouble, ClipboardList,
  ArrowRight, CheckCircle, Clock, AlertTriangle, UserCheck, LogOut
} from 'lucide-react';
import {
  BOOKINGS, ROOMS, HOUSEKEEPING_TASKS, NOTIFICATIONS,
  TODAY_ARRIVALS, TODAY_DEPARTURES, ROOM_STATUS_MAP
} from '../../data/staffMockData';

interface Props { lang: 'ja' | 'en' }

const StaffDashboardPage: React.FC<Props> = ({ lang }) => {
  const navigate = useNavigate();
  const isJa = lang === 'ja';

  const pendingHK = HOUSEKEEPING_TASKS.filter(t => t.status === 'pending').length;
  const cleanRooms = Object.values(ROOM_STATUS_MAP).filter(r => r.condition === 'clean').length;
  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read).length;

  const kpis = [
    {
      label: isJa ? '本日の到着' : "Today's Arrivals",
      value: TODAY_ARRIVALS.length,
      icon: <UserCheck className="w-5 h-5" />,
      color: 'bg-blue-500',
      light: 'bg-blue-50 text-blue-700',
      sub: isJa ? '確定済み予約' : 'Confirmed bookings',
      onClick: () => navigate('/staff/bookings'),
    },
    {
      label: isJa ? '本日の出発' : "Today's Departures",
      value: TODAY_DEPARTURES.length,
      icon: <LogOut className="w-5 h-5" />,
      color: 'bg-orange-500',
      light: 'bg-orange-50 text-orange-700',
      sub: isJa ? 'チェックイン中' : 'Currently checked in',
      onClick: () => navigate('/staff/bookings'),
    },
    {
      label: isJa ? '清掃待ち' : 'Pending Cleaning',
      value: pendingHK,
      icon: <ClipboardList className="w-5 h-5" />,
      color: 'bg-purple-500',
      light: 'bg-purple-50 text-purple-700',
      sub: isJa ? 'タスク未完了' : 'Tasks incomplete',
      onClick: () => navigate('/staff/housekeeping'),
    },
    {
      label: isJa ? '空き客室' : 'Clean Rooms',
      value: cleanRooms,
      icon: <BedDouble className="w-5 h-5" />,
      color: 'bg-green-500',
      light: 'bg-green-50 text-green-700',
      sub: isJa ? `全${ROOMS.length}室中` : `Out of ${ROOMS.length} rooms`,
      onClick: () => navigate('/staff/rooms'),
    },
  ];

  const statusColor: Record<string, string> = {
    confirmed: 'badge-blue',
    checked_in: 'badge-green',
    checked_out: 'badge-gray',
    cancelled: 'badge-red',
  };
  const statusLabel: Record<string, { ja: string; en: string }> = {
    confirmed: { ja: '確定済み', en: 'Confirmed' },
    checked_in: { ja: 'チェックイン済み', en: 'Checked In' },
    checked_out: { ja: 'チェックアウト済み', en: 'Checked Out' },
    cancelled: { ja: 'キャンセル', en: 'Cancelled' },
  };

  const taskPriorityColor: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">
            {isJa ? 'おはようございます、佐藤 健二さん 👋' : 'Good morning, Sato Kenji 👋'}
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            {isJa
              ? `本日 ${new Date().toLocaleDateString('ja-JP')} — モーニングシフト`
              : `Today ${new Date().toLocaleDateString('en-US')} — Morning Shift`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadNotifs > 0 && (
            <div className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
              {isJa ? `${unreadNotifs}件の未読通知` : `${unreadNotifs} unread alerts`}
            </div>
          )}
          <div className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
            {isJa ? '勤務中' : 'On Duty'}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <button key={i} onClick={kpi.onClick} className="card p-4 text-left hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center text-white`}>
                {kpi.icon}
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-sm font-medium text-gray-700 mt-0.5">{kpi.label}</div>
            <div className="text-xs text-gray-400 mt-1">{kpi.sub}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Arrivals */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-gray-900 text-sm">{isJa ? '本日の到着予定' : "Today's Arrivals"}</h3>
            </div>
            <button onClick={() => navigate('/staff/bookings')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              {isJa ? '全て見る' : 'View all'} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {TODAY_ARRIVALS.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">{isJa ? '本日の到着予定はありません' : 'No arrivals today'}</div>
            ) : (
              TODAY_ARRIVALS.map(b => (
                <div key={b.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">
                      {b.guest.lastName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{b.guest.lastName} {b.guest.firstName}</div>
                      <div className="text-xs text-gray-500">{isJa ? b.room.nameJa : b.room.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{b.checkIn}</div>
                    <button
                      onClick={() => navigate('/staff/bookings')}
                      className="mt-1 text-xs bg-blue-600 text-white px-2.5 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {isJa ? 'チェックイン' : 'Check In'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Departures */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-orange-500" />
              <h3 className="font-bold text-gray-900 text-sm">{isJa ? '本日の出発予定' : "Today's Departures"}</h3>
            </div>
            <button onClick={() => navigate('/staff/bookings')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              {isJa ? '全て見る' : 'View all'} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {TODAY_DEPARTURES.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">{isJa ? '本日の出発予定はありません' : 'No departures today'}</div>
            ) : (
              TODAY_DEPARTURES.map(b => (
                <div key={b.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-xs font-bold">
                      {b.guest.lastName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{b.guest.lastName} {b.guest.firstName}</div>
                      <div className="text-xs text-gray-500">{isJa ? b.room.nameJa : b.room.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{b.checkOut}</div>
                    <button
                      onClick={() => navigate('/staff/bookings')}
                      className="mt-1 text-xs bg-orange-500 text-white px-2.5 py-1 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      {isJa ? 'チェックアウト' : 'Check Out'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Housekeeping Tasks */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-purple-500" />
              <h3 className="font-bold text-gray-900 text-sm">{isJa ? '清掃タスク' : 'Housekeeping Tasks'}</h3>
            </div>
            <button onClick={() => navigate('/staff/housekeeping')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              {isJa ? '全て見る' : 'View all'} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {HOUSEKEEPING_TASKS.slice(0, 4).map(task => (
              <div key={task.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.status === 'done' ? 'bg-green-500' :
                    task.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{isJa ? task.roomNameJa : task.roomName}</div>
                    <div className="text-xs text-gray-500">{isJa ? task.assignedToJa : task.assignedTo} · {task.scheduledTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${taskPriorityColor[task.priority]}`}>
                    {isJa
                      ? task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'
                      : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  {task.status === 'done'
                    ? <CheckCircle className="w-4 h-4 text-green-500" />
                    : task.status === 'in_progress'
                    ? <Clock className="w-4 h-4 text-yellow-500" />
                    : <Clock className="w-4 h-4 text-gray-300" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-green-500" />
              <h3 className="font-bold text-gray-900 text-sm">{isJa ? '最近の予約' : 'Recent Bookings'}</h3>
            </div>
            <button onClick={() => navigate('/staff/bookings')} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              {isJa ? '全て見る' : 'View all'} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {BOOKINGS.slice(0, 5).map(b => (
              <div key={b.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="text-sm font-medium text-gray-900">{b.guest.lastName} {b.guest.firstName}</div>
                  <div className="text-xs text-gray-400">{b.id} · {b.checkIn}</div>
                </div>
                <span className={statusColor[b.status]}>
                  {isJa ? statusLabel[b.status].ja : statusLabel[b.status].en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <h3 className="font-bold text-gray-900 text-sm">{isJa ? '最新の通知' : 'Latest Notifications'}</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {NOTIFICATIONS.map(n => (
            <div key={n.id} className={`px-5 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                n.type === 'checkin' ? 'bg-green-500' :
                n.type === 'checkout' ? 'bg-orange-500' :
                n.type === 'maintenance' ? 'bg-red-500' :
                n.type === 'housekeeping' ? 'bg-purple-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">{isJa ? n.titleJa : n.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{isJa ? n.messageJa : n.message}</div>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">{n.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
