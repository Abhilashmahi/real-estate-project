import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PublicProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [type, setType] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      if (location) params.set('location', location);
      if (type !== 'All') params.set('type', type);
      if (maxPrice) params.set('maxPrice', maxPrice);
      const res = await fetch(`https://real-estate-backend-9qqo.onrender.com/api/properties?${params}`);
      if (res.ok) setProperties(await res.json());
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const fetchWishlist = async () => {
    if (!token || user?.role !== 'customer') return;
    try {
      const res = await fetch('https://real-estate-backend-9qqo.onrender.com/api/wishlist', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setWishlistIds(data.map((i: any) => i.propertyId || i.id));
      }
    } catch { /* silent */ }
  };

  useEffect(() => { fetchProperties(); }, [location, type, maxPrice]);
  useEffect(() => { fetchWishlist(); }, []);

  const handleToggleWishlist = async (e: React.MouseEvent, propertyId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token || user?.role !== 'customer') {
      navigate('/customer/login', { state: { message: 'Please login to save properties to your wishlist.' } });
      return;
    }
    const isFav = wishlistIds.includes(propertyId);
    try {
      if (isFav) {
        const r = await fetch(`https://real-estate-backend-9qqo.onrender.com/api/wishlist/${propertyId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (r.ok) setWishlistIds(prev => prev.filter(id => id !== propertyId));
      } else {
        const r = await fetch('https://real-estate-backend-9qqo.onrender.com/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ propertyId }) });
        if (r.ok) setWishlistIds(prev => [...prev, propertyId]);
      }
    } catch { /* silent */ }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#1D4ED8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Loading verified listings...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem', fontFamily: 'Poppins, sans-serif' }}>

      {/* Page Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
        borderRadius: '16px', 
        padding: '2.5rem 2rem', 
        position: 'relative', 
        overflow: 'hidden',
        border: '1px solid rgba(29,78,216,0.15)'
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'rgba(29,78,216,0.05)', borderRadius: '50%' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Premium Catalog</div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: '0.35rem' }}>Available Properties</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            {properties.length > 0 ? `${properties.length} luxury developments found near Coimbatore corridor.` : 'Find your next premium investment layout.'}
          </p>
        </div>
      </div>

      {/* Modern Blue Filter Bar */}
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '16px', 
        border: '1px solid #E5E7EB', 
        padding: '1.75rem', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              📍 Location
            </label>
            <input 
              type="text" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="e.g. Coimbatore, Ooty"
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: '1.5px solid #E5E7EB', 
                borderRadius: '10px', 
                fontSize: '0.875rem', 
                fontFamily: 'inherit', 
                outline: 'none', 
                transition: 'all 0.18s' 
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              🏗️ Property Type
            </label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: '1.5px solid #E5E7EB', 
                borderRadius: '10px', 
                fontSize: '0.875rem', 
                fontFamily: 'inherit', 
                outline: 'none', 
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Types</option>
              <option value="Plot">Plot</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
              <option value="Land">Land</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              💰 Max Price (Lakhs)
            </label>
            <input 
              type="number" 
              value={maxPrice} 
              onChange={e => setMaxPrice(e.target.value)} 
              placeholder="e.g. 50"
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: '1.5px solid #E5E7EB', 
                borderRadius: '10px', 
                fontSize: '0.875rem', 
                fontFamily: 'inherit', 
                outline: 'none', 
                transition: 'all 0.18s' 
              }}
            />
          </div>
          {(location || type !== 'All' || maxPrice) && (
            <div>
              <button 
                onClick={() => { setLocation(''); setType('All'); setMaxPrice(''); }}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  background: '#F1F5F9', 
                  border: '1.5px solid #E5E7EB', 
                  borderRadius: '10px', 
                  fontSize: '0.875rem', 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  color: '#475569', 
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Property Grid */}
      {properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🏠</div>
          <h3 style={{ color: '#0F172A', marginBottom: '0.5rem', fontWeight: 800 }}>No Properties Found</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>Try adjusting your search criteria to find layouts.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
          {properties.map(item => {
            const isFav = wishlistIds.includes(item.id);
            const isAvailable = item.status !== 'Sold';
            const rawImg = item.images?.[0]?.url || '';
            const coverImage = rawImg
              ? (rawImg.startsWith('http') ? rawImg : `https://real-estate-backend-9qqo.onrender.com/${rawImg}`)
              : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60';
            return (
              <div key={item.id} style={{
                background: '#fff', borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB',
                display: 'flex', flexDirection: 'column', position: 'relative',
                transition: 'all 0.25s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)'; }}
              >
                {/* Visual Image container */}
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img src={coverImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                  />
                  {/* Status badge */}
                  <div style={{ 
                    position: 'absolute', top: '0.85rem', left: '0.85rem', 
                    background: isAvailable ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#EF4444', 
                    color: '#fff', padding: '0.3rem 0.75rem', borderRadius: '999px', 
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' 
                  }}>
                    {isAvailable ? '● Available' : '● Sold'}
                  </div>
                  {/* Wishlist Button */}
                  <button 
                    onClick={e => handleToggleWishlist(e, item.id)} 
                    style={{ 
                      position: 'absolute', top: '0.85rem', right: '0.85rem', 
                      background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', 
                      width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.18s' 
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill={isFav ? '#EF4444' : 'none'} stroke={isFav ? '#EF4444' : '#475569'} strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  </button>
                  {/* Blue Type tag */}
                  <div style={{ 
                    position: 'absolute', bottom: '0.85rem', left: '0.85rem', 
                    background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(6px)', 
                    color: '#93C5FD', padding: '0.3rem 0.75rem', borderRadius: '6px', 
                    fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', 
                    letterSpacing: '0.05em', border: '1px solid rgba(29,78,216,0.2)' 
                  }}>
                    {item.type}
                  </div>
                </div>

                {/* Details list */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.35, flex: 1, paddingRight: '0.5rem', margin: 0 }}>{item.title}</h3>
                    <div style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', padding: '0.3rem 0.75rem', borderRadius: '6px', flexShrink: 0 }}>
                      <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.95rem' }}>₹{item.price}L</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6B7280', fontSize: '0.85rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {item.location}
                  </div>

                  <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.82rem', color: '#475569', borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem', flexWrap: 'wrap' }}>
                    <span>📐 {item.size} Sq.Ft</span>
                    {item.beds > 0 && <span>🛏 {item.beds} Beds</span>}
                    {item.baths > 0 && <span>🚿 {item.baths} Baths</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <Link to={`/properties/${item.id}`} style={{
                      flex: 1, padding: '0.65rem', textAlign: 'center', background: '#F8FAFC', border: '1.5px solid #E5E7EB',
                      borderRadius: '8px', color: '#0F172A', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
                      transition: 'all 0.18s',
                    }}>View Details</Link>
                    <Link to={`/properties/${item.id}#enquire`} style={{
                      flex: 1, padding: '0.65rem', textAlign: 'center',
                      background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                      borderRadius: '8px', color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(29,78,216,0.25)',
                      transition: 'all 0.18s',
                    }}>Enquire Now</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
