import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const FormEngine = () => {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isEditingFromReview, setIsEditingFromReview] = useState(false);
  const [formData, setFormData] = useState({});
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
        const initial = {};
        data.config.steps.forEach(s => {
          if (s.fields) s.fields.forEach(f => initial[f.id] = '');
        });
        setFormData(initial);
      } else {
        throw new Error(data.message || 'Failed to load configuration');
      }
    } catch (err) {
      console.error('Failed to fetch form config', err);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchConfig();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchConfig]);

  const handleNext = () => {
    setDirection(1);
    if (step === 0) {
      setStep(1);
      return;
    }
    if (isEditingFromReview) {
      setStep(config.steps.findIndex(s => s.type === 'review'));
      setIsEditingFromReview(false);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(prev => prev - 1);
      setIsEditingFromReview(false);
    }
  };

  const handleEditFromReview = (targetStep) => {
    setIsEditingFromReview(true);
    setDirection(-1);
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
      if (data.success) {
        setDirection(1);
        if (config) {
          setStep(config.steps.length - 1); // Jump to success
        } else {
          setStep(prev => prev + 1);
        }
      }
      else setSubmitError(data.message || 'Submission failed');
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step > 0) {
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
            <div className="premium-spinner"></div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--primary-color)' }}>PREPARING EXPERIENCE...</div>
          </div>
        </div>
      );
    }
  }

  const renderDynamicStep = () => {
    if (step === 0) {
      return <HeroStep onNext={handleNext} />;
    }

    if (!config) return null;

    const currentStepConfig = config.steps[step];
    const totalSteps = config.steps.length - 1; // Exclude success step in index counts for clean visual tracking

    switch (currentStepConfig.type) {
      case 'hero': return <HeroStep onNext={handleNext} />;
      case 'form': {
        const field = currentStepConfig.fields[0];
        if (field.id === 'email') return <EmailStep value={formData.email} onChange={handleChange} onNext={handleNext} onBack={handleBack} index={step} totalSteps={totalSteps} />;
        if (field.id === 'full_name') return <NameStep value={formData.full_name} onChange={handleChange} onNext={handleNext} onBack={handleBack} index={step} totalSteps={totalSteps} />;
        if (field.id === 'designation') return <DesignationStep value={formData.designation} formData={formData} onChange={handleChange} onNext={handleNext} onBack={handleBack} index={step} totalSteps={totalSteps} />;
        if (field.id === 'phone_number') return <PhoneStep value={formData.phone_number} formData={formData} onChange={handleChange} onNext={handleNext} onBack={handleBack} index={step} totalSteps={totalSteps} />;
        if (field.id === 'organization_name') return <OrganizationStep value={formData.organization_name} formData={formData} onChange={handleChange} onNext={handleNext} onBack={handleBack} index={step} totalSteps={totalSteps} />;
        if (field.id === 'selected_package') return <PackageSelectionStep value={formData.selected_package} formData={formData} onChange={handleChange} onNext={handleNext} onBack={handleBack} index={step} totalSteps={totalSteps} />;
        if (field.id === 'custom_query') return <CustomQueryStep value={formData.custom_query} formData={formData} onChange={handleChange} onNext={handleNext} onBack={handleBack} index={step} totalSteps={totalSteps} />;
        return null;
      }
      case 'event': {
        return <DynamicEventStep config={currentStepConfig} onNext={handleNext} onBack={handleBack} index={step} totalSteps={totalSteps} />;
      }
      case 'review':
        return <FinalReviewStep formData={formData} onEdit={handleEditFromReview} onSubmit={handleSubmit} isSubmitting={isSubmitting} onBack={handleBack} index={step} totalSteps={totalSteps} />;
      case 'success':
        return <SuccessStep />;
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    if (!config) return 0;
    return (step / (config.steps.length - 1)) * 100;
  };

  // Custom slide-fade variants for Step wizard
  const pageVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.97
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.3 }
      }
    },
    exit: (dir) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.3 }
      }
    })
  };

  return (
    <div className="app-container">
      {/* Background ambient animation blobs */}
      <div className="blob-container">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-2"></div>
        <div className="glow-blob blob-3"></div>
      </div>
      
      <div className="background-glow"></div>
      
      <header className="app-header">
        <img src="https://thecsruniverse.com/assets/images/logo.png" alt="CSR Universe logo" className="app-logo" />
      </header>

      {config && step > 0 && step < config.steps.length - 1 && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${calculateProgress()}%` }}></div>
        </div>
      )}

      <main className="form-container">
        {submitError && <div className="error-msg" style={{ margin: '0 auto 1.5rem', justifyContent: 'center' }}>⚠️ {submitError}</div>}
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="step-wrapper"
          >
            {renderDynamicStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default FormEngine;
