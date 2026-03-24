import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { Download, FileText, TrendingUp, Calendar, Filter } from 'lucide-react';
import { BOOKINGS, INVOICES, MONTHLY_REVENUE } from '../data/mockData';

const AdminReportsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';
  const [period, setPeriod] = useState<'monthly' | 'quarterly'>('monthly');
  const [activeReport, setActiveReport] = useState<'revenue' | 'bookings' | 'invoices'>('revenue');

  const totalRevenue = INVOICES.filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + i.booking.total, 0);
  const unpaidRevenue = INVOICES.filter(i => i.paymentStatus === 'unpaid').reduce((s, i) => s + i.booking.total, 0);
  const paidCount = INVOICES.filter(i => i.paymentStatus === 'paid').length;
  const unpaidCount = INVOICES.filter(i => i.paymentStatus === 'unpaid').length;

  const revenueData = MONTHLY_REVENUE.map(m => ({
    name: isJa ? m.month : m.monthEn,
    revenue: m.revenue,
    bookings: m.bookings,
    avg: Math.round(m.revenue / m.bookings),
  }));

  const quarterlyData = [
    { name: isJa ? 'Q1 (1-3月)' : 'Q1 (Jan-Mar)', revenue: 6165000, bookings: 141 },
    { name: isJa ? 'Q2 (4-6月)' : 'Q2 (Apr-Jun)', revenue: 7200000, bookings: 168 },
    { name: isJa ? 'Q3 (7-9月)' : 'Q3 (Jul-Sep)', revenue: 8900000, bookings: 210 },
    { name: isJa ? 'Q4 (10-12月)' : 'Q4 (Oct-Dec)', revenue: 6800000, bookings: 161 },
  ];

  const chartData = period === 'monthly' ? revenueData : quarterlyData;

  const handleExportCSV = () => {
    const rows = [
      [isJa ? '予約ID' : 'Booking ID', isJa ? '客室' : 'Room', isJa ? 'ゲスト' : 'Guest',
       isJa ? 'チェックイン' : 'Check-in', isJa ? 'チェックアウト' : 'Check-out',
       isJa ? '泊数' : 'Nights', isJa ? '合計' : 'Total', isJa ? 'ステータス' : 'Status'],
      ...BOOKINGS.map(b => [
        b.id, isJa ? b.room.nameJa : b.room.name,
        `${b.guest.lastName} ${b.guest.firstName}`,
        b.checkIn, b.checkOut, b.nights, b.total, b.status
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reportTabs = [
    { key: 'revenue', label: isJa ? '売上レポート' : 'Revenue Report', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'bookings', label: isJa ? '予約レポート' : 'Booking Report', icon: <Calendar className="w-4 h-4" /> },
    { key: 'invoices', label: isJa ? '請求書レポート' : 'Invoice Report', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('reports.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isJa ? '収益・予約・請求書の詳細レポート' : 'Detailed revenue, booking, and invoice reports'}
          </p>
        </div>
        <button onClick={handleExportCSV} className="btn-primary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          {t('reports.export_csv')}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: isJa ? '入金済み売上' : 'Paid Revenue', value: `¥${(totalRevenue / 1000000).toFixed(2)}M`, color: 'text-green-600', bg: 'bg-green-50' },
          { label: isJa ? '未入金売上' : 'Unpaid Revenue', value: `¥${(unpaidRevenue / 1000).toFixed(0)}K`, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: isJa ? '支払済み請求書' : 'Paid Invoices', value: `${paidCount}件`, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: isJa ? '未払い請求書' : 'Unpaid Invoices', value: `${unpaidCount}件`, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((c, i) => (
          <div key={i} className={`card p-4 ${c.bg}`}>
            <div className="text-xs text-gray-500 mb-1">{c.label}</div>
            <div className={`text-xl font-bold ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Report Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {reportTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveReport(tab.key as typeof activeReport)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeReport === tab.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as 'monthly' | 'quarterly')}
            className="input-field text-sm w-auto"
          >
            <option value="monthly">{isJa ? '月次' : 'Monthly'}</option>
            <option value="quarterly">{isJa ? '四半期' : 'Quarterly'}</option>
          </select>
        </div>
      </div>

      {/* Revenue Report */}
      {activeReport === 'revenue' && (
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-4 text-sm">
              {isJa ? '売上推移' : 'Revenue Trend'} ({period === 'monthly' ? (isJa ? '月次' : 'Monthly') : (isJa ? '四半期' : 'Quarterly')})
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `¥${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(v: unknown) => [`¥${Number(v).toLocaleString()}`, isJa ? '売上' : 'Revenue']}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name={isJa ? '売上' : 'Revenue'} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Table */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-sm">{isJa ? '売上詳細' : 'Revenue Details'}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[isJa ? '期間' : 'Period', isJa ? '予約数' : 'Bookings',
                      isJa ? '売上' : 'Revenue', isJa ? '平均単価' : 'Avg. Price'].map((h, i) => (
                      <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {chartData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
                      <td className="py-3 px-4 text-gray-600">{row.bookings}</td>
                      <td className="py-3 px-4 font-semibold text-blue-600">¥{row.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">¥{Math.round(row.revenue / row.bookings).toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-bold">
                    <td className="py-3 px-4 text-gray-900">{isJa ? '合計' : 'Total'}</td>
                    <td className="py-3 px-4 text-gray-900">{chartData.reduce((s, r) => s + r.bookings, 0)}</td>
                    <td className="py-3 px-4 text-blue-600">¥{chartData.reduce((s, r) => s + r.revenue, 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-900">
                      ¥{Math.round(chartData.reduce((s, r) => s + r.revenue, 0) / chartData.reduce((s, r) => s + r.bookings, 0)).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Booking Report */}
      {activeReport === 'bookings' && (
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-4 text-sm">{isJa ? '予約数推移' : 'Booking Trend'}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name={isJa ? '予約数' : 'Bookings'} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-sm">{isJa ? '予約一覧' : 'All Bookings'}</h2>
              <span className="text-xs text-gray-400">{BOOKINGS.length} {isJa ? '件' : 'records'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[isJa ? '予約ID' : 'Booking ID', isJa ? '客室' : 'Room', isJa ? 'ゲスト' : 'Guest',
                      isJa ? 'チェックイン' : 'Check-in', isJa ? '泊数' : 'Nights',
                      isJa ? '合計' : 'Total', isJa ? 'ステータス' : 'Status'].map((h, i) => (
                      <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {BOOKINGS.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-blue-600">{b.id}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{isJa ? b.room.nameJa : b.room.name}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{b.guest.lastName} {b.guest.firstName}</td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{b.checkIn}</td>
                      <td className="py-3 px-4 text-gray-500">{b.nights}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">¥{b.total.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={
                          b.status === 'confirmed' ? 'badge-blue' :
                          b.status === 'checked_in' ? 'badge-green' :
                          b.status === 'checked_out' ? 'badge-gray' : 'badge-red'
                        }>
                          {b.status === 'confirmed' ? (isJa ? '確定済み' : 'Confirmed') :
                           b.status === 'checked_in' ? (isJa ? 'チェックイン済み' : 'Checked In') :
                           b.status === 'checked_out' ? (isJa ? 'チェックアウト済み' : 'Checked Out') :
                           (isJa ? 'キャンセル済み' : 'Cancelled')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Report */}
      {activeReport === 'invoices' && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm">{isJa ? '請求書一覧' : 'Invoice List'}</h2>
            <span className="text-xs text-gray-400">{INVOICES.length} {isJa ? '件' : 'records'}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[isJa ? '請求書番号' : 'Invoice No', isJa ? '予約ID' : 'Booking ID',
                    isJa ? 'ゲスト' : 'Guest', isJa ? '発行日' : 'Issue Date',
                    isJa ? '期日' : 'Due Date', isJa ? '金額' : 'Amount',
                    isJa ? '支払状況' : 'Payment'].map((h, i) => (
                    <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {INVOICES.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-blue-600 font-medium">{inv.id}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{inv.bookingId}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                      {inv.booking.guest.lastName} {inv.booking.guest.firstName}
                    </td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{inv.issueDate}</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{inv.dueDate}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">¥{inv.booking.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={inv.paymentStatus === 'paid' ? 'badge-green' : 'badge-red'}>
                        {inv.paymentStatus === 'paid' ? (isJa ? '支払済み' : 'Paid') : (isJa ? '未払い' : 'Unpaid')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;
