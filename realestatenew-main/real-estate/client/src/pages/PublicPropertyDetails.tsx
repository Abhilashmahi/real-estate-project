import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PublicPropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');

  // Form states
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [visitDate, setVisitDate] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`https://real-estate-backend-9qqo.onrender.com/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        } else {
          alert('Property not found.');
          navigate('/public-properties');
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || user?.role !== 'customer') {
      alert('Please login to send an enquiry.');
      navigate('/customer/login');
      return;
    }
    try {
      const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property.id,
          property: property.title,
          notes: enquiryNotes
        })
      });
      if (response.ok) {
        alert('Your enquiry has been submitted successfully!');
        setEnquiryNotes('');
      } else {
        alert('Failed to send enquiry.');
      }
    } catch (error) {
      console.error('Error sending enquiry:', error);
    }
  };

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || user?.role !== 'customer') {
      alert('Please login to book a site visit.');
      navigate('/customer/login');
      return;
    }
    try {
      const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/site-visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property.id,
          visitDate
        })
      });
      if (response.ok) {
        alert('Site visit request booked successfully! We will contact you to confirm.');
        setVisitDate('');
      } else {
        alert('Failed to book site visit.');
      }
    } catch (error) {
      console.error('Error booking site visit:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#1D4ED8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Loading property details...</span>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images.map((img: any) => img.url.startsWith('http') ? img.url : `https://real-estate-backend-9qqo.onrender.com/${img.url}`)
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60'];

  const amenities = [
    { name: 'Water Grid Supply', icon: '💧' },
    { name: 'Gated Layout Arch', icon: '⛩️' },
    { name: 'Street Lights Layout', icon: '💡' },
    { name: 'Tar Layout Road 30 Feet', icon: '🛣️' },
    { name: 'Rain Water Drain Channels', icon: '🌧️' },
    { name: 'Children Layout Park space', icon: '🌳' }
  ];

  const nearbyPlaces = [
    { name: 'National Corridor Highway', distance: '3 mins drive' },
    { name: 'Arts & Science University', distance: '5 mins drive' },
    { name: 'Velandipalayam Sub-Registrar Office', distance: '8 mins drive' },
    { name: 'Multi-Speciality Hospital', distance: '10 mins drive' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem', fontFamily: 'Poppins, sans-serif' }}>
      
      {/* Property Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              background: 'rgba(29,78,216,0.08)',
              border: '1px solid rgba(29,78,216,0.25)',
              color: '#1D4ED8',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.3rem 0.75rem',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>{property.type}</span>
            <span style={{
              background: property.status === 'Available' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              border: property.status === 'Available' ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.25)',
              color: property.status === 'Available' ? '#10B981' : '#EF4444',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.3rem 0.75rem',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>{property.status}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{property.title}</h1>
          <p style={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {property.location}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price Range</span>
          <h2 style={{ fontSize: '2rem', color: '#1D4ED8', fontWeight: 800, margin: '0.2rem 0 0' }}>₹{property.price} Lakhs</h2>
        </div>
      </div>

      {/* Gallery & Sidebar layout */}
      <div className="prop-detail-grid" style={{ display: 'grid', gridTemplateColumns: '2.1fr 0.9fr', gap: '2.5rem', alignItems: 'flex-start' }}>
        
        {/* Left Side: Gallery and Tabs content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Main Large Image */}
          <div style={{ height: '440px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #E5E7EB' }}>
            <img src={images[activeImageIndex]} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {images.map((imgUrl: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: '90px',
                    height: '60px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: idx === activeImageIndex ? '2.5px solid #1D4ED8' : '1px solid #E5E7EB',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Luxury Tab Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', gap: '1.5rem', marginTop: '1rem' }}>
            {[
              { id: 'details', label: 'Property Details' },
              { id: 'amenities', label: 'Amenities' },
              { id: 'nearby', label: 'Nearby Places' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.75rem 0.25rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2.5px solid #1D4ED8' : '2.5px solid transparent',
                  color: activeTab === tab.id ? '#1D4ED8' : '#6B7280',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '0.925rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div style={{ minHeight: '180px' }}>
            {activeTab === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '1.25rem',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Property Area</span>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0' }}>{property.size} Sq.Ft</h4>
                  </div>
                  {property.beds > 0 && (
                    <div>
                      <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Layout design</span>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0' }}>{property.beds} BHK</h4>
                    </div>
                  )}
                  {property.baths > 0 && (
                    <div>
                      <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Bathrooms</span>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0' }}>{property.baths} Baths</h4>
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>CRM Registry</span>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0' }}>Approved</h4>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', marginTop: '0.5rem' }}>Description</h3>
                  <p style={{ lineHeight: 1.7, color: '#475569', fontSize: '0.925rem', margin: 0 }}>
                    {property.description || 'No description available for this layout.'}
                  </p>
                </div>

                {property.mapLink && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <a
                      href={property.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        background: '#0F172A',
                        color: '#93C5FD',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(29,78,216,0.2)'
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      Open Google Maps Location
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'amenities' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {amenities.map((am, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: '1.25rem' }}>{am.icon}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>{am.name}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'nearby' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {nearbyPlaces.map((pl, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>📍 {pl.name}</span>
                    <span style={{ fontSize: '0.82rem', color: '#1D4ED8', fontWeight: 700 }}>{pl.distance}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Enquiry & Site Visit scheduling forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Enquiry form card */}
          <form onSubmit={handleEnquirySubmit} style={{
            backgroundColor: '#ffffff',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>Send Enquiry</h3>
            <div className="form-group">
              <label className="form-label">Requirements / Message</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="I want to receive pricing details..."
                value={enquiryNotes}
                onChange={(e) => setEnquiryNotes(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(29,78,216,0.25)',
              fontFamily: 'inherit'
            }}>
              Submit Enquiry
            </button>
          </form>

          {/* Site Visit booking form card */}
          <form onSubmit={handleVisitSubmit} style={{
            backgroundColor: '#ffffff',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>Book Guided Visit</h3>
            <div className="form-group">
              <label className="form-label">Preferred Booking Date</label>
              <input
                type="date"
                className="form-input"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '8px',
              background: '#0F172A',
              color: '#93C5FD',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              border: '1px solid rgba(29,78,216,0.2)'
            }}>
              Confirm Booking
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
