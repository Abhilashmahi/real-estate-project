import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Plus, 
  Save 
} from 'lucide-react';

export default function FollowUps() {
  const [followups, setFollowups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    notes: '',
    nextFollowupDate: '',
    status: 'Pending',
    completed: false,
    parentStatus: 'Follow-up'
  });

  const fetchFollowups = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://real-estate-backend-9qqo.onrender.com/api/followups', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFollowups(data);
      } else {
        setError('Failed to fetch follow-ups from CRM.');
      }
    } catch (err) {
      console.error('Error fetching follow-ups:', err);
      setError('Network error. Unable to load follow-up schedules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, []);

  const handleToggleComplete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://real-estate-backend-9qqo.onrender.com/api/followups/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setSuccessMessage('Follow-up task completion toggled.');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchFollowups();
      } else {
        alert('Failed to update follow-up status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({
      notes: item.notes || '',
      nextFollowupDate: item.date === 'Not Scheduled' ? '' : item.date,
      status: item.status || 'Pending',
      completed: item.completed || false,
      parentStatus: item.type || 'Follow-up'
    });
  };

  const handleSaveEdit = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://real-estate-backend-9qqo.onrender.com/api/followups/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          notes: editForm.notes,
          nextFollowupDate: editForm.nextFollowupDate,
          status: editForm.status,
          completed: editForm.completed,
          parentStatus: editForm.parentStatus
        })
      });
      if (response.ok) {
        setSuccessMessage('Follow-up details updated successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
        setEditingId(null);
        fetchFollowups();
      } else {
        alert('Failed to save follow-up details.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFollowup = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this follow-up schedule? The parent enquiry status will revert back.')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://real-estate-backend-9qqo.onrender.com/api/followups/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setSuccessMessage('Follow-up task deleted successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchFollowups();
      } else {
        alert('Failed to delete follow-up.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
        <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Loading follow-up pipeline...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'Poppins, sans-serif', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Follow-up Action Pipeline</h1>
          <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>Dashboard / Follow-up Tasks</p>
        </div>
      </div>

      {successMessage && (
        <div style={{
          background: '#ECFDF5',
          border: '1.5px solid #10B981',
          color: '#065F46',
          borderRadius: '10px',
          padding: '1rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 12px rgba(16,185,129,0.08)',
        }}>
          <span style={{ fontSize: '1.2rem' }}>✓</span>
          {successMessage}
        </div>
      )}

      {/* Main Table Container */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div className="table-container" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Customer Lead</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Property</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Date Track</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Follow-up Notes / Action</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Pipeline Status</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {followups.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem', color: '#94A3B8', fontSize: '0.9rem' }}>
                    No leads marked for Follow-up yet. Set status of any enquiry to "Follow-up" to start tracking.
                  </td>
                </tr>
              ) : followups.map(item => {
                const isEditing = editingId === item.id;
                return (
                  <tr key={item.id} style={{ 
                    borderBottom: '1px solid #F1F5F9',
                    opacity: item.completed ? 0.75 : 1,
                    textDecoration: item.completed ? 'line-through' : 'none'
                  }}>
                    {/* Customer Info */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>{item.client}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.2rem' }}>
                        <span>📞 {item.phone}</span>
                        <span>✉️ {item.email}</span>
                      </div>
                    </td>

                    {/* Property */}
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                      {item.property}
                    </td>

                    {/* Dates */}
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.82rem' }}>
                      <div style={{ color: '#64748B' }}>Created: {item.followupDate}</div>
                      <div style={{ marginTop: '0.2rem' }}>
                        {isEditing ? (
                          <input 
                            type="date"
                            value={editForm.nextFollowupDate}
                            onChange={e => setEditForm(prev => ({ ...prev, nextFollowupDate: e.target.value }))}
                            style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.8rem', outline: 'none' }}
                          />
                        ) : (
                          <strong style={{ color: item.date !== 'Not Scheduled' ? '#2563EB' : '#94A3B8' }}>
                            Next: {item.date}
                          </strong>
                        )}
                      </div>
                    </td>

                    {/* Notes */}
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem' }}>
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={editForm.notes}
                          onChange={e => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                          style={{ width: '100%', minWidth: '180px', padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontFamily: 'inherit', fontSize: '0.82rem' }}
                        />
                      ) : (
                        <span style={{ color: '#475569', display: 'block', maxWidth: '240px', wordBreak: 'break-word' }}>
                          {item.notes || '—'}
                        </span>
                      )}
                    </td>

                    {/* Status badges */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                        {isEditing ? (
                          <select
                            value={editForm.parentStatus}
                            onChange={e => setEditForm(prev => ({ ...prev, parentStatus: e.target.value }))}
                            style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                          >
                            <option value="Follow-up">Follow-up</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                            <option value="Closed">Closed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        ) : (
                          <span style={{ 
                            background: item.type === 'Closed' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', 
                            color: item.type === 'Closed' ? '#22C55E' : '#F59E0B', 
                            padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' 
                          }}>
                            {item.type}
                          </span>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                          <input 
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggleComplete(item.id)}
                            style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '0.75rem', color: item.completed ? '#22C55E' : '#64748B', fontWeight: 600 }}>
                            {item.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                        {isEditing ? (
                          <>
                            <button 
                              onClick={() => handleSaveEdit(item.id)}
                              style={{ padding: '0.4rem', background: '#22C55E', border: 'none', borderRadius: '6px', color: '#FFFFFF', cursor: 'pointer' }}
                            >
                              <Save size={14} />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              style={{ padding: '0.4rem', background: '#EF4444', border: 'none', borderRadius: '6px', color: '#FFFFFF', cursor: 'pointer' }}
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleStartEdit(item)}
                              style={{ padding: '0.4rem', background: '#F1F5F9', border: '1.5px solid #CBD5E1', borderRadius: '6px', color: '#475569', cursor: 'pointer' }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteFollowup(item.id)}
                              style={{ padding: '0.4rem', background: '#F1F5F9', border: '1.5px solid #EF4444', borderRadius: '6px', color: '#EF4444', cursor: 'pointer' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
