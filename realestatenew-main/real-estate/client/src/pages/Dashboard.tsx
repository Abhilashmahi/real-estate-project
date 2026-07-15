import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  Clock, 
  CalendarCheck, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  FileText,
  Settings,
  ChevronLeft,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [siteVisits, setSiteVisits] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [summary, setSummary] = useState({ 
    totalProperties: 0, 
    totalEnquiries: 0, 
    totalCustomers: 0, 
    totalFollowUps: 0, 
    pendingFollowUps: 0, 
    closedEnquiries: 0, 
    newEnquiries: 0, 
    followUpEnquiries: 0,
    contactedEnquiries: 0,
    totalSiteVisits: 0
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Search, Filter and Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Live ticking clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [enquiriesRes, siteVisitsRes, summaryRes, propertiesRes] = await Promise.all([
        fetch('http://192.168.1.5:5000/api/enquiries', { headers }),
        fetch('http://192.168.1.5:5000/api/site-visits', { headers }),
        fetch('http://192.168.1.5:5000/api/reports/summary', { headers }),
        fetch('http://192.168.1.5:5000/api/properties')
      ]);

      if (enquiriesRes.ok) {
        setEnquiries(await enquiriesRes.json());
      }
      if (siteVisitsRes.ok) {
        setSiteVisits(await siteVisitsRes.json());
      }
      if (propertiesRes.ok) {
        setProperties(await propertiesRes.json());
      }
      if (summaryRes.ok) {
        const s = await summaryRes.json();
        setSummary({
          totalProperties:    s.summary.totalProperties    || 0,
          totalEnquiries:     s.summary.totalEnquiries     || 0,
          totalCustomers:     s.summary.totalCustomers     || 0,
          totalFollowUps:     s.summary.totalFollowUps     || 0,
          pendingFollowUps:   s.summary.pendingFollowUps   || 0,
          closedEnquiries:    s.summary.closedEnquiries    || 0,
          newEnquiries:       s.summary.newEnquiries       || 0,
          followUpEnquiries:  s.summary.followUpEnquiries  || 0,
          contactedEnquiries: s.summary.contactedEnquiries || 0,
          totalSiteVisits:    s.summary.totalSiteVisits    || 0,
        });
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleConfirmVisit = async (id: number) => {
    try {
      const r = await fetch(`http://192.168.1.5:5000/api/site-visits/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: 'Confirmed' }),
      });
      if (r.ok) fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      New:        { bg: 'rgba(37,99,235,0.12)',  color: '#2563EB' },
      Contacted:  { bg: 'rgba(34,197,94,0.12)',  color: '#22C55E' },
      'Follow-up':{ bg: 'rgba(245,158,11,0.12)',  color: '#F59E0B' },
      Closed:     { bg: 'rgba(100,116,139,0.12)',color: '#64748B' },
    };
    const s = map[status] || { bg: '#F1F5F9', color: '#64748B' };
    return (
      <span style={{ 
        background: s.bg, 
        color: s.color, 
        padding: '0.3rem 0.75rem', 
        borderRadius: '999px', 
        fontSize: '0.72rem', 
        fontWeight: 700, 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em' 
      }}>
        {status}
      </span>
    );
  };

  // Compute stats
  const todayEnquiries = enquiries.filter(e => {
    if (!e.createdAt) return false;
    const dateObj = new Date(e.createdAt);
    return dateObj.toDateString() === new Date().toDateString();
  }).length;

  const totalSiteVisits = siteVisits.length;

  // Extract unique customers from enquiries
  const uniqueCustomers = Array.from(
    new Map(
      enquiries.map(item => [item.phone || item.email, {
        name: item.name || 'Anonymous User',
        phone: item.phone || 'N/A',
        email: item.email || 'N/A',
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : 'N/A'
      }])
    ).values()
  ).slice(0, 5);

  // Filter and Search enquiries for Table view
  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = 
      (e.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.phone || '').includes(searchTerm) ||
      (e.propertyName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage) || 1;
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamic Recent Activity Timeline
  const recentActivities = [
    ...enquiries.slice(0, 3).map(e => ({
      type: 'enquiry',
      title: `New Enquiry from ${e.name}`,
      desc: e.propertyName ? `Interested in ${e.propertyName}` : 'General inquiry',
      time: e.createdAt ? new Date(e.createdAt) : new Date(),
      color: '#2563EB'
    })),
    ...siteVisits.slice(0, 2).map(v => ({
      type: 'visit',
      title: `Site Visit Booked`,
      desc: `${v.customer?.fullName || 'Client'} scheduled for ${v.property?.title || 'layout'}`,
      time: v.createdAt ? new Date(v.createdAt) : new Date(),
      color: '#22C55E'
    }))
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '450px', flexDirection: 'column', gap: '1rem', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        <span style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 500 }}>Assembling CRM dashboard data...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', fontFamily: 'Poppins, sans-serif', paddingBottom: '3rem' }}>
      
      {/* ── Animated Welcome Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        border: '1px solid #334155',
        borderRadius: '20px',
        padding: '2.25rem',
        color: '#FFFFFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 0.4s ease both'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(37,99,235,0.06)', borderRadius: '50%' }}/>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', padding: '0.35rem 0.85rem', borderRadius: '999px', marginBottom: '1rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
            <span style={{ fontSize: '0.72rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CRM Control Center</span>
          </div>
          
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Welcome back, Admin! 👋
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.35rem', margin: '0.35rem 0 0' }}>
            The system is online. You have {summary.pendingFollowUps} pending client follow-ups waiting for response.
          </p>
        </div>

        {/* Live Clock Widget */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.25rem 1.75rem',
          textAlign: 'right',
          minWidth: '220px'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {currentTime.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.15rem', fontFamily: 'Outfit, sans-serif' }}>
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#22C55E', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            ● LIVE METRICS STACK
          </div>
        </div>
      </div>

      {/* ── Premium Statistics Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { 
            title: 'Total Customers', 
            value: summary.totalCustomers, 
            desc: 'Registered CRM leads', 
            growth: '+12.5%', 
            growthColor: '#22C55E', 
            color: '#22C55E', 
            icon: <Users size={22} color="#22C55E" />, 
            bg: 'rgba(34,197,94,0.08)',
            spark: 'M5 18 L25 14 L45 8 L65 11 L85 4'
          },
          { 
            title: 'Total Properties', 
            value: summary.totalProperties, 
            desc: 'Listed plots and villas', 
            growth: '+4.2%', 
            growthColor: '#22C55E', 
            color: '#2563EB', 
            icon: <Building2 size={22} color="#2563EB" />, 
            bg: 'rgba(37,99,235,0.08)',
            spark: 'M5 15 L25 10 L45 18 L65 5 L85 14'
          },
          { 
            title: 'Total Enquiries', 
            value: summary.totalEnquiries, 
            desc: 'Client messages received', 
            growth: '+8.1%', 
            growthColor: '#22C55E', 
            color: '#3B82F6', 
            icon: <MessageSquare size={22} color="#3B82F6" />, 
            bg: 'rgba(59,130,246,0.08)',
            spark: 'M5 12 L25 15 L45 7 L65 14 L85 8'
          },
          { 
            title: 'New Enquiries', 
            value: summary.newEnquiries, 
            desc: 'Unaddressed fresh leads', 
            growth: 'Immediate response', 
            growthColor: '#2563EB', 
            color: '#2563EB', 
            icon: <MessageSquare size={22} color="#2563EB" />, 
            bg: 'rgba(37,99,235,0.08)',
            spark: 'M5 10 L25 14 L45 6 L65 12 L85 4'
          },
          { 
            title: 'Contacted', 
            value: summary.contactedEnquiries, 
            desc: 'Leads initiated contact', 
            growth: 'Ongoing trace', 
            growthColor: '#22C55E', 
            color: '#22C55E', 
            icon: <Phone size={22} color="#22C55E" />, 
            bg: 'rgba(34,197,94,0.08)',
            spark: 'M5 14 L25 10 L45 15 L65 8 L85 12'
          },
          { 
            title: 'Follow-ups', 
            value: summary.followUpEnquiries, 
            desc: 'Leads currently in followups', 
            growth: 'Scheduled pipeline', 
            growthColor: '#F59E0B', 
            color: '#F59E0B', 
            icon: <Clock size={22} color="#F59E0B" />, 
            bg: 'rgba(245,158,11,0.08)',
            spark: 'M5 8 L25 12 L45 14 L65 9 L85 15'
          },
          { 
            title: 'Closed Deals', 
            value: summary.closedEnquiries, 
            desc: 'Successfully locked contracts', 
            growth: 'Deals closed', 
            growthColor: '#22C55E', 
            color: '#10B981', 
            icon: <CheckCircle size={22} color="#10B981" />, 
            bg: 'rgba(16,185,129,0.08)',
            spark: 'M5 16 L25 13 L45 15 L65 6 L85 2'
          },
          { 
            title: 'Site Visits', 
            value: summary.totalSiteVisits, 
            desc: 'Guided locations visits', 
            growth: 'Confirmed bookings', 
            growthColor: '#8B5CF6', 
            color: '#8B5CF6', 
            icon: <CalendarCheck size={22} color="#8B5CF6" />, 
            bg: 'rgba(139,92,246,0.08)',
            spark: 'M5 14 L25 8 L45 12 L65 16 L85 5'
          },
        ].map((card, i) => (
          <div key={i} style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.25s ease-in-out'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(37,99,235,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'; }}
          >
            {/* Header row in card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {card.title}
                </span>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {card.value}
                </h3>
              </div>
              <div style={{
                background: card.bg,
                width: '42px', height: '42px',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {card.icon}
              </div>
            </div>

            {/* Sparkline & Growth information */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '0.5rem' }}>
              <div>
                <span style={{ color: card.growthColor, fontSize: '0.75rem', fontWeight: 700 }}>
                  {card.growth}
                </span>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.72rem', color: '#94A3B8' }}>{card.desc}</p>
              </div>

              {/* Responsive SVG mini sparkline mockup graph */}
              <svg width="70" height="24" style={{ overflow: 'visible' }}>
                <path 
                  d={card.spark} 
                  fill="none" 
                  stroke={card.color} 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round" 
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Data Split Layout ── */}
      <div className="prop-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Side: Recent Enquiries Table Widget */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Recent Client Enquiries</h2>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.1rem 0 0' }}>Manage customer layout queries and pipeline statuses.</p>
            </div>

            {/* Search and status controls */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search name, phone..." 
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  style={{
                    height: '38px', padding: '0 1rem 0 2.25rem',
                    border: '1.5px solid #E5E7EB', borderRadius: '8px',
                    fontSize: '0.85rem', outline: 'none', width: '180px'
                  }}
                />
                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select 
                  value={statusFilter} 
                  onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  style={{
                    height: '38px', padding: '0 2rem 0 1rem',
                    border: '1.5px solid #E5E7EB', borderRadius: '8px',
                    fontSize: '0.85rem', outline: 'none', background: '#fff',
                    cursor: 'pointer', WebkitAppearance: 'none'
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Closed">Closed</option>
                </select>
                <Filter size={13} color="#94A3B8" style={{ position: 'absolute', right: '0.75rem', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {/* Table Wrapper */}
          <div className="table-container" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                  {['Customer Lead', 'Phone Contact', 'Target Property', 'Status Badge', 'Inquiry Date'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '3.5rem', color: '#94A3B8', fontSize: '0.9rem' }}>
                      No matching enquiries found.
                    </td>
                  </tr>
                ) : paginatedEnquiries.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#F8FAFC'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.15rem' }}>{item.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.85rem', fontWeight: 500 }}>{item.phone}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>{item.propertyName || 'General Inquiry'}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>{getStatusBadge(item.status)}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#94A3B8', fontSize: '0.82rem', fontWeight: 600 }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination row */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Showing Page {currentPage} of {totalPages} ({filteredEnquiries.length} items)
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px', border: '1.5px solid #E5E7EB',
                    background: '#fff', color: '#64748B', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px', border: '1.5px solid #E5E7EB',
                    background: '#fff', color: '#64748B', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Recent Activity Timeline */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="#2563EB" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Recent Activity Timeline</h2>
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(37,99,235,0.08)', color: '#2563EB', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
              Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1rem' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: '4px', top: '10px', bottom: '10px', width: '2px', background: '#E2E8F0' }} />
            
            {recentActivities.length === 0 ? (
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0, paddingLeft: '0.5rem' }}>No recent activities logged.</p>
            ) : recentActivities.map((act, idx) => (
              <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute', left: '-12px', top: '5px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: act.color, border: '2px solid #FFFFFF',
                  boxShadow: `0 0 8px ${act.color}`
                }} />
                
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', paddingLeft: '0.5rem' }}>
                  {act.title}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748B', paddingLeft: '0.5rem' }}>
                  {act.desc}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#94A3B8', paddingLeft: '0.5rem', fontWeight: 600 }}>
                  {act.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Responsive Widgets: Recent Customers, Recent Properties & Company Information ── */}
      <div className="customer-dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Widget 1: Recent Customers */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
            Recent Lead Registrations
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {uniqueCustomers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                No registered customers yet.
              </div>
            ) : uniqueCustomers.map((c, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.85rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563EB, #1E40AF)',
                    color: '#fff', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem'
                  }}>
                    {c.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2)}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{c.name}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', color: '#64748B', fontSize: '0.72rem', marginTop: '0.15rem' }}>
                      <span>📞 {c.phone}</span>
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>{c.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Recent Properties */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Recent Verified Properties</h2>
            <Link to="/admin/properties" style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {properties.slice(0, 3).map(prop => {
              const cover = prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&auto=format&fit=crop&q=60';
              return (
                <div key={prop.id} style={{
                  display: 'flex', gap: '0.85rem', padding: '0.65rem',
                  background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5E7EB',
                  alignItems: 'center'
                }}>
                  <img src={cover} alt="" style={{ width: '60px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}/>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prop.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
                      <MapPin size={11} color="#2563EB" />
                      {prop.location}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563EB' }}>₹{prop.price}L</span>
                    <div style={{ fontSize: '0.68rem', color: prop.status === 'Available' ? '#22C55E' : '#EF4444', fontWeight: 700, marginTop: '0.15rem' }}>{prop.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Widget 3: Company Information */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
            Company Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Corporate Entity</span>
              <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>Vishnu Realtors</strong>
            </div>
            
            <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Office Location</span>
              <a href="https://maps.app.goo.gl/54NNaEX8putfCvgg7" target="_blank" rel="noreferrer" style={{ fontSize: '0.88rem', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
                Coimbatore, Tamil Nadu 🗺️
              </a>
            </div>

            <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Hotline Call Support</span>
              <a href="tel:+919344912355" style={{ fontSize: '0.88rem', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
                +91 93449 12355 📞
              </a>
            </div>

            <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Corporate Email</span>
              <a href="mailto:vishnurealtors15@gmail.com" style={{ fontSize: '0.88rem', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
                vishnurealtors15@gmail.com ✉️
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ── Site Visit Bookings Table ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>Scheduled Site Visits</h2>
        <div className="table-container" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                {['Client Lead', 'Phone Contact', 'Target Property', 'Scheduled Date', 'Status Badge', 'Action Control'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {siteVisits.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8', fontSize: '0.9rem' }}>
                    No site visits scheduled.
                  </td>
                </tr>
              ) : siteVisits.map(visit => (
                <tr key={visit.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <strong style={{ fontSize: '0.875rem', color: '#0F172A' }}>
                      {visit.customer?.fullName || visit.customer?.name || 'Guest Lead'}
                    </strong>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748B', fontSize: '0.85rem' }}>
                    {visit.customer?.mobile || visit.customer?.phone || '—'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                    {visit.property?.title || 'General Layout'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#2563EB', fontWeight: 700 }}>
                    📅 {visit.visitDate}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ 
                      background: visit.status === 'Confirmed' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', 
                      color: visit.status === 'Confirmed' ? '#22C55E' : '#F59E0B', 
                      padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' 
                    }}>
                      {visit.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    {visit.status === 'Pending' ? (
                      <button 
                        onClick={() => handleConfirmVisit(visit.id)} 
                        style={{ 
                          padding: '0.4rem 1rem', 
                          background: 'linear-gradient(135deg, #22C55E, #16A34A)', 
                          color: '#FFFFFF', 
                          border: 'none', 
                          borderRadius: '6px', 
                          fontSize: '0.78rem', 
                          fontWeight: 700, 
                          cursor: 'pointer', 
                          fontFamily: 'inherit',
                          boxShadow: '0 2px 6px rgba(34,197,94,0.2)',
                          transition: 'all 0.18s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(34,197,94,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(34,197,94,0.2)'; }}
                      >
                        Confirm
                      </button>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#22C55E', fontSize: '0.8rem', fontWeight: 700 }}>
                        <CheckCircle size={14} /> Confirmed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', margin: 0 }}>
          CRM Quick Shortcuts
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          {[
            { label: 'Add New Property', path: '/admin/properties/add', icon: <Plus size={16} />, style: { background: 'linear-gradient(135deg, #2563EB, #1E40AF)', color: '#FFFFFF', border: 'none' } },
            { label: 'Manage Leads', path: '/admin/enquiries', icon: <Users size={16} />, style: { background: '#FFFFFF', border: '1.5px solid #2563EB', color: '#2563EB' } },
            { label: 'Review Site Visits', path: '/admin/enquiries', icon: <CalendarCheck size={16} />, style: { background: '#FFFFFF', border: '1.5px solid #2563EB', color: '#2563EB' } },
            { label: 'Analytics Reports', path: '/admin/reports', icon: <FileText size={16} />, style: { background: '#FFFFFF', border: '1.5px solid #2563EB', color: '#2563EB' } },
            { label: 'System Settings', path: '/admin/settings', icon: <Settings size={16} />, style: { background: '#FFFFFF', border: '1.5px solid #2563EB', color: '#2563EB' } },
          ].map((act, index) => (
            <Link key={index} to={act.path} style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '12px 18px',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              ...act.style
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              {act.icon}
              {act.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
