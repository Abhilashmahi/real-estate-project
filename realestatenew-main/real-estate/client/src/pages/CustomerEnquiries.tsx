import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CustomerEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/enquiries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setEnquiries(data);
        }
      } catch (error) {
        console.error('Error fetching customer enquiries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, [token]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading enquiries...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Enquiry History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View details and tracking status of properties you enquired about.</p>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Property Name</th>
              <th>Enquiry Notes</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  You have not submitted any enquiries yet.
                </td>
              </tr>
            ) : (
              enquiries.map((item, index) => {
                let badgeCls = 'badge-primary';
                if (item.status === 'New') badgeCls = 'badge-success';
                if (item.status === 'Pending') badgeCls = 'badge-warning';
                if (item.status === 'Closed') badgeCls = 'badge-danger';
                
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      {item.propertyId ? (
                        <Link to={`/properties/${item.propertyId}`} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                          {item.propertyName || 'Property Details'}
                        </Link>
                      ) : (
                        <strong>{item.propertyName}</strong>
                      )}
                    </td>
                    <td>{item.notes || 'N/A'}</td>
                    <td>
                      <span className={`badge ${badgeCls}`}>{item.status}</span>
                    </td>
                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</td>
                    <td style={{ textAlign: 'center' }}>
                      {item.propertyId && (
                        <Link to={`/properties/${item.propertyId}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                          View Property
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
