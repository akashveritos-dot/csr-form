import { useState, useEffect, useCallback } from 'react';
import { 
  HeroStep, 
  EmailStep, 
  NameStep, 
  DesignationStep, 
  PhoneStep, 
  OrganizationStep, 
  PackageSelectionStep, 
  CustomQueryStep, 
  FinalReviewStep, 
  SuccessStep,
  DynamicEventStep
} from './Steps';
import API_BASE_URL from './apiConfig';

const FALLBACK_CONFIG = {
  steps: [
    { type: "hero", title: "Partner With Us", description: "Amplify Your Social Impact Through India’s Leading CSR & Sustainability Media Ecosystem" },
    { type: "form", fields: [{ id: "email", label: "Enter Your Email Address", type: "email", required: true }] },
    { type: "form", fields: [{ id: "full_name", label: "What’s Your Full Name?", type: "text", required: true }] },
    { 
      type: "event", 
      id: "sica25", 
      tag: "Past Event Spotlight", 
      title: "SICA’25", 
      subtitle: "5th Social Impact Conference & Awards 2025",
      description: "A flagship national conference bringing together CSR leaders and NGOs to drive social transformation across India.",
      image: "https://thecsruniverse.com/assets/images/sica_hero.jpg",
      images: [
        "https://via.placeholder.com/400x400?text=SICA+1",
        "https://via.placeholder.com/400x400?text=SICA+2",
        "https://via.placeholder.com/400x400?text=SICA+3"
      ]
    },
    { type: "form", fields: [{ id: "designation", label: "What’s Your Designation?", type: "text", required: true }] },
    { 
      type: "event", 
      id: "casca26", 
      tag: "Upcoming Spotlight", 
      title: "CASCA’26", 
      subtitle: "Climate Action & Sustainability Conference & Awards 2026",
      description: "Connecting environmental leaders to drive conversations around climate action and sustainable growth.",
      image: "https://thecsruniverse.com/assets/images/casca_hero.jpg",
      images: [
        "https://via.placeholder.com/400x400?text=CASCA+1",
        "https://via.placeholder.com/400x400?text=CASCA+2"
      ]
    },
    { type: "form", fields: [{ id: "phone_number", label: "Enter Your Phone Number", type: "tel", required: true }] },
    { type: "form", fields: [{ id: "organization_name", label: "Organisation / Company Name", type: "text", required: true }] },
    { 
      type: "form", 
      fields: [{ id: "selected_package", label: "Select a Partnership Package", type: "package_select", required: true }],
      packages: [
        { id: "p1", name: "1 Month Coverage", price: "₹15,000 + GST", features: ["2 News", "1 Interview", "Social Media Promotion"] },
        { id: "p2", name: "4 Month Coverage", price: "₹40,000 + GST", features: ["4 News", "1 Video Interview", "Opinion Piece", "Delegate Pass"] },
        { id: "p3", name: "Event Media Partnership", price: "₹50,000 + GST", features: ["Pre/During/Post Event Coverage", "Editorial Support"] }
      ]
    },
    { type: "form", fields: [{ id: "custom_query", label: "Exploring Customized Partnership?", type: "textarea", required: false }] },
    { type: "review", title: "Review Your Details" },
    { type: "success", title: "Application Received" }
  ]
};

