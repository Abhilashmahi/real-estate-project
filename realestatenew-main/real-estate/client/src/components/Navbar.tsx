import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, 
  ChevronDown, 
  User, 
  Settings as SettingsIcon, 
  LayoutDashboard, 
  LogOut 
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onLogout: () => void;
}

export default function Navbar({ onToggleSidebar, onLogout }: NavbarProps) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    setDropdownOpen(false);
    navigate('/admin/login');
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD';
  };

  return (
    <header style={{
      height: '80px',
      background: 'linear-gradient(135deg, #0F172A 0%, #172554 50%, #1E3A8A 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid #334155',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      flexShrink: 0,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      fontFamily: 'Poppins, sans-serif'
    }}>
      
      {/* Left side: toggle mobile menu & system status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {onToggleSidebar && (
          <button 
            className="mobile-menu-btn" 
            onClick={onToggleSidebar} 
            style={{ 
              marginRight: '0.25rem',
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
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} className="hide-mobile">
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: '#22C55E',
            boxShadow: '0 0 8px #22C55E' 
          }}/>
          <span style={{ color: '#CBD5E1', fontSize: '0.85rem', fontWeight: 600 }}>
            System Online · {timeStr}
          </span>
        </div>
      </div>

      {/* Right side: User Profile dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        
        {/* Sign Out Pill Button directly accessible next to profile */}
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

        {/* Profile Avatar trigger */}
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
              {user.name || 'Admin'}
            </span>
            <ChevronDown size={14} color="#CBD5E1" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {/* Profile Dropdown */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '185px',
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
              zIndex: 100
            }}>
              <Link 
                to="/admin/settings" 
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
                to="/admin/dashboard" 
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
                to="/admin/settings" 
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
                <SettingsIcon size={14} />
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

      </div>

    </header>
  );
}
