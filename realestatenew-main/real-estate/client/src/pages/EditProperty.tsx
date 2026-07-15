import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PremiumUploader from '../components/PremiumUploader';

export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.5:5000/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.title || data.name || '',
            description: data.description || '',
            type: data.type || 'Villa',
            status: data.status || 'Available',
            location: data.location || '',
            price: data.price || '',
            area: data.size || data.area || '',
            beds: String(data.beds || 0),
            baths: String(data.baths || 0)
          });
          setMapLink(data.mapLink || '');
          setImages(data.images ? data.images.map((img: any) => img.url) : []);
        } else {
          alert('Property not found.');
          navigate('/admin/properties');
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
        alert('Error loading property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, navigate]);

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
      const response = await fetch(`http://192.168.1.5:5000/api/properties/${id}`, {
        method: 'PUT',
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
        alert('Property updated successfully!');
        navigate('/admin/properties');
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || 'Server error updating property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      setErrorMsg('Network error while saving changes.');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>Loading property details...</div>;
  }

  return (
    <div style={{ fontFamily: 'Poppins, Inter, sans-serif', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Edit Property</h1>
        <p style={{ color: '#64748B', fontSize: '0.82rem', marginTop: 4 }}>Dashboard / Properties / Edit</p>
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
            <input type="text" name="name" className="form-input" placeholder="Enter property name" value={formData.name} onChange={handleChange} required style={{ borderRadius: '10px', height: '44px' }} />
          </div>

          <div className="form-group span-2" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea name="description" className="form-input" rows={4} placeholder="Enter description" value={formData.description} onChange={handleChange} style={{ borderRadius: '10px', padding: '10px' }}></textarea>
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
            <input type="text" name="location" className="form-input" placeholder="Enter location" value={formData.location} onChange={handleChange} required style={{ borderRadius: '10px', height: '44px' }} />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Price (in Lakhs)</label>
            <input type="text" name="price" className="form-input" placeholder="Enter price" value={formData.price} onChange={handleChange} required style={{ borderRadius: '10px', height: '44px' }} />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>Area Size (in Sq.Ft)</label>
            <input type="text" name="area" className="form-input" placeholder="Enter area" value={formData.area} onChange={handleChange} required style={{ borderRadius: '10px', height: '44px' }} />
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
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '10px', height: '44px', fontWeight: 800, background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)', border: 'none', color: '#fff', padding: '0 2rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>Save Changes</button>
        </div>
      </form>
    </div>
  );
}
