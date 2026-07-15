import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface CustomerSidebarProps {
  onLogout: () => void;
  className?: string;
  onClose?: () => void;
}

const navItems = [
  { to: '/customer/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/public-properties', label: 'Browse Properties', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { to: '/customer/wishlist', label: 'My Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { to: '/customer/enquiries', label: 'My Enquiries', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { to: '/customer/site-visits', label: 'Site Visits', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/customer/profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function CustomerSidebar({ onLogout, className = '', onClose }: CustomerSidebarProps) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    onLogout();
    navigate('/customer/login');
  };

  const getInitials = (name: string) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'CU';

  return (
    <aside className={className} style={{
      width: '240px',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.5rem 1.25rem 1rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif', lineHeight: 1.2 }}>Vishnu Realtors</div>
            <div style={{ color: '#93C5FD', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Customer Portal</div>
          </div>
        </div>
        {onClose && (
          <button className="show-mobile" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#b0c4de', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </div>

      {/* User Avatar */}
      <div style={{ padding: '1rem 1.25rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '0.85rem',
            flexShrink: 0,
            border: '2px solid rgba(147,197,253,0.4)',
          }}>
            {getInitials(user.name || '')}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name || 'Customer'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email || ''}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/customer/dashboard'}
            onClick={() => onClose?.()}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
              background: isActive ? 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)' : 'transparent',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'all 0.18s ease',
              boxShadow: isActive ? '0 2px 8px rgba(29,78,216,0.3)' : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon}/>
                </svg>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.65rem 0.9rem',
            background: 'rgba(220,38,38,0.12)',
            border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: '8px',
            color: '#FCA5A5',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'all 0.18s ease',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.22)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.12)'; }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
