import React, { useState } from 'react';

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin User", "email": "admin@example.com", "role": "admin"}');

  // Website Branding states
  const [phone, setPhone] = useState(() => localStorage.getItem('companyPhone') || '+91 93449 12355');
  const [tagline, setTagline] = useState(() => localStorage.getItem('companyTagline') || 'Smart Real Estate Investment');
  const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem('companyLogo') || '');

  const handleSave = () => {
    localStorage.setItem('companyPhone', phone);
    localStorage.setItem('companyTagline', tagline);
    localStorage.setItem('companyLogo', logoUrl);
    alert('Settings saved successfully! Website branding has been updated.');
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Portal Settings</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Configure global settings and portal preferences.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>User Profile Details</h3>
          <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" defaultValue={user.name} />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input type="text" className="form-input" defaultValue={user.role || 'Administrator'} disabled />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" defaultValue={user.email} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Website Branding (Vishnu Realtors)</h3>
          <div className="form-group">
            <label className="form-label">Company Hotline Phone Number</label>
            <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Website Tagline</label>
            <input type="text" className="form-input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Company Logo Image URL (Optional)</label>
            <input type="text" className="form-input" placeholder="https://..." value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Notifications</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', cursor: 'pointer', marginBottom: '0.75rem' }}>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
            <span>Email me on new customer enquiry submission</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
            <span>Notify me on daily scheduled follow ups calendar summary</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button className="btn btn-secondary">Discard</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
