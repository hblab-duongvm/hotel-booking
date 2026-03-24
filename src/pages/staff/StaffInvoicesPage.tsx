import React, { useState } from 'react';
import { Search, FileText, Eye, Printer, CheckCircle, Clock, X } from 'lucide-react';
import { INVOICES } from '../../data/staffMockData';
import type { Invoice } from '../../data/mockData';

interface Props { lang: 'ja' | 'en' }

const StaffInvoicesPage: React.FC<Props> = ({ lang }) => {
  const isJa = lang === 'ja';
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState(INVOICES);

  const filtered = invoices.filter(inv => {
    const matchSearch = search === '' ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.booking.guest.lastName.includes(search) ||
      inv.booking.guest.firstName.includes(search);
    const matchStatus = filterStatus === 'all' || inv.paymentStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = invoices.filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + i.booking.total, 0);
  const unpaidAmount = invoices.filter(i => i.paymentStatus === 'unpaid').reduce((s, i) => s + i.booking.total, 0);

  const handleMarkPaid = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id
      ? { ...inv, paymentStatus: 'paid', paidAt: new Date().toISOString().split('T')[0] }
      : inv
    ));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, paymentStatus: 'paid', paidAt: new Date().toISOString().split('T')[0] } : null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{isJa ? '請求書管理' : 'Invoice Management'}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{isJa ? `全${invoices.length}件` : `${invoices.length} invoices`}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-gray-400" /></div>
          <div className="text-2xl font-bold text-gray-900">{invoices.length}</div>
          <div className="text-xs text-gray-500">{isJa ? '総請求書数' : 'Total Invoices'}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4 text-green-500" /></div>
          <div className="text-2xl font-bold text-green-600">¥{totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500">{isJa ? '入金済み' : 'Paid Revenue'}</div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-orange-500" /></div>
          <div className="text-2xl font-bold text-orange-600">¥{unpaidAmount.toLocaleString()}</div>
          <div className="text-xs text-gray-500">{isJa ? '未入金' : 'Unpaid Amount'}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={isJa ? '請求書番号・ゲスト名で検索...' : 'Search by invoice ID or guest name...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {(['all', 'paid', 'unpaid'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {s === 'all' ? (isJa ? 'すべて' : 'All') : s === 'paid' ? (isJa ? '入金済み' : 'Paid') : (isJa ? '未入金' : 'Unpaid')}
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
                {[isJa ? '請求書番号' : 'Invoice ID', isJa ? 'ゲスト' : 'Guest',
                  isJa ? '予約番号' : 'Booking', isJa ? '発行日' : 'Issue Date',
                  isJa ? '金額' : 'Amount', isJa ? '支払状況' : 'Payment',
                  isJa ? 'アクション' : 'Actions'].map((h, i) => (
                  <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-blue-600 font-medium">{inv.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 whitespace-nowrap">{inv.booking.guest.lastName} {inv.booking.guest.firstName}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{inv.bookingId}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">{inv.issueDate}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">¥{inv.booking.total.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {inv.paymentStatus === 'paid'
                      ? <span className="badge-green flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" />{isJa ? '入金済み' : 'Paid'}</span>
                      : <span className="badge-orange flex items-center gap-1 w-fit"><Clock className="w-3 h-3" />{isJa ? '未入金' : 'Unpaid'}</span>
                    }
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(inv)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      {inv.paymentStatus === 'unpaid' && (
                        <button onClick={() => handleMarkPaid(inv.id)} className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition-colors">
                          {isJa ? '入金確認' : 'Mark Paid'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">{isJa ? '請求書が見つかりませんでした' : 'No invoices found'}</div>
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{isJa ? '請求書詳細' : 'Invoice Detail'}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-lg font-bold text-blue-600">{selected.id}</div>
                  <div className="text-xs text-gray-400">{isJa ? '発行日' : 'Issue Date'}: {selected.issueDate}</div>
                </div>
                {selected.paymentStatus === 'paid'
                  ? <span className="badge-green flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{isJa ? '入金済み' : 'Paid'}</span>
                  : <span className="badge-orange flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{isJa ? '未入金' : 'Unpaid'}</span>
                }
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="font-semibold text-gray-700 mb-2">{isJa ? 'ゲスト情報' : 'Guest Information'}</div>
                <div className="flex justify-between"><span className="text-gray-500">{isJa ? '氏名' : 'Name'}</span><span className="font-medium">{selected.booking.guest.lastName} {selected.booking.guest.firstName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{isJa ? 'メール' : 'Email'}</span><span className="text-xs">{selected.booking.guest.email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{isJa ? '電話' : 'Phone'}</span><span>{selected.booking.guest.phone}</span></div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="font-semibold text-gray-700 mb-2">{isJa ? '宿泊情報' : 'Stay Details'}</div>
                <div className="flex justify-between"><span className="text-gray-500">{isJa ? '客室' : 'Room'}</span><span className="font-medium">{isJa ? selected.booking.room.nameJa : selected.booking.room.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{isJa ? 'チェックイン' : 'Check-in'}</span><span>{selected.booking.checkIn}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{isJa ? 'チェックアウト' : 'Check-out'}</span><span>{selected.booking.checkOut}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">{isJa ? '泊数' : 'Nights'}</span><span>{selected.booking.nights}{isJa ? '泊' : ' nights'}</span></div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">{isJa ? '客室料金' : 'Room Charge'}</span><span>¥{selected.booking.roomCharge.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">{isJa ? '消費税 (10%)' : 'Tax (10%)'}</span><span>¥{selected.booking.tax.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-blue-200 pt-2">
                  <span>{isJa ? '合計金額' : 'Total Amount'}</span>
                  <span className="text-blue-700">¥{selected.booking.total.toLocaleString()}</span>
                </div>
              </div>
              {selected.paymentStatus === 'unpaid' && (
                <button onClick={() => handleMarkPaid(selected.id)} className="w-full btn-primary flex items-center justify-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  {isJa ? '入金確認済みにする' : 'Mark as Paid'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffInvoicesPage;
