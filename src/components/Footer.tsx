import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Grand Hotel</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {isJa
                ? '最高のおもてなしと快適な滞在をご提供します。'
                : 'Providing the finest hospitality and comfortable stays.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {isJa ? 'クイックリンク' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: isJa ? 'ホーム' : 'Home' },
                { to: '/rooms', label: isJa ? '客室' : 'Rooms' },
                { to: '/bookings', label: isJa ? '予約確認' : 'My Bookings' },
                { to: '/admin', label: isJa ? '管理画面' : 'Admin' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {isJa ? 'お問い合わせ' : 'Contact'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <span>{isJa ? '東京都新宿区西新宿1-1-1' : '1-1-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo'}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>03-1234-5678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>info@grandhotel.jp</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {isJa ? '営業時間' : 'Hours'}
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{isJa ? 'チェックイン: 15:00〜' : 'Check-in: From 15:00'}</li>
              <li>{isJa ? 'チェックアウト: 〜11:00' : 'Check-out: Until 11:00'}</li>
              <li>{isJa ? 'フロント: 24時間' : 'Front Desk: 24 hours'}</li>
              <li>{isJa ? 'レストラン: 7:00〜22:00' : 'Restaurant: 7:00–22:00'}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-500">
            © 2024 Grand Hotel. {isJa ? '全著作権所有。' : 'All rights reserved.'}
          </p>
          <p className="text-xs text-gray-500">
            {isJa ? 'React 19 + TailwindCSS で構築' : 'Built with React 19 + TailwindCSS'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
