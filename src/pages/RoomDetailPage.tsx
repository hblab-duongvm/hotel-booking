import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Users, Maximize2, ChevronLeft, ChevronRight, Check, Calendar } from 'lucide-react';
import { ROOMS } from '../data/mockData';

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isJa = i18n.language === 'ja';

  const room = ROOMS.find(r => r.id === id);
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [imgIdx, setImgIdx] = useState(0);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || today);
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || tomorrow);
  const [guests, setGuests] = useState(Number(searchParams.get('guests') || 1));
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'reviews'>('overview');

  if (!room) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
      <p>Room not found</p>
    </div>
  );

  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  const roomCharge = room.pricePerNight * nights;
  const tax = Math.round(roomCharge * 0.1);
  const total = roomCharge + tax;

  const handleBook = () => {
    navigate(`/booking/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const reviews = [
    { name: isJa ? '田中 太郎' : 'Taro Tanaka', rating: 5, date: '2024-03-10', comment: isJa ? '素晴らしい客室でした。スタッフも親切で、また利用したいです。' : 'Excellent room! The staff was very kind. Will definitely come back.' },
    { name: isJa ? '佐藤 花子' : 'Hanako Sato', rating: 4, date: '2024-02-28', comment: isJa ? '清潔で快適でした。立地も最高です。' : 'Clean and comfortable. Great location too.' },
    { name: isJa ? '山田 一郎' : 'Ichiro Yamada', rating: 5, date: '2024-02-15', comment: isJa ? 'アメニティが充実していて、眺めも最高でした。' : 'Great amenities and amazing views.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {isJa ? '戻る' : 'Back'}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Room Info */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 mb-6 bg-gray-100">
            <img
              src={room.images[imgIdx]}
              alt={isJa ? room.nameJa : room.name}
              className="w-full h-full object-cover"
            />
            {room.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(i => (i - 1 + room.images.length) % room.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setImgIdx(i => (i + 1) % room.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {room.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
            <div className="absolute top-4 left-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${room.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {room.available ? t('room_detail.available') : t('room_detail.unavailable')}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-blue capitalize text-xs">{t(`room_types.${room.type}`)}</span>
                <span className="text-gray-400 text-xs">{isJa ? `${room.floor}階` : `Floor ${room.floor}`}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{isJa ? room.nameJa : room.name}</h1>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 shrink-0">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-800">{room.rating}</span>
              <span className="text-gray-400 text-xs">({room.reviewCount})</span>
            </div>
          </div>

          {/* Room Specs */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-500" />
              {isJa ? `最大${room.capacity}名` : `Up to ${room.capacity} guests`}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-blue-500" />
              {room.size}{t('rooms.sqm')}
            </span>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-5">
            <div className="flex gap-0">
              {(['overview', 'amenities', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t(`room_detail.${tab}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <p className="text-gray-600 leading-relaxed text-sm">
              {isJa ? room.descriptionJa : room.description}
            </p>
          )}

          {activeTab === 'amenities' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(isJa ? room.amenitiesJa : room.amenities).map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  {a}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {r.name[0]}
                      </div>
                      <span className="font-semibold text-sm text-gray-800">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">{r.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-2xl font-bold text-blue-600">¥{room.pricePerNight.toLocaleString()}</span>
              <span className="text-gray-400 text-sm">{t('rooms.per_night')}</span>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  {t('room_detail.checkin')}
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={e => setCheckIn(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  {t('room_detail.checkout')}
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={e => setCheckOut(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  {t('room_detail.guests')}
                </label>
                <select
                  value={guests}
                  onChange={e => setGuests(Number(e.target.value))}
                  className="input-field text-sm"
                >
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {isJa ? '名' : n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>¥{room.pricePerNight.toLocaleString()} × {nights} {isJa ? '泊' : nights === 1 ? 'night' : 'nights'}</span>
                <span>¥{roomCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('booking.tax')}</span>
                <span>¥{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                <span>{t('room_detail.total')}</span>
                <span className="text-blue-600">¥{total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400 text-center">{t('room_detail.taxes_included')}</p>
            </div>

            <button
              onClick={handleBook}
              disabled={!room.available}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                room.available
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {room.available ? t('room_detail.proceed') : t('room_detail.unavailable')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
