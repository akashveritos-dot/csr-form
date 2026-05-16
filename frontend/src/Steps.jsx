import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Edit2 } from 'lucide-react';

export const StepContainer = ({ children }) => (
  <div className="step-wrapper">
    {children}
  </div>
);

const CountUp = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const duration = 1200; // 1.2 seconds for a snappier feel

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease out quad: f(t) = t(2-t)
      const easedPercentage = percentage * (2 - percentage);
      
      setCount(Math.floor(easedPercentage * end));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export const HeroStep = ({ onNext }) => (
  <StepContainer>
    <h1>Partner With Us</h1>
    <p>Amplify Your Social Impact Through India's Leading CSR & Sustainability Media Ecosystem</p>
    
    <div className="stats-container">
      <div className="stat-item">
        <div className="stat-number"><CountUp end={90000} suffix="+" /></div>
        <div className="stat-label">Website Visitors</div>
      </div>
      <div className="stat-item">
        <div className="stat-number"><CountUp end={75000} suffix="+" /></div>
        <div className="stat-label">Social Followers</div>
      </div>
      <div className="stat-item">
        <div className="stat-number"><CountUp end={115000} suffix="+" /></div>
        <div className="stat-label">Newsletter Subscribers</div>
      </div>
    </div>

    <button className="btn-primary" onClick={onNext} style={{ marginTop: '2rem' }}>
      Start Partnership Journey <ArrowRight size={20} style={{ marginLeft: '10px' }} />
    </button>
  </StepContainer>
);

