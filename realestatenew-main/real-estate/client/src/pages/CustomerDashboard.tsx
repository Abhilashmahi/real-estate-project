import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const [counts, setCounts] = useState({ enquiries: 0, wishlist: 0, siteVisits: 0 });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [featuredProps, setFeaturedProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CU';

  const getStatusColor = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      New:         { bg: 'rgba(29,78,216,0.12)',  color: '#1D4ED8' },
      Contacted:   { bg: 'rgba(16,185,129,0.12)',  color: '#10B981' },
      'Follow-up': { bg: 'rgba(245,158,11,0.12)',  color: '#F59E0B' },
      Closed:      { bg: 'rgba(107,114,128,0.12)',color: '#6B7280' },
    };
    return map[status] || { bg: '#F1F5F9', color: '#6B7280' };
  };

  useEffect(() => {
    const headers = { 'Authorization': `Bearer ${token}` };
    Promise.all([
      fetch('https://real-estate-backend-9qqo.onrender.com/api/enquiries', { headers }).then(r => r.ok ? r.json() : []),
      fetch('https://real-estate-backend-9qqo.onrender.com/api/wishlist',  { headers }).then(r => r.ok ? r.json() : []),
      fetch('https://real-estate-backend-9qqo.onrender.com/api/site-visits', { headers }).then(r => r.ok ? r.json() : []),
      fetch('https://real-estate-backend-9qqo.onrender.com/api/properties').then(r => r.ok ? r.json() : []),
    ]).then(([enqs, wish, visits, props]) => {
      setCounts({ enquiries: enqs.length, wishlist: wish.length, siteVisits: visits.length });
      setRecentEnquiries(enqs.slice(0, 4));
      setFeaturedProps(props.slice(0, 3));
    }).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#1D4ED8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'Poppins, sans-serif' }}>

      {/* Welcome Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
        borderRadius: '16px', 
        padding: '2rem 2.25rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1.5rem', 
        position: 'relative', 
        overflow: 'hidden',
        border: '1px solid rgba(29,78,216,0.15)'
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'rgba(29,78,216,0.05)', borderRadius: '50%' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: '#60A5FA', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Customer Portal</div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.25rem', margin: 0 }}>
            Welcome back, {user.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Here is your real estate investment activity overview.</p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#FFFFFF', border: '3px solid rgba(255,255,255,0.1)' }}>
            {getInitials(user.name)}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>{user.email}</div>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'My Enquiries', value: counts.enquiries, color: '#1D4ED8', bg: 'rgba(29,78,216,0.05)', link: '/customer/enquiries', emoji: '💬' },
          { label: 'Saved Wishlist', value: counts.wishlist, color: '#EF4444', bg: 'rgba(239,68,68,0.05)', link: '/customer/wishlist', emoji: '❤️' },
          { label: 'Site Visits', value: counts.siteVisits, color: '#10B981', bg: 'rgba(16,185,129,0.05)', link: '/customer/site-visits', emoji: '📅' },
        ].map((stat, i) => (
          <Link key={i} to={stat.link} style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: '#fff', 
              border: '1px solid #E5E7EB', 
              borderRadius: '16px', 
              padding: '1.5rem', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)', 
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(29,78,216,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'; }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{stat.emoji}</div>
              <div style={{ color: '#6B7280', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              <div style={{ color: stat.color, fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.15 }}>{stat.value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0F172A', margin: '0 0 1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { to: '/public-properties', label: 'Browse Layouts', style: { background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', color: '#FFFFFF', border: 'none' } },
            { to: '/customer/wishlist',  label: '❤️ My Wishlist', style: { background: '#F8FAFC', border: '1.5px solid #1D4ED8', color: '#1D4ED8' } },
            { to: '/customer/enquiries', label: '💬 My Enquiries', style: { background: '#F8FAFC', border: '1.5px solid #1D4ED8', color: '#1D4ED8' } },
            { to: '/customer/profile',   label: '👤 Edit Profile', style: { background: '#F8FAFC', border: '1.5px solid #1D4ED8', color: '#1D4ED8' } },
          ].map(btn => (
            <Link key={btn.to} to={btn.to} style={{ display: 'inline-flex', alignItems: 'center', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.18s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', ...btn.style }}>
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Widgets split grid */}
      <div className="customer-dash-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Recent Enquiries widget */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Recent Enquiries</h2>
            <Link to="/customer/enquiries" style={{ fontSize: '0.78rem', color: '#1D4ED8', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentEnquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1.5rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                <p style={{ margin: 0 }}>No enquiries yet. <Link to="/public-properties" style={{ color: '#1D4ED8', fontWeight: 600 }}>Explore layouts</Link> to start.</p>
              </div>
            ) : recentEnquiries.map(enq => {
              const sc = getStatusColor(enq.status);
              return (
                <div key={enq.id} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A' }}>{enq.propertyName || 'General Enquiry'}</span>
                    <div style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '0.2rem' }}>{enq.createdAt ? new Date(enq.createdAt).toLocaleDateString('en-IN') : ''}</div>
                  </div>
                  <span style={{ background: sc.bg, color: sc.color, padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{enq.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Properties widget */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Recommended Layouts</h2>
            <Link to="/public-properties" style={{ fontSize: '0.78rem', color: '#1D4ED8', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {featuredProps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1.5rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏠</div>
                <p style={{ margin: 0 }}>No layouts available yet.</p>
              </div>
            ) : featuredProps.map(prop => {
              const cover = prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&auto=format&fit=crop&q=60';
              return (
                <Link key={prop.id} to={`/properties/${prop.id}`} style={{ display: 'flex', gap: '0.85rem', padding: '0.75rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E5E7EB', textDecoration: 'none', transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; }}>
                  <img src={cover} alt={prop.title} style={{ width: '68px', height: '56px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}/>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prop.title}</div>
                    <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '0.15rem' }}>📍 {prop.location}</div>
                    <div style={{ color: '#1D4ED8', fontWeight: 700, fontSize: '0.82rem', marginTop: '0.15rem' }}>₹{prop.price}L</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
