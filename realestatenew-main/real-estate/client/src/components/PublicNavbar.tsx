import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Briefcase, 
  Building2, 
  Info, 
  HelpCircle, 
  Phone, 
  LogOut, 
  LayoutDashboard, 
  User, 
  Settings, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';

interface PublicNavbarProps {
  customerUser: any;
  onLogout: () => void;
}

export default function PublicNavbar({ customerUser: propCustomerUser, onLogout }: PublicNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Retrieve user session dynamically to support both Customer and Admin logins in public views
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token && !!user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'UR';
  };

  const menuItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/services', label: 'Services' },
    { to: '/public-properties', label: 'Properties' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '80px',
      background: 'linear-gradient(135deg, #0F172A 0%, #172554 50%, #1E3A8A 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #334155',
      boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.25)' : '0 4px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
      }}>
        
        {/* ── Logo Section ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}>
            <Building2 size={22} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.15rem', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Vishnu Realtors
            </span>
            <span style={{ color: '#93C5FD', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.15rem' }}>
              SMART REAL ESTATE
            </span>
          </div>
        </Link>

        {/* ── Desktop Menu Navigation ── */}
        <nav className="public-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                color: isActive ? '#FFFFFF' : '#CBD5E1',
                textDecoration: 'none',
                fontSize: '0.925rem',
                fontWeight: isActive ? 600 : 500,
                padding: '0.5rem 0',
                position: 'relative',
                transition: 'color 0.2s',
              })}
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {/* Underline Hover Animation */}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: isActive ? '100%' : '0',
                    height: '2px',
                    background: '#2563EB',
                    borderRadius: '999px',
                    transition: 'width 0.2s ease-in-out',
                    boxShadow: isActive ? '0 0 8px #2563EB' : 'none'
                  }} className="nav-underline" />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop Profile & Action Controls ── */}
        <div className="public-auth-links" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
          {isLoggedIn ? (
            <>
              {/* Dashboard Pill Button */}
              <Link 
                to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.4)'; }}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>

              {/* User Profile Circular Avatar dropdown trigger */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {/* Profile Wrapper with Online Indicator */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      border: '2px solid rgba(255,255,255,0.2)',
                    }}>
                      {getInitials(user.name)}
                    </div>
                    {/* Online status green dot */}
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
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="#CBD5E1" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '190px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '0.5rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    animation: 'fadeInUp 0.18s ease both',
                  }}>
                    <Link 
                      to={user.role === 'admin' ? '/admin/settings' : '/customer/profile'} 
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        color: '#CBD5E1',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#FFFFFF'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CBD5E1'; }}
                    >
                      <User size={14} />
                      My Profile
                    </Link>
                    
                    <Link 
                      to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} 
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        color: '#CBD5E1',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#FFFFFF'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CBD5E1'; }}
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>

                    <Link 
                      to={user.role === 'admin' ? '/admin/settings' : '/customer/profile'} 
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        color: '#CBD5E1',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#FFFFFF'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CBD5E1'; }}
                    >
                      <Settings size={14} />
                      Settings
                    </Link>

                    <div style={{ height: '1px', background: '#334155', margin: '0.35rem 0' }} />

                    <button 
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: '#EF4444',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.15s',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login outline button */}
              <Link to="/customer/login" style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid #334155',
                borderRadius: '9999px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                Login
              </Link>
              {/* Register Free premium blue gradient */}
              <Link to="/customer/register" style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                borderRadius: '9999px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(37,99,235,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)'; }}>
                Register Free
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Hamburger Button ── */}
        <button
          className="show-mobile"
          onClick={() => setMobileOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ── Mobile Navigation Drawer Backdrop ── */}
      <div className={`mobile-nav-backdrop ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      
      {/* ── Mobile Navigation Drawer Menu ── */}
      <div className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <span style={{ color: '#93C5FD', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em' }}>NAVIGATION</span>
          <button onClick={() => setMobileOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                color: isActive ? '#60A5FA' : '#CBD5E1',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: isActive ? 700 : 500,
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isLoggedIn ? (
            <>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} />
                <span>Signed in as <strong style={{ color: '#FFFFFF' }}>{user.name}</strong></span>
              </div>
              <Link 
                to={user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard'} 
                onClick={() => setMobileOpen(false)} 
                style={{
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                  borderRadius: '9999px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}
              >
                Dashboard
              </Link>
              <button 
                onClick={() => { handleLogout(); setMobileOpen(false); }} 
                style={{
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  borderRadius: '9999px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(239,68,68,0.25)',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/customer/login" 
                onClick={() => setMobileOpen(false)} 
                style={{
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid #334155',
                  borderRadius: '9999px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                Login
              </Link>
              <Link 
                to="/customer/register" 
                onClick={() => setMobileOpen(false)} 
                style={{
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                  borderRadius: '9999px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}
              >
                Register Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
