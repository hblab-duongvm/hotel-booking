import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './i18n';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StaffLayout from './components/staff/StaffLayout';

// Public pages
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import InvoicePage from './pages/InvoicePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminReportsPage from './pages/AdminReportsPage';

// Staff pages
import StaffDashboardPage from './pages/staff/StaffDashboardPage';
import StaffBookingsPage from './pages/staff/StaffBookingsPage';
import StaffRoomsPage from './pages/staff/StaffRoomsPage';
import StaffHousekeepingPage from './pages/staff/StaffHousekeepingPage';
import StaffGuestsPage from './pages/staff/StaffGuestsPage';
import StaffInvoicesPage from './pages/staff/StaffInvoicesPage';
import StaffSchedulePage from './pages/staff/StaffSchedulePage';
import StaffShiftReportsPage from './pages/staff/StaffShiftReportsPage';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

// Staff Portal wrapper with shared lang state
const StaffPortal: React.FC = () => {
  const [lang, setLang] = useState<'ja' | 'en'>('ja');

  return (
    <Routes>
      <Route path="/" element={
        <StaffLayout lang={lang} onLangChange={setLang}>
          <StaffDashboardPage lang={lang} />
        </StaffLayout>
      } />
      <Route path="/bookings" element={
        <StaffLayout lang={lang} onLangChange={setLang}>
          <StaffBookingsPage lang={lang} />
        </StaffLayout>
      } />
      <Route path="/rooms" element={
        <StaffLayout lang={lang} onLangChange={setLang}>
          <StaffRoomsPage lang={lang} />
        </StaffLayout>
      } />
      <Route path="/housekeeping" element={
        <StaffLayout lang={lang} onLangChange={setLang}>
          <StaffHousekeepingPage lang={lang} />
        </StaffLayout>
      } />
      <Route path="/guests" element={
        <StaffLayout lang={lang} onLangChange={setLang}>
          <StaffGuestsPage lang={lang} />
        </StaffLayout>
      } />
      <Route path="/invoices" element={
        <StaffLayout lang={lang} onLangChange={setLang}>
          <StaffInvoicesPage lang={lang} />
        </StaffLayout>
      } />
      <Route path="/schedule" element={
        <StaffLayout lang={lang} onLangChange={setLang}>
          <StaffSchedulePage lang={lang} />
        </StaffLayout>
      } />
      <Route path="/reports" element={
        <StaffLayout lang={lang} onLangChange={setLang}>
          <StaffShiftReportsPage lang={lang} />
        </StaffLayout>
      } />
    </Routes>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/rooms" element={<PublicLayout><RoomsPage /></PublicLayout>} />
      <Route path="/rooms/:id" element={<PublicLayout><RoomDetailPage /></PublicLayout>} />
      <Route path="/booking/:id" element={<PublicLayout><BookingPage /></PublicLayout>} />
      <Route path="/bookings" element={<PublicLayout><MyBookingsPage /></PublicLayout>} />
      <Route path="/invoice/:id" element={<PublicLayout><InvoicePage /></PublicLayout>} />
      <Route path="/admin" element={<PublicLayout><AdminDashboardPage /></PublicLayout>} />
      <Route path="/admin/reports" element={<PublicLayout><AdminReportsPage /></PublicLayout>} />

      {/* Staff Portal routes */}
      <Route path="/staff/*" element={<StaffPortal />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
