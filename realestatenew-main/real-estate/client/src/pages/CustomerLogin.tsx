import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface CustomerLoginProps {
  onLogin: (userData: any) => void;
}

export default function CustomerLogin({ onLogin }: CustomerLoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectMessage = (location.state as any)?.message;
  const successMessage = (location.state as any)?.successMessage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://192.168.1.5:5000/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        navigate('/customer/dashboard');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.35s ease both' }}>
        <div style={{ background: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '2.5rem 2rem 2rem', textAlign: 'center', borderBottom: '1px solid rgba(29,78,216,0.1)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            </div>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.25rem' }}>Welcome Back</h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0 }}>Sign in to your Vishnu Realtors account</p>
          </div>

          {/* Form */}
          <div style={{ padding: '2.25rem 2rem' }}>

            {successMessage && (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ color: '#059669', fontSize: '0.82rem', fontWeight: 600 }}>{successMessage}</span>
              </div>
            )}

            {redirectMessage && (
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ color: '#92400E', fontSize: '0.82rem', fontWeight: 500 }}>{redirectMessage}</span>
              </div>
            )}

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ color: '#DC2626', fontSize: '0.82rem', fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="name@example.com" required
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s' }}
                  />
                  <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  </span>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="Enter your password" required
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem', border: '1.5px solid #E5E7EB', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s' }}
                  />
                  <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </span>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                marginTop: '0.5rem', width: '100%', padding: '0.85rem',
                background: loading ? '#94A3B8' : 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
                color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 16px rgba(29,78,216,0.3)',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}>
                {loading ? 'Signing In...' : (
                  <>Sign In <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                )}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#64748B', margin: '1.75rem 0 0' }}>
              Don't have an account?{' '}
              <Link to="/customer/register" style={{ color: '#1D4ED8', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
            </p>

            <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'center' }}>
              <Link to="/admin/login" style={{ color: '#94A3B8', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>CRM Staff Login →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
