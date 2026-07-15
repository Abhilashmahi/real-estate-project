import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, RefreshCw, FileSpreadsheet, FileText, Plus, Clock,
  Eye, Phone, Mail, Trash2, CalendarCheck, MessageSquare, ChevronDown,
  X, CheckCircle, AlertCircle, MapPin, Building2, XCircle,
  ArrowUpDown, ChevronLeft, ChevronRight, Edit2, TrendingUp,
  Users, Activity, Zap
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS (inline — matches global blue theme)
═══════════════════════════════════════════════════════════ */
const C = {
  navy:    '#0F172A',
  dark:    '#1E293B',
  royal:   '#1E40AF',
  blue:    '#2563EB',
  blueL:   '#3B82F6',
  blueXL:  '#BFDBFE',
  blueBg:  '#EFF6FF',
  white:   '#FFFFFF',
  gray50:  '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray600: '#475569',
  gray700: '#334155',
  gray900: '#0F172A',
  emerald: '#059669',
  emerBg:  '#ECFDF5',
  amber:   '#D97706',
  amberBg: '#FFFBEB',
  violet:  '#7C3AED',
  violetBg:'#F5F3FF',
  teal:    '#0D9488',
  tealBg:  '#F0FDFA',
  red:     '#DC2626',
  redBg:   '#FEF2F2',
  sky:     '#0369A1',
  skyBg:   '#F0F9FF',
  green:   '#15803D',
  greenBg: '#F0FDF4',
};

/* ═══════════════════════════════════════════════════════════
   STATUS CONFIGURATION
═══════════════════════════════════════════════════════════ */
const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string; gradient: string }> = {
  'New':                  { label: 'New',          color: C.blue,    bg: C.blueBg,   dot: C.blueL,   gradient: 'linear-gradient(135deg,#DBEAFE,#EFF6FF)' },
  'Contacted':            { label: 'Contacted',    color: C.amber,   bg: C.amberBg,  dot: '#F59E0B',  gradient: 'linear-gradient(135deg,#FEF3C7,#FFFBEB)' },
  'Follow-up':            { label: 'Follow-up',    color: C.violet,  bg: C.violetBg, dot: '#8B5CF6',  gradient: 'linear-gradient(135deg,#EDE9FE,#F5F3FF)' },
  'Site Visit Scheduled': { label: 'Site Visit',   color: C.teal,    bg: C.tealBg,   dot: '#14B8A6',  gradient: 'linear-gradient(135deg,#CCFBF1,#F0FDFA)' },
  'Negotiation':          { label: 'Negotiation',  color: C.sky,     bg: C.skyBg,    dot: '#0EA5E9',  gradient: 'linear-gradient(135deg,#BAE6FD,#F0F9FF)' },
  'Booking Confirmed':    { label: 'Booking',      color: C.green,   bg: C.greenBg,  dot: '#22C55E',  gradient: 'linear-gradient(135deg,#BBF7D0,#F0FDF4)' },
  'Closed':               { label: 'Closed',       color: C.emerald, bg: C.emerBg,   dot: '#10B981',  gradient: 'linear-gradient(135deg,#A7F3D0,#ECFDF5)' },
  'Rejected':             { label: 'Rejected',     color: C.red,     bg: C.redBg,    dot: '#EF4444',  gradient: 'linear-gradient(135deg,#FECACA,#FEF2F2)' },
};
const STATUS_KEYS = Object.keys(STATUS_CFG);

const PRIORITY_CFG = {
  High:   { label: 'High',   color: C.red,     bg: C.redBg,    icon: '🔴', dot: '#EF4444' },
  Medium: { label: 'Medium', color: C.amber,   bg: C.amberBg,  icon: '🟠', dot: '#F59E0B' },
  Low:    { label: 'Low',    color: C.emerald, bg: C.emerBg,   icon: '🟢', dot: '#10B981' },
};

const QUICK_FILTERS = [
  { label: 'All',         value: 'all'      },
  { label: '📅 Today',     value: 'today'    },
  { label: '⏰ Yesterday', value: 'yesterday'},
  { label: '📆 This Week', value: 'week'     },
  { label: '🟣 Follow-up', value: 'followup' },
  { label: '🟢 Site Visit',value: 'sitevisit'},
  { label: '✅ Closed',    value: 'closed'   },
  { label: '🔴 High Priority', value: 'high'},
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const getInitials = (name: string) =>
  (name || '??').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

const AVATAR_GRADIENTS = [
  `linear-gradient(135deg,${C.blueL},${C.royal})`,
  `linear-gradient(135deg,${C.violet},#5B21B6)`,
  `linear-gradient(135deg,${C.teal},#0F766E)`,
  `linear-gradient(135deg,${C.amber},#B45309)`,
  `linear-gradient(135deg,${C.red},#991B1B)`,
  `linear-gradient(135deg,${C.sky},#075985)`,
];
const getGrad = (id: number) => AVATAR_GRADIENTS[id % AVATAR_GRADIENTS.length];

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtTime = (d: string) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

/* ── Animated counter hook ─────────────────────────────── */
function useCountUp(target: number, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

/* ── Skeleton ───────────────────────────────────────────── */
const SK = ({ w = '100%', h = 13, r = 8 }: { w?: string | number; h?: number; r?: number }) => (
  <div className="skeleton" style={{ width: w, height: h, borderRadius: r, minHeight: h, flexShrink: 0 }} />
);

/* ═══════════════════════════════════════════════════════════
   STAT CARD (animated counter + glow hover)
═══════════════════════════════════════════════════════════ */
function StatCard({
  label, value, icon, color, bg, borderColor, isStr, loading
}: {
  label: string; value: number | string; icon: React.ReactNode;
  color: string; bg: string; borderColor: string; isStr?: boolean; loading?: boolean;
}) {
  const numVal   = typeof value === 'number' ? value : 0;
  const animated = useCountUp(loading ? 0 : numVal);
  const display  = isStr ? value : animated;
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white,
        borderRadius: 16,
        padding: '1.15rem 1.25rem',
        border: `1px solid ${C.gray200}`,
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: hov
          ? `0 8px 28px rgba(0,0,0,0.08), 0 0 0 3px ${borderColor}18`
          : '0 2px 8px rgba(0,0,0,0.03)',
        transform: hov ? 'translateY(-3px)' : 'none',
        transition: 'all 0.22s cubic-bezier(.4,0,.2,1)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* subtle bg glow */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: bg, opacity: hov ? 0.7 : 0.4, transition: 'opacity 0.3s', pointerEvents: 'none' }}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, position: 'relative' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: C.gray400, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${borderColor}30` }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: C.navy, fontFamily: 'Inter, Poppins, sans-serif', letterSpacing: '-0.02em', position: 'relative' }}>
        {loading ? <SK w={60} h={28} r={8}/> : display}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICON ACTION BUTTON (circular, glow tooltip)
═══════════════════════════════════════════════════════════ */
function IABtn({
  icon, title, color, bg, onClick, href, target
}: {
  icon: React.ReactNode; title: string; color: string; bg: string;
  onClick?: () => void; href?: string; target?: string;
}) {
  const [hov, setHov] = useState(false);
  const style: React.CSSProperties = {
    width: 30, height: 30, borderRadius: '50%',
    background: hov ? color : bg,
    border: `1.5px solid ${color}30`,
    color: hov ? C.white : color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0,
    boxShadow: hov ? `0 4px 14px ${color}44` : 'none',
    transform: hov ? 'scale(1.18)' : 'scale(1)',
    transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
    position: 'relative',
    textDecoration: 'none',
  };
  const el = href
    ? <a href={href} target={target} rel={target ? 'noreferrer' : undefined} title={title}
        style={style} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{icon}</a>
    : <button title={title} style={style} onClick={onClick}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{icon}</button>;
  return el;
}

/* ═══════════════════════════════════════════════════════════
   STATUS BADGE
═══════════════════════════════════════════════════════════ */
function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' }) {
  const s = STATUS_CFG[status] || STATUS_CFG['New'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'sm' ? '3px 10px' : '5px 13px',
      borderRadius: 999, background: s.gradient,
      color: s.color, fontWeight: 700,
      fontSize: size === 'sm' ? '0.72rem' : '0.78rem',
      whiteSpace: 'nowrap', border: `1px solid ${s.dot}22`,
      boxShadow: `0 1px 4px ${s.dot}20`,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, display: 'inline-block', flexShrink: 0 }}/>
      {s.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRIORITY BADGE
═══════════════════════════════════════════════════════════ */
function PriorityBadge({ priority }: { priority: string }) {
  const p = PRIORITY_CFG[priority as keyof typeof PRIORITY_CFG] || PRIORITY_CFG.Medium;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 999,
      background: p.bg, color: p.color,
      fontWeight: 700, fontSize: '0.72rem', whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: '0.62rem' }}>{p.icon}</span>{p.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION WRAPPER (drawer)
═══════════════════════════════════════════════════════════ */
function DSec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 800, color: C.gray400, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{title}</p>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TIMELINE ITEM
═══════════════════════════════════════════════════════════ */
function TLI({ label, time, dot }: { label: string; time: string; dot: string }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 2 }}>
      <div style={{ position: 'absolute', left: -20, top: 4, width: 9, height: 9, borderRadius: '50%', background: dot, border: `2px solid ${C.white}`, boxShadow: `0 0 0 2px ${dot}44` }}/>
      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: C.navy }}>{label}</p>
      <p style={{ margin: 0, fontSize: '0.69rem', color: C.gray400 }}>{new Date(time).toLocaleString('en-IN')}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGINATION BUTTON
