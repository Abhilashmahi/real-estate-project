import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Properties() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://192.168.1.5:5000/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://192.168.1.5:5000/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Property deleted successfully!');
        fetchProperties();
      } else {
        alert('Failed to delete property.');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('An error occurred while deleting the property.');
    }
  };

  const filteredProperties = properties.filter(item => {
    const title = item.title || item.name || '';
    const loc = item.location || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           loc.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Property List</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Dashboard / Properties</p>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center', 
        marginBottom: '1.5rem', 
        backgroundColor: '#ffffff', 
        padding: '1rem', 
        borderRadius: '8px', 
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ flex: 1, maxWidth: '320px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search property..."
            className="form-input"
            style={{ paddingLeft: '2.25rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        
        <Link to="/admin/properties/add" className="btn btn-primary" style={{ marginLeft: 'auto', textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Property
        </Link>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Property Name</th>
              <th>Location</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((item, index) => {
              const badgeCls = item.status === 'Available' ? 'badge-success' : 'badge-danger';
              
              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '50px', height: '38px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', flexShrink: 0 }}>
                        <img 
                          src={item.images?.[0]?.url 
                            ? (item.images[0].url.startsWith('http') ? item.images[0].url : `http://192.168.1.5:5000/${item.images[0].url}`)
                            : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100'
                          } 
                          alt="" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100';
                          }}
                        />
                      </div>
                      <strong>{item.title || item.name}</strong>
                    </div>
                  </td>
                  <td>{item.location}</td>
                  <td>{item.type}</td>
                  <td>{item.price} Lakhs</td>
                  <td>
                    <span className={`badge ${badgeCls}`}>{item.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        onClick={() => navigate(`/admin/properties/edit/${item.id}`)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', color: 'var(--color-danger)' }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1rem 1.25rem',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <span>Showing 1 to {filteredProperties.length} of 50 entries</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>&lt;</button>
            <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', minWidth: '28px' }}>1</button>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', minWidth: '28px' }}>2</button>
            <span style={{ alignSelf: 'center', margin: '0 0.25rem' }}>...</span>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', minWidth: '28px' }}>10</button>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
