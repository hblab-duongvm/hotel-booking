import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, CreditCard, Building2, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { ROOMS, BOOKINGS, type Booking } from '../data/mockData';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isJa = i18n.language === 'ja';

  const room = ROOMS.find(r => r.id === id);
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guestsCount = Number(searchParams.get('guests') || 1);

  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  const roomCharge = (room?.pricePerNight || 0) * nights;
  const tax = Math.round(roomCharge * 0.1);
  const total = roomCharge + tax;

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    specialRequests: '', paymentMethod: 'hotel' as 'hotel' | 'online',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  if (!room) return <div className="text-center py-20 text-gray-400">Room not found</div>;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = isJa ? '名を入力してください' : 'First name is required';
    if (!form.lastName.trim()) errs.lastName = isJa ? '姓を入力してください' : 'Last name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = isJa ? '有効なメールアドレスを入力してください' : 'Valid email is required';
    if (!form.phone.trim()) errs.phone = isJa ? '電話番号を入力してください' : 'Phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const newId = `BK${Date.now()}`;
      const newBooking: Booking = {
        id: newId,
        roomId: room.id,
        room,
        guest: { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone },
        checkIn,
        checkOut,
        nights,
        guests: guestsCount,
        roomCharge,
        tax,
        total,
        status: 'confirmed',
        paymentMethod: form.paymentMethod,
        specialRequests: form.specialRequests,
        createdAt: new Date().toISOString().split('T')[0],
        invoiceId: `INV-${newId.replace('BK', '')}`,
      };
      BOOKINGS.unshift(newBooking);
      setConfirmed(newBooking);
      setLoading(false);
    }, 1000);
  };

  // Success Screen
  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="card p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('booking.success_title')}</h2>
          <p className="text-gray-500 text-sm mb-6">{t('booking.success_msg')}</p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t('booking.booking_id')}</span>
              <span className="font-bold text-blue-600">{confirmed.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('booking.room')}</span>
              <span className="font-medium">{isJa ? room.nameJa : room.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('booking.checkin')}</span>
              <span className="font-medium">{checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('booking.checkout')}</span>
              <span className="font-medium">{checkOut}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2">
              <span className="text-gray-500 font-semibold">{t('booking.total')}</span>
              <span className="font-bold text-blue-600 text-base">¥{total.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/bookings')} className="btn-primary flex-1 text-sm">
              {t('booking.view_booking')}
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary flex-1 text-sm">
              {t('booking.back_home')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('booking.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Guest Info */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              {t('booking.guest_info')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('booking.last_name')} *</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  className={`input-field ${errors.lastName ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder={isJa ? '山田' : 'Smith'}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t('booking.first_name')} *</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className={`input-field ${errors.firstName ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder={isJa ? '太郎' : 'John'}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />{t('booking.email')} *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={`input-field ${errors.email ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />{t('booking.phone')} *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className={`input-field ${errors.phone ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder={isJa ? '090-0000-0000' : '+81-90-0000-0000'}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />{t('booking.special_requests')}
              </label>
              <textarea
                value={form.specialRequests}
                onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))}
                rows={3}
                className="input-field resize-none"
                placeholder={t('booking.special_requests_placeholder')}
              />
            </div>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              {t('booking.payment')}
            </h2>
            <div className="space-y-3">
              {[
                { value: 'hotel', icon: <Building2 className="w-5 h-5" />, label: t('booking.pay_at_hotel') },
                { value: 'online', icon: <CreditCard className="w-5 h-5" />, label: t('booking.pay_online') },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form.paymentMethod === opt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={form.paymentMethod === opt.value}
                    onChange={() => setForm(f => ({ ...f, paymentMethod: opt.value as 'hotel' | 'online' }))}
                    className="accent-blue-600"
                  />
                  <span className={form.paymentMethod === opt.value ? 'text-blue-600' : 'text-gray-500'}>
                    {opt.icon}
                  </span>
                  <span className={`text-sm font-medium ${form.paymentMethod === opt.value ? 'text-blue-700' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">{t('booking.summary')}</h2>
            <img src={room.images[0]} alt="" className="w-full h-36 object-cover rounded-xl mb-4" />
            <h3 className="font-semibold text-gray-800 text-sm mb-3">{isJa ? room.nameJa : room.name}</h3>

            <div className="space-y-2 text-sm mb-4">
              {[
                { label: t('booking.checkin'), value: checkIn },
                { label: t('booking.checkout'), value: checkOut },
                { label: t('booking.nights'), value: `${nights} ${isJa ? '泊' : nights === 1 ? 'night' : 'nights'}` },
                { label: t('booking.guests'), value: `${guestsCount} ${isJa ? '名' : guestsCount === 1 ? 'guest' : 'guests'}` },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-gray-600">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm mb-5">
              <div className="flex justify-between text-gray-600">
                <span>{t('booking.room_charge')}</span>
                <span>¥{roomCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('booking.tax')}</span>
                <span>¥{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                <span>{t('booking.total')}</span>
                <span className="text-blue-600">¥{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {loading ? (isJa ? '処理中...' : 'Processing...') : t('booking.confirm')}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">{t('booking.terms')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