═══════════════════════════════════════════════════════════ */
function PgBtn({ children, disabled, active, onClick }: { children: React.ReactNode; disabled: boolean; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      minWidth: 32, height: 32, borderRadius: 8, padding: '0 6px',
      border: active ? 'none' : `1px solid ${C.gray200}`,
      background: active ? C.blue : C.white,
      color: active ? C.white : C.gray600,
      fontWeight: 700, fontSize: '0.78rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'all 0.15s',
    }}>{children}</button>
  );
}

/* ═══════════════════════════════════════════════════════════
   SORT HEADER
═══════════════════════════════════════════════════════════ */
function STh({ f, sf, sd, toggle, children, w, center }: {
  f: string; sf: string; sd: string; toggle: (f: string) => void;
  children: React.ReactNode; w?: number | string; center?: boolean;
}) {
  const active = sf === f;
  return (
    <th onClick={() => toggle(f)} style={{
      padding: '0.9rem 1rem', textAlign: center ? 'center' : 'left',
      cursor: 'pointer', userSelect: 'none', fontWeight: 700, fontSize: '0.72rem',
      color: active ? C.blue : C.gray400,
      textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
      width: w, background: C.gray50, borderBottom: `2px solid ${C.gray200}`,
      transition: 'color 0.15s',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {children}
        <ArrowUpDown size={10} style={{ opacity: active ? 1 : 0.3, color: active ? C.blue : C.gray400 }}/>
      </span>
    </th>
  );
}
function Th({ children, w, center }: { children: React.ReactNode; w?: number | string; center?: boolean }) {
  return (
    <th style={{
      padding: '0.9rem 1rem', textAlign: center ? 'center' : 'left',
      fontWeight: 700, fontSize: '0.72rem', color: C.gray400,
      textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
      width: w, background: C.gray50, borderBottom: `2px solid ${C.gray200}`,
    }}>{children}</th>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Enquiries() {

  /* ── Core state ─────────────────────────────────────── */
  const [enquiries, setEnquiries]       = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [priorities, setPriorities]     = useState<Record<number, string>>({});

  /* ── UI state ───────────────────────────────────────── */
  const [toast, setToast]               = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [showFAB, setShowFAB]           = useState(false);
  const [ddRow, setDdRow]               = useState<number | null>(null);
  const [prioRow, setPrioRow]           = useState<number | null>(null);
  const [hovRow, setHovRow]             = useState<number | null>(null);

  /* ── Filters ────────────────────────────────────────── */
  const [search, setSearch]             = useState('');
  const [quickFilter, setQuickFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage]                 = useState(1);
  const [sortField, setSortField]       = useState('createdAt');
  const [sortDir, setSortDir]           = useState<'asc' | 'desc'>('desc');
  const perPage = 10;

  /* ── Drawer ─────────────────────────────────────────── */
  const [drawer, setDrawer]             = useState<any | null>(null);
  const [drawerTab, setDrawerTab]       = useState<'profile' | 'notes' | 'schedule'>('profile');
  const [dNote, setDNote]               = useState('');
  const [schedDate, setSchedDate]       = useState('');
  const [schedTime, setSchedTime]       = useState('');
  const [editMode, setEditMode]         = useState(false);
  const [editForm, setEditForm]         = useState<any>({});

  /* ── Add Modal ──────────────────────────────────────── */
  const [addModal, setAddModal]         = useState(false);
  const [addForm, setAddForm]           = useState({
    name: '', email: '', phone: '', propertyName: 'General Inquiry', notes: '', status: 'New'
  });

  const ddRef     = useRef<HTMLElement | null>(null);
  const prioRef   = useRef<HTMLElement | null>(null);
  const fabRef    = useRef<HTMLDivElement>(null);

  /* ── Outside-click closes dropdowns ────────────────── */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!ddRef.current?.contains(e.target as Node))    setDdRow(null);
      if (!prioRef.current?.contains(e.target as Node))  setPrioRow(null);
      if (!fabRef.current?.contains(e.target as Node))   setShowFAB(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* ── Fetch ──────────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch('http://192.168.1.5:5000/api/enquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setEnquiries(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Toast ──────────────────────────────────────────── */
  const flash = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── Priority ───────────────────────────────────────── */
  const setPriority = (id: number, p: string) => {
    setPriorities(prev => ({ ...prev, [id]: p }));
    setPrioRow(null);
    flash(`Priority → ${p}`);
  };

  /* ── Status Update ──────────────────────────────────── */
  const updateStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://192.168.1.5:5000/api/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        flash(`Status → ${status}`);
        if (drawer?.id === id) setDrawer((p: any) => ({ ...p, status }));
        setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      } else flash('Failed to update status', 'error');
    } catch { flash('Network error', 'error'); }
    finally { setDdRow(null); }
  };

  /* ── Save Note ──────────────────────────────────────── */
  const saveNote = async () => {
    if (!dNote.trim() || !drawer) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://192.168.1.5:5000/api/enquiries/${drawer.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: drawer.status, notes: dNote }),
      });
      if (res.ok) {
        flash('Note saved');
        setDrawer((p: any) => ({ ...p, notes: dNote }));
        setEnquiries(prev => prev.map(e => e.id === drawer.id ? { ...e, notes: dNote } : e));
        setDNote('');
      }
    } catch { flash('Failed to save note', 'error'); }
  };

  /* ── Schedule Visit ─────────────────────────────────── */
  const scheduleVisit = async () => {
    if (!schedDate || !schedTime || !drawer) return;
    await updateStatus(drawer.id, 'Site Visit Scheduled');
    flash(`Site visit scheduled: ${schedDate} at ${schedTime}`);
    setSchedDate(''); setSchedTime('');
    setDrawerTab('profile');
  };

  /* ── Save Edit ──────────────────────────────────────── */
  const saveEdit = async () => {
    if (!drawer) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://192.168.1.5:5000/api/enquiries/${drawer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        flash('Lead updated');
        const updated = { ...drawer, ...editForm };
        setDrawer(updated);
        setEnquiries(prev => prev.map(e => e.id === drawer.id ? { ...e, ...editForm } : e));
        setEditMode(false);
      }
    } catch { flash('Update failed', 'error'); }
  };

  /* ── Delete ─────────────────────────────────────────── */
  const remove = async (id: number) => {
    if (!window.confirm('Permanently delete this lead?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://192.168.1.5:5000/api/enquiries/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        flash('Lead deleted');
        if (drawer?.id === id) setDrawer(null);
        setEnquiries(prev => prev.filter(e => e.id !== id));
      }
    } catch { flash('Delete failed', 'error'); }
  };

  /* ── Add Enquiry ────────────────────────────────────── */
  const addEnquiry = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://192.168.1.5:5000/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...addForm, property: addForm.propertyName }),
      });
      if (res.ok) {
        flash('New lead added');
        setAddModal(false);
        setAddForm({ name: '', email: '', phone: '', propertyName: 'General Inquiry', notes: '', status: 'New' });
        fetchData();
      }
    } catch { flash('Failed to add lead', 'error'); }
  };

  /* ── Sort ───────────────────────────────────────────── */
  const toggleSort = (f: string) => {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(f); setSortDir('asc'); }
  };

  /* ── Date filters ───────────────────────────────────── */
  const applyQF = (e: any, qf: string) => {
    const now = new Date(), d = new Date(e.createdAt);
    if (qf === 'all')      return true;
    if (qf === 'today')    return d.toDateString() === now.toDateString();
    if (qf === 'yesterday'){ const y = new Date(now); y.setDate(now.getDate()-1); return d.toDateString() === y.toDateString(); }
    if (qf === 'week')     { const w = new Date(now); w.setDate(now.getDate()-7); return d >= w; }
    if (qf === 'followup') return e.status === 'Follow-up';
    if (qf === 'sitevisit')return e.status === 'Site Visit Scheduled';
    if (qf === 'closed')   return e.status === 'Closed';
    if (qf === 'high')     return (priorities[e.id] || 'Medium') === 'High';
    return true;
  };

  /* ── Filtered & Sorted data ─────────────────────────── */
  const filtered = enquiries.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || (e.name||'').toLowerCase().includes(q)
      || (e.phone||'').includes(q)
      || (e.email||'').toLowerCase().includes(q)
      || (e.propertyName||'').toLowerCase().includes(q)
      || (e.propertyLocation||'').toLowerCase().includes(q)
      || String(e.id).includes(q);
    return matchSearch
      && (statusFilter === 'All' || e.status === statusFilter)
      && applyQF(e, quickFilter);
  });

  const sorted = [...filtered].sort((a, b) => {
    let va: any = a[sortField], vb: any = b[sortField];
    if (sortField === 'createdAt') { va = new Date(va).getTime(); vb = new Date(vb).getTime(); }
    else { va = String(va||'').toLowerCase(); vb = String(vb||'').toLowerCase(); }
    return va < vb ? (sortDir==='asc'?-1:1) : va > vb ? (sortDir==='asc'?1:-1) : 0;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const pgStart = (page-1)*perPage;
  const rows = sorted.slice(pgStart, pgStart+perPage);
  useEffect(() => { setPage(1); }, [search, statusFilter, quickFilter]);

  /* ── Stats ──────────────────────────────────────────── */
  const cnt = (s: string) => enquiries.filter(e => e.status === s).length;
  const todayCount   = enquiries.filter(e => new Date(e.createdAt).toDateString() === new Date().toDateString()).length;
  const pendingCount = enquiries.filter(e => ['New','Contacted'].includes(e.status)).length;
  const followCount  = cnt('Follow-up');
  const closedCount  = cnt('Closed');
  const convRate     = enquiries.length ? Math.round((closedCount / enquiries.length) * 100) : 0;

  /* ── Recent Activity ────────────────────────────────── */
  const recentActivity = [...enquiries]
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .map(e => ({
      time: fmtTime(e.createdAt),
      label: e.status === 'New' ? `${e.name} submitted a new enquiry`
           : e.status === 'Follow-up' ? `Follow-up scheduled for ${e.name}`
           : e.status === 'Site Visit Scheduled' ? `Site visit confirmed — ${e.name}`
           : `${e.name} → ${e.status}`,
      color: STATUS_CFG[e.status]?.dot || C.gray400,
    }));

  /* ── Exports ────────────────────────────────────────── */
  const exportCSV = () => {
    const hdr = ['ID','Name','Phone','Email','Property','Location','Notes','Status','Priority','Date'];
    const body = filtered.map(e => [e.id, e.name||'', e.phone||'', e.email||'', e.propertyName||'', e.propertyLocation||'', (e.notes||'').replace(/"/g,'""'), e.status||'', priorities[e.id]||'Medium', fmtDate(e.createdAt)]);
    const csv = [hdr,...body].map(r => r.map(c=>`"${c}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = `crm_leads_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };
  const exportPDF = () => {
    const w = window.open('','_blank'); if (!w) return;
    const tbody = filtered.map((e,i)=>`<tr><td>${i+1}</td><td>${e.name||''}</td><td>${e.phone||''}</td><td>${e.email||''}</td><td>${e.propertyName||''}</td><td>${e.status||''}</td><td>${priorities[e.id]||'Medium'}</td><td>${fmtDate(e.createdAt)}</td></tr>`).join('');
    w.document.write(`<html><head><title>Vishnu Realtors CRM</title><style>body{font-family:sans-serif;padding:24px;color:#1e293b}h2{color:#1e40af;border-bottom:2px solid #3b82f6;padding-bottom:8px}table{width:100%;border-collapse:collapse;font-size:11px;margin-top:12px}th,td{border:1px solid #cbd5e1;padding:6px 10px;text-align:left}th{background:#1e40af;color:#fff}</style></head><body><h2>Vishnu Realtors — CRM Leads</h2><p style="color:#64748b;font-size:12px">Generated: ${new Date().toLocaleString()} · ${filtered.length} leads</p><table><thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Property</th><th>Status</th><th>Priority</th><th>Date</th></tr></thead><tbody>${tbody}</tbody></table></body></html>`);
    w.document.close(); setTimeout(()=>w.print(),400);
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={{ fontFamily: 'Inter, Poppins, sans-serif', color: C.navy, paddingBottom: '6rem', position: 'relative', minHeight: '100vh' }}>

      {/* ── TOAST ─────────────────────────────────────── */}
      {toast && (
        <div className="anim-fade-up" style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          zIndex: 999999, display: 'flex', alignItems: 'center', gap: 10,
          background: toast.type === 'success' ? C.navy : '#7F1D1D',
          color: C.white, padding: '0.8rem 1.5rem', borderRadius: 999,
          boxShadow: '0 16px 40px rgba(0,0,0,0.22)',
          fontSize: '0.84rem', fontWeight: 700,
          borderLeft: `4px solid ${toast.type === 'success' ? C.blueL : '#EF4444'}`,
          maxWidth: 420, whiteSpace: 'nowrap',
        }}>
          {toast.type === 'success'
            ? <CheckCircle size={16} color={C.blueL}/>
            : <AlertCircle size={16} color="#EF4444"/>}
          {toast.msg}
          <button onClick={() => setToast(null)} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',marginLeft:4,padding:0 }}><X size={13}/></button>
        </div>
      )}

      {/* ── PAGE HEADER ───────────────────────────────── */}
      <div className="anim-fade-up" style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, #1E3A8A 100%)`,
        borderRadius: 20, padding: '1.25rem 1.5rem', color: C.white,
        marginBottom: '1.5rem',
        boxShadow: '0 12px 40px rgba(15,23,42,0.14)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-30, right:120, width:120, height:120, borderRadius:'50%', background:'rgba(59,130,246,0.08)', pointerEvents:'none' }}/>

        <div style={{ display:'flex', justifyContent: 'space-between', alignItems:'center', flexWrap:'wrap', gap:'1.25rem', position:'relative' }}>
          {/* Left */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:'rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(59,130,246,0.3)', flexShrink: 0 }}>
              <Users size={20} color="#93C5FD"/>
            </div>
            <div>
              <h1 style={{ margin:0, fontSize:'1.35rem', fontWeight:800, letterSpacing:'-0.025em', lineHeight: 1.2 }}>CRM Workspace</h1>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2, fontSize:'0.75rem', color:'#94A3B8', flexWrap: 'wrap' }}>
                <span>Admin</span><span style={{opacity:0.4}}>/</span>
                <span style={{ color:'#60A5FA', fontWeight:700 }}>Enquiry Management</span>
                <span style={{ background:'rgba(255,255,255,0.08)', padding:'1px 8px', borderRadius:999, fontSize:'0.65rem' }}>
                  {enquiries.length} leads
                </span>
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
            <button onClick={fetchData} title="Refresh" style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', color:C.white, padding:8, borderRadius:10, cursor:'pointer', display:'flex', transition:'all 0.18s' }}>
              <RefreshCw size={15} className={loading ? 'spin-anim' : ''}/>
            </button>
            <button onClick={exportCSV} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', color:C.white, padding:'7px 12px', borderRadius:10, cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontSize:'0.76rem', fontWeight:700, transition:'all 0.18s' }} className="hide-mobile">
              <FileSpreadsheet size={14}/> CSV
            </button>
            <button onClick={exportPDF} style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', color:C.white, padding:'7px 12px', borderRadius:10, cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontSize:'0.76rem', fontWeight:700, transition:'all 0.18s' }} className="hide-mobile">
              <FileText size={14}/> PDF
            </button>
            <button onClick={() => setAddModal(true)} style={{ background:`linear-gradient(135deg,${C.blue},${C.royal})`, border:'none', color:C.white, padding:'8px 14px', borderRadius:10, cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:'0.78rem', fontWeight:800, boxShadow:'0 4px 14px rgba(37,99,235,0.4)', transition:'all 0.18s' }}>
              <Plus size={15}/> Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS GRID ────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'1rem', marginBottom:'1.5rem' }} className="anim-fade-up">
        <StatCard label="Today's Leads"   value={todayCount}   icon={<Activity size={15}/>}     color={C.blue}    bg={C.blueBg}   borderColor={C.blue}    loading={loading}/>
        <StatCard label="Pending"         value={pendingCount} icon={<Clock size={15}/>}         color={C.amber}   bg={C.amberBg}  borderColor="#F59E0B"   loading={loading}/>
        <StatCard label="Follow-ups"      value={followCount}  icon={<CalendarCheck size={15}/>} color={C.violet}  bg={C.violetBg} borderColor="#8B5CF6"   loading={loading}/>
        <StatCard label="Closed Deals"    value={closedCount}  icon={<CheckCircle size={15}/>}   color={C.emerald} bg={C.emerBg}   borderColor={C.emerald} loading={loading}/>
        <StatCard label="Conversion"      value={`${convRate}%`} icon={<TrendingUp size={15}/>} color={C.sky}     bg={C.skyBg}    borderColor={C.sky}     loading={loading} isStr/>
        <StatCard label="Total Leads"     value={enquiries.length} icon={<Users size={15}/>}    color={C.navy}    bg={C.gray100}  borderColor={C.gray400} loading={loading}/>
      </div>

      {/* ── MAIN WORKSPACE ────────────────────────────── */}
      <div className="crm-workspace-grid" style={{ display:'grid', gridTemplateColumns:'1fr 248px', gap:'1.25rem', alignItems:'start' }}>

        {/* ══ TABLE PANEL ══════════════════════════════ */}
        <div className="anim-fade-up" style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:20, boxShadow:'0 4px 20px rgba(0,0,0,0.04)', overflow:'hidden', animationDelay:'0.08s', width: '100%', minWidth: 0 }}>

          {/* Search bar */}
          <div style={{ padding:'1rem 1.15rem', borderBottom:`1px solid ${C.gray100}`, background:C.white }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:240, position:'relative' }}>
                <Search size={15} color={C.gray400} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                <input
                  className="form-input"
                  placeholder="Search by name, phone, email, property, ID…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft:38, borderRadius:12, height:42, fontSize:'0.84rem', border:`1.5px solid ${search ? C.blue : C.gray200}`, transition:'border-color 0.2s', boxShadow: search ? `0 0 0 3px ${C.blue}15` : 'none' }}
                />
              </div>
              <select className="form-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                style={{ width:155, borderRadius:12, height:42, fontSize:'0.82rem', border:`1.5px solid ${C.gray200}` }}>
                <option value="All">All Statuses</option>
                {STATUS_KEYS.map(s => <option key={s} value={s}>{STATUS_CFG[s].label}</option>)}
              </select>
              {(search || statusFilter !== 'All' || quickFilter !== 'all') && (
                <button onClick={() => { setSearch(''); setStatusFilter('All'); setQuickFilter('all'); }}
                  style={{ display:'flex', alignItems:'center', gap:4, background:C.redBg, border:'none', color:C.red, padding:'7px 12px', borderRadius:10, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
                  <XCircle size={13}/> Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick filter chips */}
          <div style={{ padding:'0.65rem 1.15rem', borderBottom:`1px solid ${C.gray100}`, display:'flex', gap:6, overflowX:'auto', flexWrap:'nowrap' }} className="crm-qf-bar">
            {QUICK_FILTERS.map(qf => {
              const active = quickFilter === qf.value;
              return (
                <button key={qf.value} onClick={() => setQuickFilter(qf.value)} style={{
                  padding:'5px 14px', borderRadius:999,
                  border:`1.5px solid ${active ? C.blue : C.gray200}`,
                  background: active ? `linear-gradient(135deg,${C.blue},${C.royal})` : C.white,
                  color: active ? C.white : C.gray600,
                  fontSize:'0.76rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap',
                  boxShadow: active ? `0 3px 10px ${C.blue}33` : 'none',
                  transform: active ? 'scale(1.03)' : 'none',
                  transition:'all 0.18s cubic-bezier(.4,0,.2,1)', flexShrink:0,
                }}>
                  {qf.label}
                </button>
              );
            })}
          </div>

          {/* Row count */}
          <div style={{ padding:'0.5rem 1.15rem', display:'flex', justifyContent:'space-between', alignItems:'center', background:C.gray50, borderBottom:`1px solid ${C.gray100}` }}>
            <span style={{ fontSize:'0.74rem', color:C.gray400, fontWeight:600 }}>
              {sorted.length} lead{sorted.length !== 1 ? 's' : ''} found
            </span>
            <span style={{ fontSize:'0.74rem', color:C.gray400 }}>
              Page {page} / {Math.max(totalPages,1)}
            </span>
          </div>

          {/* ── Desktop Table ─────────────────────────── */}
          <div className="crm-table-desktop" style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.84rem' }}>
              <thead>
                <tr>
                  <Th w={42}>#</Th>
                  <STh f="name"         sf={sortField} sd={sortDir} toggle={toggleSort}>Customer</STh>
                  <Th>Contact</Th>
                  <STh f="propertyName" sf={sortField} sd={sortDir} toggle={toggleSort}>Property</STh>
                  <Th>Priority</Th>
                  <STh f="status"       sf={sortField} sd={sortDir} toggle={toggleSort} w={205}>Status</STh>
                  <STh f="createdAt"    sf={sortField} sd={sortDir} toggle={toggleSort}>Date</STh>
                  <Th center w={200}>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({length:6}).map((_,i) => (
                    <tr key={i} style={{ borderBottom:`1px solid ${C.gray100}` }}>
                      {[40,120,110,110,80,180,90,170].map((w,j) => (
                        <td key={j} style={{ padding:'1rem' }}><SK w={w} h={13}/></td>
                      ))}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr><td colSpan={8}>
                    <div className="anim-fade-in" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, padding:'5rem 2rem', color:C.gray400 }}>
                      <div style={{ width:72, height:72, borderRadius:20, background:`linear-gradient(135deg,${C.blueBg},${C.blueXL}20)`, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${C.blueXL}` }}>
                        <AlertCircle size={30} color={C.blueXL}/>
                      </div>
                      <div style={{ textAlign:'center' }}>
                        <p style={{ margin:0, fontWeight:800, color:C.gray600, fontSize:'1rem' }}>No leads found</p>
                        <p style={{ margin:'5px 0 0', fontSize:'0.8rem' }}>Try adjusting your search or filter criteria</p>
                      </div>
                      <button onClick={() => { setSearch(''); setStatusFilter('All'); setQuickFilter('all'); }}
                        style={{ background:`linear-gradient(135deg,${C.blue},${C.royal})`, color:C.white, border:'none', padding:'9px 22px', borderRadius:10, fontSize:'0.82rem', fontWeight:800, cursor:'pointer', boxShadow:`0 4px 14px ${C.blue}33` }}>
                        Clear All Filters
                      </button>
                    </div>
                  </td></tr>
                ) : rows.map((item, idx) => {
                  const sc  = STATUS_CFG[item.status] || STATUS_CFG['New'];
                  const pri = priorities[item.id] || 'Medium';
                  const isHov = hovRow === item.id;
                  return (
                    <tr key={item.id}
                      onMouseEnter={() => setHovRow(item.id)}
                      onMouseLeave={() => setHovRow(null)}
                      onClick={e => {
                        if ((e.target as HTMLElement).closest('button,a,select')) return;
                        setDrawer(item); setDrawerTab('profile'); setEditMode(false); setDNote('');
                      }}
                      style={{
                        borderBottom:`1px solid ${C.gray100}`,
                        background: isHov ? `linear-gradient(90deg,${C.blue}08,${C.blueBg})` : idx%2===1 ? C.gray50 : C.white,
                        cursor:'pointer',
                        boxShadow: isHov ? `inset 3px 0 0 ${C.blue}` : 'inset 3px 0 0 transparent',
                        transition:'all 0.18s cubic-bezier(.4,0,.2,1)',
                      }}
                    >
                      {/* # */}
                      <td style={{ padding:'1rem 0.85rem', color:C.gray400, fontSize:'0.78rem', fontWeight:700 }}>{pgStart+idx+1}</td>

                      {/* Customer */}
                      <td style={{ padding:'1rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:'50%', background:getGrad(item.id), color:C.white, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.72rem', flexShrink:0, boxShadow:`0 3px 10px ${C.gray400}33` }}>
                            {getInitials(item.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight:700, color:C.navy, fontSize:'0.88rem', lineHeight:1.2 }}>{item.name}</div>
                            <div style={{ fontSize:'0.68rem', color:C.gray400, marginTop:1 }}>#{item.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td style={{ padding:'1rem' }}>
                        <div style={{ fontWeight:600, color:C.gray700, fontSize:'0.83rem' }}>{item.phone}</div>
                        <div style={{ color:C.gray400, fontSize:'0.72rem', marginTop:1, maxWidth:155, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.email}</div>
                      </td>

                      {/* Property */}
                      <td style={{ padding:'1rem' }}>
                        <div style={{ fontWeight:700, color:C.navy, fontSize:'0.83rem', maxWidth:135, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.propertyName||'General'}</div>
                        <div style={{ color:C.gray400, fontSize:'0.72rem', display:'flex', alignItems:'center', gap:2, marginTop:1 }}>
                          <MapPin size={9}/><span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:120 }}>{item.propertyLocation||'—'}</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td style={{ padding:'1rem', position:'relative' }} ref={prioRow===item.id ? prioRef as any : undefined} onClick={e=>e.stopPropagation()}>
                        <button onClick={() => setPrioRow(prioRow===item.id ? null : item.id)} style={{
                          all:'unset', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:5,
                          padding:'5px 11px', borderRadius:999,
                          background: PRIORITY_CFG[pri as keyof typeof PRIORITY_CFG].bg,
                          color: PRIORITY_CFG[pri as keyof typeof PRIORITY_CFG].color,
                          fontWeight:700, fontSize:'0.74rem', whiteSpace:'nowrap',
                          boxShadow:`0 1px 4px ${PRIORITY_CFG[pri as keyof typeof PRIORITY_CFG].dot}22`
                        }}>
                          <span style={{fontSize:'0.66rem'}}>{PRIORITY_CFG[pri as keyof typeof PRIORITY_CFG].icon}</span>
                          {pri}
                        </button>
                        {prioRow===item.id && (
                          <div className="anim-scale-in" style={{ position:'absolute', top:'calc(100% + 4px)', left:0, background:C.white, border:`1px solid ${C.gray200}`, borderRadius:12, boxShadow:'0 10px 30px rgba(15,23,42,0.12)', zIndex:200, padding:5, width:140 }}>
                            <p style={{ margin:'0 0 4px', padding:'4px 10px', fontSize:'0.64rem', fontWeight:800, color:C.gray400, textTransform:'uppercase', letterSpacing:'0.06em' }}>Set Priority</p>
                            {Object.entries(PRIORITY_CFG).map(([k,v]) => (
                              <button key={k} onClick={() => setPriority(item.id, k)} style={{
                                all:'unset', cursor:'pointer', display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 10px', borderRadius:8,
                                background: pri===k ? v.bg : 'transparent', color:v.color, fontWeight:700, fontSize:'0.8rem', boxSizing:'border-box',
                              }}>
                                <span style={{fontSize:'0.7rem'}}>{v.icon}</span>{v.label}
                                {pri===k && <CheckCircle size={11} style={{marginLeft:'auto'}}/>}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding:'1rem', position:'relative' }} ref={ddRow===item.id ? ddRef as any : undefined} onClick={e=>e.stopPropagation()}>
                        <button onClick={() => setDdRow(ddRow===item.id ? null : item.id)} style={{
                          all:'unset', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:7,
                          padding:'6px 14px', borderRadius:999, background:sc.gradient,
                          color:sc.color, fontWeight:700, fontSize:'0.78rem', whiteSpace:'nowrap',
                          minWidth:140, justifyContent:'space-between',
                          border:`1px solid ${sc.dot}28`, boxShadow:`0 2px 8px ${sc.dot}18`,
                        }}>
                          <span style={{ display:'flex', alignItems:'center', gap:7 }}>
                            <span style={{ width:8, height:8, borderRadius:'50%', background:sc.dot, display:'inline-block', flexShrink:0, boxShadow:`0 0 5px ${sc.dot}88` }}/>
                            {sc.label}
                          </span>
                          <ChevronDown size={11} style={{ opacity:0.5, marginLeft:2 }}/>
                        </button>
                        {ddRow===item.id && (
                          <div className="anim-scale-in" style={{ position:'absolute', top:'calc(100% + 5px)', left:0, width:230, background:C.white, border:`1px solid ${C.gray200}`, borderRadius:14, boxShadow:'0 16px 40px rgba(15,23,42,0.14)', zIndex:200, padding:6 }}>
                            <p style={{ margin:'0 0 3px', padding:'5px 10px', fontSize:'0.64rem', fontWeight:800, color:C.gray400, textTransform:'uppercase', letterSpacing:'0.06em' }}>Update Status</p>
                            {STATUS_KEYS.map(k => {
                              const o = STATUS_CFG[k];
                              return (
                                <button key={k} onClick={() => updateStatus(item.id, k)} style={{
                                  all:'unset', cursor:'pointer', display:'flex', alignItems:'center', gap:10, width:'100%',
                                  padding:'8px 12px', borderRadius:9, boxSizing:'border-box',
                                  background: item.status===k ? o.gradient : 'transparent',
                                  color:o.color, fontWeight:700, fontSize:'0.8rem',
                                  transition:'background 0.12s',
                                }}
                                  onMouseEnter={e => { if(item.status!==k) e.currentTarget.style.background=C.gray50; }}
                                  onMouseLeave={e => { if(item.status!==k) e.currentTarget.style.background='transparent'; }}
                                >
                                  <span style={{ width:8, height:8, borderRadius:'50%', background:o.dot, flexShrink:0, boxShadow:`0 0 4px ${o.dot}66` }}/>
                                  {o.label}
                                  {item.status===k && <CheckCircle size={12} style={{marginLeft:'auto', opacity:0.7}}/>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td style={{ padding:'1rem', fontSize:'0.78rem', color:C.gray600, whiteSpace:'nowrap' }}>
                        <div style={{ fontWeight:600 }}>{fmtDate(item.createdAt)}</div>
                        <div style={{ fontSize:'0.69rem', color:C.gray400, marginTop:1 }}>{fmtTime(item.createdAt)}</div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding:'1rem', textAlign:'center' }} onClick={e=>e.stopPropagation()}>
                        <div style={{ display:'flex', gap:5, justifyContent:'center', flexWrap:'nowrap', alignItems:'center' }}>
                          <IABtn icon={<Eye size={13}/>}           title="View Profile"   color={C.gray600} bg={C.gray100}   onClick={() => { setDrawer(item); setDrawerTab('profile'); setEditMode(false); }}/>
                          <IABtn icon={<Phone size={13}/>}         title="Call"           color={C.blue}    bg={C.blueBg}    href={`tel:${item.phone}`}/>
                          <IABtn icon={<MessageSquare size={13}/>} title="WhatsApp"       color={C.emerald} bg={C.emerBg}    href={`https://wa.me/${(item.phone||'').replace(/\D/g,'')}`} target="_blank"/>
                          <IABtn icon={<Mail size={13}/>}          title="Email"          color={C.violet}  bg={C.violetBg}  href={`mailto:${item.email}`}/>
                          <IABtn icon={<CalendarCheck size={13}/>} title="Schedule Visit" color={C.teal}    bg={C.tealBg}    onClick={() => { setDrawer(item); setDrawerTab('schedule'); }}/>
                          <IABtn icon={<Edit2 size={13}/>}         title="Edit Lead"      color={C.amber}   bg={C.amberBg}   onClick={() => { setDrawer(item); setEditMode(true); setEditForm({ name:item.name, email:item.email, phone:item.phone, propertyName:item.propertyName, notes:item.notes, status:item.status }); setDrawerTab('profile'); }}/>
                          <IABtn icon={<Trash2 size={13}/>}        title="Delete Lead"    color={C.red}     bg={C.redBg}     onClick={() => remove(item.id)}/>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="crm-cards-mobile" style={{ flexDirection:'column', gap:10, padding:'0.85rem' }}>
            {loading
              ? Array.from({length:3}).map((_,i) => (
                  <div key={i} style={{ padding:'1rem', border:`1px solid ${C.gray200}`, borderRadius:14 }}>
                    <SK w="60%" h={14}/><div style={{height:8}}/><SK w="45%" h={11}/><div style={{height:6}}/><SK w="75%" h={11}/>
                  </div>
                ))
              : rows.length === 0
              ? <div style={{ textAlign:'center', padding:'3rem', color:C.gray400 }}><AlertCircle size={28}/><p style={{marginTop:8}}>No enquiries found</p></div>
              : rows.map(item => {
                  const sc = STATUS_CFG[item.status] || STATUS_CFG['New'];
                  const pri = priorities[item.id] || 'Medium';
                  return (
                    <div key={item.id} onClick={() => { setDrawer(item); setDrawerTab('profile'); }} style={{ padding:'1rem', border:`1px solid ${C.gray200}`, borderRadius:14, background:C.white, cursor:'pointer', display:'flex', flexDirection:'column', gap:10, boxShadow:`0 2px 8px rgba(0,0,0,0.02)` }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:'50%', background:getGrad(item.id), color:C.white, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.72rem', flexShrink:0 }}>{getInitials(item.name)}</div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:'0.9rem' }}>{item.name}</div>
                            <div style={{ fontSize:'0.74rem', color:C.gray400 }}>{item.phone}</div>
                          </div>
                        </div>
                        <StatusBadge status={item.status} size="sm"/>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <div style={{ fontSize:'0.8rem', color:C.gray600 }}>{item.propertyName||'General'}</div>
                        <PriorityBadge priority={pri}/>
                      </div>
                      <div style={{ display:'flex', gap:6 }} onClick={e=>e.stopPropagation()}>
                        <IABtn icon={<Phone size={12}/>}         title="Call"     color={C.blue}    bg={C.blueBg}  href={`tel:${item.phone}`}/>
                        <IABtn icon={<MessageSquare size={12}/>} title="WhatsApp" color={C.emerald} bg={C.emerBg}  href={`https://wa.me/${(item.phone||'').replace(/\D/g,'')}`} target="_blank"/>
                        <IABtn icon={<Mail size={12}/>}          title="Email"    color={C.violet}  bg={C.violetBg} href={`mailto:${item.email}`}/>
                        <IABtn icon={<Trash2 size={12}/>}        title="Delete"   color={C.red}     bg={C.redBg}   onClick={() => remove(item.id)}/>
                      </div>
                    </div>
                  );
              })
            }
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.85rem 1.15rem', borderTop:`1px solid ${C.gray100}`, background:C.gray50 }}>
              <span style={{ fontSize:'0.78rem', color:C.gray400, fontWeight:600 }}>
                {pgStart+1}–{Math.min(pgStart+perPage, sorted.length)} of {sorted.length} leads
              </span>
              <div style={{ display:'flex', gap:4 }}>
                <PgBtn disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={13}/></PgBtn>
                {Array.from({length:Math.min(totalPages,7)}).map((_,i) => {
                  const p = i+1;
                  return <PgBtn key={p} active={page===p} disabled={false} onClick={()=>setPage(p)}>{p}</PgBtn>;
                })}
                {totalPages > 7 && <span style={{padding:'0 4px',lineHeight:'32px',color:C.gray400}}>…</span>}
                <PgBtn disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}><ChevronRight size={13}/></PgBtn>
              </div>
            </div>
          )}
        </div>

        {/* ══ SIDE PANEL ═══════════════════════════════ */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }} className="crm-side-panel">

          {/* Recent Activity */}
          <div className="anim-fade-up" style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:16, padding:'1.1rem', boxShadow:'0 2px 10px rgba(0,0,0,0.02)', animationDelay:'0.12s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:14 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:C.blueBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Activity size={14} color={C.blue}/>
              </div>
              <h3 style={{ margin:0, fontSize:'0.84rem', fontWeight:800, color:C.navy }}>Recent Activity</h3>
            </div>
            {loading
              ? Array.from({length:4}).map((_,i) => <div key={i} style={{ marginBottom:12 }}><SK w="90%" h={11}/><div style={{height:3}}/><SK w="60%" h={9}/></div>)
              : recentActivity.length === 0
              ? <p style={{ fontSize:'0.78rem', color:C.gray400, textAlign:'center', padding:'1.5rem 0', margin:0 }}>No activity yet</p>
              : (
                <div style={{ borderLeft:`2px solid ${C.gray200}`, paddingLeft:14, marginLeft:5, display:'flex', flexDirection:'column', gap:13 }}>
                  {recentActivity.map((a, i) => (
                    <div key={i} style={{ position:'relative' }}>
                      <div style={{ position:'absolute', left:-20, top:4, width:9, height:9, borderRadius:'50%', background:a.color, border:`2px solid ${C.white}`, boxShadow:`0 0 0 2px ${a.color}44` }}/>
                      <p style={{ margin:0, fontSize:'0.77rem', fontWeight:700, color:C.navy, lineHeight:1.4 }}>{a.label}</p>
                      <p style={{ margin:0, fontSize:'0.67rem', color:C.gray400, marginTop:1 }}>{a.time}</p>
                    </div>
                  ))}
                </div>
              )
            }
          </div>

          {/* Pipeline */}
          <div className="anim-fade-up" style={{ background:C.white, border:`1px solid ${C.gray200}`, borderRadius:16, padding:'1.1rem', boxShadow:'0 2px 10px rgba(0,0,0,0.02)', animationDelay:'0.17s' }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:14 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:C.blueBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Zap size={14} color={C.blue}/>
              </div>
              <h3 style={{ margin:0, fontSize:'0.84rem', fontWeight:800, color:C.navy }}>Pipeline</h3>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {STATUS_KEYS.slice(0,6).map(k => {
                const cfg = STATUS_CFG[k];
                const count = enquiries.filter(e => e.status===k).length;
                const pct = enquiries.length ? (count/enquiries.length)*100 : 0;
                return (
                  <div key={k}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:'0.72rem', fontWeight:700, color:C.gray600 }}>
                      <span style={{ display:'flex', alignItems:'center', gap:5 }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:cfg.dot, display:'inline-block', boxShadow:`0 0 4px ${cfg.dot}88` }}/>
                        {cfg.label}
                      </span>
                      <span style={{ fontWeight:800, color:cfg.color }}>{count}</span>
                    </div>
                    <div style={{ height:5, background:C.gray100, borderRadius:999, overflow:'hidden' }}>
                      <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${cfg.dot},${cfg.color})`, borderRadius:999, transition:'width 0.7s cubic-bezier(.4,0,.2,1)' }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ═══ DETAIL DRAWER ══════════════════════════════ */}
      {drawer && (
        <>
          <div className="anim-fade-in" onClick={() => { setDrawer(null); setEditMode(false); }} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.35)', zIndex:9998, backdropFilter:'blur(4px)' }}/>

          <div className="crm-drawer anim-slide-in" style={{
            position:'fixed', top:0, right:0, width:490, maxWidth:'100%', height:'100vh',
            background:C.white, zIndex:9999, display:'flex', flexDirection:'column',
            boxShadow:'-12px 0 50px rgba(15,23,42,0.14)',
            borderLeft:`1px solid ${C.gray200}`,
          }}>
            {/* Drawer Header */}
            <div style={{ padding:'1.15rem 1.4rem', borderBottom:`1px solid ${C.gray100}`, background:C.gray50, display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:'50%', background:getGrad(drawer.id), color:C.white, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.9rem', boxShadow:`0 4px 12px ${C.gray400}44`, flexShrink:0 }}>
                  {getInitials(drawer.name)}
                </div>
                <div>
                  <h3 style={{ margin:0, fontSize:'1rem', fontWeight:800, color:C.navy }}>{drawer.name}</h3>
                  <span style={{ fontSize:'0.7rem', color:C.gray400 }}>Lead #{drawer.id} · {fmtDate(drawer.createdAt)}</span>
                </div>
              </div>
              <button onClick={() => { setDrawer(null); setEditMode(false); }} style={{ background:'none', border:`1px solid ${C.gray200}`, color:C.gray400, cursor:'pointer', padding:6, borderRadius:9, display:'flex', transition:'all 0.15s' }}>
                <X size={16}/>
              </button>
            </div>

            {/* Drawer Tabs */}
            <div style={{ display:'flex', borderBottom:`1px solid ${C.gray100}`, background:C.gray50, flexShrink:0 }}>
              {(['profile','notes','schedule'] as const).map(t => (
                <button key={t} onClick={() => setDrawerTab(t)} style={{
                  flex:1, padding:'0.7rem', border:'none', background:'none', cursor:'pointer',
                  fontWeight:800, fontSize:'0.78rem', textTransform:'capitalize',
                  color: drawerTab===t ? C.blue : C.gray400,
                  borderBottom: drawerTab===t ? `2.5px solid ${C.blue}` : '2.5px solid transparent',
                  transition:'all 0.18s', letterSpacing:'0.01em',
                }}>{t}</button>
              ))}
            </div>

            {/* Drawer Body */}
            <div style={{ flex:1, overflowY:'auto', padding:'1.25rem 1.4rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

              {/* ─ Profile Tab ─────────────────────────── */}
              {drawerTab === 'profile' && (
                <>
                  {/* Status + Edit toggle */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <StatusBadge status={drawer.status}/>
                    <button onClick={() => { setEditMode(v=>!v); if(!editMode) setEditForm({ name:drawer.name, email:drawer.email, phone:drawer.phone, propertyName:drawer.propertyName, notes:drawer.notes, status:drawer.status }); }}
                      style={{ display:'flex', alignItems:'center', gap:5, background:editMode?C.blue:C.gray100, color:editMode?C.white:C.gray600, border:'none', padding:'6px 14px', borderRadius:8, fontSize:'0.78rem', fontWeight:800, cursor:'pointer', transition:'all 0.18s' }}>
                      <Edit2 size={12}/> {editMode ? 'Cancel' : 'Edit Lead'}
                    </button>
                  </div>

                  {editMode ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:12, background:C.gray50, padding:'1rem', borderRadius:14, border:`1px solid ${C.gray200}` }}>
                      {[
                        { label:'Customer Name', key:'name',         type:'text'  },
                        { label:'Phone Number',  key:'phone',        type:'text'  },
                        { label:'Email',         key:'email',        type:'email' },
                        { label:'Property',      key:'propertyName', type:'text'  },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ fontSize:'0.68rem', fontWeight:800, color:C.gray400, display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>{f.label}</label>
                          <input type={f.type} className="form-input" value={editForm[f.key]||''} onChange={e => setEditForm((p: any) => ({...p,[f.key]:e.target.value}))} style={{ fontSize:'0.84rem', borderRadius:10, border:`1.5px solid ${C.gray200}` }}/>
                        </div>
                      ))}
                      <div>
                        <label style={{ fontSize:'0.68rem', fontWeight:800, color:C.gray400, display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>Status</label>
                        <select className="form-input" value={editForm.status||'New'} onChange={e => setEditForm((p: any) => ({...p,status:e.target.value}))} style={{ fontSize:'0.84rem', borderRadius:10 }}>
                          {STATUS_KEYS.map(k => <option key={k} value={k}>{STATUS_CFG[k].label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize:'0.68rem', fontWeight:800, color:C.gray400, display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>Notes</label>
                        <textarea className="form-input" rows={3} value={editForm.notes||''} onChange={e => setEditForm((p: any) => ({...p,notes:e.target.value}))} style={{ fontSize:'0.82rem', borderRadius:10, resize:'vertical' }}/>
                      </div>
                      <button onClick={saveEdit} style={{ background:`linear-gradient(135deg,${C.blue},${C.royal})`, color:C.white, border:'none', padding:'10px', borderRadius:10, fontWeight:800, fontSize:'0.84rem', cursor:'pointer', boxShadow:`0 4px 14px ${C.blue}33` }}>
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Quick actions */}
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                        {[
                          { label:'Call',     href:`tel:${drawer.phone}`,     icon:<Phone size={16}/>,         color:C.blue,    bg:C.blueBg },
                          { label:'WhatsApp', href:`https://wa.me/${(drawer.phone||'').replace(/\D/g,'')}`, icon:<MessageSquare size={16}/>, color:C.emerald, bg:C.emerBg, target:'_blank' },
                          { label:'Email',    href:`mailto:${drawer.email}`,  icon:<Mail size={16}/>,          color:C.violet,  bg:C.violetBg },
                        ].map(btn => (
                          <a key={btn.label} href={btn.href} target={(btn as any).target} rel={(btn as any).target?'noreferrer':undefined}
                            style={{ textDecoration:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'12px 8px', borderRadius:12, background:btn.bg, color:btn.color, fontSize:'0.74rem', fontWeight:800, transition:'all 0.18s', border:`1px solid ${btn.color}18` }}>
                            {btn.icon} {btn.label}
                          </a>
                        ))}
                      </div>

                      {/* Contact details */}
                      <DSec title="Contact Details">
                        <div style={{ background:C.gray50, border:`1px solid ${C.gray200}`, borderRadius:12, overflow:'hidden' }}>
                          {[{ l:'Phone', v:<a href={`tel:${drawer.phone}`} style={{color:C.blue,fontWeight:700,textDecoration:'none'}}>{drawer.phone}</a> }, { l:'Email', v:<a href={`mailto:${drawer.email}`} style={{color:C.violet,fontWeight:700,textDecoration:'none',wordBreak:'break-all'}}>{drawer.email}</a> }].map((row,i) => (
                            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.65rem 0.9rem', borderBottom:i===0?`1px solid ${C.gray100}`:'none', fontSize:'0.82rem' }}>
                              <span style={{ color:C.gray400, fontWeight:600 }}>{row.l}</span>
                              <span>{row.v}</span>
                            </div>
                          ))}
                        </div>
                      </DSec>

                      {/* Property */}
                      <DSec title="Property Interest">
                        <div style={{ display:'flex', alignItems:'flex-start', gap:10, background:`linear-gradient(135deg,${C.blueBg},${C.gray50})`, padding:'0.85rem 1rem', borderRadius:12, border:`1px solid ${C.blueXL}` }}>
                          <div style={{ width:34, height:34, borderRadius:9, background:C.white, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 2px 8px ${C.blueXL}` }}>
                            <Building2 size={16} color={C.blue}/>
                          </div>
                          <div>
                            <p style={{ margin:0, fontWeight:800, fontSize:'0.88rem', color:C.navy }}>{drawer.propertyName||'General Inquiry'}</p>
                            <p style={{ margin:'3px 0 0', fontSize:'0.75rem', color:C.gray400, display:'flex', alignItems:'center', gap:3 }}>
                              <MapPin size={10}/>{drawer.propertyLocation||drawer.property?.location||'Coimbatore, Tamil Nadu'}
                            </p>
                          </div>
                        </div>
                      </DSec>

                      {/* Message */}
                      <DSec title="Enquiry Message">
                        <div style={{ background:C.gray50, border:`1px solid ${C.gray200}`, padding:'0.85rem 1rem', borderRadius:12, fontSize:'0.83rem', lineHeight:1.6, color:C.gray700, minHeight:60, whiteSpace:'pre-wrap' }}>
                          {drawer.notes || <span style={{color:C.gray400,fontStyle:'italic'}}>No message provided.</span>}
                        </div>
                      </DSec>

                      {/* Activity Timeline */}
                      <DSec title="Activity Timeline">
                        <div style={{ borderLeft:`2px solid ${C.gray200}`, paddingLeft:14, marginLeft:5, display:'flex', flexDirection:'column', gap:14 }}>
                          <TLI label="Lead Created" time={drawer.createdAt} dot={C.blueL}/>
                          {drawer.updatedAt && drawer.updatedAt !== drawer.createdAt && (
                            <TLI label={`Status updated → ${drawer.status}`} time={drawer.updatedAt} dot={STATUS_CFG[drawer.status]?.dot||C.gray400}/>
                          )}
                        </div>
                      </DSec>
                    </>
                  )}
                </>
              )}

              {/* ─ Notes Tab ────────────────────────────── */}
              {drawerTab === 'notes' && (
                <>
                  <DSec title="Existing Notes">
                    <div style={{ background:C.gray50, border:`1px solid ${C.gray200}`, padding:'0.85rem 1rem', borderRadius:12, fontSize:'0.83rem', lineHeight:1.6, color:C.gray700, minHeight:70, whiteSpace:'pre-wrap' }}>
                      {drawer.notes || <span style={{color:C.gray400,fontStyle:'italic'}}>No notes yet.</span>}
                    </div>
                  </DSec>
                  <DSec title="Add / Update Note">
                    <textarea className="form-input" rows={5}
                      placeholder="Add internal CRM notes, follow-up remarks, customer feedback…"
                      value={dNote} onChange={e=>setDNote(e.target.value)}
                      style={{ fontSize:'0.83rem', borderRadius:12, resize:'vertical', border:`1.5px solid ${dNote ? C.blue : C.gray200}`, transition:'border-color 0.18s', boxShadow: dNote ? `0 0 0 3px ${C.blue}15` : 'none' }}
                    />
                    <button onClick={saveNote} disabled={!dNote.trim()} style={{
                      alignSelf:'flex-end', background:dNote.trim()?`linear-gradient(135deg,${C.blue},${C.royal})`:'#E2E8F0',
                      color:dNote.trim()?C.white:C.gray400, border:'none', padding:'8px 20px',
                      borderRadius:9, fontWeight:800, fontSize:'0.8rem', cursor:dNote.trim()?'pointer':'not-allowed',
                      boxShadow:dNote.trim()?`0 4px 14px ${C.blue}33`:'none', transition:'all 0.18s',
                    }}>Save Note</button>
                  </DSec>
                </>
              )}

              {/* ─ Schedule Tab ─────────────────────────── */}
              {drawerTab === 'schedule' && (
                <>
                  <DSec title="Schedule Site Visit">
                    <div style={{ background:`linear-gradient(135deg,${C.tealBg},${C.gray50})`, border:`1px solid ${C.teal}22`, padding:'0.85rem 1rem', borderRadius:12, fontSize:'0.82rem', color:C.teal, fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
                      <CalendarCheck size={15}/> Setting a date will mark this lead as "Site Visit Scheduled"
                    </div>
                    <div>
                      <label style={{ fontSize:'0.68rem', fontWeight:800, color:C.gray400, display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>Visit Date</label>
                      <input type="date" className="form-input" value={schedDate} onChange={e=>setSchedDate(e.target.value)} style={{ fontSize:'0.84rem', borderRadius:10 }}/>
                    </div>
                    <div>
                      <label style={{ fontSize:'0.68rem', fontWeight:800, color:C.gray400, display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>Visit Time</label>
                      <input type="time" className="form-input" value={schedTime} onChange={e=>setSchedTime(e.target.value)} style={{ fontSize:'0.84rem', borderRadius:10 }}/>
                    </div>
                    <button onClick={scheduleVisit} disabled={!schedDate||!schedTime} style={{
                      background:schedDate&&schedTime?`linear-gradient(135deg,${C.teal},#0F766E)`:'#E2E8F0',
                      color:schedDate&&schedTime?C.white:C.gray400, border:'none', padding:'10px', borderRadius:10,
                      fontWeight:800, fontSize:'0.84rem', cursor:schedDate&&schedTime?'pointer':'not-allowed',
                      boxShadow:schedDate&&schedTime?`0 4px 14px ${C.teal}33`:'none', transition:'all 0.18s',
                    }}>Confirm Site Visit</button>
                  </DSec>

                  <DSec title="Quick Status Update">
                    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                      {STATUS_KEYS.map(k => {
                        const o = STATUS_CFG[k]; const active = drawer.status===k;
                        return (
                          <button key={k} onClick={() => updateStatus(drawer.id, k)} style={{
                            all:'unset', cursor:'pointer', display:'flex', alignItems:'center', gap:10, width:'100%',
                            padding:'9px 14px', borderRadius:10, boxSizing:'border-box',
                            background: active ? o.gradient : C.white,
                            border:`1.5px solid ${active ? o.dot : C.gray200}`,
                            color:o.color, fontWeight:700, fontSize:'0.82rem', transition:'all 0.18s',
                          }}>
                            <span style={{ width:9, height:9, borderRadius:'50%', background:o.dot, flexShrink:0, boxShadow:active?`0 0 6px ${o.dot}88`:'none' }}/>
                            {o.label}
                            {active && <CheckCircle size={13} style={{marginLeft:'auto'}}/>}
                          </button>
                        );
                      })}
                    </div>
                  </DSec>
                </>
              )}
            </div>

            {/* Drawer Footer */}
            <div style={{ padding:'1rem 1.4rem', borderTop:`1px solid ${C.gray100}`, background:C.gray50, display:'flex', gap:10, flexShrink:0 }}>
              <button onClick={() => remove(drawer.id)} style={{ flex:1, padding:'9px', border:`1.5px solid ${C.red}44`, background:C.white, color:C.red, borderRadius:10, fontWeight:800, fontSize:'0.82rem', cursor:'pointer', transition:'all 0.18s' }}>
                🗑 Delete Lead
              </button>
              <button onClick={() => { setDrawer(null); setEditMode(false); }} style={{ flex:2, padding:'9px', border:'none', background:`linear-gradient(135deg,${C.blue},${C.royal})`, color:C.white, borderRadius:10, fontWeight:800, fontSize:'0.82rem', cursor:'pointer', boxShadow:`0 4px 14px ${C.blue}33`, transition:'all 0.18s' }}>
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* ═══ FLOATING ACTION BUTTON ═════════════════════ */}
      <div ref={fabRef} style={{ position:'fixed', bottom:30, right:30, zIndex:9990 }}>
        {showFAB && (
          <div className="anim-fade-up" style={{ position:'absolute', bottom:'calc(100% + 10px)', right:0, display:'flex', flexDirection:'column', gap:9, alignItems:'flex-end' }}>
            {[
              { label:'Add New Lead',  icon:<Plus size={14}/>,           onClick:()=>{ setAddModal(true); setShowFAB(false); } },
              { label:'Export CSV',    icon:<FileSpreadsheet size={14}/>, onClick:()=>{ exportCSV(); setShowFAB(false); } },
              { label:'Export PDF',    icon:<FileText size={14}/>,        onClick:()=>{ exportPDF(); setShowFAB(false); } },
              { label:'Refresh Data',  icon:<RefreshCw size={14}/>,       onClick:()=>{ fetchData(); setShowFAB(false); } },
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:9 }}>
                <span style={{ background:'rgba(15,23,42,0.88)', backdropFilter:'blur(8px)', color:C.white, padding:'4px 12px', borderRadius:8, fontSize:'0.76rem', fontWeight:700, whiteSpace:'nowrap', border:`1px solid rgba(255,255,255,0.1)` }}>{item.label}</span>
                <button onClick={item.onClick} style={{ width:40, height:40, borderRadius:'50%', background:C.white, border:`1px solid ${C.gray200}`, color:C.blue, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 6px 18px rgba(0,0,0,0.1)', transition:'all 0.18s' }}>
                  {item.icon}
                </button>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setShowFAB(v=>!v)} style={{
          width:56, height:56, borderRadius:'50%',
          background:`linear-gradient(135deg,${C.blue},${C.royal})`,
          border:'none', color:C.white, display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', boxShadow:`0 8px 24px rgba(37,99,235,0.45)`,
          transform: showFAB ? 'rotate(45deg)' : 'none',
          transition:'transform 0.25s cubic-bezier(.4,0,.2,1)',
        }}>
          <Plus size={24}/>
        </button>
      </div>

      {/* ═══ ADD ENQUIRY MODAL ══════════════════════════ */}
      {addModal && (
        <>
          <div className="anim-fade-in" onClick={() => setAddModal(false)} style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.4)', zIndex:99990, backdropFilter:'blur(6px)' }}/>
          <div className="anim-scale-in" style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:480, maxWidth:'92%', background:C.white, borderRadius:22, boxShadow:'0 30px 80px rgba(15,23,42,0.2)', zIndex:99991, overflow:'hidden' }}>
            <div style={{ padding:'1.4rem 1.6rem', background:`linear-gradient(135deg,${C.navy},#1E3A8A)`, color:C.white, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(59,130,246,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}><Plus size={18} color="#93C5FD"/></div>
                <div>
                  <h2 style={{ margin:0, fontSize:'1.05rem', fontWeight:800 }}>Add New Lead</h2>
                  <p style={{ margin:0, fontSize:'0.72rem', color:'#94A3B8' }}>Create a CRM enquiry record</p>
                </div>
              </div>
              <button onClick={() => setAddModal(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', padding:4 }}><X size={18}/></button>
            </div>
            <div style={{ padding:'1.25rem 1.6rem', display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { label:'Customer Name *', key:'name',         type:'text',  ph:'Full name' },
                { label:'Phone Number *',  key:'phone',        type:'text',  ph:'+91 XXXXX XXXXX' },
                { label:'Email Address',   key:'email',        type:'email', ph:'customer@email.com' },
                { label:'Property',        key:'propertyName', type:'text',  ph:'Property name or General Inquiry' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:'0.68rem', fontWeight:800, color:C.gray400, display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>{f.label}</label>
                  <input type={f.type} className="form-input" placeholder={f.ph}
                    value={(addForm as any)[f.key]} onChange={e => setAddForm(p => ({...p,[f.key]:e.target.value}))}
                    style={{ fontSize:'0.84rem', borderRadius:10, border:`1.5px solid ${C.gray200}` }}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:'0.68rem', fontWeight:800, color:C.gray400, display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>Notes</label>
                <textarea className="form-input" rows={3} placeholder="Customer remarks or internal notes…" value={addForm.notes} onChange={e => setAddForm(p => ({...p,notes:e.target.value}))} style={{ fontSize:'0.84rem', borderRadius:10 }}/>
              </div>
              <div>
                <label style={{ fontSize:'0.68rem', fontWeight:800, color:C.gray400, display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.05em' }}>Initial Status</label>
                <select className="form-input" value={addForm.status} onChange={e => setAddForm(p => ({...p,status:e.target.value}))} style={{ fontSize:'0.84rem', borderRadius:10 }}>
                  {STATUS_KEYS.map(k => <option key={k} value={k}>{STATUS_CFG[k].label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ padding:'0.9rem 1.6rem', borderTop:`1px solid ${C.gray100}`, display:'flex', gap:10, justifyContent:'flex-end', background:C.gray50 }}>
              <button onClick={() => setAddModal(false)} style={{ padding:'9px 22px', border:`1px solid ${C.gray200}`, background:C.white, color:C.gray600, borderRadius:10, fontWeight:700, fontSize:'0.82rem', cursor:'pointer' }}>Cancel</button>
              <button onClick={addEnquiry} disabled={!addForm.name||!addForm.phone} style={{
                padding:'9px 26px', border:'none',
                background:addForm.name&&addForm.phone?`linear-gradient(135deg,${C.blue},${C.royal})`:'#E2E8F0',
                color:addForm.name&&addForm.phone?C.white:C.gray400, borderRadius:10, fontWeight:800, fontSize:'0.84rem',
                cursor:addForm.name&&addForm.phone?'pointer':'not-allowed',
                boxShadow:addForm.name&&addForm.phone?`0 4px 14px ${C.blue}33`:'none', transition:'all 0.18s',
              }}>Add Lead</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
