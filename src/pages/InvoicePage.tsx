import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Printer, ArrowLeft, Hotel, CheckCircle, Clock } from 'lucide-react';
import { INVOICES } from '../data/mockData';

const InvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isJa = i18n.language === 'ja';

  const invoice = INVOICES.find(inv => inv.id === id);

  if (!invoice) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
      <p>Invoice not found</p>
    </div>
  );

  const { booking } = invoice;

  const handlePrint = () => window.print();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Action Bar - hidden on print */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <button
          onClick={() => navigate('/bookings')}
          className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('invoice.back')}
        </button>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2 text-sm">
            <Printer className="w-4 h-4" />
            {t('invoice.print')}
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="card p-8 print:shadow-none print:border-none" id="invoice-print">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b-2 border-gray-100">
          {/* Hotel Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl text-gray-900">Grand Hotel</div>
                <div className="text-xs text-gray-500">Tokyo, Japan</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-0.5">
              <p>{isJa ? '東京都新宿区西新宿1-1-1' : '1-1-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo'}</p>
              <p>Tel: 03-1234-5678</p>
              <p>info@grandhotel.jp</p>
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('invoice.title').toUpperCase()}</h1>
            <div className="space-y-1 text-sm">
              <div className="flex justify-end gap-4">
                <span className="text-gray-500">{t('invoice.invoice_no')}</span>
                <span className="font-bold text-gray-900 font-mono">{invoice.id}</span>
              </div>
              <div className="flex justify-end gap-4">
                <span className="text-gray-500">{t('invoice.issue_date')}</span>
                <span className="font-medium">{invoice.issueDate}</span>
              </div>
              <div className="flex justify-end gap-4">
                <span className="text-gray-500">{t('invoice.due_date')}</span>
                <span className="font-medium">{invoice.dueDate}</span>
              </div>
            </div>
            {/* Payment Status Badge */}
            <div className="mt-3">
              {invoice.paymentStatus === 'paid' ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-green-100 text-green-700 rounded-full font-bold text-sm border-2 border-green-300">
                  <CheckCircle className="w-4 h-4" />
                  {t('invoice.paid')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full font-bold text-sm border-2 border-orange-300">
                  <Clock className="w-4 h-4" />
                  {t('invoice.unpaid')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('invoice.bill_to')}</h3>
            <div className="text-sm space-y-1">
              <p className="font-bold text-gray-900 text-base">
                {booking.guest.lastName} {booking.guest.firstName}
              </p>
              <p className="text-gray-600">{booking.guest.email}</p>
              <p className="text-gray-600">{booking.guest.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {isJa ? '予約情報' : 'Booking Details'}
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex gap-2">
                <span className="text-gray-500 w-28">{t('my_bookings.booking_id')}</span>
                <span className="font-mono font-medium">{booking.id}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-28">{t('booking.checkin')}</span>
                <span className="font-medium">{booking.checkIn}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-28">{t('booking.checkout')}</span>
                <span className="font-medium">{booking.checkOut}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 w-28">{t('booking.guests')}</span>
                <span className="font-medium">{booking.guests} {isJa ? '名' : 'guests'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">{t('invoice.description')}</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">{t('invoice.qty')}</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">{t('invoice.unit_price')}</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">{t('invoice.amount')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">{isJa ? booking.room.nameJa : booking.room.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {booking.checkIn} → {booking.checkOut} · {isJa ? `${booking.guests}名` : `${booking.guests} guests`}
                  </div>
                </td>
                <td className="py-4 px-4 text-center text-gray-700">
                  {booking.nights} {isJa ? '泊' : 'nights'}
                </td>
                <td className="py-4 px-4 text-right text-gray-700">
                  ¥{booking.room.pricePerNight.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right font-medium text-gray-900">
                  ¥{booking.roomCharge.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-72 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{t('invoice.subtotal')}</span>
              <span>¥{booking.roomCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t('invoice.tax')}</span>
              <span>¥{booking.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg border-t-2 border-gray-200 pt-3 mt-3">
              <span>{t('invoice.total')}</span>
              <span className="text-blue-600">¥{booking.total.toLocaleString()}</span>
            </div>
            {invoice.paymentStatus === 'paid' && invoice.paidAt && (
              <div className="flex justify-between text-green-600 text-xs">
                <span>{isJa ? '支払日' : 'Paid on'}</span>
                <span>{invoice.paidAt}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">{t('invoice.notes')}</h4>
          <p className="text-sm text-blue-600">{t('invoice.notes_text')}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
