import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Star, Shield, Clock, ThumbsUp, ChevronRight, MapPin } from 'lucide-react';
import { ROOMS } from '../data/mockData';

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isJa = i18n.language === 'ja';
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [search, setSearch] = useState({ checkIn: today, checkOut: tomorrow, guests: 1 });

  const handleSearch = () => {
    navigate(`/rooms?checkIn=${search.checkIn}&checkOut=${search.checkOut}&guests=${search.guests}`);
  };

  const featuredRooms = ROOMS.filter(r => r.available).slice(0, 3);

  const whyUs = [
    { icon: <Shield className="w-6 h-6" />, titleKey: 'home.why_1_title', descKey: 'home.why_1_desc', color: 'bg-blue-100 text-blue-600' },
    { icon: <ThumbsUp className="w-6 h-6" />, titleKey: 'home.why_2_title', descKey: 'home.why_2_desc', color: 'bg-green-100 text-green-600' },
    { icon: <Clock className="w-6 h-6" />, titleKey: 'home.why_3_title', descKey: 'home.why_3_desc', color: 'bg-purple-100 text-purple-600' },
    { icon: <Star className="w-6 h-6" />, titleKey: 'home.why_4_title', descKey: 'home.why_4_desc', color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Tokyo, Japan</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {t('home.hero_title')}
            </h1>
            <p className="text-lg text-gray-300 mb-10">
              {t('home.hero_subtitle')}
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    {t('home.search_checkin')}
                  </label>
                  <input
                    type="date"
                    value={search.checkIn}
                    min={today}
                    onChange={e => setSearch(s => ({ ...s, checkIn: e.target.value }))}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    {t('home.search_checkout')}
                  </label>
                  <input
                    type="date"
                    value={search.checkOut}
                    min={search.checkIn}
                    onChange={e => setSearch(s => ({ ...s, checkOut: e.target.value }))}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    {t('home.search_guests')}
                  </label>
                  <select
                    value={search.guests}
                    onChange={e => setSearch(s => ({ ...s, guests: Number(e.target.value) }))}
                    className="input-field text-sm"
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n} {isJa ? '名' : n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button onClick={handleSearch} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                <Search className="w-4 h-4" />
                {t('home.search_btn')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-blue-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: isJa ? '満足したゲスト' : 'Happy Guests' },
              { value: '6', label: isJa ? '客室タイプ' : 'Room Types' },
              { value: '4.7★', label: isJa ? '平均評価' : 'Avg Rating' },
              { value: '24/7', label: isJa ? 'サポート' : 'Support' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('home.featured')}</h2>
            <p className="text-gray-500 mt-1 text-sm">{isJa ? '人気の客室をご紹介します' : 'Explore our most popular rooms'}</p>
          </div>
          <button
            onClick={() => navigate('/rooms')}
            className="hidden sm:flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
          >
            {isJa ? '全て見る' : 'View All'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRooms.map(room => (
            <div
              key={room.id}
              className="card group cursor-pointer hover:shadow-md transition-all duration-300"
              onClick={() => navigate(`/rooms/${room.id}`)}
            >
              <div className="relative overflow-hidden h-52">
                <img
                  src={room.images[0]}
                  alt={isJa ? room.nameJa : room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="badge-blue capitalize">{t(`room_types.${room.type}`)}</span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold text-gray-800">{room.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{isJa ? room.nameJa : room.name}</h3>
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                  {isJa ? room.descriptionJa : room.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-blue-600">¥{room.pricePerNight.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs ml-1">{t('rooms.per_night')}</span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/rooms/${room.id}`); }}
                    className="btn-primary text-xs px-3 py-1.5"
                  >
                    {t('rooms.book_now')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 sm:hidden">
          <button onClick={() => navigate('/rooms')} className="btn-secondary text-sm">
            {isJa ? '全ての客室を見る' : 'View All Rooms'}
          </button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t('home.why_us')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <div key={i} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{t(item.titleKey)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {isJa ? '今すぐご予約ください' : 'Book Your Stay Today'}
          </h2>
          <p className="text-blue-200 mb-6 text-sm">
            {isJa ? '特別料金で最高の滞在をお楽しみください。' : 'Enjoy the best rates and a memorable experience.'}
          </p>
          <button
            onClick={() => navigate('/rooms')}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg"
          >
            {isJa ? '客室を見る' : 'Explore Rooms'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
