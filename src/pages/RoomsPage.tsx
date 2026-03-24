import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Users, Maximize2, Wifi, Filter, SlidersHorizontal } from 'lucide-react';
import { ROOMS, type RoomType } from '../data/mockData';

const RoomsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isJa = i18n.language === 'ja';

  const [filterType, setFilterType] = useState<RoomType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('price_asc');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [showFilter, setShowFilter] = useState(false);

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = Number(searchParams.get('guests') || 1);

  const filtered = useMemo(() => {
    let list = ROOMS.filter(r => {
      if (filterType !== 'all' && r.type !== filterType) return false;
      if (r.pricePerNight > maxPrice) return false;
      if (r.capacity < guests) return false;
      return true;
    });
    if (sortBy === 'price_asc') list = [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sortBy === 'price_desc') list = [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
    else list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [filterType, sortBy, maxPrice, guests]);

  const roomTypes: (RoomType | 'all')[] = ['all', 'standard', 'deluxe', 'suite', 'family', 'executive'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('rooms.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {filtered.length} {isJa ? '件の客室が見つかりました' : 'rooms found'}
            {checkIn && checkOut && (
              <span className="ml-2 text-blue-600">
                · {checkIn} → {checkOut}
                {guests > 1 && ` · ${guests}${isJa ? '名' : ' guests'}`}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Filter className="w-4 h-4" />
            {t('rooms.filter_type')}
          </button>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="input-field text-sm w-auto"
            >
              <option value="price_asc">{t('rooms.sort_price_asc')}</option>
              <option value="price_desc">{t('rooms.sort_price_desc')}</option>
              <option value="rating">{t('rooms.sort_rating')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="card p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('rooms.filter_type')}</label>
              <div className="flex flex-wrap gap-2">
                {roomTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      filterType === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {type === 'all' ? t('rooms.filter_all') : t(`room_types.${type}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('rooms.filter_price')}: ¥{maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min={5000}
                max={50000}
                step={1000}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>¥5,000</span>
                <span>¥50,000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Maximize2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{t('rooms.no_rooms')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(room => (
            <div
              key={room.id}
              className="card group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => navigate(`/rooms/${room.id}${checkIn ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` : ''}`)}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-52">
                <img
                  src={room.images[0]}
                  alt={isJa ? room.nameJa : room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="badge-blue capitalize text-xs">{t(`room_types.${room.type}`)}</span>
                  {!room.available && (
                    <span className="badge-red text-xs">{t('room_detail.unavailable')}</span>
                  )}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-gray-800">{room.rating}</span>
                  <span className="text-xs text-gray-400">({room.reviewCount})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{isJa ? room.nameJa : room.name}</h3>
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                  {isJa ? room.descriptionJa : room.description}
                </p>

                {/* Room Info */}
                <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {room.capacity} {t('rooms.guests')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    {room.size}{t('rooms.sqm')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5" />
                    WiFi
                  </span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(isJa ? room.amenitiesJa : room.amenities).slice(0, 3).map((a, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="text-xs text-gray-400">+{room.amenities.length - 3}</span>
                  )}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xl font-bold text-blue-600">¥{room.pricePerNight.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs ml-1">{t('rooms.per_night')}</span>
                  </div>
                  <button
                    disabled={!room.available}
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/rooms/${room.id}${checkIn ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` : ''}`);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      room.available
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-95'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {room.available ? t('rooms.book_now') : t('room_detail.unavailable')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
