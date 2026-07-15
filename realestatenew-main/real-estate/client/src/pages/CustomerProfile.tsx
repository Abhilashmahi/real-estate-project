import React, { useState, useEffect } from 'react';

export default function CustomerProfile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://192.168.1.5:5000/api/auth/customer/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            password: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Error loading customer profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.5:5000/api/auth/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password || undefined
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Profile details updated successfully!');
        // Update user session object
        localStorage.setItem('user', JSON.stringify(data.user));
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        alert(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating customer profile:', error);
      alert('An error occurred.');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile details...</div>;
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal details and credentials securely.</p>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Personal Information</h3>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Full Name</label>
          <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Mobile Number</label>
            <input type="text" name="phone" className="form-input" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Security Settings</h3>

        <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">New Password (optional)</label>
            <input type="password" name="password" className="form-input" placeholder="••••••••" value={formData.password} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Confirm New Password</label>
            <input type="password" name="confirmPassword" className="form-input" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', alignSelf: 'flex-end', marginTop: '1.5rem' }}>Save Profile Changes</button>
      </form>
    </div>
  );
}
