import React, { useState } from 'react';
import { Search, Plus, UserCheck, LogOut, Eye, Filter, X, Phone, Mail } from 'lucide-react';
import { BOOKINGS, ROOMS } from '../../data/staffMockData';
import type { Booking, BookingStatus } from '../../data/mockData';

interface Props { lang: 'ja' | 'en' }

const statusLabel: Record<BookingStatus, { ja: string; en: string }> = {
  confirmed: { ja: '確定済み', en: 'Confirmed' },
  checked_in: { ja: 'チェックイン済み', en: 'Checked In' },
  checked_out: { ja: 'チェックアウト済み', en: 'Checked Out' },
  cancelled: { ja: 'キャンセル', en: 'Cancelled' },
};
const statusColor: Record<BookingStatus, string> = {
  confirmed: 'badge-blue',
  checked_in: 'badge-green',
  checked_out: 'badge-gray',
  cancelled: 'badge-red',
};

const StaffBookingsPage: React.FC<Props> = ({ lang }) => {
  const isJa = lang === 'ja';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState(BOOKINGS);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newBooking, setNewBooking] = useState({ roomId: 'r001', firstName: '', lastName: '', email: '', phone: '', checkIn: '', checkOut: '', guests: 1 });
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = bookings.filter(b => {
    const matchSearch = search === '' ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.guest.lastName.includes(search) ||
      b.guest.firstName.includes(search) ||
      b.guest.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || b.status === filter;
    return matchSearch && matchFilter;
  });

  const handleCheckIn = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'checked_in' as BookingStatus } : b));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'checked_in' } : null);
    setSuccessMsg(isJa ? 'チェックインが完了しました' : 'Check-in completed successfully');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCheckOut = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'checked_out' as BookingStatus } : b));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'checked_out' } : null);
    setSuccessMsg(isJa ? 'チェックアウトが完了しました' : 'Check-out completed successfully');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCreateBooking = () => {
    const room = ROOMS.find(r => r.id === newBooking.roomId)!;
    const checkInDate = new Date(newBooking.checkIn);
    const checkOutDate = new Date(newBooking.checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
    const roomCharge = room.pricePerNight * nights;
    const tax = Math.round(roomCharge * 0.1);
    const id = `BK${Date.now()}`;
    const booking: Booking = {
      id, roomId: room.id, room,
      guest: { firstName: newBooking.firstName, lastName: newBooking.lastName, email: newBooking.email, phone: newBooking.phone },
      checkIn: newBooking.checkIn, checkOut: newBooking.checkOut,
      nights, guests: newBooking.guests, roomCharge, tax, total: roomCharge + tax,
      status: 'confirmed', paymentMethod: 'hotel',
      createdAt: new Date().toISOString().split('T')[0],
      invoiceId: `INV-${id.replace('BK', '')}`,
    };
    setBookings(prev => [booking, ...prev]);
    setShowNewForm(false);
    setNewBooking({ roomId: 'r001', firstName: '', lastName: '', email: '', phone: '', checkIn: '', checkOut: '', guests: 1 });
    setSuccessMsg(isJa ? '新規予約を作成しました' : 'New booking created successfully');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const tabs: { key: BookingStatus | 'all'; label: string; labelJa: string }[] = [
    { key: 'all', label: 'All', labelJa: 'すべて' },
    { key: 'confirmed', label: 'Confirmed', labelJa: '確定済み' },
    { key: 'checked_in', label: 'Checked In', labelJa: 'チェックイン中' },
    { key: 'checked_out', label: 'Checked Out', labelJa: 'チェックアウト済み' },
    { key: 'cancelled', label: 'Cancelled', labelJa: 'キャンセル' },
  ];

  return (
    <div className="space-y-4">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 animate-pulse">
          <UserCheck className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isJa ? '予約管理' : 'Booking Management'}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{isJa ? `全${filtered.length}件` : `${filtered.length} bookings`}</p>
        </div>
        <button onClick={() => setShowNewForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          {isJa ? '新規予約作成' : 'New Booking'}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={isJa ? '予約番号・ゲスト名・メールで検索...' : 'Search by ID, guest name, email...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" />
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === tab.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isJa ? tab.labelJa : tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[isJa ? '予約番号' : 'Booking ID', isJa ? 'ゲスト' : 'Guest',
                  isJa ? '客室' : 'Room', isJa ? 'チェックイン' : 'Check-in',
                  isJa ? 'チェックアウト' : 'Check-out', isJa ? '合計' : 'Total',
                  isJa ? 'ステータス' : 'Status', isJa ? 'アクション' : 'Actions'].map((h, i) => (
                  <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-blue-600 font-medium">{b.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 whitespace-nowrap">{b.guest.lastName} {b.guest.firstName}</div>
                    <div className="text-xs text-gray-400">{b.guest.email}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap text-xs">{isJa ? b.room.nameJa : b.room.name}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap text-xs">{b.checkIn}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap text-xs">{b.checkOut}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">¥{b.total.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={statusColor[b.status]}>{isJa ? statusLabel[b.status].ja : statusLabel[b.status].en}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(b)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title={isJa ? '詳細' : 'Detail'}>
                        <Eye className="w-4 h-4" />
                      </button>
                      {b.status === 'confirmed' && (
                        <button onClick={() => handleCheckIn(b.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title={isJa ? 'チェックイン' : 'Check In'}>
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      {b.status === 'checked_in' && (
                        <button onClick={() => handleCheckOut(b.id)} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all" title={isJa ? 'チェックアウト' : 'Check Out'}>
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">{isJa ? '予約が見つかりませんでした' : 'No bookings found'}</div>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{isJa ? '予約詳細' : 'Booking Detail'}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-blue-600 font-bold">{selected.id}</span>
                <span className={statusColor[selected.status]}>{isJa ? statusLabel[selected.status].ja : statusLabel[selected.status].en}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-400 mb-1">{isJa ? 'ゲスト名' : 'Guest Name'}</div>
                  <div className="font-semibold text-gray-900">{selected.guest.lastName} {selected.guest.firstName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">{isJa ? '客室' : 'Room'}</div>
                  <div className="font-semibold text-gray-900">{isJa ? selected.room.nameJa : selected.room.name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">{isJa ? 'チェックイン' : 'Check-in'}</div>
                  <div className="font-semibold text-gray-900">{selected.checkIn}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">{isJa ? 'チェックアウト' : 'Check-out'}</div>
                  <div className="font-semibold text-gray-900">{selected.checkOut}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">{isJa ? '泊数' : 'Nights'}</div>
                  <div className="font-semibold text-gray-900">{selected.nights}{isJa ? '泊' : ' nights'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">{isJa ? '人数' : 'Guests'}</div>
                  <div className="font-semibold text-gray-900">{selected.guests}{isJa ? '名' : ' guests'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <a href={`mailto:${selected.guest.email}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                  <Mail className="w-4 h-4" />{selected.guest.email}
                </a>
                <a href={`tel:${selected.guest.phone}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                  <Phone className="w-4 h-4" />{selected.guest.phone}
                </a>
              </div>
              {selected.specialRequests && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-sm text-yellow-800">
                  <span className="font-semibold">{isJa ? 'ご要望: ' : 'Special Requests: '}</span>
                  {selected.specialRequests}
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">{isJa ? '客室料金' : 'Room Charge'}</span><span>¥{selected.roomCharge.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{isJa ? '消費税' : 'Tax'}</span><span>¥{selected.tax.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2"><span>{isJa ? '合計' : 'Total'}</span><span className="text-blue-600">¥{selected.total.toLocaleString()}</span></div>
              </div>
              <div className="flex gap-3">
                {selected.status === 'confirmed' && (
                  <button onClick={() => handleCheckIn(selected.id)} className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm">
                    <UserCheck className="w-4 h-4" />{isJa ? 'チェックイン' : 'Check In'}
                  </button>
                )}
                {selected.status === 'checked_in' && (
                  <button onClick={() => handleCheckOut(selected.id)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                    <LogOut className="w-4 h-4" />{isJa ? 'チェックアウト' : 'Check Out'}
                  </button>
                )}
                <button onClick={() => setSelected(null)} className="flex-1 btn-secondary text-sm">{isJa ? '閉じる' : 'Close'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNewForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{isJa ? '新規予約作成' : 'Create New Booking'}</h3>
              <button onClick={() => setShowNewForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '姓' : 'Last Name'}</label>
                  <input className="input-field" value={newBooking.lastName} onChange={e => setNewBooking(p => ({ ...p, lastName: e.target.value }))} placeholder={isJa ? '田中' : 'Smith'} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '名' : 'First Name'}</label>
                  <input className="input-field" value={newBooking.firstName} onChange={e => setNewBooking(p => ({ ...p, firstName: e.target.value }))} placeholder={isJa ? '太郎' : 'John'} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? 'メールアドレス' : 'Email'}</label>
                  <input className="input-field" type="email" value={newBooking.email} onChange={e => setNewBooking(p => ({ ...p, email: e.target.value }))} placeholder="guest@example.com" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '電話番号' : 'Phone'}</label>
                  <input className="input-field" value={newBooking.phone} onChange={e => setNewBooking(p => ({ ...p, phone: e.target.value }))} placeholder="090-1234-5678" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '客室' : 'Room'}</label>
                  <select className="input-field" value={newBooking.roomId} onChange={e => setNewBooking(p => ({ ...p, roomId: e.target.value }))}>
                    {ROOMS.filter(r => r.available).map(r => (
                      <option key={r.id} value={r.id}>{isJa ? r.nameJa : r.name} — ¥{r.pricePerNight.toLocaleString()}/泊</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? 'チェックイン' : 'Check-in'}</label>
                  <input className="input-field" type="date" value={newBooking.checkIn} onChange={e => setNewBooking(p => ({ ...p, checkIn: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? 'チェックアウト' : 'Check-out'}</label>
                  <input className="input-field" type="date" value={newBooking.checkOut} onChange={e => setNewBooking(p => ({ ...p, checkOut: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">{isJa ? '人数' : 'Guests'}</label>
                  <select className="input-field" value={newBooking.guests} onChange={e => setNewBooking(p => ({ ...p, guests: Number(e.target.value) }))}>
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}{isJa ? '名' : ' guests'}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreateBooking}
                  disabled={!newBooking.firstName || !newBooking.lastName || !newBooking.checkIn || !newBooking.checkOut}
                  className="flex-1 btn-primary text-sm"
                >
                  {isJa ? '予約を作成' : 'Create Booking'}
                </button>
                <button onClick={() => setShowNewForm(false)} className="flex-1 btn-secondary text-sm">{isJa ? 'キャンセル' : 'Cancel'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffBookingsPage;
