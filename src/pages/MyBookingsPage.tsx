import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, X, Calendar, Users, BedDouble, Search } from 'lucide-react';
import { BOOKINGS, type BookingStatus } from '../data/mockData';

const statusConfig = {
  confirmed: { color: 'badge-blue', labelJa: '確定済み', labelEn: 'Confirmed' },
  checked_in: { color: 'badge-green', labelJa: 'チェックイン済み', labelEn: 'Checked In' },
  checked_out: { color: 'badge-gray', labelJa: 'チェックアウト済み', labelEn: 'Checked Out' },
  cancelled: { color: 'badge-red', labelJa: 'キャンセル済み', labelEn: 'Cancelled' },
};

const MyBookingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isJa = i18n.language === 'ja';

  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [bookings, setBookings] = useState(BOOKINGS);

  const tabs: (BookingStatus | 'all')[] = ['all', 'confirmed', 'checked_in', 'checked_out', 'cancelled'];

  const filtered = bookings.filter(b => {
    if (activeTab !== 'all' && b.status !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return b.id.toLowerCase().includes(q) ||
        (isJa ? b.room.nameJa : b.room.name).toLowerCase().includes(q) ||
        b.guest.lastName.toLowerCase().includes(q) ||
        b.guest.firstName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCancel = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b));
    setCancelId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('my_bookings.title')}</h1>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isJa ? '予約番号・客室名で検索...' : 'Search by ID or room...'}
            className="input-field pl-9 text-sm w-64"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {tab === 'all' ? t('my_bookings.all') : (isJa ? statusConfig[tab].labelJa : statusConfig[tab].labelEn)}
            <span className={`ml-1.5 text-xs ${activeTab === tab ? 'text-blue-200' : 'text-gray-400'}`}>
              ({bookings.filter(b => tab === 'all' || b.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BedDouble className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{t('my_bookings.no_bookings')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(booking => {
            const cfg = statusConfig[booking.status];
            return (
              <div key={booking.id} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Room Image */}
                  <img
                    src={booking.room.images[0]}
                    alt=""
                    className="w-full sm:w-32 h-28 sm:h-24 object-cover rounded-xl shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cfg.color}>{isJa ? cfg.labelJa : cfg.labelEn}</span>
                          <span className="text-xs text-gray-400 font-mono">{booking.id}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {isJa ? booking.room.nameJa : booking.room.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">¥{booking.total.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">{isJa ? '税込み' : 'incl. tax'}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {booking.checkIn} → {booking.checkOut}
                      </span>
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5" />
                        {booking.nights} {isJa ? '泊' : booking.nights === 1 ? 'night' : 'nights'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {booking.guests} {isJa ? '名' : booking.guests === 1 ? 'guest' : 'guests'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/invoice/${booking.invoiceId}`)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {t('my_bookings.view_invoice')}
                      </button>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => setCancelId(booking.id)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          {t('my_bookings.cancel')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              {isJa ? 'キャンセルの確認' : 'Confirm Cancellation'}
            </h3>
            <p className="text-gray-500 text-sm text-center mb-5">{t('my_bookings.cancel_confirm')}</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelId(null)} className="btn-secondary flex-1 text-sm">
                {t('common.cancel')}
              </button>
              <button onClick={() => handleCancel(cancelId)} className="btn-danger flex-1 text-sm">
                {isJa ? 'キャンセルする' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
