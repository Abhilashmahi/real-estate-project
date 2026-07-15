import React from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      icon: '🏗️',
      title: 'Plots & Layout Development',
      description: 'We develop fully gated residential communities with tar roads, electricity grid layouts, boundary walls, and central park space. All plots are approved by local planning bodies.',
      features: ['DTCP / Panchayat approvals', '100% legal title clearance certificates', 'Tar roads and sweet water connection setups']
    },
    {
      icon: '🏡',
      title: 'Residential Villa Construction',
      description: 'Choose a plot and build your dream home with our partner architects and civil construction engineers. We build using certified materials and premium designs.',
      features: ['Architectural design selection', 'Turnkey construction coordination', '1-year structural maintenance guarantee']
    },
    {
      icon: '🔑',
      title: 'Legal Clearance & Documentation Support',
      description: 'We coordinate parent document tracing, patta application transfers, encumbrance check certificates, and land registration processes with the sub-registrar desk.',
      features: ['Parent deed verification', 'EC trace reports up to 30 years', 'Registration desk slots coordination']
    },
    {
      icon: '📅',
      title: 'Guided Site Coordination & Consultations',
      description: 'Schedule a free visit and get guided insights on property appreciation rates, development potential, and loan booking support through leading banks.',
      features: ['Free pick-up and drop coordination', 'Pre-approved banking loans guidance', 'Custom plots measurement layout prints']
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem', fontFamily: 'Poppins, sans-serif' }}>
      
      {/* Header */}
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
          <div style={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Core Specialities</div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: '0.35rem' }}>Our Professional Services</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Comprehensive real estate solutions designed for luxury investments.</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="prop-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {services.map((srv, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #E5E7EB',
              borderRadius: '16px',
              padding: '2.25rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              transition: 'all 0.25s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(29,78,216,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)'; }}
          >
            <div style={{ fontSize: '3rem', margin: 0 }}>{srv.icon}</div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>{srv.title}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{srv.description}</p>
            </div>
            
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: 0, margin: '0.5rem 0 0', listStyle: 'none' }}>
              {srv.features.map((feat, fidx) => (
                <li key={fidx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#475569' }}>
                  <span style={{ color: '#1D4ED8', fontWeight: 'bold' }}>✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Callout */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: '16px',
        padding: '2.5rem',
        textAlign: 'center',
        color: '#ffffff',
        border: '1px solid rgba(29,78,216,0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>Have a custom project requirement in mind?</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '#0.95rem', maxWidth: '600px', margin: 0 }}>
          Our consultants can design custom villas, arrange plot combinations, or structure large-scale agricultural acquisitions.
        </p>
        <Link to="/contact" style={{
          display: 'inline-flex',
          padding: '0.75rem 1.75rem',
          background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: 700,
          textDecoration: 'none',
          fontSize: '0.9rem',
          boxShadow: '0 4px 16px rgba(29,78,216,0.3)',
          marginTop: '0.5rem'
        }}>
          Get Consultation
        </Link>
      </div>

    </div>
  );
}
