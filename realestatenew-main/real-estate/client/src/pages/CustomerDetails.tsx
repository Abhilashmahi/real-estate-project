import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    type: 'Villa',
    location: 'Coimbatore',
    budget: '',
    message: '',
    status: 'New',
    source: 'Website',
    date: '',
    nextFollowUp: '',
    remarks: ''
  });

  useEffect(() => {
    const fetchEnquiryDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`https://real-estate-backend-9qqo.onrender.com/api/enquiries/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            name: data.name || '',
            mobile: data.phone || data.mobile || '',
            email: data.email || '',
            type: data.propertyName || data.property || data.type || 'Villa',
            location: data.location || 'Coimbatore',
            budget: data.budget || '',
            message: data.notes || data.message || '',
            status: data.status || 'New',
            source: data.source || 'Website',
            date: data.createdAt ? new Date(data.createdAt).toLocaleString() : '',
            nextFollowUp: '',
            remarks: ''
          });
        } else {
          alert('Enquiry not found.');
          navigate('/admin/enquiries');
        }
      } catch (error) {
        console.error('Error fetching enquiry details:', error);
        alert('An error occurred loading enquiry details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiryDetails();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      // 1. Update enquiry details
      const response = await fetch(`https://real-estate-backend-9qqo.onrender.com/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          property: formData.type,
          notes: formData.message,
          status: formData.status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update enquiry.');
      }

      // 2. If a next follow-up date is set, create a Follow-up record
      if (formData.nextFollowUp) {
        const fResponse = await fetch('https://real-estate-backend-9qqo.onrender.com/api/followups', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            client: formData.name,
            type: 'Scheduled',
            date: formData.nextFollowUp,
            property: formData.type,
            notes: formData.remarks || `Follow up on enquiry regarding ${formData.type}`
          })
        });
        if (!fResponse.ok) {
          console.error('Failed to create follow-up task.');
        }
      }

      alert('Changes saved successfully!');
      navigate('/admin/enquiries');
    } catch (error: any) {
      console.error('Error saving enquiry changes:', error);
      alert(error.message || 'An error occurred while saving.');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading enquiry details...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Enquiry Details</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Dashboard / Enquiries / Details</p>
      </div>

      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div className="responsive-form-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input type="text" name="mobile" className="form-input" value={formData.mobile} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Property Type</label>
            <select name="type" className="form-input" value={formData.type} onChange={handleChange}>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Plot">Plot</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Location</label>
            <input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Budget</label>
            <input type="text" name="budget" className="form-input" value={formData.budget} onChange={handleChange} />
          </div>

          <div className="form-group span-2" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Message</label>
            <textarea name="message" className="form-input" rows={2} value={formData.message} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Source</label>
            <input type="text" name="source" className="form-input" value={formData.source} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Enquiry Date</label>
            <input type="text" name="date" className="form-input" value={formData.date} readOnly style={{ backgroundColor: '#f8fafc', color: '#64748b' }} />
          </div>

          <div className="form-group">
            <label className="form-label">Next Follow-up Date</label>
            <input type="date" name="nextFollowUp" className="form-input" value={formData.nextFollowUp} onChange={handleChange} />
          </div>

          <div className="form-group span-2" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Remarks</label>
            <input type="text" name="remarks" className="form-input" value={formData.remarks} onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <button type="submit" className="btn btn-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
            Save Changes
          </button>
          <Link to="/admin/enquiries" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
