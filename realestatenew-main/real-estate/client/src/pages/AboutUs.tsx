import React from 'react';

export default function AboutUs() {
  const testimonials = [
    { name: 'Karthikeyan S.', role: 'Plot Buyer', text: 'Bought a residential plot with Vishnu Realtors. Seamless documentation verification, helpful customer support, and direct transparent dealing. Highly recommended!' },
    { name: 'Anjali Sharma', role: 'Home Owner', text: 'Excellent construction quality and prompt response for site visits. They guided me through the entire loan registration process.' },
    { name: 'Ramanathan M.', role: 'Investor', text: 'Vishnu Real Estate provides premium investment lands with massive appreciation. Their smart investment insights helped me make the right decision.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>About Vishnu Real Estate</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Know more about our team, mission, and client satisfaction.</p>
      </div>

      <div className="prop-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>Smart Real Estate Investment</h2>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Vishnu Real Estate is a leading property development and real estate agency based in Coimbatore, Tamil Nadu. Over the years, we have built a reputation for trust, transparent dealing, and premium development quality.
          </p>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Our specialties range from gated community plot layouts to premium residential house building and agricultural land investments. We ensure all our properties carry legal title clearance certificates and are located in high-growth corridors.
          </p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>10+</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Years Experience</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>1500+</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Happy Clients</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>12+</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Completed Projects</p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#0c1e35',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <h3 style={{ color: '#ffffff', fontSize: '1.35rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>Our Core Pillars</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', listStyle: 'none' }}>
            <li style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✓</span>
              <div>
                <strong>Legal Clearances:</strong> All layouts are legally approved by planning boards.
              </div>
            </li>
            <li style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✓</span>
              <div>
                <strong>High Growth Locations:</strong> All projects situated near upcoming arterial roads, IT spaces, and universities.
              </div>
            </li>
            <li style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✓</span>
              <div>
                <strong>Customer First Approach:</strong> Seamless booking, registration support, and site coordination.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Testimonials */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem' }}>Client Testimonials</h2>
          <p style={{ color: 'var(--text-secondary)' }}>See what our buyers say about Vishnu Realtors.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{t.text}"
              </p>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: 'auto' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{t.name}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company Contact Details */}
      <section style={{ 
        backgroundColor: '#FFFFFF', 
        border: '1px solid #E2E8F0', 
        borderRadius: '16px', 
        padding: '2.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        marginTop: '2rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Registered Office & Contact</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Reach out directly to the Vishnu Realtors executive team for property layout acquisitions or investment consulting.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Office Address</span>
            <a href="https://maps.app.goo.gl/54NNaEX8putfCvgg7" target="_blank" rel="noreferrer" style={{ fontSize: '0.925rem', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
              Coimbatore, Tamil Nadu (View on Google Maps)
            </a>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Phone Number</span>
            <a href="tel:+919344912355" style={{ fontSize: '0.925rem', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
              +91 93449 12355
            </a>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</span>
            <a href="mailto:vishnurealtors15@gmail.com" style={{ fontSize: '0.925rem', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
              vishnurealtors15@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
