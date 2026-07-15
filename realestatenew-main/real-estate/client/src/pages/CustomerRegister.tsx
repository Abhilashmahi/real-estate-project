import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address.';
    if (!formData.phone.trim()) newErrors.phone = 'Mobile number is required.';
    else if (formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Enter a valid 10-digit mobile number.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: formData.name, email: formData.email, mobile: formData.phone, password: formData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/customer/login', { state: { successMessage: 'Registration successful! Please login to continue.' } });
      } else {
        setServerError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', padding: '0.75rem 1rem 0.75rem 2.25rem',
    border: `1.5px solid ${errors[field] ? '#DC2626' : '#E5E7EB'}`,
    borderRadius: '10px', fontSize: '0.9rem',
    background: '#fff', color: '#0F172A',
    fontFamily: 'inherit', outline: 'none',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '460px', animation: 'fadeInUp 0.35s ease both' }}>

        {/* Card */}
        <div style={{ background: '#ffffff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Card Header */}
          <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', padding: '2.5rem 2rem 2rem', textAlign: 'center', borderBottom: '1px solid rgba(29,78,216,0.1)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            </div>
            <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.25rem' }}>Create Account</h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0 }}>Join Vishnu Realtors — it's 100% free</p>
          </div>

          {/* Form */}
          <div style={{ padding: '2.25rem 2rem' }}>
            {serverError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" style={{ flexShrink: 0, marginTop: '1px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ color: '#DC2626', fontSize: '0.82rem', fontWeight: 500 }}>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }} noValidate>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Rajesh Kumar" style={inputStyle('name')} />
                  <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                </div>
                {errors.name && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.3rem', margin: '0.3rem 0 0', fontWeight: 500 }}>{errors.name}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" style={inputStyle('email')} />
                  <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  </span>
                </div>
                {errors.email && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.3rem', margin: '0.3rem 0 0', fontWeight: 500 }}>{errors.email}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" style={inputStyle('phone')} />
                  <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.13 12.6 19.79 19.79 0 012.06 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  </span>
                </div>
                {errors.phone && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.3rem', margin: '0.3rem 0 0', fontWeight: 500 }}>{errors.phone}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" style={inputStyle('password')} />
                  <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </span>
                </div>
                {errors.password && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.3rem', margin: '0.3rem 0 0', fontWeight: 500 }}>{errors.password}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" style={inputStyle('confirmPassword')} />
                  <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </span>
                </div>
                {errors.confirmPassword && <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '0.3rem', margin: '0.3rem 0 0', fontWeight: 500 }}>{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '0.75rem',
                  width: '100%', padding: '0.85rem',
                  background: loading ? '#94A3B8' : 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
                  color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem',
                  border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(29,78,216,0.35)',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
              >
                {loading ? 'Creating Account...' : (
                  <>
                    Create Account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </>
                )}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#64748B', margin: '1.75rem 0 0' }}>
              Already have an account?{' '}
              <Link to="/customer/login" style={{ color: '#1D4ED8', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
