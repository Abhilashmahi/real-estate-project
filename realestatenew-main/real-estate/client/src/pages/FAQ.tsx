import React, { useState } from 'react';

const faqData = [
  {
    category: 'Buying & Layouts',
    items: [
      { q: 'Are all properties legally cleared and verified?', a: 'Yes. Vishnu Realtors operates on a 100% legal title guarantee. All plot layout properties are fully approved by government boards (DTCP/RERA where applicable), with direct title documents and clearance certificates available for customer inspection.' },
      { q: 'Can I book a site visit online?', a: 'Absolutely. Log into your Customer Portal dashboard, or use the Schedule Site Visit booking form on any property details page. Site visits are 100% free, and we provide coordinate pick-up and drop-off guidance.' },
      { q: 'What types of properties do you offer?', a: 'We specialize in NA-approved residential plots, agricultural lands for investment projects, modern luxury villas, and premium apartments around Coimbatore and high-growth corridors.' }
    ]
  },
  {
    category: 'Portal & Account',
    items: [
      { q: 'How can I save properties to view later?', a: 'By clicking the heart (Wishlist) icon on any property listing or details page, the property is automatically saved to your Customer Wishlist page. You can access it anytime from your dashboard.' },
      { q: 'What is the "Follow-ups" section for?', a: 'Our team schedules follow-ups to coordinate visits, answer documentation queries, and assist in legal registrations. You can view pending updates directly in the customer panel.' }
    ]
  },
  {
    category: 'Pricing & Registration',
    items: [
      { q: 'Do you charge brokerage fees?', a: 'No, Vishnu Realtors believes in 100% transparent dealing. When you buy directly from our listed layout and construction projects, there are no hidden agent commissions or brokerage charges.' },
      { q: 'What is the layout booking process?', a: 'Choose your desired plot or villa, submit an enquiry, book a site visit, verify document titles with our legal desk, pay the block registration advance, and select your registration date.' }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const toggleExpand = (catIndex: number, itemIndex: number) => {
    const key = `${catIndex}-${itemIndex}`;
    setExpandedIndex(expandedIndex === key ? null : key);
  };

  const categories = ['All', 'Buying & Layouts', 'Portal & Account', 'Pricing & Registration'];

  const filteredFaqs = faqData.filter(cat => activeCategory === 'All' || cat.category === activeCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem', fontFamily: 'Poppins, sans-serif' }}>
      
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
          <div style={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Support Center</div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', marginBottom: '0.35rem' }}>Frequently Asked Questions</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Everything you need to know about properties, layouts, and buying guide.</p>
        </div>
      </div>

      {/* Categories & Search Grid */}
      <div style={{ 
        display: 'flex', 
        gap: '1.25rem', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: '#ffffff',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        {/* Categories Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setExpandedIndex(null); }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: activeCategory === cat ? '1px solid #1D4ED8' : '1px solid #E5E7EB',
                background: activeCategory === cat ? 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)' : '#fff',
                color: activeCategory === cat ? '#ffffff' : '#475569',
                fontWeight: activeCategory === cat ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 1rem 0 2.25rem',
              fontSize: '0.85rem',
              border: '1.5px solid #E5E7EB',
              borderRadius: '8px',
              outline: 'none'
            }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Accordions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filteredFaqs.map((cat, catIdx) => {
          const items = cat.items.filter(item => 
            item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.a.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (items.length === 0) return null;

          return (
            <div key={catIdx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', color: '#0F172A', borderLeft: '3px solid #1D4ED8', paddingLeft: '0.75rem', fontWeight: 700 }}>
                {cat.category}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((item, itemIdx) => {
                  const isExpanded = expandedIndex === `${catIdx}-${itemIdx}`;
                  return (
                    <div
                      key={itemIdx}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        transition: 'all 0.25s',
                        boxShadow: isExpanded ? '0 8px 24px rgba(29,78,216,0.06)' : '0 1px 3px rgba(0,0,0,0.02)'
                      }}
                    >
                      <button
                        onClick={() => toggleExpand(catIdx, itemIdx)}
                        style={{
                          width: '100%',
                          padding: '1.25rem',
                          background: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          fontWeight: 600,
                          color: '#0F172A',
                          fontSize: '0.925rem',
                          fontFamily: 'inherit'
                        }}
                      >
                        <span>{item.q}</span>
                        <span style={{ color: '#1D4ED8', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                        </span>
                      </button>
                      
                      <div style={{
                        maxHeight: isExpanded ? '300px' : '0',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        borderTop: isExpanded ? '1px solid #E5E7EB' : '1px solid transparent'
                      }}>
                        <p style={{ padding: '1.25rem', margin: 0, color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
