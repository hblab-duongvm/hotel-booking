import React, { useState } from 'react';
import { Search, Mail, Phone, Eye, X, Star, Calendar } from 'lucide-react';
import { BOOKINGS } from '../../data/staffMockData';

interface Props { lang: 'ja' | 'en' }

interface GuestRecord {
  key: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  lastStay: string;
  status: 'checked_in' | 'confirmed' | 'checked_out' | 'cancelled';
}

const StaffGuestsPage: React.FC<Props> = ({ lang }) => {
  const isJa = lang === 'ja';
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<GuestRecord | null>(null);

  // Aggregate guests from bookings
  const guestMap = new Map<string, GuestRecord>();
  BOOKINGS.forEach(b => {
    const key = b.guest.email;
    if (guestMap.has(key)) {
      const g = guestMap.get(key)!;
      g.totalBookings += 1;
      g.totalSpent += b.total;
      if (b.checkOut > g.lastStay) g.lastStay = b.checkOut;
      if (b.status === 'checked_in') g.status = 'checked_in';
    } else {
      guestMap.set(key, {
        key,
        lastName: b.guest.lastName,
        firstName: b.guest.firstName,
        email: b.guest.email,
        phone: b.guest.phone,
        totalBookings: 1,
        totalSpent: b.total,
        lastStay: b.checkOut,
        status: b.status,
      });
    }
  });
  const guests = Array.from(guestMap.values());

  const filtered = guests.filter(g =>
    search === '' ||
    g.lastName.includes(search) ||
    g.firstName.includes(search) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search)
  );

  const guestBookings = (email: string) => BOOKINGS.filter(b => b.guest.email === email);

  const statusColor: Record<string, string> = {
    confirmed: 'badge-blue',
    checked_in: 'badge-green',
    checked_out: 'badge-gray',
    cancelled: 'badge-red',
  };
  const statusLabel: Record<string, { ja: string; en: string }> = {
    confirmed: { ja: '確定済み', en: 'Confirmed' },
    checked_in: { ja: 'チェックイン中', en: 'Checked In' },
    checked_out: { ja: 'チェックアウト済み', en: 'Checked Out' },
    cancelled: { ja: 'キャンセル', en: 'Cancelled' },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isJa ? 'ゲスト管理' : 'Guest Management'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{isJa ? `登録ゲスト: ${guests.length}名` : `${guests.length} registered guests`}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{guests.length}</div>
          <div className="text-xs text-gray-500 mt-1">{isJa ? '総ゲスト数' : 'Total Guests'}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{guests.filter(g => g.status === 'checked_in').length}</div>
          <div className="text-xs text-gray-500 mt-1">{isJa ? '現在滞在中' : 'Currently In-House'}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{guests.filter(g => g.totalBookings >= 2).length}</div>
          <div className="text-xs text-gray-500 mt-1">{isJa ? 'リピーター' : 'Repeat Guests'}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={isJa ? 'ゲスト名・メール・電話番号で検索...' : 'Search by name, email, phone...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {/* Guest Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[isJa ? 'ゲスト名' : 'Guest', isJa ? '連絡先' : 'Contact',
                  isJa ? '予約回数' : 'Bookings', isJa ? '累計利用額' : 'Total Spent',
                  isJa ? '最終滞在' : 'Last Stay', isJa ? 'ステータス' : 'Status',
                  isJa ? '詳細' : 'Detail'].map((h, i) => (
                  <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(g => (
                <tr key={g.key} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                        {g.lastName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 whitespace-nowrap">{g.lastName} {g.firstName}</div>
                        {g.totalBookings >= 2 && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {isJa ? 'リピーター' : 'Repeat Guest'}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-xs text-gray-600">{g.email}</div>
                    <div className="text-xs text-gray-400">{g.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-gray-900">{g.totalBookings}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">¥{g.totalSpent.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">{g.lastStay}</td>
                  <td className="py-3 px-4">
                    <span className={statusColor[g.status]}>{isJa ? statusLabel[g.status].ja : statusLabel[g.status].en}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => setSelected(g)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">{isJa ? 'ゲストが見つかりませんでした' : 'No guests found'}</div>
          )}
        </div>
      </div>

      {/* Guest Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-bold text-gray-900">{isJa ? 'ゲスト詳細' : 'Guest Detail'}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Guest Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 text-xl font-bold">
                  {selected.lastName[0]}
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{selected.lastName} {selected.firstName}</div>
                  {selected.totalBookings >= 2 && (
                    <div className="flex items-center gap-1 text-sm text-yellow-600 mt-0.5">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {isJa ? 'リピーターゲスト' : 'Repeat Guest'}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <Mail className="w-4 h-4" />{selected.email}
                </a>
                <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <Phone className="w-4 h-4" />{selected.phone}
                </a>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-blue-700">{selected.totalBookings}</div>
                  <div className="text-xs text-blue-600">{isJa ? '予約回数' : 'Bookings'}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-green-700">¥{selected.totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-green-600">{isJa ? '累計利用額' : 'Total Spent'}</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-purple-700">{selected.lastStay}</div>
                  <div className="text-xs text-purple-600">{isJa ? '最終滞在' : 'Last Stay'}</div>
                </div>
              </div>

              {/* Booking History */}
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {isJa ? '予約履歴' : 'Booking History'}
                </h4>
                <div className="space-y-2">
                  {guestBookings(selected.email).map(b => (
                    <div key={b.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{b.id}</div>
                        <div className="text-xs text-gray-500">{isJa ? b.room.nameJa : b.room.name} · {b.checkIn} ~ {b.checkOut}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">¥{b.total.toLocaleString()}</div>
                        <span className={statusColor[b.status] + ' text-xs'}>
                          {isJa ? statusLabel[b.status].ja : statusLabel[b.status].en}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffGuestsPage;