export const EmailStep = ({ value, onChange, onNext }) => {
  const [error, setError] = useState('');
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleNext = () => {
    if (isValid) onNext();
    else setError('Please enter a valid email address');
  };

  return (
    <StepContainer>
      <h2>Enter Your Email Address</h2>
      <div className="input-group">
        <input 
          type="email" 
          className="input-field" 
          placeholder="name@company.com" 
          value={value} 
          onChange={(e) => { onChange('email', e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          autoFocus
        />
        {error && <span className="error-msg">{error}</span>}
      </div>
      <button className="btn-primary" onClick={handleNext} disabled={!isValid}>
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </button>
    </StepContainer>
  );
};

export const NameStep = ({ value, onChange, onNext }) => {
  const isValid = value.trim().length > 1;

  return (
    <StepContainer>
      <h2>What's Your Full Name?</h2>
      <div className="input-group">
        <input 
          type="text" 
          className="input-field" 
          placeholder="John Doe" 
          value={value} 
          onChange={(e) => onChange('full_name', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && isValid && onNext()}
          autoFocus
        />
      </div>
      <button className="btn-primary" onClick={onNext} disabled={!isValid}>
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </button>
    </StepContainer>
  );
};

export const DesignationStep = ({ value, onChange, onNext }) => {
  const isValid = value.trim().length > 1;

  return (
    <StepContainer>
      <h2>What's Your Designation?</h2>
      <p>e.g., CSR Head, Founder, Marketing Lead</p>
      <div className="input-group">
        <input 
          type="text" 
          className="input-field" 
          placeholder="Your Role" 
          value={value} 
          onChange={(e) => onChange('designation', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && isValid && onNext()}
          autoFocus
        />
      </div>
      <button className="btn-primary" onClick={onNext} disabled={!isValid}>
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </button>
    </StepContainer>
  );
};

export const PhoneStep = ({ value, onChange, onNext }) => {
  const isValid = value.trim().length >= 10;

  return (
    <StepContainer>
      <h2>Enter Your Phone Number</h2>
      <div className="input-group">
        <input 
          type="tel" 
          className="input-field" 
          placeholder="+91 9876543210" 
          value={value} 
          onChange={(e) => onChange('phone_number', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && isValid && onNext()}
          autoFocus
        />
      </div>
      <button className="btn-primary" onClick={onNext} disabled={!isValid}>
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </button>
    </StepContainer>
  );
};

export const OrganizationStep = ({ value, onChange, onNext }) => {
  const isValid = value.trim().length > 1;

  return (
    <StepContainer>
      <h2>Organisation / Company Name</h2>
      <div className="input-group">
        <input 
          type="text" 
          className="input-field" 
          placeholder="Company Ltd." 
          value={value} 
          onChange={(e) => onChange('organization_name', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && isValid && onNext()}
          autoFocus
        />
      </div>
      <button className="btn-primary" onClick={onNext} disabled={!isValid}>
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </button>
    </StepContainer>
  );
};

export const PackageSelectionStep = ({ value, onChange, onNext }) => {
  const packages = [
    {
      id: '1_month_coverage',
      title: '1 Month Coverage & Amplification',
      price: 'INR 15,000 + 18% GST',
      features: ['2 News', '1 Interview', 'Social Media Promotion', 'Newsletter Promotion']
    },
    {
      id: '2_month_coverage',
      title: '2 Months Coverage & Amplification',
      price: 'INR 25,000 + 18% GST',
      features: ['3 News', '1 Interview', '1 Case Study', 'Social Media Promotion', 'Newsletter Promotion']
    },
    {
      id: '4_month_coverage',
      title: '4 Months Coverage & Amplification',
      price: 'INR 40,000 + 18% GST',
      features: ['4 News', '1 Interview', '1 Opinion Piece', '1 Case Study', '1 Success Story', '1 Video Interview', 'Social Media Promotion', 'Newsletter Promotion', '1 Delegate Pass']
    },
    {
      id: '6_month_coverage',
      title: '6 Months Coverage & Amplification',
      price: 'INR 75,000 + 18% GST',
      features: ['6 News', '2 Interviews', '1 Opinion Piece', '2 Case Studies', '2 Success Stories', '1 Video Interview', 'Social Media Promotion', 'Newsletter Promotion', '2 Delegate Passes', '1 Standee Display']
    },
    {
      id: '12_month_coverage',
      title: '12 Months Coverage & Amplification',
      price: 'INR 1,25,000 + 18% GST',
      features: ['12 News', '2 Interviews', '4 Case Studies', '4 Success Stories', '1 Video Interview', 'Social Media Promotion', 'Newsletter Promotion', '3 Delegate Passes', '1 Panel Speaker Opportunity', '1 Standee Display', 'Logo Visibility on Event Collaterals']
    },
    {
      id: 'event_media_partnership',
      title: 'Event Media Partnership',
      price: 'INR 50,000 + 18% GST',
      features: ['Pre Event Coverage', 'During Event Coverage', 'Post Event Editorial Coverage', 'Event Ad Promotion']
    },
    {
      id: 'newsletter_banner_promotion',
      title: 'Newsletter Banner Promotion',
      price: 'INR 15,000 + 18% GST',
      features: ['Digital Banner', '1 Week Promotion']
    }
  ];

  return (
    <StepContainer>
      <h2>Select a Partnership Package</h2>
      <p>Choose the coverage plan that aligns with your goals.</p>
      
      <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px', width: '100%' }}>
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`package-card ${value === pkg.id ? 'selected' : ''}`}
            onClick={() => onChange('selected_package', pkg.id)}
          >
            <h3>{pkg.title}</h3>
            <div className="package-price">{pkg.price}</div>
            <ul className="package-features">
              {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={onNext} disabled={!value}>
        Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </button>
    </StepContainer>
  );
};

export const CustomQueryStep = ({ value, onChange, onNext }) => {
  return (
    <StepContainer>
      <h2>Exploring Customized Partnership?</h2>
      <p>Write your query or suggestions below (optional).</p>
      <div className="input-group">
        <textarea 
          className="input-field" 
          placeholder="I'm looking for..." 
          value={value} 
          onChange={(e) => onChange('custom_query', e.target.value)}
          autoFocus
        />
      </div>
      <button className="btn-primary" onClick={onNext}>
        Review Application <ArrowRight size={20} style={{ marginLeft: '10px' }} />
      </button>
    </StepContainer>
  );
};

export const FinalReviewStep = ({ formData, onEdit, onSubmit, isSubmitting }) => {
  const getPackageName = (id) => {
    const names = {
      '1_month_coverage': '1 Month Coverage & Amplification',
      '2_month_coverage': '2 Months Coverage & Amplification',
      '4_month_coverage': '4 Months Coverage & Amplification',
      '6_month_coverage': '6 Months Coverage & Amplification',
      '12_month_coverage': '12 Months Coverage & Amplification',
      'event_media_partnership': 'Event Media Partnership',
      'newsletter_banner_promotion': 'Newsletter Banner Promotion'
    };
    return names[id] || id;
  };

  const fields = [
    { label: 'Email', step: 1 },
    { label: 'Name', step: 2 },
    { label: 'Designation', step: 4 },
    { label: 'Phone', step: 5 },
    { label: 'Organisation', step: 6 },
    { label: 'Package', step: 8 },
    { label: 'Query', step: 9 }
  ];

  // Helper to get value
  const getFieldValue = (label) => {
    switch(label) {
      case 'Email': return formData.email;
      case 'Name': return formData.full_name;
      case 'Designation': return formData.designation;
      case 'Phone': return formData.phone_number;
      case 'Organisation': return formData.organization_name;
      case 'Package': return getPackageName(formData.selected_package);
      case 'Query': return formData.custom_query || 'None';
      default: return '';
    }
  };

  return (
    <StepContainer>
      <h2>Review Your Details</h2>
      <p>Please confirm your information before submitting.</p>
      
      <div style={{ width: '100%', marginBottom: '2rem' }}>
        {fields.map((item, index) => (
          <div className="review-item" key={index}>
            <div className="review-content">
              <div className="review-label">{item.label}</div>
              <div className="review-value">{getFieldValue(item.label) || 'Not provided'}</div>
            </div>
            <button className="btn-secondary" onClick={() => onEdit(item.step)} style={{ padding: '0.5rem', border: 'none' }}>
              <Edit2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
      </button>
    </StepContainer>
  );
};

export const DynamicEventStep = ({ config, onNext }) => {
  return (
    <StepContainer>
      <div className="event-showcase">
        <div className="event-tag">{config.tag || 'Special Event'}</div>
        <h1>{config.title || 'Event Showcase'}</h1>
        {config.subtitle && <p className="event-subtitle">{config.subtitle}</p>}
        
        <div style={{ position: 'relative', width: '100%', margin: '1.5rem 0', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', background: '#f8fafc' }}>
          <img 
            src={config.image ? config.image.replace(/'/g, '%27') : 'https://via.placeholder.com/800x400'} 
            alt="Hero"
            style={{ width: '100%', height: 'auto', display: 'block', minHeight: '200px', objectFit: 'cover' }}
            onError={(e) => { 
              console.error('Image Load Failed. Attempted URL:', e.target.src);
              e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found'; 
            }}
          />
        </div>

        <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '2rem' }}>
          {config.description || 'Discover our impact through this national flagship event.'}
        </p>

        {config.images && config.images.length > 0 && (
          <div className="event-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {config.images.map((img, idx) => (
              img && (
                <div key={idx} style={{ 
                  aspectRatio: '1', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#1e293b'
                }}>
                  <img 
                    src={img.replace(/'/g, '%27')} 
                    alt={`Gallery ${idx}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Error'; }}
                  />
                </div>
              )
            ))}
          </div>
        )}

        <button className="btn-primary" onClick={onNext} style={{ width: '100%', justifyContent: 'center' }}>
          Continue <ArrowRight size={20} style={{ marginLeft: '10px' }} />
        </button>
      </div>
    </StepContainer>
  );
};

export const SuccessStep = () => {
  return (
    <StepContainer>
      <div className="success-check">
        <CheckCircle size={40} />
      </div>
      <h2 style={{ textAlign: 'center' }}>Let's Build Meaningful Impact Together</h2>
      <p style={{ textAlign: 'center' }}>We have received your partnership request and will get back to you shortly.</p>
      <button className="btn-primary" onClick={() => window.location.reload()}>
        Return to Homepage
      </button>
    </StepContainer>
  );
};