const FormEngine = () => {
  const [config, setConfig] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true';
    return isPreview ? null : FALLBACK_CONFIG;
  });
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const [isEditingFromReview, setIsEditingFromReview] = useState(false);
  const [formData, setFormData] = useState(() => {
    const initial = {};
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true';
    if (!isPreview) {
      FALLBACK_CONFIG.steps.forEach(s => {
        if (s.fields) s.fields.forEach(f => initial[f.id] = '');
      });
    }
    return initial;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formVersion, setFormVersion] = useState(1);

  const fetchConfig = useCallback(async () => {
    try {
      setError(null);
      const urlParams = new URLSearchParams(window.location.search);
      const isPreview = urlParams.get('preview') === 'true';
      const token = localStorage.getItem('adminToken');

      let endpoint = `${API_BASE_URL}/api/form/config?t=${Date.now()}`;
      let headers = {};

      if (isPreview && token) {
        endpoint = `${API_BASE_URL}/api/admin/form/config/latest?t=${Date.now()}`;
        headers = { 'Authorization': `Bearer ${token}` };
      }

      const response = await fetch(endpoint, { headers });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setConfig(data.config);
        setFormVersion(data.version);
        setFormData(prev => {
          const initial = { ...prev };
          data.config.steps.forEach(s => {
            if (s.fields) {
              s.fields.forEach(f => {
                if (initial[f.id] === undefined) {
                  initial[f.id] = '';
                }
              });
            }
          });
          return initial;
        });
      } else {
        throw new Error(data.message || 'Failed to load configuration');
      }
    } catch (err) {
      console.error('Failed to fetch form config', err);
      const urlParams = new URLSearchParams(window.location.search);
      const isPreview = urlParams.get('preview') === 'true';
      if (isPreview) {
        setError(err.message);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchConfig();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchConfig]);

  const handleNext = () => {
    if (isEditingFromReview) {
      setStep(config.steps.findIndex(s => s.type === 'review'));
      setIsEditingFromReview(false);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleEditFromReview = (targetStep) => {
    setIsEditingFromReview(true);
    setStep(targetStep);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/form/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          version: formVersion,
          device_info: navigator.userAgent,
          browser_info: navigator.vendor
        }),
      });
      const data = await response.json();
      if (data.success) setStep(config.steps.length - 1); // Jump to success
      else setSubmitError(data.message || 'Submission failed');
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const currentStepConfig = config.steps[step];

  const renderDynamicStep = () => {
    switch (currentStepConfig.type) {
      case 'hero': return <HeroStep onNext={handleNext} />;
      case 'form': {
        const field = currentStepConfig.fields[0];
        if (field.id === 'email') return <EmailStep value={formData.email} onChange={handleChange} onNext={handleNext} />;
        if (field.id === 'full_name') return <NameStep value={formData.full_name} onChange={handleChange} onNext={handleNext} />;
        if (field.id === 'designation') return <DesignationStep value={formData.designation} onChange={handleChange} onNext={handleNext} />;
        if (field.id === 'phone_number') return <PhoneStep value={formData.phone_number} onChange={handleChange} onNext={handleNext} />;
        if (field.id === 'organization_name') return <OrganizationStep value={formData.organization_name} onChange={handleChange} onNext={handleNext} />;
        if (field.id === 'selected_package') return <PackageSelectionStep value={formData.selected_package} onChange={handleChange} onNext={handleNext} />;
        if (field.id === 'custom_query') return <CustomQueryStep value={formData.custom_query} onChange={handleChange} onNext={handleNext} />;
        return null;
      }
      case 'event': {
        return <DynamicEventStep config={currentStepConfig} onNext={handleNext} />;
      }
      case 'review':
        return <FinalReviewStep formData={formData} onEdit={handleEditFromReview} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case 'success':
        return <SuccessStep />;
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    return (step / (config.steps.length - 1)) * 100;
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff', textAlign: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '400px' }}>
          <div style={{ color: '#ef4444', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Connection Failed</div>
          <p style={{ opacity: 0.8, marginBottom: '2rem', fontSize: '0.9rem' }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{ background: '#333' }}>Retry Connection</button>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
        <div className="loader-content">
          <div className="shimmer" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px' }}></div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, letterSpacing: '1px' }}>PREPARING EXPERIENCE...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="background-glow"></div>
      
      <header style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', position: 'absolute', top: 0, width: '100%', zIndex: 50 }}>
        <img src="https://thecsruniverse.com/assets/images/logo.png" alt="CSR" style={{ height: '35px' }} />
      </header>

      {step > 0 && step < config.steps.length - 1 && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${calculateProgress()}%` }}></div>
        </div>
      )}

      <main className="form-container">
        {submitError && <div style={{ color: 'red', marginBottom: '1rem' }}>{submitError}</div>}
        {renderDynamicStep()}
      </main>
    </div>
  );
};

export default FormEngine;
