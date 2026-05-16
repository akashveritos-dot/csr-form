import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Settings, 
  LogOut,
  Trash2,
  Send,
  Eye,
  Edit3
} from 'lucide-react';
import API_BASE_URL from './apiConfig';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const token = localStorage.getItem('adminToken');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [formConfig, setFormConfig] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State
  const [editingStepIndex, setEditingStepIndex] = useState(null);
  const [tempStep, setTempStep] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setSubmissions(data.submissions);
    } catch {
      console.error('Failed to fetch submissions');
    }
  }, [token]);

  const fetchCurrentConfig = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/form/config/latest`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setFormConfig(data.config);
    } catch (err) {
      console.error('Config fetch error:', err);
    }
  }, [token]);

  const [draftHistory, setDraftHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fetchDraftHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/form/config/drafts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setDraftHistory(data.drafts);
    } catch {
      console.error('Failed to fetch draft history');
    }
  }, [token]);

  const [confirmState, setConfirmState] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: null, 
    type: 'primary' 
  });

  const showConfirm = (title, message, onConfirm, type = 'primary') => {
    setConfirmState({ isOpen: true, title, message, onConfirm, type });
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    
    const loadData = async () => {
      await fetchSubmissions();
      if (activeTab === 'builder') {
        await fetchCurrentConfig();
        await fetchDraftHistory();
      }
    };
    
    loadData();
  }, [isLoggedIn, activeTab, fetchSubmissions, fetchCurrentConfig, fetchDraftHistory]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
      } else {
        alert('Invalid credentials');
      }
    } catch {
      alert('Login failed');
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/submissions/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchSubmissions();
    } catch {
      console.error('Failed to mark as read');
    }
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/form/config`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ config: formConfig, status: 'draft' })
      });
      const data = await response.json();
      if (data.success) alert('Draft saved successfully!');
    } catch {
      alert('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file, callback) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        callback(data.imageUrl);
      } else {
        alert('Upload failed');
      }
    } catch {
      alert('Error uploading file');
    }
  };

  const restoreDraft = (id) => {
    showConfirm(
      'Restore Version?', 
      'This will replace your current builder state with this previous version. Any unsaved changes will be lost.', 
      async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/admin/form/config/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.success) {
            setFormConfig(data.config);
            setShowHistoryModal(false);
          }
        } catch {
          alert('Failed to restore');
        }
      },
      'warning'
    );
  };

  const publishConfig = () => {
    showConfirm(
      'Publish Live?',
      'Are you sure? This will update the LIVE form for all users immediately. This action cannot be undone easily.',
      async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/admin/form/config`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ config: formConfig, status: 'published' })
          });
          const data = await response.json();
          if (data.success) alert('Published LIVE!');
        } catch {
          alert('Failed to publish');
        }
      },
      'danger'
    );
  };

  const handlePreview = async () => {
    await saveDraft();
    window.open('/?preview=true', '_blank');
  };

  // Builder Actions
  const openEditModal = (index) => {
    setEditingStepIndex(index);
    setTempStep(JSON.parse(JSON.stringify(formConfig.steps[index])));
  };

  const saveStepChanges = () => {
    showConfirm(
      'Save Step Changes?',
      'Are you sure you want to apply these changes to the step?',
      () => {
        const newConfig = { ...formConfig };
        newConfig.steps[editingStepIndex] = tempStep;
        setFormConfig(newConfig);
        setEditingStepIndex(null);
        setTempStep(null);
      }
    );
  };

  const addStep = (type) => {
    const newConfig = { ...formConfig };
    const newStep = { 
      type, 
      title: type === 'event' ? 'New Event Showcase' : 'New Form Step',
      image: ''
    };

    if (type === 'form') {
      newStep.fields = [{ id: 'field_' + Date.now(), label: 'New Question', type: 'text', required: true }];
    } else if (type === 'event') {
      newStep.id = 'event_' + Date.now();
      newStep.tag = 'Highlight';
      newStep.title = 'Premium Event Title';
      newStep.images = ['https://via.placeholder.com/800x400'];
    } else if (type === 'package_select') {
      newStep.type = 'form';
      newStep.fields = [{ id: 'selected_package', label: 'Select Package', type: 'package_select' }];
      newStep.packages = [
        { id: 'silver', name: 'Silver', price: '₹2 Lakhs', features: ['Feature A', 'Feature B'] },
        { id: 'gold', name: 'Gold', price: '₹5 Lakhs', features: ['Feature A', 'Feature B', 'Feature C'] }
      ];
    }
    
    newConfig.steps.splice(newConfig.steps.length - 2, 0, newStep);
    setFormConfig(newConfig);
    alert('Added! Click "Edit" on the new step to customize it.');
  };

  const deleteStep = (index) => {
    showConfirm(
      'Delete Step?',
      'Are you sure you want to PERMANENTLY remove this step? This cannot be undone.',
      () => {
        const newConfig = { ...formConfig };
        newConfig.steps.splice(index, 1);
        setFormConfig(newConfig);
      },
      'danger'
    );
  };

  const changeOrder = (oldIdx, newIdx) => {
    const newConfig = { ...formConfig };
    const [moved] = newConfig.steps.splice(oldIdx, 1);
    newConfig.steps.splice(newIdx, 0, moved);
    setFormConfig(newConfig);
  };

  const [subTab, setSubTab] = useState('new');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toUpperCase();
  };

  const filteredSubmissions = submissions.filter(s => subTab === 'new' ? !s.is_read : true);

  if (!isLoggedIn) {
    return (
      <div className="form-container" style={{ minHeight: '100vh', justifyContent: 'center', padding: '1rem' }}>
        <div className="package-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <img src="https://thecsruniverse.com/assets/images/logo.png" alt="CSR" style={{ height: '40px', marginBottom: '2rem' }} />
          <h2 style={{ marginBottom: '1.5rem' }}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input type="text" className="input-field" placeholder="Username" style={{ marginBottom: '1rem' }} value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})} />
            <input type="password" className="input-field" placeholder="Password" style={{ marginBottom: '1.5rem' }} value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
            <button className="btn-primary" type="submit">Login to Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Mobile Header */}
      <div style={{ display: window.innerWidth <= 768 ? 'flex' : 'none', position: 'fixed', top: 0, left: 0, right: 0, height: '60px', background: '#fff', borderBottom: '1px solid #e2e8f0', zIndex: 1000, padding: '0 1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="https://thecsruniverse.com/assets/images/logo.png" alt="Logo" style={{ height: '25px' }} />
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '1.5rem' }}>☰</button>
      </div>

      {/* Sidebar */}
      <div style={{ width: '280px', background: '#fff', borderRight: '1px solid #e2e8f0', padding: '2rem 1.5rem', display: isSidebarOpen ? 'flex' : 'none', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 1001 }}>
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between' }}>
          <img src="https://thecsruniverse.com/assets/images/logo.png" alt="CSR" style={{ height: '35px' }} />
          {window.innerWidth <= 768 && <button onClick={() => setIsSidebarOpen(false)} style={{ border: 'none', background: 'none' }}>✕</button>}
        </div>
        <nav style={{ flex: 1 }}>
          <SidebarItem icon={<Users size={20} />} label="Submissions" active={activeTab === 'submissions'} onClick={() => setActiveTab('submissions')} />
          <SidebarItem icon={<Settings size={20} />} label="Form Builder" active={activeTab === 'builder'} onClick={() => setActiveTab('builder')} />
        </nav>
        <button className="btn-secondary" onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }} style={{ width: '100%', justifyContent: 'flex-start', display: 'flex', gap: '10px' }}><LogOut size={18} /> Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: window.innerWidth <= 768 ? '80px 1rem 2rem' : '3rem', marginLeft: window.innerWidth > 768 ? '280px' : '0', minHeight: '100vh' }}>
        {activeTab === 'submissions' && (
          <div>
            <h1>Partnership Requests</h1>
            <div style={{ display: 'flex', background: '#fff', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0', width: 'fit-content', margin: '1.5rem 0' }}>
              <button onClick={() => setSubTab('new')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: subTab === 'new' ? '#4cac48' : 'transparent', color: subTab === 'new' ? '#fff' : '#64748b', cursor: 'pointer', fontWeight: 600 }}>New ({submissions.filter(s => !s.is_read).length})</button>
              <button onClick={() => setSubTab('all')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: subTab === 'all' ? '#4cac48' : 'transparent', color: subTab === 'all' ? '#fff' : '#64748b', cursor: 'pointer', fontWeight: 600 }}>History</button>
            </div>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {filteredSubmissions.map((sub) => {
                const data = JSON.parse(sub.submission_data);
                return (
                  <div key={sub.id} className="package-card" style={{ padding: '1.5rem', borderLeft: sub.is_read ? '4px solid #e2e8f0' : '4px solid #4cac48', background: '#fff', textAlign: 'left' }}>
                    <div style={{ marginBottom: '1.2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.8rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>
                        {data.name || data.full_name || data.contact_person || 'New Partnership Lead'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', fontWeight: 600 }}>
                        {formatDateTime(sub.created_at)}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      {Object.entries(data).map(([k, v]) => (
                        <div key={k}>
                          <div style={{ fontSize: '0.6rem', color: '#94a3b8', letterSpacing: '0.5px' }}>{k.replace(/_/g, ' ').toUpperCase()}</div>
                          <div style={{ fontWeight: 500, fontSize: '0.85rem', color: '#334155' }}>{String(v)}</div>
                        </div>
                      ))}
                    </div>

                    {!sub.is_read && (
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
                        <button 
                          className="btn-primary" 
                          onClick={() => markAsRead(sub.id)} 
                          style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '8px', width: window.innerWidth <= 768 ? '100%' : 'auto' }}
                        >
                          Mark as Read
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'builder' && formConfig && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1>Form Builder</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', cursor: 'pointer' }} onClick={() => setShowHistoryModal(true)}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4cac48' }}></div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>{(draftHistory || []).length} Saved Versions</span>
                  <Eye size={14} color="#64748b" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secondary" onClick={handlePreview}><Eye size={16} /> Preview</button>
                <button className="btn-secondary" onClick={saveDraft} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                <button className="btn-primary" onClick={publishConfig} style={{ background: '#0ea5e9' }}><Send size={16} /> Publish</button>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {formConfig.steps.map((step, sIdx) => (
                <div key={sIdx} className="package-card" style={{ background: '#fff', textAlign: 'left', padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <select value={sIdx} onChange={(e) => changeOrder(sIdx, parseInt(e.target.value))} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px' }}>
                      {formConfig.steps.map((_, idx) => <option key={idx} value={idx}>{idx + 1}</option>)}
                    </select>
                    <span style={{ fontWeight: 700, color: '#4cac48', textTransform: 'uppercase', fontSize: '0.75rem' }}>{step.type}</span>
                    <span style={{ color: '#1e293b', fontWeight: 600 }}>{step.title || (step.fields?.[0]?.label) || 'Untitled Step'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => openEditModal(sIdx)} className="btn-secondary" style={{ padding: '6px 15px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><Edit3 size={14} /> Edit</button>
                    <button onClick={() => deleteStep(sIdx)} style={{ border: 'none', background: 'none', color: '#ef4444' }}><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => addStep('form')} className="btn-secondary" style={{ flex: 1, borderStyle: 'dashed' }}>+ Add Question</button>
                <button onClick={() => addStep('event')} className="btn-secondary" style={{ flex: 1, borderStyle: 'dashed' }}>+ Add Event</button>
                <button onClick={() => addStep('package_select')} className="btn-secondary" style={{ flex: 1, borderStyle: 'dashed' }}>+ Add Packages</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {editingStepIndex !== null && tempStep && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '650px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <h2>Edit Step #{editingStepIndex + 1}</h2>
              <button onClick={() => setEditingStepIndex(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div><label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Step Title</label><input className="input-field" value={tempStep.title || ''} onChange={(e) => setTempStep({...tempStep, title: e.target.value})} /></div>
              {tempStep.type === 'hero' && <div><label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Description</label><textarea className="input-field" rows="3" value={tempStep.description || ''} onChange={(e) => setTempStep({...tempStep, description: e.target.value})} /></div>}
              {tempStep.fields && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '1rem' }}>Fields</label>
                  {tempStep.fields.map((field, fIdx) => (
                    <div key={fIdx} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #eef2f6' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '10px' }}>
                        <input className="input-field" placeholder="Label" value={field.label} onChange={(e) => { const ns = {...tempStep}; ns.fields[fIdx].label = e.target.value; setTempStep(ns); }} />
                        <select className="input-field" value={field.type} onChange={(e) => { const ns = {...tempStep}; ns.fields[fIdx].type = e.target.value; setTempStep(ns); }}>
                          <option value="text">Text</option><option value="email">Email</option><option value="tel">Phone</option><option value="textarea">Large Text</option><option value="package_select">Package Selection</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label style={{ fontSize: '0.8rem' }}><input type="checkbox" checked={field.required} onChange={(e) => { const ns = {...tempStep}; ns.fields[fIdx].required = e.target.checked; setTempStep(ns); }} /> Required</label>
                        <button onClick={() => { const ns = {...tempStep}; ns.fields.splice(fIdx, 1); setTempStep(ns); }} style={{ color: '#ef4444', border: 'none', background: 'none', fontSize: '0.75rem' }}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => { const ns = {...tempStep}; ns.fields.push({ id: 'f_'+Date.now(), label: 'New Question', type: 'text', required: true }); setTempStep(ns); }} className="btn-secondary" style={{ width: '100%', borderStyle: 'dashed' }}>+ Add Question</button>
                </div>
              )}
              {tempStep.packages && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Packages</label>
                  {tempStep.packages.map((pkg, pIdx) => (
                    <div key={pIdx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', marginTop: '1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input className="input-field" placeholder="Name" value={pkg.name} onChange={(e) => { const ns = {...tempStep}; ns.packages[pIdx].name = e.target.value; setTempStep(ns); }} />
                        <input className="input-field" placeholder="Price" value={pkg.price} onChange={(e) => { const ns = {...tempStep}; ns.packages[pIdx].price = e.target.value; setTempStep(ns); }} />
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        {pkg.features.map((feat, fIdx) => (
                          <div key={fIdx} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                            <input className="input-field" value={feat} style={{ fontSize: '0.8rem', padding: '5px' }} onChange={(e) => { const ns = {...tempStep}; ns.packages[pIdx].features[fIdx] = e.target.value; setTempStep(ns); }} />
                            <button onClick={() => { const ns = {...tempStep}; ns.packages[pIdx].features.splice(fIdx, 1); setTempStep(ns); }} style={{ border: 'none', color: '#ef4444' }}>✕</button>
                          </div>
                        ))}
                        <button onClick={() => { const ns = {...tempStep}; ns.packages[pIdx].features.push('New Feature'); setTempStep(ns); }} className="btn-secondary" style={{ width: '100%', fontSize: '0.7rem' }}>+ Add Feature</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Event Showcase Detailed Editing */}
              {tempStep.type === 'event' && (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Event Title</label>
                      <input className="input-field" value={tempStep.title || ''} onChange={(e) => setTempStep({...tempStep, title: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Event Tag (e.g. SICA'25)</label>
                      <input className="input-field" value={tempStep.tag || ''} onChange={(e) => setTempStep({...tempStep, tag: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Event Subtitle / Hook Line</label>
                    <input className="input-field" value={tempStep.subtitle || ''} onChange={(e) => setTempStep({...tempStep, subtitle: e.target.value})} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Main Hero Image (Direct Upload or URL)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input className="input-field" value={tempStep.image || ''} placeholder="Paste URL or Upload" onChange={(e) => setTempStep({...tempStep, image: e.target.value})} />
                      <button className="btn-secondary" onClick={() => document.getElementById('main-upload').click()}>Upload</button>
                      <input id="main-upload" type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files[0], (url) => setTempStep({...tempStep, image: url}))} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Detailed Content / Description</label>
                    <textarea className="input-field" rows="3" value={tempStep.description || ''} onChange={(e) => setTempStep({...tempStep, description: e.target.value})} />
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eef2f6' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '1rem', textTransform: 'uppercase' }}>Other Gallery Images</label>
                    {(tempStep.images || []).map((img, iIdx) => (
                      <div key={iIdx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ flex: 1, display: 'flex', gap: '5px' }}>
                          <input className="input-field" style={{ background: '#fff' }} placeholder="Image URL" value={img} onChange={(e) => {
                            const ns = {...tempStep}; ns.images[iIdx] = e.target.value; setTempStep(ns);
                          }} />
                          <button className="btn-secondary" style={{ padding: '0 10px', fontSize: '0.7rem' }} onClick={() => document.getElementById(`gal-${iIdx}`).click()}>↑</button>
                          <input id={`gal-${iIdx}`} type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files[0], (url) => {
                            const ns = {...tempStep}; ns.images[iIdx] = url; setTempStep(ns);
                          })} />
                        </div>
                        <button onClick={() => {
                          const ns = {...tempStep}; ns.images.splice(iIdx, 1); setTempStep(ns);
                        }} style={{ color: '#ef4444', border: 'none', background: 'none' }}>✕</button>
                      </div>
                    ))}
                    <button onClick={() => {
                      const ns = {...tempStep};
                      if (!ns.images) ns.images = [];
                      ns.images.push('');
                      setTempStep(ns);
                    }} className="btn-secondary" style={{ width: '100%', fontSize: '0.8rem', borderStyle: 'dashed', background: '#fff' }}>+ Add Gallery Image Placeholder</button>
                  </div>
                </div>
              )}

              {/* Global Image URL for other types */}
              {tempStep.type !== 'event' && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>Background / Hero Image (Direct Upload or URL)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input className="input-field" value={tempStep.image || ''} onChange={(e) => setTempStep({...tempStep, image: e.target.value})} />
                    <button className="btn-secondary" onClick={() => document.getElementById('bg-upload').click()}>Upload</button>
                    <input id="bg-upload" type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e.target.files[0], (url) => setTempStep({...tempStep, image: url}))} />
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditingStepIndex(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={saveStepChanges}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      {/* DRAFT HISTORY MODAL */}
      {showHistoryModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '24px', maxHeight: '80vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <h3>Version History</h3>
              <button onClick={() => setShowHistoryModal(false)} style={{ border: 'none', background: 'none' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {draftHistory.map((d) => (
                <div key={d.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{d.status.toUpperCase()} v{d.id}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatDateTime(d.updated_at)}</div>
                  </div>
                  <button className="btn-secondary" onClick={() => restoreDraft(d.id)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Restore</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* PREMIUM CONFIRMATION MODAL */}
      {confirmState.isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', animation: 'fadeIn 0.3s' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '400px', borderRadius: '32px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '20px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: confirmState.type === 'danger' ? '#fee2e2' : confirmState.type === 'warning' ? '#fef3c7' : '#f0fdf4',
              color: confirmState.type === 'danger' ? '#ef4444' : confirmState.type === 'warning' ? '#f59e0b' : '#22c55e'
            }}>
              {confirmState.type === 'danger' ? '⚠️' : '🔔'}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{confirmState.title}</h2>
            <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '2rem', lineHeight: '1.5' }}>{confirmState.message}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button className="btn-secondary" onClick={() => setConfirmState({...confirmState, isOpen: false})} style={{ padding: '1rem', borderRadius: '16px' }}>Cancel</button>
              <button 
                className="btn-primary" 
                style={{ 
                  padding: '1rem', borderRadius: '16px', 
                  background: confirmState.type === 'danger' ? '#ef4444' : confirmState.type === 'warning' ? '#f59e0b' : 'var(--primary-color)' 
                }}
                onClick={() => {
                  confirmState.onConfirm();
                  setConfirmState({...confirmState, isOpen: false});
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px', cursor: 'pointer', marginBottom: '0.5rem', background: active ? 'rgba(76, 172, 72, 0.05)' : 'transparent', color: active ? '#4cac48' : '#64748b', fontWeight: active ? 700 : 500, transition: 'all 0.3s ease' }}>{icon} {label}</div>
);

export default AdminDashboard;
