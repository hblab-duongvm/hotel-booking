import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hotel, Menu, X, Globe, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'ja' ? 'en' : 'ja');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Hotel className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">Grand</span>
              <span className="text-lg font-bold text-blue-600">Hotel</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm transition-colors ${isActive('/')}`}>{t('nav.home')}</Link>
            <Link to="/rooms" className={`text-sm transition-colors ${isActive('/rooms')}`}>{t('nav.rooms')}</Link>
            <Link to="/bookings" className={`text-sm transition-colors ${isActive('/bookings')}`}>{t('nav.bookings')}</Link>

            {/* Admin Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {t('nav.admin')}
                <ChevronDown className={`w-4 h-4 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
              </button>
              {adminOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setAdminOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link
                    to="/admin/reports"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setAdminOpen(false)}
                  >
                    {t('nav.reports')}
                  </Link>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-blue-300 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium">{i18n.language === 'ja' ? 'EN' : 'JA'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleLang} className="p-2 text-gray-600 hover:text-blue-600">
              <Globe className="w-5 h-5" />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-600">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {[
            { to: '/', label: t('nav.home') },
            { to: '/rooms', label: t('nav.rooms') },
            { to: '/bookings', label: t('nav.bookings') },
            { to: '/admin', label: t('nav.dashboard') },
            { to: '/admin/reports', label: t('nav.reports') },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
