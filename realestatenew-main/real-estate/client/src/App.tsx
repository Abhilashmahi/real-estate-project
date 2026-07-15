import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, ChevronDown, LogOut } from 'lucide-react';

// Layout and Nav Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PublicNavbar from './components/PublicNavbar';
import CustomerSidebar from './components/CustomerSidebar';

// Admin Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import CustomerDetails from './pages/CustomerDetails';
import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import FollowUps from './pages/FollowUps';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Public Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import PublicProperties from './pages/PublicProperties';
import PublicPropertyDetails from './pages/PublicPropertyDetails';
import FAQ from './pages/FAQ';
import Services from './pages/Services';

// Customer Pages
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerProfile from './pages/CustomerProfile';
import CustomerEnquiries from './pages/CustomerEnquiries';
import CustomerWishlist from './pages/CustomerWishlist';
import CustomerSiteVisits from './pages/CustomerSiteVisits';

function App() {
  const [adminUser, setAdminUser] = useState<any>(() => {
    const u = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (u && token) {
      const parsed = JSON.parse(u);
      return parsed.role === 'admin' ? parsed : null;
    }
    return null;
  });

  const [customerUser, setCustomerUser] = useState<any>(() => {
    const u = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (u && token) {
      const parsed = JSON.parse(u);
      return parsed.role === 'customer' ? parsed : null;
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAdminUser(null);
    setCustomerUser(null);
  };

  const handleAdminLogin = (user: any) => {
    setAdminUser(user);
    setCustomerUser(null);
  };

  const handleCustomerLogin = (user: any) => {
    setCustomerUser(user);
    setAdminUser(null);
  };

  // Layout Wrappers
  const PublicLayoutWrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicNavbar customerUser={customerUser} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );

  const CustomerLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!customerUser) return <Navigate to="/customer/login" replace />;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
      <div className="app-container">
        <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} />
        <CustomerSidebar onLogout={handleLogout} className={sidebarOpen ? 'sidebar-open' : ''} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <header style={{
            height: '80px',
            background: 'linear-gradient(135deg, #0F172A 0%, #172554 50%, #1E3A8A 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid #334155',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 1.5rem',
            flexShrink: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            fontFamily: 'Poppins, sans-serif'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                className="mobile-menu-btn" 
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'transparent',
                  border: '1.5px solid #334155',
                  borderRadius: '8px',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#FFFFFF'
                }}
              >
                <Menu size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} className="hide-mobile">
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }}/>
                <span style={{ color: '#CBD5E1', fontSize: '0.85rem', fontWeight: 600 }}>Customer Portal</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {/* Direct Logout Button */}
              <button 
                onClick={handleLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239,68,68,0.2)',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(239,68,68,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.2)'; }}
              >
                <LogOut size={13} />
                Sign Out
              </button>

              {/* Avatar Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
                    color: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.85rem',
                    border: '2px solid rgba(255,255,255,0.2)',
                  }}>
                    {customerUser.name ? customerUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'CU'}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '1px',
                    right: '1px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    border: '2px solid #0F172A',
                  }}/>
                </div>
                <span style={{ color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 600 }} className="hide-mobile">
                  {customerUser.name}
                </span>
              </div>
            </div>
          </header>
          <div className="page-wrapper">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!adminUser) return <Navigate to="/admin/login" replace />;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
      <div className="app-container">
        <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} />
        <Sidebar onLogout={handleLogout} className={sidebarOpen ? 'sidebar-open' : ''} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <Navbar onToggleSidebar={() => setSidebarOpen(true)} onLogout={handleLogout} />
          <div className="page-wrapper">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const ProtectedCustomerProperties = ({ children }: { children: React.ReactNode }) => {
    if (!customerUser && !adminUser) {
      return <Navigate to="/customer/login" replace state={{ message: "Please login to view available properties." }} />;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <PublicNavbar customerUser={customerUser} onLogout={handleLogout} />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayoutWrapper><Home /></PublicLayoutWrapper>} />
        <Route path="/about" element={<PublicLayoutWrapper><div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}><AboutUs /></div></PublicLayoutWrapper>} />
        <Route path="/contact" element={<PublicLayoutWrapper><div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}><Contact /></div></PublicLayoutWrapper>} />
        <Route path="/faq" element={<PublicLayoutWrapper><div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}><FAQ /></div></PublicLayoutWrapper>} />
        <Route path="/services" element={<PublicLayoutWrapper><div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}><Services /></div></PublicLayoutWrapper>} />
        <Route path="/public-properties" element={<ProtectedCustomerProperties><div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}><PublicProperties /></div></ProtectedCustomerProperties>} />
        <Route path="/properties/:id" element={<ProtectedCustomerProperties><div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}><PublicPropertyDetails /></div></ProtectedCustomerProperties>} />

        {/* Customer Auth Routes */}
        <Route path="/customer/login" element={
          customerUser ? <Navigate to="/customer/dashboard" replace /> : <CustomerLogin onLogin={handleCustomerLogin} />
        } />
        <Route path="/customer/register" element={
          customerUser ? <Navigate to="/customer/dashboard" replace /> : <CustomerRegister />
        } />

        {/* Customer Gated Dashboard Routes */}
        <Route path="/customer/dashboard" element={<CustomerLayoutWrapper><CustomerDashboard /></CustomerLayoutWrapper>} />
        <Route path="/customer/profile" element={<CustomerLayoutWrapper><CustomerProfile /></CustomerLayoutWrapper>} />
        <Route path="/customer/enquiries" element={<CustomerLayoutWrapper><CustomerEnquiries /></CustomerLayoutWrapper>} />
        <Route path="/customer/wishlist" element={<CustomerLayoutWrapper><CustomerWishlist /></CustomerLayoutWrapper>} />
        <Route path="/customer/site-visits" element={<CustomerLayoutWrapper><CustomerSiteVisits /></CustomerLayoutWrapper>} />

        {/* Admin Login (no sidebar) */}
        <Route path="/admin/login" element={
          adminUser ? <Navigate to="/admin/dashboard" replace /> : <Login onLogin={handleAdminLogin} />
        } />

        {/* Admin Gated Portal Routes */}
        <Route path="/admin/dashboard" element={<AdminLayoutWrapper><Dashboard /></AdminLayoutWrapper>} />
        <Route path="/admin/properties" element={<AdminLayoutWrapper><Properties /></AdminLayoutWrapper>} />
        <Route path="/admin/properties/add" element={<AdminLayoutWrapper><AddProperty /></AdminLayoutWrapper>} />
        <Route path="/admin/properties/edit/:id" element={<AdminLayoutWrapper><EditProperty /></AdminLayoutWrapper>} />
        <Route path="/admin/enquiries" element={<AdminLayoutWrapper><Enquiries /></AdminLayoutWrapper>} />
        <Route path="/admin/enquiries/:id" element={<AdminLayoutWrapper><CustomerDetails /></AdminLayoutWrapper>} />
        <Route path="/admin/followups" element={<AdminLayoutWrapper><FollowUps /></AdminLayoutWrapper>} />
        <Route path="/admin/reports" element={<AdminLayoutWrapper><Reports /></AdminLayoutWrapper>} />
        <Route path="/admin/settings" element={<AdminLayoutWrapper><Settings /></AdminLayoutWrapper>} />

        {/* Fallbacks */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
