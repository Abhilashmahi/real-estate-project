import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumUploader from '../components/PremiumUploader';

export default function AddProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Villa',
    status: 'Available',
    location: '',
    price: '',
    area: '',
    beds: '0',
    baths: '0'
  });
  const [mapLink, setMapLink] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (images.length === 0) {
      setErrorMsg('Please upload at least one image for the property.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/properties', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          mapLink,
          images
        })
      });
      if (response.ok) {
        alert('Property added successfully!');
        navigate('/admin/properties');
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || 'Server error saving property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      setErrorMsg('Network error while saving property.');
    }
  };

  return (
    <div style={{ fontFamily: 'Poppins, Inter, sans-serif', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Add New Property</h1>
        <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: 4 }}>Dashboard / Properties / Add</p>
      </div>

      {errorMsg && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', padding: '0.85rem 1.15rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.83rem', fontWeight: 700 }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '16px', 
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}>
        <div className="responsive-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          
          <div className="form-group span-2" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Property Title / Name</label>
            <input type="text" name="name" className="form-input" placeholder="e.g. Vishnu Premium Villa Palace" value={formData.name} onChange={handleChange} required style={{ borderRadius: '10px', height: '44px' }} />
          </div>

          <div className="form-group span-2" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea name="description" className="form-input" rows={4} placeholder="Describe key property amenities, layout, and nearby hubs..." value={formData.description} onChange={handleChange} style={{ borderRadius: '10px', padding: '10px' }}></textarea>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Property Type</label>
            <select name="type" className="form-input" value={formData.type} onChange={handleChange} style={{ borderRadius: '10px', height: '44px' }}>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Plot">Plot</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Status</label>
            <select name="status" className="form-input" value={formData.status} onChange={handleChange} style={{ borderRadius: '10px', height: '44px' }}>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div className="form-group span-2" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Location / Address</label>
            <input type="text" name="location" className="form-input" placeholder="e.g. Race Course, Coimbatore" value={formData.location} onChange={handleChange} required style={{ borderRadius: '10px', height: '44px' }} />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Price (in Lakhs)</label>
            <input type="text" name="price" className="form-input" placeholder="e.g. 180" value={formData.price} onChange={handleChange} required style={{ borderRadius: '10px', height: '44px' }} />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Area Size (in Sq.Ft)</label>
            <input type="text" name="area" className="form-input" placeholder="e.g. 2400" value={formData.area} onChange={handleChange} required style={{ borderRadius: '10px', height: '44px' }} />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Beds</label>
            <input type="number" name="beds" className="form-input" placeholder="0" value={formData.beds} onChange={handleChange} style={{ borderRadius: '10px', height: '44px' }} />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Baths</label>
            <input type="number" name="baths" className="form-input" placeholder="0" value={formData.baths} onChange={handleChange} style={{ borderRadius: '10px', height: '44px' }} />
          </div>

          <div className="form-group span-2" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Google Maps Link</label>
            <input type="text" className="form-input" placeholder="https://maps.google.com/?q=..." value={mapLink} onChange={(e) => setMapLink(e.target.value)} style={{ borderRadius: '10px', height: '44px' }} />
          </div>

          {/* Premium Multi Image Uploader Dropzone */}
          <div className="form-group span-2" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '10px' }}>Property Photos</label>
            <PremiumUploader images={images} onChange={setImages} />
          </div>

        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/properties')} style={{ borderRadius: '10px', height: '44px', fontWeight: 700 }}>Cancel</button>
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '10px', height: '44px', fontWeight: 800, background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)', border: 'none', color: '#fff', padding: '0 2rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>Save Property</button>
        </div>
      </form>
    </div>
  );
}
