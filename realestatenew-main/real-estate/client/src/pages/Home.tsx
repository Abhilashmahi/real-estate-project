import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const companyPhone = localStorage.getItem('companyPhone') || '+91 93449 12355';
  const companyTagline = localStorage.getItem('companyTagline') || 'Smart Real Estate Investment';
  const [propCount, setPropCount] = useState<number | null>(null);
  const [searchLoc, setSearchLoc] = useState('');
  const [searchType, setSearchType] = useState('All');

  useEffect(() => {
    fetch('https://real-estate-backend-9qqo.onrender.com/api/properties')
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) => setPropCount(data.length))
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLoc) params.set('location', searchLoc);
    if (searchType !== 'All') params.set('type', searchType);
    navigate(`/public-properties?${params.toString()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Poppins, sans-serif' }}>

      {/* ── Enterprise Hero Section ── */}
      <section style={{
        minHeight: '85vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 70%, #0F172A 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: '-64px',
        paddingTop: '64px',
      }}>
        {/* Background Visual Patterns */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle at 10% 40%, rgba(29,78,216,0.08) 0%, transparent 60%),
                            radial-gradient(circle at 90% 10%, rgba(37,99,235,0.12) 0%, transparent 50%)`,
        }}/>
        
        {/* Enterprise Blue Side Trim line */}
        <div style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: '5px', height: '240px',
          background: 'linear-gradient(180deg, transparent, #1D4ED8, transparent)',
          borderRadius: '10px',
        }}/>

        <div className="page-wrapper" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '720px' }}>
            
            {/* Enterprise Tag */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: 'rgba(29,78,216,0.08)',
              border: '1px solid rgba(29,78,216,0.25)',
              borderRadius: '999px',
              padding: '0.4rem 1.25rem',
              marginBottom: '1.75rem',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1D4ED8', boxShadow: '0 0 8px #1D4ED8' }}/>
              <span style={{ color: '#93C5FD', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Vishnu Realtors — Premium Gated Communities
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              {companyTagline}<br/>
              <span style={{ background: 'linear-gradient(135deg, #60A5FA, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Made Simple & Secure.
              </span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '580px' }}>
              Explore certified layout plots, architectural residential developments, and high-appreciation land assets across Coimbatore with guaranteed clean title deeds.
            </p>

            {/* Premium Glassmorphic Search Bar */}
            <form onSubmit={handleSearchSubmit} style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '0.85rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginBottom: '3rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}>
              <div style={{ flex: 1, minWidth: '160px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="📍 Preferred location (Coimbatore...)"
                  value={searchLoc}
                  onChange={(e) => setSearchLoc(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.875rem',
                    padding: '0.5rem'
                  }}
                />
              </div>
              <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} className="hide-mobile" />
              <div style={{ minWidth: '130px' }}>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#60A5FA',
                    fontWeight: 600,
                    outline: 'none',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  <option value="All" style={{ background: '#0F172A', color: '#fff' }}>All Types</option>
                  <option value="Plot" style={{ background: '#0F172A', color: '#fff' }}>Plot</option>
                  <option value="Villa" style={{ background: '#0F172A', color: '#fff' }}>Villa</option>
                  <option value="Apartment" style={{ background: '#0F172A', color: '#fff' }}>Apartment</option>
                </select>
              </div>
              <button type="submit" style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(29,78,216,0.35)',
                fontFamily: 'inherit',
                fontSize: '0.85rem'
              }}>
                Search
              </button>
            </form>

            {/* Quick Stats list */}
            {propCount !== null && (
              <div className="hero-stats-row" style={{ display: 'flex', gap: '2.5rem', marginBottom: '1.5rem' }}>
                {[
                  { value: propCount, label: 'Verified Plots Listed' },
                  { value: '100%', label: 'Clear legal titles' },
                  { value: '10+', label: 'Years CRM excellence' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ color: '#60A5FA', fontWeight: 800, fontSize: '1.85rem' }}>{s.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ── Why Choose Us Pillars ── */}
      <section className="page-wrapper" style={{ background: '#ffffff', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ color: '#1D4ED8', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Why Choose Us</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>Our Trust, Clearance, & Quality Pillars</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'DTCP & Panchayat Approvals', desc: 'Every layout has fully certified approvals from local planning boards before public launch.', icon: '📜' },
              { title: '30-Year Clean Title History', desc: 'Every parent document is pre-screened by our expert legal desk to guarantee clear transfers.', icon: '⚖️' },
              { title: 'Premium Road Infrastructures', desc: 'Communities are constructed with wider asphalt layout roads, electrical feeds, and water lines.', icon: '🛣️' },
              { title: 'Direct Dealings Guarantee', desc: 'We do not host middle-man agents. Deal directly with our booking desk for transparent prices.', icon: '🤝' }
            ].map((col, idx) => (
              <div key={idx} style={{
                background: '#F8FAFC',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '2rem 1.5rem',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '2rem' }}>{col.icon}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{col.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="page-wrapper" style={{ background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
            <div>
              <span style={{ color: '#1D4ED8', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Professional Offerings</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>Luxury Services Tailored For You</h2>
            </div>
            <Link to="/services" style={{
              color: '#1D4ED8', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
            }}>
              View All Services →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'Plots layout promotion', desc: 'Secure high-appreciation NA plots with layout tar roads.', emoji: '🏗️' },
              { title: 'Residential builders', desc: 'Custom construction of structural villas and homes.', emoji: '🏡' },
              { title: 'EC & patta transfers', desc: 'Parent tracing and registration slots booking support.', emoji: '🔑' },
            ].map((item, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '2rem' }}>{item.emoji}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{item.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '#0.85rem', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="page-wrapper" style={{ background: '#ffffff', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ color: '#1D4ED8', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Client Voices</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.35rem' }}>What Gated Layout Buyers Say</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { name: 'Karthikeyan S.', role: 'Plot Buyer', text: 'Bought a residential plot with Vishnu Realtors. Seamless documentation verification, helpful customer support, and direct transparent dealing. Highly recommended!' },
              { name: 'Anjali Sharma', role: 'Home Owner', text: 'Excellent construction quality and prompt response for site visits. They guided me through the entire loan registration process.' }
            ].map((t, i) => (
              <div key={i} style={{
                backgroundColor: '#ffffff',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '2rem 1.5rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ color: '#1D4ED8', fontSize: '1.25rem' }}>★★★★★</div>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
                  "{t.text}"
                </p>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem', marginTop: 'auto' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>{t.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enterprise CTA & Visit Booking Banner ── */}
      <section className="page-wrapper" style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 90% 50%, rgba(29,78,216,0.06), transparent 60%)' }}/>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              Book Your Free Guided Site Visit
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.925rem', margin: 0 }}>
              Our booking desk coordinates round-trip pick up and layout blueprints guidance.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={`tel:${companyPhone}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.8rem 1.5rem',
              background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
              color: '#FFFFFF', fontWeight: 700, fontSize: '0.875rem',
              borderRadius: '8px', textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(29,78,216,0.3)',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.13 12.6 19.79 19.79 0 012.06 4.11 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              {companyPhone}
            </a>
            <Link to="/customer/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.8rem 1.5rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              color: '#fff', fontWeight: 600, fontSize: '0.875rem',
              borderRadius: '8px', textDecoration: 'none',
            }}>Book Site Visit</Link>
          </div>
        </div>
      </section>

      {/* ── Modern Premium Footer ── */}
      <footer style={{ background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '4rem 1.5rem 2rem', color: 'rgba(255,255,255,0.6)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              </div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Outfit,sans-serif' }}>Vishnu Realtors</span>
            </div>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              Premium layout layouts, agricultural holdings appreciation consultancies, and villa construction services since 2016.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li><Link to="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Our Services</Link></li>
              <li><Link to="/public-properties" style={{ color: 'inherit', textDecoration: 'none' }}>Property Listings</Link></li>
              <li><Link to="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ Guide</Link></li>
              <li><Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Support Desk</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <li>Email: <a href="mailto:vishnurealtors15@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>vishnurealtors15@gmail.com</a></li>
              <li>Hotline: <a href="tel:+919344912355" style={{ color: 'inherit', textDecoration: 'none' }}>+91 93449 12355</a></li>
              <li>Office: <a href="https://maps.app.goo.gl/54NNaEX8putfCvgg7" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>View Office on Google Maps</a></li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
          <span>© 2026 Vishnu Realtors. All rights reserved. RERA Registered.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/admin/login" style={{ color: 'inherit', textDecoration: 'underline' }}>CRM Admin Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
