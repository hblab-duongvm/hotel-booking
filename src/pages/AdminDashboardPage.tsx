import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, BedDouble, FileText,
  Star, ArrowRight, Calendar
} from 'lucide-react';
import { BOOKINGS, MONTHLY_REVENUE, BOOKING_STATUS_DATA, ROOMS } from '../data/mockData';

const AdminDashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isJa = i18n.language === 'ja';

  const totalRevenue = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const totalBookings = BOOKINGS.length;
  const occupiedRooms = ROOMS.filter(r => !r.available).length;
  const occupancyRate = Math.round((occupiedRooms / ROOMS.length) * 100);
  const avgRating = (ROOMS.reduce((s, r) => s + r.rating, 0) / ROOMS.length).toFixed(1);

  const kpiCards = [
    {
      title: t('admin.total_revenue'),
      value: `¥${(totalRevenue / 1000000).toFixed(1)}M`,
      sub: '+12.5% ' + t('admin.vs_last_month'),
      up: true,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      title: t('admin.total_bookings'),
      value: totalBookings,
      sub: '+8.2% ' + t('admin.vs_last_month'),
      up: true,
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-green-500',
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      title: t('admin.occupancy_rate'),
      value: `${occupancyRate}%`,
      sub: '-2.1% ' + t('admin.vs_last_month'),
      up: false,
      icon: <BedDouble className="w-5 h-5" />,
      color: 'bg-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
    },
    {
      title: t('admin.avg_rating'),
      value: `${avgRating}★`,
      sub: '+0.2 ' + t('admin.vs_last_month'),
      up: true,
      icon: <Star className="w-5 h-5" />,
      color: 'bg-yellow-500',
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
    },
  ];

  const revenueData = MONTHLY_REVENUE.map(m => ({
    name: isJa ? m.month : m.monthEn,
    revenue: m.revenue,
    bookings: m.bookings,
  }));

  const pieData = BOOKING_STATUS_DATA.map(d => ({
    name: isJa ? d.name : d.nameEn,
    value: d.value,
    color: d.color,
  }));

  const roomStatusData = [
    { name: isJa ? '空き' : 'Available', value: ROOMS.filter(r => r.available).length, color: '#10b981' },
    { name: isJa ? '使用中' : 'Occupied', value: ROOMS.filter(r => !r.available).length, color: '#3b82f6' },
  ];

  const statusConfig: Record<string, { label: string; cls: string }> = {
    confirmed: { label: isJa ? '確定済み' : 'Confirmed', cls: 'badge-blue' },
    checked_in: { label: isJa ? 'チェックイン済み' : 'Checked In', cls: 'badge-green' },
    checked_out: { label: isJa ? 'チェックアウト済み' : 'Checked Out', cls: 'badge-gray' },
    cancelled: { label: isJa ? 'キャンセル済み' : 'Cancelled', cls: 'badge-red' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard_title')}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isJa ? '最終更新: ' : 'Last updated: '}{new Date().toLocaleDateString(isJa ? 'ja-JP' : 'en-US')}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/reports')}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <FileText className="w-4 h-4" />
          {t('nav.reports')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((card, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</span>
              <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center ${card.text}`}>
                {card.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold ${card.text} mb-1`}>{card.value}</div>
            <div className={`flex items-center gap-1 text-xs ${card.up ? 'text-green-600' : 'text-red-500'}`}>
              {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Revenue Bar Chart */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">{t('admin.revenue_chart')}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `¥${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={(v: unknown) => [`¥${Number(v).toLocaleString()}`, isJa ? '売上' : 'Revenue']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Pie */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">{t('admin.booking_chart')}</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Booking Trend Line */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">
            {isJa ? '予約数推移' : 'Booking Trend'}
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Room Status */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">{t('admin.room_status')}</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={roomStatusData} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                {roomStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {roomStatusData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-gray-600">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{d.value}</span>
                  <span className="text-xs text-gray-400">{isJa ? '室' : 'rooms'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-sm">{t('admin.recent_bookings')}</h2>
          <button
            onClick={() => navigate('/bookings')}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
          >
            {isJa ? '全て見る' : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[t('my_bookings.booking_id'), t('my_bookings.room'), isJa ? 'ゲスト' : 'Guest',
                  t('my_bookings.checkin'), t('my_bookings.checkout'), t('my_bookings.total'), t('my_bookings.status')
                ].map((h, i) => (
                  <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {BOOKINGS.slice(0, 6).map(b => {
                const cfg = statusConfig[b.status];
                return (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/invoice/${b.invoiceId}`)}>
                    <td className="py-3 px-4 font-mono text-xs text-blue-600 font-medium">{b.id}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{isJa ? b.room.nameJa : b.room.name}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                      {b.guest.lastName} {b.guest.firstName}
                    </td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{b.checkIn}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{b.checkOut}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">¥{b.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={cfg.cls}>{cfg.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
