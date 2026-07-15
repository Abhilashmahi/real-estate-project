import React, { useState, useEffect } from 'react';

export default function CustomerSiteVisits() {
  const [visits, setVisits] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Visit Booking Form State
  const [propertyId, setPropertyId] = useState('');
  const [visitDate, setVisitDate] = useState('');

  const token = localStorage.getItem('token');

  const fetchVisits = async () => {
    try {
      const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/site-visits', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVisits(data);
      }
    } catch (error) {
      console.error('Error fetching customer visits:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
        if (data.length > 0) {
          setPropertyId(String(data[0].id));
        }
      }
    } catch (error) {
      console.error('Error fetching properties for visit dropdown:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
    fetchProperties();
  }, [token]);

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !visitDate) return;
    try {
      const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/site-visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId, visitDate })
      });
      if (response.ok) {
        alert('Site visit booked successfully!');
        setVisitDate('');
        fetchVisits();
      } else {
        alert('Failed to book visit.');
      }
    } catch (error) {
      console.error('Error booking visit:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading site visits...</div>;
  }

  return (
    <div className="prop-detail-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'flex-start' }}>
      {/* Left side: List of scheduled visits */}
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Scheduled Site Visits</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track the confirmation status of your scheduled property visits.</p>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Property Name</th>
                <th>Visit Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visits.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    You have no site visits scheduled.
                  </td>
                </tr>
              ) : (
                visits.map((item, index) => {
                  let badgeCls = 'badge-primary';
                  if (item.status === 'Confirmed') badgeCls = 'badge-success';
                  if (item.status === 'Cancelled') badgeCls = 'badge-danger';
                  
                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td><strong>{item.property?.title || 'Property Details'}</strong></td>
                      <td>{item.visitDate}</td>
                      <td>
                        <span className={`badge ${badgeCls}`}>{item.status}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right side: Scheduling Form */}
      <form onSubmit={handleBookVisit} style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Book Site Visit</h3>
        
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Select Property</label>
          <select className="form-input" value={propertyId} onChange={(e) => setPropertyId(e.target.value)}>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.location})</option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Preferred Date</label>
          <input
            type="date"
            className="form-input"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Schedule Visit</button>
      </form>
    </div>
  );
}
