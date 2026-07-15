import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
  className?: string;
  onClose?: () => void;
}

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/admin/properties', label: 'Properties', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { to: '/admin/enquiries', label: 'Enquiries', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { to: '/admin/followups', label: 'Follow-ups', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/admin/reports', label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { to: '/admin/settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function Sidebar({ onLogout, className = '', onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/admin/login');
  };

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
            <div style={{ color: '#93C5FD', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Portal</div>
          </div>
        </div>
        {onClose && (
          <button className="show-mobile" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#b0c4de', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
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
