import React, { useState, useEffect } from 'react';

export default function Reports() {
  const [fromDate, setFromDate] = useState('2024-05-01');
  const [toDate, setToDate] = useState('2024-05-31');
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    newCount: 0,
    contacted: 0,
    closed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/enquiries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setEnquiries(data);
          
          setStats({
            total: data.length,
            newCount: data.filter((e: any) => e.status === 'New' || e.status === 'new').length,
            contacted: data.filter((e: any) => e.status === 'Contacted' || e.status === 'contacted').length,
            closed: data.filter((e: any) => e.status === 'Closed' || e.status === 'closed').length,
            pending: data.filter((e: any) => e.status === 'Pending' || e.status === 'pending').length
          });
        }
      } catch (error) {
        console.error('Error fetching enquiries for report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading reports...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Reports</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Dashboard / Reports</p>
        </div>
      </div>

      {/* Date Filter Row */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'flex-end', 
        backgroundColor: '#ffffff', 
        padding: '1rem', 
        borderRadius: '8px', 
        border: '1px solid #e2e8f0',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '150px' }}>
          <label className="form-label">From Date</label>
          <input type="date" className="form-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div style={{ flex: '1', minWidth: '150px' }}>
          <label className="form-label">To Date</label>
          <input type="date" className="form-input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          Filter
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Total Enquiries</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: '#0f172a' }}>{stats.total}</h2>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>New Enquiries</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: '#0f172a' }}>{stats.newCount}</h2>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Contacted</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: '#0f172a' }}>{stats.contacted}</h2>
        </div>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Closed Deals</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.25rem', color: '#0f172a' }}>{stats.closed}</h2>
        </div>
      </div>

      {/* Charts Section */}
      <div className="prop-detail-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Line Chart */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Enquiries Overview</h3>
          <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 500 200" width="100%" height="100%">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />
              
              {/* Labels y-axis */}
              <text x="15" y="25" fill="#94a3b8" fontSize="10" textAnchor="middle">120</text>
              <text x="15" y="65" fill="#94a3b8" fontSize="10" textAnchor="middle">80</text>
              <text x="15" y="105" fill="#94a3b8" fontSize="10" textAnchor="middle">40</text>
              <text x="15" y="145" fill="#94a3b8" fontSize="10" textAnchor="middle">10</text>
              
              {/* Data Line */}
              <path d="M 50 150 Q 120 80 190 120 T 330 50 T 470 70" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
              {/* Gradient fill below line */}
              <path d="M 50 150 Q 120 80 190 120 T 330 50 T 470 70 L 470 170 L 50 170 Z" fill="url(#chart-grad)" opacity="0.08" />
              
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Data Points */}
              <circle cx="50" cy="150" r="5" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="190" cy="120" r="5" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="330" cy="50" r="5" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="470" cy="70" r="5" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="1.5" />
              
              {/* x-axis labels */}
              <text x="50" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">01 May</text>
              <text x="190" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">10 May</text>
              <text x="330" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">20 May</text>
              <text x="470" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle">31 May</text>
            </svg>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Enquiries by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '1rem' }}>
            <svg width="140" height="140" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              {(() => {
                const total = stats.total || 1;
                const newPct = (stats.newCount / total) * 100;
                const contactedPct = (stats.contacted / total) * 100;
                const pendingPct = (stats.pending / total) * 100;
                const closedPct = (stats.closed / total) * 100;

                return (
                  <>
                    {/* Circle sectors */}
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#0066cc" strokeWidth="4.2" strokeDasharray={`${newPct} ${100 - newPct}`} strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e7e34" strokeWidth="4.2" strokeDasharray={`${contactedPct} ${100 - contactedPct}`} strokeDashoffset={`-${newPct}`} />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#d97706" strokeWidth="4.2" strokeDasharray={`${pendingPct} ${100 - pendingPct}`} strokeDashoffset={`-${newPct + contactedPct}`} />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#0c1e35" strokeWidth="4.2" strokeDasharray={`${closedPct} ${100 - closedPct}`} strokeDashoffset={`-${newPct + contactedPct + pendingPct}`} />
                  </>
                );
              })()}
              {/* Inner Hole */}
              <circle cx="18" cy="18" r="12" fill="#ffffff" />
            </svg>
            
            {/* Legend list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0066cc' }}></span>
                  New
                </span>
                <strong>{stats.newCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1e7e34' }}></span>
                  Contacted
                </span>
                <strong>{stats.contacted}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d97706' }}></span>
                  Pending
                </span>
                <strong>{stats.pending}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0c1e35' }}></span>
                  Closed
                </span>
                <strong>{stats.closed}</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Export Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button type="button" className="btn btn-success" style={{ padding: '0.6rem 1.25rem' }}>Export PDF</button>
        <button type="button" className="btn btn-success" style={{ padding: '0.6rem 1.25rem' }}>Export Excel</button>
      </div>
    </div>
  );
}
