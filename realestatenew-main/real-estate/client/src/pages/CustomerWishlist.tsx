import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CustomerWishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchWishlist = async () => {
    try {
      const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const handleRemove = async (propertyId: number) => {
    if (!window.confirm('Are you sure you want to remove this property from your wishlist?')) return;
    try {
      const response = await fetch(`https://real-estate-backend-9qqo.onrender.com/api/wishlist/${propertyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Removed from wishlist.');
        fetchWishlist();
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading wishlist...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Saved Wishlist</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Properties you have saved for future reference.</p>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Property Name</th>
              <th>Location</th>
              <th>Type</th>
              <th>Price</th>
              <th style={{ width: '150px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  Your wishlist is empty.
                </td>
              </tr>
            ) : (
              wishlist.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/properties/${item.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                      {item.title}
                    </Link>
                  </td>
                  <td>{item.location}</td>
                  <td>{item.type}</td>
                  <td>₹{item.price} Lakhs</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <Link to={`/properties/${item.id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                        View Details
                      </Link>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', color: 'var(--color-danger)' }}
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
